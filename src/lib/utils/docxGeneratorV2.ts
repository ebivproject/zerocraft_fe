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
  HeightRule,
  TableLayoutType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  ShadingType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import { BusinessPlanOutput } from "@/lib/api/businessPlan";
import { ChartImages, generateAllChartImages } from "./chartGenerator";

// ============================================================
// 예비창업패키지 예비창업자 사업계획서 양식 DOCX 생성기
// result_frame.pdf 양식 기준
// ============================================================

// 스타일 상수 (양식에 맞춤)
const COLORS = {
  primary: "000000", // 검정
  headerBg: "D9E2F3", // 연한 파란색 (헤더 배경)
  tableBorder: "000000", // 테이블 테두리
  blue: "0000FF", // 안내문구 파란색
  lightGray: "F2F2F2", // 연한 회색
};

const FONT = {
  default: "맑은 고딕",
  size: {
    title: 28, // 14pt
    heading1: 24, // 12pt
    heading2: 22, // 11pt
    body: 20, // 10pt
    small: 18, // 9pt
    pageNumber: 20, // 페이지 번호
  },
};

// 테두리 스타일
const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.tableBorder },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.tableBorder },
  left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.tableBorder },
  right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.tableBorder },
  insideHorizontal: {
    style: BorderStyle.SINGLE,
    size: 4,
    color: COLORS.tableBorder,
  },
  insideVertical: {
    style: BorderStyle.SINGLE,
    size: 4,
    color: COLORS.tableBorder,
  },
};

// ============================================================
// 헬퍼 함수들
// ============================================================

// 일반 텍스트 문단
function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    size?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spacing?: { before?: number; after?: number };
    indent?: { left?: number; hanging?: number; firstLine?: number };
  } = {}
): Paragraph {
  const {
    bold = false,
    size = FONT.size.body,
    alignment = AlignmentType.LEFT,
    spacing,
    indent,
  } = options;

  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size,
        font: FONT.default,
      }),
    ],
    alignment,
    spacing: spacing || { after: 100 },
    indent,
  });
}

// 섹션 제목 (예: "□ 일반현황")
function createSectionTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: FONT.size.heading1,
        font: FONT.default,
      }),
    ],
    spacing: { before: 300, after: 200 },
  });
}

// 서브섹션 제목 (예: "1. 문제 인식 (Problem)_창업 아이템의 필요성")
function createSubSectionTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: FONT.size.heading2,
        font: FONT.default,
      }),
    ],
    shading: {
      type: ShadingType.CLEAR,
      fill: COLORS.headerBg,
    },
    spacing: { before: 300, after: 200 },
  });
}

// 불릿 포인트 (ㅇ로 시작)
function createBulletPoint(text: string, level: number = 0): Paragraph {
  const prefix = level === 0 ? "ㅇ " : "- ";
  return new Paragraph({
    children: [
      new TextRun({
        text: `${prefix}${text}`,
        size: FONT.size.body,
        font: FONT.default,
      }),
    ],
    indent: { left: 200 + level * 200 },
    spacing: { after: 100 },
  });
}

// 테이블 셀 생성
function createTableCell(
  content: string | Paragraph[],
  options: {
    isHeader?: boolean;
    width?: number;
    widthType?: (typeof WidthType)[keyof typeof WidthType];
    rowSpan?: number;
    columnSpan?: number;
    shading?: string;
    verticalAlign?:
      | typeof VerticalAlign.CENTER
      | typeof VerticalAlign.TOP
      | typeof VerticalAlign.BOTTOM;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  } = {}
): TableCell {
  const {
    isHeader = false,
    width,
    widthType = WidthType.PERCENTAGE,
    rowSpan,
    columnSpan,
    shading,
    verticalAlign = VerticalAlign.CENTER,
    alignment = AlignmentType.CENTER,
  } = options;

  const children =
    typeof content === "string"
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                bold: isHeader,
                size: FONT.size.body,
                font: FONT.default,
              }),
            ],
            alignment,
          }),
        ]
      : content;

  return new TableCell({
    children,
    width: width ? { size: width, type: widthType } : undefined,
    rowSpan,
    columnSpan,
    shading: shading
      ? { fill: shading, type: ShadingType.CLEAR }
      : isHeader
      ? { fill: COLORS.headerBg, type: ShadingType.CLEAR }
      : undefined,
    verticalAlign,
    margins: { top: 50, bottom: 50, left: 100, right: 100 },
  });
}

