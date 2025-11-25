import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link href={ROUTES.HOME} className="logo">
          Craft
        </Link>
        <ul className="nav-links">
          <li>
            <Link href={ROUTES.GRANTS}>지원사업</Link>
          </li>
          <li>
            <Link href={ROUTES.PROJECT_WIZARD}>사업계획서 작성</Link>
          </li>
          <li>
            <Link href={ROUTES.MYPAGE}>마이페이지</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
