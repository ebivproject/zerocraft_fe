"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../page.module.css";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get("code") || "UNKNOWN_ERROR";
  const errorMessage = searchParams.get("message") || "결제 처리 중 오류가 발생했습니다.";

  const getErrorDescription = (code: string) => {
    switch (code) {
      case "PAY_PROCESS_CANCELED":
        return "결제가 취소되었습니다.";
      case "PAY_PROCESS_ABORTED":
        return "결제가 중단되었습니다.";
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제를 거절했습니다. 다른 카드로 시도해주세요.";
      case "INVALID_CARD_EXPIRATION":
        return "카드 유효기간이 만료되었습니다.";
      case "EXCEED_MAX_DAILY_PAYMENT_COUNT":
        return "일일 결제 한도를 초과했습니다.";
      case "EXCEED_MAX_PAYMENT_AMOUNT":
        return "결제 금액 한도를 초과했습니다.";
      default:
        return errorMessage;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={`${styles.iconWrapper} ${styles.error}`}>
          <ErrorIcon />
        </div>
        <h1 className={styles.title}>결제 실패</h1>
        <p className={styles.description}>
          {getErrorDescription(errorCode)}
        </p>
        <div className={styles.errorCode}>
          오류 코드: {errorCode}
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => router.push("/pricing")}
            className={styles.primaryButton}
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push("/")}
            className={styles.secondaryButton}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<PaymentFailFallback />}>
      <PaymentFailContent />
    </Suspense>
  );
}

function PaymentFailFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={`${styles.iconWrapper} ${styles.error}`}>
          <ErrorIcon />
        </div>
        <h1 className={styles.title}>결제 실패</h1>
        <p className={styles.description}>
          오류 정보를 불러오는 중...
        </p>
      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
