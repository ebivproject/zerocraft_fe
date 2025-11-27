"use client";

import { useEffect, useRef } from "react";
import { ALL_TAGS } from "./TagFilter";
import styles from "./TagModal.module.css";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function TagModal({
  isOpen,
  onClose,
  selectedTags,
  onTagToggle,
}: TagModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>태그 선택</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <p className={styles.description}>
          원하는 태그를 선택하여 지원사업을 필터링하세요.
        </p>

        <div className={styles.tagGrid}>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              className={`${styles.tag} ${
                selectedTags.includes(tag) ? styles.active : ""
              }`}
              onClick={() => onTagToggle(tag)}
            >
              <span className={styles.tagIcon}>
                {selectedTags.includes(tag) ? <CheckIcon /> : <PlusIcon />}
              </span>
              #{tag}
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.selectedCount}>
            {selectedTags.length}개 선택됨
          </span>
          <div className={styles.footerButtons}>
            <button
              className={styles.clearButton}
              onClick={() => selectedTags.forEach(onTagToggle)}
              disabled={selectedTags.length === 0}
            >
              초기화
            </button>
            <button className={styles.applyButton} onClick={onClose}>
              적용하기
            </button>
          </div>
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
