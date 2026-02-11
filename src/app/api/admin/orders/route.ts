import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userHasAdminAccess(user)) return new NextResponse("Forbidden", { status: 403 });

    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();

    const admin = createSupabaseAdminClient();

    let query = admin
      .from("orders")
      .select(
        "id, created_at, user_id, customer_email, amount_total_cents, currency, status, stripe_session_id, tracking_number, tracking_carrier, tracking_url, label_url, fulfillment_status, tracking_status, shipping_name, shipping_address"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    // Search by customer_email, tracking number, or Stripe session id.
    if (q) {
      query = query.or(
        `customer_email.ilike.%${q}%,tracking_number.ilike.%${q}%,stripe_session_id.ilike.%${q}%`
      );
    }

    const { data: orders, error } = await query;
    if (error) return new NextResponse(error.message, { status: 500 });

    return NextResponse.json({ orders: orders ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load orders";
    return new NextResponse(message, { status: 500 });
  }
}

