/**
 * QuickChart API를 사용한 차트 이미지 생성기
 * https://quickchart.io/
 */

import {
  RoadmapChartData,
  BudgetChartData,
  CompetitorChartData,
  RevenueChartData,
} from "@/lib/api/businessPlan";

const QUICKCHART_BASE_URL = "https://quickchart.io/chart";

// 차트 색상 팔레트
const CHART_COLORS = {
  blue: "#4472C4",
  green: "#70AD47",
  orange: "#ED7D31",
  purple: "#7030A0",
  red: "#C00000",
  yellow: "#FFC000",
  gray: "#7F7F7F",
  cyan: "#00B0F0",
};

const COLOR_PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.orange,
  CHART_COLORS.purple,
  CHART_COLORS.cyan,
  CHART_COLORS.yellow,
];

/**
 * QuickChart URL 생성 후 이미지 버퍼로 변환
 */
async function fetchChartImage(chartConfig: object): Promise<ArrayBuffer> {
  const configString = JSON.stringify(chartConfig);
  const url = `${QUICKCHART_BASE_URL}?c=${encodeURIComponent(configString)}&w=600&h=350&bkg=white&f=png`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`차트 이미지 생성 실패: ${response.status}`);
  }

  return await response.arrayBuffer();
}

/**
 * 로드맵 간트 차트 이미지 생성
 */
export async function generateRoadmapChartImage(
  data: RoadmapChartData
): Promise<ArrayBuffer> {
  // 간트 차트를 Horizontal Bar로 구현
  const labels = data.phases.map((p) => p.name);
  const startData = data.phases.map((p) => p.startMonth - 1); // 시작점 (빈 공간)
  const durationData = data.phases.map((p) => p.endMonth - p.startMonth + 1); // 기간

  const chartConfig = {
    type: "horizontalBar",
    data: {
      labels,
      datasets: [
        {
          label: "시작",
          data: startData,
          backgroundColor: "rgba(0,0,0,0)", // 투명
          borderWidth: 0,
        },
        {
          label: "기간",
          data: durationData,
          backgroundColor: data.phases.map(
            (p) => CHART_COLORS[p.color as keyof typeof CHART_COLORS] || CHART_COLORS.blue
          ),
          borderWidth: 0,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: data.title,
        fontSize: 16,
        fontStyle: "bold",
      },
      legend: { display: false },
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              min: 0,
              max: data.totalMonths,
              stepSize: 1,
              callback: (value: number) => `${value + 1}월`,
            },
            gridLines: { display: true },
          },
        ],
        yAxes: [
          {
            stacked: true,
            gridLines: { display: false },
          },
        ],
      },
      plugins: {
        datalabels: { display: false },
      },
    },
  };

  return await fetchChartImage(chartConfig);
}

/**
 * 예산 배분 차트 이미지 생성 (도넛 차트)
 */
export async function generateBudgetChartImage(
  data: BudgetChartData
): Promise<ArrayBuffer> {
  // 1단계와 2단계 데이터 합치기
  const allItems = [
    ...data.phase1.map((item) => ({ ...item, phase: "1단계" })),
    ...data.phase2.map((item) => ({ ...item, phase: "2단계" })),
  ];

  const labels = allItems.map((item) => `${item.phase} ${item.category}`);
  const amounts = allItems.map((item) => item.amount / 10000); // 만원 단위

  const chartConfig = {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: amounts,
          backgroundColor: COLOR_PALETTE.slice(0, allItems.length),
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: data.title,
        fontSize: 16,
        fontStyle: "bold",
      },
      legend: {
        position: "right",
        labels: { fontSize: 11 },
      },
      plugins: {
        datalabels: {
          display: true,
          formatter: (value: number) => `${value.toLocaleString()}만원`,
          color: "#fff",
          font: { weight: "bold", size: 10 },
        },
      },
    },
  };

  return await fetchChartImage(chartConfig);
}

/**
 * 경쟁사 비교 레이더 차트 이미지 생성
 */
