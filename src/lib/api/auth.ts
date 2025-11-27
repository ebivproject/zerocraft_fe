import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import { User } from "@/types/auth";

export interface GoogleLoginResponse {
  url: string;
}

export interface GoogleCallbackResponse {
  token: string;
  user: User;
}

export const authApi = {
  // Google OAuth 로그인 URL 요청
  getGoogleLoginUrl: async (): Promise<GoogleLoginResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.GOOGLE_LOGIN);
    return response.data;
  },

  // Google OAuth 콜백 처리
  handleGoogleCallback: async (
    code: string,
    state?: string
  ): Promise<GoogleCallbackResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.AUTH.GOOGLE_CALLBACK,
      {
        params: { code, state },
      }
    );
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // 내 정보 조회
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
