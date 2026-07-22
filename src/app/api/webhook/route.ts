import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { recordOrderFromSession, type CheckoutSessionWithShipping } from "@/lib/orders";

export const runtime = "nodejs";

const stripe = getStripe();

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 400 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // The webhook is the source of truth for fulfillment. It records the order
    // (including guest checkouts) and sends the confirmation email. This runs
    // regardless of whether the buyer was signed in, so `stripe trigger` and
    // guest orders both work.
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as CheckoutSessionWithShipping;
      const admin = createSupabaseAdminClient();

      await recordOrderFromSession({
        stripe,
        admin,
        session,
        userId: session.client_reference_id || null,
        source: "webhook",
      });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    return new NextResponse(message, { status: 400 });
  }
}