// 일반 테이블 생성
function createSimpleTable(
  headers: string[],
  rows: string[][],
  widths?: number[]
): Table {
  const headerCells = headers.map((h, i) =>
    createTableCell(h, {
      isHeader: true,
      width: widths?.[i],
    })
  );

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map((cell, i) =>
          createTableCell(cell, {
            width: widths?.[i],
            alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
          })
        ),
      })
  );

  return new Table({
    rows: [
      new TableRow({ children: headerCells, tableHeader: true }),
      ...dataRows,
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    layout: TableLayoutType.FIXED,
  });
}

// 페이지 번호 footer 생성
function createPageNumberFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            children: ["-", PageNumber.CURRENT, "-"],
            size: FONT.size.pageNumber,
            font: FONT.default,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
  });
}

// 페이지 구분
function createPageBreakParagraph(): Paragraph {
  return new Paragraph({
    children: [new PageBreak()],
  });
}

// ============================================================
// 차트 이미지 삽입 함수들
// ============================================================

// 차트 이미지를 Paragraph로 감싸서 반환
function createChartImageParagraph(
  imageBuffer: ArrayBuffer,
  title: string
): Paragraph[] {
  const elements: Paragraph[] = [];

  // 차트 제목
  elements.push(
    createParagraph(`< ${title} >`, {
      bold: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
    })
  );

  // 이미지 삽입
  elements.push(
    new Paragraph({
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 500,
            height: 290,
          },
          type: "png",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  return elements;
}

// ============================================================
// 메인 문서 생성 함수
// ============================================================

export function generateBusinessPlanDocumentV2(
  data: BusinessPlanOutput,
  chartImages?: ChartImages
): Document {
  const sections = data.sections;
  const children: (Paragraph | Table)[] = [];

  // ============================================================
  // 페이지 2: 일반현황
  // ============================================================
  children.push(createSectionTitle("□ 일반현황"));

  // 일반현황 메인 테이블
  const generalStatusTable = new Table({
    rows: [
      // 첫 번째 행: 헤더
      new TableRow({
        children: [
          createTableCell("예비창업패키지 예비창업자 사업계획서", {
            columnSpan: 4,
            isHeader: true,
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
      // 창업아이템명
      new TableRow({
        children: [
          createTableCell("창업아이템명", { isHeader: true, width: 20 }),
          createTableCell(sections.generalStatus.data.itemName, {
            columnSpan: 3,
            width: 80,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
      // 산출물
      new TableRow({
        children: [
          createTableCell("산출물\n(협약기간 내 목표)", {
            isHeader: true,
            width: 20,
          }),
          createTableCell(sections.generalStatus.data.outputs, {
            columnSpan: 3,
            width: 80,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
      // 직업/기업명
      new TableRow({
        children: [
          createTableCell("직업\n(직장명 기재 불가)", {
            isHeader: true,
            width: 20,
          }),
          createTableCell(sections.generalStatus.data.representative, {
            width: 30,
            alignment: AlignmentType.LEFT,
          }),
          createTableCell("기업(예정)명", { isHeader: true, width: 20 }),
          createTableCell(sections.generalStatus.data.companyName, {
            width: 30,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    layout: TableLayoutType.FIXED,
  });

  children.push(generalStatusTable);
  children.push(createParagraph("", { spacing: { after: 200 } }));

  // 팀 구성 현황 테이블
  children.push(
    createParagraph("팀 구성 현황 (대표자 본인 제외)", {
      bold: true,
      spacing: { before: 200, after: 100 },
    })
  );

  // 팀 구성 테이블
  if (sections.team.subSections[0]?.content.teamMembersTable) {
    const teamTable = createSimpleTable(
      ["순번", "직위", "담당 업무", "보유 역량 (경력 및 학력 등)", "구성 상태"],
      sections.team.subSections[0].content.teamMembersTable.map(
        (member, idx) => [
          String(idx + 1),
          member.role,
          member.task,
          member.capability,
          member.status,
        ]
      ),
      [10, 15, 20, 40, 15]
    );
    children.push(teamTable);
  }

  // 안내사항
  children.push(createParagraph("", { spacing: { after: 100 } }));
  children.push(
    createParagraph(
      "※ 사업계획서는 목차(1페이지)를 제외하고 15페이지 이내로 작성(증빙서류는 제한 없음)",
      { size: FONT.size.small }
    )
  );
  children.push(
    createParagraph(
      "※ 사업계획서 양식은 변경·삭제할 수 없으며, 추가설명을 위한 이미지(사진), 표 등은 삽입 가능",
      { size: FONT.size.small }
    )
  );

  children.push(createPageBreakParagraph());

  // ============================================================
  // 페이지 3: 창업 아이템 개요(요약)
  // ============================================================
  children.push(createSectionTitle("□ 창업 아이템 개요(요약)"));

  // 아이템 개요 테이블
  const summaryTable = new Table({
    rows: [
      // 명칭
      new TableRow({
        children: [
          createTableCell("명     칭", { isHeader: true, width: 15 }),
          createTableCell(sections.summary.data.productName, {
            width: 35,
            alignment: AlignmentType.LEFT,
          }),
          createTableCell("범     주", { isHeader: true, width: 15 }),
          createTableCell(sections.summary.data.category, {
            width: 35,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
      // 아이템 개요
      new TableRow({
        children: [
          createTableCell("아이템 개요", { isHeader: true, width: 15 }),
          createTableCell(
            `${sections.summary.data.itemOverview.coreFunctions}\n\n${sections.summary.data.itemOverview.customerBenefits}`,
            { columnSpan: 3, width: 85, alignment: AlignmentType.LEFT }
          ),
        ],
      }),
      // 문제 인식
      new TableRow({
        children: [
          createTableCell("문제 인식\n(Problem)", {
            isHeader: true,
            width: 15,
          }),
          createTableCell(sections.summary.data.problemRecognition, {
            columnSpan: 3,
            width: 85,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
      // 실현 가능성
      new TableRow({
        children: [
          createTableCell("실현 가능성\n(Solution)", {
            isHeader: true,
            width: 15,
          }),
          createTableCell(sections.summary.data.feasibility, {
            columnSpan: 3,
            width: 85,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
      // 성장전략
      new TableRow({
        children: [
          createTableCell("성장전략\n(Scale-up)", {
            isHeader: true,
            width: 15,
          }),
          createTableCell(sections.summary.data.growthStrategy, {
            columnSpan: 3,
            width: 85,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
      // 팀 구성
      new TableRow({
        children: [
          createTableCell("팀 구성\n(Team)", { isHeader: true, width: 15 }),
          createTableCell(sections.summary.data.teamConfiguration, {
            columnSpan: 3,
            width: 85,
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    layout: TableLayoutType.FIXED,
  });

  children.push(summaryTable);
  children.push(createPageBreakParagraph());

  // ============================================================
  // 페이지 4: 1. 문제 인식 (Problem)
  // ============================================================
  children.push(
    createSubSectionTitle("1. 문제 인식 (Problem)_창업 아이템의 필요성")
  );
  children.push(createParagraph("", { spacing: { after: 200 } }));

  // 문제 인식 섹션 내용
  if (sections.problem.subSections[0]) {
    const problemContent = sections.problem.subSections[0].content;

    // 시장 현황
    children.push(createBulletPoint(problemContent.marketStatus));
    children.push(createParagraph("", { spacing: { after: 100 } }));

    // 문제점들
    problemContent.problems.forEach((problem) => {
      children.push(createBulletPoint(problem, 1));
    });
  }

  children.push(createPageBreakParagraph());

  // ============================================================
  // 페이지 5-6: 2. 실현 가능성 (Solution)
  // ============================================================
  children.push(
    createSubSectionTitle("2. 실현 가능성 (Solution)_창업 아이템의 개발 계획")
  );
  children.push(createParagraph("", { spacing: { after: 200 } }));

  // Solution 섹션 내용
  sections.solution.subSections.forEach((sub) => {
    // 개발 목표
    if (sub.content.developmentGoals) {
      sub.content.developmentGoals.forEach((goal) => {
        children.push(createBulletPoint(goal));
      });
      children.push(createParagraph("", { spacing: { after: 100 } }));
    }

    // 차별화 요소
    if (sub.content.differentiation) {
      children.push(createBulletPoint(sub.content.differentiation));
      children.push(createParagraph("", { spacing: { after: 200 } }));
    }

    // 사업추진 일정 테이블
    if (sub.content.scheduleTable && sub.content.scheduleTable.length > 0) {
      children.push(
        createParagraph("< 사업추진 일정(협약기간 내) >", {
          bold: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        })
      );

      const scheduleTable = createSimpleTable(
        ["구분", "추진 내용", "추진 기간", "세부 내용"],
        sub.content.scheduleTable.map((row, idx) => [
          row.step || String(idx + 1),
          row.task,
          row.period,
          row.detail,
        ]),
        [10, 25, 20, 45]
      );
      children.push(scheduleTable);
      children.push(createParagraph("", { spacing: { after: 200 } }));
    }

    // 로드맵 차트 (간트 차트) - 이미지로 삽입
    if (chartImages?.roadmapChart && sub.content.roadmapChart) {
      const roadmapElements = createChartImageParagraph(
        chartImages.roadmapChart,
        sub.content.roadmapChart.title
      );
      roadmapElements.forEach((el) => children.push(el));
    }

    // 1단계 예산
    if (sub.content.budgetPhase1) {
      children.push(
        createParagraph("< 1 단계 정부지원사업비 집행계획 >", {
          bold: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        })
      );

      const budget1Rows = sub.content.budgetPhase1.items.map((item) => [
        item.category,
        item.detail,
        item.amount,
      ]);
      budget1Rows.push(["합 계", "", sub.content.budgetPhase1.total]);

      const budget1Table = createSimpleTable(
        ["비 목", "산출 근거", "정부지원사업비(원)"],
        budget1Rows,
        [20, 55, 25]
      );
      children.push(budget1Table);
      children.push(createParagraph("", { spacing: { after: 200 } }));
    }

    // 2단계 예산
    if (sub.content.budgetPhase2) {
      children.push(
        createParagraph("< 2 단계 정부지원사업비 집행계획 >", {
          bold: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        })
      );

      const budget2Rows = sub.content.budgetPhase2.items.map((item) => [
        item.category,
        item.detail,
        item.amount,
      ]);
      budget2Rows.push(["합 계", "", sub.content.budgetPhase2.total]);

      const budget2Table = createSimpleTable(
        ["비 목", "산출 근거", "정부지원사업비(원)"],
        budget2Rows,
        [20, 55, 25]
      );
      children.push(budget2Table);
      children.push(createParagraph("", { spacing: { after: 200 } }));
    }

    // 예산 배분 차트 - 이미지로 삽입
    if (chartImages?.budgetChart && sub.content.budgetChart) {
      const budgetChartElements = createChartImageParagraph(
        chartImages.budgetChart,
        sub.content.budgetChart.title
      );
      budgetChartElements.forEach((el) => children.push(el));
    }
  });

  children.push(createParagraph("", { spacing: { after: 100 } }));
  children.push(
    createParagraph("※ 1단계 정부지원사업비는 20백만원 내외로 작성", {
      size: FONT.size.small,
    })
  );
  children.push(
    createParagraph("※ 2단계 정부지원사업비는 40백만원 내외로 작성", {
      size: FONT.size.small,
    })
  );

  children.push(createPageBreakParagraph());

  // ============================================================
  // 페이지 7: 3. 성장전략 (Scale-up)
  // ============================================================
  children.push(
    createSubSectionTitle("3. 성장전략 (Scale-up)_사업화 추진 전략")
  );
  children.push(createParagraph("", { spacing: { after: 200 } }));

  // Scale-up 섹션 내용
  sections.scaleup.subSections.forEach((sub) => {
    // 경쟁사 분석
    if (sub.content.competitorAnalysis) {
      children.push(createBulletPoint("경쟁사 분석"));
      sub.content.competitorAnalysis.forEach((item) => {
        children.push(createBulletPoint(item, 1));
      });
      children.push(createParagraph("", { spacing: { after: 100 } }));
    }

    // 경쟁사 비교 차트 - 이미지로 삽입
    if (chartImages?.competitorChart && sub.content.competitorChart) {
      const competitorChartElements = createChartImageParagraph(
        chartImages.competitorChart,
        sub.content.competitorChart.title
      );
      competitorChartElements.forEach((el) => children.push(el));
    }

    // 시장 진입 전략
    if (sub.content.marketEntryStrategy) {
      children.push(createBulletPoint("시장 진입 전략"));
      children.push(
        createBulletPoint(
          `타겟 고객: ${sub.content.marketEntryStrategy.target}`,
          1
        )
      );
      children.push(
        createBulletPoint(
          `온라인 채널: ${sub.content.marketEntryStrategy.channel}`,
          1
        )
      );
      children.push(
        createBulletPoint(
          `오프라인 채널: ${sub.content.marketEntryStrategy.offline}`,
          1
        )
      );
      children.push(
        createBulletPoint(
          `초기 목표: ${sub.content.marketEntryStrategy.initialGoal}`,
          1
        )
      );
      children.push(createParagraph("", { spacing: { after: 100 } }));
    }

    // 비즈니스 모델
    if (sub.content.businessModel) {
      children.push(createBulletPoint("비즈니스 모델"));
      children.push(
        createBulletPoint(
          `수익 모델: ${sub.content.businessModel.revenueSources}`,
          1
        )
      );
      children.push(
        createBulletPoint(`가격 정책: ${sub.content.businessModel.pricing}`, 1)
      );
      children.push(
        createBulletPoint(
          `매출 전망: ${sub.content.businessModel.financialProjection}`,
          1
        )
      );
      children.push(
        createBulletPoint(
          `손익분기점: ${sub.content.businessModel.breakEvenPoint}`,
          1
        )
      );
      children.push(createParagraph("", { spacing: { after: 100 } }));
    }

    // 매출 전망 차트 - 이미지로 삽입
    if (chartImages?.revenueChart && sub.content.revenueChart) {
      const revenueChartElements = createChartImageParagraph(
        chartImages.revenueChart,
        sub.content.revenueChart.title
      );
      revenueChartElements.forEach((el) => children.push(el));
    }

    // ESG 전략
    if (sub.content.esgStrategy) {
      children.push(createBulletPoint("중장기 사회적 가치 도입계획 (ESG)"));
      children.push(
        createBulletPoint(`환경(E): ${sub.content.esgStrategy.environment}`, 1)
      );
      children.push(
        createBulletPoint(`사회(S): ${sub.content.esgStrategy.social}`, 1)
      );
      children.push(
        createBulletPoint(
          `지배구조(G): ${sub.content.esgStrategy.governance}`,
          1
        )
      );
    }
  });

  children.push(createPageBreakParagraph());

  // ============================================================
  // 페이지 8: 4. 팀 구성 (Team)
  // ============================================================
  children.push(
    createSubSectionTitle("4. 팀 구성 (Team)_대표자 및 팀원 구성 계획")
  );
  children.push(createParagraph("", { spacing: { after: 200 } }));

  // Team 섹션 내용
  sections.team.subSections.forEach((sub) => {
    // 창업자 역량
    if (sub.content.founderCapability) {
      children.push(createBulletPoint("대표자 역량"));
      children.push(
        createBulletPoint(`학력: ${sub.content.founderCapability.education}`, 1)
      );
      children.push(
        createBulletPoint(
          `경력: ${sub.content.founderCapability.experience}`,
          1
        )
      );
      if (sub.content.founderCapability.qualification) {
        children.push(
          createBulletPoint(
            `자격증: ${sub.content.founderCapability.qualification}`,
            1
          )
        );
      }
      if (sub.content.founderCapability.network) {
        children.push(
          createBulletPoint(
            `네트워크: ${sub.content.founderCapability.network}`,
            1
          )
        );
      }
      if (sub.content.founderCapability.achievements) {
        children.push(
          createBulletPoint(
            `성과: ${sub.content.founderCapability.achievements}`,
            1
          )
        );
      }
      children.push(createParagraph("", { spacing: { after: 200 } }));
    }

    // 팀 구성 테이블
    if (
      sub.content.teamMembersTable &&
      sub.content.teamMembersTable.length > 0
    ) {
      children.push(
        createParagraph("< 팀 구성(안) >", {
          bold: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        })
      );

      const teamTable = createSimpleTable(
        [
          "구분",
          "직위",
          "담당 업무",
          "보유 역량(경력 및 학력 등)",
          "구성 상태",
        ],
        sub.content.teamMembersTable.map((member, idx) => [
          String(idx + 1),
          member.role,
          member.task,
          member.capability,
          member.status,
        ]),
        [8, 12, 20, 45, 15]
      );
      children.push(teamTable);
      children.push(createParagraph("", { spacing: { after: 200 } }));
    }

    // 협력 파트너 테이블
    if (sub.content.partnersTable && sub.content.partnersTable.length > 0) {
      children.push(
        createParagraph("< 협력 기관 현황 및 협업 방안 >", {
          bold: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        })
      );

      const partnersTable = createSimpleTable(
        ["구분", "파트너명", "보유 역량", "협업 방안", "협력 시기"],
        sub.content.partnersTable.map((partner, idx) => [
          String(idx + 1),
          partner.name,
          partner.role,
          partner.detail,
          partner.timing,
        ]),
        [8, 15, 27, 35, 15]
      );
      children.push(partnersTable);
    }
  });

  // ============================================================
  // Document 생성
  // ============================================================
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
            size: {
              width: convertInchesToTwip(8.27), // A4
              height: convertInchesToTwip(11.69),
            },
          },
        },
        footers: {
          default: createPageNumberFooter(),
        },
        children,
      },
    ],
  });
}

// 차트 데이터 추출 헬퍼
function extractChartData(data: BusinessPlanOutput) {
  const solution = data.sections.solution;
  const scaleup = data.sections.scaleup;

  return {
    roadmapChart: solution?.subSections?.[0]?.content?.roadmapChart || null,
    budgetChart: solution?.subSections?.[1]?.content?.budgetChart || null,
    competitorChart:
      scaleup?.subSections?.[0]?.content?.competitorChart || null,
    revenueChart: scaleup?.subSections?.[0]?.content?.revenueChart || null,
  };
}

// Word 파일 다운로드
export async function downloadBusinessPlanDocxV2(
  data: BusinessPlanOutput,
  filename?: string
): Promise<void> {
  // 차트 이미지 생성
  const chartData = extractChartData(data);
  const chartImages = await generateAllChartImages(chartData);

  const doc = generateBusinessPlanDocumentV2(data, chartImages);
  const blob = await Packer.toBlob(doc);

  // 파일명 생성 (확장자 포함)
  let name: string;
  if (filename) {
    // 확장자가 없으면 추가
    name = filename.endsWith(".docx") ? filename : `${filename}.docx`;
  } else {
    name = `사업계획서_${data.sections.generalStatus.data.itemName}_${
      new Date().toISOString().split("T")[0]
    }.docx`;
  }

  saveAs(blob, name);
}

// Blob으로 반환 (API에서 사용 가능)
export async function generateBusinessPlanBlobV2(
  data: BusinessPlanOutput
): Promise<Blob> {
  // 차트 이미지 생성
  const chartData = extractChartData(data);
  const chartImages = await generateAllChartImages(chartData);

  const doc = generateBusinessPlanDocumentV2(data, chartImages);
  return await Packer.toBlob(doc);
}
