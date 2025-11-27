import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
