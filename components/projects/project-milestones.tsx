"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Calendar, CheckCircle, Clock, PlusCircle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ProjectMilestonesProps {
  projectId: string;
}

// Mock milestone data
const milestones = [
  {
    id: "1",
    title: "Project Discovery and Research",
    description: "Analyze current website, user research, competitive analysis, and requirements gathering.",
    amount: "$900",
    status: "completed",
    dueDate: "May 2, 2025",
    progress: 100,
  },
  {
    id: "2",
    title: "Wireframes and User Flows",
    description: "Create wireframes for all key pages and user flow diagrams for main processes.",
    amount: "$1,200",
    status: "in-progress",
    dueDate: "May 15, 2025",
    progress: 60,
  },
  {
    id: "3",
    title: "UI Design and Prototyping",
    description: "Create high-fidelity mockups and interactive prototype for user testing.",
    amount: "$1,500",
    status: "pending",
    dueDate: "May 30, 2025",
    progress: 0,
  },
  {
    id: "4",
    title: "Design System and Handoff",
    description: "Finalize design system with components and prepare assets for development.",
    amount: "$900",
    status: "pending",
    dueDate: "June 15, 2025",
    progress: 0,
  },
];

export function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const totalAmount = milestones.reduce((sum, milestone) => {
    return sum + parseInt(milestone.amount.replace(/\$|,/g, ""));
  }, 0);
  
  const completedAmount = milestones
    .filter(m => m.status === "completed")
    .reduce((sum, milestone) => {
      return sum + parseInt(milestone.amount.replace(/\$|,/g, ""));
    }, 0);
  
  const overallProgress = Math.round((completedAmount / totalAmount) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Overall completion: {overallProgress}%</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                ${completedAmount.toLocaleString()} of ${totalAmount.toLocaleString()} released
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-2" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold">${completedAmount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold">${(totalAmount - completedAmount).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Milestones</p>
              <p className="text-2xl font-bold">{milestones.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Project Milestones</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
              <DialogDescription>
                Create a new milestone to track project progress and payments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Milestone Title</Label>
                <Input id="title" placeholder="E.g., Design Research Phase" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the deliverables and requirements..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" placeholder="$0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Add Milestone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Badge
                      variant={
                        milestone.status === "completed" 
                          ? "default" 
                          : milestone.status === "in-progress" 
                            ? "secondary" 
                            : "outline"
                      }
                    >
                      {milestone.status === "completed" 
                        ? "Completed" 
                        : milestone.status === "in-progress" 
                          ? "In Progress" 
                          : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {milestone.amount}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Due: {milestone.dueDate}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-1.5" />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {milestone.status === "in-progress" && (
                    <Button size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit for Approval
                    </Button>
                  )}
                  
                  {milestone.status === "pending" && (
                    <Button size="sm" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Start Work
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Milestone</DropdownMenuItem>
                      <DropdownMenuItem>Add Deliverable</DropdownMenuItem>
                      <DropdownMenuItem>Request Extension</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}