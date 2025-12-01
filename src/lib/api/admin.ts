import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import { User, UserRole } from "@/types/auth";

// 유저 목록 응답
export interface AdminUserListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 유저 이용권 변경 요청
export interface UpdateCreditsRequest {
  credits: number;
  reason?: string;
}

// 유저 이용권 변경 응답
export interface UpdateCreditsResponse {
  user: User;
  previousCredits: number;
  newCredits: number;
  message: string;
}

// 유저 역할 변경 요청
export interface UpdateRoleRequest {
  role: UserRole;
}

// 유저 역할 변경 응답
export interface UpdateRoleResponse {
  user: User;
  previousRole: UserRole;
  newRole: UserRole;
  message: string;
}

// 어드민 유저 관리 API
export const adminUsersApi = {
  // 유저 목록 조회
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<AdminUserListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS.LIST, {
      params,
    });
    return response.data;
  },

  // 유저 상세 조회
  get: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ADMIN.USERS.DETAIL(id)
    );
    return response.data;
  },

  // 유저 이용권 변경
  updateCredits: async (
    id: string,
    data: UpdateCreditsRequest
  ): Promise<UpdateCreditsResponse> => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.ADMIN.USERS.UPDATE_CREDITS(id),
      data
    );
    return response.data;
  },

  // 유저 역할 변경
  updateRole: async (
    id: string,
    data: UpdateRoleRequest
  ): Promise<UpdateRoleResponse> => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.ADMIN.USERS.UPDATE_ROLE(id),
      data
    );
    return response.data;
  },
};
