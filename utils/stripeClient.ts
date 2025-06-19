import { loadStripe } from '@stripe/stripe-js';

// This will be used to initialize Stripe.js in the browser
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
