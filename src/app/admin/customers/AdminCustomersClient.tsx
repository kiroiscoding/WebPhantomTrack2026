"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type CustomerRow = {
  customer_email: string;
  orders_count: number;
  revenue_cents: number;
  last_order_at: string | null;
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function AdminCustomersClient() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CustomerRow[]>([]);

  async function load(query: string) {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(window.location.origin + "/api/admin/customers");
      if (query.trim()) url.searchParams.set("q", query.trim());
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { customers: CustomerRow[] };
      setRows(json.customers ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("");
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-primary">CRM</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tighter">Customers</h1>
        <p className="mt-3 text-white/50 max-w-2xl">
          Customer list derived from orders (email-based). Search, revenue, and recency.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative max-w-[520px] w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") load(q);
            }}
            placeholder="Search email…"
            className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
          />
        </div>
        <button
          type="button"
          onClick={() => load(q)}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white hover:bg-white/10 transition-colors"
        >
          {loading ? "Loading…" : "Search"}
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="text-xs font-mono uppercase tracking-wider text-white/40">Customers</div>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map((c) => (
            <div key={c.customer_email} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-white font-semibold truncate">{c.customer_email}</div>
                <div className="mt-1 text-white/40 text-xs font-mono uppercase tracking-wider">
                  {c.orders_count} orders · last:{" "}
                  {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : "—"}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-white font-mono">{money(c.revenue_cents)}</div>
                <div className="mt-1 text-white/40 text-xs">
                  <Link href={`/admin/orders?q=${encodeURIComponent(c.customer_email)}`} className="text-primary hover:underline">
                    view orders
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {!loading && rows.length === 0 ? (
            <div className="px-6 py-10 text-white/50">No customers found.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

