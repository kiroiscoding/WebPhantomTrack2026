import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

type OrderRow = { customer_email: string | null; amount_total_cents: number | null; created_at: string };

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
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();

    const admin = createSupabaseAdminClient();

    let query = admin
      .from("orders")
      .select("customer_email, amount_total_cents, created_at")
      .not("customer_email", "is", null)
      .order("created_at", { ascending: false })
      .limit(10000);

    if (q) query = query.ilike("customer_email", `%${q}%`);

    const { data: orders, error } = await query;
    if (error) return new NextResponse(error.message, { status: 500 });

    const byEmail = new Map<
      string,
      { customer_email: string; orders_count: number; revenue_cents: number; last_order_at: string | null }
    >();

    for (const o of (orders ?? []) as unknown as OrderRow[]) {
      const email = String(o.customer_email ?? "").trim().toLowerCase();
      if (!email) continue;
      const cents = Number(o.amount_total_cents ?? 0) || 0;
      const createdAt = o.created_at ?? null;

      let row = byEmail.get(email);
      if (!row) {
        row = { customer_email: email, orders_count: 0, revenue_cents: 0, last_order_at: null };
        byEmail.set(email, row);
      }

      row.orders_count += 1;
      row.revenue_cents += cents;
      if (!row.last_order_at || (createdAt && createdAt > row.last_order_at)) row.last_order_at = createdAt;
    }

    const customers = Array.from(byEmail.values()).sort((a, b) => b.revenue_cents - a.revenue_cents);
    return NextResponse.json({ customers });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load customers";
    return new NextResponse(message, { status: 500 });
  }
}

