"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function SearchBar({
  selectedTags,
  onTagToggle,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

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

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchInputContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="지원사업을 검색해보세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              className={styles.clearButton}
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
            >
              <ClearIcon />
            </button>
          )}
        </div>
        <button className={styles.searchButton} onClick={handleSearch}>
          검색
        </button>
      </div>

      {selectedTags.length > 0 && (
        <div className={styles.selectedTags}>
          {selectedTags.map((tag) => (
            <span key={tag} className={styles.selectedTag}>
              #{tag}
              <button
                className={styles.removeTag}
                onClick={() => onTagToggle(tag)}
                aria-label={`${tag} 태그 제거`}
              >
                <ClearIcon />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

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
