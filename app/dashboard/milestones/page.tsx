"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ChevronDown, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetProjectsQuery } from "@/services/projectApi";
import { useCreateMilestoneMutation, useGetMilestonesQuery, useUpdateMilestoneMutation, useDeleteMilestoneMutation } from "@/services/milestoneApi";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import type { Milestone, MilestoneStatus, MilestoneApiResponse, MilestoneCardProps } from "@/types/milestone";



// Helper: map status string to enum number
const statusToNumber = (status: MilestoneStatus): number => {
  switch (status) {
    case 'upcoming': return 1;
    case 'in-progress': return 2;
    case 'completed': return 3;
    case 'delayed': return 4;
    default: return 1;
  }
};

// Helper: map enum number to status string
const numberToStatus = (num: number): MilestoneStatus => {
  switch (num) {
    case 1: return 'upcoming';
    case 2: return 'in-progress';
    case 3: return 'completed';
    case 4: return 'delayed';
    default: return 'upcoming';
  }
};





// Type guard for project with title
function isProjectWithTitle(project: unknown): project is { title: string } {
  return typeof project === "object" && project !== null && "title" in project && typeof (project as any).title === "string";
}

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";



function MilestoneCard({ milestone, onEdit, onDelete }: MilestoneCardProps) {
  // Handle both string and object for project
  let projectTitle = "";
  if (typeof milestone.project === "string") projectTitle = milestone.project;
  else if (isProjectWithTitle(milestone.project)) projectTitle = milestone.project.title;

  return (
  <div className="rounded-lg border bg-card p-6 shadow-sm relative">
    {/* 3-dots menu top-right */}
    <div className="absolute right-2 top-1 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent">
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit && onEdit(milestone)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => onDelete && onDelete(milestone)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-nowrap truncate ellipsis w-36" title={milestone?.title}>{milestone?.title}</h3>
          <Badge
            variant={(() => {
              const status = numberToStatus(milestone.status);
              if (status === 'upcoming') return 'secondary';
              if (status === 'in-progress') return 'default';
              if (status === 'completed') return 'outline';
              return 'destructive';
            })()}
            className="whitespace-nowrap"
          >
            {numberToStatus(milestone.status)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {projectTitle}
        </p>
        <p className="text-sm truncate ellipsis w-52" title={milestone.description}>{milestone.description}</p>
      </div>
      <div className="space-y-2 min-w-[200px]">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}</span>
          <span className="font-medium">{milestone.progress}%</span>
        </div>
        <Progress value={milestone.progress} className="h-2" />
      </div>
    </div>
  </div>
);
}

