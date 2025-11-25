export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  GRANTS: "/grants",
  GRANT_DETAIL: (id: string) => `/grants/${id}`,
  PROJECT_WIZARD: "/project/wizard",
  PROJECT_VIEW: (id: string) => `/project/${id}`,
  PROJECT_EDIT: (id: string) => `/project/${id}/edit`,
  MYPAGE: "/mypage",
} as const;
