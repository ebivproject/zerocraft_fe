"use client";

import { useState } from "react";
import { SimpleInputData } from "./SimpleInputForm";
import styles from "./PreviewDocument.module.css";

export interface PreviewDocumentProps {
  onUnlock: () => void;
  isLocked: boolean;
  data?: SimpleInputData;
}

type Tab = "summary" | "market" | "strategy" | "financial";

export default function PreviewDocument({
  onUnlock,
  isLocked,
  data,
}: PreviewDocumentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  // 입력 데이터가 없으면 기본 텍스트 표시
  const displayData = {
    itemName: data?.itemName || "아이템명",
    category: data?.category || "카테고리",
    overview: data?.overview || "아이템에 대한 설명이 들어갑니다.",
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      {/* 탭 네비게이션 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "summary" ? styles.active : ""}`}
          onClick={() => handleTabChange("summary")}
        >
          📝 사업 개요 (요약)
        </button>
        <button
          className={`${styles.tab} ${activeTab === "market" ? styles.active : ""}`}
          onClick={() => handleTabChange("market")}
        >
          📊 시장 분석 {isLocked && <LockIcon className={styles.lockIcon} />}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "strategy" ? styles.active : ""}`}
          onClick={() => handleTabChange("strategy")}
        >
          🚀 사업화 전략 {isLocked && <LockIcon className={styles.lockIcon} />}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "financial" ? styles.active : ""}`}
          onClick={() => handleTabChange("financial")}
        >
          💰 자금 계획 {isLocked && <LockIcon className={styles.lockIcon} />}
        </button>
      </div>

      {/* 문서 본문 */}
      <div className={styles.documentContent}>
        {/* 헤더 (모든 탭 공통) */}
        <div className={styles.documentHeader}>
          <h1 className={styles.documentTitle}>{displayData.itemName}</h1>
          <p className={styles.documentSubtitle}>
            [ {displayData.category} ] 분야 혁신 성장 사업계획서
          </p>
        </div>

        {/* 탭 1: 사업 개요 (무료 공개) */}
        {activeTab === "summary" && (
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>1. 창업 아이템 개요</h2>

            <div className={styles.card}>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>제품명</span>
                <span className={styles.cardValue}>{displayData.itemName}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>핵심 분야</span>
                <span className={styles.cardValue}>{displayData.category}</span>
              </div>
            </div>

            <h2 className={styles.sectionTitle}>2. 핵심 가치 제안</h2>
            <div className={styles.prose}>
              <p>
                본 사업은 <span className={styles.highlight}>{displayData.category}</span> 시장의
                고질적인 문제를 해결하기 위해 기획되었습니다.
                우리의 핵심 솔루션인 <strong>'{displayData.itemName}'</strong>은(는)
                다음과 같은 혁신적인 가치를 제공합니다.
              </p>
              <br />
              <p>
                "{displayData.overview}"
              </p>
              <br />
              <p>
                이를 통해 기존 솔루션 대비 <strong>획기적인 효율성 증대</strong>와
                <strong>사용자 경험 개선</strong>을 달성하며,
                향후 해당 시장의 새로운 표준(New Standard)으로 자리매김할 것입니다.
              </p>
            </div>
          </div>
        )}

        {/* 탭 2, 3, 4: 잠긴 섹션 (결제 유도) */}
        {activeTab !== "summary" && (
          <div className={styles.lockedSection}>
            {/* 블러 처리된 더미 콘텐츠 */}
            <div className={styles.blurredContent}>
              <h2 className={styles.dummyTitle}>
                {activeTab === "market" && "3. 시장 현황 및 경쟁사 분석"}
                {activeTab === "strategy" && "4. 비즈니스 모델 및 마케팅 전략"}
                {activeTab === "financial" && "5. 소요 자금 및 조달 계획"}
              </h2>
              <div className={styles.dummyText}>
                <p>본 시장의 연평균 성장률(CAGR)은 15.4%로 추정되며, 주요 경쟁사 분석 결과...</p>
                <p>타겟 고객층인 2030 세대를 공략하기 위한 디지털 마케팅 전략 수립...</p>
                <p>초기 개발비 5,000만원, 마케팅비 3,000만원 등 총 1억원의 자금 소요...</p>
                <p>손익분기점(BEP) 달성 시점은 서비스 런칭 후 12개월로 예상되며...</p>
                <br />
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              </div>
            </div>

            {/* 잠금 오버레이 */}
            {isLocked && (
              <div className={styles.overlay}>
                <div className={styles.ctaBox}>
                  <div className={styles.ctaIcon}>
                    <LockIcon width={24} height={24} />
                  </div>
                  <h3 className={styles.ctaTitle}>전체 내용을 확인하세요</h3>
                  <p className={styles.ctaDesc}>
                    시장 분석, 사업화 전략, 자금 계획 등<br />
                    투자자를 설득할 <strong>상세 본문(15p)</strong>을 지금 바로 생성하세요.
                  </p>
                  <button className={styles.unlockButton} onClick={onUnlock}>
                    <UnlockIcon /> 전체 리포트 생성하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LockIcon({ className, width = 16, height = 16 }: { className?: string, width?: number, height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UnlockIcon() {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
