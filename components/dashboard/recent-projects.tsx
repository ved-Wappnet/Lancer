import { Briefcase, Clock, CheckCircle, XCircle, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type RoleType } from "@/types/user";

interface RecentProjectsProps {
  userRole: RoleType;
}

import { useGetProjectsQuery } from "@/services/projectApi";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: string;
  deadline: string;
  freelancer?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  client?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
}

// Status mapping for extensibility
// Map ProjectStatus number to label and badge variant
const statusLabels: Record<number, string> = {
  0: "Draft",
  1: "Active",
  2: "Completed",
  3: "In Review",
};
const statusBadgeVariant: Record<number, "default" | "secondary" | "outline"> = {
  0: "outline",      // Draft
  1: "default",      // Active
  2: "outline",      // Completed
  3: "secondary",    // In Review
};

export function RecentProjects({ userRole }: RecentProjectsProps) {
  const entityLabel = userRole === "client" ? "Freelancer" : "Client";
  const { data: projects = [], isLoading, error } = useGetProjectsQuery();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            {userRole === "client" 
              ? "Your active and recently created projects" 
              : "Your active and recently accepted projects"}
          </CardDescription>
        </div>
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading && <div>Loading projects...</div>}
        {error && <div className="text-red-500">{(error as any)?.message || "Failed to load projects"}</div>}
        <div className="space-y-4">
          {!isLoading && !error && projects.map((project: any) => (
            <div 
              key={project.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base">
                    {project.title}
                  </h4>
                  {/* Status Badge with mapping */}
                  <Badge
                    variant={statusBadgeVariant[project.status] || "outline"}
                    className="sm:ml-2 w-fit"
                  >
                    {statusLabels[project.status] || project.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-2 text-xs sm:text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-1 h-3.5 w-3.5" />
                    {project.budget}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Due {project.deadline}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Avatar className="h-5 w-5 mr-1">
                      {userRole === "client" && 'freelancer' in project && project.freelancer ? (
                        <>
                          <AvatarImage src={project.freelancer.avatar} alt="" />
                          <AvatarFallback>{project.freelancer.initials}</AvatarFallback>
                        </>
                      ) : null}
                      {userRole !== "client" && 'client' in project && project.client ? (
                        <>
                          <AvatarImage src={project.client.avatar} alt="" />
                          <AvatarFallback>{project.client.initials}</AvatarFallback>
                        </>
                      ) : null}
                    </Avatar>
                    {userRole === "client" && 'freelancer' in project && project.freelancer ? project.freelancer.name : null}
                    {userRole !== "client" && 'client' in project && project.client ? project.client.name : null}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button size="sm">View Project</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}