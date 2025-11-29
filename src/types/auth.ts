export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  credits?: number;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// 쿠폰 관련 타입
export interface Coupon {
  id: string;
  code: string;
  discountAmount: number;
  expiresAt: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidateResponse {
  valid: boolean;
  coupon?: Coupon;
  message?: string;
}

export interface CouponCreateRequest {
  code: string;
  discountAmount: number;
  expiresAt: string;
  maxUses?: number;
  description?: string;
}
