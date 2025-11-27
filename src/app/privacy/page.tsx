"use client";

import styles from "./page.module.css";

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>개인정보처리방침</h1>
        <p className={styles.lastUpdated}>최종 수정일: 2025년 11월 28일</p>

        <section className={styles.section}>
          <h2>1. 개인정보의 수집 및 이용 목적</h2>
          <p>
            ZeroCraft(이하 &quot;서비스&quot;)는 다음의 목적을 위해 개인정보를 수집 및
            이용합니다.
          </p>
          <ul>
            <li>회원 가입 및 관리</li>
            <li>서비스 제공 및 개선</li>
            <li>결제 처리 및 이용권 관리</li>
            <li>고객 문의 응대</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. 수집하는 개인정보 항목</h2>
          <p>서비스는 다음의 개인정보를 수집합니다.</p>
          <ul>
            <li>필수 항목: 이메일 주소, 이름 (Google 로그인 시)</li>
            <li>자동 수집 항목: 접속 로그, 서비스 이용 기록</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 파기합니다.
            단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </p>
          <ul>
            <li>전자상거래법에 따른 계약/청약철회 기록: 5년</li>
            <li>대금결제 및 재화 공급 기록: 5년</li>
            <li>소비자 불만/분쟁 처리 기록: 3년</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. 개인정보의 제3자 제공</h2>
          <p>
            서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 법령에 따른 요청이 있는 경우 예외로 합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. 개인정보의 처리 위탁</h2>
          <p>서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보를 위탁합니다.</p>
          <ul>
            <li>결제 처리: 결제 대행사</li>
            <li>클라우드 서비스: AWS, Google Cloud</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. 이용자의 권리</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul>
            <li>개인정보 열람 요청</li>
            <li>개인정보 정정 요청</li>
            <li>개인정보 삭제 요청</li>
            <li>개인정보 처리 정지 요청</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. 쿠키의 사용</h2>
          <p>
            서비스는 이용자 경험 개선을 위해 쿠키를 사용합니다. 이용자는 브라우저
            설정을 통해 쿠키 사용을 거부할 수 있습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. 개인정보 보호책임자</h2>
          <p>개인정보 관련 문의는 아래 연락처로 해주시기 바랍니다.</p>
          <p>이메일: privacy@zerocraft.io</p>
        </section>
      </div>
    </div>
  );
}
