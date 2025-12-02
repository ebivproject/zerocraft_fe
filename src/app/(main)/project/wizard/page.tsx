"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { BusinessPlanOutput, businessPlanApi } from "@/lib/api/businessPlan";
import { downloadBusinessPlanDocxV2 } from "@/lib/utils/docxGeneratorV2";
import StepByStepWizard, {
  WizardData,
} from "@/components/wizard/StepByStepWizard";
import DocxPreview from "@/components/wizard/DocxPreview";
import PaymentModal from "@/components/wizard/PaymentModal";
import styles from "./page.module.css";

// 흐름: 샘플미리보기 -> (로그인/결제) -> 전체작성 -> 생성중 -> 완료
type WizardStep = "sample_preview" | "step_input" | "generating" | "complete";

function WizardPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, addCredits, fetchCredits, resetAiHints } = useAuthStore();

  const [step, setStep] = useState<WizardStep>("sample_preview");
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [result, setResult] = useState<BusinessPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingWizardData, setPendingWizardData] = useState<WizardData | null>(
    null
  );

  // 결제/시작 버튼 클릭 핸들러
  const handlePaymentClick = useCallback(async () => {
    if (!user) {
      // 로그인 안 됨 -> 로그인 페이지로 이동
      router.push("/login?redirect=/project/wizard");
      return;
    }

    // 백엔드에서 최신 이용권 정보 확인
    try {
      await fetchCredits();
    } catch (e) {
      console.error("이용권 조회 실패:", e);
    }

    // fetchCredits 후 최신 상태 확인
    const currentCredits = useAuthStore.getState().credits;

    // 로그인 됨 + 이용권 없음 -> 결제 모달
    if (currentCredits <= 0) {
      setShowPaymentModal(true);
      return;
    }

    // 이용권 있음 -> 전체 작성 진입 (AI 힌트 리셋)
    resetAiHints();
    setStep("step_input");
  }, [user, router, fetchCredits, resetAiHints]);

  // 결제 완료 시 이용권 잔액 다시 조회 후 작성 진입 또는 생성 재시도
  const handlePaymentComplete = useCallback(
    async (creditsAdded: number = 1) => {
      // 백엔드에서 실제 이용권 잔액 다시 조회
      try {
        await fetchCredits();
      } catch {
        // 조회 실패 시 로컬로 추가 (fallback)
        addCredits(creditsAdded);
      }

      setShowPaymentModal(false);
      setError(null);

      // 결제 완료 시 AI 힌트 리셋
      resetAiHints();

      // 결제 대기 중인 완료된 데이터가 있으면 바로 생성 재시도
      if (pendingWizardData) {
        setTimeout(() => {
          generateBusinessPlan(pendingWizardData);
        }, 100);
      } else {
        // 없으면 작성 단계로 진입
        setStep("step_input");
      }
    },
    [addCredits, fetchCredits, pendingWizardData, resetAiHints]
  );

  // 사업계획서 생성 함수
  const generateBusinessPlan = useCallback(
    async (data: WizardData) => {
      setWizardData(data);
      setPendingWizardData(null);
      setError(null);

      // 1. 먼저 이용권 체크 (생성 전에 확인) - 최신 상태 사용
      const currentCredits = useAuthStore.getState().credits;
      if (user && currentCredits <= 0) {
        setError("이용권이 부족합니다. 결제 후 다시 시도해주세요.");
        setPendingWizardData(data);
        setShowPaymentModal(true);
        return;
      }

      setStep("generating");

      try {
        // 2. AI API를 호출하여 사업계획서 생성
        const response = await fetch("/api/ai/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wizardData: data }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "AI 사업계획서 생성에 실패했습니다."
          );
        }

        const { output } = await response.json();

        let savedPlanId: string | undefined;

        // 3. 백엔드에 사업계획서 저장
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
              useCredit: true, // 백엔드에서 크레딧 차감
            });
            savedPlanId = savedPlan.id;
            console.log("사업계획서 저장 완료:", savedPlan.id);
          } catch (saveError) {
            console.error("사업계획서 저장 실패:", saveError);
          }
        }

        // 4. 이용권 잔액 새로고침 (백엔드에서 이미 차감됨)
        if (user) {
          await fetchCredits();
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
    [user, searchParams, fetchCredits]
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
    setStep("sample_preview");
    setWizardData({});
    setResult(null);
    setError(null);
    setPendingWizardData(null);
  }, []);

  // 서브타이틀 텍스트
  const getSubtitle = () => {
    switch (step) {
      case "sample_preview":
        return "AI가 작성한 사업계획서 샘플을 확인해보세요.";
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
        {/* 샘플 미리보기 */}
        {step === "sample_preview" && (
          <DocxPreview onPaymentClick={handlePaymentClick} />
        )}

        {/* 전체 단계별 입력 */}
        {step === "step_input" && (
          <StepByStepWizard
            onComplete={handleWizardComplete}
            initialData={wizardData}
          />
        )}

        {/* 생성 중 */}
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

        {/* 완료 */}
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
                Word 파일 다운로드
              </button>
              <button className={styles.resetButton} onClick={handleReset}>
                새로 작성하기
              </button>
            </div>

            {/* 생성된 문서 미리보기 */}
            <div className={styles.resultPreview}>
              <h3>문서 구성</h3>
              <ul className={styles.sectionList}>
                <li>
                  <span className={styles.sectionIcon}>1</span>
                  {result.sections.generalStatus.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>2</span>
                  {result.sections.summary.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>3</span>
                  {result.sections.problem.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>4</span>
                  {result.sections.solution.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>5</span>
                  {result.sections.scaleup.title}
                </li>
                <li>
                  <span className={styles.sectionIcon}>6</span>
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
