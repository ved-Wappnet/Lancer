import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/controllers/webhookController';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  const result = await handleStripeWebhook({ buf, sig });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return new Response('ok', { status: result.status });
}
