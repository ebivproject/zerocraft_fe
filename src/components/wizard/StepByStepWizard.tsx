"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import styles from "./StepByStepWizard.module.css";

// ============================================================
// 질문 정의 (result_frame.pdf 기반)
// ============================================================

export interface QuestionStep {
  id: string;
  section: string;
  title: string;
  description: string;
  placeholder: string;
  example: string;
  minLength: number;
  fieldType: "text" | "textarea" | "list" | "table";
  aiPrompt: string; // AI 생성용 프롬프트
  tableHeaders?: string[]; // 테이블 형식일 경우
  outputKey: string; // output.json 매핑 키
}

export const WIZARD_STEPS: QuestionStep[] = [
  // ============================================================
  // 1. 일반현황
  // ============================================================
  {
    id: "itemName",
    section: "일반현황",
    title: "창업 아이템명",
    description: "개발하고자 하는 제품/서비스의 명칭을 입력해주세요.",
    placeholder: "예: AI 기반 스마트 물류 최적화 시스템",
    example:
      "AI 기반 스마트 물류 최적화 시스템, 맞춤형 헬스케어 플랫폼, 친환경 포장재 제조 시스템",
    minLength: 5,
    fieldType: "text",
    aiPrompt:
      "사용자의 아이디어를 바탕으로 정부 지원사업에 적합한 창업 아이템명을 제안해주세요. 기술적 특징과 혁신성이 드러나는 명칭이어야 합니다.",
    outputKey: "generalStatus.data.itemName",
  },
  {
    id: "outputs",
    section: "일반현황",
    title: "산출물 (협약기간 내 목표)",
    description:
      "협약기간 내 제작·개발 완료할 최종 생산품의 형태, 수량 등을 기재해주세요.",
    placeholder: "예: AI 물류 예측 시스템 1식",
    example:
      "• 시제품 1식 (MVP 버전)\n• 모바일 앱 1식 (iOS/Android)\n• 웹 대시보드 1식\n• 사용자 매뉴얼 1부",
    minLength: 20,
    fieldType: "list",
    aiPrompt:
      "창업 아이템에 맞는 협약기간 내 달성 가능한 구체적인 산출물 목록을 작성해주세요. 형태와 수량을 명확히 기재해야 합니다.",
    outputKey: "generalStatus.data.outputs",
  },
  {
    id: "representative",
    section: "일반현황",
    title: "직업",
    description: "현재 직업을 선택해주세요. (직장명 기재 불가)",
    placeholder: "예: 연구원 / IT 서비스업",
    example: "교수, 연구원, 사무직, 일반인, 대학생, 대학원생",
    minLength: 2,
    fieldType: "text",
    aiPrompt: "",
    outputKey: "generalStatus.data.representative",
  },
  {
    id: "companyName",
    section: "일반현황",
    title: "기업(예정)명",
    description: "설립 예정인 회사명을 입력해주세요.",
    placeholder: "예: (주)스마트로지텍",
    example: "(주)테크이노베이션, 주식회사 AI솔루션, (주)그린테크",
    minLength: 3,
    fieldType: "text",
    aiPrompt:
      "창업 아이템에 어울리는 기업명을 제안해주세요. 사업 특성이 반영되고 기억하기 쉬운 이름이어야 합니다.",
    outputKey: "generalStatus.data.companyName",
  },

  // ============================================================
  // 2. 창업 아이템 개요(요약)
  // ============================================================
  {
    id: "productName",
    section: "아이템 개요",
    title: "제품/서비스 명칭",
    description: "실제 출시할 제품/서비스의 브랜드명을 입력해주세요.",
    placeholder: "예: SmartLogi (스마트로지)",
    example: "게토레이, Windows, 알파고, 카카오톡",
    minLength: 2,
    fieldType: "text",
    aiPrompt:
      "창업 아이템에 적합한 제품/서비스 브랜드명을 제안해주세요. 기억하기 쉽고 사업 특성이 반영된 이름이어야 합니다.",
    outputKey: "summary.data.productName",
  },
  {
    id: "category",
    section: "아이템 개요",
    title: "범주 (카테고리)",
    description: "제품/서비스가 속하는 범주를 입력해주세요.",
    placeholder: "예: 물류/AI/SaaS",
    example: "스포츠음료, OS(운영체계), 인공지능프로그램, 헬스케어/플랫폼",
    minLength: 2,
    fieldType: "text",
    aiPrompt: "창업 아이템이 속하는 산업 범주와 기술 분야를 분류해주세요.",
    outputKey: "summary.data.category",
  },
  {
    id: "itemOverview",
    section: "아이템 개요",
    title: "아이템 개요",
    description:
      "본 지원사업을 통해 개발하고자 하는 제품·서비스의 개요(사용 용도, 사양, 가격 등), 핵심 기능·성능, 고객 제공 혜택 등을 작성해주세요.",
    placeholder:
      "핵심 기능과 고객 혜택을 구체적으로 작성해주세요.\n\n예: AI 기반 수요 예측 알고리즘을 통해 물류 배송 시간을 30% 단축하고...",
    example:
      "【핵심 기능】\n- AI 수요 예측 엔진: 95% 이상의 예측 정확도\n- 실시간 경로 최적화: 배송 시간 30% 단축\n- 통합 관제 대시보드: 실시간 모니터링\n\n【고객 혜택】\n- 중소 물류업체에게 대기업 수준의 최적화 기술 제공\n- 합리적인 가격(월 50~200만원)으로 비용 절감",
    minLength: 100,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템의 핵심 기능과 고객 혜택을 구체적으로 작성해주세요. 기술적 특징, 성능 지표, 고객이 얻는 가치를 명확히 기술해야 합니다. 【핵심 기능】과 【고객 혜택】 섹션으로 구분하여 작성하세요.",
    outputKey: "summary.data.itemOverview",
  },
  {
    id: "problemRecognition",
    section: "아이템 개요",
    title: "문제 인식 (Problem) 요약",
    description:
      "개발하고자 하는 창업 아이템의 국내·외 시장 현황 및 문제점 등 문제 해결을 위한 창업 아이템 필요성을 요약해주세요.",
    placeholder:
      "예: 국내 물류 시장은 연간 80조원 규모이나, 중소 물류업체의 70%가 수작업 기반 운영으로 인한 비효율 문제를 겪고 있습니다...",
    example:
      "국내 물류 시장 규모는 약 80조원이며, 연평균 5% 성장 중입니다. 그러나 중소 물류업체의 디지털 전환율은 30%에 불과하며, 배송 시간 예측 불가, 경로 최적화 부재 등의 문제로 연간 15%의 매출 손실이 발생하고 있습니다.",
    minLength: 80,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템이 해결하고자 하는 시장의 문제점과 현황을 분석해주세요. 구체적인 수치와 통계를 포함하여 문제의 심각성을 강조하세요.",
    outputKey: "summary.data.problemRecognition",
  },
  {
    id: "feasibility",
    section: "아이템 개요",
    title: "실현 가능성 (Solution) 요약",
    description:
      "개발하고자 하는 창업 아이템을 사업기간 내 제품·서비스로 개발 또는 구체화하고자 하는 계획과 차별성 및 경쟁력 확보 전략을 요약해주세요.",
    placeholder:
      "예: 자체 개발 AI 엔진(특허 출원 중)을 통해 95% 이상의 배송 시간 예측 정확도를 달성하였으며...",
    example:
      "자체 개발 AI 엔진을 통해 95% 이상의 예측 정확도를 달성하였습니다. 협약기간 내 시제품 완성 및 파일럿 테스트를 완료할 계획이며, 핵심 개발 인력 3명이 확보되어 있습니다. 기존 솔루션 대비 50% 저렴한 가격으로 차별화합니다.",
    minLength: 80,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템의 기술적 실현 가능성과 차별화 전략을 작성해주세요. 핵심 기술, 개발 계획, 경쟁 우위 요소를 구체적으로 기술하세요.",
    outputKey: "summary.data.feasibility",
  },
  {
    id: "growthStrategy",
    section: "아이템 개요",
    title: "성장전략 (Scale-up) 요약",
    description:
      "경쟁사 분석, 목표 시장 진입 전략, 창업 아이템의 비즈니스 모델(수익화 모델), 사업 전체 로드맵, 투자유치 전략 등을 요약해주세요.",
    placeholder:
      "예: 1년차 수도권 중소 물류업체 100개사 확보, 2년차 전국 확대 및 월 매출 5억원 달성...",
    example:
      "1년차: 수도권 중소 물류업체 100개사 확보 (MAU 1,000명)\n2년차: 전국 확대 및 월 매출 5억원 달성\n3년차: 동남아 시장 진출, 시리즈A 투자 유치 (50억원)\n\n수익 모델: SaaS 구독 (월 50~200만원)",
    minLength: 80,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템의 3개년 성장 전략과 비즈니스 모델을 작성해주세요. 연도별 목표, 수익 모델, 투자 계획을 포함하세요.",
    outputKey: "summary.data.growthStrategy",
  },
  {
    id: "teamConfiguration",
    section: "아이템 개요",
    title: "팀 구성 (Team) 요약",
    description:
      "대표자, 팀원, 업무파트너(협력기업) 등 역량 활용 계획을 요약해주세요.",
    placeholder:
      "예: AI 전문가 2명(박사급), 물류 경력자 3명(10년+), SW 개발자 5명으로 구성된 10명의 전문 팀입니다...",
    example:
      "대표자: AI 연구 10년 경력 (박사)\n핵심 팀원: AI 전문가 2명, 개발자 3명, 물류 전문가 1명\n협력사: ABC물류(파일럿 테스트), XYZ클라우드(인프라 지원)",
    minLength: 50,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템 실현을 위한 팀 구성 현황을 작성해주세요. 대표자 역량, 핵심 팀원, 협력사를 포함하세요.",
    outputKey: "summary.data.teamConfiguration",
  },

  // ============================================================
  // 3. 문제 인식 (Problem) - 상세
  // ============================================================
  {
    id: "marketStatus",
    section: "문제 인식",
    title: "시장 현황",
    description:
      "개발하고자 하는 창업 아이템의 국내·외 시장 현황을 구체적으로 작성해주세요.",
    placeholder:
      "예: 국내 물류 시장 규모는 약 80조원이며, 연평균 5% 성장 중입니다. 특히 이커머스 성장과 함께...",
    example:
      "국내 물류 시장 규모는 약 80조원이며, 연평균 5% 성장 중입니다. 특히 이커머스 성장과 함께 라스트마일 배송 시장이 급성장하고 있습니다.\n\n글로벌 물류 기술 시장은 2025년 1,200억 달러 규모로 예상되며, 연평균 12% 성장이 전망됩니다.",
    minLength: 100,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템 관련 국내외 시장 현황을 분석해주세요. 시장 규모, 성장률, 주요 트렌드를 구체적인 수치와 함께 작성하세요.",
    outputKey: "problem.subSections[0].content.marketStatus",
  },
  {
    id: "problems",
    section: "문제 인식",
    title: "시장 문제점",
    description:
      "현재 시장에서 발생하고 있는 문제점들을 구체적으로 나열해주세요.",
    placeholder: "예: 배송 시간 예측 불가: 고객 불만 증가 및 CS 비용 상승",
    example:
      "배송 시간 예측 불가: 고객 불만 증가 및 CS 비용 상승 (연간 평균 15% 매출 손실)\n수작업 기반 경로 설정: 불필요한 이동거리 발생으로 연료비 20% 낭비\n실시간 모니터링 부재: 배송 지연 대응 지연으로 고객 이탈률 증가\n데이터 기반 의사결정 어려움: 수요 예측 실패로 인한 재고 관리 비효율",
    minLength: 100,
    fieldType: "list",
    aiPrompt:
      "시장에서 발생하고 있는 구체적인 문제점 4~5가지를 작성해주세요. 각 문제점에는 구체적인 수치와 영향을 포함하세요.",
    outputKey: "problem.subSections[0].content.problems",
  },

  // ============================================================
  // 4. 실현 가능성 (Solution) - 상세
  // ============================================================
  {
    id: "developmentGoals",
    section: "실현 가능성",
    title: "개발 목표",
    description:
      "아이디어를 제품·서비스로 개발 또는 구체화하고자 하는 목표를 작성해주세요.",
    placeholder: "예: AI 수요 예측 엔진 개발: 95% 이상의 예측 정확도 달성",
    example:
      "AI 수요 예측 엔진 개발: 95% 이상의 예측 정확도 달성\n실시간 경로 최적화 알고리즘 구현: 배송 시간 30% 단축\n통합 관제 대시보드 개발: 실시간 모니터링 및 리포팅 기능\n모바일 앱 개발: iOS/Android 드라이버용 앱",
    minLength: 80,
    fieldType: "list",
    aiPrompt:
      "창업 아이템의 구체적인 개발 목표 3~4가지를 작성해주세요. 각 목표에는 측정 가능한 성과 지표를 포함하세요.",
    outputKey: "solution.subSections[0].content.developmentGoals",
  },
  {
    id: "differentiation",
    section: "실현 가능성",
    title: "차별화 전략",
    description:
      "창업 아이템의 기능·성능의 차별성 및 경쟁력 확보 전략을 작성해주세요.",
    placeholder:
      "예: 자체 개발 AI 엔진을 통한 95% 이상의 배송 시간 예측 정확도로, 기존 솔루션(70~80%) 대비 월등한 성능을 제공합니다...",
    example:
      "【기술적 차별화】\n- 자체 개발 AI 엔진: 95% 이상의 예측 정확도 (기존 70~80%)\n- 특허 출원 기술 2건 보유\n\n【가격 차별화】\n- 기존 솔루션 대비 50% 저렴한 가격\n- 중소기업 맞춤형 요금제 (월 50만원~)\n\n【서비스 차별화】\n- 3일 이내 빠른 도입\n- 24시간 고객 지원",
    minLength: 100,
    fieldType: "textarea",
    aiPrompt:
      "창업 아이템의 차별화 전략을 【기술적 차별화】, 【가격 차별화】, 【서비스 차별화】로 구분하여 작성해주세요.",
    outputKey: "solution.subSections[0].content.differentiation",
  },
  {
    id: "schedule",
    section: "실현 가능성",
    title: "사업추진 일정 (협약기간 내)",
    description: "협약기간 내 추진할 일정을 단계별로 작성해주세요.",
    placeholder:
      "예: 1|필수 개발 인력 채용|25.01~25.02|AI 전문가 1명, 백엔드 개발자 2명 채용",
    example:
      "1|필수 개발 인력 채용|25.01~25.02|AI 전문가 1명, 백엔드 개발자 2명 채용\n2|핵심 알고리즘 개발|25.02~25.05|AI 수요 예측 엔진 및 경로 최적화 알고리즘 개발\n3|베타 서비스 개발|25.05~25.08|웹/모바일 앱 개발 및 관제 대시보드 구현\n4|파일럿 테스트|25.08~25.10|협력 물류업체 5개사 대상 실증 테스트\n5|시제품 완성|25.10~25.12|피드백 반영 및 정식 버전 출시 준비",
    minLength: 100,
    fieldType: "table",
    tableHeaders: ["단계", "추진내용", "추진기간", "세부내용"],
    aiPrompt:
      "협약기간(12개월) 내 추진할 일정을 5~6단계로 작성해주세요. 형식: 단계번호|추진내용|추진기간|세부내용",
    outputKey: "solution.subSections[0].content.scheduleTable",
  },
  {
    id: "budget1",
    section: "실현 가능성",
    title: "1단계 정부지원사업비 집행계획",
    description:
      "1단계 정부지원사업비(20백만원 내외) 집행 계획을 작성해주세요.",
    placeholder: "예: 인건비|개발 인력 3명×6개월|9,000,000",
    example:
      "인건비|개발 인력 3명×6개월|9,000,000\n재료비|서버 장비 및 개발 도구 구입|3,000,000\n외주용역비|UI/UX 디자인 외주|5,000,000\n지식재산권|특허 출원 비용|3,000,000",
    minLength: 50,
    fieldType: "table",
    tableHeaders: ["비목", "산출근거", "금액(원)"],
    aiPrompt:
      "1단계 정부지원사업비(총 2,000만원 내외) 집행 계획을 작성해주세요. 형식: 비목|산출근거|금액. 인건비, 재료비, 외주용역비 등으로 구분하세요.",
    outputKey: "solution.subSections[1].content.budgetPhase1",
  },
  {
    id: "budget2",
    section: "실현 가능성",
    title: "2단계 정부지원사업비 집행계획",
    description:
      "2단계 정부지원사업비(40백만원 내외) 집행 계획을 작성해주세요.",
    placeholder: "예: 인건비|개발 인력 5명×6개월|20,000,000",
    example:
      "인건비|개발 인력 5명×6개월|20,000,000\n재료비|클라우드 서버 비용|5,000,000\n외주용역비|보안 점검 및 부하 테스트|8,000,000\n마케팅비|온라인 광고 및 전시회 참가|7,000,000",
    minLength: 50,
    fieldType: "table",
    tableHeaders: ["비목", "산출근거", "금액(원)"],
    aiPrompt:
      "2단계 정부지원사업비(총 4,000만원 내외) 집행 계획을 작성해주세요. 형식: 비목|산출근거|금액. 인건비, 재료비, 외주용역비, 마케팅비 등으로 구분하세요.",
    outputKey: "solution.subSections[1].content.budgetPhase2",
  },

  // ============================================================
  // 5. 성장전략 (Scale-up) - 상세
  // ============================================================
  {
    id: "competitorAnalysis",
    section: "성장전략",
    title: "경쟁사 분석",
    description: "경쟁 제품 및 경쟁사를 분석해주세요.",
    placeholder:
      "경쟁사명 | 주요 특징 및 장단점 | 비고\n예: A사 | 높은 인지도, 비싼 가격 | 시장 점유율 1위",
    example:
      "A사 | 높은 인지도, 다양한 기능 | 가격이 비쌈\nB사 | 저렴한 가격 | 기능이 제한적\n당사 | 합리적 가격, AI 기능 탑재 | 가성비 우수",
    minLength: 80,
    fieldType: "table",
    tableHeaders: ["구분", "주요 특징", "비고"],
    aiPrompt:
      "주요 경쟁사 2~3개를 분석하고, 당사의 차별점을 명확히 작성해주세요. 각 경쟁사의 강점, 약점, 가격대를 포함하세요.",
    outputKey: "scaleup.subSections[0].content.competitorAnalysis",
  },
  {
    id: "marketEntry",
    section: "성장전략",
    title: "시장 진입 전략",
    description:
      "목표 시장 진입 전략을 작성해주세요. 타겟 고객, 온라인/오프라인 채널, 초기 목표를 포함해주세요.",
    placeholder:
      "예:\n【타겟 고객】수도권 소재 중소 물류업체 (연매출 10~100억원 규모)\n【온라인 채널】검색광고, LinkedIn B2B 마케팅\n【오프라인 채널】물류 전시회 참가, 물류협회 제휴\n【초기 목표】1년차 100개 고객사 확보",
    example:
      "【타겟 고객】\n수도권 소재 중소 물류업체 (연매출 10~100억원 규모)\n\n【온라인 채널】\n검색광고, 물류 전문 커뮤니티, LinkedIn B2B 마케팅\n\n【오프라인 채널】\n물류 전시회 참가, 물류협회 제휴, 레퍼런스 고객 확보\n\n【초기 목표】\n1년차 100개 고객사 확보, 월 ARR 5,000만원 달성",
    minLength: 100,
    fieldType: "textarea",
    aiPrompt:
      "시장 진입 전략을 【타겟 고객】, 【온라인 채널】, 【오프라인 채널】, 【초기 목표】로 구분하여 작성해주세요.",
    outputKey: "scaleup.subSections[0].content.marketEntryStrategy",
  },
  {
    id: "businessModel",
    section: "성장전략",
    title: "비즈니스 모델",
    description:
      "창업 아이템의 비즈니스 모델(수익화 모델)을 작성해주세요. 수익 모델, 가격 정책, 매출 전망, 손익분기점을 포함해주세요.",
    placeholder:
      "예:\n【수익 모델】SaaS 월 구독료 (Basic: 50만원, Pro: 100만원)\n【가격 정책】연간 결제 시 20% 할인\n【매출 전망】1년차 6억원, 2년차 20억원\n【손익분기점】서비스 런칭 후 12개월",
    example:
      "【수익 모델】\nSaaS 월 구독료 (Basic: 50만원, Pro: 100만원, Enterprise: 200만원)\n\n【가격 정책】\n배송 건수 기반 종량제 옵션 추가 (건당 100원)\n연간 결제 시 20% 할인\n\n【매출 전망】\n1년차 6억원, 2년차 20억원, 3년차 50억원\n\n【손익분기점】\n서비스 런칭 후 12개월 (고객사 50개, 월 매출 3,500만원)",
    minLength: 100,
    fieldType: "textarea",
    aiPrompt:
      "비즈니스 모델을 【수익 모델】, 【가격 정책】, 【매출 전망】, 【손익분기점】으로 구분하여 작성해주세요.",
    outputKey: "scaleup.subSections[0].content.businessModel",
  },
  {
    id: "esgStrategy",
    section: "성장전략",
    title: "중장기 사회적 가치 도입계획 (ESG)",
    description:
      "환경(E), 사회(S), 지배구조(G) 관점에서 사회적 가치 도입 계획을 작성해주세요.",
    placeholder:
      "예:\n【환경(E)】물류 최적화를 통한 탄소 배출 감소\n【사회(S)】물류 종사자 근무 환경 개선\n【지배구조(G)】투명한 데이터 처리 정책",
    example:
      "【환경(E)】\n- 물류 최적화를 통한 탄소 배출 감소 (연간 1,000톤 CO2 절감 목표)\n- 친환경 배송 경로 우선 추천 기능\n\n【사회(S)】\n- 물류 종사자 근무 환경 개선 (야간 배송 최소화)\n- 지역 물류업체 디지털 역량 강화 지원 (무료 교육)\n\n【지배구조(G)】\n- 투명한 데이터 처리 정책 (개인정보 보호)\n- 윤리적 AI 개발 원칙 준수",
    minLength: 80,
    fieldType: "textarea",
    aiPrompt:
      "ESG 관점의 사회적 가치 도입 계획을 【환경(E)】, 【사회(S)】, 【지배구조(G)】로 구분하여 작성해주세요.",
    outputKey: "scaleup.subSections[0].content.esgStrategy",
  },

  // ============================================================
  // 6. 팀 구성 (Team) - 상세
  // ============================================================
  {
    id: "founderCapability",
    section: "팀 구성",
    title: "대표자 역량",
    description:
      "대표자의 보유 역량(경영 능력, 경력·학력, 기술력, 노하우, 인적 네트워크 등)을 작성해주세요.",
    placeholder:
      "예:\n【학력】서울대학교 컴퓨터공학 박사\n【경력】삼성전자 AI연구소 10년\n【자격증】정보처리기사, AWS 솔루션 아키텍트\n【네트워크】한국AI학회 이사\n【성과】AI 관련 논문 20편, 특허 5건",
    example:
      "【학력】\n서울대학교 컴퓨터공학 박사\n\n【경력】\n삼성전자 AI연구소 10년, 물류 AI 프로젝트 리드 경험\n\n【자격증】\n정보처리기사, AWS 솔루션 아키텍트\n\n【네트워크】\n한국AI학회 이사, 물류IT협회 자문위원\n\n【성과】\nAI 관련 논문 20편, 특허 5건, 정부과제 수행 3건",
    minLength: 80,
    fieldType: "textarea",
    aiPrompt:
      "대표자 역량을 【학력】, 【경력】, 【자격증】, 【네트워크】, 【성과】로 구분하여 작성해주세요.",
    outputKey: "team.subSections[0].content.founderCapability",
  },
  {
    id: "teamMembers",
    section: "팀 구성",
    title: "팀 구성(안)",
    description: "팀 구성원 정보를 작성해주세요.",
    placeholder:
      "예: CTO|기술 총괄 / AI 엔진 개발|컴퓨터공학 박사, AI 연구 경력 8년|완료",
    example:
      "CTO|기술 총괄 / AI 엔진 개발|컴퓨터공학 박사, AI 연구 경력 8년|완료\n개발팀장|백엔드 / 인프라 개발|컴퓨터공학 석사, 백엔드 경력 7년|완료\n개발자|프론트엔드 / 모바일 앱 개발|컴퓨터공학 학사, 프론트엔드 경력 5년|예정(25.02)\n물류전문가|물류 프로세스 설계 / 고객 컨설팅|물류학 석사, 물류업계 경력 15년|완료",
    minLength: 50,
    fieldType: "table",
    tableHeaders: ["직위", "담당업무", "보유역량", "구성상태"],
    aiPrompt:
      "팀 구성원 정보를 작성해주세요. 형식: 직위|담당업무|보유역량|구성상태. 3~5명의 핵심 인력을 포함하세요.",
    outputKey: "team.subSections[0].content.teamMembersTable",
  },
  {
    id: "partners",
    section: "팀 구성",
    title: "협력 기관 현황 및 협업 방안",
    description:
      "협력(또는 예정)인 파트너, 협력 기관(기업) 등의 역량과 주요 협업 내용을 작성해주세요.",
    placeholder: "예: ABC물류|물류 인프라 보유|파일럿 테스트 협력|25.08",
    example:
      "ABC물류|물류 인프라 보유, 연간 100만 건 배송|파일럿 테스트 협력, 피드백 제공|25.08\nXYZ클라우드|국내 1위 클라우드 서비스|클라우드 인프라 할인 지원 (50%)|25.01\n한국물류협회|물류업체 네트워크 1,000개사|잠재 고객사 소개, 세미나 공동 개최|25.03",
    minLength: 50,
    fieldType: "table",
    tableHeaders: ["파트너명", "보유역량", "협업방안", "협력시기"],
    aiPrompt:
      "협력 파트너 정보를 작성해주세요. 형식: 파트너명|보유역량|협업방안|협력시기. 2~4개의 협력 기관을 포함하세요.",
    outputKey: "team.subSections[0].content.partnersTable",
  },
];

