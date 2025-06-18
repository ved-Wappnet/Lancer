import { NextRequest, NextResponse } from 'next/server';
import dbBid from '@/models/Bid';
import User from '@/models/User';
import { BidPayload, BidApiResponse } from '@/types/bid';

// GET /api/bids - list all bids
export async function GET(req: NextRequest): Promise<NextResponse<BidApiResponse<any[] | null>>> {
  try {
    const allBids = await dbBid.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role', 'image'] }],
    });
    return NextResponse.json({ success: true, message: 'Bids fetched successfully.', data: allBids });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unexpected error occurred.', data: null }, { status: 500 });
  }
}

// POST /api/bids - create a new bid
export async function POST(req: NextRequest): Promise<NextResponse<BidApiResponse<any | null>>> {
  try {
    let body: BidPayload;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid JSON body.', data: null }, { status: 400 });
    }
    const { projectId, amount, deliveryTime, message } = body;

    // Extract userId from token in cookies
    const cookie = req.headers.get('cookie');
    let userId: number | undefined;
    if (cookie) {
      const tokenMatch = cookie.match(/token=([^;]+)/);
      if (tokenMatch) {
        try {
          const token = tokenMatch[1];
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          userId = payload.id;
        } catch (e) {
          return NextResponse.json({ success: false, message: 'Invalid token.', data: null }, { status: 401 });
        }
      }
    }
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User not authenticated.', data: null }, { status: 401 });
    }
    if (!projectId || !amount || !deliveryTime) {
      return NextResponse.json({ success: false, message: 'Missing required fields.', data: null }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount value.', data: null }, { status: 400 });
    }
    if (typeof deliveryTime !== 'number' || deliveryTime <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid delivery time.', data: null }, { status: 400 });
    }
    if (message !== undefined && typeof message !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid message value.', data: null }, { status: 400 });
    }
    const newBid = await dbBid.create({
      projectId,
      userId,
      amount,
      deliveryTime,
      message,
      status: 'pending',
    });
    return NextResponse.json({ success: true, message: 'Bid created successfully.', data: newBid });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Unexpected error occurred.', data: null }, { status: 500 });
  }
}
