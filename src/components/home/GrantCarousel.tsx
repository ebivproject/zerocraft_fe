"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GrantCard from "./GrantCard";
import { MOCK_GRANTS } from "./mockData";
import styles from "./GrantCarousel.module.css";

export default function GrantCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // 픽셀/프레임

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

        // 스크롤이 끝에 도달하면 처음으로 돌아감
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
  }, [isPaused]);

  // 무한 스크롤을 위해 데이터를 복제
  const duplicatedGrants = [...MOCK_GRANTS, ...MOCK_GRANTS];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>
            <FireIcon />
            인기 지원사업
          </h2>
          <p className={styles.subtitle}>
            가장 많이 조회된 지원사업을 확인하세요
          </p>
        </div>
        <Link href="/grants" className={styles.viewAll}>
          전체보기
          <ArrowIcon />
        </Link>
      </div>

      <div
        className={styles.carouselWrapper}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={styles.gradientLeft} />
        <div ref={scrollRef} className={styles.carousel}>
          {duplicatedGrants.map((grant, index) => (
            <GrantCard key={`${grant.id}-${index}`} grant={grant} />
          ))}
        </div>
        <div className={styles.gradientRight} />
      </div>
    </section>
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
