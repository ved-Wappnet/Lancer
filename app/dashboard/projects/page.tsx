"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectList } from "@/components/projects/project-list";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { Search, Briefcase, Filter } from "lucide-react";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Browse, create, and manage your projects.
          </p>
        </div>
        <CreateProjectButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto sm:flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="category" className="sr-only">
                  Category
                </Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger id="category" className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="design">Web Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="writing">Content Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <ProjectList
                  searchQuery={searchQuery}
                  categoryFilter={categoryFilter}
                  statusFilter="all"
                />
              </TabsContent>
              <TabsContent value="active" className="space-y-4">
                <ProjectList
                  searchQuery={searchQuery}
                  categoryFilter={categoryFilter}
                  statusFilter="active"
                />
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                <ProjectList
                  searchQuery={searchQuery}
                  categoryFilter={categoryFilter}
                  statusFilter="completed"
                />
              </TabsContent>
              <TabsContent value="draft" className="space-y-4">
                <ProjectList
                  searchQuery={searchQuery}
                  categoryFilter={categoryFilter}
                  statusFilter="draft"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
              <CardDescription>Your project activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-primary mr-2" />
                      <span>Active</span>
                    </div>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2" />
                      <span>Completed</span>
                    </div>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2" />
                      <span>In Review</span>
                    </div>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-muted mr-2" />
                      <span>Draft</span>
                    </div>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm font-medium">Mobile App Development</p>
                  <p className="text-xs text-muted-foreground">Milestone 2 completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm font-medium">E-commerce Website Redesign</p>
                  <p className="text-xs text-muted-foreground">New message from Emma</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm font-medium">Brand Identity Design</p>
                  <p className="text-xs text-muted-foreground">Payment released</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}