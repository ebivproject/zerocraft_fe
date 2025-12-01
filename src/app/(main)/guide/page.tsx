import styles from "./page.module.css";

export default function GuidePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>이용가이드</h1>
        <p className={styles.subtitle}>
          StartPlan을 처음 사용하시나요? 아래 가이드를 따라해보세요.
        </p>
      </div>

      <div className={styles.stepsSection}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>회원가입 및 로그인</h2>
            <p className={styles.stepDescription}>
              StartPlan 서비스를 이용하려면 먼저 회원가입이 필요합니다.
              이메일과 비밀번호로 간편하게 가입할 수 있습니다.
            </p>
            <ul className={styles.stepList}>
              <li>우측 상단의 &apos;로그인&apos; 버튼을 클릭합니다</li>
              <li>회원가입 화면에서 이메일, 비밀번호를 입력합니다</li>
              <li>가입 완료 후 로그인하여 서비스를 이용합니다</li>
            </ul>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>이용권 구매</h2>
            <p className={styles.stepDescription}>
              AI 사업계획서를 생성하려면 이용권이 필요합니다.
              이용권 1매로 사업계획서 1회를 생성할 수 있습니다.
            </p>
            <ul className={styles.stepList}>
              <li>상단 메뉴의 &apos;가격&apos;을 클릭합니다</li>
              <li>&apos;구매하기&apos; 버튼을 클릭합니다</li>
              <li>쿠폰이 있다면 쿠폰 코드를 입력하여 할인받을 수 있습니다</li>
              <li>결제 완료 후 이용권이 충전됩니다</li>
            </ul>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>사업계획서 작성</h2>
            <p className={styles.stepDescription}>
              단계별 질문에 답변하면 AI가 전문적인 사업계획서를 자동으로 생성합니다.
            </p>
            <ul className={styles.stepList}>
              <li>메인 페이지에서 &apos;AI 사업계획서 시작&apos; 버튼을 클릭합니다</li>
              <li>회사 정보, 아이템 개요, 문제 인식, 솔루션, 성장 전략, 팀 구성 순으로 정보를 입력합니다</li>
              <li>각 단계에서 &apos;AI 힌트&apos; 버튼을 활용하면 작성에 도움을 받을 수 있습니다</li>
              <li>모든 정보 입력 후 &apos;사업계획서 생성&apos; 버튼을 클릭합니다</li>
            </ul>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>사업계획서 다운로드</h2>
            <p className={styles.stepDescription}>
              생성된 사업계획서는 DOCX 파일로 다운로드할 수 있습니다.
            </p>
            <ul className={styles.stepList}>
              <li>사업계획서 생성이 완료되면 미리보기가 표시됩니다</li>
              <li>&apos;다운로드&apos; 버튼을 클릭하여 DOCX 파일을 저장합니다</li>
              <li>마이페이지에서 이전에 생성한 사업계획서를 다시 다운로드할 수 있습니다</li>
            </ul>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>5</div>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>사업계획서 수정 및 제출</h2>
            <p className={styles.stepDescription}>
              다운로드한 사업계획서를 검토하고 필요한 부분을 수정하여 지원사업에 제출하세요.
            </p>
            <ul className={styles.stepList}>
              <li>다운로드한 DOCX 파일을 Microsoft Word나 한글에서 엽니다</li>
              <li>내용을 검토하고 필요한 부분을 수정합니다</li>
              <li>지원사업 공고의 양식에 맞게 조정합니다</li>
              <li>최종 검토 후 지원사업에 제출합니다</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h2>지금 바로 시작해보세요</h2>
        <p>AI가 도와주는 쉽고 빠른 사업계획서 작성</p>
        <a href="/project/wizard" className={styles.ctaButton}>
          AI 사업계획서 시작하기
        </a>
      </div>
    </div>
  );
}

