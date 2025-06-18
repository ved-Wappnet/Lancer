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

    // --- Begin: Auto-update contract status based on all milestones for the project ---
    const projectId = milestone.projectId;
    const allMilestones = await Milestone.findAll({ where: { projectId } });

    // Import Contract and Bid models
    const Contract = (await import('@/models/Contract')).default;
    const Bid = (await import('@/models/Bid')).default;

    // Find all bids for this project
    const bids = await Bid.findAll({ where: { projectId } });
    for (const bid of bids) {
      const contract = await Contract.findOne({ where: { bidId: bid.id } });
      if (!contract) continue;
      let newStatus = contract.status;
      if (!allMilestones.length) {
        // No milestones: set to 'pending' if contract is accepted/active (mapping 'draft' to 'pending')
        if (contract.status === 'active') newStatus = 'pending';
      } else if (allMilestones.some(m => m.status === 1 || m.status === 2)) {
        newStatus = 'pending';
      } else if (allMilestones.every(m => m.status === 3)) {
        newStatus = 'completed';
      } else if (allMilestones.some(m => m.status === 4)) {
        newStatus = 'cancelled'; // mapping 'delayed' to 'cancelled' as per allowed enum
      }
      // Only update if status actually changes
      if (contract.status !== newStatus) {
        contract.status = newStatus;
        await contract.save();
      }
    }
    // --- End: Auto-update contract status ---

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
