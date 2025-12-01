"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentsApi } from "@/lib/api/credits";
import styles from "../page.module.css";

type PaymentStatus = "loading" | "success" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState("");
  const [creditsAdded, setCreditsAdded] = useState(0);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const response = await paymentsApi.confirm({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        if (response.status === "completed") {
          setStatus("success");
          setCreditsAdded(response.creditsAdded);
          setMessage(response.message || "결제가 완료되었습니다.");
        } else {
          setStatus("error");
          setMessage(response.message || "결제 처리 중 오류가 발생했습니다.");
        }
      } catch (error) {
        setStatus("error");
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("결제 승인 중 오류가 발생했습니다.");
        }
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {status === "loading" && (
          <>
            <div className={styles.iconWrapper}>
              <LoadingIcon />
            </div>
            <h1 className={styles.title}>결제 처리 중</h1>
            <p className={styles.description}>
              잠시만 기다려주세요...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.success}`}>
              <CheckIcon />
            </div>
            <h1 className={styles.title}>결제 완료</h1>
            <p className={styles.description}>
              {message}
            </p>
            {creditsAdded > 0 && (
              <div className={styles.creditInfo}>
                <span className={styles.creditLabel}>충전된 이용권</span>
                <span className={styles.creditValue}>{creditsAdded}매</span>
              </div>
            )}
            <div className={styles.buttonGroup}>
              <button
                onClick={() => router.push("/mypage")}
                className={styles.primaryButton}
              >
                마이페이지로 이동
              </button>
              <button
                onClick={() => router.push("/project/wizard")}
                className={styles.secondaryButton}
              >
                사업계획서 작성하기
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.error}`}>
              <ErrorIcon />
            </div>
            <h1 className={styles.title}>결제 오류</h1>
            <p className={styles.description}>
              {message}
            </p>
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
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentLoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentLoadingFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <LoadingIcon />
        </div>
        <h1 className={styles.title}>결제 처리 중</h1>
        <p className={styles.description}>
          잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
}

function LoadingIcon() {
  return (
    <svg
      className={styles.spinner}
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
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
