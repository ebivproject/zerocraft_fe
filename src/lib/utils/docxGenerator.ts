import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Packer,
} from "docx";
import { saveAs } from "file-saver";
import { BusinessPlanOutput } from "@/lib/api/businessPlan";

// 스타일 상수
const COLORS = {
  primary: "4361EE",
  secondary: "5B7CFA",
  text: "333333",
  lightGray: "F5F5F5",
  border: "CCCCCC",
};

const FONT = {
  default: "맑은 고딕",
  size: {
    title: 32,
    heading1: 28,
    heading2: 24,
    heading3: 20,
    body: 22,
    small: 18,
  },
};

// 제목 문단 생성
function createTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: FONT.size.title,
        color: COLORS.primary,
        font: FONT.default,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  });
}

// 대제목 (I, II, III...)
function createHeading1(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: FONT.size.heading1,
        color: COLORS.primary,
        font: FONT.default,
      }),
    ],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
}

// 중제목 (1, 2, 3...)
function createHeading2(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: FONT.size.heading2,
        color: COLORS.secondary,
        font: FONT.default,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

// 소제목
function createHeading3(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: FONT.size.heading3,
        font: FONT.default,
      }),
    ],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
}

// 본문 문단
function createParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: FONT.size.body,
        font: FONT.default,
      }),
    ],
    spacing: { after: 150 },
  });
}

// 글머리 기호 문단
function createBulletPoint(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `• ${text}`,
        size: FONT.size.body,
        font: FONT.default,
      }),
    ],
    indent: { left: 400 },
    spacing: { after: 100 },
  });
}

// 테이블 셀 생성
function createTableCell(
  text: string,
  options: {
    isHeader?: boolean;
    width?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  } = {}
): TableCell {
  const { isHeader = false, width, alignment = AlignmentType.LEFT } = options;

  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader,
            size: isHeader ? FONT.size.body : FONT.size.small,
            font: FONT.default,
            color: isHeader ? "FFFFFF" : COLORS.text,
          }),
        ],
        alignment,
      }),
    ],
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: isHeader ? { fill: COLORS.primary } : undefined,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  });
}

// 테이블 행 생성
function createTableRow(cells: TableCell[]): TableRow {
  return new TableRow({ children: cells });
}

// 테이블 생성
function createTable(
  headers: string[],
  rows: string[][],
  widths?: number[]
): Table {
  const headerCells = headers.map((h, i) =>
    createTableCell(h, {
      isHeader: true,
      width: widths?.[i],
      alignment: AlignmentType.CENTER,
    })
  );

  const dataRows = rows.map((row) =>
    createTableRow(
      row.map((cell, i) => createTableCell(cell, { width: widths?.[i] }))
    )
  );

  return new Table({
    rows: [createTableRow(headerCells), ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: COLORS.border,
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: COLORS.border,
      },
    },
  });
}

// 페이지 구분선
function createPageBreak(): Paragraph {
  return new Paragraph({
    children: [new PageBreak()],
  });
}

