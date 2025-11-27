import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// WizardData 타입 (간소화)
interface WizardData {
  [key: string]: string | undefined;
}

// AI 사업계획서 생성 API
// 사용자 입력을 기반으로 output.json 형식의 완성된 사업계획서 생성
export async function POST(req: NextRequest) {
  try {
    const { wizardData } = await req.json();

    if (!wizardData) {
      return NextResponse.json(
        { error: "wizardData가 필요합니다." },
        { status: 400 }
      );
    }

    // Gemini API 키 확인
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.gemini_api_key ||
      process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API Key가 설정되지 않았습니다.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // gemini-2.5-pro 모델 사용 (최신 Pro 모델)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // 사용자 입력 데이터 정리
    const inputSummary = buildInputSummary(wizardData);

    // 섹션별 병렬 생성
    const [
      generalStatusResult,
      summaryResult,
      problemResult,
      solutionResult,
      scaleupResult,
      teamResult,
    ] = await Promise.all([
      generateGeneralStatus(model, wizardData),
      generateSummary(model, wizardData, inputSummary),
      generateProblem(model, wizardData, inputSummary),
      generateSolution(model, wizardData, inputSummary),
      generateScaleup(model, wizardData, inputSummary),
      generateTeam(model, wizardData, inputSummary),
    ]);

    // 최종 output.json 형식으로 조합
    const businessPlanOutput = {
      documentTitle: `${wizardData.itemName || "창업 아이템"} 사업계획서`,
      sections: {
        generalStatus: generalStatusResult,
        summary: summaryResult,
        problem: problemResult,
        solution: solutionResult,
        scaleup: scaleupResult,
        team: teamResult,
      },
    };

    return NextResponse.json({ output: businessPlanOutput });
  } catch (error: unknown) {
    console.error("AI 사업계획서 생성 오류:", error);

    let errorMessage = "AI 사업계획서 생성 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error details:", error.message, error.stack);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 사용자 입력 요약 생성
function buildInputSummary(data: WizardData): string {
  const parts: string[] = [];

  if (data.itemName) parts.push(`창업 아이템: ${data.itemName}`);
  if (data.productName) parts.push(`제품/서비스명: ${data.productName}`);
  if (data.category) parts.push(`범주: ${data.category}`);
  if (data.itemOverview) parts.push(`아이템 개요: ${data.itemOverview}`);
  if (data.problemRecognition)
    parts.push(`문제 인식: ${data.problemRecognition}`);
  if (data.feasibility) parts.push(`실현 가능성: ${data.feasibility}`);
  if (data.growthStrategy) parts.push(`성장 전략: ${data.growthStrategy}`);
  if (data.marketStatus) parts.push(`시장 현황: ${data.marketStatus}`);
  if (data.problems) parts.push(`해결할 문제점: ${data.problems}`);
  if (data.differentiation) parts.push(`차별화 전략: ${data.differentiation}`);

  return parts.join("\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeminiModel = any;

// 일반현황 생성 (사용자 입력 그대로 사용)
async function generateGeneralStatus(model: GeminiModel, data: WizardData) {
  return {
    title: "□ 일반현황",
    data: {
      itemName: data.itemName || "",
      outputs: data.outputs || "",
      representative: data.representative || "",
      companyName: data.companyName || "",
    },
  };
}

// 아이템 개요(요약) 생성
async function generateSummary(
  model: GeminiModel,
  data: WizardData,
  inputSummary: string
) {
  const prompt = `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
아래 사용자 입력을 바탕으로 "창업 아이템 개요(요약)" 섹션을 작성해주세요.

[사용자 입력]
${inputSummary}

[작성 지침]
1. 핵심 기능과 고객 혜택을 명확히 구분하여 작성
2. 문제 인식, 실현 가능성, 성장 전략을 각각 2-3문장으로 요약
3. 팀 구성 특징을 간략히 언급
4. 전문적이면서도 읽기 쉬운 문체 사용

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "productName": "제품/서비스명",
  "category": "범주",
  "itemOverview": {
    "coreFunctions": "핵심 기능 설명 (3-5문장)",
    "customerBenefits": "고객 혜택 설명 (3-5문장)"
  },
  "problemRecognition": "문제 인식 요약 (2-3문장)",
  "feasibility": "실현 가능성 요약 (2-3문장)",
  "growthStrategy": "성장 전략 요약 (2-3문장)",
  "teamConfiguration": "팀 구성 요약 (1-2문장)"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: "□ 창업 아이템 개요(요약)",
        data: {
          productName: parsed.productName || data.productName || "",
          category: parsed.category || data.category || "",
          itemOverview: parsed.itemOverview || {
            coreFunctions: data.itemOverview || "",
            customerBenefits: "",
          },
          problemRecognition:
            parsed.problemRecognition || data.problemRecognition || "",
          feasibility: parsed.feasibility || data.feasibility || "",
          growthStrategy: parsed.growthStrategy || data.growthStrategy || "",
          teamConfiguration:
            parsed.teamConfiguration || data.teamConfiguration || "",
        },
      };
    }
  } catch (e) {
    console.error("Summary 생성 오류:", e);
  }

  // Fallback: 사용자 입력 그대로
  return {
    title: "□ 창업 아이템 개요(요약)",
    data: {
      productName: data.productName || "",
      category: data.category || "",
      itemOverview: {
        coreFunctions: data.itemOverview || "",
        customerBenefits: "",
      },
      problemRecognition: data.problemRecognition || "",
      feasibility: data.feasibility || "",
      growthStrategy: data.growthStrategy || "",
      teamConfiguration: data.teamConfiguration || "",
    },
  };
}

// 문제 인식 섹션 생성
async function generateProblem(
  model: GeminiModel,
  data: WizardData,
  inputSummary: string
) {
  const prompt = `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
아래 사용자 입력을 바탕으로 "문제 인식 (Problem)" 섹션을 작성해주세요.

[사용자 입력]
${inputSummary}
시장 현황: ${data.marketStatus || "없음"}
문제점: ${data.problems || "없음"}

[작성 지침]
1. 시장 현황을 구체적인 수치와 트렌드로 설명 (3-5문장)
2. 문제점을 3-5개로 정리, 각 문제는 구체적이고 해결 가능한 것으로
3. 문제의 심각성과 시급성을 강조

다음 JSON 형식으로만 응답하세요:
{
  "marketStatus": "시장 현황 설명 (구체적 수치 포함, 3-5문장)",
  "problems": ["문제점1", "문제점2", "문제점3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: "1. 문제 인식 (Problem)",
        subSections: [
          {
            subTitle: "1-1. 창업 아이템의 필요성",
            content: {
              marketStatus: parsed.marketStatus || data.marketStatus || "",
              problems: Array.isArray(parsed.problems)
                ? parsed.problems
                : (data.problems || "")
                    .split("\n")
                    .filter((p: string) => p.trim()),
            },
          },
        ],
      };
    }
  } catch (e) {
    console.error("Problem 생성 오류:", e);
  }

  // Fallback
  return {
    title: "1. 문제 인식 (Problem)",
    subSections: [
      {
        subTitle: "1-1. 창업 아이템의 필요성",
        content: {
          marketStatus: data.marketStatus || "",
          problems: (data.problems || "")
            .split("\n")
            .filter((p: string) => p.trim()),
        },
      },
    ],
  };
}

// 실현 가능성 섹션 생성
async function generateSolution(
  model: GeminiModel,
  data: WizardData,
  inputSummary: string
) {
  const prompt = `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
아래 사용자 입력을 바탕으로 "실현 가능성 (Solution)" 섹션을 작성해주세요.

[사용자 입력]
${inputSummary}
개발 목표: ${data.developmentGoals || "없음"}
차별화 전략: ${data.differentiation || "없음"}
개발 일정: ${data.schedule || "없음"}
예산 (1단계): ${data.budget1 || "없음"}
예산 (2단계): ${data.budget2 || "없음"}

[작성 지침]
1. 개발 목표는 SMART 원칙에 맞게 3-5개로 정리
2. 차별화 전략은 경쟁사 대비 우위점을 명확히
3. 일정표와 예산은 현실적이고 구체적으로

다음 JSON 형식으로만 응답하세요:
{
  "developmentGoals": ["목표1", "목표2", "목표3"],
  "differentiation": "차별화 전략 설명 (3-5문장)",
  "scheduleTable": [
    {"step": "1단계", "task": "과업명", "period": "2025.01-03", "detail": "세부내용"}
  ],
  "budgetPhase1": {
    "items": [{"category": "재료비", "detail": "세부내역", "amount": "5,000,000"}],
    "total": "10,000,000"
  },
  "budgetPhase2": {
    "items": [{"category": "외주용역비", "detail": "세부내역", "amount": "5,000,000"}],
    "total": "10,000,000"
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: "2. 실현 가능성 (Solution)",
        subSections: [
          {
            subTitle: "2-1. 창업 아이템의 개발 계획",
            content: {
              developmentGoals: parsed.developmentGoals || [],
              differentiation:
                parsed.differentiation || data.differentiation || "",
              scheduleTable: parsed.scheduleTable || [],
            },
          },
          {
            subTitle: "2-2. 정부지원사업비 집행 계획",
            content: {
              budgetPhase1: parsed.budgetPhase1 || { items: [], total: "0" },
              budgetPhase2: parsed.budgetPhase2 || { items: [], total: "0" },
            },
          },
        ],
      };
    }
  } catch (e) {
    console.error("Solution 생성 오류:", e);
  }

  // Fallback
  return {
    title: "2. 실현 가능성 (Solution)",
    subSections: [
      {
        subTitle: "2-1. 창업 아이템의 개발 계획",
        content: {
          developmentGoals: (data.developmentGoals || "")
            .split("\n")
            .filter((g: string) => g.trim()),
          differentiation: data.differentiation || "",
          scheduleTable: [],
        },
      },
      {
        subTitle: "2-2. 정부지원사업비 집행 계획",
        content: {
          budgetPhase1: { items: [], total: "0" },
          budgetPhase2: { items: [], total: "0" },
        },
      },
    ],
  };
}

// 성장전략 섹션 생성
async function generateScaleup(
  model: GeminiModel,
  data: WizardData,
  inputSummary: string
) {
  const prompt = `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
아래 사용자 입력을 바탕으로 "성장전략 (Scale-up)" 섹션을 작성해주세요.

[사용자 입력]
${inputSummary}
경쟁사 분석: ${data.competitorAnalysis || "없음"}
시장 진입 전략: ${data.marketEntry || "없음"}
비즈니스 모델: ${data.businessModel || "없음"}
ESG 전략: ${data.esgStrategy || "없음"}

[작성 지침]
1. 경쟁사 분석은 2-3개 경쟁사의 강점/약점 분석
2. 시장 진입 전략은 타겟, 채널, 초기 목표를 구체적으로
3. 비즈니스 모델은 수익원, 가격정책, 매출전망 포함
4. ESG는 환경/사회/지배구조 각각 1-2문장

다음 JSON 형식으로만 응답하세요:
{
  "competitorAnalysis": ["경쟁사1 분석", "경쟁사2 분석"],
  "marketEntryStrategy": {
    "target": "타겟 고객층",
    "channel": "온라인 유통 채널",
    "offline": "오프라인 전략",
    "initialGoal": "초기 6개월 목표"
  },
  "businessModel": {
    "revenueSources": "수익 모델",
    "pricing": "가격 정책",
    "financialProjection": "3년 매출 전망",
    "breakEvenPoint": "손익분기점 예상"
  },
  "esgStrategy": {
    "environment": "환경 전략",
    "social": "사회적 가치",
    "governance": "지배구조"
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: "3. 성장전략 (Scale-up)",
        subSections: [
          {
            subTitle: "3-1. 사업화 추진 전략",
            content: {
              competitorAnalysis: parsed.competitorAnalysis || [],
              marketEntryStrategy: parsed.marketEntryStrategy || {
                target: "",
                channel: "",
                offline: "",
                initialGoal: "",
              },
              businessModel: parsed.businessModel || {
                revenueSources: "",
                pricing: "",
                financialProjection: "",
                breakEvenPoint: "",
              },
              esgStrategy: parsed.esgStrategy || {
                environment: "",
                social: "",
                governance: "",
              },
            },
          },
        ],
      };
    }
  } catch (e) {
    console.error("Scaleup 생성 오류:", e);
  }

  // Fallback
  return {
    title: "3. 성장전략 (Scale-up)",
    subSections: [
      {
        subTitle: "3-1. 사업화 추진 전략",
        content: {
          competitorAnalysis: (data.competitorAnalysis || "")
            .split("\n")
            .filter((c: string) => c.trim()),
          marketEntryStrategy: {
            target: "",
            channel: "",
            offline: "",
            initialGoal: "",
          },
          businessModel: {
            revenueSources: "",
            pricing: "",
            financialProjection: "",
            breakEvenPoint: "",
          },
          esgStrategy: {
            environment: "",
            social: "",
            governance: "",
          },
        },
      },
    ],
  };
}

// 팀 구성 섹션 생성
async function generateTeam(
  model: GeminiModel,
  data: WizardData,
  inputSummary: string
) {
  const prompt = `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
아래 사용자 입력을 바탕으로 "팀 구성 (Team)" 섹션을 작성해주세요.

[사용자 입력]
${inputSummary}
창업자 역량: ${data.founderCapability || "없음"}
팀원 구성: ${data.teamMembers || "없음"}
협력 파트너: ${data.partners || "없음"}

[작성 지침]
1. 창업자 역량은 학력, 경력, 자격증, 네트워크, 성과로 구분
2. 팀원 구성은 역할, 담당업무, 역량, 상태(재직/채용예정)로 정리
3. 협력 파트너는 기업명, 역할, 협업내용, 시기로 정리

다음 JSON 형식으로만 응답하세요:
{
  "founderCapability": {
    "education": "학력",
    "experience": "관련 경력",
    "qualification": "보유 자격증",
    "network": "산업 네트워크",
    "achievements": "주요 성과"
  },
  "teamMembersTable": [
    {"role": "CTO", "task": "기술 총괄", "capability": "10년 개발 경력", "status": "재직"}
  ],
  "partnersTable": [
    {"name": "협력사명", "role": "기술 협력", "detail": "협업 내용", "timing": "2025년 상반기"}
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: "4. 팀 구성 (Team)",
        subSections: [
          {
            subTitle: "4-1. 대표자 및 팀원 구성 계획",
            content: {
              founderCapability: parsed.founderCapability || {
                education: "",
                experience: "",
                qualification: "",
                network: "",
                achievements: "",
              },
              teamMembersTable: parsed.teamMembersTable || [],
              partnersTable: parsed.partnersTable || [],
            },
          },
        ],
      };
    }
  } catch (e) {
    console.error("Team 생성 오류:", e);
  }

  // Fallback
  return {
    title: "4. 팀 구성 (Team)",
    subSections: [
      {
        subTitle: "4-1. 대표자 및 팀원 구성 계획",
        content: {
          founderCapability: {
            education: "",
            experience: "",
            qualification: "",
            network: "",
            achievements: "",
          },
          teamMembersTable: [],
          partnersTable: [],
        },
      },
    ],
  };
}
