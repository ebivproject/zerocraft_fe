import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>
        <Link href="/" className={styles.backButton}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
