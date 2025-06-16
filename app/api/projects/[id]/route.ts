import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { ProjectStatus } from "@/models/Project";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { title, description, category, budget, deadline, status, skillsRequired } = await req.json();

    if (!title || !description || category === undefined || !budget || status === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const categoryNum = Number(category);
    const statusNum = Number(status);
    if (isNaN(categoryNum) || isNaN(statusNum)) {
      return NextResponse.json({ error: "Category and status must be numbers" }, { status: 400 });
    }

    const updateData: any = {
        title,
        description,
        category: categoryNum,
        budget,
        deadline: deadline || null,
        status: statusNum as ProjectStatus,
      };
      // Only update skillsRequired if provided
      if (skillsRequired !== undefined) {
        // Accept both array and comma-separated string
        if (Array.isArray(skillsRequired)) {
          updateData.skillsRequired = skillsRequired;
        } else if (typeof skillsRequired === 'string') {
          updateData.skillsRequired = skillsRequired.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
      const [updated] = await Project.update(
        updateData,
        { where: { id } }
      );

    if (!updated) {
      return NextResponse.json({ error: "Project not found or not updated" }, { status: 404 });
    }

    const project = await Project.findByPk(id);
    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
