import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { contractId, amount, clientEmail } = await req.json();
    if (!contractId || !amount || !clientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Stripe expects amount in cents (integer)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Contract Payment #${contractId}`,
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        contractId: contractId.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/client/contracts?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/client/contracts?payment=cancel`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Unable to create Stripe session' }, { status: 500 });
  }
}
