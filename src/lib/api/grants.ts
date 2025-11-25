import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import { Grant, GrantsResponse } from "@/types/grant";

export const grantsApi = {
  getGrants: async (params?: Record<string, string>): Promise<GrantsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.GRANTS.LIST, { params });
    return response.data;
  },

  getGrantById: async (id: string): Promise<Grant> => {
    const response = await axiosInstance.get(API_ENDPOINTS.GRANTS.DETAIL(id));
    return response.data;
  },
};
