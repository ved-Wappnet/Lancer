import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";
import Bid from "@/models/Bid";
import Project from "@/models/Project";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const userId = searchParams.get('userId');

  if (!role || !userId) {
    return NextResponse.json({ success: false, message: 'Missing role or userId', data: [] }, { status: 400 });
  }

  let where: any = {};
  if (role === 'client') where.clientId = userId;
  else if (role === 'freelancer') where.freelancerId = userId;
  else return NextResponse.json({ success: false, message: 'Invalid role', data: [] }, { status: 400 });

  const contracts = await Contract.findAll({
    where,
    include: [
      {
        model: Bid,
        as: 'bid',
        include: [{ model: Project, as: 'project' }],
      },
      { model: User, as: 'client', attributes: ['id', 'name', 'email', 'image'] },
      { model: User, as: 'freelancer', attributes: ['id', 'name', 'email', 'image'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return NextResponse.json({ success: true, message: 'Contracts fetched', data: contracts });
}

export async function POST(req: NextRequest) {
  const { bidId, clientId, terms, amount } = await req.json();
  if (!bidId || !clientId || !terms || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Fetch the bid to get freelancerId
  const bid = await Bid.findByPk(bidId);
  if (!bid) return NextResponse.json({ error: "Bid not found" }, { status: 404 });

  const contract = await Contract.create({
    bidId,
    clientId,
    freelancerId: bid.userId,
    terms,
    amount,
    status: "pending",
  });

  // Update the bid status to 'accepted'
  bid.status = 'accepted';
  await bid.save();

  return NextResponse.json({ contract }, { status: 201 });
}
