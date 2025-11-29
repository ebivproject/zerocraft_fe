import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// AI 힌트 생성 API
// 사용자의 간단한 멘트를 해당 질문에 맞는 전문적인 답변으로 변환
export async function POST(req: NextRequest) {
  try {
    const {
      userPrompt,
      question,
      questionDescription,
      example,
      fieldType,
      tableHeaders,
      context,
    } = await req.json();

    if (!userPrompt || !question) {
      return NextResponse.json(
        { error: "userPrompt와 question이 필요합니다." },
        { status: 400 }
      );
    }

    // 컨텍스트 기반 정보 구성
    const contextInfo = buildContextInfo(context);

    // 프롬프트 구성
    const fullPrompt = buildHintPrompt(
      userPrompt,
      question,
      questionDescription,
      example,
      fieldType,
      tableHeaders,
      contextInfo
    );

    // AI API 호출
    const content = await generateAIContent(fullPrompt);

    return NextResponse.json({ content });
  } catch (error: unknown) {
    console.error("AI 힌트 생성 오류:", error);

    // 에러 메시지 상세화
    let errorMessage = "AI 힌트 생성 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error details:", error.message, error.stack);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
    outputs: "산출물",
    representative: "직업",
  };

  const parts: string[] = [];
  for (const [key, label] of Object.entries(relevantFields)) {
    if (context[key]) {
      parts.push(`${label}: ${context[key]}`);
    }
  }

  return parts.length > 0
    ? `\n\n[사용자가 이전에 입력한 정보]\n${parts.join("\n")}`
    : "";
}

// 힌트 프롬프트 생성
function buildHintPrompt(
  userPrompt: string,
  question: string,
  questionDescription: string,
  example: string,
  fieldType?: string,
  tableHeaders?: string[],
  contextInfo?: string,
  maxLength?: number
): string {
  // 예시 길이 + 300자를 기본 최대 글자 수로 설정
  const exampleLength = example ? example.length : 100;
  const targetMaxLength = maxLength || exampleLength + 300;

  let formatInstruction = "";

  if (fieldType === "list") {
    formatInstruction = `
[출력 형식]
- 각 항목을 줄바꿈으로 구분하여 작성하세요.
- 불렛기호(•, - 등)나 번호를 붙이지 마세요.
- 오직 내용만 작성하세요.
- 3~5개의 항목으로 작성하세요.
- 전체 글자 수는 ${targetMaxLength}자 이내로 작성하세요.`;
  } else if (fieldType === "table") {
    const headers = tableHeaders ? tableHeaders.join("|") : "";
    formatInstruction = `
[출력 형식]
- 각 행을 줄바꿈으로 구분하세요.
- 각 열(셀)은 파이프 기호(|)로 구분하세요.
- 헤더: ${headers}
- 헤더 행은 포함하지 말고 데이터 행만 작성하세요.
- 3~5개의 행으로 작성하세요.
- 전체 글자 수는 ${targetMaxLength}자 이내로 작성하세요.`;
  } else if (fieldType === "textarea") {
    formatInstruction = `
[출력 형식]
- 자연스럽고 읽기 쉬운 문체로 작성하세요.
- 예시와 비슷한 분량으로 작성하세요.
- 전체 글자 수는 ${targetMaxLength}자 이내로 작성하세요.`;
  } else {
    formatInstruction = `
[출력 형식]
- 간결하고 명확하게 작성하세요.
- 예시와 비슷한 길이로 작성하세요.
- ${targetMaxLength}자 이내로 작성하세요.`;
  }

  return `당신은 정부 지원사업 사업계획서 작성 전문가입니다.
사용자가 제공한 간단한 멘트를 바탕으로 해당 질문에 맞는 전문적이고 구체적인 답변을 작성해주세요.

[질문]
${question}

[질문 설명]
${questionDescription}

[사용자가 입력한 간단한 멘트]
${userPrompt}

[참고 예시]
${example}
${contextInfo || ""}
${formatInstruction}

위 정보를 바탕으로 "${question}"에 대한 답변을 작성해주세요.

작성 지침:
1. 사용자의 멘트를 기반으로 내용을 확장하고 구체화하세요.
2. 예시의 길이와 비슷하게, 최대 ${targetMaxLength}자 이내로 작성하세요.
3. 너무 딱딱하거나 전문적이지 않게, 자연스러운 문체로 작성하세요.
4. 예시 형식을 참고하되, 사용자의 아이디어에 맞게 커스터마이징하세요.
5. 설명 없이 바로 답변 내용만 출력하세요.`;
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

  // gemini-2.5-flash 모델 사용 (2025년 6월 기준 stable 버전)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
