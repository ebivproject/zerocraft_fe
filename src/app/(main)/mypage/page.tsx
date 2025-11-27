"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "./page.module.css";

// Mock 데이터
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "AI 기반 물류 최적화 플랫폼 사업계획서",
    grantTitle: "2025년 창업성장기술개발사업 디딤돌 창업과제",
    status: "completed" as const,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "스마트 헬스케어 모니터링 시스템",
    grantTitle: "혁신창업사업화자금",
    status: "draft" as const,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "친환경 패키징 솔루션 개발",
    grantTitle: "초기창업패키지",
    status: "completed" as const,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12",
  },
];

const MOCK_FAVORITES = [
  {
    id: "1",
    title: "2025년 창업성장기술개발사업 디딤돌 창업과제",
    organization: "중소벤처기업부",
    deadline: "2025-02-15",
    amount: "최대 1억원",
    category: "창업지원",
  },
  {
    id: "2",
    title: "혁신창업사업화자금 (융자)",
    organization: "중소벤처기업진흥공단",
    deadline: "2025-01-31",
    amount: "최대 1억원",
    category: "금융지원",
  },
  {
    id: "3",
    title: "청년창업사관학교 14기 모집",
    organization: "중소벤처기업부",
    deadline: "2025-03-10",
    amount: "최대 1억원",
    category: "창업지원",
  },
];

export default function MyPage() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const [projects] = useState(MOCK_PROJECTS);
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    router.push("/");
  };

  const handleDownload = (projectId: string) => {
    // TODO: 실제 다운로드 로직 구현
    console.log("Downloading project:", projectId);
    alert("사업계획서 다운로드를 시작합니다.");
  };

  const handleRemoveFavorite = (grantId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== grantId));
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 로그인 안 된 경우
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>로그인이 필요합니다</h3>
          <p className={styles.emptyDescription}>
            마이페이지를 이용하려면 로그인해주세요.
          </p>
          <Link href="/login" className={styles.emptyButton}>
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>마이페이지</h1>
        <p className={styles.subtitle}>
          프로필과 작성한 사업계획서를 관리하세요.
        </p>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Sidebar - Profile */}
        <aside className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div className={styles.avatar}>{user.name?.charAt(0) || "U"}</div>
            <h2 className={styles.profileName}>{user.name}</h2>
            <p className={styles.profileEmail}>{user.email}</p>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
                <span>작성한 계획서</span>
                <span className={styles.statValue}>{projects.length}개</span>
              </div>
              <div className={styles.stat}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>찜한 지원사업</span>
                <span className={styles.statValue}>{favorites.length}개</span>
              </div>
            </div>

            <button className={styles.logoutButton} onClick={handleLogout}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              로그아웃
            </button>
          </div>
        </aside>

        {/* Right Content */}
        <main className={styles.mainContent}>
          {/* 내 사업계획서 Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
                내 사업계획서
              </h2>
              <Link href="/project/wizard" className={styles.newButton}>
                + 새로 작성하기
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>
                  작성한 사업계획서가 없습니다
                </h3>
                <p className={styles.emptyDescription}>
                  AI와 함께 첫 번째 사업계획서를 작성해보세요.
                </p>
                <Link href="/project/wizard" className={styles.emptyButton}>
                  사업계획서 작성하기
                </Link>
              </div>
            ) : (
              <div className={styles.projectsList}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectInfo}>
                      <div className={styles.projectMain}>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <p className={styles.projectGrant}>
                          {project.grantTitle}
                        </p>
                      </div>
                      <div className={styles.projectMeta}>
                        <span
                          className={`${styles.projectStatus} ${
                            project.status === "completed"
                              ? styles.statusCompleted
                              : styles.statusDraft
                          }`}
                        >
                          {project.status === "completed" ? "완료" : "작성중"}
                        </span>
                        <span className={styles.projectDate}>
                          {formatDate(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.projectActions}>
                      <button
                        className={styles.downloadButtonLarge}
                        onClick={() => handleDownload(project.id)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        다운로드
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 찜한 지원사업 Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                찜한 지원사업
              </h2>
              <Link href="/grants" className={styles.viewAllButton}>
                전체보기 →
              </Link>
            </div>

            {favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>찜한 지원사업이 없습니다</h3>
                <p className={styles.emptyDescription}>
                  관심있는 지원사업을 찜해두고 쉽게 확인하세요.
                </p>
                <Link href="/grants" className={styles.emptyButton}>
                  지원사업 둘러보기
                </Link>
              </div>
            ) : (
              <div className={styles.favoritesList}>
                {favorites.map((grant) => {
                  const daysLeft = getDaysUntilDeadline(grant.deadline);
                  return (
                    <div key={grant.id} className={styles.favoriteCard}>
                      <div className={styles.favoriteInfo}>
                        <p className={styles.favoriteOrg}>
                          {grant.organization}
                        </p>
                        <h3 className={styles.favoriteTitle}>{grant.title}</h3>
                        <div className={styles.favoriteMeta}>
                          <span
                            className={`${styles.metaItem} ${
                              daysLeft <= 7 ? styles.deadlineSoon : ""
                            }`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {daysLeft > 0 ? `D-${daysLeft}` : "마감"}
                          </span>
                          <span className={styles.metaItem}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="12" y1="1" x2="12" y2="23" />
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            {grant.amount}
                          </span>
                          <span className={styles.metaItem}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                            {grant.category}
                          </span>
                        </div>
                      </div>
                      <button
                        className={styles.favoriteButton}
                        onClick={() => handleRemoveFavorite(grant.id)}
                        title="찜 해제"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
