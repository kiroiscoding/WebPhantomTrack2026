import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

type OrderRow = {
  user_id: string;
  stripe_session_id?: string | null;
  [key: string]: unknown;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
    }

    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });

    // Read order row via RLS (must belong to this user).
    // We try to include optional shipping/tracking columns if the DB has them,
    // but fall back gracefully if your table hasn't been migrated yet.
    const extendedSelect =
      "id, user_id, stripe_session_id, stripe_customer_id, amount_total_cents, currency, status, created_at, shipping_name, shipping_phone, shipping_address, tracking_number, tracking_carrier, tracking_url, fulfillment_status";
    const baseSelect =
      "id, user_id, stripe_session_id, stripe_customer_id, amount_total_cents, currency, status, created_at";

    let order: OrderRow | null = null;
    const tryExtended = await supabase.from("orders").select(extendedSelect).eq("id", id).maybeSingle();
    if (tryExtended.error) {
      const tryBase = await supabase.from("orders").select(baseSelect).eq("id", id).maybeSingle();
      if (tryBase.error) return new NextResponse(tryBase.error.message, { status: 500 });
      order = tryBase.data as unknown as OrderRow | null;
    } else {
      order = tryExtended.data as unknown as OrderRow | null;
    }

    if (!order) return new NextResponse("Order not found", { status: 404 });
    if (order.user_id !== user.id) return new NextResponse("Forbidden", { status: 403 });

    let stripeSession: Stripe.Checkout.Session | null = null;
    let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;

    if (order.stripe_session_id) {
      stripeSession = await stripe.checkout.sessions.retrieve(order.stripe_session_id, {
        expand: ["payment_intent", "customer", "shipping_cost"],
      });
      lineItems = await stripe.checkout.sessions.listLineItems(order.stripe_session_id, { limit: 100 });
    }

    return NextResponse.json({
      order,
      stripe: {
        session: stripeSession,
        lineItems,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load order";
    return new NextResponse(message, { status: 500 });
  }
}

