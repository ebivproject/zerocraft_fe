export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  credits?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
