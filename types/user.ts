export type RoleType = "client" | "freelancer" | "admin";

export const roleTypeMap: Record<RoleType, string> = {
  client: "Client",
  freelancer: "Freelancer",
  admin: "Admin",
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar?: string;
  createdAt: Date;
  bio?: string;
  skills?: string[];
  hourlyRate?: number; // For freelancers
  location?: string;
  languages?: string[];
  completedProjects?: number;
  rating?: number;
}