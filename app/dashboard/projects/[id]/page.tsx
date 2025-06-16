"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Clock,
  Tag,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectDetails } from "@/components/projects/project-details";
import { ProjectProposals } from "@/components/projects/project-proposals";
import { ProjectMilestones } from "@/components/projects/project-milestones";
import { ProjectMessages } from "@/components/projects/project-messages";

import { useGetProjectByIdQuery } from "@/services/projectApi";
import Loader from "@/components/ui/loader";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id;
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId);

  if (isLoading) {
    return (
     <Loader/>
    );
  }
  if (error || !project) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-destructive">Project not found or failed to load.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to projects</span>
              </Button>
            </Link>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <Badge className="ml-2">{project.status === 0 ? "Draft" : project.status === 1 ? "Active" : project.status === 2 ? "Completed" : project.status === 3 ? "In Review" : "Unknown"}</Badge>
          </div>
          <p className="text-muted-foreground">
            {project.description || "No description provided."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Client
          </Button>
          <Button>Submit Proposal</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="proposals">Proposals (12)</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <ProjectDetails projectId={projectId} />
            </TabsContent>
            <TabsContent value="proposals" className="space-y-4">
              <ProjectProposals projectId={projectId} />
            </TabsContent>
            <TabsContent value="milestones" className="space-y-4">
              <ProjectMilestones projectId={projectId} />
            </TabsContent>
            <TabsContent value="messages" className="space-y-4">
              <ProjectMessages projectId={projectId} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Budget</span>
                  </div>
                  <span className="font-medium">${project.budget}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Deadline</span>
                  </div>
                  <span className="font-medium">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "-"}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{/* Could be calculated from createdAt/deadline */}-</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Category</span>
                  </div>
                  <span className="font-medium">{project.category === 0 ? "Design" : project.category === 1 ? "Development" : project.category === 2 ? "Marketing" : project.category === 3 ? "Writing" : "Unknown"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar.png" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Member since April 2024</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Projects Posted</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-medium">$15,800</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Avg. Rating</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">United States</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <Link href="/projects/2" className="font-medium hover:underline">
                    E-commerce UX Optimization
                  </Link>
                  <p className="text-sm text-muted-foreground">$3,800 • Web Design</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <Link href="/projects/3" className="font-medium hover:underline">
                    Shopify Store Design and Setup
                  </Link>
                  <p className="text-sm text-muted-foreground">$2,500 • Web Design</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <Link href="/projects/4" className="font-medium hover:underline">
                    WooCommerce Customization
                  </Link>
                  <p className="text-sm text-muted-foreground">$1,800 • Development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}