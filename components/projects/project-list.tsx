"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, Calendar, MoreHorizontal, MessageSquare, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectListProps {
  searchQuery: string;

  categoryFilter: string | number;
  statusFilter: "all" | 0 | 1 | 2 | 3;
}

const statusLabels: Record<number, string> = {
  0: "Draft",
  1: "Active",
  2: "Completed",
  3: "In Review",
};

const statusBadgeVariant: Record<number, "default" | "secondary" | "outline"> = {
  0: "outline",
  1: "default",
  2: "secondary",
  3: "outline",
};

const categoryLabels: Record<number, string> = {
  0: "Web Design",
  1: "Development",
  2: "Marketing",
  3: "Content Writing",
  4: "Other",
};

import { useGetProjectsQuery } from "@/services/projectApi";

import { useState } from "react";
import { ProjectModal } from "./project-modal";
import Loader from "../ui/loader";

export function ProjectList({ categoryFilter, statusFilter }: ProjectListProps) {
  // State for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const { data: projects, isLoading, isFetching } = useGetProjectsQuery();

  // Helper to safely compare status/category filters (supports string/number input)
  const toNum = (val: string | number) => typeof val === 'number' ? val : Number(val);

  if (isLoading || isFetching) {
    return <Loader/>;
  }

  // Only filter by category and status client-side; search is now handled by backend
  const filteredProjects = (projects || []).filter((project) => {
    const category = typeof project.category === 'number' ? project.category : -1;
    const status = typeof project.status === 'number' ? project.status : -1;
    const matchesCategory = categoryFilter === "all" || category === toNum(categoryFilter);
    const matchesStatus = statusFilter === "all" || status === toNum(statusFilter);
    return matchesCategory && matchesStatus;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/40 rounded-lg">
        <p className="text-muted-foreground mb-2">No projects found matching your criteria.</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-lg">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="hover:underline"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    {/* Status Badge */}
                    <Badge variant={statusBadgeVariant[project.status] || "outline"}>
                      {statusLabels[project.status] || "Unknown"}
                    </Badge>
                    {/* Category Badge */}
                    <Badge variant="secondary">
                      {categoryLabels[project.category] || "Unknown"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {project.budget}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {project.deadline}
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="font-medium text-muted-foreground">Skills Required:</span>
                    {Array.isArray(project.skillsRequired) && project.skillsRequired.length > 0 ? (
                      project.skillsRequired.map((skill: string, idx: number) => (
                        <span key={idx} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditProject(project)}>
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Proposals</DropdownMenuItem>
                      <DropdownMenuItem>Share Project</DropdownMenuItem>
                      {project.status === 0 && (
                        <DropdownMenuItem>Publish Project</DropdownMenuItem>
                      )}
                      {project.status === 1 && (
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Project Modal */}
      <ProjectModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        mode="edit"
        initialData={selectedProject}
      />
    </>
  );
}