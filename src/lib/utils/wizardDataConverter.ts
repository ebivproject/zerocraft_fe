import { BusinessPlanOutput } from "@/lib/api/businessPlan";
import { WizardData } from "@/components/wizard/StepByStepWizard";

/**
 * WizardData를 BusinessPlanOutput으로 변환
 * StepByStepWizard에서 수집한 데이터를 output.json 형식으로 변환
 */
export function convertWizardDataToOutput(
  data: WizardData
): BusinessPlanOutput {
  // 문제점 파싱 (줄바꿈으로 구분된 텍스트를 배열로)
  const parseProblems = (text: string): string[] => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  // 개발 목표 파싱
  const parseDevelopmentGoals = (text: string): string[] => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  // 경쟁사 분석 파싱
  const parseCompetitorAnalysis = (text: string): string[] => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  // 일정 테이블 파싱 (단계|내용|기간|세부내용)
  const parseScheduleTable = (
    text: string
  ): Array<{ step: string; task: string; period: string; detail: string }> => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("|"))
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          step: parts[0] || "",
          task: parts[1] || "",
          period: parts[2] || "",
          detail: parts[3] || "",
        };
      });
  };

  // 예산 테이블 파싱 (비목|산출근거|금액)
  const parseBudgetTable = (
    text: string
  ): {
    items: Array<{ category: string; detail: string; amount: string }>;
    total: string;
  } => {
    if (!text) return { items: [], total: "0" };

    const items = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("|"))
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          category: parts[0] || "",
          detail: parts[1] || "",
          amount: parts[2] || "0",
        };
      });

    // 총합 계산
    const total = items
      .reduce((sum, item) => {
        const amount = parseInt(item.amount.replace(/[^0-9]/g, "")) || 0;
        return sum + amount;
      }, 0)
      .toLocaleString();

    return { items, total };
  };

  // 팀 구성원 테이블 파싱 (직위|담당업무|역량|상태)
  const parseTeamMembersTable = (
    text: string
  ): Array<{
    role: string;
    task: string;
    capability: string;
    status: string;
  }> => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("|"))
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          role: parts[0] || "",
          task: parts[1] || "",
          capability: parts[2] || "",
          status: parts[3] || "",
        };
      });
  };

  // 협력 파트너 테이블 파싱 (파트너명|역량|협업방안|시기)
  const parsePartnersTable = (
    text: string
  ): Array<{ name: string; role: string; detail: string; timing: string }> => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("|"))
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          name: parts[0] || "",
          role: parts[1] || "",
          detail: parts[2] || "",
          timing: parts[3] || "",
        };
      });
  };

  // 시장 진입 전략 파싱
  const parseMarketEntry = (
    text: string
  ): {
    target: string;
    channel: string;
    offline: string;
    initialGoal: string;
  } => {
    const result = {
      target: "",
      channel: "",
      offline: "",
      initialGoal: "",
    };

    if (!text) return result;

    const lines = text.split("\n");
    let currentKey = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes("【타겟 고객】") || trimmed.includes("타겟 고객")) {
        currentKey = "target";
        result.target = trimmed.replace(/【?타겟 고객】?/g, "").trim();
      } else if (
        trimmed.includes("【온라인 채널】") ||
        trimmed.includes("온라인 채널")
      ) {
        currentKey = "channel";
        result.channel = trimmed.replace(/【?온라인 채널】?/g, "").trim();
      } else if (
        trimmed.includes("【오프라인 채널】") ||
        trimmed.includes("오프라인 채널")
      ) {
        currentKey = "offline";
        result.offline = trimmed.replace(/【?오프라인 채널】?/g, "").trim();
      } else if (
        trimmed.includes("【초기 목표】") ||
        trimmed.includes("초기 목표")
      ) {
        currentKey = "initialGoal";
        result.initialGoal = trimmed.replace(/【?초기 목표】?/g, "").trim();
      } else if (trimmed && currentKey) {
        result[currentKey as keyof typeof result] += " " + trimmed;
      }
    }

    return result;
  };

  // 비즈니스 모델 파싱
  const parseBusinessModel = (
    text: string
  ): {
    revenueSources: string;
    pricing: string;
    financialProjection: string;
    breakEvenPoint: string;
  } => {
    const result = {
      revenueSources: "",
      pricing: "",
      financialProjection: "",
      breakEvenPoint: "",
    };

    if (!text) return result;

    const lines = text.split("\n");
    let currentKey = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes("【수익 모델】") || trimmed.includes("수익 모델")) {
        currentKey = "revenueSources";
        result.revenueSources = trimmed.replace(/【?수익 모델】?/g, "").trim();
      } else if (
        trimmed.includes("【가격 정책】") ||
        trimmed.includes("가격 정책")
      ) {
        currentKey = "pricing";
        result.pricing = trimmed.replace(/【?가격 정책】?/g, "").trim();
      } else if (
        trimmed.includes("【매출 전망】") ||
        trimmed.includes("매출 전망")
      ) {
        currentKey = "financialProjection";
        result.financialProjection = trimmed
          .replace(/【?매출 전망】?/g, "")
          .trim();
      } else if (
        trimmed.includes("【손익분기점】") ||
        trimmed.includes("손익분기점")
      ) {
        currentKey = "breakEvenPoint";
        result.breakEvenPoint = trimmed.replace(/【?손익분기점】?/g, "").trim();
      } else if (trimmed && currentKey) {
        result[currentKey as keyof typeof result] += " " + trimmed;
      }
    }

    return result;
  };

  // ESG 전략 파싱
  const parseEsgStrategy = (
    text: string
  ): { environment: string; social: string; governance: string } => {
    const result = {
      environment: "",
      social: "",
      governance: "",
    };

    if (!text) return result;

    const lines = text.split("\n");
    let currentKey = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.includes("【환경(E)】") ||
        trimmed.includes("환경(E)") ||
        trimmed.includes("환경")
      ) {
        currentKey = "environment";
        result.environment = trimmed.replace(/【?환경\(?E?\)?】?/g, "").trim();
      } else if (
        trimmed.includes("【사회(S)】") ||
        trimmed.includes("사회(S)") ||
        trimmed.includes("사회")
      ) {
        currentKey = "social";
        result.social = trimmed.replace(/【?사회\(?S?\)?】?/g, "").trim();
      } else if (
        trimmed.includes("【지배구조(G)】") ||
        trimmed.includes("지배구조(G)") ||
        trimmed.includes("지배구조")
      ) {
        currentKey = "governance";
        result.governance = trimmed
          .replace(/【?지배구조\(?G?\)?】?/g, "")
          .trim();
      } else if (trimmed && currentKey) {
        result[currentKey as keyof typeof result] += " " + trimmed;
      }
    }

    return result;
  };

  // 창업자 역량 파싱
  const parseFounderCapability = (
    text: string
  ): {
    education: string;
    experience: string;
    qualification: string;
    network: string;
    achievements: string;
  } => {
    const result = {
      education: "",
      experience: "",
      qualification: "",
      network: "",
      achievements: "",
    };

    if (!text) return result;

    const lines = text.split("\n");
    let currentKey = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes("【학력】") || trimmed.includes("학력")) {
        currentKey = "education";
        result.education = trimmed.replace(/【?학력】?:?/g, "").trim();
      } else if (trimmed.includes("【경력】") || trimmed.includes("경력")) {
        currentKey = "experience";
        result.experience = trimmed.replace(/【?경력】?:?/g, "").trim();
      } else if (trimmed.includes("【자격증】") || trimmed.includes("자격증")) {
        currentKey = "qualification";
        result.qualification = trimmed.replace(/【?자격증】?:?/g, "").trim();
      } else if (
        trimmed.includes("【네트워크】") ||
        trimmed.includes("네트워크")
      ) {
        currentKey = "network";
        result.network = trimmed.replace(/【?네트워크】?:?/g, "").trim();
      } else if (trimmed.includes("【성과】") || trimmed.includes("성과")) {
        currentKey = "achievements";
        result.achievements = trimmed.replace(/【?성과】?:?/g, "").trim();
      } else if (trimmed && currentKey) {
        result[currentKey as keyof typeof result] += " " + trimmed;
      }
    }

    return result;
  };

  // 아이템 개요 파싱 (핵심 기능 + 고객 혜택)
  const parseItemOverview = (
    text: string
  ): { coreFunctions: string; customerBenefits: string } => {
    const result = {
      coreFunctions: "",
      customerBenefits: "",
    };

    if (!text) return result;

    const lines = text.split("\n");
    let currentKey = "coreFunctions";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes("【핵심 기능】") || trimmed.includes("핵심 기능")) {
        currentKey = "coreFunctions";
        const content = trimmed.replace(/【?핵심 기능】?/g, "").trim();
        if (content) result.coreFunctions += content + " ";
      } else if (
        trimmed.includes("【고객 혜택】") ||
        trimmed.includes("고객 혜택")
      ) {
        currentKey = "customerBenefits";
        const content = trimmed.replace(/【?고객 혜택】?/g, "").trim();
        if (content) result.customerBenefits += content + " ";
      } else if (trimmed) {
        result[currentKey as keyof typeof result] += trimmed + " ";
      }
    }

    result.coreFunctions = result.coreFunctions.trim();
    result.customerBenefits = result.customerBenefits.trim();

    // 고객 혜택이 없으면 전체를 핵심 기능으로
    if (!result.customerBenefits && result.coreFunctions) {
      const half = Math.floor(result.coreFunctions.length / 2);
      result.customerBenefits = result.coreFunctions;
    }

    return result;
  };

  // BusinessPlanOutput 생성
  return {
    documentTitle: `${data.itemName || "창업 아이템"} 사업계획서`,
    sections: {
      generalStatus: {
        title: "□ 일반현황",
        data: {
          itemName: data.itemName || "",
          outputs: data.outputs || "",
          representative: data.representative || "",
          companyName: data.companyName || "",
        },
      },
      summary: {
        title: "□ 창업 아이템 개요(요약)",
        data: {
          productName: data.productName || "",
          category: data.category || "",
          itemOverview: parseItemOverview(data.itemOverview || ""),
          problemRecognition: data.problemRecognition || "",
          feasibility: data.feasibility || "",
          growthStrategy: data.growthStrategy || "",
          teamConfiguration: data.teamConfiguration || "",
        },
      },
      problem: {
        title: "1. 문제 인식 (Problem)",
        subSections: [
          {
            subTitle: "1-1. 창업 아이템의 필요성",
            content: {
              marketStatus: data.marketStatus || "",
              problems: parseProblems(data.problems || ""),
            },
          },
        ],
      },
      solution: {
        title: "2. 실현 가능성 (Solution)",
        subSections: [
          {
            subTitle: "2-1. 창업 아이템의 개발 계획",
            content: {
              developmentGoals: parseDevelopmentGoals(
                data.developmentGoals || ""
              ),
              differentiation: data.differentiation || "",
              scheduleTable: parseScheduleTable(data.schedule || ""),
            },
          },
          {
            subTitle: "2-2. 정부지원사업비 집행 계획",
            content: {
              budgetPhase1: parseBudgetTable(data.budget1 || ""),
              budgetPhase2: parseBudgetTable(data.budget2 || ""),
            },
          },
        ],
      },
      scaleup: {
        title: "3. 성장전략 (Scale-up)",
        subSections: [
          {
            subTitle: "3-1. 사업화 추진 전략",
            content: {
              competitorAnalysis: parseCompetitorAnalysis(
                data.competitorAnalysis || ""
              ),
              marketEntryStrategy: parseMarketEntry(data.marketEntry || ""),
              businessModel: parseBusinessModel(data.businessModel || ""),
              esgStrategy: parseEsgStrategy(data.esgStrategy || ""),
            },
          },
        ],
      },
      team: {
        title: "4. 팀 구성 (Team)",
        subSections: [
          {
            subTitle: "4-1. 대표자 및 팀원 구성 계획",
            content: {
              founderCapability: parseFounderCapability(
                data.founderCapability || ""
              ),
              teamMembersTable: parseTeamMembersTable(data.teamMembers || ""),
              partnersTable: parsePartnersTable(data.partners || ""),
            },
          },
        ],
      },
    },
  };
}
