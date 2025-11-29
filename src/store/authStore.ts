import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";
import { creditsApi } from "@/lib/api/credits";

// AI 힌트 최대 사용 횟수 (이용권 당)
const MAX_AI_HINTS_PER_CREDIT = 20;

// ============================================================
// [MOCK LOGIN] - 제거 시 이 함수를 삭제하세요
// ============================================================
const isMockToken = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("token") === "mock-token-for-development";
};

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

  // ============================================================
  // [MOCK LOGIN] - 제거 시 이 섹션과 관련 코드를 삭제하세요
  // ============================================================
  mockLogin: () => void;
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

      clearUser: () => {
        // [MOCK LOGIN] - 쿠키도 삭제
        if (typeof document !== "undefined") {
          document.cookie = "token=; path=/; max-age=0";
        }
        set({
          user: null,
          isAuthenticated: false,
          credits: 0,
          aiHintsRemaining: MAX_AI_HINTS_PER_CREDIT,
        });
      },

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
        // [MOCK LOGIN] - Mock 토큰이면 API 호출 스킵
        if (isMockToken()) {
          console.log("[MOCK] 이용권 조회 스킵 (Mock 모드)");
          return;
        }

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

      // ============================================================
      // [MOCK LOGIN] - 제거 시 이 함수를 삭제하세요
      // ============================================================
      mockLogin: () => {
        const mockUser: User = {
          id: "mock-user-001",
          email: "test@zerocraft.dev",
          name: "테스트 사용자",
          profileImage: undefined,
          credits: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const mockToken = "mock-token-for-development";
        localStorage.setItem("token", mockToken);
        // 미들웨어에서 쿠키로 토큰 체크하므로 쿠키에도 저장
        document.cookie = `token=${mockToken}; path=/; max-age=86400`;
        set({
          user: mockUser,
          isAuthenticated: true,
          credits: mockUser.credits || 0,
          aiHintsRemaining: MAX_AI_HINTS_PER_CREDIT,
        });
      },
    }),
    {
      name: "auth-storage",
      version: 2, // 버전 업그레이드로 aiHintsRemaining 리셋
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        credits: state.credits,
        aiHintsRemaining: state.aiHintsRemaining,
      }),
      // 버전 마이그레이션 - 이전 버전에서 aiHintsRemaining을 20으로 리셋
      migrate: (persistedState, version) => {
        if (version < 2) {
          return {
            ...(persistedState as object),
            aiHintsRemaining: 20, // MAX_AI_HINTS_PER_CREDIT
          };
        }
        return persistedState;
      },
    }
  )
);
