import { NextRequest, NextResponse } from 'next/server';
import Contract from '@/models/Contract';

// GET /api/contracts/by-bid/[bidId]
export async function GET(
  req: NextRequest,
  { params }: { params: { bidId: string } }
) {
  try {
    const { bidId } = params;
    if (!bidId || isNaN(Number(bidId))) {
      return NextResponse.json({ success: false, message: 'Invalid bidId.', data: null }, { status: 400 });
    }
    const contract = await Contract.findOne({ where: { bidId: Number(bidId) } });
    if (!contract) {
      return NextResponse.json({ success: false, message: 'No contract found for this bid.', data: null }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Contract found.', data: contract });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unexpected error occurred.', data: null }, { status: 500 });
  }
}
