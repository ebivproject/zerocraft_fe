"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BusinessPlanOutput } from "@/lib/api/businessPlan";
import { downloadBusinessPlanDocxV2 } from "@/lib/utils/docxGeneratorV2";
import { convertWizardDataToOutput } from "@/lib/utils/wizardDataConverter";
import StepByStepWizard, {
  WizardData,
} from "@/components/wizard/StepByStepWizard";
import styles from "./page.module.css";

// 흐름: 랜딩 -> 단계별 입력 -> 생성 중 -> 완료
type WizardStep = "landing" | "step_input" | "generating" | "complete";

function WizardPageContent() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState<WizardStep>("landing");
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [result, setResult] = useState<BusinessPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 랜딩 -> 단계별 입력
  const handleStart = useCallback(() => {
    setStep("step_input");
  }, []);

  // 위자드 완료 -> 변환 및 생성
  const handleWizardComplete = useCallback(async (data: WizardData) => {
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
      setStep("step_input");
    }
  }, []);

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
    setWizardData({});
    setResult(null);
    setError(null);
  }, []);

  // 다시 수정하기
  const handleEdit = useCallback(() => {
    setStep("step_input");
    setResult(null);
  }, []);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>AI 사업계획서 작성</h1>
        <p className={styles.subtitle}>
          {step === "landing" &&
            "예비창업패키지 사업계획서를 AI와 함께 만들어보세요."}
          {step === "step_input" && "질문에 답변하며 사업계획서를 완성하세요."}
          {step === "generating" && "사업계획서를 생성하고 있습니다..."}
          {step === "complete" && "사업계획서가 완성되었습니다!"}
        </p>
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
                24개의 질문에 답변하면 AI가 전문적인 사업계획서를
                작성해드립니다.
                <br />각 질문에는 AI 자동 생성 기능이 포함되어 있어 쉽게 작성할
                수 있습니다.
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✅</span>
                  <span>예비창업패키지 양식에 최적화</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🤖</span>
                  <span>AI 자동 생성으로 빠른 작성</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📄</span>
                  <span>Word 파일로 바로 다운로드</span>
                </div>
              </div>

              <button className={styles.startButton} onClick={handleStart}>
                사업계획서 작성 시작하기 🚀
              </button>
            </div>
          </div>
        )}

        {/* Step 1: 단계별 입력 */}
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
