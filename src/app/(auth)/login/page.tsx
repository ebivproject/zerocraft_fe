"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import styles from "./page.module.css";

function LoginContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 후 리다이렉트할 경로
  const redirectPath = searchParams.get("redirect") || "/";

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.getKakaoLoginUrl();

      const url = new URL(response.url);
      url.searchParams.set("state", redirectPath);

      window.location.href = url.toString();
    } catch (err: unknown) {
      console.error("[Login] 카카오 로그인 URL 요청 실패:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(
        `로그인 서비스에 연결할 수 없습니다. (${errorMessage})`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.svg" alt="StartPlan" width={44} height={28} />
            <span className={styles.logoText}>StartPlan</span>
          </Link>
          <h1 className={styles.title}>시작하기</h1>
          <p className={styles.subtitle}>
            카카오 계정으로 간편하게 로그인하고
            <br />
            AI와 함께 사업계획서를 작성해보세요.
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.socialButtons}>
          <button
            type="button"
            className={styles.kakaoButton}
            onClick={handleKakaoLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinnerDark} />
                로그인 중...
              </>
            ) : (
              <>
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path
                    fill="#000000"
                    d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.9 5.33 4.74 6.74-.17.6-.64 2.18-.74 2.52-.12.42.16.41.33.3.14-.09 2.18-1.47 3.07-2.07.84.12 1.72.18 2.6.18 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                  />
                </svg>
                카카오로 계속하기
              </>
            )}
          </button>
        </div>

        <div className={styles.terms}>
          계속 진행하면 StartPlan의{" "}
          <Link href="/terms" className={styles.termsLink}>
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="/privacy" className={styles.termsLink}>
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <Image src="/logo.svg" alt="StartPlan" width={44} height={28} />
                <span className={styles.logoText}>StartPlan</span>
              </div>
              <p>로딩 중...</p>
            </div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
