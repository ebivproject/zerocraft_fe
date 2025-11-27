import { NextRequest, NextResponse } from "next/server";
import { BusinessPlanInput } from "@/types/businessPlan";
import { BusinessPlanOutput, generatePrompt } from "@/lib/api/businessPlan";

// Mock AI 응답 생성 (실제 구현 시 AI API 호출로 교체)
function generateMockResponse(input: BusinessPlanInput): BusinessPlanOutput {
  return {
    documentTitle: `${input.itemName} 사업계획서`,
    sections: {
      generalStatus: {
        title: "I. 일반현황",
        data: {
          itemName: input.itemName,
          outputs: input.outputs,
          representative: input.jobTitle,
          companyName: input.companyName,
        },
      },
      summary: {
        title: "II. 아이템 개요",
        data: {
          productName: input.productName,
          category: input.category,
          itemOverview: {
            coreFunctions:
              input.overview ||
              "AI 기반 자동화 솔루션으로 기존 프로세스 대비 70% 이상의 효율성 향상을 제공합니다.",
            customerBenefits:
              "시간 절감, 비용 절감, 품질 향상의 3가지 핵심 가치를 고객에게 제공합니다.",
          },
          problemRecognition:
            input.problemOverview ||
            "기존 시장에서는 수동적인 프로세스로 인한 비효율성과 높은 인건비 문제가 존재합니다.",
          feasibility:
            input.solutionOverview ||
            "자체 개발 AI 엔진과 클라우드 기반 인프라를 통해 안정적인 서비스 제공이 가능합니다.",
          growthStrategy:
            input.scaleupOverview ||
            "초기 B2B 시장 공략 후 B2C 확장을 통한 단계적 성장 전략을 수립했습니다.",
          teamConfiguration:
            input.teamOverview ||
            "개발, 기획, 마케팅 분야 전문가로 구성된 최적의 팀 구성을 갖추고 있습니다.",
        },
      },
      problem: {
        title: "III. 문제 인식",
        subSections: [
          {
            subTitle: "1. 시장 현황 및 문제점",
            content: {
              marketStatus:
                input.marketStatus ||
                "국내 관련 시장 규모는 약 5조원으로, 연평균 15% 성장이 예상됩니다. 그러나 기존 솔루션들은 복잡한 사용성과 높은 비용으로 인해 중소기업 도입에 한계가 있습니다.",
              problems: [
                input.problems ||
                  "기존 솔루션의 높은 도입 비용 (평균 연 5,000만원 이상)",
                "복잡한 시스템으로 인한 낮은 사용자 채택률",
                "커스터마이징의 어려움과 긴 도입 기간",
                "지속적인 유지보수 비용 부담",
              ],
            },
          },
        ],
      },
      solution: {
        title: "IV. 실현 가능성",
        subSections: [
          {
            subTitle: "1. 개발 목표 및 차별화",
            content: {
              developmentGoals: [
                input.developmentPlan || "AI 기반 자동화 엔진 개발",
                "사용자 친화적 인터페이스 구현",
                "클라우드 기반 SaaS 플랫폼 구축",
                "API 연동 기능 개발",
              ],
              differentiation:
                input.differentiation ||
                "• 기존 솔루션 대비 50% 저렴한 가격\n• No-Code 방식의 쉬운 설정\n• 실시간 AI 분석 리포트 제공\n• 3일 이내 빠른 도입 가능",
            },
          },
          {
            subTitle: "2. 추진 일정",
            content: {
              scheduleTable: [
                {
                  step: "1단계",
                  task: "핵심 기능 개발",
                  period: "1-3개월",
                  detail: "AI 엔진 및 기본 플랫폼 개발",
                },
                {
                  step: "2단계",
                  task: "베타 테스트",
                  period: "4-6개월",
                  detail: "파일럿 고객사 테스트 및 피드백 반영",
                },
                {
                  step: "3단계",
                  task: "정식 출시",
                  period: "7-9개월",
                  detail: "정식 서비스 런칭 및 마케팅",
                },
                {
                  step: "4단계",
                  task: "확장",
                  period: "10-12개월",
                  detail: "기능 고도화 및 시장 확대",
                },
              ],
            },
          },
          {
            subTitle: "3. 사업비 집행 계획",
            content: {
              budgetPhase1: {
                items: [
                  {
                    category: "인건비",
                    detail: "개발인력 3명",
                    amount: "120,000,000",
                  },
                  {
                    category: "재료비",
                    detail: "클라우드 서버 비용",
                    amount: "30,000,000",
                  },
                  {
                    category: "외주용역비",
                    detail: "디자인 외주",
                    amount: "20,000,000",
                  },
                  {
                    category: "마케팅비",
                    detail: "초기 마케팅",
                    amount: "30,000,000",
                  },
                ],
                total: input.budget1 || "200,000,000",
              },
              budgetPhase2: {
                items: [
                  {
                    category: "인건비",
                    detail: "개발인력 5명",
                    amount: "200,000,000",
                  },
                  {
                    category: "재료비",
                    detail: "인프라 확장",
                    amount: "50,000,000",
                  },
                  {
                    category: "외주용역비",
                    detail: "기능 고도화",
                    amount: "30,000,000",
                  },
                  {
                    category: "마케팅비",
                    detail: "본격 마케팅",
                    amount: "70,000,000",
                  },
                ],
                total: input.budget2 || "350,000,000",
              },
            },
          },
        ],
      },
      scaleup: {
        title: "V. 성장 전략",
        subSections: [
          {
            subTitle: "1. 시장 분석 및 진입 전략",
            content: {
              competitorAnalysis: [
                input.competitors ||
                  "경쟁사 A: 높은 가격, 복잡한 기능 → 우리의 기회: 합리적 가격과 간편함",
                "경쟁사 B: 제한된 커스터마이징 → 우리의 기회: 유연한 설정",
                "경쟁사 C: 긴 도입 기간 → 우리의 기회: 빠른 온보딩",
              ],
              marketEntryStrategy: {
                target:
                  input.marketEntry ||
                  "초기 타겟: 직원 50-200명 규모의 중소기업",
                channel:
                  "온라인 마케팅, 파트너십, 직접 영업을 통한 다각화된 채널 전략",
                offline:
                  "산업 전시회 참가 및 네트워킹 이벤트를 통한 인지도 확보",
                initialGoal:
                  "1차년도 100개 기업 고객 확보, 월 반복 매출 1억원 달성",
              },
              businessModel: {
                revenueSources:
                  input.businessModel ||
                  "SaaS 구독 모델 (월/연 구독), 기업용 맞춤 솔루션 추가 수익",
                pricing: "Basic: 월 30만원, Pro: 월 70만원, Enterprise: 협의",
                financialProjection: "1차년도 매출 12억원, 2차년도 36억원 목표",
                breakEvenPoint: "서비스 런칭 후 18개월 내 손익분기점 달성 예상",
              },
              esgStrategy: {
                environment:
                  input.esg ||
                  "클라우드 기반 서비스로 탄소 배출 최소화, 친환경 오피스 운영",
                social: "취약계층 할인 프로그램, 지역 스타트업 멘토링 참여",
                governance:
                  "투명한 경영 공시, 이사회 다양성 확보, 윤리경영 실천",
              },
            },
          },
        ],
      },
      team: {
        title: "VI. 팀 구성",
        subSections: [
          {
            subTitle: "1. 팀 구성 및 역량",
            content: {
              founderCapability: {
                education:
                  input.founderCapability?.split(",")[0] ||
                  "서울대학교 컴퓨터공학 석사",
                experience: "네이버, 카카오 개발팀 8년 근무",
                qualification: "정보처리기사, AWS Solutions Architect",
                network:
                  "스타트업 커뮤니티 운영진, 대기업 개발팀장 네트워크 보유",
                achievements: "이전 창업 프로젝트 성공적 Exit, 특허 3건 보유",
              },
              teamMembersTable: [
                {
                  role: "CEO",
                  task: "전략/사업개발",
                  capability: input.teamMembers || "IT 업계 10년 경력",
                  status: "재직중",
                },
                {
                  role: "CTO",
                  task: "기술 총괄",
                  capability: "AI/ML 전문가",
                  status: "재직중",
                },
                {
                  role: "개발팀장",
                  task: "백엔드 개발",
                  capability: "시니어 개발자",
                  status: "재직중",
                },
                {
                  role: "디자이너",
                  task: "UX/UI 설계",
                  capability: "5년차 프로덕트 디자이너",
                  status: "채용예정",
                },
              ],
              partnersTable: [
                {
                  name: input.partners || "OO대학교 산학협력단",
                  role: "기술 자문",
                  detail: "AI 알고리즘 자문",
                  timing: "상시",
                },
                {
                  name: "법무법인 OO",
                  role: "법률 자문",
                  detail: "계약 및 IP 관리",
                  timing: "필요시",
                },
                {
                  name: "회계법인 OO",
                  role: "회계/세무",
                  detail: "재무 관리 자문",
                  timing: "분기별",
                },
              ],
            },
          },
        ],
      },
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input) {
      return NextResponse.json(
        { error: "입력 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    // 프롬프트 생성 (실제 AI API 호출 시 사용)
    const prompt = generatePrompt(input);
    console.log("Generated prompt:", prompt);

    // TODO: 실제 AI API 호출 (OpenAI, Claude 등)
    // const aiResponse = await callAIAPI(prompt);

    // 현재는 Mock 응답 반환
    const result = generateMockResponse(input);

    // 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI 생성 오류:", error);
    return NextResponse.json(
      { error: "사업계획서 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
