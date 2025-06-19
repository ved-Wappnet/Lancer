import Stripe from 'stripe';
import Payment from '@/models/Payment';
import { stripe } from '@/app/api/payments/checkout-session';


export async function handleStripeWebhook({
  buf,
  sig
}: {
  buf: ArrayBuffer;
  sig: string | null;
}) {
  const bufNode = Buffer.from(new Uint8Array(buf));
  if (!sig) {
    console.error('No stripe-signature header present!');
    return { error: 'Missing stripe-signature header', status: 400 };
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      bufNode,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log('Stripe event received:', event.type);
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message);
    return { error: `Webhook Error: ${err.message}`, status: 400 };
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const contractId = session.metadata?.contractId;
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || 'usd';
    const stripeSessionId = session.id;
    const status = 'succeeded';
    const clientEmail = session.customer_email;

    if (contractId && amount) {
      await Payment.create({
        contractId: Number(contractId),
        amount,
        currency,
        status,
        stripeSessionId,
        stripePaymentIntentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
      });
      // Update contract status to 'active' after successful payment
      try {
        const Contract = (await import('@/models/Contract')).default;
        await Contract.update(
          { status: 'payment_success' },
          { where: { id: Number(contractId) } }
        );
        console.log(`Contract ${contractId} status updated to payment_success.`);
      } catch (err) {
        console.error('Failed to update contract status:', err);
      }
    }
  }
  return { status: 200 };
}