export async function generateCompetitorChartImage(
  data: CompetitorChartData
): Promise<ArrayBuffer> {
  const datasets = data.competitors.map((comp, idx) => ({
    label: comp.name,
    data: comp.scores,
    backgroundColor:
      comp.name === "자사"
        ? "rgba(68, 114, 196, 0.3)"
        : `rgba(${idx * 60}, ${idx * 40}, ${idx * 80}, 0.2)`,
    borderColor:
      comp.name === "자사" ? CHART_COLORS.blue : COLOR_PALETTE[idx % COLOR_PALETTE.length],
    borderWidth: comp.name === "자사" ? 3 : 2,
    pointBackgroundColor:
      comp.name === "자사" ? CHART_COLORS.blue : COLOR_PALETTE[idx % COLOR_PALETTE.length],
  }));

  const chartConfig = {
    type: "radar",
    data: {
      labels: data.categories,
      datasets,
    },
    options: {
      title: {
        display: true,
        text: data.title,
        fontSize: 16,
        fontStyle: "bold",
      },
      legend: {
        position: "bottom",
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100,
          stepSize: 20,
        },
      },
      plugins: {
        datalabels: { display: false },
      },
    },
  };

  return await fetchChartImage(chartConfig);
}

/**
 * 매출 전망 차트 이미지 생성 (막대 + 라인 복합 차트)
 */
export async function generateRevenueChartImage(
  data: RevenueChartData
): Promise<ArrayBuffer> {
  const labels = data.data.map((d) => d.period);
  const revenues = data.data.map((d) => d.revenue);
  const costs = data.data.map((d) => d.cost);
  const profits = data.data.map((d) => d.profit);

  const chartConfig = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "bar",
          label: "매출",
          data: revenues,
          backgroundColor: CHART_COLORS.blue,
          order: 2,
        },
        {
          type: "bar",
          label: "비용",
          data: costs,
          backgroundColor: CHART_COLORS.orange,
          order: 2,
        },
        {
          type: "line",
          label: "순이익",
          data: profits,
          borderColor: CHART_COLORS.green,
          backgroundColor: "rgba(112, 173, 71, 0.2)",
          fill: true,
          borderWidth: 3,
          pointRadius: 5,
          order: 1,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: `${data.title} (단위: ${data.unit})`,
        fontSize: 16,
        fontStyle: "bold",
      },
      legend: {
        position: "bottom",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (value: number) => value.toLocaleString(),
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          formatter: (value: number) => value.toLocaleString(),
          font: { size: 10 },
        },
      },
    },
  };

  return await fetchChartImage(chartConfig);
}

/**
 * 모든 차트 이미지를 미리 생성
 */
export interface ChartImages {
  roadmapChart?: ArrayBuffer;
  budgetChart?: ArrayBuffer;
  competitorChart?: ArrayBuffer;
  revenueChart?: ArrayBuffer;
}

export async function generateAllChartImages(data: {
  roadmapChart?: RoadmapChartData | null;
  budgetChart?: BudgetChartData | null;
  competitorChart?: CompetitorChartData | null;
  revenueChart?: RevenueChartData | null;
}): Promise<ChartImages> {
  const images: ChartImages = {};

  const promises: Promise<void>[] = [];

  if (data.roadmapChart) {
    promises.push(
      generateRoadmapChartImage(data.roadmapChart).then((img) => {
        images.roadmapChart = img;
      }).catch((e) => console.error("로드맵 차트 생성 실패:", e))
    );
  }

  if (data.budgetChart) {
    promises.push(
      generateBudgetChartImage(data.budgetChart).then((img) => {
        images.budgetChart = img;
      }).catch((e) => console.error("예산 차트 생성 실패:", e))
    );
  }

  if (data.competitorChart) {
    promises.push(
      generateCompetitorChartImage(data.competitorChart).then((img) => {
        images.competitorChart = img;
      }).catch((e) => console.error("경쟁사 차트 생성 실패:", e))
    );
  }

  if (data.revenueChart) {
    promises.push(
      generateRevenueChartImage(data.revenueChart).then((img) => {
        images.revenueChart = img;
      }).catch((e) => console.error("매출 차트 생성 실패:", e))
    );
  }

  await Promise.all(promises);

  return images;
}
