import { BusinessPlanInput } from "@/types/businessPlan";
import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";

// ============================================================
// 백엔드 API 연동 함수
// ============================================================

// 사업계획서 목록 항목
export interface BusinessPlanListItem {
  id: string;
  title: string;
  grantId?: string;
  grantTitle?: string;
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
}

// 사업계획서 목록 응답
export interface BusinessPlanListResponse {
  data: BusinessPlanListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 사업계획서 상세 응답
export interface BusinessPlanDetailResponse {
  id: string;
  title: string;
  grantId?: string;
  grantTitle?: string;
  content: BusinessPlanOutput;
  status: "draft" | "completed";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 사업계획서 생성 요청
export interface BusinessPlanCreateRequest {
  title: string;
  grantId?: string;
  content?: {
    sections: Array<{ id: string; title: string; content: string }>;
  };
  data?: BusinessPlanOutput; // 프론트엔드 WizardData 변환 결과
}

// 사업계획서 생성 응답
export interface BusinessPlanCreateResponse {
  id: string;
  title: string;
  grantId?: string;
  grantTitle?: string;
  content: BusinessPlanOutput;
  status: "draft" | "completed";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessPlanListParams {
  page?: number;
  limit?: number;
  status?: "draft" | "completed";
  sort?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export const businessPlanApi = {
  // 사업계획서 목록 조회
  getList: async (
    params?: BusinessPlanListParams
  ): Promise<BusinessPlanListResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.BUSINESS_PLANS.LIST,
      { params }
    );
    return response.data;
  },

  // 사업계획서 상세 조회
  getById: async (id: string): Promise<BusinessPlanDetailResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.BUSINESS_PLANS.DETAIL(id)
    );
    return response.data;
  },

  // 사업계획서 생성
  create: async (
    data: BusinessPlanCreateRequest
  ): Promise<BusinessPlanCreateResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BUSINESS_PLANS.CREATE,
      data
    );
    return response.data;
  },

  // 사업계획서 다운로드 (백엔드에서 파일 생성)
  download: async (
    id: string,
    format: "docx" | "pdf" = "docx"
  ): Promise<Blob> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.BUSINESS_PLANS.DOWNLOAD(id),
      {
        params: { format },
        responseType: "blob",
      }
    );
    return response.data;
  },
};

// ============================================================
// AI API 연동 함수 (프론트엔드 로컬 AI 호출)
// ============================================================

// AI API를 호출하여 사업계획서 생성
export async function generateBusinessPlan(
  input: BusinessPlanInput
): Promise<BusinessPlanOutput> {
  // 실제 AI API 호출 시에는 이 부분을 수정
  // 현재는 프론트엔드에서 mock 응답 생성

  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error("사업계획서 생성에 실패했습니다.");
  }

  return response.json();
}

// AI 사업계획서 출력 타입
export interface BusinessPlanOutput {
  documentTitle: string;
  sections: {
    generalStatus: GeneralStatusSection;
    summary: SummarySection;
    problem: ProblemSection;
    solution: SolutionSection;
    scaleup: ScaleupSection;
    team: TeamSection;
  };
}

interface GeneralStatusSection {
  title: string;
  data: {
    itemName: string;
    outputs: string;
    representative: string;
    companyName: string;
  };
}

interface SummarySection {
  title: string;
  data: {
    productName: string;
    category: string;
    itemOverview: {
      coreFunctions: string;
      customerBenefits: string;
    };
    problemRecognition: string;
    feasibility: string;
    growthStrategy: string;
    teamConfiguration: string;
  };
}

interface ProblemSection {
  title: string;
  subSections: Array<{
    subTitle: string;
    content: {
      marketStatus: string;
      problems: string[];
    };
  }>;
}

// 로드맵 차트 데이터 타입
export interface RoadmapChartData {
  title: string;
  totalMonths: number;
  phases: Array<{
    name: string;
    startMonth: number;
    endMonth: number;
    color: string;
  }>;
}

// 예산 차트 데이터 타입
export interface BudgetChartData {
  title: string;
  phase1: Array<{
    category: string;
    amount: number;
  }>;
  phase2: Array<{
    category: string;
    amount: number;
  }>;
}

