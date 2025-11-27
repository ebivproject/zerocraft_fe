"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { BusinessPlanOutput } from "@/lib/api/businessPlan";
import { downloadBusinessPlanDocxV2 } from "@/lib/utils/docxGeneratorV2";
import { convertWizardDataToOutput } from "@/lib/utils/wizardDataConverter";
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
  const { user, credits, useCredit, addCredits } = useAuthStore();

  const [step, setStep] = useState<WizardStep>("landing");
  const [simpleData, setSimpleData] = useState<SimpleInputData | null>(null);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [result, setResult] = useState<BusinessPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  // 결제 완료 시 이용권 1회 추가 후 작성 진입
  const handlePaymentComplete = useCallback(() => {
    addCredits(1); // 이용권 1회 추가
    setShowPaymentModal(false);
    setStep("step_input");
  }, [addCredits]);

  // 위자드 완료 -> 변환 및 생성 (이용권 차감)
  const handleWizardComplete = useCallback(
    async (data: WizardData) => {
      // 이용권 차감
      const success = useCredit();
      if (!success) {
        setError("이용권이 부족합니다. 결제 후 다시 시도해주세요.");
        setShowPaymentModal(true);
        return;
      }

      setWizardData(data);
      setStep("generating");
      setError(null);

      try {
        // WizardData를 BusinessPlanOutput으로 변환
        const output = convertWizardDataToOutput(data);

        // 약간의 딜레이 (UX)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setResult(output);
        setStep("complete");
      } catch (err) {
        console.error("변환 오류:", err);
        setError("사업계획서 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        // 오류 발생 시 이용권 복구
        addCredits(1);
        setStep("step_input");
      }
    },
    [useCredit, addCredits]
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
