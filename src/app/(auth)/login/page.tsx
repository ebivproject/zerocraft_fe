"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import styles from "./page.module.css";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mockLogin = useAuthStore((state) => state.mockLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 후 리다이렉트할 경로
  const redirectPath = searchParams.get("redirect") || "/";

  // ============================================================
  // [MOCK LOGIN] - 제거 시 이 함수를 삭제하세요
  // ============================================================
  const handleMockLogin = () => {
    mockLogin();
    router.push(redirectPath);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.getGoogleLoginUrl();
      const url = new URL(response.url);

      // URLSearchParams가 자동으로 인코딩하므로 redirectPath를 그대로 넘긴다.
      url.searchParams.set("state", redirectPath);

      window.location.href = url.toString();
    } catch (err) {
      console.error("Google 로그인 URL 요청 실패:", err);
      setError(
        "로그인 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>Z</span>
            <span className={styles.logoText}>ZeroCraft</span>
          </Link>
          <h1 className={styles.title}>시작하기</h1>
          <p className={styles.subtitle}>
            Google 계정으로 간편하게 로그인하고
            <br />
            AI와 함께 사업계획서를 작성해보세요.
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.socialButtons}>
          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                로그인 중...
              </>
            ) : (
              <>
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 계속하기
              </>
            )}
          </button>

          {/* ============================================================ */}
          {/* [MOCK LOGIN] - 제거 시 이 버튼을 삭제하세요 */}
          {/* ============================================================ */}
          <button
            type="button"
            className={styles.googleButton}
            onClick={handleMockLogin}
            style={{
              marginTop: "12px",
              background: "#6366f1",
              border: "2px dashed #818cf8",
            }}
          >
            <span style={{ marginRight: "8px" }}>🧪</span>
            개발용 테스트 로그인
          </button>
        </div>

        <div className={styles.terms}>
          계속 진행하면 ZeroCraft의{" "}
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
                <span className={styles.logoIcon}>Z</span>
                <span className={styles.logoText}>ZeroCraft</span>
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
