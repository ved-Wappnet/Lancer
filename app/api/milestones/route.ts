import { NextRequest, NextResponse } from "next/server";
import Milestone from "@/models/Milestone";

// POST /api/milestones - Create a new milestone
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, projectId, dueDate, progress, status } = body;
    if (!title || !description || !projectId || !dueDate || progress === undefined || status === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Convert status string to number if needed
    let statusValue = status;
    if (typeof status === 'string') {
      const statusMap = ['upcoming', 'in-progress', 'completed', 'delayed'];
      statusValue = statusMap.indexOf(status);
      if (statusValue === -1) statusValue = 0;
    }
    const milestone = await Milestone.create({
      title,
      description,
      projectId,
      dueDate,
      progress,
      status: statusValue,
    });
    return NextResponse.json({
      success: true,
      message: "Milestone created successfully",
      data: milestone
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/milestones - List all milestones (with project info)
import Project from "@/models/Project";
export async function GET() {
  try {
    const milestones = await Milestone.findAll({
      include: [{ model: Project, as: "project" }],
      order: [["dueDate", "ASC"]],
    });
    return NextResponse.json({
      success: true,
      message: "Milestones fetched successfully",
      data: milestones
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
