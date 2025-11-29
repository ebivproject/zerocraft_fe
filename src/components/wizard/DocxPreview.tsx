"use client";

import { useState, useEffect } from "react";
import mammoth from "mammoth";
import styles from "./DocxPreview.module.css";

export interface DocxPreviewProps {
  onPaymentClick: () => void;
}

export default function DocxPreview({ onPaymentClick }: DocxPreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocx() {
      try {
        setLoading(true);
        const response = await fetch("/example.docx");
        if (!response.ok) {
          throw new Error("파일을 불러올 수 없습니다.");
        }
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
      } catch (err) {
        console.error("DOCX 로드 오류:", err);
        setError("문서를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadDocx();
  }, []);

  return (
    <div className={styles.container}>
      {/* 히어로 섹션 */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <SparkleIcon width={44} height={44} />
        </div>
        <h1 className={styles.heroTitle}>AI로 사업계획서 만들기</h1>
        <p className={styles.heroDesc}>
          몇 가지 질문에 답하면 AI가 전문적인 사업계획서를 작성해드립니다
        </p>
        <button className={styles.heroButton} onClick={onPaymentClick}>
          지금 바로 시작하기
        </button>
        <div className={styles.features}>
          <span className={styles.feature}>
            <CheckIcon /> 예비창업패키지 맞춤
          </span>
          <span className={styles.feature}>
            <CheckIcon /> Word 파일 다운로드
          </span>
          <span className={styles.feature}>
            <CheckIcon /> 5분만에 완성
          </span>
        </div>
      </section>

      {/* 샘플 섹션 */}
      <section className={styles.sampleSection}>
        <div className={styles.sampleLabel}>
          <DocumentIcon />
          이런 사업계획서가 만들어집니다
        </div>

        <div className={styles.sampleDocument}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner} />
              <p>샘플을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.errorWrapper}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className={styles.documentHeader}>
                <span className={styles.sampleBadge}>샘플</span>
                <h2 className={styles.documentTitle}>
                  예비창업패키지 사업계획서
                </h2>
              </div>
              <div
                className={styles.documentContent}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </>
          )}
        </div>
      </section>

      {/* 하단 CTA 섹션 */}
      <section className={styles.bottomCta}>
        <p className={styles.bottomCtaText}>마음에 드셨나요?</p>
        <button className={styles.bottomCtaButton} onClick={onPaymentClick}>
          <SparkleIcon width={20} height={20} />내 사업계획서 만들기
        </button>
      </section>
    </div>
  );
}

function SparkleIcon({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
