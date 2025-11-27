"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { grantsApi } from "@/lib/api/grants";
import { Grant } from "@/types/grant";
import styles from "./page.module.css";

// --- Types & Constants ---

const ALL_TAGS = [
  "창업지원",
  "R&D",
  "수출지원",
  "고용지원",
  "금융지원",
  "마케팅",
  "교육훈련",
  "컨설팅",
  "시설지원",
  "기술개발",
  "소상공인",
  "중소기업",
  "벤처기업",
  "예비창업자",
  "청년창업",
  "여성기업",
  "사회적기업",
  "1인기업",
];

const DEFAULT_TAGS = ALL_TAGS.slice(0, 4);

// Fallback Mock 데이터 (API 실패 시 사용)
const FALLBACK_GRANTS: Grant[] = [
  {
    id: "1",
    title: "2025년 창업성장기술개발사업 디딤돌 창업과제",
    organization: "중소벤처기업부",
    deadline: "2025-01-15",
    amount: "최대 1억원",
    category: "창업지원",
    tags: ["창업지원", "기술개발", "예비창업자"],
    views: 15420,
    status: "open",
  },
  {
    id: "2",
    title: "혁신창업사업화자금 (융자)",
    organization: "중소벤처기업진흥공단",
    deadline: "2025-02-28",
    amount: "최대 10억원",
    category: "금융지원",
    tags: ["금융지원", "창업지원", "중소기업"],
    views: 12350,
    status: "open",
  },
  {
    id: "3",
    title: "수출바우처사업",
    organization: "KOTRA",
    deadline: "2025-01-31",
    amount: "최대 1억원",
    category: "수출지원",
    tags: ["수출지원", "마케팅", "중소기업"],
    views: 11200,
    status: "open",
  },
  {
    id: "4",
    title: "청년창업사관학교 14기 모집",
    organization: "중소벤처기업부",
    deadline: "2025-03-15",
    amount: "최대 1억원",
    category: "창업지원",
    tags: ["창업지원", "청년창업", "교육훈련"],
    views: 10890,
    status: "upcoming",
  },
  {
    id: "5",
    title: "소상공인 정책자금 (일반경영안정자금)",
    organization: "소상공인시장진흥공단",
    deadline: "2025-12-31",
    amount: "최대 7천만원",
    category: "금융지원",
    tags: ["금융지원", "소상공인"],
    views: 9750,
    status: "open",
  },
  {
    id: "6",
    title: "여성기업 종합지원사업",
    organization: "여성기업종합지원센터",
    deadline: "2025-02-15",
    amount: "최대 5천만원",
    category: "창업지원",
    tags: ["창업지원", "여성기업", "컨설팅"],
    views: 8900,
    status: "open",
  },
  {
    id: "7",
    title: "R&D 바우처 사업",
    organization: "중소벤처기업부",
    deadline: "2025-01-20",
    amount: "최대 7천만원",
    category: "R&D",
    tags: ["R&D", "기술개발", "벤처기업"],
    views: 8450,
    status: "open",
  },
  {
    id: "8",
    title: "고용창출장려금 지원사업",
    organization: "고용노동부",
    deadline: "2025-12-31",
    amount: "월 최대 80만원",
    category: "고용지원",
    tags: ["고용지원", "중소기업"],
    views: 7600,
    status: "open",
  },
  {
    id: "9",
    title: "사회적기업 육성사업",
    organization: "고용노동부",
    deadline: "2025-02-28",
    amount: "최대 3억원",
    category: "창업지원",
    tags: ["창업지원", "사회적기업"],
    views: 6800,
    status: "open",
  },
  {
    id: "10",
    title: "스마트공장 구축 지원사업",
    organization: "중소벤처기업부",
    deadline: "2025-03-31",
    amount: "최대 4억원",
    category: "시설지원",
    tags: ["시설지원", "기술개발", "중소기업"],
    views: 6200,
    status: "upcoming",
  },
];

// --- Main Page Component ---

