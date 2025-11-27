import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";
import { creditsApi } from "@/lib/api/credits";

// AI 힌트 최대 사용 횟수 (이용권 당)
const MAX_AI_HINTS_PER_CREDIT = 20;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  credits: number;
  isLoading: boolean;
  aiHintsRemaining: number; // AI 힌트 남은 횟수

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setCredits: (credits: number) => void;
  useCredit: () => boolean;
  addCredits: (amount: number) => void;

  // AI 힌트 관련 Actions
  useAiHint: () => boolean; // AI 힌트 1회 사용, 성공 여부 반환
  resetAiHints: () => void; // AI 힌트 횟수 리셋 (이용권 구매 시)

  // API 연동 Actions
  fetchMe: () => Promise<void>;
  fetchCredits: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      credits: 0,
      isLoading: false,
      aiHintsRemaining: MAX_AI_HINTS_PER_CREDIT,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          credits: user.credits || 0,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          credits: 0,
          aiHintsRemaining: MAX_AI_HINTS_PER_CREDIT,
        }),

      setCredits: (credits) => set({ credits }),

      useCredit: () => {
        const { credits } = get();
        if (credits > 0) {
          set({ credits: credits - 1 });
          return true;
        }
        return false;
      },

      addCredits: (amount) =>
        set((state) => ({
          credits: state.credits + amount,
          // 이용권 추가 시 AI 힌트도 리셋
          aiHintsRemaining: MAX_AI_HINTS_PER_CREDIT,
        })),

      // AI 힌트 1회 사용
      useAiHint: () => {
        const { aiHintsRemaining } = get();
        if (aiHintsRemaining > 0) {
          set({ aiHintsRemaining: aiHintsRemaining - 1 });
          return true;
        }
        return false;
      },

      // AI 힌트 횟수 리셋
      resetAiHints: () => {
        set({ aiHintsRemaining: MAX_AI_HINTS_PER_CREDIT });
      },

      // 내 정보 조회 (토큰 기반)
      fetchMe: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          get().clearUser();
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authApi.getMe();
          set({
            user,
            isAuthenticated: true,
            credits: user.credits || 0,
            isLoading: false,
          });
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          // 토큰이 유효하지 않으면 로그아웃 처리
          localStorage.removeItem("token");
          get().clearUser();
          set({ isLoading: false });
        }
      },

      // 이용권 잔액 조회
      fetchCredits: async () => {
        try {
          const response = await creditsApi.getBalance();
          set({ credits: response.credits });
        } catch (error) {
          console.error("이용권 조회 실패:", error);
        }
      },

      // 로그아웃
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("로그아웃 API 호출 실패:", error);
        } finally {
          localStorage.removeItem("token");
          get().clearUser();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        credits: state.credits,
        aiHintsRemaining: state.aiHintsRemaining,
      }),
    }
  )
);
