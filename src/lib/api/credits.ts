import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";

// 이용권 잔액 응답
export interface CreditsBalanceResponse {
  credits: number;
  usedCredits: number;
  totalPurchased: number;
}

// 이용권 사용 내역 항목
export interface CreditHistoryItem {
  id: string;
  type: "purchase" | "use" | "refund" | "bonus";
  amount: number;
  description: string;
  businessPlanId?: string;
  businessPlanTitle?: string;
  paymentId?: string;
  createdAt: string;
}

// 이용권 사용 내역 응답
export interface CreditHistoryResponse {
  data: CreditHistoryItem[];
}

// 결제 요청
export interface PaymentCreateRequest {
  productId: string;
  paymentMethod: string;
  amount: number;
}

// 결제 요청 응답
export interface PaymentCreateResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  paymentUrl: string;
}

// 결제 확인 응답
export interface PaymentConfirmResponse {
  paymentId: string;
  status: "completed" | "failed";
  creditsAdded: number;
  currentCredits: number;
  message: string;
}

// 결제 내역 항목
export interface PaymentHistoryItem {
  id: string;
  orderId: string;
  productName: string;
  amount: number;
  creditsAdded: number;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  paymentMethod: string;
  createdAt: string;
}

// 결제 내역 응답
export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 이용권 사용 응답
export interface CreditUseResponse {
  success: boolean;
  remainingCredits: number;
  message: string;
}

export const creditsApi = {
  // 이용권 잔액 조회
  getBalance: async (): Promise<CreditsBalanceResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CREDITS.BALANCE);
    return response.data;
  },

  // 이용권 사용 내역 조회
  getHistory: async (): Promise<CreditHistoryResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CREDITS.HISTORY);
    return response.data;
  },

  // 이용권 사용 (차감)
  use: async (
    description?: string,
    businessPlanId?: string
  ): Promise<CreditUseResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CREDITS.USE, {
      description,
      businessPlanId,
    });
    return response.data;
  },
};

export const paymentsApi = {
  // 결제 요청
  create: async (
    data: PaymentCreateRequest
  ): Promise<PaymentCreateResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PAYMENTS.CREATE,
      data
    );
    return response.data;
  },

  // 결제 확인/완료
  confirm: async (paymentId: string): Promise<PaymentConfirmResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PAYMENTS.CONFIRM(paymentId)
    );
    return response.data;
  },

  // 결제 내역 조회
  getHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaymentHistoryResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.LIST, {
      params,
    });
    return response.data;
  },
};
