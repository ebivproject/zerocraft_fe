export interface Grant {
  id: string;
  title: string;
  description?: string;
  organization: string;
  deadline: string;
  amount: string;
  category: string;
  tags?: string[];
  views?: number;
  status: "open" | "closed" | "upcoming";
  eligibility?: string;
  applicationMethod?: string;
  requiredDocuments?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface GrantsResponse {
  data: Grant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GrantFilter {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}
