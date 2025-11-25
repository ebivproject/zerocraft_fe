export interface Grant {
  id: string;
  title: string;
  description: string;
  organization: string;
  deadline: string;
  amount: string;
  category: string;
  status: "open" | "closed" | "upcoming";
  createdAt: string;
  updatedAt: string;
}

export interface GrantsResponse {
  data: Grant[];
  total: number;
  page: number;
  limit: number;
}

export interface GrantFilter {
  category?: string;
  status?: string;
  search?: string;
}
