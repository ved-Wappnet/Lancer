import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";
import Bid from "@/models/Bid";

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
