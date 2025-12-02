import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import { User } from "@/types/auth";

export interface KakaoLoginResponse {
  url: string;
}

export interface KakaoCallbackResponse {
  token: string;
  user: User;
}

export const authApi = {
  // Kakao OAuth 로그인 URL 요청
  getKakaoLoginUrl: async (): Promise<KakaoLoginResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.KAKAO_LOGIN);
    return response.data;
  },

  // Kakao OAuth 콜백 처리
  handleKakaoCallback: async (
    code: string,
    state?: string
  ): Promise<KakaoCallbackResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.AUTH.KAKAO_CALLBACK,
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
