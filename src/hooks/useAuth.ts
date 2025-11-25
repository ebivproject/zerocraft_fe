"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { authApi } from "@/lib/api/auth";
import { ROUTES } from "@/constants/routes";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      setUser(response.user);
      router.push(ROUTES.HOME);
    } catch (error) {
      throw error;
    }
  }, [router, setUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      clearUser();
      router.push(ROUTES.LOGIN);
    }
  }, [router, clearUser]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      clearUser();
      return false;
    }

    try {
      const user = await authApi.getMe();
      setUser(user);
      return true;
    } catch (error) {
      clearUser();
      return false;
    }
  }, [setUser, clearUser]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
