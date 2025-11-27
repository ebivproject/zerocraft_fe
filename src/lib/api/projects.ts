import { Project, ProjectsResponse } from "@/types/project";
import { businessPlanApi, BusinessPlanListResponse } from "./businessPlan";

// projects API는 business-plans API로 대체되었습니다.
// 호환성을 위해 businessPlanApi를 래핑합니다.

export const projectsApi = {
  getProjects: async (): Promise<ProjectsResponse> => {
    const response: BusinessPlanListResponse = await businessPlanApi.getList();
    // BusinessPlan을 Project 형식으로 변환
    return {
      data: response.data.map((plan) => ({
        id: plan.id,
        title: plan.title,
        grantId: plan.grantId,
        grantTitle: plan.grantTitle,
        status: plan.status,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      })),
      pagination: response.pagination,
    };
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await businessPlanApi.getById(id);
    return {
      id: response.id,
      title: response.title,
      grantId: response.grantId,
      grantTitle: response.grantTitle,
      content: response.content,
      status: response.status,
      userId: response.userId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const response = await businessPlanApi.create({
      title: data.title || "새 사업계획서",
      grantId: data.grantId,
      content: data.content ? { sections: [] } : undefined,
    });
    return {
      id: response.id,
      title: response.title,
      grantId: response.grantId,
      grantTitle: response.grantTitle,
      content: response.content,
      status: response.status,
      userId: response.userId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  // 업데이트와 삭제는 apireq.md에 없으므로 미구현
  updateProject: async (
    _id: string,
    _data: Partial<Project>
  ): Promise<Project> => {
    throw new Error("업데이트 API는 현재 지원되지 않습니다.");
  },

  deleteProject: async (_id: string): Promise<void> => {
    throw new Error("삭제 API는 현재 지원되지 않습니다.");
  },
};