export default function HomePage() {
  const [grants, setGrants] = useState<Grant[]>(FALLBACK_GRANTS);
  const [isLoadingGrants, setIsLoadingGrants] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isIntro, setIsIntro] = useState(true);

  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch grants from API
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setIsLoadingGrants(true);
        const response = await grantsApi.getGrants({
          limit: "10",
          sort: "deadline",
          order: "asc",
        });
        if (response.data && response.data.length > 0) {
          setGrants(response.data);
        }
      } catch (error) {
        console.error("지원사업 목록 조회 실패:", error);
        // API 실패 시 fallback 데이터 유지
      } finally {
        setIsLoadingGrants(false);
      }
    };

    fetchGrants();
  }, []);

  // Intro Animation Effect
  useEffect(() => {
    // Wait for logo drawing to complete (approx 2s) before moving
    const timer = setTimeout(() => {
      setIsIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Carousel Animation Effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isCarouselPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

        // Reset when reaching half of the duplicated content
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isCarouselPaused]);

  // Handlers
  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));

    router.push(`/grants?${params.toString()}`);
  }, [query, selectedTags, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Duplicated grants for infinite scroll
  const duplicatedGrants = [...grants, ...grants];

  return (
    <div className={styles.pageContainer}>
      {/* Section 1: Logo & Intro */}
      <section
        className={`${styles.heroSection} ${isIntro ? styles.intro : ""}`}
      >
        {/* Animated Logo */}
        <div className={styles.logo_container}>
          <p className={styles.logo_tagline}>AI 기반 사업계획서 작성 도우미</p>
          <svg
            viewBox="0 0 600 120"
            className={styles.logo_svg}
            aria-label="ZeroCraft"
          >
            <defs>
              <linearGradient
                id="logoGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#7B9EFF" />
                <stop offset="50%" stopColor="#5B7CFA" />
                <stop offset="100%" stopColor="#4361EE" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <text
              x="50%"
              y="50%"
              dy=".35em"
              textAnchor="middle"
              className={styles.logo_text}
            >
              ZeroCraft
            </text>
          </svg>

          <button
            className={styles.ai_cta_button}
            onClick={() => router.push("/project/wizard")}
          >
            <SparklesIcon />
            AI로 바로 사업계획서 작성하기
          </button>
        </div>
      </section>

      {/* Section 2: Search & Popular Grants */}
      <section className={styles.contentSection}>
        {/* Search Section */}
        <div className={styles.search_section}>
          {/* Search Bar */}
          <div className={styles.search_container}>
            <div className={styles.search_wrapper}>
              <div className={styles.search_inputContainer}>
                <SearchIcon className={styles.search_icon} />
                <input
                  type="text"
                  className={styles.search_input}
                  placeholder="지원사업을 검색해보세요..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {query && (
                  <button
                    className={styles.search_clearButton}
                    onClick={() => setQuery("")}
                    aria-label="검색어 지우기"
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>
              <button className={styles.search_button} onClick={handleSearch}>
                검색
              </button>
            </div>

            {selectedTags.length > 0 && (
              <div className={styles.search_selectedTags}>
                {selectedTags.map((tag) => (
                  <span key={tag} className={styles.search_selectedTag}>
                    #{tag}
                    <button
                      className={styles.search_removeTag}
                      onClick={() => handleTagToggle(tag)}
                      aria-label={`${tag} 태그 제거`}
                    >
                      <ClearIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tag Filter */}
          <div className={styles.filter_container}>
            <div className={styles.filter_list}>
              {DEFAULT_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.filter_tag} ${
                    selectedTags.includes(tag) ? styles.active : ""
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  #{tag}
                </button>
              ))}
              <button
                className={styles.filter_moreButton}
                onClick={() => setIsModalOpen(true)}
              >
                <MoreIcon />
                태그 더보기
              </button>
            </div>
          </div>
        </div>

        {/* Popular Grants Carousel */}
        <div className={styles.carousel_section}>
          <div className={styles.carousel_header}>
            <div className={styles.carousel_titleWrapper}>
              <h2 className={styles.carousel_title}>
                <FireIcon />
                실시간 인기 지원사업
              </h2>
              <p className={styles.carousel_subtitle}>
                지금 가장 많은 사람들이 보고 있는 공고입니다
              </p>
            </div>
            <Link href="/grants" className={styles.carousel_viewAll}>
              전체보기
              <ArrowIcon />
            </Link>
          </div>

          <div className={styles.carousel_wrapper}>
            <div className={styles.carousel_gradientLeft} />
            <div className={styles.carousel_gradientRight} />
            <div
              ref={scrollRef}
              className={styles.carousel_track}
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              {duplicatedGrants.map((grant, index) => (
                <GrantCard key={`${grant.id}-${index}`} grant={grant} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tag Modal */}
      {isModalOpen && (
        <TagModal
          onClose={() => setIsModalOpen(false)}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      )}
    </div>
  );
}

// --- Helper Components ---

function GrantCard({ grant }: { grant: Grant }) {
  const getStatusBadge = () => {
    switch (grant.status) {
      case "open":
        return (
          <span className={`${styles.card_badge} ${styles.open}`}>모집중</span>
        );
      case "upcoming":
        return (
          <span className={`${styles.card_badge} ${styles.upcoming}`}>
            예정
          </span>
        );
      case "closed":
        return (
          <span className={`${styles.card_badge} ${styles.closed}`}>마감</span>
        );
    }
  };

  const formatViews = (views: number) => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}만`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}천`;
    }
    return views.toString();
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일 마감`;
  };

  return (
    <Link href={`/grants/${grant.id}`} className={styles.card}>
      <div className={styles.card_header}>
        {getStatusBadge()}
        <span className={styles.card_views}>
          <EyeIcon />
          {formatViews(grant.views ?? 0)}
        </span>
      </div>

      <h3 className={styles.card_title}>{grant.title}</h3>

      <p className={styles.card_organization}>{grant.organization}</p>

      <div className={styles.card_footer}>
        <span className={styles.card_amount}>{grant.amount}</span>
        <span className={styles.card_deadline}>
          {formatDeadline(grant.deadline)}
        </span>
      </div>

      <div className={styles.card_tags}>
        {(grant.tags ?? []).slice(0, 2).map((tag) => (
          <span key={tag} className={styles.card_tag}>
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function TagModal({
  onClose,
  selectedTags,
  onTagToggle,
}: {
  onClose: () => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>태그 선택</h2>
          <button
            className={styles.modal_closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <p className={styles.modal_description}>
          원하는 태그를 선택하여 지원사업을 필터링하세요.
        </p>

        <div className={styles.modal_tagGrid}>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              className={`${styles.modal_tag} ${
                selectedTags.includes(tag) ? styles.active : ""
              }`}
              onClick={() => onTagToggle(tag)}
            >
              <span className={styles.modal_tagIcon}>
                {selectedTags.includes(tag) ? <CheckIcon /> : <PlusIcon />}
              </span>
              #{tag}
            </button>
          ))}
        </div>

        <div className={styles.modal_footer}>
          <span className={styles.modal_selectedCount}>
            {selectedTags.length}개 선택됨
          </span>
          <div className={styles.modal_footerButtons}>
            <button
              className={styles.modal_clearButton}
              onClick={() => selectedTags.forEach(onTagToggle)}
              disabled={selectedTags.length === 0}
            >
              초기화
            </button>
            <button className={styles.modal_applyButton} onClick={onClose}>
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Icons ---

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClearIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function MoreIcon() {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function FireIcon() {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
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

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SparklesIcon() {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
