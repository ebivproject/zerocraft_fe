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

// 쿠폰 사용자 정보
export interface CouponUsage {
  userId: string;
  userEmail: string;
  userName: string;
  usedAt: string;
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
  usedBy?: CouponUsage[]; // 사용한 사용자 목록
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

// 쿠폰 대량 생성 요청
export interface CouponBulkCreateRequest {
  count: number; // 생성할 쿠폰 수
  discountAmount: number;
  expiresAt: string;
  maxUses?: number; // 각 쿠폰당 최대 사용 횟수 (보통 1)
  description?: string;
  prefix?: string; // 코드 접두사 (예: "WELCOME" -> "WELCOME-XXXXXX")
}

// 쿠폰 대량 생성 응답
export interface CouponBulkCreateResponse {
  created: number;
  coupons: Coupon[];
}
