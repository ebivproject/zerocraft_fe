"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { couponsApi } from "@/lib/api/credits";
import { Coupon } from "@/types/auth";
import styles from "./page.module.css";

export default function AdminCouponsPage() {
  const router = useRouter();
  // useAuthStore는 getState()로만 사용
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 쿠폰 생성 폼 상태
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountAmount: 30000,
    expiresAt: "",
    maxUses: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Hydration 완료 대기
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 권한 체크 (hydration 완료 후, API에서 최신 정보 확인)
  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login?redirect=/admin/coupons");
        return;
      }

      // API에서 최신 사용자 정보 가져오기
      try {
        const { fetchMe } = useAuthStore.getState();
        await fetchMe();
      } catch {
        // fetchMe 실패 시 무시 (내부에서 처리됨)
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

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      await couponsApi.create({
        code: formData.code.toUpperCase(),
        discountAmount: formData.discountAmount,
        expiresAt: new Date(formData.expiresAt).toISOString(),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        description: formData.description || undefined,
      });

      // 폼 초기화
      setFormData({
        code: "",
        discountAmount: 30000,
        expiresAt: "",
        maxUses: "",
        description: "",
      });
      setShowCreateForm(false);

      // 목록 새로고침
      fetchCoupons();
    } catch (err) {
      console.error("쿠폰 생성 실패:", err);
      setError("쿠폰 생성에 실패했습니다.");
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
    setFormData((prev) => ({ ...prev, code }));
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
          <h1 className={styles.title}>쿠폰 관리</h1>
          <p className={styles.subtitle}>쿠폰을 생성하고 관리합니다.</p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "취소" : "+ 쿠폰 생성"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* 쿠폰 생성 폼 */}
      {showCreateForm && (
        <form className={styles.createForm} onSubmit={handleCreateCoupon}>
          <h3>새 쿠폰 생성</h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>쿠폰 코드</label>
              <div className={styles.codeInput}>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                value={formData.discountAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
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
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>최대 사용 횟수 (비워두면 무제한)</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, maxUses: e.target.value }))
                }
                min="1"
                placeholder="무제한"
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label>설명</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
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
                <th>사용/최대</th>
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
                    className={!coupon.isActive || isExpired ? styles.inactive : ""}
                  >
                    <td>
                      <code className={styles.couponCode}>{coupon.code}</code>
                    </td>
                    <td>{coupon.description || "-"}</td>
                    <td className={styles.amount}>
                      -{coupon.discountAmount.toLocaleString()}원
                    </td>
                    <td>
                      {coupon.usedCount}
                      {coupon.maxUses ? `/${coupon.maxUses}` : "/∞"}
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
                        >
                          {coupon.isActive ? "비활성화" : "활성화"}
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          삭제
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
    </div>
  );
}