// 섹션 목록
export const WIZARD_SECTIONS = [
  "일반현황",
  "아이템 개요",
  "문제 인식",
  "실현 가능성",
  "성장전략",
  "팀 구성",
];

// ============================================================
// 컴포넌트
// ============================================================

export interface WizardData {
  [key: string]: string;
}

interface StepByStepWizardProps {
  onComplete: (data: WizardData) => void;
  initialData?: WizardData;
}

export default function StepByStepWizard({
  onComplete,
  initialData = {},
}: StepByStepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [error, setError] = useState<string | null>(null);

  // AI 힌트 관련 상태
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintPrompt, setHintPrompt] = useState("");
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);

  // authStore에서 AI 힌트 관련 상태 가져오기
  const { aiHintsRemaining, useAiHint, isAuthenticated } = useAuthStore();

  const currentQuestion = WIZARD_STEPS[currentStep];
  const totalSteps = WIZARD_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // 현재 섹션 정보
  const currentSectionIndex = WIZARD_SECTIONS.indexOf(currentQuestion.section);
  const sectionProgress = WIZARD_SECTIONS.map((section) => {
    const sectionSteps = WIZARD_STEPS.filter((s) => s.section === section);
    const completedSteps = sectionSteps.filter(
      (s) => data[s.id] && data[s.id].length >= s.minLength
    ).length;
    return {
      section,
      total: sectionSteps.length,
      completed: completedSteps,
      isComplete: completedSteps === sectionSteps.length,
    };
  });

  // 현재 값
  const currentValue = data[currentQuestion.id] || "";
  const isValid = currentValue.length >= currentQuestion.minLength;

  // 값 변경
  const handleChange = (value: string) => {
    setData((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setError(null);
  };

  // 다음 단계
  const handleNext = () => {
    if (!isValid) {
      setError(`최소 ${currentQuestion.minLength}자 이상 입력해주세요.`);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 이전 단계
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 완료
  const handleComplete = () => {
    if (!isValid) {
      setError(`최소 ${currentQuestion.minLength}자 이상 입력해주세요.`);
      return;
    }
    onComplete(data);
  };

  // 특정 단계로 이동
  const goToStep = (stepIndex: number) => {
    // 이전 단계만 이동 가능
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      setError(null);
    }
  };

  // AI 힌트 모달 열기
  const openHintModal = () => {
    if (!isAuthenticated) {
      setError("AI 힌트를 사용하려면 로그인이 필요합니다.");
      return;
    }
    if (aiHintsRemaining <= 0) {
      setError("AI 힌트 사용 횟수를 모두 소진했습니다. 이용권을 구매해주세요.");
      return;
    }
    setHintPrompt("");
    setHintError(null);
    setShowHintModal(true);
  };

  // AI 힌트 생성
  const generateHint = async () => {
    if (!hintPrompt.trim()) {
      setHintError("간단한 멘트를 입력해주세요.");
      return;
    }

    // AI 힌트 사용 가능 여부 체크 (차감은 성공 후에)
    if (aiHintsRemaining <= 0) {
      setHintError("AI 힌트 사용 횟수를 모두 소진했습니다.");
      return;
    }

    setIsGeneratingHint(true);
    setHintError(null);

    try {
      const response = await fetch("/api/ai/generate-hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: hintPrompt,
          question: currentQuestion.title,
          questionDescription: currentQuestion.description,
          example: currentQuestion.example,
          fieldType: currentQuestion.fieldType,
          tableHeaders: currentQuestion.tableHeaders,
          context: data, // 이전에 입력한 데이터 컨텍스트로 전달
        }),
      });

      if (!response.ok) {
        throw new Error("AI 응답 생성에 실패했습니다.");
      }

      const result = await response.json();

      // 성공 시에만 AI 힌트 사용 횟수 차감
      useAiHint();

      // 생성된 답변을 현재 입력 필드에 설정
      handleChange(result.content);
      setShowHintModal(false);
      setHintPrompt("");
    } catch (err) {
      console.error("AI 힌트 생성 오류:", err);
      setHintError("AI 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      // 실패 시 횟수 차감 안됨
    } finally {
      setIsGeneratingHint(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>
            {currentStep + 1} / {totalSteps} 질문
          </span>
          <span className={styles.progressPercent}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Navigation */}
      <div className={styles.sectionNav}>
        {sectionProgress.map((sp, idx) => (
          <div
            key={sp.section}
            className={`${styles.sectionItem} ${
              idx === currentSectionIndex ? styles.active : ""
            } ${sp.isComplete ? styles.completed : ""}`}
          >
            <div className={styles.sectionDot}>
              {sp.isComplete ? "✓" : idx + 1}
            </div>
            <span className={styles.sectionName}>{sp.section}</span>
            <span className={styles.sectionCount}>
              {sp.completed}/{sp.total}
            </span>
          </div>
        ))}
      </div>

      {/* Question Card */}
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.questionSection}>
            {currentQuestion.section}
          </span>
          <span className={styles.questionNumber}>Q{currentStep + 1}</span>
        </div>

        <h2 className={styles.questionTitle}>{currentQuestion.title}</h2>
        <p className={styles.questionDescription}>
          {currentQuestion.description}
        </p>

        {/* Example Toggle */}
        <details className={styles.exampleToggle}>
          <summary className={styles.exampleSummary}>💡 예시 보기</summary>
          <pre className={styles.exampleContent}>{currentQuestion.example}</pre>
        </details>

        {/* AI 힌트 버튼 */}
        {currentQuestion.aiPrompt && (
          <button
            type="button"
            className={styles.aiHintButton}
            onClick={openHintModal}
            disabled={!isAuthenticated || aiHintsRemaining <= 0}
          >
            <SparklesIcon />
            AI 힌트로 작성하기
            <span className={styles.hintCount}>({aiHintsRemaining}/10)</span>
          </button>
        )}

        {/* Input Field */}
        <div className={styles.inputWrapper}>
          {currentQuestion.fieldType === "text" && (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className={`${styles.textInput} ${
                error ? styles.inputError : ""
              }`}
            />
          )}

          {currentQuestion.fieldType === "textarea" && (
            <textarea
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className={`${styles.textareaInput} ${
                error ? styles.inputError : ""
              }`}
              rows={8}
            />
          )}

          {currentQuestion.fieldType === "list" && (
            <ListInput
              value={currentValue}
              onChange={handleChange}
              placeholder={currentQuestion.placeholder}
              error={!!error}
            />
          )}

          {currentQuestion.fieldType === "table" && (
            <TableInput
              value={currentValue}
              onChange={handleChange}
              headers={currentQuestion.tableHeaders || []}
              placeholder={currentQuestion.placeholder}
              error={!!error}
            />
          )}

          {/* Character Count */}
          <div className={styles.charCount}>
            <span
              className={
                currentValue.length >= currentQuestion.minLength
                  ? styles.valid
                  : styles.invalid
              }
            >
              {currentValue.length}
            </span>
            / {currentQuestion.minLength}자 이상
          </div>
        </div>

        {/* Error Message */}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          className={styles.prevButton}
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <ArrowLeftIcon />
          이전
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={!isValid}
          >
            다음
            <ArrowRightIcon />
          </button>
        ) : (
          <button
            className={styles.completeButton}
            onClick={handleComplete}
            disabled={!isValid}
          >
            <CheckIcon />
            작성 완료
          </button>
        )}
      </div>

      {/* AI 힌트 모달 */}
      {showHintModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowHintModal(false)}
        >
          <div
            className={styles.hintModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.hintModalHeader}>
              <h3 className={styles.hintModalTitle}>
                <SparklesIcon />
                AI 힌트로 작성하기
              </h3>
              <button
                className={styles.hintModalClose}
                onClick={() => setShowHintModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.hintModalBody}>
              <div className={styles.hintQuestionInfo}>
                <span className={styles.hintQuestionLabel}>현재 질문</span>
                <p className={styles.hintQuestionTitle}>
                  {currentQuestion.title}
                </p>
              </div>

              <div className={styles.hintInputWrapper}>
                <label className={styles.hintInputLabel}>
                  간단한 멘트를 입력해주세요
                </label>
                <textarea
                  className={styles.hintInput}
                  value={hintPrompt}
                  onChange={(e) => setHintPrompt(e.target.value)}
                  placeholder={`예: ${
                    currentQuestion.placeholder?.split("\n")[0] ||
                    "내용을 간단히 설명해주세요"
                  }`}
                  rows={4}
                  disabled={isGeneratingHint}
                />
                <p className={styles.hintInputHelp}>
                  입력하신 내용을 바탕으로 AI가 &quot;{currentQuestion.title}
                  &quot;에 맞는 전문적인 답변을 생성합니다.
                </p>
              </div>

              {hintError && <div className={styles.hintError}>{hintError}</div>}
            </div>

            <div className={styles.hintModalFooter}>
              <span className={styles.hintRemaining}>
                남은 힌트: {aiHintsRemaining}회
              </span>
              <div className={styles.hintModalButtons}>
                <button
                  className={styles.hintCancelButton}
                  onClick={() => setShowHintModal(false)}
                  disabled={isGeneratingHint}
                >
                  취소
                </button>
                <button
                  className={styles.hintGenerateButton}
                  onClick={generateHint}
                  disabled={isGeneratingHint || !hintPrompt.trim()}
                >
                  {isGeneratingHint ? (
                    <>
                      <SpinnerIcon />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      AI 답변 생성
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 입력 컴포넌트
// ============================================================

function ListInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error: boolean;
}) {
  // 줄바꿈으로 분리하여 배열로 관리
  const items = value ? value.split("\n") : [""];

  const handleChange = (index: number, val: string) => {
    const newItems = [...items];
    newItems[index] = val;
    onChange(newItems.join("\n"));
  };

  const handleAdd = () => {
    onChange([...items, ""].join("\n"));
  };

  const handleRemove = (index: number) => {
    if (items.length === 1) {
      onChange("");
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems.join("\n"));
  };

  return (
    <div className={styles.listInputWrapper}>
      {items.map((item, index) => (
        <div key={index} className={styles.listInputItem}>
          <textarea
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`${index + 1}. 내용을 입력하세요`}
            className={`${error ? styles.inputError : ""}`}
            rows={2}
          />
          <button
            className={styles.removeButton}
            onClick={() => handleRemove(index)}
            title="삭제"
          >
            ✕
          </button>
        </div>
      ))}
      <button className={styles.addButton} onClick={handleAdd}>
        + 항목 추가하기
      </button>
    </div>
  );
}

