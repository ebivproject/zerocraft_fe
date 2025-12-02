"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: ROUTES.PROJECT_WIZARD, label: "AI 사업계획서" },
    { href: ROUTES.GRANTS, label: "지원사업 검색" },
    { href: "/pricing", label: "가격" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link href={ROUTES.HOME} className="logo">
            <span className="logo-text">StartPlan</span>
          </Link>
          <nav>
            <ul className="nav-menu">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive(item.href) ? "active" : ""
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header-right">
          {isAuthenticated && user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="btn btn-ghost admin-btn desktop-only">
                  <AdminIcon />
                  관리자
                </Link>
              )}
              <Link href={ROUTES.MYPAGE} className="profile-btn desktop-only">
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="profile-name">{user.name || "사용자"}</span>
              </Link>
            </>
          ) : (
            <Link href={ROUTES.LOGIN} className="btn btn-primary desktop-only">
              로그인
            </Link>
          )}

          <button
            className="btn-icon mobile-menu-btn"
            aria-label="메뉴"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link ${isActive(item.href) ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mobile-menu-footer">
              {isAuthenticated && user ? (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin" className="mobile-nav-link">
                      관리자
                    </Link>
                  )}
                  <Link href={ROUTES.MYPAGE} className="mobile-profile-btn">
                    <div className="profile-avatar">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span>{user.name || "사용자"}</span>
                  </Link>
                </>
              ) : (
                <Link href={ROUTES.LOGIN} className="btn btn-primary mobile-login-btn">
                  로그인
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// Icons
function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
