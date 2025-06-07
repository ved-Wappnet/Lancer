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

// Mock project data
const clientProjects = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    description: "Redesign of e-commerce website with focus on UX and conversion optimization.",
    status: "in-progress",
    budget: "$4,500",
    freelancer: {
      id: "f1",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW"
    },
    deadline: "June 15, 2025",
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Native iOS and Android app for food delivery service.",
    status: "in-progress",
    budget: "$8,000",
    freelancer: {
      id: "f2",
      name: "David Chen",
      avatar: "/avatars/david.png",
      initials: "DC"
    },
    deadline: "July 30, 2025",
  },
  {
    id: "3",
    title: "Brand Identity Design",
    description: "Logo, color palette, and brand guidelines for tech startup.",
    status: "review",
    budget: "$2,200",
    freelancer: {
      id: "f3",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.png",
      initials: "SJ"
    },
    deadline: "May 25, 2025",
  },
];

const freelancerProjects = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    description: "Redesign of e-commerce website with focus on UX and conversion optimization.",
    status: "in-progress",
    budget: "$4,500",
    client: {
      id: "c1",
      name: "Acme Inc.",
      avatar: "/avatars/acme.png",
      initials: "AI"
    },
    deadline: "June 15, 2025",
  },
  {
    id: "2",
    title: "SEO Optimization Campaign",
    description: "Full SEO audit and optimization strategy for tech blog.",
    status: "in-progress",
    budget: "$3,200",
    client: {
      id: "c2",
      name: "TechBlog Media",
      avatar: "/avatars/techblog.png",
      initials: "TM"
    },
    deadline: "May 28, 2025",
  },
  {
    id: "3",
    title: "Social Media Strategy",
    description: "Social media content plan and posting schedule for Q3.",
    status: "review",
    budget: "$1,800",
    client: {
      id: "c3",
      name: "Green Earth Co.",
      avatar: "/avatars/greenearth.png",
      initials: "GE"
    },
    deadline: "May 15, 2025",
  },
];

export function RecentProjects({ userRole }: RecentProjectsProps) {
  const projects = userRole === "client" ? clientProjects : freelancerProjects;
  const entityLabel = userRole === "client" ? "Freelancer" : "Client";

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
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base">
                    {project.title}
                  </h4>
                  <Badge
                    variant={
                      project.status === "in-progress" 
                        ? "default" 
                        : project.status === "review" 
                          ? "secondary" 
                          : "outline"
                    }
                    className="sm:ml-2 w-fit"
                  >
                    {project.status === "in-progress" 
                      ? "In Progress" 
                      : project.status === "review" 
                        ? "In Review" 
                        : "Completed"}
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
                      <AvatarImage src={userRole === "client" ? project.freelancer.avatar : project.client.avatar} alt="" />
                      <AvatarFallback>{userRole === "client" ? project.freelancer.initials : project.client.initials}</AvatarFallback>
                    </Avatar>
                    {userRole === "client" ? project.freelancer.name : project.client.name}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Link href={`/projects/${project.id}`}>
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