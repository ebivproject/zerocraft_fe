import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";

// 마이페이지 사업계획서 항목
export interface MyPageBusinessPlan {
  id: string;
  title: string;
  grantId?: string;
  grantTitle?: string;
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
}

// 마이페이지 찜한 지원사업 항목
export interface MyPageFavoriteGrant {
  id: string;
  grant: {
    id: string;
    title: string;
    organization: string;
    deadline: string;
    amount: string;
    category: string;
  };
  createdAt: string;
}

// 마이페이지 통합 응답 (apireq.md 명세 준수)
export interface MyPageResponse {
  user: {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
    createdAt: string;
  };
  businessPlans: {
    data: MyPageBusinessPlan[];
    total: number;
  };
  favorites: {
    data: MyPageFavoriteGrant[];
    total: number;
  };
}

export interface MyPageParams {
  businessPlanLimit?: number;
  favoriteLimit?: number;
}

export const mypageApi = {
  // 마이페이지 통합 데이터 조회
  getData: async (params?: MyPageParams): Promise<MyPageResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MYPAGE, { params });
    return response.data;
  },
};
