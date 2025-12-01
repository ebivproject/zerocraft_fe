"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "이용권",
    question: "이용권은 어떻게 사용하나요?",
    answer:
      "이용권 1매로 AI 사업계획서 1회를 생성할 수 있습니다. 생성된 사업계획서는 마이페이지에서 언제든지 다시 다운로드할 수 있습니다.",
  },
  {
    category: "이용권",
    question: "이용권의 유효기간이 있나요?",
    answer: "이용권의 유효기간은 무제한으로 제공됩니다.",
  },
  {
    category: "쿠폰",
    question: "쿠폰은 어떻게 사용하나요?",
    answer:
      "구매하기 버튼을 클릭하면 나오는 결제 화면에서 쿠폰 코드를 입력할 수 있습니다. 유효한 쿠폰 적용 시 할인된 가격으로 결제됩니다.",
  },
  {
    category: "쿠폰",
    question: "쿠폰을 여러 개 사용할 수 있나요?",
    answer:
      "쿠폰은 1회 결제 시 1개만 적용 가능합니다. 여러 개의 쿠폰을 보유하고 있다면 각각 다른 결제에 사용해 주세요.",
  },
  {
    category: "사업계획서",
    question: "AI 사업계획서는 어떤 형식으로 제공되나요?",
    answer:
      "AI 사업계획서는 정부지원사업 공고에서 요구하는 일반적인 양식을 기반으로 작성됩니다. DOCX 파일로 다운로드되어 Microsoft Word에서 편집할 수 있습니다.",
  },
  {
    category: "사업계획서",
    question: "생성된 사업계획서를 수정할 수 있나요?",
    answer:
      "네, 다운로드한 DOCX 파일은 Microsoft Word에서 자유롭게 수정할 수 있습니다. AI가 생성한 내용을 기반으로 필요한 부분을 추가하거나 수정하여 사용하세요.",
  },
  {
    category: "사업계획서",
    question: "같은 내용으로 다시 생성할 수 있나요?",
    answer:
      "새로운 사업계획서를 생성하려면 이용권 1매가 추가로 필요합니다. 이전에 생성한 사업계획서는 마이페이지에서 다시 다운로드할 수 있습니다.",
  },
  {
    category: "결제",
    question: "환불이 가능한가요?",
    answer:
      "이용권 사용 전이라면 전액 환불이 가능합니다. 환불을 원하시면 카카오톡 채널(@스인터)로 문의해 주세요.",
  },
  {
    category: "결제",
    question: "어떤 결제 수단을 사용할 수 있나요?",
    answer: "현재 토스 페이먼츠 결제 수단을 지원합니다.",
  },
  {
    category: "기타",
    question: "전문가 상담은 어떻게 진행되나요?",
    answer:
      "전문가 상담은 카카오톡 채널을 통해 신청할 수 있습니다. 전문 컨설턴트가 1:1로 사업계획서 작성 및 정부지원사업 전략 수립을 도와드립니다.",
  },
  {
    category: "기타",
    question: "문의사항이 있으면 어디로 연락하나요?",
    answer:
      "카카오톡 채널 '스타트업인증센터'(@스인터)로 문의해 주세요. 빠르게 답변해 드리겠습니다.",
  },
];

const CATEGORIES = ["전체", "이용권", "쿠폰", "사업계획서", "결제", "기타"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs =
    selectedCategory === "전체"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>자주 묻는 질문</h1>
        <p className={styles.subtitle}>
          StartPlan 이용에 대해 궁금한 점을 확인해보세요
        </p>
      </div>

      <div className={styles.categoryTabs}>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`${styles.categoryTab} ${
              selectedCategory === category ? styles.active : ""
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setOpenIndex(null);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.faqList}>
        {filteredFAQs.map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${
              openIndex === index ? styles.open : ""
            }`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => toggleFAQ(index)}
            >
              <span className={styles.categoryBadge}>{item.category}</span>
              <span className={styles.questionText}>{item.question}</span>
              <ChevronIcon className={styles.chevron} />
            </button>
            <div className={styles.faqAnswer}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contactSection}>
        <h2>원하는 답변을 찾지 못하셨나요?</h2>
        <p>카카오톡 채널로 문의해 주시면 빠르게 답변해 드립니다.</p>
        <a
          href="http://pf.kakao.com/_Ejxcxns/chat"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactButton}
        >
          <KakaoIcon />
          카카오톡으로 문의하기
        </a>
      </div>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.79 5.13 4.5 6.49-.197.72-.73 2.62-.84 3.019-.131.48.177.473.373.344.154-.101 2.452-1.66 3.446-2.33.48.07.973.107 1.477.107.09 0 .18-.001.269-.003h.044c5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
    </svg>
  );
}
