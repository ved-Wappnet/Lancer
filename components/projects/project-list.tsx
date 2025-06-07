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
  categoryFilter: string;
  statusFilter: "all" | "active" | "completed" | "draft";
}

// Mock project data
const projects = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    description: "Redesign of e-commerce website with focus on UX and conversion optimization.",
    status: "active",
    budget: "$4,500",
    deadline: "June 15, 2025",
    category: "design",
    proposalCount: 8,
    isHiring: true,
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Native iOS and Android app for food delivery service.",
    status: "active",
    budget: "$8,000",
    deadline: "July 30, 2025",
    category: "development",
    proposalCount: 12,
    isHiring: true,
  },
  {
    id: "3",
    title: "Brand Identity Design",
    description: "Logo, color palette, and brand guidelines for tech startup.",
    status: "active",
    budget: "$2,200",
    deadline: "May 25, 2025",
    category: "design",
    proposalCount: 15,
    isHiring: false,
  },
  {
    id: "4",
    title: "Content Marketing Strategy",
    description: "Content creation and distribution strategy for Q3 and Q4.",
    status: "draft",
    budget: "$3,000",
    deadline: "TBD",
    category: "marketing",
    proposalCount: 0,
    isHiring: false,
  },
  {
    id: "5",
    title: "SEO Optimization",
    description: "Technical SEO audit and implementation of recommendations.",
    status: "completed",
    budget: "$1,800",
    deadline: "Completed April 10, 2025",
    category: "marketing",
    proposalCount: 6,
    isHiring: false,
  },
  {
    id: "6",
    title: "Product Documentation",
    description: "User guides and technical documentation for SaaS platform.",
    status: "completed",
    budget: "$2,500",
    deadline: "Completed March 22, 2025",
    category: "writing",
    proposalCount: 4,
    isHiring: false,
  },
];

export function ProjectList({ searchQuery, categoryFilter, statusFilter }: ProjectListProps) {
  // Filter projects based on search query, category, and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/40 rounded-lg">
        <p className="text-muted-foreground mb-2">No projects found matching your criteria.</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
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
                      href={`/projects/${project.id}`}
                      className="hover:underline"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        project.status === "active"
                          ? "default"
                          : project.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {project.status === "active"
                        ? "Active"
                        : project.status === "completed"
                          ? "Completed"
                          : "Draft"}
                    </Badge>
                    {project.isHiring && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                        Hiring
                      </Badge>
                    )}
                  </div>
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
                  {project.status !== "draft" && (
                    <div className="flex items-center text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {project.proposalCount} proposals
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
                <Link href={`/projects/${project.id}`}>
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
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>View Proposals</DropdownMenuItem>
                    <DropdownMenuItem>Share Project</DropdownMenuItem>
                    {project.status === "draft" && (
                      <DropdownMenuItem>Publish Project</DropdownMenuItem>
                    )}
                    {project.status === "active" && (
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
  );
}