function TableInput({
  value,
  onChange,
  headers,
  placeholder,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  headers: string[];
  placeholder: string;
  error: boolean;
}) {
  // 줄바꿈으로 행 분리, | 로 열 분리
  const rows = value
    ? value.split("\n").map((row) => {
        const cells = row.split("|");
        // 헤더 개수만큼 셀 확보
        if (cells.length < headers.length) {
          return [...cells, ...Array(headers.length - cells.length).fill("")];
        }
        return cells.slice(0, headers.length);
      })
    : [Array(headers.length).fill("")];

  const handleChange = (rowIndex: number, colIndex: number, val: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = val; // 파이프(|) 문자는 제거하거나 이스케이프 처리 필요하지만, 여기선 단순화
    onChange(newRows.map((r) => r.join("|")).join("\n"));
  };

  const handleAddRow = () => {
    const newRow = Array(headers.length).fill("");
    onChange([...rows, newRow].map((r) => r.join("|")).join("\n"));
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length === 1) {
      onChange(Array(headers.length).fill("").join("|"));
      return;
    }
    const newRows = rows.filter((_, i) => i !== index);
    onChange(newRows.map((r) => r.join("|")).join("\n"));
  };

  return (
    <div className={styles.tableInputWrapper}>
      <table className={styles.tableInput}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
            <th className={styles.tableActionCell}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleChange(rowIndex, colIndex, e.target.value)
                    }
                    className={`${error ? styles.inputError : ""}`}
                  />
                </td>
              ))}
              <td className={styles.tableActionCell}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveRow(rowIndex)}
                  title="삭제"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addButton} onClick={handleAddRow}>
        + 행 추가하기
      </button>
    </div>
  );
}

// Icons
function SparklesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className={styles.spinner}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
