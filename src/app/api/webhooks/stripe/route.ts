import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import supabase from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const sig = (await headersList).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Payment successful. Session:', session);

      const clerkId = session.metadata?.clerkId;
      if (!clerkId) {
        console.error('❌ clerkId not found in session metadata.');
        break;
      }

      const { data, error } = await supabase
        .from('User')
        .update({ plan: 'Pro' })
        .eq('clerkId', clerkId);

      if (error) {
        console.error('❌ Supabase update error:', error);
      } else {
        console.log('✅ User upgraded to Pro:');
      }

      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('✅ Subscription payment succeeded:', invoice);
      break;
    }

    case 'invoice.payment_failed': {
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log('⚠️ Subscription payment failed:', failedInvoice);
      break;
    }

    case 'customer.subscription.deleted': {
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log('❌ Subscription canceled:', deletedSubscription);
      // Optional: downgrade user in Supabase here
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
