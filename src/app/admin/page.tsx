"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import styles from "./page.module.css";

export default function AdminPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login?redirect=/admin");
        return;
      }

      try {
        const { fetchMe } = useAuthStore.getState();
        await fetchMe();
      } catch {
        // fetchMe 실패 시 무시
      }

      const currentUser = useAuthStore.getState().user;

      if (!currentUser) {
        router.push("/login?redirect=/admin");
        return;
      }

      if (currentUser.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAuthChecked(true);
    };

    checkAuth();
  }, [isHydrated, router]);

  if (!isAuthChecked) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>권한을 확인하는 중...</div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "유저 관리",
      description: "등록된 유저를 조회하고 이용권을 관리합니다.",
      href: "/admin/users",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "결제 요청 관리",
      description: "무통장 입금 요청을 확인하고 승인합니다.",
      href: "/admin/payments",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
    {
      title: "쿠폰 관리",
      description: "쿠폰을 생성하고 관리합니다.",
      href: "/admin/coupons",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>관리자 대시보드</h1>
        <p className={styles.subtitle}>StartPlan 서비스를 관리합니다.</p>
      </div>

      <div className={styles.menuGrid}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.menuCard}>
            <div className={styles.menuIcon}>{item.icon}</div>
            <div className={styles.menuContent}>
              <h2 className={styles.menuTitle}>{item.title}</h2>
              <p className={styles.menuDescription}>{item.description}</p>
            </div>
            <div className={styles.menuArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
