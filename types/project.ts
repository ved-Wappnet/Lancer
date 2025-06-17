// Project-related types

export interface ProjectPayload {
  title: string;
  description: string;
  category: number;
  budget: string;
  deadline?: string;
  status: number;
  skillsRequired?: string[]; // New field
}

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  category: number;
  budget: string;
  deadline?: string | null;
  status: number;
  skillsRequired?: string[]; // New field
  createdAt: string;
  updatedAt: string;
}

export interface ProjectApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
