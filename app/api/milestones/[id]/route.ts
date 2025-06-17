import { NextRequest, NextResponse } from "next/server";
import Milestone from "@/models/Milestone";
import Project from "@/models/Project";

// PATCH /api/milestones/:id - Update a milestone
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }
    await milestone.update(body);
    // Optionally, include project info in response
    const updated = await Milestone.findByPk(id, { include: [{ model: Project, as: "project" }] });
    return NextResponse.json({
      success: true,
      message: "Milestone updated successfully",
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// (Optional) GET /api/milestones/:id - Get a single milestone
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const milestone = await Milestone.findByPk(id, { include: [{ model: Project, as: "project" }] });
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "Milestone fetched successfully",
      data: milestone
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// (Optional) DELETE /api/milestones/:id - Delete a milestone
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }
    await milestone.destroy();
    return NextResponse.json({
      success: true,
      message: "Milestone deleted successfully",
      data: null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
