import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// AI 필드별 생성 API
export async function POST(req: NextRequest) {
  try {
    const { fieldId, prompt, context, example, fieldType, tableHeaders } =
      await req.json();

    if (!fieldId || !prompt) {
      return NextResponse.json(
        { error: "fieldId와 prompt가 필요합니다." },
        { status: 400 }
      );
    }

    // 컨텍스트 기반 프롬프트 생성
    const contextInfo = buildContextInfo(context);
    const fullPrompt = buildFullPrompt(
      fieldId,
      prompt,
      contextInfo,
      example,
      fieldType,
      tableHeaders
    );

    // 실제 AI API 호출
    const content = await generateAIContent(fullPrompt);

    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI 생성 오류:", error);
    return NextResponse.json(
      { error: "AI 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 컨텍스트 정보 구성
function buildContextInfo(context: Record<string, string>): string {
  if (!context || Object.keys(context).length === 0) {
    return "";
  }

  const relevantFields: Record<string, string> = {
    itemName: "창업 아이템명",
    productName: "제품/서비스명",
    category: "범주",
    companyName: "기업명",
    itemOverview: "아이템 개요",
    problemRecognition: "문제 인식",
    feasibility: "실현 가능성",
    growthStrategy: "성장 전략",
  };

  const parts: string[] = [];
  for (const [key, label] of Object.entries(relevantFields)) {
    if (context[key]) {
      parts.push(`${label}: ${context[key]}`);
    }
  }

  return parts.length > 0
    ? `\n\n[사용자가 입력한 정보]\n${parts.join("\n")}`
    : "";
}

// 전체 프롬프트 생성
function buildFullPrompt(
  fieldId: string,
  prompt: string,
  contextInfo: string,
  example: string,
  fieldType?: string,
  tableHeaders?: string[]
): string {
  let formatInstruction = "";

  if (fieldType === "list") {
    formatInstruction = `
[작성 형식]
- 각 항목을 줄바꿈으로 구분하여 작성하세요.
- 불렛기호(•, - 등)나 번호를 붙이지 마세요.
- 오직 내용만 작성하세요.`;
  } else if (fieldType === "table") {
    const headers = tableHeaders ? tableHeaders.join("|") : "";
    formatInstruction = `
[작성 형식]
- 각 행을 줄바꿈으로 구분하세요.
- 각 열(셀)은 파이프 기호(|)로 구분하세요.
- 헤더: ${headers}
- 헤더 행은 포함하지 말고 데이터 행만 작성하세요.`;
  }

  return `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
사용자의 창업 아이템에 맞게 전문적이고 구체적인 내용을 작성해주세요.

[작성 지침]
${prompt}
${formatInstruction}

[참고 예시]
${example}
${contextInfo}

위 정보를 바탕으로 ${fieldId}에 대한 전문적인 내용을 작성해주세요.
- 구체적인 수치와 근거를 포함하세요
- 정부 지원사업 평가 기준에 맞게 작성하세요
- 예시 형식을 참고하되, 사용자의 아이템에 맞게 커스터마이징하세요`;
}

// AI 콘텐츠 생성 (Gemini API 호출)
async function generateAIContent(prompt: string): Promise<string> {
  // 환경변수 이름 다양하게 체크 (대소문자)
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.gemini_api_key ||
    process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    console.error(
      "Available env keys:",
      Object.keys(process.env).filter(
        (k) =>
          k.toLowerCase().includes("gemini") ||
          k.toLowerCase().includes("google")
      )
    );
    throw new Error(
      "Gemini API Key가 설정되지 않았습니다. 환경변수를 확인해주세요."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // gemini-2.5-pro 사용
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (apiError: unknown) {
    console.error("Gemini API 호출 오류:", apiError);
    if (apiError instanceof Error) {
      throw new Error(`Gemini API 오류: ${apiError.message}`);
    }
    throw new Error("Gemini API 호출 중 알 수 없는 오류가 발생했습니다.");
  }
}
