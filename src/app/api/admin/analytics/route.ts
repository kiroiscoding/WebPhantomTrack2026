import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

type OrderRow = { created_at: string; amount_total_cents: number | null };

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
    const start30d = isoStartOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));

    const { data: orders, error } = await admin
      .from("orders")
      .select("created_at, amount_total_cents")
      .gte("created_at", start30d)
      .order("created_at", { ascending: true })
      .limit(10000);
    if (error) return new NextResponse(error.message, { status: 500 });

    const byDate = new Map<string, { date: string; orders: number; revenue_cents: number }>();
    for (const o of (orders ?? []) as unknown as OrderRow[]) {
      const createdAt = o.created_at;
      const date = createdAt.slice(0, 10);
      const cents = Number(o.amount_total_cents ?? 0) || 0;
      const row = byDate.get(date) || { date, orders: 0, revenue_cents: 0 };
      row.orders += 1;
      row.revenue_cents += cents;
      byDate.set(date, row);
    }

    // Ensure continuity for last 30 days (including empty days).
    const series: Array<{ date: string; orders: number; revenue_cents: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const date = isoStartOfDay(d).slice(0, 10);
      series.push(byDate.get(date) || { date, orders: 0, revenue_cents: 0 });
    }

    return NextResponse.json({ series });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load analytics";
    return new NextResponse(message, { status: 500 });
  }
}

