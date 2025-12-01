"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import PaymentModal from "@/components/wizard/PaymentModal";
import styles from "./page.module.css";

interface Plan {
  id: string;
  name: string;
  price: number | null;
  priceLabel?: string;
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "credit-1",
    name: "이용권 구매",
    price: 50000,
    description: "AI 사업계획서 1회 생성",
    features: [
      "AI 사업계획서 생성 1회",
      "정부지원사업 맞춤형 작성",
      "DOCX 다운로드",
      "AI 힌트 20회 제공",
      "쿠폰 사용 가능",
    ],
    badge: "추천",
    highlight: true,
  },
  {
    id: "expert-consultation",
    name: "전문가 상담",
    price: null,
    priceLabel: "별도 문의",
    description: "전문가 1:1 맞춤 컨설팅",
    features: [
      "전문 컨설턴트 1:1 상담",
      "사업계획서 심층 피드백",
      "정부지원사업 전략 수립",
      "이용권 1매 무료 증정",
      "맞춤형 사업 분석 리포트",
    ],
    badge: "Premium",
  },
];

const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_Ejxcxns/chat";

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated, addCredits } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === "expert-consultation") {
      // 전문가 상담: 카카오톡 채널로 이동
      window.open(KAKAO_CHANNEL_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }

    // 이용권 구매: PaymentModal 열기
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (creditsAdded: number) => {
    addCredits(creditsAdded);
    setShowPaymentModal(false);
    // 결제 완료 후 AI 사업계획서 페이지로 이동
    router.push("/project/wizard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>요금제</h1>
        <p className={styles.subtitle}>
          AI 사업계획서로 정부지원사업에 도전하세요
        </p>
      </div>

      <div className={styles.plansGrid}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ""} ${plan.id === "expert-consultation" ? styles.enterprise : ""}`}
          >
            {plan.badge && (
              <div
                className={`${styles.badge} ${plan.id === "expert-consultation" ? styles.badgePremium : ""}`}
              >
                {plan.badge}
              </div>
            )}

            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.planDescription}>{plan.description}</p>
            </div>

            <div className={styles.priceSection}>
              {plan.originalPrice && (
                <span className={styles.originalPrice}>
                  {plan.originalPrice.toLocaleString()}원
                </span>
              )}
              <div className={styles.price}>
                {plan.price !== null ? (
                  <>
                    <span className={styles.priceValue}>
                      {plan.price.toLocaleString()}
                    </span>
                    <span className={styles.priceUnit}>원</span>
                  </>
                ) : (
                  <span className={styles.priceLabel}>{plan.priceLabel}</span>
                )}
              </div>
            </div>

            <ul className={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`${styles.selectButton} ${plan.highlight ? styles.primaryButton : ""} ${plan.id === "expert-consultation" ? styles.enterpriseButton : ""}`}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.id === "expert-consultation" ? (
                <>
                  <ContactIcon />
                  상담 신청
                </>
              ) : (
                "구매하기"
              )}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.infoSection}>
        <h3>궁금한 점이 있으신가요?</h3>
        <p className={styles.infoText}>
          자주 묻는 질문에서 답변을 찾아보세요.
        </p>
        <Link href="/faq" className={styles.faqLink}>
          자주 묻는 질문 보기
          <ArrowIcon />
        </Link>
      </div>

      {/* 결제 모달 (쿠폰 사용 가능) */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

function CheckIcon() {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
