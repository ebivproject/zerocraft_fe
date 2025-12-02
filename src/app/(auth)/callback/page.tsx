"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";
import styles from "./page.module.css";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setCredits } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      // 카카오에서 에러 반환한 경우
      if (errorParam) {
        setError("카카오 로그인이 취소되었습니다.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // code가 없는 경우
      if (!code) {
        setError("인증 코드가 없습니다.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // 백엔드에 콜백 처리 요청
        const response = await authApi.handleKakaoCallback(
          code,
          state || undefined
        );

        // 토큰 저장
        localStorage.setItem("token", response.token);
        // 쿠키에도 토큰 저장 (middleware에서 사용)
        document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7일

        // 사용자 정보 저장
        setUser(response.user);

        // credits가 있으면 저장
        if (response.user.credits !== undefined) {
          setCredits(response.user.credits);
        }

        // 원래 가려던 페이지로 리다이렉트 (state에서 추출하거나 기본값 사용)
        const redirectPath = state ? decodeURIComponent(state) : "/";
        router.push(redirectPath);
      } catch (err) {
        console.error("OAuth 콜백 처리 실패:", err);
        setError("로그인 처리 중 오류가 발생했습니다.");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser, setCredits]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {error ? (
          <>
            <div className={styles.errorIcon}>
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
            <h2 className={styles.title}>로그인 실패</h2>
            <p className={styles.message}>{error}</p>
            <p className={styles.redirect}>
              잠시 후 로그인 페이지로 이동합니다...
            </p>
          </>
        ) : (
          <>
            <div className={styles.spinner} />
            <h2 className={styles.title}>로그인 처리 중</h2>
            <p className={styles.message}>잠시만 기다려주세요...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.spinner} />
            <h2 className={styles.title}>로딩 중...</h2>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
