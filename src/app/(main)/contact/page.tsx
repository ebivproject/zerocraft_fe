import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>문의하기</h1>
          <p className={styles.subtitle}>
            궁금한 점이 있으시면 카카오톡으로 편하게 문의해주세요
          </p>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.kakaoSection}>
            <div className={styles.kakaoIcon}>
              <KakaoIcon />
            </div>
            <div className={styles.kakaoInfo}>
              <h2 className={styles.channelName}>스타트업인증센터</h2>
              <p className={styles.channelId}>@스인터</p>
            </div>
          </div>

          <div className={styles.description}>
            <p>
              카카오톡 채널을 통해 빠르고 편리하게 상담받으실 수 있습니다.
              <br />
              서비스 이용, 결제, 환불 등 모든 문의사항을 접수해 드립니다.
            </p>
          </div>

          <a
            href="http://pf.kakao.com/_Ejxcxns/chat"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.chatButton}
          >
            <ChatIcon />
            카카오톡 채널 채팅하기
          </a>

          <div className={styles.searchGuide}>
            <p>
              <strong>카카오톡에서 직접 검색하기</strong>
            </p>
            <p>
              카카오톡 앱에서 <span className={styles.highlight}>@스인터</span>{" "}
              를 검색해주세요
            </p>
          </div>
        </div>

        <a href="/" className={styles.backButton}>
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.79 5.13 4.5 6.49-.197.72-.73 2.62-.84 3.019-.131.48.177.473.373.344.154-.101 2.452-1.66 3.446-2.33.48.07.973.107 1.477.107.09 0 .18-.001.269-.003h.044c5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
    </svg>
  );
}

function ChatIcon() {
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
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

