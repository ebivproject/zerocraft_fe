"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { couponsApi } from "@/lib/api/credits";
import { Coupon } from "@/types/auth";
import styles from "./page.module.css";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 쿠폰 생성 모드: "single" | "bulk"
  const [createMode, setCreateMode] = useState<"single" | "bulk">("bulk");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 단일 쿠폰 생성 폼
  const [singleFormData, setSingleFormData] = useState({
    code: "",
    discountAmount: 30000,
    expiresAt: "",
    maxUses: "1",
    description: "",
  });

  // 대량 쿠폰 생성 폼
  const [bulkFormData, setBulkFormData] = useState({
    count: 10,
    discountAmount: 30000,
    expiresAt: "",
    maxUses: 1,
    description: "",
    prefix: "",
  });

  const [isCreating, setIsCreating] = useState(false);

  // 사용자 상세 모달
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 대량 생성 결과 모달
  const [createdCoupons, setCreatedCoupons] = useState<Coupon[]>([]);
  const [showCreatedModal, setShowCreatedModal] = useState(false);

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
        router.push("/login?redirect=/admin/coupons");
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
        router.push("/login?redirect=/admin/coupons");
        return;
      }

      if (currentUser.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAuthChecked(true);
      fetchCoupons();
    };

    checkAuth();
  }, [isHydrated, router]);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await couponsApi.list();
      setCoupons(response.data);
    } catch (err) {
      console.error("쿠폰 목록 조회 실패:", err);
      setError("쿠폰 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 단일 쿠폰 생성
  const handleCreateSingleCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      await couponsApi.create({
        code: singleFormData.code.toUpperCase(),
        discountAmount: singleFormData.discountAmount,
        expiresAt: new Date(singleFormData.expiresAt).toISOString(),
        maxUses: singleFormData.maxUses
          ? parseInt(singleFormData.maxUses)
          : undefined,
        description: singleFormData.description || undefined,
      });

      setSingleFormData({
        code: "",
        discountAmount: 30000,
        expiresAt: "",
        maxUses: "1",
        description: "",
      });
      setShowCreateForm(false);
      fetchCoupons();
    } catch (err) {
      console.error("쿠폰 생성 실패:", err);
      setError("쿠폰 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  // 대량 쿠폰 생성
  const handleCreateBulkCoupons = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      const result = await couponsApi.bulkCreate({
        count: bulkFormData.count,
        discountAmount: bulkFormData.discountAmount,
        expiresAt: new Date(bulkFormData.expiresAt).toISOString(),
        maxUses: bulkFormData.maxUses || undefined,
        description: bulkFormData.description || undefined,
        prefix: bulkFormData.prefix || undefined,
      });

      // 생성된 쿠폰 목록 저장 및 모달 표시
      setCreatedCoupons(result.coupons);
      setShowCreatedModal(true);

      setBulkFormData({
        count: 10,
        discountAmount: 30000,
        expiresAt: "",
        maxUses: 1,
        description: "",
        prefix: "",
      });
      setShowCreateForm(false);
      fetchCoupons();
    } catch (err) {
      console.error("쿠폰 대량 생성 실패:", err);
      setError("쿠폰 대량 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await couponsApi.update(coupon.id, { isActive: !coupon.isActive });
      fetchCoupons();
    } catch (err) {
      console.error("쿠폰 상태 변경 실패:", err);
      setError("쿠폰 상태 변경에 실패했습니다.");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("정말 이 쿠폰을 삭제하시겠습니까?")) return;

    try {
      await couponsApi.delete(id);
      fetchCoupons();
    } catch (err) {
      console.error("쿠폰 삭제 실패:", err);
      setError("쿠폰 삭제에 실패했습니다.");
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSingleFormData((prev) => ({ ...prev, code }));
  };

  // 기본 만료일 설정 (30일 후)
  const getDefaultExpiresAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().slice(0, 16);
  };

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
          <h1 className={styles.title}>쿠폰 관리</h1>
          <p className={styles.subtitle}>
            할인 쿠폰을 생성하고 사용 현황을 관리합니다.
          </p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            if (!bulkFormData.expiresAt) {
              setBulkFormData((prev) => ({
                ...prev,
                expiresAt: getDefaultExpiresAt(),
              }));
            }
            if (!singleFormData.expiresAt) {
              setSingleFormData((prev) => ({
                ...prev,
                expiresAt: getDefaultExpiresAt(),
              }));
            }
          }}
        >
          {showCreateForm ? "취소" : "+ 쿠폰 생성"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* 쿠폰 생성 폼 */}
      {showCreateForm && (
        <div className={styles.createForm}>
          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeButton} ${createMode === "bulk" ? styles.active : ""}`}
              onClick={() => setCreateMode("bulk")}
            >
              대량 생성
            </button>
            <button
              className={`${styles.modeButton} ${createMode === "single" ? styles.active : ""}`}
              onClick={() => setCreateMode("single")}
            >
              단일 생성
            </button>
          </div>

          {createMode === "bulk" ? (
            <form onSubmit={handleCreateBulkCoupons}>
              <h3>쿠폰 대량 생성</h3>
              <p className={styles.formHint}>
                랜덤 코드가 자동 생성됩니다. 각 쿠폰은 1회만 사용 가능합니다.
              </p>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>생성 개수</label>
                  <input
                    type="number"
                    value={bulkFormData.count}
                    onChange={(e) =>
                      setBulkFormData((prev) => ({
                        ...prev,
                        count: parseInt(e.target.value) || 1,
                      }))
                    }
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>할인 금액 (원)</label>
                  <input
                    type="number"
                    value={bulkFormData.discountAmount}
                    onChange={(e) =>
                      setBulkFormData((prev) => ({
                        ...prev,
                        discountAmount: parseInt(e.target.value) || 0,
                      }))
                    }
                    min="1000"
                    step="1000"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>유효기간</label>
                  <input
                    type="datetime-local"
                    value={bulkFormData.expiresAt}
                    onChange={(e) =>
                      setBulkFormData((prev) => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>코드 접두사 (선택)</label>
                  <input
                    type="text"
                    value={bulkFormData.prefix}
                    onChange={(e) =>
                      setBulkFormData((prev) => ({
                        ...prev,
                        prefix: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="예: WELCOME"
                    maxLength={10}
                  />
                </div>

                <div
                  className={styles.formGroup}
                  style={{ gridColumn: "1 / -1" }}
                >
                  <label>설명</label>
                  <input
                    type="text"
                    value={bulkFormData.description}
                    onChange={(e) =>
                      setBulkFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="예: 12월 프로모션 쿠폰"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowCreateForm(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isCreating}
                >
                  {isCreating
                    ? "생성 중..."
                    : `${bulkFormData.count}개 쿠폰 생성`}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateSingleCoupon}>
              <h3>단일 쿠폰 생성</h3>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>쿠폰 코드</label>
                  <div className={styles.codeInput}>
                    <input
                      type="text"
                      value={singleFormData.code}
                      onChange={(e) =>
                        setSingleFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="예: WELCOME2024"
                      required
                    />
                    <button type="button" onClick={generateRandomCode}>
                      자동 생성
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>할인 금액 (원)</label>
                  <input
                    type="number"
                    value={singleFormData.discountAmount}
                    onChange={(e) =>
                      setSingleFormData((prev) => ({
                        ...prev,
                        discountAmount: parseInt(e.target.value) || 0,
                      }))
                    }
                    min="1000"
                    step="1000"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>유효기간</label>
                  <input
                    type="datetime-local"
                    value={singleFormData.expiresAt}
                    onChange={(e) =>
                      setSingleFormData((prev) => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>최대 사용 횟수</label>
                  <input
                    type="number"
                    value={singleFormData.maxUses}
                    onChange={(e) =>
                      setSingleFormData((prev) => ({
                        ...prev,
                        maxUses: e.target.value,
                      }))
                    }
                    min="1"
                    placeholder="1"
                  />
                </div>

                <div
                  className={styles.formGroup}
                  style={{ gridColumn: "1 / -1" }}
                >
                  <label>설명</label>
                  <input
                    type="text"
                    value={singleFormData.description}
                    onChange={(e) =>
                      setSingleFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="예: 신규 가입 환영 쿠폰"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowCreateForm(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isCreating}
                >
                  {isCreating ? "생성 중..." : "쿠폰 생성"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 쿠폰 목록 */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : coupons.length === 0 ? (
          <div className={styles.empty}>등록된 쿠폰이 없습니다.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>코드</th>
                <th>설명</th>
                <th>할인 금액</th>
                <th>사용 현황</th>
                <th>유효기간</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const isExpired = new Date(coupon.expiresAt) < new Date();
                const isMaxUsed =
                  coupon.maxUses && coupon.usedCount >= coupon.maxUses;

                return (
                  <tr
                    key={coupon.id}
                    className={
                      !coupon.isActive || isExpired ? styles.inactive : ""
                    }
                  >
                    <td>
                      <code className={styles.couponCode}>{coupon.code}</code>
                    </td>
                    <td>{coupon.description || "-"}</td>
                    <td className={styles.amount}>
                      -{coupon.discountAmount.toLocaleString()}원
                    </td>
                    <td>
                      <button
                        className={styles.usageButton}
                        onClick={() => setSelectedCoupon(coupon)}
                        disabled={coupon.usedCount === 0}
                      >
                        {coupon.usedCount}
                        {coupon.maxUses ? `/${coupon.maxUses}` : "/∞"}
                        {coupon.usedCount > 0 && (
                          <span className={styles.viewIcon}>👁</span>
                        )}
                      </button>
                    </td>
                    <td>
                      <span className={isExpired ? styles.expired : ""}>
                        {new Date(coupon.expiresAt).toLocaleDateString("ko-KR")}
                      </span>
                    </td>
                    <td>
                      {isExpired ? (
                        <span className={styles.statusExpired}>만료됨</span>
                      ) : isMaxUsed ? (
                        <span className={styles.statusMaxUsed}>소진됨</span>
                      ) : coupon.isActive ? (
                        <span className={styles.statusActive}>활성</span>
                      ) : (
                        <span className={styles.statusInactive}>비활성</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.toggleButton}
                          onClick={() => handleToggleActive(coupon)}
                          disabled={isExpired}
                          title={coupon.isActive ? "비활성화" : "활성화"}
                        >
                          {coupon.isActive ? "⏸" : "▶"}
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          title="삭제"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 사용자 상세 모달 */}
      {selectedCoupon && (
        <div className={styles.modal} onClick={() => setSelectedCoupon(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>쿠폰 사용 내역</h3>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedCoupon(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.couponInfo}>
                <p>
                  <strong>코드:</strong> <code>{selectedCoupon.code}</code>
                </p>
                <p>
                  <strong>할인 금액:</strong>{" "}
                  {selectedCoupon.discountAmount.toLocaleString()}원
                </p>
                <p>
                  <strong>사용 횟수:</strong> {selectedCoupon.usedCount}
                  {selectedCoupon.maxUses ? `/${selectedCoupon.maxUses}` : ""}
                </p>
              </div>

              {selectedCoupon.usedBy && selectedCoupon.usedBy.length > 0 ? (
                <table className={styles.usageTable}>
                  <thead>
                    <tr>
                      <th>사용자</th>
                      <th>이메일</th>
                      <th>사용 일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCoupon.usedBy.map((usage, index) => (
                      <tr key={index}>
                        <td>{usage.userName}</td>
                        <td>{usage.userEmail}</td>
                        <td>
                          {new Date(usage.usedAt).toLocaleString("ko-KR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noUsage}>
                  사용 내역이 없거나 상세 정보를 불러올 수 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 대량 생성 결과 모달 */}
      {showCreatedModal && createdCoupons.length > 0 && (
        <div
          className={styles.modal}
          onClick={() => setShowCreatedModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>쿠폰 생성 완료</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowCreatedModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.createdCount}>
                {createdCoupons.length}개의 쿠폰이 생성되었습니다.
              </p>

              <div className={styles.copyAllSection}>
                <button
                  className={styles.copyAllButton}
                  onClick={() => {
                    const codes = createdCoupons.map((c) => c.code).join("\n");
                    navigator.clipboard.writeText(codes);
                    alert("모든 쿠폰 코드가 복사되었습니다.");
                  }}
                >
                  전체 복사
                </button>
              </div>

              <div className={styles.createdCouponsList}>
                {createdCoupons.map((coupon, index) => (
                  <div key={coupon.id} className={styles.createdCouponItem}>
                    <span className={styles.couponIndex}>{index + 1}</span>
                    <code className={styles.couponCode}>{coupon.code}</code>
                    <button
                      className={styles.copyButton}
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        alert(`${coupon.code} 복사됨`);
                      }}
                    >
                      복사
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
