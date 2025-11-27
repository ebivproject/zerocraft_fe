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
  } catch (error) {
    console.error("AI 힌트 생성 오류:", error);
    return NextResponse.json(
      { error: "AI 힌트 생성 중 오류가 발생했습니다." },
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
  contextInfo?: string
): string {
  let formatInstruction = "";

  if (fieldType === "list") {
    formatInstruction = `
[출력 형식]
- 각 항목을 줄바꿈으로 구분하여 작성하세요.
- 불렛기호(•, - 등)나 번호를 붙이지 마세요.
- 오직 내용만 작성하세요.
- 3~5개의 항목으로 작성하세요.`;
  } else if (fieldType === "table") {
    const headers = tableHeaders ? tableHeaders.join("|") : "";
    formatInstruction = `
[출력 형식]
- 각 행을 줄바꿈으로 구분하세요.
- 각 열(셀)은 파이프 기호(|)로 구분하세요.
- 헤더: ${headers}
- 헤더 행은 포함하지 말고 데이터 행만 작성하세요.
- 3~5개의 행으로 작성하세요.`;
  } else if (fieldType === "textarea") {
    formatInstruction = `
[출력 형식]
- 구조화된 형식으로 작성하세요 (【제목】 사용 가능).
- 구체적인 수치와 데이터를 포함하세요.
- 최소 100자 이상으로 작성하세요.`;
  } else {
    formatInstruction = `
[출력 형식]
- 간결하고 명확하게 작성하세요.
- 한 줄로 작성하세요.`;
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

위 정보를 바탕으로 "${question}"에 대한 전문적인 답변을 작성해주세요.

작성 지침:
1. 사용자의 멘트를 기반으로 내용을 확장하고 구체화하세요.
2. 정부 지원사업 평가 기준에 맞게 전문적으로 작성하세요.
3. 구체적인 수치, 근거, 기술적 내용을 포함하세요.
4. 예시 형식을 참고하되, 사용자의 아이디어에 맞게 커스터마이징하세요.
5. 설명 없이 바로 답변 내용만 출력하세요.`;
}

// AI 콘텐츠 생성 (Gemini API 호출)
async function generateAIContent(prompt: string): Promise<string> {
  const apiKey = process.env.gemini_api_key;

  if (!apiKey) {
    throw new Error("Gemini API Key가 설정되지 않았습니다.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}
