import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Zero to N</h1>
        <p className={styles.logoSub}>제로투앤</p>
        <p className={styles.tagline}>
          0에서 N까지, 기업의 다음 단계를 함께 만듭니다
        </p>
      </div>

      <section className={styles.introSection}>
        <p className={styles.introText}>
          제로투앤(Zero to N)은 전략 중심의 경영컨설팅 및 컴퍼니빌딩 전문
          파트너입니다. 초기 스타트업부터 성장기 중소·중견기업에 이르기까지,
          사업 성장의 전 주기를 체계적으로 지원합니다.
        </p>
      </section>

      <section className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>핵심 서비스</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <StrategyIcon />
            </div>
            <h3 className={styles.serviceTitle}>사업모델 분석 및 성장전략</h3>
            <p className={styles.serviceDescription}>
              시장진입 전략 설계를 통해 기업의 경쟁력 있는 포지셔닝을 구축합니다.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <InvestIcon />
            </div>
            <h3 className={styles.serviceTitle}>투자유치 지원</h3>
            <p className={styles.serviceDescription}>
              IR 자료 및 사업계획서 작성·고도화를 통해 자금조달 성공률을
              높입니다.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <OperationIcon />
            </div>
            <h3 className={styles.serviceTitle}>BPO 경영지원 및 V-COO</h3>
            <p className={styles.serviceDescription}>
              실질적인 실행력을 강화하는 경영지원 서비스를 제공합니다.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <CertIcon />
            </div>
            <h3 className={styles.serviceTitle}>인증 및 정부사업 대응</h3>
            <p className={styles.serviceDescription}>
              ISO, 벤처기업 인증 등을 통해 기업의 신뢰성과 시장 입지를
              공고히합니다.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <GlobalIcon />
            </div>
            <h3 className={styles.serviceTitle}>글로벌 진출 지원</h3>
            <p className={styles.serviceDescription}>
              해외시장 진입 전략 수립과 현지화 지원으로 성공적인 국제화를
              돕습니다.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <AIIcon />
            </div>
            <h3 className={styles.serviceTitle}>AI 사업계획서 (StartPlan)</h3>
            <p className={styles.serviceDescription}>
              AI 기반 사업계획서 자동 생성 서비스로 빠르고 전문적인 문서를
              제공합니다.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.differenceSection}>
        <h3 className={styles.differenceTitle}>제로투앤의 차별점</h3>
        <p className={styles.differenceText}>
          제로투앤은 이론적 자문에 그치지 않습니다. 현장 중심의 실행 가능한
          전략과 즉시 적용할 수 있는 솔루션을 설계하고, 기업과 함께 이를 직접
          수행함으로써 실질적인 성과 창출에 기여합니다.
        </p>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>함께 성장할 준비가 되셨나요?</h2>
        <p className={styles.ctaDescription}>
          지금 바로 AI 사업계획서를 시작하거나, 전문 컨설팅을 문의해 보세요.
        </p>
        <a href="/project/wizard" className={styles.ctaButton}>
          AI 사업계획서 시작하기
        </a>
      </section>
    </div>
  );
}

function StrategyIcon() {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function InvestIcon() {
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
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function OperationIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CertIcon() {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function GlobalIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function AIIcon() {
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
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <path d="M7.5 13a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
      <path d="M16.5 13a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
    </svg>
  );
}
