"use client";

import styles from "./page.module.css";

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>이용약관</h1>
        <p className={styles.lastUpdated}>최종 수정일: 2025년 11월 28일</p>

        <section className={styles.section}>
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 StartPlan(이하 &quot;서비스&quot;)가 제공하는 AI
            사업계획서 생성 서비스의 이용조건 및 절차, 기타 필요한 사항을
            규정함을 목적으로 합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>제2조 (정의)</h2>
          <p>
            1. &quot;서비스&quot;란 StartPlan가 제공하는 AI 기반 사업계획서 작성
            지원 서비스를 말합니다.
          </p>
          <p>
            2. &quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 자를
            말합니다.
          </p>
          <p>
            3. &quot;이용권&quot;이란 서비스 이용을 위해 구매하는 유료 결제
            수단을 말합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>제3조 (약관의 효력 및 변경)</h2>
          <p>
            1. 본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게
            공지함으로써 효력이 발생합니다.
          </p>
          <p>
            2. 서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지
            후 효력이 발생합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>제4조 (서비스 이용)</h2>
          <p>1. 이용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.</p>
          <p>
            2. 서비스는 AI를 활용하여 사업계획서 작성을 지원하며, 생성된 내용의
            정확성이나 완전성을 보장하지 않습니다.
          </p>
          <p>
            3. 이용자는 생성된 사업계획서를 검토하고 필요에 따라 수정하여
            사용해야 합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>제5조 (결제 및 환불)</h2>
          <p>1. 이용권은 결제 완료 후 즉시 제공됩니다.</p>
          <p>2. 이용권 사용 후에는 환불이 불가합니다.</p>
          <p>3. 미사용 이용권의 환불은 관련 법령에 따라 처리됩니다.</p>
        </section>

        <section className={styles.section}>
          <h2>제6조 (면책조항)</h2>
          <p>
            1. 서비스는 AI가 생성한 콘텐츠에 대해 법적 책임을 지지 않습니다.
          </p>
          <p>
            2. 이용자가 서비스를 통해 작성한 사업계획서의 활용에 따른 결과는
            이용자의 책임입니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>제7조 (문의)</h2>
          <p>서비스 이용에 관한 문의는 아래 연락처로 해주시기 바랍니다.</p>
          <p>이메일: none</p>
        </section>
      </div>
    </div>
  );
}
