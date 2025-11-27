import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";

// 찜한 지원사업 항목
export interface FavoriteGrant {
  id: string;
  grantId: string;
  grant: {
    id: string;
    title: string;
    organization: string;
    deadline: string;
    amount: string;
    category: string;
    status: "open" | "closed" | "upcoming";
  };
  createdAt: string;
}

// 찜한 지원사업 목록 응답
export interface FavoriteGrantsResponse {
  data: FavoriteGrant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 찜하기 추가 응답
export interface AddFavoriteResponse {
  id: string;
  grantId: string;
  userId: string;
  createdAt: string;
}

// 찜 여부 확인 응답
export interface CheckFavoriteResponse {
  isFavorite: boolean;
}

export interface FavoriteGrantsParams {
  page?: number;
  limit?: number;
  sort?: "deadline" | "createdAt";
  order?: "asc" | "desc";
}

export const favoritesApi = {
  // 찜한 지원사업 목록 조회
  getList: async (
    params?: FavoriteGrantsParams
  ): Promise<FavoriteGrantsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.LIST, {
      params,
    });
    return response.data;
  },

  // 지원사업 찜하기
  add: async (grantId: string): Promise<AddFavoriteResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.FAVORITES.ADD, {
      grantId,
    });
    return response.data;
  },

  // 지원사업 찜 해제
  remove: async (grantId: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.FAVORITES.REMOVE(grantId));
  },

  // 지원사업 찜 여부 확인
  check: async (grantId: string): Promise<CheckFavoriteResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.FAVORITES.CHECK(grantId)
    );
    return response.data;
  },
};
