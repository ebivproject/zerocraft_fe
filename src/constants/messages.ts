export const MESSAGES = {
  ERROR: {
    GENERIC: "문제가 발생했습니다. 다시 시도해주세요.",
    NETWORK: "네트워크 오류가 발생했습니다.",
    UNAUTHORIZED: "로그인이 필요합니다.",
    FORBIDDEN: "접근 권한이 없습니다.",
    NOT_FOUND: "요청한 정보를 찾을 수 없습니다.",
  },
  SUCCESS: {
    LOGIN: "로그인되었습니다.",
    LOGOUT: "로그아웃되었습니다.",
    SAVE: "저장되었습니다.",
    DELETE: "삭제되었습니다.",
  },
  CONFIRM: {
    DELETE: "정말 삭제하시겠습니까?",
    LOGOUT: "로그아웃 하시겠습니까?",
  },
} as const;
