"use client";

import { useState } from "react";
import styles from "./TagFilter.module.css";
import TagModal from "./TagModal";

// 모든 태그 목록
export const ALL_TAGS = [
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

// 기본으로 보여줄 태그 4개
const DEFAULT_TAGS = ALL_TAGS.slice(0, 4);

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function TagFilter({
  selectedTags,
  onTagToggle,
}: TagFilterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.tagList}>
        {DEFAULT_TAGS.map((tag) => (
          <button
            key={tag}
            className={`${styles.tag} ${
              selectedTags.includes(tag) ? styles.active : ""
            }`}
            onClick={() => onTagToggle(tag)}
          >
            #{tag}
          </button>
        ))}
        <button
          className={styles.moreButton}
          onClick={() => setIsModalOpen(true)}
        >
          <MoreIcon />
          태그 더보기
        </button>
      </div>

      <TagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTags={selectedTags}
        onTagToggle={onTagToggle}
      />
    </div>
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
