"use client";

import Link from "next/link";
import { MockGrant } from "./mockData";
import styles from "./GrantCard.module.css";

interface GrantCardProps {
  grant: MockGrant;
}

export default function GrantCard({ grant }: GrantCardProps) {
  const getStatusBadge = () => {
    switch (grant.status) {
      case "open":
        return <span className={`${styles.badge} ${styles.open}`}>모집중</span>;
      case "upcoming":
        return (
          <span className={`${styles.badge} ${styles.upcoming}`}>예정</span>
        );
      case "closed":
        return <span className={`${styles.badge} ${styles.closed}`}>마감</span>;
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
      <div className={styles.cardHeader}>
        {getStatusBadge()}
        <span className={styles.views}>
          <EyeIcon />
          {formatViews(grant.views)}
        </span>
      </div>

      <h3 className={styles.title}>{grant.title}</h3>

      <p className={styles.organization}>{grant.organization}</p>

      <div className={styles.cardFooter}>
        <span className={styles.amount}>{grant.amount}</span>
        <span className={styles.deadline}>
          {formatDeadline(grant.deadline)}
        </span>
      </div>

      <div className={styles.tags}>
        {grant.tags.slice(0, 2).map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
    </Link>
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
