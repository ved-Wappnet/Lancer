// Milestone-related types

export type MilestoneStatus = 'upcoming' | 'in-progress' | 'completed' | 'delayed';

export interface MilestoneCardProps {
  milestone: Milestone;
  onEdit?: (milestone: Milestone) => void;
  onDelete?: (milestone: Milestone) => void;
}


export interface Milestone {
  id: string | number;
  title: string;
  project?: string | { title: string; id: number };
  dueDate: string;
  progress: number;
  status: number; // 1-4, matches backend
  description: string;
}

export interface MilestonePayload {
  title: string;
  description: string;
  projectId: number;
  dueDate: string;
  progress: number;
  status: number;
}

export interface ProjectRef {
  id: number;
  title: string;
}

export interface MilestoneResponse {
  id: number;
  title: string;
  description: string;
  projectId: number;
  dueDate: string;
  progress: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  project?: ProjectRef;
}

export interface MilestoneApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
