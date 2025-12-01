import styles from "../page.module.css";

export default function GrantDetailPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <ConstructionIcon />
        </div>
        <h1 className={styles.title}>준비중</h1>
        <p className={styles.description}>
          지원사업 상세 페이지를 준비하고 있습니다.
          <br />
          더 나은 서비스로 곧 찾아뵙겠습니다.
        </p>
        <a href="/" className={styles.backButton}>
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

function ConstructionIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m15.5 7.5-2.12 2.12" />
      <path d="M20 12h-4" />
      <path d="m15.5 16.5-2.12-2.12" />
      <path d="M12 20v-4" />
      <path d="m8.5 16.5 2.12-2.12" />
      <path d="M4 12h4" />
      <path d="m8.5 7.5 2.12 2.12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
