"use client";

import { useState, useEffect, useRef } from "react";
import {
  loadTossPayments,
  TossPaymentsPayment,
} from "@tosspayments/tosspayments-sdk";
import { paymentsApi, couponsApi, paymentRequestsApi } from "@/lib/api/credits";
import { Coupon } from "@/types/auth";
import styles from "./PaymentModal.module.css";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (creditsAdded: number) => void;
}

type PaymentTabType = "card" | "transfer";

const ORIGINAL_PRICE = 50000; // 정가
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

// 입금 계좌 정보 (실제 정보로 변경 필요)
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

  // 결제 탭
  const [activeTab, setActiveTab] = useState<PaymentTabType>("card");

  // 쿠폰 관련 상태
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // 무통장 입금 관련 상태
  const [depositorName, setDepositorName] = useState("");
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  // 토스페이먼츠
  const paymentRef = useRef<TossPaymentsPayment | null>(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);

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

  // 토스페이먼츠 초기화
  useEffect(() => {
    if (!isOpen || !TOSS_CLIENT_KEY) return;

    const initPayment = async () => {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        paymentRef.current = tossPayments.payment({
          customerKey: `customer_${Date.now()}`,
        });
        setIsPaymentReady(true);
      } catch (err) {
        console.error("토스페이먼츠 초기화 오류:", err);
        setError("결제 모듈을 불러오는데 실패했습니다.");
      }
    };

    initPayment();

    return () => {
      paymentRef.current = null;
      setIsPaymentReady(false);
    };
  }, [isOpen]);

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

      if (response.valid && response.coupon) {
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

  // 결제 요청
  const handlePayment = async () => {
    // 금액이 0원이면 무료 처리
    if (priceInfo.finalPrice === 0) {
      setIsProcessing(true);
      setError(null);
      try {
        const createResponse = await paymentsApi.create({
          productId: "business_plan_1",
          ...(appliedCoupon && { couponCode: appliedCoupon.code }),
        });

        const confirmResponse = await paymentsApi.confirm({
          orderId: createResponse.orderId,
          paymentKey: "FREE_PAYMENT",
          amount: 0,
        });

        if (confirmResponse.status === "completed") {
          onPaymentComplete(confirmResponse.creditsAdded);
        }
      } catch (err) {
        console.error("무료 결제 오류:", err);
        setError("결제 처리 중 오류가 발생했습니다.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (!paymentRef.current) {
      setError("결제 모듈이 준비되지 않았습니다.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. 백엔드에서 결제 준비 (orderId 생성)
      const createResponse = await paymentsApi.create({
        productId: "business_plan_1",
        ...(appliedCoupon && { couponCode: appliedCoupon.code }),
      });

      // 2. 토스페이먼츠 결제창 호출
      await paymentRef.current.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: createResponse.amount,
        },
        orderId: createResponse.orderId,
        orderName: createResponse.productName,
        customerName: createResponse.customerName,
        customerEmail: createResponse.customerEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error("결제 오류:", err);
      setError(
        err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다."
      );
      setIsProcessing(false);
    }
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
    paymentRef.current = null;
    setIsPaymentReady(false);
    setError(null);
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
    setIsProcessing(false);
    setActiveTab("card");
    setDepositorName("");
    setTransferSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>결제하기</h2>
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

          {/* 결제 방식 탭 */}
          <div className={styles.paymentTabs}>
            <button
              className={`${styles.paymentTab} ${
                activeTab === "card" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("card")}
            >
              카드 결제
            </button>
            <button
              className={`${styles.paymentTab} ${
                activeTab === "transfer" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("transfer")}
            >
              무통장 입금
            </button>
          </div>

          {/* 카드 결제 탭 */}
          {activeTab === "card" && (
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
                  <span>결제 금액</span>
                  <span>{priceInfo.finalPrice.toLocaleString()}원</span>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && <div className={styles.errorMessage}>{error}</div>}

              {/* 결제 버튼 */}
              <button
                className={styles.payButton}
                onClick={handlePayment}
                disabled={
                  isProcessing || (priceInfo.finalPrice > 0 && !isPaymentReady)
                }
              >
                {isProcessing ? (
                  <>
                    <SpinnerIcon />
                    결제 처리 중...
                  </>
                ) : priceInfo.finalPrice === 0 ? (
                  <>무료로 이용권 받기</>
                ) : (
                  <>{priceInfo.finalPrice.toLocaleString()}원 결제하기</>
                )}
              </button>

              <p className={styles.notice}>
                결제 완료 후 바로 AI 사업계획서 생성이 시작됩니다.
              </p>
            </>
          )}

          {/* 무통장 입금 탭 */}
          {activeTab === "transfer" && (
            <div className={styles.bankTransferSection}>
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
                    <div className={styles.bankDetail}>
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
