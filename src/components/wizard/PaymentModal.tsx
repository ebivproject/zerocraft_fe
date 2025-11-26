"use client";

import { useState } from "react";
import styles from "./PaymentModal.module.css";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentComplete,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "kakao" | "toss">(
    "card"
  );

  const handlePayment = async () => {
    setIsProcessing(true);

    // 실제 결제 로직은 여기에 구현
    // 현재는 Mock으로 2초 후 결제 완료 처리
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onPaymentComplete();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>결제하기</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          {/* 상품 정보 */}
          <div className={styles.productInfo}>
            <div className={styles.productIcon}>
              <DocumentIcon />
            </div>
            <div className={styles.productDetails}>
              <h3>AI 사업계획서 생성</h3>
              <p>정부지원사업 맞춤형 사업계획서</p>
            </div>
            <div className={styles.productPrice}>
              <span className={styles.originalPrice}>50,000원</span>
              <span className={styles.finalPrice}>29,900원</span>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className={styles.paymentMethods}>
            <h4>결제 수단</h4>
            <div className={styles.methodGrid}>
              <button
                className={`${styles.methodButton} ${
                  paymentMethod === "card" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCardIcon />
                <span>신용카드</span>
              </button>
              <button
                className={`${styles.methodButton} ${
                  paymentMethod === "kakao" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("kakao")}
              >
                <KakaoIcon />
                <span>카카오페이</span>
              </button>
              <button
                className={`${styles.methodButton} ${
                  paymentMethod === "toss" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("toss")}
              >
                <TossIcon />
                <span>토스</span>
              </button>
            </div>
          </div>

          {/* 결제 금액 */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>상품 금액</span>
              <span>50,000원</span>
            </div>
            <div className={styles.summaryRow}>
              <span>할인</span>
              <span className={styles.discount}>-20,100원</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>결제 금액</span>
              <span>29,900원</span>
            </div>
          </div>

          {/* 결제 버튼 */}
          <button
            className={styles.payButton}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <SpinnerIcon />
                결제 처리 중...
              </>
            ) : (
              <>29,900원 결제하기</>
            )}
          </button>

          <p className={styles.notice}>
            결제 완료 후 바로 AI 사업계획서 생성이 시작됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.87 5.32 4.68 6.73l-1.2 4.47c-.1.37.35.67.67.45l5.35-3.55c.17.01.33.02.5.02 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
    </svg>
  );
}

function TossIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className={styles.spinner}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