// 경쟁사 비교 차트 데이터 타입
export interface CompetitorChartData {
  title: string;
  categories: string[];
  competitors: Array<{
    name: string;
    scores: number[];
  }>;
}

// 매출 전망 차트 데이터 타입
export interface RevenueChartData {
  title: string;
  unit: string;
  data: Array<{
    period: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

interface SolutionSection {
  title: string;
  subSections: Array<{
    subTitle: string;
    content: {
      developmentGoals?: string[];
      differentiation?: string;
      scheduleTable?: Array<{
        step: string;
        task: string;
        period: string;
        detail: string;
        startMonth?: number;
        endMonth?: number;
      }>;
      roadmapChart?: RoadmapChartData | null;
      budgetPhase1?: {
        items: Array<{
          category: string;
          detail: string;
          amount: string;
        }>;
        total: string;
      };
      budgetPhase2?: {
        items: Array<{
          category: string;
          detail: string;
          amount: string;
        }>;
        total: string;
      };
      budgetChart?: BudgetChartData | null;
    };
  }>;
}

interface ScaleupSection {
  title: string;
  subSections: Array<{
    subTitle: string;
    content: {
      competitorAnalysis: string[];
      competitorChart?: CompetitorChartData | null;
      marketEntryStrategy: {
        target: string;
        channel: string;
        offline: string;
        initialGoal: string;
      };
      businessModel: {
        revenueSources: string;
        pricing: string;
        financialProjection: string;
        breakEvenPoint: string;
      };
      revenueChart?: RevenueChartData | null;
      esgStrategy: {
        environment: string;
        social: string;
        governance: string;
      };
    };
  }>;
}

interface TeamSection {
  title: string;
  subSections: Array<{
    subTitle: string;
    content: {
      founderCapability: {
        education: string;
        experience: string;
        qualification: string;
        network: string;
        achievements: string;
      };
      teamMembersTable: Array<{
        role: string;
        task: string;
        capability: string;
        status: string;
      }>;
      partnersTable: Array<{
        name: string;
        role: string;
        detail: string;
        timing: string;
      }>;
    };
  }>;
}

// AI 프롬프트 생성 (원샷 프롬프팅용)
export function generatePrompt(input: BusinessPlanInput): string {
  return `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
다음 입력 정보를 바탕으로 전문적인 사업계획서를 JSON 형식으로 작성해주세요.

## 입력 정보

### 기본 정보
- 과제명: ${input.itemName}
- 회사명: ${input.companyName}
- 대표자 직책: ${input.jobTitle}
- 제품/서비스명: ${input.productName}
- 카테고리: ${input.category}
- 개발 결과물: ${input.outputs}

### 아이템 개요
- 제품/서비스 개요: ${input.overview}
- 문제 인식 요약: ${input.problemOverview}
- 솔루션 요약: ${input.solutionOverview}
- 성장 전략 요약: ${input.scaleupOverview}
- 팀 구성 요약: ${input.teamOverview}

### 문제 인식
- 시장 현황: ${input.marketStatus}
- 시장 문제점: ${input.problems}

### 실현 가능성
- 개발 계획: ${input.developmentPlan}
- 차별화 요소: ${input.differentiation}
- 추진 일정: ${input.schedule}
- 1차년도 예산: ${input.budget1}
- 2차년도 예산: ${input.budget2}

### 성장 전략
- 경쟁사 분석: ${input.competitors}
- 시장 진입 전략: ${input.marketEntry}
- 비즈니스 모델: ${input.businessModel}
- ESG 전략: ${input.esg}

### 팀 구성
- 팀 구성원: ${input.teamMembers}
- 팀 상세 역할: ${input.teamDetail}
- 창업자 역량: ${input.founderCapability}
- 협력 파트너: ${input.partners}

## 출력 형식
위 정보를 바탕으로 정부 지원사업 양식에 맞는 전문적인 사업계획서를 작성하세요.
각 섹션은 구체적이고 설득력 있게 작성하며, 수치와 근거를 포함해주세요.

JSON 형식으로 응답해주세요.`;
}