// 사업계획서 Word 문서 생성
export function generateBusinessPlanDocument(
  data: BusinessPlanOutput
): Document {
  const sections = data.sections;
  const children: (Paragraph | Table)[] = [];

  // 1. 표지
  children.push(
    new Paragraph({ spacing: { before: 2000 } }),
    createTitle(data.documentTitle),
    new Paragraph({
      children: [
        new TextRun({
          text: sections.generalStatus.data.companyName,
          size: FONT.size.heading2,
          font: FONT.default,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: new Date().toLocaleDateString("ko-KR"),
          size: FONT.size.body,
          font: FONT.default,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    createPageBreak()
  );

  // 2. 일반현황
  children.push(
    createHeading1(sections.generalStatus.title),
    createTable(
      ["항목", "내용"],
      [
        ["과제명", sections.generalStatus.data.itemName],
        ["개발 결과물", sections.generalStatus.data.outputs],
        ["대표자", sections.generalStatus.data.representative],
        ["회사명", sections.generalStatus.data.companyName],
      ],
      [30, 70]
    ),
    new Paragraph({ spacing: { after: 300 } })
  );

  // 3. 아이템 개요
  children.push(
    createHeading1(sections.summary.title),
    createHeading2("1. 제품/서비스 정보"),
    createTable(
      ["항목", "내용"],
      [
        ["제품/서비스명", sections.summary.data.productName],
        ["카테고리", sections.summary.data.category],
      ],
      [30, 70]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    createHeading2("2. 아이템 개요"),
    createHeading3("핵심 기능"),
    createParagraph(sections.summary.data.itemOverview.coreFunctions),
    createHeading3("고객 혜택"),
    createParagraph(sections.summary.data.itemOverview.customerBenefits),
    createHeading2("3. 문제 인식"),
    createParagraph(sections.summary.data.problemRecognition),
    createHeading2("4. 실현 가능성"),
    createParagraph(sections.summary.data.feasibility),
    createHeading2("5. 성장 전략"),
    createParagraph(sections.summary.data.growthStrategy),
    createHeading2("6. 팀 구성"),
    createParagraph(sections.summary.data.teamConfiguration),
    createPageBreak()
  );

  // 4. 문제 인식
  children.push(createHeading1(sections.problem.title));
  sections.problem.subSections.forEach((sub) => {
    children.push(
      createHeading2(sub.subTitle),
      createHeading3("시장 현황"),
      createParagraph(sub.content.marketStatus),
      createHeading3("문제점")
    );
    sub.content.problems.forEach((problem) => {
      children.push(createBulletPoint(problem));
    });
  });
  children.push(createPageBreak());

  // 5. 실현 가능성
  children.push(createHeading1(sections.solution.title));
  sections.solution.subSections.forEach((sub) => {
    children.push(createHeading2(sub.subTitle));

    if (sub.content.developmentGoals) {
      children.push(createHeading3("개발 목표"));
      sub.content.developmentGoals.forEach((goal) => {
        children.push(createBulletPoint(goal));
      });
    }

    if (sub.content.differentiation) {
      children.push(createHeading3("차별화 요소"));
      sub.content.differentiation.split("\n").forEach((line: string) => {
        if (line.trim()) {
          children.push(createParagraph(line));
        }
      });
    }

    if (sub.content.scheduleTable) {
      children.push(
        createTable(
          ["단계", "주요 과업", "기간", "세부 내용"],
          sub.content.scheduleTable.map((row) => [
            row.step,
            row.task,
            row.period,
            row.detail,
          ]),
          [15, 20, 15, 50]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    if (sub.content.budgetPhase1) {
      children.push(
        createHeading3("1차년도 예산"),
        createTable(
          ["항목", "세부 내용", "금액 (원)"],
          [
            ...sub.content.budgetPhase1.items.map((item) => [
              item.category,
              item.detail,
              item.amount,
            ]),
            ["합계", "", sub.content.budgetPhase1.total],
          ],
          [25, 50, 25]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    if (sub.content.budgetPhase2) {
      children.push(
        createHeading3("2차년도 예산"),
        createTable(
          ["항목", "세부 내용", "금액 (원)"],
          [
            ...sub.content.budgetPhase2.items.map((item) => [
              item.category,
              item.detail,
              item.amount,
            ]),
            ["합계", "", sub.content.budgetPhase2.total],
          ],
          [25, 50, 25]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }
  });
  children.push(createPageBreak());

  // 6. 성장 전략
  children.push(createHeading1(sections.scaleup.title));
  sections.scaleup.subSections.forEach((sub) => {
    children.push(createHeading2(sub.subTitle));

    if (sub.content.competitorAnalysis) {
      children.push(createHeading3("경쟁사 분석"));
      sub.content.competitorAnalysis.forEach((item) => {
        children.push(createBulletPoint(item));
      });
    }

    if (sub.content.marketEntryStrategy) {
      children.push(createHeading3("시장 진입 전략"));
      children.push(
        createTable(
          ["항목", "전략"],
          [
            ["타겟 고객", sub.content.marketEntryStrategy.target],
            ["온라인 채널", sub.content.marketEntryStrategy.channel],
            ["오프라인 채널", sub.content.marketEntryStrategy.offline],
            ["초기 목표", sub.content.marketEntryStrategy.initialGoal],
          ],
          [30, 70]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    if (sub.content.businessModel) {
      children.push(createHeading3("비즈니스 모델"));
      children.push(
        createTable(
          ["항목", "내용"],
          [
            ["수익 모델", sub.content.businessModel.revenueSources],
            ["가격 정책", sub.content.businessModel.pricing],
            ["매출 전망", sub.content.businessModel.financialProjection],
            ["손익분기점", sub.content.businessModel.breakEvenPoint],
          ],
          [30, 70]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    if (sub.content.esgStrategy) {
      children.push(createHeading3("ESG 전략"));
      children.push(
        createTable(
          ["구분", "전략"],
          [
            ["환경 (E)", sub.content.esgStrategy.environment],
            ["사회 (S)", sub.content.esgStrategy.social],
            ["지배구조 (G)", sub.content.esgStrategy.governance],
          ],
          [20, 80]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }
  });
  children.push(createPageBreak());

  // 7. 팀 구성
  children.push(createHeading1(sections.team.title));
  sections.team.subSections.forEach((sub) => {
    children.push(createHeading2(sub.subTitle));

    if (sub.content.founderCapability) {
      children.push(createHeading3("창업자 역량"));
      children.push(
        createTable(
          ["항목", "내용"],
          [
            ["학력", sub.content.founderCapability.education],
            ["경력", sub.content.founderCapability.experience],
            ["자격증", sub.content.founderCapability.qualification],
            ["네트워크", sub.content.founderCapability.network],
            ["성과", sub.content.founderCapability.achievements],
          ],
          [25, 75]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    if (sub.content.teamMembersTable) {
      children.push(createHeading3("팀 구성원"));
      children.push(
        createTable(
          ["역할", "담당 업무", "역량", "상태"],
          sub.content.teamMembersTable.map((member) => [
            member.role,
            member.task,
            member.capability,
            member.status,
          ]),
          [20, 30, 30, 20]
        ),
        new Paragraph({ spacing: { after: 200 } })
      );
    }

    if (sub.content.partnersTable) {
      children.push(createHeading3("협력 파트너"));
      children.push(
        createTable(
          ["기관/업체명", "역할", "협력 내용", "협력 시기"],
          sub.content.partnersTable.map((partner) => [
            partner.name,
            partner.role,
            partner.detail,
            partner.timing,
          ]),
          [25, 20, 35, 20]
        )
      );
    }
  });

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

// Word 파일 다운로드
export async function downloadBusinessPlanDocx(
  data: BusinessPlanOutput,
  filename?: string
): Promise<void> {
  const doc = generateBusinessPlanDocument(data);
  const blob = await Packer.toBlob(doc);
  const name =
    filename ||
    `${data.documentTitle}_${new Date().toISOString().split("T")[0]}.docx`;
  saveAs(blob, name);
}
