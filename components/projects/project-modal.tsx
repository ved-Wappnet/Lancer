"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCreateProjectMutation, useUpdateProjectMutation } from "@/services/projectApi";

interface ProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    category?: number;
    status?: number;
    budget?: string;
    deadline?: string;
    skillsRequired?: string[];
  };
}

export function ProjectModal({ open, setOpen, mode, initialData }: ProjectModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<number>(0);
  const [status, setStatus] = useState<number>(0);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState(""); // New field

  const [createProject,{isLoading:isCreating}] = useCreateProjectMutation();
  const [updateProject,{isLoading:isUpdating}] = useUpdateProjectMutation();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category ?? 0);
      setStatus(initialData.status ?? 0);
      setBudget(initialData.budget || "");
      setDeadline(initialData.deadline || "");
      setSkills(initialData.skillsRequired ? initialData.skillsRequired.join(', ') : "");
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(0);
    setStatus(0);
    setBudget("");
    setDeadline("");
    setSkills("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || budget === "") {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (mode === "create") {
        await createProject({
          title,
          description,
          category,
          budget,
          deadline: deadline || undefined,
          status,
          skillsRequired: skills.split(',').map(s => s.trim()).filter(Boolean),
        }).unwrap();
        toast({
          title: "Project created",
          description: "Your project has been created successfully",
        });
      } else if (mode === "edit" && initialData?.id) {
        await updateProject({
          id: initialData.id,
          title,
          description,
          category,
          budget,
          deadline: deadline || undefined,
          status,
          skillsRequired: skills.split(',').map(s => s.trim()).filter(Boolean),
        });
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully",
        });
      }
      setOpen(false);
      resetForm();
      router.push("/dashboard/projects");
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error?.data?.error || "Please try again later",
        variant: "destructive",
      });
    } finally {
      
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Edit Project" : "Create a new project"}</DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update your project details below."
                : "Fill out the details below to post a new project and start receiving proposals."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="E.g., Website Redesign, Mobile App Development"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project requirements, goals, and expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills Required (comma separated)</Label>
              <Input
                id="skills"
                placeholder="e.g. React, Node.js, UI/UX Design"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category.toString()} onValueChange={(val) => setCategory(Number(val))} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Web Design</SelectItem>
                    <SelectItem value="1">Development</SelectItem>
                    <SelectItem value="2">Marketing</SelectItem>
                    <SelectItem value="3">Content Writing</SelectItem>
                    <SelectItem value="4">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Project Status</Label>
                <Select value={status.toString()} onValueChange={(val) => setStatus(Number(val))} required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="2">Completed</SelectItem>
                    <SelectItem value="3">In Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="E.g., $500, $1000-2000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mode === "edit" ? isUpdating : isCreating}>
              {(mode === "edit" ? (isUpdating ? "Updating..." : "Update Project") : (isCreating ? "Creating..." : "Create Project"))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
