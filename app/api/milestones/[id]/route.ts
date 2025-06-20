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

    // Helper to normalize milestone status (handles both string and number)
    const normalizeStatus = (status: any) => {
      // Numeric status: 1=upcoming, 2=in-progress, 3=completed, 4=delayed
      if (typeof status === 'number') {
        switch (status) {
          case 1: return 'upcoming';
          case 2: return 'in-progress';
          case 3: return 'completed';
          case 4: return 'delayed';
          default: return '';
        }
      }
      return status;
    };

    for (const bid of bids) {
      const contract = await Contract.findOne({ where: { bidId: bid.id } });
      if (!contract) continue;
      let newStatus = contract.status;
      let newPaymentStatus = contract.paymentStatus;

      const statuses = allMilestones.map(m => normalizeStatus(m.status));

      // Update contract status logic (unchanged)
      if (!allMilestones.length) {
        if (contract.status === 'active') newStatus = 'pending';
      } else if (statuses.some(s => s === 'upcoming' || s === 'in-progress')) {
        newStatus = 'pending';
      } else if (statuses.every(s => s === 'completed')) {
        newStatus = 'completed';
      } else if (statuses.some(s => s === 'delayed')) {
        newStatus = 'cancelled';
      }

      // Update paymentStatus logic:
      if (statuses.every(s => s === 'completed')) {
        newPaymentStatus = 'pending'; // All milestones completed, awaiting payment
      } else {
        newPaymentStatus = 'on_hold'; // Not all milestones completed
      }

      // Only update if status or paymentStatus actually changes
      let changed = false;
      if (contract.status !== newStatus) {
        contract.status = newStatus;
        changed = true;
      }
      if (contract.paymentStatus !== newPaymentStatus) {
        contract.paymentStatus = newPaymentStatus;
        changed = true;
      }
      if (changed) {
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
