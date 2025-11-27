// Project 타입은 business-plans API와 호환됩니다.
export interface Project {
  id: string;
  title: string;
  content?: unknown; // 상세 조회 시에만 포함
  grantId?: string;
  grantTitle?: string;
  userId?: string; // 상세 조회 시에만 포함
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProjectRequest {
  title: string;
  content?: {
    sections: Array<{ id: string; title: string; content: string }>;
  };
  grantId?: string;
}
