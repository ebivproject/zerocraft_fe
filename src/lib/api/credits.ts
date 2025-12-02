import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import {
  Coupon,
  CouponValidateResponse,
  CouponCreateRequest,
  CouponBulkCreateRequest,
  CouponBulkCreateResponse,
} from "@/types/auth";

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

// 결제 준비 요청
export interface PaymentCreateRequest {
  productId: string;
  couponCode?: string; // 쿠폰 코드 (선택)
}

// 결제 준비 응답
export interface PaymentCreateResponse {
  paymentId: string;
  orderId: string;
  amount: number; // 쿠폰 적용 후 최종 금액
  productName: string;
  customerName: string;
  customerEmail: string;
}

// 결제 승인 요청 (토스페이먼츠)
export interface PaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  amount: number;
}

// 결제 승인 응답
export interface PaymentConfirmResponse {
  paymentId: string;
  orderId: string;
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

  // 결제 승인 (토스페이먼츠)
  confirm: async (data: PaymentConfirmRequest): Promise<PaymentConfirmResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PAYMENTS.CONFIRM,
      data
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

// 쿠폰 API
export const couponsApi = {
  // 쿠폰 검증
  validate: async (code: string): Promise<CouponValidateResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COUPONS.VALIDATE, {
      code,
    });
    return response.data;
  },

  // 쿠폰 목록 조회 (어드민용)
  list: async (): Promise<{ data: Coupon[] }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COUPONS.LIST);
    return response.data;
  },

  // 쿠폰 생성 (어드민용)
  create: async (data: CouponCreateRequest): Promise<Coupon> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COUPONS.CREATE, data);
    return response.data;
  },

  // 쿠폰 수정 (어드민용)
  update: async (id: string, data: Partial<CouponCreateRequest & { isActive: boolean }>): Promise<Coupon> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.COUPONS.UPDATE(id), data);
    return response.data;
  },

  // 쿠폰 삭제 (어드민용)
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.COUPONS.DELETE(id));
  },

  // 쿠폰 대량 생성 (어드민용)
  bulkCreate: async (
    data: CouponBulkCreateRequest
  ): Promise<CouponBulkCreateResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.COUPONS.BULK_CREATE,
      data
    );
    return response.data;
  },
};
