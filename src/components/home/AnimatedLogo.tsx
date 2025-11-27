"use client";

import { useEffect, useState } from "react";
import styles from "./AnimatedLogo.module.css";

export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`${styles.logoContainer} ${isVisible ? styles.visible : ""}`}
    >
      <svg
        viewBox="0 0 600 120"
        className={styles.logoSvg}
        aria-label="ZeroCraft"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
          className={styles.text}
        >
          ZeroCraft
        </text>
      </svg>

      <p className={styles.tagline}>AI 기반 사업계획서 작성 도우미</p>
    </div>
  );
}
