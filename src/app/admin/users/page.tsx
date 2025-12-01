"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { adminUsersApi, AdminUserListResponse } from "@/lib/api/admin";
import { User } from "@/types/auth";
import styles from "./page.module.css";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 이용권 수정 모달 상태
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newCredits, setNewCredits] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Hydration 완료 대기
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 권한 체크
  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login?redirect=/admin/users");
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
        router.push("/login?redirect=/admin/users");
        return;
      }

      if (currentUser.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAuthChecked(true);
      fetchUsers();
    };

    checkAuth();
  }, [isHydrated, router]);

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      const response: AdminUserListResponse = await adminUsersApi.list({
        page,
        limit: 20,
        search: search || undefined,
      });
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("유저 목록 조회 실패:", err);
      setError("유저 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchQuery);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setNewCredits(String(user.credits || 0));
    setCreditReason("");
    setError(null);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setNewCredits("");
    setCreditReason("");
  };

  const handleUpdateCredits = async () => {
    if (!editingUser) return;

    const credits = parseInt(newCredits);
    if (isNaN(credits) || credits < 0) {
      setError("유효한 이용권 수를 입력해주세요.");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await adminUsersApi.updateCredits(editingUser.id, {
        credits,
        reason: creditReason || undefined,
      });

      // 목록 새로고침
      await fetchUsers(pagination.page, searchQuery);
      closeEditModal();
    } catch (err) {
      console.error("이용권 변경 실패:", err);
      setError("이용권 변경에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 인증 확인 전까지 로딩 표시
  if (!isAuthChecked) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>권한을 확인하는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>유저 관리</h1>
          <p className={styles.subtitle}>
            등록된 유저를 조회하고 이용권을 관리합니다.
          </p>
        </div>
      </div>

      {/* 검색 */}
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이메일 또는 이름으로 검색..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
      </form>

      {error && !editingUser && <div className={styles.error}>{error}</div>}

      {/* 유저 목록 */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>
            {searchQuery ? "검색 결과가 없습니다." : "등록된 유저가 없습니다."}
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>이용권</th>
                  <th>역할</th>
                  <th>가입일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <span>{user.name || "-"}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={styles.credits}>
                        {user.credits ?? 0}개
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          user.role === "admin"
                            ? styles.roleAdmin
                            : styles.roleUser
                        }
                      >
                        {user.role === "admin" ? "관리자" : "일반"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        className={styles.editButton}
                        onClick={() => openEditModal(user)}
                      >
                        이용권 변경
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  이전
                </button>
                <span className={styles.pageInfo}>
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  className={styles.pageButton}
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 이용권 수정 모달 */}
      {editingUser && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>이용권 변경</h3>
            <p className={styles.modalSubtitle}>
              {editingUser.name} ({editingUser.email})
            </p>

            {error && <div className={styles.modalError}>{error}</div>}

            <div className={styles.modalContent}>
              <div className={styles.currentCredits}>
                <span>현재 이용권:</span>
                <strong>{editingUser.credits ?? 0}개</strong>
              </div>

              <div className={styles.formGroup}>
                <label>새 이용권 수</label>
                <input
                  type="number"
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>변경 사유 (선택)</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="예: 테스트 계정, 보상 지급 등"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={closeEditModal}
                disabled={isUpdating}
              >
                취소
              </button>
              <button
                className={styles.submitButton}
                onClick={handleUpdateCredits}
                disabled={isUpdating}
              >
                {isUpdating ? "변경 중..." : "변경하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
