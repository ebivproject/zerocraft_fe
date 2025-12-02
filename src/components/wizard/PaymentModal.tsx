"use client";

import { useState } from "react";
import { couponsApi, paymentRequestsApi } from "@/lib/api/credits";
import { Coupon } from "@/types/auth";
import styles from "./PaymentModal.module.css";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (creditsAdded: number) => void;
}

const ORIGINAL_PRICE = 50000; // 정가

// 입금 계좌 정보
const BANK_INFO = {
  bankName: "하나은행",
  accountNumber: "365-911029-24804",
  accountHolder: "제로투앤 주식회사",
};

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentComplete,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 쿠폰 관련 상태
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // 무통장 입금 관련 상태
  const [depositorName, setDepositorName] = useState("");
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  // 가격 계산
  const calculatePrice = () => {
    if (appliedCoupon) {
      const discountedPrice = ORIGINAL_PRICE - appliedCoupon.discountAmount;
      return {
        originalPrice: ORIGINAL_PRICE,
        discountAmount: appliedCoupon.discountAmount,
        finalPrice: Math.max(0, discountedPrice),
        couponApplied: true,
      };
    }
    return {
      originalPrice: ORIGINAL_PRICE,
      discountAmount: 0,
      finalPrice: ORIGINAL_PRICE,
      couponApplied: false,
    };
  };

  const priceInfo = calculatePrice();

  // 쿠폰 적용
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("쿠폰 코드를 입력해주세요.");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const response = await couponsApi.validate(couponCode.trim());
      console.log("쿠폰 검증 응답:", response);

      if (response.valid && response.coupon) {
        console.log("쿠폰 할인금액:", response.coupon.discountAmount);
        setAppliedCoupon(response.coupon);
        setCouponError(null);
      } else {
        setCouponError(response.message || "유효하지 않은 쿠폰입니다.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error("쿠폰 검증 오류:", err);
      setCouponError("쿠폰 확인 중 오류가 발생했습니다.");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // 쿠폰 제거
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  // 무통장 입금 요청
  const handleTransferRequest = async () => {
    if (!depositorName.trim()) {
      setError("입금자명을 입력해주세요.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await paymentRequestsApi.create({
        depositorName: depositorName.trim(),
        amount: priceInfo.finalPrice,
        couponCode: appliedCoupon?.code,
      });
      setTransferSubmitted(true);
    } catch (err) {
      console.error("입금 요청 오류:", err);
      setError("입금 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 모달 닫을 때 상태 초기화
  const handleClose = () => {
    setError(null);
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
    setIsProcessing(false);
    setDepositorName("");
    setTransferSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>이용권 구매</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          {/* 상품 정보 */}
          <div className={styles.productInfo}>
            <div className={styles.productIcon}>
              <DocumentIcon />
            </div>
            <div className={styles.productDetails}>
              <h3>AI 사업계획서 생성</h3>
              <p>정부지원사업 맞춤형 사업계획서</p>
            </div>
            <div className={styles.productPrice}>
              {priceInfo.couponApplied && (
                <span className={styles.originalPrice}>
                  {ORIGINAL_PRICE.toLocaleString()}원
                </span>
              )}
              <span className={styles.finalPrice}>
                {priceInfo.finalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          {transferSubmitted ? (
            <div className={styles.successMessage}>
              <h4>입금 확인 요청이 접수되었습니다</h4>
              <p>
                입금 확인 후 이용권이 지급됩니다.
                <br />
                영업일 기준 1-2일 내에 처리됩니다.
              </p>
            </div>
          ) : (
            <>
              {/* 쿠폰 입력 */}
              <div className={styles.couponSection}>
                <h4>쿠폰 코드</h4>
                {appliedCoupon ? (
                  <div className={styles.appliedCoupon}>
                    <div className={styles.couponInfo}>
                      <CouponIcon />
                      <span className={styles.couponName}>
                        {appliedCoupon.description || appliedCoupon.code}
                      </span>
                      <span className={styles.couponDiscount}>
                        -{appliedCoupon.discountAmount.toLocaleString()}원
                      </span>
                    </div>
                    <button
                      className={styles.removeCouponButton}
                      onClick={handleRemoveCoupon}
                    >
                      제거
                    </button>
                  </div>
                ) : (
                  <div className={styles.couponInput}>
                    <input
                      type="text"
                      placeholder="쿠폰 코드를 입력하세요"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      disabled={isValidatingCoupon}
                    />
                    <button
                      className={styles.applyCouponButton}
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                    >
                      {isValidatingCoupon ? "확인 중..." : "적용"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className={styles.couponError}>{couponError}</p>
                )}
              </div>

              {/* 계좌 정보 */}
              <div className={styles.bankInfo}>
                <h4>입금 계좌 정보</h4>
                <div className={styles.bankDetail}>
                  <span>은행명</span>
                  <span>{BANK_INFO.bankName}</span>
                </div>
                <div className={styles.bankDetail}>
                  <span>계좌번호</span>
                  <span>{BANK_INFO.accountNumber}</span>
                </div>
                <div className={styles.bankDetail}>
                  <span>예금주</span>
                  <span>{BANK_INFO.accountHolder}</span>
                </div>
              </div>

              {/* 결제 금액 */}
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>상품 금액</span>
                  <span>{ORIGINAL_PRICE.toLocaleString()}원</span>
                </div>
                {priceInfo.discountAmount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>쿠폰 할인</span>
                    <span className={styles.discount}>
                      -{priceInfo.discountAmount.toLocaleString()}원
                    </span>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>입금 금액</span>
                  <span>{priceInfo.finalPrice.toLocaleString()}원</span>
                </div>
              </div>

              {/* 입금자명 입력 */}
              <div className={styles.transferForm}>
                <div>
                  <label>입금자명</label>
                  <input
                    type="text"
                    placeholder="실제 입금하실 분의 성함을 입력하세요"
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <div className={styles.transferNotice}>
                  입금 후 관리자 확인이 완료되면 이용권이 지급됩니다.
                  <br />
                  입금자명이 다를 경우 확인이 지연될 수 있습니다.
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && <div className={styles.errorMessage}>{error}</div>}

              {/* 입금 확인 요청 버튼 */}
              <button
                className={styles.requestButton}
                onClick={handleTransferRequest}
                disabled={isProcessing || !depositorName.trim()}
              >
                {isProcessing ? (
                  <>
                    <SpinnerIcon />
                    요청 중...
                  </>
                ) : (
                  <>입금 확인 요청</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="32"
      height="32"
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
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className={styles.spinner}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CouponIcon() {
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
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
