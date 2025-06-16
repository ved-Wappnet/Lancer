import { NextRequest, NextResponse } from "next/server";
import Project, { ProjectStatus } from "@/models/Project";
import User from "@/models/User";


export async function GET(req: NextRequest) {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, budget, deadline, status } = body;

    if (!title || !description || category === undefined || !budget || status === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Parse category and status as numbers
    const categoryNum = Number(category);
    const statusNum = Number(status);
    if (isNaN(categoryNum) || isNaN(statusNum)) {
      return NextResponse.json({ error: "Category and status must be numbers" }, { status: 400 });
    }

    const project = await Project.create({
      title,
      description,
      category: categoryNum,
      budget,
      deadline: deadline || null,
      status: statusNum as ProjectStatus,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
