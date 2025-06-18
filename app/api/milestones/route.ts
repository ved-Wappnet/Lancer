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

    // --- Begin: Auto-update contract status based on all milestones for the project ---
    const allMilestones = await Milestone.findAll({ where: { projectId } });
    const Contract = (await import('@/models/Contract')).default;
    const Bid = (await import('@/models/Bid')).default;
    // Find all bids for this project
    const bids = await Bid.findAll({ where: { projectId } });
    for (const bid of bids) {
      const contract = await Contract.findOne({ where: { bidId: bid.id } });
      if (!contract) continue;
      let newStatus = contract.status;
      if (!allMilestones.length) {
        if (contract.status === 'active') newStatus = 'pending';
      } else if (allMilestones.some(m => Number(m.status) === 1 || Number(m.status) === 2)) {
        newStatus = 'pending';
      } else if (allMilestones.every(m => Number(m.status) === 3)) {
        newStatus = 'completed';
      } else if (allMilestones.some(m => Number(m.status) === 4)) {
        newStatus = 'cancelled';
      }
      if (contract.status !== newStatus) {
        contract.status = newStatus;
        await contract.save();
      }
    }
    // --- End: Auto-update contract status ---

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
