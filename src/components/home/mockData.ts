// Mock 지원사업 데이터 - 조회수 높은 순으로 정렬됨
export interface MockGrant {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  amount: string;
  category: string;
  tags: string[];
  views: number;
  status: "open" | "closed" | "upcoming";
}

export const MOCK_GRANTS: MockGrant[] = [
  {
    id: "1",
    title: "2025년 창업성장기술개발사업 디딤돌 창업과제",
    organization: "중소벤처기업부",
    deadline: "2025-01-15",
    amount: "최대 1억원",
    category: "창업지원",
    tags: ["창업지원", "기술개발", "예비창업자"],
    views: 15420,
    status: "open",
  },
  {
    id: "2",
    title: "혁신창업사업화자금 (융자)",
    organization: "중소벤처기업진흥공단",
    deadline: "2025-02-28",
    amount: "최대 10억원",
    category: "금융지원",
    tags: ["금융지원", "창업지원", "중소기업"],
    views: 12350,
    status: "open",
  },
  {
    id: "3",
    title: "수출바우처사업",
    organization: "KOTRA",
    deadline: "2025-01-31",
    amount: "최대 1억원",
    category: "수출지원",
    tags: ["수출지원", "마케팅", "중소기업"],
    views: 11200,
    status: "open",
  },
  {
    id: "4",
    title: "청년창업사관학교 14기 모집",
    organization: "중소벤처기업부",
    deadline: "2025-03-15",
    amount: "최대 1억원",
    category: "창업지원",
    tags: ["창업지원", "청년창업", "교육훈련"],
    views: 10890,
    status: "upcoming",
  },
  {
    id: "5",
    title: "소상공인 정책자금 (일반경영안정자금)",
    organization: "소상공인시장진흥공단",
    deadline: "2025-12-31",
    amount: "최대 7천만원",
    category: "금융지원",
    tags: ["금융지원", "소상공인"],
    views: 9750,
    status: "open",
  },
  {
    id: "6",
    title: "여성기업 종합지원사업",
    organization: "여성기업종합지원센터",
    deadline: "2025-02-15",
    amount: "최대 5천만원",
    category: "창업지원",
    tags: ["창업지원", "여성기업", "컨설팅"],
    views: 8900,
    status: "open",
  },
  {
    id: "7",
    title: "R&D 바우처 사업",
    organization: "중소벤처기업부",
    deadline: "2025-01-20",
    amount: "최대 7천만원",
    category: "R&D",
    tags: ["R&D", "기술개발", "벤처기업"],
    views: 8450,
    status: "open",
  },
  {
    id: "8",
    title: "고용창출장려금 지원사업",
    organization: "고용노동부",
    deadline: "2025-12-31",
    amount: "월 최대 80만원",
    category: "고용지원",
    tags: ["고용지원", "중소기업"],
    views: 7600,
    status: "open",
  },
  {
    id: "9",
    title: "사회적기업 육성사업",
    organization: "고용노동부",
    deadline: "2025-02-28",
    amount: "최대 3억원",
    category: "창업지원",
    tags: ["창업지원", "사회적기업"],
    views: 6800,
    status: "open",
  },
  {
    id: "10",
    title: "스마트공장 구축 지원사업",
    organization: "중소벤처기업부",
    deadline: "2025-03-31",
    amount: "최대 4억원",
    category: "시설지원",
    tags: ["시설지원", "기술개발", "중소기업"],
    views: 6200,
    status: "upcoming",
  },
];
