import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로
const protectedRoutes = ["/mypage", "/project"];

// 인증된 사용자가 접근하면 안되는 경로
const authRoutes = ["/login"];

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

  // 로그인된 상태에서 로그인 페이지 접근
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/project/:path*", "/login"],
};
