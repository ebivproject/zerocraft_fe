export interface Project {
  id: string;
  title: string;
  content: string;
  grantId?: string;
  userId: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProjectRequest {
  title: string;
  content?: string;
  grantId?: string;
}
