"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { formatOrderRef } from "@/lib/orderRef";

type Address = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

type OrderRow = {
  id?: string;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  tracking_url?: string | null;
  label_url?: string | null;
  tracking_status?: string | null;
  fulfillment_status?: string | null;
  shipping_name?: string | null;
  shipping_phone?: string | null;
  shipping_address?: Address | null;
};

type StripeSessionLite = {
  currency?: string | null;
  shipping_details?: { name?: string | null; address?: Address | null } | null;
  customer_details?: { name?: string | null; email?: string | null; address?: Address | null } | null;
};

type StripeLineItemLite = {
  description?: string | null;
  quantity?: number | null;
  amount_total?: number | null;
};

type AdminOrderDetails = {
  order: OrderRow;
  stripe: {
    session: StripeSessionLite | null;
    lineItems: { data: StripeLineItemLite[] } | null;
  };
};

export function AdminOrderDetailClient() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<AdminOrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [labelCreating, setLabelCreating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [trackingSaving, setTrackingSaving] = useState(false);

  const [shipName, setShipName] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [shipLine1, setShipLine1] = useState("");
  const [shipLine2, setShipLine2] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("");
  const [shipPostal, setShipPostal] = useState("");
  const [shipCountry, setShipCountry] = useState("US");
  const [shipSaving, setShipSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) throw new Error(await res.text());
      setData((await res.json()) as AdminOrderDetails);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  // Prefill inputs from saved values (so admins can edit instead of retyping).
  useEffect(() => {
    const o = data?.order;
    if (!o) return;
    if (!trackingCarrier && o.tracking_carrier) setTrackingCarrier(o.tracking_carrier);
    if (!trackingNumber && o.tracking_number) setTrackingNumber(o.tracking_number);
    if (!trackingUrl && o.tracking_url) setTrackingUrl(o.tracking_url);
  }, [data?.order, trackingCarrier, trackingNumber, trackingUrl]);

  // Prefill shipping override inputs from saved order shipping fields.
  useEffect(() => {
    const o = data?.order;
    if (!o) return;
    if (!shipName && o.shipping_name) setShipName(o.shipping_name);
    if (!shipPhone && o.shipping_phone) setShipPhone(o.shipping_phone);
    const a = o.shipping_address;
    if (!a) return;
    if (!shipLine1 && a.line1) setShipLine1(a.line1);
    if (!shipLine2 && a.line2) setShipLine2(a.line2);
    if (!shipCity && a.city) setShipCity(a.city);
    if (!shipState && a.state) setShipState(a.state);
    if (!shipPostal && a.postal_code) setShipPostal(a.postal_code);
    if (a.country && shipCountry === "US") setShipCountry(a.country);
  }, [data?.order, shipCity, shipCountry, shipLine1, shipLine2, shipName, shipPhone, shipPostal, shipState]);

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
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create label");
    } finally {
      setLabelCreating(false);
    }
  }

  async function saveTracking() {
    setTrackingSaving(true);
    setError(null);
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
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save tracking");
    } finally {
      setTrackingSaving(false);
    }
  }

  async function saveShippingOverride() {
    setShipSaving(true);
    setError(null);
    try {
      const shipping_address =
        shipLine1 || shipCity || shipState || shipPostal || shipCountry || shipLine2
          ? {
            line1: shipLine1 || null,
            line2: shipLine2 || null,
            city: shipCity || null,
            state: shipState || null,
            postal_code: shipPostal || null,
            country: shipCountry || null,
          }
          : null;

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping_name: shipName || null,
          shipping_phone: shipPhone || null,
          shipping_address,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save shipping address");
    } finally {
      setShipSaving(false);
    }
  }

  const order = data?.order;
  const session = data?.stripe?.session;
  const lineItems = data?.stripe?.lineItems?.data ?? [];

  const shipping = session?.shipping_details ?? null;
  const customer = session?.customer_details ?? null;
  const displayAddress = shipping?.address ?? customer?.address ?? order?.shipping_address ?? null;
  const addrDebug = {
    stripe_shipping: Boolean(shipping?.address),
    stripe_billing: Boolean(customer?.address),
    order_saved: Boolean(order?.shipping_address),
  };

  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-[#050505]/70 hover:text-[#050505] transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Orders
          </Link>
        </div>

        <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10 md:p-14">
          <div className="text-primary font-mono uppercase tracking-wider text-sm">Admin Order</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tighter break-all">
            {formatOrderRef(order?.id ?? id)}
          </h1>

          {error ? <div className="mt-6 text-red-300">{error}</div> : null}
          {loading ? (
            <div className="mt-10 text-white/60">Loading…</div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 text-white/70 font-mono uppercase tracking-wider text-xs">
                  <Package className="h-4 w-4" />
                  Items
                </div>
                <div className="mt-4 space-y-3">
                  {lineItems.length === 0 ? (
                    <div className="text-white/60">No items found.</div>
                  ) : (
                    lineItems.map((li, idx: number) => (
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
              </div>

              <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-2 text-white/70 font-mono uppercase tracking-wider text-xs">
                  <Truck className="h-4 w-4" />
                  Shipping / Fulfillment
                </div>

                <div className="mt-4 space-y-4 text-white/70">
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Customer</div>
                    <div className="mt-1 text-white/80">{customer?.name ?? shipping?.name ?? "—"}</div>
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
                    <div className="mt-2 text-white/30 text-xs font-mono">
                      Sources — stripe_shipping:{addrDebug.stripe_shipping ? "yes" : "no"} • stripe_billing:
                      {addrDebug.stripe_billing ? "yes" : "no"} • order_saved:{addrDebug.order_saved ? "yes" : "no"}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">
                      Override shipping address (for Shippo)
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <input
                        value={shipName}
                        onChange={(e) => setShipName(e.target.value)}
                        placeholder="Full name"
                        className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                      />
                      <input
                        value={shipPhone}
                        onChange={(e) => setShipPhone(e.target.value)}
                        placeholder="Phone (optional)"
                        className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                      />
                      <input
                        value={shipLine1}
                        onChange={(e) => setShipLine1(e.target.value)}
                        placeholder="Address line 1"
                        className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                      />
                      <input
                        value={shipLine2}
                        onChange={(e) => setShipLine2(e.target.value)}
                        placeholder="Address line 2 (optional)"
                        className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          value={shipCity}
                          onChange={(e) => setShipCity(e.target.value)}
                          placeholder="City"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                        <input
                          value={shipState}
                          onChange={(e) => setShipState(e.target.value)}
                          placeholder="State"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          value={shipPostal}
                          onChange={(e) => setShipPostal(e.target.value)}
                          placeholder="ZIP / Postal code"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                        <input
                          value={shipCountry}
                          onChange={(e) => setShipCountry(e.target.value)}
                          placeholder="Country (e.g. US)"
                          className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={saveShippingOverride}
                        disabled={shipSaving}
                        className="w-full rounded-2xl bg-white text-black font-bold py-3 hover:bg-gray-200 transition-colors disabled:opacity-60"
                      >
                        {shipSaving ? "Saving…" : "Save shipping address"}
                      </button>
                      <div className="text-white/30 text-xs">
                        Required for Shippo: line1, city, state, postal code, country.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Current fulfillment</div>
                    <div className="mt-2 text-white/80 text-sm">
                      <div>
                        Status:{" "}
                        <span className="text-white/70">
                          {order?.fulfillment_status ?? "processing"}
                        </span>
                        {order?.tracking_status ? (
                          <span className="text-white/30"> • {order.tracking_status}</span>
                        ) : null}
                      </div>
                      <div className="mt-2">
                        Tracking:{" "}
                        {order?.tracking_number ? (
                          <span className="text-white/70 break-all">
                            {order?.tracking_carrier ? `${order.tracking_carrier}: ` : ""}
                            {order.tracking_number}
                          </span>
                        ) : (
                          <span className="text-white/40">—</span>
                        )}
                      </div>
                      {order?.tracking_url ? (
                        <a
                          className="mt-2 inline-block text-primary underline break-all"
                          href={order.tracking_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open tracking link
                        </a>
                      ) : null}
                      {order?.label_url ? (
                        <a
                          className="mt-2 block text-white/70 underline break-all"
                          href={order.label_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download label (PDF)
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      disabled={labelCreating}
                      onClick={createShippoLabel}
                      className="w-full inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-60"
                    >
                      {labelCreating ? "CREATING LABEL…" : "CREATE SHIPPO LABEL"}
                    </button>
                    <div className="mt-3 text-white/30 text-xs">
                      Requires Shippo env vars (see `SUPABASE_SETUP.md` section 9).
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-white/40 text-xs font-mono uppercase tracking-wider">Manual tracking (fallback)</div>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <div className="text-white/30 text-xs">
                        Tip: inputs are prefilled from saved tracking so you can edit.
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
                        className="w-full inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-60"
                      >
                        {trackingSaving ? "SAVING…" : "SAVE TRACKING"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

