// Mock 사업계획서 미리보기 데이터
export const MOCK_PREVIEW_DATA = {
  documentTitle: "2025년 창업성장기술개발사업 사업계획서",
  sections: {
    generalStatus: {
      title: "□ 일반현황",
      data: {
        itemName: "AI 기반 스마트 물류 최적화 시스템 개발",
        outputs: "AI 물류 예측 시스템, 모바일 앱, 관리자 대시보드",
        representative: "홍길동",
        companyName: "(주)테크스타트",
      },
    },
    summary: {
      title: "□ 창업 아이템 개요(요약)",
      data: {
        productName: "스마트로지 (SmartLogi)",
        category: "물류/AI/플랫폼",
        itemOverview: {
          coreFunctions:
            "AI 기반 배송 시간 예측, 최적 경로 산출, 실시간 물류 모니터링",
          customerBenefits:
            "배송 시간 30% 단축, 물류 비용 20% 절감, 고객 만족도 향상",
        },
        problemRecognition:
          "국내 물류 시장은 연간 80조원 규모로 성장 중이나, 비효율적인 배송 시스템으로 인해 배송 지연율이 15%에 달하며, 물류 기업들의 운영 비용이 매년 증가하는 문제가 있음",
        feasibility:
          "자체 개발 AI 엔진을 통해 95% 이상의 배송 시간 예측 정확도를 달성하였으며, 파일럿 테스트에서 배송 효율 30% 개선을 검증함",
        growthStrategy:
          "1년차 수도권 중소 물류업체 100개사 확보, 2년차 전국 확대 및 대기업 파트너십, 3년차 동남아 시장 진출",
        teamConfiguration:
          "AI 전문가 2명, 물류 도메인 전문가 3명, 풀스택 개발자 5명으로 구성된 10인 전문팀",
      },
    },
    problem: {
      title: "1. 문제 인식 (Problem)",
      subSections: [
        {
          subTitle: "1-1. 창업 아이템의 필요성",
          content: {
            marketStatus:
              "국내 물류 시장 규모는 2024년 기준 약 80조원이며, 이커머스 성장에 따라 연평균 5.2% 성장하고 있습니다. 특히 당일/새벽 배송 수요가 급증하면서 물류 효율화에 대한 니즈가 크게 증가하고 있습니다.",
            problems: [
              "배송 시간 예측 불가: 기존 시스템은 정확한 배송 시간 예측이 어려워 고객 불만 증가",
              "물류 비용 증가: 비효율적인 경로 설정으로 인해 연료비 및 인건비 20% 이상 낭비",
              "인력 부족 문제: 물류 종사자 고령화 및 이직률 증가로 인한 만성적 인력난",
            ],
          },
        },
      ],
    },
    // 이 부분부터는 결제 후 볼 수 있음 (블러 처리)
    solution: {
      title: "2. 실현 가능성 (Solution)",
      isLocked: true,
      subSections: [
        {
          subTitle: "2-1. 창업 아이템의 개발 계획",
          content: {
            developmentGoals: [
              "1단계: AI 코어 엔진 개발 및 데이터 수집 체계 구축",
              "2단계: 베타 서비스 출시 및 파일럿 테스트 진행",
            ],
            differentiation: "프리미엄 컨텐츠 - 결제 후 확인 가능합니다.",
            scheduleTable: [],
          },
        },
        {
          subTitle: "2-2. 정부지원사업비 집행 계획",
          content: {
            budgetPhase1: { items: [], total: "프리미엄 컨텐츠" },
            budgetPhase2: { items: [], total: "프리미엄 컨텐츠" },
          },
        },
      ],
    },
    scaleup: {
      title: "3. 성장전략 (Scale-up)",
      isLocked: true,
      subSections: [
        {
          subTitle: "3-1. 사업화 추진 전략",
          content: {
            competitorAnalysis: ["프리미엄 컨텐츠 - 결제 후 확인 가능합니다."],
            marketEntryStrategy: {},
            businessModel: {},
            esgStrategy: {},
          },
        },
      ],
    },
    team: {
      title: "4. 팀 구성 (Team)",
      isLocked: true,
      subSections: [
        {
          subTitle: "4-1. 대표자 및 팀원 구성 계획",
          content: {
            founderCapability: {},
            teamMembersTable: [],
            partnersTable: [],
          },
        },
      ],
    },
  },
};

// 미리보기에서 보여줄 섹션들
export const PREVIEW_SECTIONS = ["generalStatus", "summary", "problem"];
export const LOCKED_SECTIONS = ["solution", "scaleup", "team"];
