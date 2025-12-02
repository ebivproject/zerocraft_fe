"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setCredits } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // 백엔드에서 토큰을 직접 전달하는 경우
      const token = searchParams.get("token");
      const redirect = searchParams.get("redirect");

      // 기존 code 방식도 지원
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      // 카카오에서 에러 반환한 경우
      if (errorParam) {
        setError("카카오 로그인이 취소되었습니다.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // 토큰이 직접 전달된 경우 (백엔드에서 리다이렉트)
      if (token) {
        try {
          // 토큰 저장
          localStorage.setItem("token", token);

          // 쿠키에도 토큰 저장 (middleware에서 사용)
          document.cookie = `token=${token}; path=/; max-age=${
            7 * 24 * 60 * 60
          }`; // 7일

          // 사용자 정보 가져오기
          const user = await authApi.getMe();
          setUser(user);

          // credits가 있으면 저장
          if (user.credits !== undefined) {
            setCredits(user.credits);
          }

          // redirect 파라미터로 이동
          const redirectPath = redirect ? decodeURIComponent(redirect) : "/";
          router.push(redirectPath);
          return;
        } catch (err) {
          console.error("사용자 정보 가져오기 실패:", err);
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
      }

      // code가 전달된 경우 (기존 방식)
      if (code) {
        try {
          // 백엔드에 콜백 처리 요청
          const response = await authApi.handleKakaoCallback(
            code,
            state || undefined
          );

          // 토큰 저장
          localStorage.setItem("token", response.token);

          // 쿠키에도 토큰 저장
          document.cookie = `token=${response.token}; path=/; max-age=${
            7 * 24 * 60 * 60
          }`;

          // 사용자 정보 저장
          setUser(response.user);

          // credits가 있으면 저장
          if (response.user.credits !== undefined) {
            setCredits(response.user.credits);
          }

          // 원래 가려던 페이지로 리다이렉트
          const redirectPath = state ? decodeURIComponent(state) : "/";
          router.push(redirectPath);
          return;
        } catch (err) {
          console.error("OAuth 콜백 처리 실패:", err);
          setError("로그인 처리 중 오류가 발생했습니다.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
      }

      // 토큰도 코드도 없는 경우
      setError("인증 정보가 없습니다. 다시 로그인해주세요.");
      setTimeout(() => router.push("/login"), 2000);
    };

    handleCallback();
  }, [searchParams, router, setUser, setCredits]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {error ? (
          <>
            <div style={styles.errorIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 style={styles.title}>로그인 실패</h2>
            <p style={styles.message}>{error}</p>
            <p style={styles.redirect}>잠시 후 로그인 페이지로 이동합니다...</p>
          </>
        ) : (
          <>
            <div style={styles.spinner} />
            <h2 style={styles.title}>로그인 처리 중</h2>
            <p style={styles.message}>잠시만 기다려주세요...</p>
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, var(--background) 0%, var(--background-secondary) 100%)",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "var(--card-bg)",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    padding: "48px 40px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    textAlign: "center" as const,
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid var(--border)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
  },
  errorIcon: {
    width: "48px",
    height: "48px",
    margin: "0 auto 24px",
    color: "#ef4444",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "var(--foreground)",
    marginBottom: "8px",
  },
  message: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  redirect: {
    fontSize: "12px",
    color: "var(--text-muted)",
  },
};

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.spinner} />
            <h2 style={styles.title}>로딩 중...</h2>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
