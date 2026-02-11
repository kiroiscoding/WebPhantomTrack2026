"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatOrderRef } from "@/lib/orderRef";

type Address = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

type StripeSessionLite = {
  id?: string;
  currency?: string | null;
  amount_total?: number | null;
  payment_status?: string | null;
  shipping_details?: { name?: string | null; address?: Address | null } | null;
  customer_details?: { name?: string | null; email?: string | null; phone?: string | null; address?: Address | null } | null;
};

type StripeLineItemLite = { description?: string | null; quantity?: number | null; amount_total?: number | null };

type OrderRow = {
  id?: string;
  created_at?: string;
  status?: string | null;
  shipping_address?: Address | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  tracking_url?: string | null;
  fulfillment_status?: string | null;
};

type OrderDetails = {
  order: OrderRow | null;
  stripe: {
    session: StripeSessionLite | null;
    lineItems: { data: StripeLineItemLite[] } | null;
  };
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [userReady, setUserReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [data, setData] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [trackingSaving, setTrackingSaving] = useState(false);
  const [labelCreating, setLabelCreating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      setUserReady(true);
    });
  }, [supabase]);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((j) => setIsAdmin(!!j?.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error(await res.text());
        const json = (await res.json()) as OrderDetails;
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load order");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!userReady) return null;
  if (!signedIn) {
    return (
      <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10 md:p-14">
            <div className="text-white/70">Please sign in to view this order.</div>
            <div className="mt-8">
              <Link
                href="/account"
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors"
              >
                GO TO ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const order = data?.order;
  const session = data?.stripe?.session;
  const lineItems = data?.stripe?.lineItems?.data ?? [];

  const shipping = session?.shipping_details ?? null;
  const customer = session?.customer_details ?? null;
  const displayAddress = shipping?.address ?? customer?.address ?? order?.shipping_address ?? null;

  async function saveTracking() {
    setTrackingSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}/tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          tracking_url: trackingUrl,
          fulfillment_status: "shipped",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Reload details
      const r2 = await fetch(`/api/orders/${id}`);
      if (r2.ok) setData((await r2.json()) as OrderDetails);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save tracking");
    } finally {
      setTrackingSaving(false);
    }
  }

  async function createShippoLabel() {
    setLabelCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/shippo/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      if (!res.ok) throw new Error(await res.text());
      const r2 = await fetch(`/api/orders/${id}`);
      if (r2.ok) setData((await r2.json()) as OrderDetails);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create label");
    } finally {
      setLabelCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[#050505]/70 hover:text-[#050505] transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Account
          </Link>
        </div>

        <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10 md:p-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-primary font-mono uppercase tracking-wider text-sm">Order</div>
              <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tighter">
                {formatOrderRef(order?.id ?? session?.id ?? null)}
              </h1>
              <div className="mt-4 text-white/50 text-sm">
                Status: <span className="text-white/80">{session?.payment_status ?? order?.status ?? "paid"}</span>
              </div>
            </div>

            <div className="text-right text-white/50 text-sm">
              {order?.created_at ? new Date(order.created_at).toLocaleString() : null}
            </div>
          </div>

          {loading ? (
            <div className="mt-10 text-white/60">Loading…</div>
          ) : error ? (
            <div className="mt-10 text-red-300">{error}</div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Items */}
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 text-white/70 font-mono uppercase tracking-wider text-xs">
                  <Package className="h-4 w-4" />
                  Items
                </div>
                <div className="mt-4 space-y-3">
                  {lineItems.length === 0 ? (
                    <div className="text-white/60">No items found.</div>
                  ) : (
                    lineItems.map((li, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="min-w-0">
                          <div className="text-white font-semibold truncate">{li.description ?? "Item"}</div>
                          <div className="mt-1 text-white/50 text-sm">Qty: {li.quantity ?? 1}</div>
                        </div>
                        <div className="text-white/80 font-mono">
                          {li.amount_total != null && session?.currency
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: session.currency.toUpperCase(),
                              }).format(li.amount_total / 100)
                            : "—"}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between text-white/70">
                  <span>Total</span>
                  <span className="text-white font-mono">
                    {session?.amount_total != null && session?.currency
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: session.currency.toUpperCase(),
                        }).format(session.amount_total / 100)
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 text-white/70 font-mono uppercase tracking-wider text-xs">
                  <Truck className="h-4 w-4" />
                  Shipping
                </div>

                <div className="mt-4 space-y-4 text-white/70">
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Recipient</div>
                    <div className="mt-1 text-white/80">{shipping?.name ?? customer?.name ?? "—"}</div>
                    {customer?.email ? <div className="text-white/50 text-sm">{customer.email}</div> : null}
                  </div>

                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Address</div>
                    <div className="mt-1 text-white/80 text-sm">
                      {displayAddress ? (
                        <>
                          <div>{displayAddress.line1}</div>
                          {displayAddress.line2 ? <div>{displayAddress.line2}</div> : null}
                          <div>
                            {displayAddress.city}, {displayAddress.state} {displayAddress.postal_code}
                          </div>
                          <div>{displayAddress.country}</div>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Tracking</div>
                    <div className="mt-1 text-white/80 text-sm">
                      {order?.tracking_number ? (
                        <>
                          <div>
                            {order.tracking_carrier ? `${order.tracking_carrier}: ` : ""}
                            {order.tracking_number}
                          </div>
                          {order.tracking_url ? (
                            <a className="text-primary underline" href={order.tracking_url} target="_blank" rel="noreferrer">
                              Track package
                            </a>
                          ) : null}
                        </>
                      ) : (
                        "Not shipped yet."
                      )}
                    </div>
                  </div>

                  {isAdmin ? (
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Admin: fulfillment</div>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <button
                          type="button"
                          disabled={labelCreating}
                          onClick={createShippoLabel}
                          className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-60"
                        >
                          {labelCreating ? "CREATING LABEL…" : "CREATE SHIPPO LABEL"}
                        </button>
                        <div className="text-white/30 text-xs">
                          Requires: `SHIPPO_API_TOKEN`, `SHIPPO_FROM_ADDRESS_JSON`, `SHIPPO_PARCEL_JSON` (see `SUPABASE_SETUP.md` section 9).
                        </div>

                        <input
                          value={trackingCarrier}
                          onChange={(e) => setTrackingCarrier(e.target.value)}
                          placeholder="Carrier (e.g. UPS)"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                        <input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Tracking number"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                        <input
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          placeholder="Tracking URL (optional)"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                        <button
                          type="button"
                          disabled={trackingSaving}
                          onClick={saveTracking}
                          className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-60"
                        >
                          {trackingSaving ? "SAVING…" : "SAVE TRACKING"}
                        </button>
                        <div className="text-white/30 text-xs">
                          Add `ADMIN_EMAILS=you@domain.com` to `.env.local` to enable admin controls.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

