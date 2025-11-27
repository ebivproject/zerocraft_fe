// AI 사업계획서 입력 타입
export interface BusinessPlanInput {
  itemName: string;
  outputs: string;
  jobTitle: string;
  companyName: string;
  teamMembers: string;
  productName: string;
  category: string;
  overview: string;
  problemOverview: string;
  solutionOverview: string;
  scaleupOverview: string;
  teamOverview: string;
  teamDetail: string;
  founderCapability: string;
  marketStatus: string;
  problems: string;
  competitors: string;
  marketEntry: string;
  developmentPlan: string;
  differentiation: string;
  schedule: string;
  budget1: string;
  budget2: string;
  businessModel: string;
  esg: string;
  partners: string;
}

// 입력 필드 메타데이터
export interface InputFieldMeta {
  key: keyof BusinessPlanInput;
  label: string;
  placeholder: string;
  multiline: boolean;
  section: string;
  required: boolean;
}

// 입력 필드 정의
export const INPUT_FIELDS: InputFieldMeta[] = [
  // 기본 정보
  {
    key: "itemName",
    label: "과제명",
    placeholder: "AI 기반 스마트 물류 시스템 개발",
    multiline: false,
    section: "기본 정보",
    required: true,
  },
  {
    key: "companyName",
    label: "회사명",
    placeholder: "(주)테크스타트",
    multiline: false,
    section: "기본 정보",
    required: true,
  },
  {
    key: "jobTitle",
    label: "대표자 직책",
    placeholder: "대표이사",
    multiline: false,
    section: "기본 정보",
    required: true,
  },
  {
    key: "productName",
    label: "제품/서비스명",
    placeholder: "스마트로지",
    multiline: false,
    section: "기본 정보",
    required: true,
  },
  {
    key: "category",
    label: "카테고리",
    placeholder: "물류/AI",
    multiline: false,
    section: "기본 정보",
    required: true,
  },
  {
    key: "outputs",
    label: "개발 결과물",
    placeholder: "AI 물류 예측 시스템, 모바일 앱",
    multiline: false,
    section: "기본 정보",
    required: true,
  },

  // 아이템 개요
  {
    key: "overview",
    label: "제품/서비스 개요",
    placeholder:
      "AI 기술을 활용하여 물류 배송 시간을 30% 단축하는 스마트 물류 솔루션입니다...",
    multiline: true,
    section: "아이템 개요",
    required: true,
  },
  {
    key: "problemOverview",
    label: "문제 인식 요약",
    placeholder:
      "기존 물류 시스템의 비효율성으로 인한 배송 지연 및 비용 증가 문제를 해결합니다...",
    multiline: true,
    section: "아이템 개요",
    required: true,
  },
  {
    key: "solutionOverview",
    label: "솔루션 요약",
    placeholder:
      "AI 기반 수요 예측 및 최적 경로 산출 알고리즘을 통해 물류 효율성을 극대화합니다...",
    multiline: true,
    section: "아이템 개요",
    required: true,
  },
  {
    key: "scaleupOverview",
    label: "성장 전략 요약",
    placeholder:
      "1년차 수도권, 2년차 전국, 3년차 동남아 시장 진출을 목표로 합니다...",
    multiline: true,
    section: "아이템 개요",
    required: true,
  },
  {
    key: "teamOverview",
    label: "팀 구성 요약",
    placeholder:
      "AI 전문가 2명, 물류 경력자 3명, 개발자 5명으로 구성된 전문 팀입니다...",
    multiline: true,
    section: "아이템 개요",
    required: true,
  },

  // 문제 인식
  {
    key: "marketStatus",
    label: "시장 현황",
    placeholder:
      "국내 물류 시장 규모는 약 80조원이며, 연평균 5% 성장 중입니다...",
    multiline: true,
    section: "문제 인식",
    required: true,
  },
  {
    key: "problems",
    label: "시장 문제점",
    placeholder:
      "1. 배송 시간 예측 불가\n2. 물류 비용 증가\n3. 인력 부족 문제...",
    multiline: true,
    section: "문제 인식",
    required: true,
  },

  // 실현 가능성
  {
    key: "developmentPlan",
    label: "개발 계획",
    placeholder:
      "1단계: 핵심 알고리즘 개발 (3개월)\n2단계: 베타 서비스 출시 (6개월)...",
    multiline: true,
    section: "실현 가능성",
    required: true,
  },
  {
    key: "differentiation",
    label: "차별화 요소",
    placeholder: "자체 개발 AI 엔진을 통한 95% 이상의 배송 시간 예측 정확도...",
    multiline: true,
    section: "실현 가능성",
    required: true,
  },
  {
    key: "schedule",
    label: "추진 일정",
    placeholder: "1차년도 1분기: 요구사항 분석\n1차년도 2분기: 설계 및 개발...",
    multiline: true,
    section: "실현 가능성",
    required: true,
  },
  {
    key: "budget1",
    label: "1차년도 예산",
    placeholder: "인건비: 5,000만원\n재료비: 2,000만원\n외주비: 3,000만원...",
    multiline: true,
    section: "실현 가능성",
    required: true,
  },
  {
    key: "budget2",
    label: "2차년도 예산",
    placeholder: "인건비: 6,000만원\n재료비: 1,500만원\n마케팅비: 2,500만원...",
    multiline: true,
    section: "실현 가능성",
    required: true,
  },

  // 성장 전략
  {
    key: "competitors",
    label: "경쟁사 분석",
    placeholder:
      "경쟁사 A: 물류 자동화 솔루션 (시장점유율 30%)\n경쟁사 B: 배송 추적 서비스...",
    multiline: true,
    section: "성장 전략",
    required: true,
  },
  {
    key: "marketEntry",
    label: "시장 진입 전략",
    placeholder:
      "초기 타겟: 중소 물류업체 100개사\n진입 채널: B2B 직접 영업 및 온라인 마케팅...",
    multiline: true,
    section: "성장 전략",
    required: true,
  },
  {
    key: "businessModel",
    label: "비즈니스 모델",
    placeholder:
      "SaaS 구독 모델: 월 50만원~200만원\n수익 구조: 기본료 + 트랜잭션 수수료...",
    multiline: true,
    section: "성장 전략",
    required: true,
  },
  {
    key: "esg",
    label: "ESG 전략",
    placeholder:
      "환경: 물류 최적화를 통한 탄소 배출 감소\n사회: 물류 종사자 근무 환경 개선...",
    multiline: true,
    section: "성장 전략",
    required: true,
  },

  // 팀 구성
  {
    key: "teamMembers",
    label: "팀 구성원",
    placeholder:
      "CTO: 김철수 (AI 박사, 10년 경력)\n개발팀장: 이영희 (7년 경력)...",
    multiline: true,
    section: "팀 구성",
    required: true,
  },
  {
    key: "teamDetail",
    label: "팀 상세 역할",
    placeholder: "AI팀: 핵심 알고리즘 개발 담당\n개발팀: 서비스 플랫폼 구축...",
    multiline: true,
    section: "팀 구성",
    required: true,
  },
  {
    key: "founderCapability",
    label: "창업자 역량",
    placeholder:
      "학력: 서울대 컴퓨터공학 박사\n경력: 삼성전자 AI연구소 10년...",
    multiline: true,
    section: "팀 구성",
    required: true,
  },
  {
    key: "partners",
    label: "협력 파트너",
    placeholder:
      "ABC물류: 시범 서비스 운영 협력\nXYZ기술: AI 기술 공동 개발...",
    multiline: true,
    section: "팀 구성",
    required: false,
  },
];

// 섹션별 그룹화
export const INPUT_SECTIONS = [
  "기본 정보",
  "아이템 개요",
  "문제 인식",
  "실현 가능성",
  "성장 전략",
  "팀 구성",
];

// 초기 입력값
export const INITIAL_INPUT: BusinessPlanInput = {
  itemName: "",
  outputs: "",
  jobTitle: "",
  companyName: "",
  teamMembers: "",
  productName: "",
  category: "",
  overview: "",
  problemOverview: "",
  solutionOverview: "",
  scaleupOverview: "",
  teamOverview: "",
  teamDetail: "",
  founderCapability: "",
  marketStatus: "",
  problems: "",
  competitors: "",
  marketEntry: "",
  developmentPlan: "",
  differentiation: "",
  schedule: "",
  budget1: "",
  budget2: "",
  businessModel: "",
  esg: "",
  partners: "",
};
