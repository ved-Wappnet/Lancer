import { NextRequest, NextResponse } from 'next/server';
import { Bid, BidApiResponse, BidPayload } from '@/types/bid';

// Dummy in-memory store for demonstration (should be replaced with DB in production)
let bids: Bid[] = [];

// Helper to find a bid by ID
function findBid(id: number) {
  return bids.find((b) => b.id === id);
}

// GET /api/bids/[id] - fetch a single bid
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<BidApiResponse<Bid | null>>> {
  try {
    if (!params?.id || isNaN(Number(params.id))) {
      return NextResponse.json({ success: false, message: 'Invalid or missing bid ID.', data: null }, { status: 400 });
    }
    const id = Number(params.id);
    const bid = findBid(id);
    if (!bid) return NextResponse.json({ success: false, message: 'Bid not found.', data: null }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Bid fetched successfully.', data: bid });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unexpected error occurred.', data: null }, { status: 500 });
  }
}

// PATCH /api/bids/[id] - update a bid
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<BidApiResponse<Bid | null>>> {
  try {
    if (!params?.id || isNaN(Number(params.id))) {
      return NextResponse.json({ success: false, message: 'Invalid or missing bid ID.', data: null }, { status: 400 });
    }
    const id = Number(params.id);
    const bid = findBid(id);
    if (!bid) return NextResponse.json({ success: false, message: 'Bid not found.', data: null }, { status: 404 });
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid JSON body.', data: null }, { status: 400 });
    }
    // Only allow certain fields to be updated
    let updated = false;
    if (body.amount !== undefined) {
      if (typeof body.amount !== 'number' || body.amount < 0) {
        return NextResponse.json({ success: false, message: 'Invalid amount value.', data: null }, { status: 400 });
      }
      bid.amount = body.amount;
      updated = true;
    }
    if (body.message !== undefined) {
      if (typeof body.message !== 'string') {
        return NextResponse.json({ success: false, message: 'Invalid message value.', data: null }, { status: 400 });
      }
      bid.message = body.message;
      updated = true;
    }
    if (body.status !== undefined) {
      if (!['pending', 'accepted', 'rejected'].includes(body.status)) {
        return NextResponse.json({ success: false, message: 'Invalid status value.', data: null }, { status: 400 });
      }
      bid.status = body.status;
      updated = true;
    }
    if (!updated) {
      return NextResponse.json({ success: false, message: 'No valid fields to update.', data: null }, { status: 400 });
    }
    bid.updatedAt = new Date().toISOString();
    return NextResponse.json({ success: true, message: 'Bid updated successfully.', data: bid });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unexpected error occurred.', data: null }, { status: 500 });
  }
}

// DELETE /api/bids/[id] - delete a bid
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<BidApiResponse<null>>> {
  try {
    if (!params?.id || isNaN(Number(params.id))) {
      return NextResponse.json({ success: false, message: 'Invalid or missing bid ID.', data: null }, { status: 400 });
    }
    const id = Number(params.id);
    const index = bids.findIndex((b) => b.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: 'Bid not found.', data: null }, { status: 404 });
    bids.splice(index, 1);
    return NextResponse.json({ success: true, message: 'Bid deleted successfully.', data: null });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unexpected error occurred.', data: null }, { status: 500 });
  }
}
