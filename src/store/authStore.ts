import { create } from "zustand";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  credits: number; // 이용권 횟수
  setUser: (user: User) => void;
  clearUser: () => void;
  setCredits: (credits: number) => void;
  useCredit: () => boolean; // 이용권 1회 사용, 성공 여부 반환
  addCredits: (amount: number) => void; // 이용권 추가
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  credits: 0,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false, credits: 0 }),
  setCredits: (credits) => set({ credits }),
  useCredit: () => {
    const { credits } = get();
    if (credits > 0) {
      set({ credits: credits - 1 });
      return true;
    }
    return false;
  },
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
}));
