"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  adminPaymentRequestsApi,
  PaymentRequest,
  PaymentRequestStatus,
} from "@/lib/api/credits";
import styles from "./page.module.css";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
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
  const [statusFilter, setStatusFilter] = useState<PaymentRequestStatus | "all">("pending");

  // 처리 중인 요청 ID
  const [processingId, setProcessingId] = useState<string | null>(null);

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
        router.push("/login?redirect=/admin/payments");
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
        router.push("/login?redirect=/admin/payments");
        return;
      }

      if (currentUser.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAuthChecked(true);
      fetchRequests();
    };

    checkAuth();
  }, [isHydrated, router]);

  const fetchRequests = async (page = 1, status?: PaymentRequestStatus | "all") => {
    try {
      setIsLoading(true);
      const filterStatus = status === "all" ? undefined : status;
      const response = await adminPaymentRequestsApi.list({
        page,
        limit: 20,
        status: filterStatus,
      });
      setRequests(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("결제 요청 목록 조회 실패:", err);
      setError("결제 요청 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilterChange = (status: PaymentRequestStatus | "all") => {
    setStatusFilter(status);
    fetchRequests(1, status);
  };

  const handlePageChange = (newPage: number) => {
    fetchRequests(newPage, statusFilter);
  };

  const handleApprove = async (request: PaymentRequest) => {
    if (!confirm(`${request.userName}님의 결제 요청을 승인하시겠습니까?\n입금자명: ${request.depositorName}\n금액: ${request.amount.toLocaleString()}원\n추가될 이용권: ${request.creditsToAdd}개`)) {
      return;
    }

    setProcessingId(request.id);
    setError(null);

    try {
      await adminPaymentRequestsApi.approve(request.id);
      await fetchRequests(pagination.page, statusFilter);
    } catch (err) {
      console.error("승인 실패:", err);
      setError("승인 처리에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: PaymentRequest) => {
    const reason = prompt("거절 사유를 입력해주세요 (선택):");
    if (reason === null) return; // 취소

    setProcessingId(request.id);
    setError(null);

    try {
      await adminPaymentRequestsApi.reject(request.id, {
        adminNote: reason || undefined,
      });
      await fetchRequests(pagination.page, statusFilter);
    } catch (err) {
      console.error("거절 실패:", err);
      setError("거절 처리에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: PaymentRequestStatus) => {
    switch (status) {
      case "pending":
        return <span className={styles.statusPending}>대기중</span>;
      case "approved":
        return <span className={styles.statusApproved}>승인됨</span>;
      case "rejected":
        return <span className={styles.statusRejected}>거절됨</span>;
    }
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
          <h1 className={styles.title}>결제 요청 관리</h1>
          <p className={styles.subtitle}>
            사용자의 입금 확인 요청을 승인하거나 거절합니다.
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${statusFilter === "pending" ? styles.active : ""}`}
          onClick={() => handleStatusFilterChange("pending")}
        >
          대기중
        </button>
        <button
          className={`${styles.filterTab} ${statusFilter === "approved" ? styles.active : ""}`}
          onClick={() => handleStatusFilterChange("approved")}
        >
          승인됨
        </button>
        <button
          className={`${styles.filterTab} ${statusFilter === "rejected" ? styles.active : ""}`}
          onClick={() => handleStatusFilterChange("rejected")}
        >
          거절됨
        </button>
        <button
          className={`${styles.filterTab} ${statusFilter === "all" ? styles.active : ""}`}
          onClick={() => handleStatusFilterChange("all")}
        >
          전체
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* 결제 요청 목록 */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : requests.length === 0 ? (
          <div className={styles.empty}>
            {statusFilter === "pending"
              ? "대기중인 결제 요청이 없습니다."
              : "결제 요청이 없습니다."}
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>요청자</th>
                  <th>입금자명</th>
                  <th>금액</th>
                  <th>이용권</th>
                  <th>상태</th>
                  <th>요청일시</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatarPlaceholder}>
                          {request.userName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>{request.userName || "-"}</span>
                          <span className={styles.userEmail}>{request.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.depositorName}>{request.depositorName}</span>
                    </td>
                    <td>
                      <span className={styles.amount}>
                        {request.amount.toLocaleString()}원
                      </span>
                    </td>
                    <td>
                      <span className={styles.credits}>
                        +{request.creditsToAdd}개
                      </span>
                    </td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      {request.status === "pending" ? (
                        <div className={styles.actions}>
                          <button
                            className={styles.approveButton}
                            onClick={() => handleApprove(request)}
                            disabled={processingId === request.id}
                          >
                            {processingId === request.id ? "..." : "승인"}
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => handleReject(request)}
                            disabled={processingId === request.id}
                          >
                            {processingId === request.id ? "..." : "거절"}
                          </button>
                        </div>
                      ) : (
                        <span className={styles.processed}>처리완료</span>
                      )}
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
    </div>
  );
}
