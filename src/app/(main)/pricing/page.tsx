"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import PaymentModal from "@/components/wizard/PaymentModal";
import styles from "./page.module.css";

interface Plan {
  id: string;
  name: string;
  price: number;
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
    price: 300000,
    description: "전문가 1:1 상담 + 이용권 1매 증정",
    features: [
      "전문 컨설턴트 1:1 상담",
      "사업계획서 피드백",
      "정부지원사업 전략 수립",
      "이용권 1매 무료 증정",
      "맞춤형 사업 분석",
    ],
    badge: "준비중",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated, addCredits } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (plan.id === "expert-consultation") {
      // 전문가 상담은 준비중
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
            className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ""}`}
          >
            {plan.badge && (
              <div className={`${styles.badge} ${plan.badge === "준비중" ? styles.badgeSecondary : ""}`}>
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
                <span className={styles.priceValue}>
                  {plan.price.toLocaleString()}
                </span>
                <span className={styles.priceUnit}>원</span>
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
              className={`${styles.selectButton} ${plan.highlight ? styles.primaryButton : ""} ${plan.id === "expert-consultation" ? styles.disabledButton : ""}`}
              onClick={() => handleSelectPlan(plan)}
              disabled={plan.id === "expert-consultation"}
            >
              {plan.id === "expert-consultation" ? "준비중" : "구매하기"}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.infoSection}>
        <h3>자주 묻는 질문</h3>
        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <h4>이용권은 어떻게 사용하나요?</h4>
            <p>
              이용권 1매로 AI 사업계획서 1회를 생성할 수 있습니다.
              생성된 사업계획서는 마이페이지에서 다운로드할 수 있습니다.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>쿠폰은 어떻게 사용하나요?</h4>
            <p>
              구매하기 버튼을 클릭하면 나오는 결제 화면에서 쿠폰 코드를 입력할 수 있습니다.
              유효한 쿠폰 적용 시 할인된 가격으로 결제됩니다.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>전문가 상담은 어떻게 진행되나요?</h4>
            <p>
              상담 신청 후 전문 컨설턴트가 연락드립니다.
              1:1 맞춤 상담을 통해 사업계획서 작성 및 정부지원사업 전략을 수립해 드립니다.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>환불이 가능한가요?</h4>
            <p>
              이용권 사용 전이라면 전액 환불이 가능합니다.
              자세한 내용은 고객센터로 문의해 주세요.
            </p>
          </div>
        </div>
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
