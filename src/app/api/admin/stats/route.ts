import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

type Last30Row = {
  created_at: string;
  amount_total_cents: number | null;
  currency: string | null;
  fulfillment_status: string | null;
  label_url: string | null;
  tracking_number: string | null;
};

function isoStartOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString();
}

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userHasAdminAccess(user)) return new NextResponse("Forbidden", { status: 403 });

    const admin = createSupabaseAdminClient();

    const now = new Date();
    const startToday = isoStartOfDay(now);
    const start7d = isoStartOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
    const start30d = isoStartOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));

    const { data: recentOrders, error: recentErr } = await admin
      .from("orders")
      .select(
        "id, created_at, customer_email, amount_total_cents, currency, status, fulfillment_status, label_url, tracking_number"
      )
      .order("created_at", { ascending: false })
      .limit(12);
    if (recentErr) return new NextResponse(recentErr.message, { status: 500 });

    const { data: last30, error: last30Err } = await admin
      .from("orders")
      .select("created_at, amount_total_cents, currency, fulfillment_status, label_url, tracking_number")
      .gte("created_at", start30d)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (last30Err) return new NextResponse(last30Err.message, { status: 500 });

    let ordersToday = 0;
    let revenueToday = 0;
    let orders7d = 0;
    let revenue7d = 0;
    let pendingFulfillment = 0;
    let needsLabel = 0;

    for (const o of (last30 ?? []) as unknown as Last30Row[]) {
      const createdAt = o.created_at;

      const cents = Number(o.amount_total_cents ?? 0) || 0;
      const fulfillment = o.fulfillment_status ?? null;
      const labelUrl = o.label_url ?? null;
      const trackingNumber = o.tracking_number ?? null;

      if (createdAt >= startToday) {
        ordersToday += 1;
        revenueToday += cents;
      }
      if (createdAt >= start7d) {
        orders7d += 1;
        revenue7d += cents;
      }

      const shipped = fulfillment?.toLowerCase() === "shipped";
      if (!shipped) {
        pendingFulfillment += 1;
        if (!labelUrl && !trackingNumber) needsLabel += 1;
      }
    }

    return NextResponse.json({
      kpis: {
        orders_today: ordersToday,
        revenue_today_cents: revenueToday,
        orders_7d: orders7d,
        revenue_7d_cents: revenue7d,
        pending_fulfillment: pendingFulfillment,
        needs_label: needsLabel,
      },
      recentOrders: recentOrders ?? [],
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load admin stats";
    return new NextResponse(message, { status: 500 });
  }
}

