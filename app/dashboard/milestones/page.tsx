"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type MilestoneStatus = 'upcoming' | 'in-progress' | 'completed' | 'delayed';

interface Milestone {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  progress: number;
  status: MilestoneStatus;
  description: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
}

function MilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{milestone.title}</h3>
            <Badge
              variant={milestone.status === 'upcoming' ? 'secondary' : milestone.status === 'in-progress' ? 'default' : milestone.status === 'completed' ? 'outline' : 'destructive'}
            >
              {milestone.status === 'upcoming' ? 'Upcoming' : milestone.status === 'in-progress' ? 'In Progress' : milestone.status === 'completed' ? 'Completed' : 'Delayed'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {milestone.project}
          </p>
          <p className="text-sm">{milestone.description}</p>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState<'due-date' | 'progress' | 'status'>('due-date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock milestones data
  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Design Phase Completion',
      project: 'E-commerce Website',
      dueDate: '2025-06-15',
      progress: 75,
      status: 'in-progress',
      description: 'Complete all design mockups and get client approval.'
    },
    {
      id: '2',
      title: 'API Integration',
      project: 'Mobile App',
      dueDate: '2025-06-20',
      progress: 30,
      status: 'in-progress',
      description: 'Integrate with the payment gateway and authentication service.'
    },
    {
      id: '3',
      title: 'Content Migration',
      project: 'Corporate Website',
      dueDate: '2025-05-30',
      progress: 100,
      status: 'completed',
      description: 'Migrate all content from old website to new CMS.'
    },
    {
      id: '4',
      title: 'User Testing',
      project: 'Mobile App',
      dueDate: '2025-06-25',
      progress: 0,
      status: 'upcoming',
      description: 'Conduct user testing with selected participants.'
    },
    {
      id: '5',
      title: 'Bug Fixes',
      project: 'E-commerce Website',
      dueDate: '2025-05-25',
      progress: 40,
      status: 'delayed',
      description: 'Address critical bugs reported during testing.'
    },
  ];

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
          const statusOrder = { upcoming: 0, 'in-progress': 1, completed: 2, delayed: 3 };
          return sortDirection === 'asc' 
            ? statusOrder[a.status] - statusOrder[b.status]
            : statusOrder[b.status] - statusOrder[a.status];
        default:
          return 0;
      }
    });
  };

  const filteredMilestones = sortMilestones(milestones.filter(milestone =>
    milestone.status === activeTab &&
    (milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     milestone.project.toLowerCase().includes(searchQuery.toLowerCase()))
  ));

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
              <ChevronDown className="h-4 w-4" />
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMilestones.length > 0 ? (
          filteredMilestones.map((milestone) => (
            <div key={milestone.id} className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{milestone.title}</h3>
                  <Badge
                    variant={milestone.status === 'upcoming' ? 'secondary' : milestone.status === 'in-progress' ? 'default' : milestone.status === 'completed' ? 'outline' : 'destructive'}
                  >
                    {milestone.status === 'upcoming' ? 'Upcoming' : milestone.status === 'in-progress' ? 'In Progress' : milestone.status === 'completed' ? 'Completed' : 'Delayed'}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                  <span className="font-medium block">{milestone.progress}%</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{milestone.project}</p>
              <p className="mt-2 text-sm">{milestone.description}</p>
              <Progress value={milestone.progress} className="h-2 mt-4" />
            </div>
          ))
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <Button variant="outline" className="mt-4" onClick={() => console.log("Create new milestone")}>
              Create your first milestone
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
