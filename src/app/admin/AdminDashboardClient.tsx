"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

type Stats = {
  kpis: {
    orders_today: number;
    revenue_today_cents: number;
    orders_7d: number;
    revenue_7d_cents: number;
    pending_fulfillment: number;
    needs_label: number;
  };
  recentOrders: Array<{
    id: string;
    created_at: string;
    customer_email: string | null;
    amount_total_cents: number | null;
    currency: string | null;
    status: string | null;
    fulfillment_status: string | null;
    label_url: string | null;
    tracking_number: string | null;
  }>;
};

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-mono uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</div>
      {hint ? <div className="mt-2 text-sm text-white/40">{hint}</div> : null}
    </div>
  );
}

export function AdminDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Stats | null>(null);

  const currency = useMemo(() => {
    const first = data?.recentOrders?.find((o) => o.currency)?.currency;
    return (first || "usd").toLowerCase();
  }, [data]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      setData((await res.json()) as Stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admin stats");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-primary">Admin</div>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tighter">Dashboard</h1>
          <p className="mt-3 text-white/50 max-w-2xl">
            High-signal operational view: revenue, orders, fulfillment, and what needs attention.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white hover:bg-white/10 transition-colors"
          >
            View orders <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Orders today" value={loading ? "—" : data?.kpis.orders_today ?? 0} />
        <KpiCard
          label="Revenue today"
          value={loading ? "—" : money(data?.kpis.revenue_today_cents ?? 0, currency)}
        />
        <KpiCard label="Pending fulfillment" value={loading ? "—" : data?.kpis.pending_fulfillment ?? 0} />
        <KpiCard label="Orders (7d)" value={loading ? "—" : data?.kpis.orders_7d ?? 0} />
        <KpiCard
          label="Revenue (7d)"
          value={loading ? "—" : money(data?.kpis.revenue_7d_cents ?? 0, currency)}
        />
        <KpiCard label="Needs label" value={loading ? "—" : data?.kpis.needs_label ?? 0} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/40">Recent orders</div>
            <div className="mt-1 text-white/70 text-sm">Latest activity for quick triage.</div>
          </div>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            Open orders
          </Link>
        </div>

        <div className="divide-y divide-white/10">
          {(data?.recentOrders ?? []).slice(0, 10).map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="block px-6 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">{o.customer_email ?? "—"}</div>
                  <div className="mt-1 text-white/40 text-xs font-mono uppercase tracking-wider">
                    {o.status ?? "paid"} · {o.fulfillment_status ?? "unfulfilled"}
                  </div>
                  <div className="mt-1 text-white/30 text-xs">
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-mono">
                    {o.amount_total_cents != null && o.currency
                      ? money(o.amount_total_cents, o.currency)
                      : "—"}
                  </div>
                  <div className="mt-1 text-xs text-white/40">
                    {o.tracking_number ? "tracking set" : o.label_url ? "label ready" : "no label"}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {!loading && (data?.recentOrders?.length ?? 0) === 0 ? (
            <div className="px-6 py-8 text-white/50">No orders yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

