"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { BusinessPlanOutput, businessPlanApi } from "@/lib/api/businessPlan";
import { creditsApi } from "@/lib/api/credits";
import { downloadBusinessPlanDocxV2 } from "@/lib/utils/docxGeneratorV2";
import StepByStepWizard, {
  WizardData,
} from "@/components/wizard/StepByStepWizard";
import SimpleInputForm, {
  SimpleInputData,
} from "@/components/wizard/SimpleInputForm";
import PreviewDocument from "@/components/wizard/PreviewDocument";
import PaymentModal from "@/components/wizard/PaymentModal";
import styles from "./page.module.css";

// 흐름: 랜딩 -> 간단입력 -> 미리보기 -> (로그인/결제) -> 전체작성 -> 생성중 -> 완료
type WizardStep =
  | "landing"
  | "simple_input"
  | "preview"
  | "step_input"
  | "generating"
  | "complete";

function WizardPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, credits, useCredit, addCredits, fetchCredits } = useAuthStore();

  const [step, setStep] = useState<WizardStep>("landing");
  const [simpleData, setSimpleData] = useState<SimpleInputData | null>(null);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [result, setResult] = useState<BusinessPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingWizardData, setPendingWizardData] = useState<WizardData | null>(
    null
  ); // 결제 대기 중인 데이터

  // 랜딩 -> 간단 입력 (누구나 가능)
  const handleStart = useCallback(() => {
    setStep("simple_input");
  }, []);

  // 간단 입력 완료 -> 미리보기
  const handleSimpleInputSubmit = useCallback((data: SimpleInputData) => {
    setSimpleData(data);
    setStep("preview");
  }, []);

  // 미리보기에서 전체 보고서 잠금 해제 요청
  const handleUnlockFullReport = useCallback(() => {
    if (!user) {
      // 로그인 안 됨 -> 로그인 페이지로 이동
      router.push("/login?redirect=/project/wizard");
      return;
    }

    // 로그인 됨 + 이용권 없음 -> 결제 모달
    if (credits <= 0) {
      setShowPaymentModal(true);
      return;
    }

    // 이용권 있음 -> 전체 작성 진입
    setStep("step_input");
  }, [user, credits, router]);

  // 결제 완료 시 이용권 잔액 다시 조회 후 작성 진입 또는 생성 재시도
  const handlePaymentComplete = useCallback(async (creditsAdded: number = 1) => {
    // 백엔드에서 실제 이용권 잔액 다시 조회
    try {
      await fetchCredits();
    } catch {
      // 조회 실패 시 로컬로 추가 (fallback)
      addCredits(creditsAdded);
    }
    
    setShowPaymentModal(false);
    setError(null);

    // 결제 대기 중인 완료된 데이터가 있으면 바로 생성 재시도
    if (pendingWizardData) {
      // 약간의 딜레이 후 생성 재시도 (상태 업데이트 반영을 위해)
      setTimeout(() => {
        generateBusinessPlan(pendingWizardData);
      }, 100);
    } else {
      // 없으면 기존 작성 단계로 진입
      setStep("step_input");
    }
  }, [addCredits, fetchCredits, pendingWizardData]);

  // 사업계획서 생성 함수 (재사용 가능하도록 분리)
  const generateBusinessPlan = useCallback(
    async (data: WizardData) => {
      setWizardData(data);
      setPendingWizardData(null); // 대기 데이터 초기화
      setStep("generating");
      setError(null);

      try {
        // 1. AI API를 호출하여 사업계획서 생성
        const response = await fetch("/api/ai/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wizardData: data }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "AI 사업계획서 생성에 실패했습니다.");
        }

        const { output } = await response.json();

        let savedPlanId: string | undefined;

        // 2. 백엔드에 사업계획서 저장 (먼저 저장해서 ID 획득)
        if (user) {
          try {
            const companyName =
              output.sections?.generalStatus?.data?.companyName;
            const savedPlan = await businessPlanApi.create({
              title: companyName
                ? `${companyName} 사업계획서`
                : output.documentTitle || "새 사업계획서",
              grantId: searchParams.get("grantId") || undefined,
              data: output,
            });
            savedPlanId = savedPlan.id;
            console.log("사업계획서 저장 완료:", savedPlan.id);
          } catch (saveError) {
            console.error("사업계획서 저장 실패:", saveError);
            // 저장 실패해도 결과는 보여주되 경고만 표시
          }
        }

        // 3. 백엔드에서 이용권 사용 (차감) - businessPlanId 포함
        if (user) {
          try {
            await creditsApi.use("사업계획서 생성", savedPlanId);
          } catch (creditError) {
            console.error("이용권 차감 실패:", creditError);
            setError("이용권이 부족합니다. 결제 후 다시 시도해주세요.");
            setPendingWizardData(data); // 데이터 저장
            setShowPaymentModal(true);
            setStep("step_input");
            return;
          }
        }

        setResult(output);
        setStep("complete");
      } catch (err) {
        console.error("AI 사업계획서 생성 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : "사업계획서 생성 중 오류가 발생했습니다. 다시 시도해주세요."
        );
        setStep("step_input");
      }
    },
    [user, searchParams]
  );

  // 위자드 완료 -> 생성 시도
  const handleWizardComplete = useCallback(
    async (data: WizardData) => {
      await generateBusinessPlan(data);
    },
    [generateBusinessPlan]
  );

  // Word 파일 다운로드
  const handleDownload = useCallback(async () => {
    if (!result) return;
    try {
      await downloadBusinessPlanDocxV2(result);
    } catch (err) {
      console.error("다운로드 오류:", err);
      setError("파일 다운로드 중 오류가 발생했습니다.");
    }
  }, [result]);

  // 처음으로 돌아가기
  const handleReset = useCallback(() => {
    setStep("landing");
    setSimpleData(null);
    setWizardData({});
    setResult(null);
    setError(null);
    setPendingWizardData(null);
  }, []);

  // 다시 수정하기
  const handleEdit = useCallback(() => {
    setStep("step_input");
    setResult(null);
  }, []);

  // 서브타이틀 텍스트
  const getSubtitle = () => {
    switch (step) {
      case "landing":
        return "예비창업패키지 사업계획서를 AI와 함께 만들어보세요.";
      case "simple_input":
        return "간단한 아이디어만 입력하면 AI가 초안을 만들어드립니다.";
      case "preview":
        return "AI가 생성한 사업계획서 초안입니다. 전체 보고서를 확인해보세요!";
      case "step_input":
        return "질문에 답변하며 사업계획서를 완성하세요.";
      case "generating":
        return "사업계획서를 생성하고 있습니다...";
      case "complete":
        return "사업계획서가 완성되었습니다!";
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>AI 사업계획서 작성</h1>
        <p className={styles.subtitle}>{getSubtitle()}</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className={styles.errorMessage}>
          <span>⚠️</span> {error}
          {pendingWizardData && (
            <p
              style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.9 }}
            >
              작성하신 내용은 저장되어 있습니다. 결제 후 자동으로 생성됩니다.
            </p>
          )}
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className={styles.content}>
        {/* Step 0: 랜딩 */}
        {step === "landing" && (
          <div className={styles.landingSection}>
            <div className={styles.landingContent}>
              <div className={styles.landingIcon}>📝</div>
              <h2>예비창업패키지 사업계획서 작성</h2>
              <p>
                간단한 아이디어만 입력하면 AI가 사업계획서 초안을 무료로
                만들어드립니다.
                <br />
                마음에 드시면 전체 사업계획서를 받아보세요!
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✨</span>
                  <span>3가지 정보만 입력하면 무료 초안 제공</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🤖</span>
                  <span>AI가 전문적인 사업계획서 작성</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📄</span>
                  <span>Word 파일로 바로 다운로드</span>
                </div>
              </div>

              <button className={styles.startButton} onClick={handleStart}>
                무료로 초안 만들어보기 ✨
              </button>

              <p className={styles.loginHint}>
                로그인 없이도 무료 초안을 확인할 수 있어요!
              </p>
            </div>
          </div>
        )}

        {/* Step 1: 간단 입력 */}
        {step === "simple_input" && (
          <SimpleInputForm onSubmit={handleSimpleInputSubmit} />
        )}

        {/* Step 2: 미리보기 */}
        {step === "preview" && (
          <div className={styles.previewWrapper}>
            <PreviewDocument
              data={simpleData || undefined}
              isLocked={true}
              onUnlock={handleUnlockFullReport}
            />
            <div className={styles.previewActions}>
              <button
                className={styles.unlockButton}
                onClick={handleUnlockFullReport}
              >
                {!user
                  ? "로그인하고 전체 보고서 받기 🔓"
                  : credits > 0
                  ? "전체 사업계획서 작성하기 📄"
                  : "이용권 구매하고 전체 보고서 받기 💳"}
              </button>
              <button
                className={styles.backButton}
                onClick={() => setStep("simple_input")}
              >
                ← 다시 입력하기
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 전체 단계별 입력 */}
        {step === "step_input" && (
          <StepByStepWizard
            onComplete={handleWizardComplete}
            initialData={wizardData}
          />
        )}

        {/* Step 2: 생성 중 */}
        {step === "generating" && (
          <div className={styles.generatingSection}>
            <div className={styles.spinner} />
            <h2>사업계획서를 생성하고 있습니다</h2>
            <p>입력하신 정보를 바탕으로 문서를 구성하고 있습니다...</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        )}

        {/* Step 3: 완료 */}
        {step === "complete" && result && (
          <div className={styles.completeSection}>
            <div className={styles.successIcon}>✓</div>
            <h2>사업계획서가 완성되었습니다!</h2>
            <p className={styles.documentTitle}>{result.documentTitle}</p>

            <div className={styles.completeActions}>
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
              >
                📥 Word 파일 다운로드
              </button>
              <button className={styles.editButton} onClick={handleEdit}>
                ✏️ 내용 수정하기
              </button>
              <button className={styles.resetButton} onClick={handleReset}>
                🔄 새로 작성하기
              </button>
            </div>

            {/* 생성된 문서 미리보기 */}
            <div className={styles.resultPreview}>
              <h3>📋 문서 구성</h3>
              <ul className={styles.sectionList}>
                <li>
                  <span className={styles.sectionIcon}>📌</span>
                  {result.sections.generalStatus.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>📝</span>
                  {result.sections.summary.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>🔍</span>
                  {result.sections.problem.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>💡</span>
                  {result.sections.solution.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>📈</span>
                  {result.sections.scaleup.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>👥</span>
                  {result.sections.team.title}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 결제 모달 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

// Suspense로 감싸서 useSearchParams 에러 해결
export default function WizardPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.generatingSection}>
            <div className={styles.spinner} />
            <p>로딩 중...</p>
          </div>
        </div>
      }
    >
      <WizardPageContent />
    </Suspense>
  );
}