export default function MilestonesPage() {
  // Modal state and form fields for creating a milestone
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | number | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneProjectId, setMilestoneProjectId] = useState("");
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();
  const [milestoneDueDate, setMilestoneDueDate] = useState("");
  const [milestoneProgress, setMilestoneProgress] = useState<number>(0);
  const [milestoneStatus, setMilestoneStatus] = useState<MilestoneStatus>('upcoming');

  // Add milestone to mock data (for demo, not persisted)
  const [createMilestone, { isLoading: isSubmitting }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] = useUpdateMilestoneMutation();
  const [deleteMilestone, { isLoading: isDeleting }] = useDeleteMilestoneMutation();

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(null);

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingMilestoneId !== null) {
        const response = await updateMilestone({
          id: editingMilestoneId,
          data: {
            title: milestoneTitle,
            description: milestoneDescription,
            projectId: Number(milestoneProjectId),
            dueDate: milestoneDueDate,
            progress: milestoneProgress,
            status: statusToNumber(milestoneStatus),
          },
        }).unwrap();
        toast({
          title: "Milestone Updated",
          description: response?.message || "Milestone updated successfully."
        });
        setCreateModalOpen(false);
      } else {
        const response = await createMilestone({
          title: milestoneTitle,
          description: milestoneDescription,
          projectId: Number(milestoneProjectId),
          dueDate: milestoneDueDate,
          progress: milestoneProgress,
          status: statusToNumber(milestoneStatus),
        }).unwrap();
        toast({
          title: "Milestone Created",
          description: response?.message || "Milestone created successfully."
        });
        setCreateModalOpen(false);
      }
      setIsEditMode(false);
      setEditingMilestoneId(null);
      setMilestoneTitle("");
      setMilestoneDescription("");
      setMilestoneProjectId("");
      setMilestoneDueDate("");
      setMilestoneProgress(0);
      setMilestoneStatus('upcoming');
    } catch (err) {
      // Optionally show error toast
    }
  };

  // Handle edit: open modal and prefill
  const handleEditMilestone = (milestone: Milestone) => {
    setIsEditMode(true);
    setEditingMilestoneId(milestone.id);
    setMilestoneTitle(milestone.title);
    setMilestoneDescription(milestone.description);
    setMilestoneProjectId(
      typeof milestone.project === 'string' ? milestone.project : (milestone.project?.id ? String(milestone.project.id) : "")
    );
    setMilestoneDueDate(milestone.dueDate);
    setMilestoneProgress(milestone.progress);
    setMilestoneStatus(numberToStatus(milestone.status));
    setCreateModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState<'due-date' | 'progress' | 'status'>('due-date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch milestones from backend
  const { data: milestones, isLoading: milestonesLoading,isFetching: milestonesIsFetching} = useGetMilestonesQuery();

  const sortMilestones = (milestones: Milestone[]) => {
    return [...milestones].sort((a, b) => {
      switch (sortOption) {
        case 'due-date':
          return sortDirection === 'asc' 
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'progress':
          return sortDirection === 'asc' ? a.progress - b.progress : b.progress - a.progress;
        case 'status':
          return sortDirection === 'asc'
  ? (a.status - 1) - (b.status - 1)
  : (b.status - 1) - (a.status - 1);
        default:
          return 0;
      }
    });
  };

  // Type guard for project with title
  function isProjectWithTitle(project: unknown): project is { title: string } {
    return typeof project === "object" && project !== null && "title" in project && typeof (project as any).title === "string";
  }

  // Helper to get project title as string
  function getProjectTitle(project: unknown): string {
    if (typeof project === 'string') return project;
    if (isProjectWithTitle(project)) return project.title;
    return '';
  }

  const filteredMilestones = sortMilestones(
    (milestones?.data || []).filter(milestone => {
      const titleMatch = typeof milestone.title === 'string' && milestone.title.toLowerCase().includes(searchQuery.toLowerCase());
      const projectTitle = getProjectTitle(milestone.project);
      const projectMatch = typeof projectTitle === 'string' && projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = titleMatch || projectMatch;
      if (activeTab === 'all') return matchesSearch;
      return numberToStatus(milestone.status) === activeTab && matchesSearch;
    })
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Milestones" description="Track and manage project milestones" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Milestones</h1>
        <div className="flex items-center gap-4">
          <Select
            value={sortOption}
            onValueChange={(value: string) => setSortOption(value as typeof sortOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
              {/* <ChevronDown className="h-4 w-4" /> */}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due-date">Due Date</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
          <Button onClick={() => setCreateModalOpen(true)} className="ml-2">
            + Create Milestone
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search milestones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
  {milestonesLoading || milestonesIsFetching ? (
    <div className="flex items-center justify-center">
      <Loader/>
    </div>
  ) : !milestones || filteredMilestones.length === 0 ? (
    <div className="text-center text-muted-foreground py-10">No milestones found.</div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredMilestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onEdit={handleEditMilestone}
            onDelete={(m) => {
              setMilestoneToDelete(m);
              setDeleteDialogOpen(true);
            }}
          />
        ))}
    </div>
  )}
</div>

      {/* Milestone Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleMilestoneSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Milestone" : "Create Milestone"}</DialogTitle>
              <DialogDescription>{isEditMode ? "Update milestone details." : "Define a new milestone for your project."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="milestone-title">Milestone Title</Label>
                <Input
                  id="milestone-title"
                  placeholder="E.g., Design Phase Completion"
                  value={milestoneTitle}
                  onChange={e => setMilestoneTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="milestone-description">Description</Label>
                <Textarea
                  id="milestone-description"
                  placeholder="Describe the milestone, deliverables, etc."
                  value={milestoneDescription}
                  onChange={e => setMilestoneDescription(e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="milestone-project">Project</Label>
                <Select
                  value={milestoneProjectId}
                  onValueChange={setMilestoneProjectId}
                  required
                  disabled={projectsLoading}
                >
                  <SelectTrigger id="milestone-project">
                    <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select project"} />
                  </SelectTrigger>
                  <SelectContent>
                    {projectsLoading ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : projects.length === 0 ? (
                      <SelectItem value="" disabled>No projects found</SelectItem>
                    ) : (
                      projects.map((project) => (
                        <SelectItem key={project.id} value={String(project.id)}>{project.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="milestone-status">Status</Label>
                  <Select value={milestoneStatus} onValueChange={val => setMilestoneStatus(val as MilestoneStatus)} required>
                    <SelectTrigger id="milestone-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="milestone-progress">Progress (%)</Label>
                  <Input
                    id="milestone-progress"
                    type="number"
                    min={0}
                    max={100}
                    value={milestoneProgress}
                    onChange={e => setMilestoneProgress(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="milestone-due-date">Due Date</Label>
                <Input
                  id="milestone-due-date"
                  type="date"
                  value={milestoneDueDate}
                  onChange={e => setMilestoneDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUpdating}>
                {isEditMode
                  ? (isUpdating ? "Saving..." : "Save Changes")
                  : (isSubmitting ? "Creating..." : "Create Milestone")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    {/* Delete Confirmation Dialog */}
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Milestone</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this milestone?
            <br />
            <span className="font-semibold">{milestoneToDelete?.title}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={async () => {
              if (milestoneToDelete) {
                const response = await deleteMilestone(milestoneToDelete.id).unwrap();
                toast({
                  title: "Milestone Deleted",
                  description: response?.message || "Milestone deleted successfully."
                });
                setDeleteDialogOpen(false);
                setMilestoneToDelete(null);
              }
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}
