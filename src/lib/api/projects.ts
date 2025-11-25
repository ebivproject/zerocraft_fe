import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/constants/api";
import { Project, ProjectsResponse } from "@/types/project";

export const projectsApi = {
  getProjects: async (): Promise<ProjectsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.LIST);
    return response.data;
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
    return response.data;
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, data);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await axiosInstance.put(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },
};
