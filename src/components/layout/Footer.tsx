import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">StartPlan</div>
            <p className="footer-description">
              AI 기반 사업계획서 작성 도우미
              <br />
              정부 지원사업 탐색부터 계획서 작성까지 한 번에
            </p>
          </div>

          <div className="footer-section">
            <h4>서비스</h4>
            <ul className="footer-links">
              <li>
                <Link href={ROUTES.PROJECT_WIZARD}>AI 사업계획서</Link>
              </li>
              <li>
                <Link href={ROUTES.GRANTS}>지원사업 검색</Link>
              </li>
              <li>
                <Link href={ROUTES.MYPAGE}>마이페이지</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>고객지원</h4>
            <ul className="footer-links">
              <li>
                <a href="/guide">이용가이드</a>
              </li>
              <li>
                <a href="/faq">자주 묻는 질문</a>
              </li>
              <li>
                <a href="/contact">문의하기</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>회사</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">회사 소개</a>
              </li>
              <li>
                <a href="https://blog.naver.com/careez" target="_blank" rel="noopener noreferrer">블로그</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} StartPlan. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
