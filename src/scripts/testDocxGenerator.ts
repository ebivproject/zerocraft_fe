// 테스트용 스크립트 - DOCX 생성 테스트
// 사용법: npx tsx src/scripts/testDocxGenerator.ts

import * as fs from "fs";
import * as path from "path";
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Packer,
  VerticalAlign,
  TableLayoutType,
  Footer,
  PageNumber,
  convertInchesToTwip,
  ShadingType,
} from "docx";

// output.json 샘플 데이터
const sampleData = {
  documentTitle: "AI 기반 스마트 물류 최적화 시스템",
  sections: {
    generalStatus: {
      title: "□ 일반현황",
      data: {
        itemName: "AI 기반 스마트 물류 최적화 시스템",
        outputs:
          "AI 물류 예측 시스템 1식, 모바일 앱(iOS/Android) 1식, 관제 대시보드 1식",
        representative: "연구원 / IT 서비스업",
        companyName: "(주)스마트로지텍",
      },
    },
    summary: {
      title: "□ 창업 아이템 개요(요약)",
      data: {
        productName: "스마트로지 (SmartLogi)",
        category: "물류/AI/SaaS",
        itemOverview: {
          coreFunctions:
            "AI 기반 수요 예측 알고리즘을 통해 물류 배송 시간을 30% 단축하고, 실시간 경로 최적화로 배송 비용을 20% 절감하는 스마트 물류 솔루션입니다. 핵심 기능으로는 1) AI 수요 예측, 2) 실시간 경로 최적화, 3) 통합 관제 대시보드가 있습니다.",
          customerBenefits:
            "중소 물류업체에게 대기업 수준의 물류 최적화 기술을 합리적인 가격(월 50~200만원)에 제공하여, 배송 시간 단축 및 비용 절감 효과를 제공합니다.",
        },
        problemRecognition:
          "국내 물류 시장은 연간 80조원 규모이나, 중소 물류업체의 70%가 수작업 기반 운영으로 인한 비효율 문제를 겪고 있습니다. 특히 배송 시간 예측 불가, 경로 최적화 부재, 실시간 모니터링 어려움 등의 문제가 심각합니다.",
        feasibility:
          "자체 개발 AI 엔진(특허 출원 중)을 통해 95% 이상의 배송 시간 예측 정확도를 달성하였으며, 협약기간 내 시제품 완성 및 파일럿 테스트를 완료할 계획입니다. 핵심 개발 인력 3명이 확보되어 있습니다.",
        growthStrategy:
          "1년차 수도권 중소 물류업체 100개사 확보, 2년차 전국 확대 및 월 매출 5억원 달성, 3년차 동남아 시장 진출을 목표로 합니다. SaaS 구독 모델을 통한 안정적인 수익 구조를 구축합니다.",
        teamConfiguration:
          "AI 전문가 2명(박사급), 물류 경력자 3명(10년+), SW 개발자 5명으로 구성된 10명의 전문 팀입니다. 대표자는 삼성전자 AI연구소 10년 경력의 AI 전문가입니다.",
      },
    },
    problem: {
      title: "1. 문제 인식 (Problem)",
      subSections: [
        {
          subTitle: "1-1. 창업 아이템의 필요성",
          content: {
            marketStatus:
              "국내 물류 시장 규모는 약 80조원이며, 연평균 5% 성장 중입니다. 특히 이커머스 성장과 함께 라스트마일 배송 시장이 급성장하고 있으나, 중소 물류업체의 디지털 전환율은 30%에 불과합니다.",
            problems: [
              "배송 시간 예측 불가: 고객 불만 증가 및 CS 비용 상승 (연간 평균 15% 매출 손실)",
              "수작업 기반 경로 설정: 불필요한 이동거리 발생으로 연료비 20% 낭비",
              "실시간 모니터링 부재: 배송 지연 대응 지연으로 고객 이탈률 증가",
              "데이터 기반 의사결정 어려움: 수요 예측 실패로 인한 재고 관리 비효율",
            ],
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
            developmentGoals: [
              "AI 수요 예측 엔진 개발: 95% 이상의 예측 정확도 달성",
              "실시간 경로 최적화 알고리즘 구현: 배송 시간 30% 단축",
              "통합 관제 대시보드 개발: 실시간 모니터링 및 리포팅 기능",
            ],
            differentiation:
              "자체 개발 AI 엔진을 통한 95% 이상의 배송 시간 예측 정확도로, 기존 솔루션(70~80%) 대비 월등한 성능을 제공합니다. 또한 중소기업 맞춤형 가격 정책(월 50만원~)으로 진입 장벽을 낮췄습니다.",
            scheduleTable: [
              {
                step: "1",
                task: "필수 개발 인력 채용",
                period: "25.01 ~ 25.02",
                detail: "AI 전문가 1명, 백엔드 개발자 2명 채용",
              },
              {
                step: "2",
                task: "핵심 알고리즘 개발",
                period: "25.02 ~ 25.05",
                detail: "AI 수요 예측 엔진 및 경로 최적화 알고리즘 개발",
              },
              {
                step: "3",
                task: "베타 서비스 개발",
                period: "25.05 ~ 25.08",
                detail: "웹/모바일 앱 개발 및 관제 대시보드 구현",
              },
              {
                step: "4",
                task: "파일럿 테스트",
                period: "25.08 ~ 25.10",
                detail: "협력 물류업체 5개사 대상 실증 테스트",
              },
              {
                step: "5",
                task: "시제품 완성",
                period: "25.10 ~ 25.12",
                detail: "피드백 반영 및 정식 버전 출시 준비",
              },
            ],
          },
        },
        {
          subTitle: "2-2. 정부지원사업비 집행 계획",
          content: {
            budgetPhase1: {
              items: [
                {
                  category: "인건비",
                  detail: "개발 인력 3명 × 6개월",
                  amount: "9,000,000",
                },
                {
                  category: "재료비",
                  detail: "서버 장비 및 개발 도구 구입",
                  amount: "3,000,000",
                },
                {
                  category: "외주용역비",
                  detail: "UI/UX 디자인 외주",
                  amount: "5,000,000",
                },
                {
                  category: "지식재산권",
                  detail: "특허 출원 비용",
                  amount: "3,000,000",
                },
              ],
              total: "20,000,000",
            },
            budgetPhase2: {
              items: [
                {
                  category: "인건비",
                  detail: "개발 인력 5명 × 6개월",
                  amount: "20,000,000",
                },
                {
                  category: "재료비",
                  detail: "클라우드 서버 비용",
                  amount: "5,000,000",
                },
                {
                  category: "외주용역비",
                  detail: "보안 점검 및 부하 테스트",
                  amount: "8,000,000",
                },
                {
                  category: "마케팅비",
                  detail: "온라인 광고 및 전시회 참가",
                  amount: "7,000,000",
                },
              ],
              total: "40,000,000",
            },
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
            competitorAnalysis: [
              "경쟁사 A (로지스올): 대기업 위주 서비스, 높은 가격(월 500만원+), 중소기업 접근성 낮음",
              "경쟁사 B (메쉬코리아): 배송 추적 위주, AI 예측 기능 부재, 물류 최적화 한계",
              "당사 차별점: 중소기업 맞춤형 AI 솔루션, 합리적 가격, 높은 예측 정확도",
            ],
            marketEntryStrategy: {
              target: "수도권 소재 중소 물류업체 (연매출 10~100억원 규모)",
              channel:
                "온라인: 검색광고, 물류 전문 커뮤니티, LinkedIn B2B 마케팅",
              offline: "물류 전시회 참가, 물류협회 제휴, 레퍼런스 고객 확보",
              initialGoal: "1년차 100개 고객사 확보, 월 ARR 5,000만원 달성",
            },
            businessModel: {
              revenueSources:
                "SaaS 월 구독료 (Basic: 50만원, Pro: 100만원, Enterprise: 200만원)",
              pricing:
                "배송 건수 기반 종량제 옵션 추가 (건당 100원), 연간 결제 시 20% 할인",
              financialProjection:
                "1년차 6억원, 2년차 20억원, 3년차 50억원 매출 목표",
              breakEvenPoint:
                "서비스 런칭 후 12개월 시점 (고객사 50개, 월 매출 3,500만원)",
            },
            esgStrategy: {
              environment:
                "물류 최적화를 통한 탄소 배출 감소 (연간 1,000톤 CO2 절감 목표)",
              social:
                "물류 종사자 근무 환경 개선, 지역 물류업체 디지털 역량 강화 지원",
              governance: "투명한 데이터 처리 정책, 윤리적 AI 개발 원칙 준수",
            },
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
            founderCapability: {
              education: "서울대학교 컴퓨터공학 박사",
              experience: "삼성전자 AI연구소 10년, 물류 AI 프로젝트 리드 경험",
              qualification: "정보처리기사, AWS 솔루션 아키텍트",
              network: "한국AI학회 이사, 물류IT협회 자문위원",
              achievements: "AI 관련 논문 20편, 특허 5건, 정부과제 수행 3건",
            },
            teamMembersTable: [
              {
                role: "CTO",
                task: "기술 총괄 / AI 엔진 개발",
                capability: "컴퓨터공학 박사, AI 연구 경력 8년",
                status: "완료",
              },
              {
                role: "개발팀장",
                task: "백엔드 / 인프라 개발",
                capability: "컴퓨터공학 석사, 백엔드 경력 7년",
                status: "완료",
              },
              {
                role: "개발자",
                task: "프론트엔드 / 모바일 앱 개발",
                capability: "컴퓨터공학 학사, 프론트엔드 경력 5년",
                status: "예정(25.02)",
              },
              {
                role: "물류전문가",
                task: "물류 프로세스 설계 / 고객 컨설팅",
                capability: "물류학 석사, 물류업계 경력 15년",
                status: "완료",
              },
            ],
            partnersTable: [
              {
                name: "ABC물류",
                role: "파일럿 파트너",
                detail: "시범 서비스 운영 및 피드백 제공",
                timing: "25.08",
              },
              {
                name: "XYZ클라우드",
                role: "인프라 파트너",
                detail: "클라우드 인프라 할인 지원",
                timing: "25.01",
              },
              {
                name: "한국물류협회",
                role: "네트워킹 파트너",
                detail: "잠재 고객사 소개 및 세미나 공동 개최",
                timing: "25.03",
              },
            ],
          },
        },
      ],
    },
  },
};

async function main() {
  console.log("DOCX 생성 테스트 시작...");

  // 동적 import로 docxGeneratorV2 로드
  const { generateBusinessPlanDocumentV2 } = await import(
    "../lib/utils/docxGeneratorV2"
  );

  const doc = generateBusinessPlanDocumentV2(sampleData as any);
  const buffer = await Packer.toBuffer(doc);

  const outputPath = path.join(__dirname, "../../public/test_output.docx");
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ DOCX 파일 생성 완료: ${outputPath}`);
  console.log("파일을 열어서 result_frame.pdf와 비교해보세요!");
}

main().catch(console.error);
