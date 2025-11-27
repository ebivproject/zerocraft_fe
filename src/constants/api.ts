export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: "/api/auth/google",
    GOOGLE_CALLBACK: "/api/auth/google/callback",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  CREDITS: {
    BALANCE: "/api/credits",
    HISTORY: "/api/credits/history",
    USE: "/api/credits/use",
  },
  PAYMENTS: {
    CREATE: "/api/payments",
    CONFIRM: (id: string) => `/api/payments/${id}/confirm`,
    LIST: "/api/payments",
  },
  BUSINESS_PLANS: {
    LIST: "/api/business-plans",
    DETAIL: (id: string) => `/api/business-plans/${id}`,
    CREATE: "/api/business-plans",
    DOWNLOAD: (id: string) => `/api/business-plans/${id}/download`,
  },
  FAVORITES: {
    LIST: "/api/favorites/grants",
    ADD: "/api/favorites/grants",
    REMOVE: (grantId: string) => `/api/favorites/grants/${grantId}`,
    CHECK: (grantId: string) => `/api/favorites/grants/${grantId}/check`,
  },
  GRANTS: {
    LIST: "/api/grants",
    DETAIL: (id: string) => `/api/grants/${id}`,
  },
  MYPAGE: "/api/mypage",
} as const;
