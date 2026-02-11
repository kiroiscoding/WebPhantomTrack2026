"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type AdminOrder = {
  id: string;
  created_at: string;
  customer_email?: string | null;
  amount_total_cents?: number | null;
  currency?: string | null;
  status?: string | null;
  stripe_session_id?: string | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  tracking_url?: string | null;
  label_url?: string | null;
  fulfillment_status?: string | null;
  tracking_status?: string | null;
  shipping_name?: string | null;
  shipping_address?: unknown;
};

function money(cents?: number | null, currency?: string | null) {
  if (!cents || !currency) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export function AdminOrdersClient() {
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});
  const [rowError, setRowError] = useState<Record<string, string | null>>({});

  const load = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders${search ? `?q=${encodeURIComponent(search)}` : ""}`);
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { orders: AdminOrder[] };
      setOrders(json.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  async function createLabel(orderId: string) {
    setRowLoading((m) => ({ ...m, [orderId]: true }));
    setRowError((m) => ({ ...m, [orderId]: null }));
    try {
      const res = await fetch("/api/shippo/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load(q.trim());
    } catch (e) {
      setRowError((m) => ({ ...m, [orderId]: e instanceof Error ? e.message : "Failed to create label" }));
    } finally {
      setRowLoading((m) => ({ ...m, [orderId]: false }));
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10">
          <h1 className="text-[8vw] md:text-[5vw] leading-[0.85] font-bold tracking-tighter text-[#050505]">
            ORDERS<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-[#050505]/70 text-lg md:text-xl max-w-2xl font-medium">
            Search by customer email, tracking number, or Stripe session id.
          </p>
        </div>

        <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-6 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(q.trim());
            }}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="kirocodes@gmail.com"
                className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-white text-black px-8 py-3 font-bold tracking-widest hover:bg-gray-200 transition-colors"
            >
              SEARCH
            </button>
            <button
              type="button"
              onClick={() => {
                setQ("");
                load("");
              }}
              className="rounded-full border border-white/20 text-white px-8 py-3 font-bold tracking-widest hover:bg-white/10 transition-colors"
            >
              RESET
            </button>
          </form>

          {error ? <div className="mt-6 text-red-300">{error}</div> : null}

          <div className="mt-8 space-y-3">
            {loading ? (
              <div className="text-white/60">Loading…</div>
            ) : orders.length === 0 ? (
              <div className="text-white/60">No orders found.</div>
            ) : (
              orders.map((o) => {
                const busy = !!rowLoading[o.id];
                const hasAddress = Boolean(o.shipping_address);
                return (
                  <div
                    key={o.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-white font-semibold">
                            {money(o.amount_total_cents, o.currency)}{" "}
                            <span className="text-white/40 font-mono text-xs uppercase tracking-wider">
                              {o.status ?? "paid"}
                            </span>
                          </div>
                          <span className={`text-xs font-mono uppercase tracking-wider ${hasAddress ? "text-green-300/80" : "text-red-300/80"}`}>
                            {hasAddress ? "address ok" : "no address"}
                          </span>
                          {o.label_url ? (
                            <span className="text-xs font-mono uppercase tracking-wider text-primary/90">label ready</span>
                          ) : null}
                        </div>

                        <div className="mt-2 text-white/50 text-sm break-all">
                          {o.customer_email ?? "—"}
                        </div>
                        <div className="mt-2 text-white/30 text-xs font-mono break-all">
                          {o.stripe_session_id ?? ""}
                        </div>
                        <div className="mt-3 text-white/60 text-sm">
                          Tracking:{" "}
                          {o.tracking_number ? (
                            <span className="text-white/80 break-all">
                              {o.tracking_carrier ? `${o.tracking_carrier}: ` : ""}
                              {o.tracking_number}
                            </span>
                          ) : (
                            "—"
                          )}
                          {o.tracking_number ? (
                            <button
                              type="button"
                              onClick={() => copy(o.tracking_number!)}
                              className="ml-3 text-white/60 hover:text-white underline text-xs"
                            >
                              Copy
                            </button>
                          ) : null}
                          {o.tracking_url ? (
                            <a
                              className="ml-3 text-primary underline text-xs"
                              href={o.tracking_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </a>
                          ) : null}
                        </div>

                        {rowError[o.id] ? (
                          <div className="mt-3 text-red-300 text-sm whitespace-pre-wrap">{rowError[o.id]}</div>
                        ) : null}
                      </div>

                      <div className="md:text-right text-white/50 text-xs flex md:flex-col gap-2 md:gap-3 items-center md:items-end">
                        <div>{new Date(o.created_at).toLocaleDateString()}</div>
                        <div>{o.fulfillment_status ? `Fulfillment: ${o.fulfillment_status}` : ""}</div>
                        <div>{o.tracking_status ? `Tracking: ${o.tracking_status}` : ""}</div>

                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="rounded-full border border-white/20 text-white px-4 py-2 font-bold tracking-widest text-xs hover:bg-white/10 transition-colors"
                          >
                            OPEN
                          </Link>

                          {o.label_url ? (
                            <a
                              className="rounded-full bg-white text-black px-4 py-2 font-bold tracking-widest text-xs hover:bg-gray-200 transition-colors"
                              href={o.label_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              LABEL PDF
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => createLabel(o.id)}
                              className="rounded-full bg-white text-black px-4 py-2 font-bold tracking-widest text-xs hover:bg-gray-200 transition-colors disabled:opacity-60"
                              title={!hasAddress ? "No address saved yet (open order to override/save address)" : "Create Shippo label"}
                            >
                              {busy ? "CREATING…" : "CREATE LABEL"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

