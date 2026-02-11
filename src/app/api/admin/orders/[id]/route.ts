import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userHasAdminAccess(user)) return new NextResponse("Forbidden", { status: 403 });

    const { id } = await context.params;
    const admin = createSupabaseAdminClient();

    const { data: order, error } = await admin
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return new NextResponse(error.message, { status: 500 });
    if (!order) return new NextResponse("Order not found", { status: 404 });

    let stripeSession: Stripe.Checkout.Session | null = null;
    let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;
    if (order.stripe_session_id) {
      stripeSession = await stripe.checkout.sessions.retrieve(order.stripe_session_id, {
        expand: ["payment_intent", "customer", "shipping_cost"],
      });
      lineItems = await stripe.checkout.sessions.listLineItems(order.stripe_session_id, { limit: 100 });
    }

    return NextResponse.json({ order, stripe: { session: stripeSession, lineItems } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load order";
    return new NextResponse(message, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userHasAdminAccess(user)) return new NextResponse("Forbidden", { status: 403 });

    const { id } = await context.params;
    const body = (await request.json()) as {
      shipping_name?: string | null;
      shipping_phone?: string | null;
      shipping_address?: unknown;
    };

    const patch: Record<string, unknown> = {};
    if (typeof body.shipping_name === "string" || body.shipping_name === null) patch.shipping_name = body.shipping_name;
    if (typeof body.shipping_phone === "string" || body.shipping_phone === null) patch.shipping_phone = body.shipping_phone;
    if (typeof body.shipping_address !== "undefined") patch.shipping_address = body.shipping_address;

    if (Object.keys(patch).length === 0) return new NextResponse("No fields to update", { status: 400 });

    const admin = createSupabaseAdminClient();
    const updated = await admin.from("orders").update(patch).eq("id", id).select("*").maybeSingle();
    if (updated.error) return new NextResponse(updated.error.message, { status: 500 });
    if (!updated.data) return new NextResponse("Order not found", { status: 404 });

    return NextResponse.json({ ok: true, order: updated.data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update order";
    return new NextResponse(message, { status: 500 });
  }
}

