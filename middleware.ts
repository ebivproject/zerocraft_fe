import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로
const protectedRoutes = ["/mypage", "/project", "/admin"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 인증이 필요한 페이지에 비로그인 상태로 접근
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인 페이지는 항상 접근 허용 (클라이언트에서 처리)
  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/project/:path*", "/admin/:path*"],
};
