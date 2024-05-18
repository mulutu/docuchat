import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
    );
  } catch (error) {
    return new NextResponse("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // new subscription created
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    if (!session?.metadata?.userId) {
      return new NextResponse("no userid", { status: 400 });
    }
    const { data, error } = await db.from('userSubscriptions').insert({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });

    if (error) {
      console.log("Error creating subscription. ", error)
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const { data, error } = await db
      .from('userSubscriptions')
      .update({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      })
      .eq('stripeSubscriptionId', subscription.id);

    if (error) {
      console.log("Error updating subscription. ", error)
    }
  }

  return new NextResponse(null, { status: 200 });
}
