import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { parseJsonEnv, shippoRequest, type ShippoAddress, type ShippoParcel } from "@/lib/shippo";
import { buildShippingNotificationEmail, isEmailConfigured, sendEmail } from "@/lib/email";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: { name?: string | null; address?: unknown } | null;
  customer_details?: { name?: string | null; email?: string | null; phone?: string | null; address?: unknown } | null;
};

type Body = { orderId?: string };

type ShippoShipment = {
  object_id: string;
  rates: { object_id: string; amount: string; currency: string; provider: string; servicelevel?: { name?: string } }[];
};

type ShippoTransaction = {
  object_id: string;
  status: string;
  label_url: string | null;
  tracking_number: string | null;
  tracking_url_provider: string | null;
  rate?: { provider?: string };
  messages?: unknown[];
  validation_results?: unknown;
};

function normalizeUsState(raw?: string | null): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const upper = s.toUpperCase();
  if (upper.length === 2) return upper;
  const key = s.toLowerCase();
  const map: Record<string, string> = {
    "alabama": "AL",
    "alaska": "AK",
    "arizona": "AZ",
    "arkansas": "AR",
    "california": "CA",
    "colorado": "CO",
    "connecticut": "CT",
    "delaware": "DE",
    "florida": "FL",
    "georgia": "GA",
    "hawaii": "HI",
    "idaho": "ID",
    "illinois": "IL",
    "indiana": "IN",
    "iowa": "IA",
    "kansas": "KS",
    "kentucky": "KY",
    "louisiana": "LA",
    "maine": "ME",
    "maryland": "MD",
    "massachusetts": "MA",
    "michigan": "MI",
    "minnesota": "MN",
    "mississippi": "MS",
    "missouri": "MO",
    "montana": "MT",
    "nebraska": "NE",
    "nevada": "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    "ohio": "OH",
    "oklahoma": "OK",
    "oregon": "OR",
    "pennsylvania": "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    "tennessee": "TN",
    "texas": "TX",
    "utah": "UT",
    "vermont": "VT",
    "virginia": "VA",
    "washington": "WA",
    "west virginia": "WV",
    "wisconsin": "WI",
    "wyoming": "WY",
    "district of columbia": "DC",
    "washington dc": "DC",
    "d.c.": "DC",
  };
  return map[key] ?? null;
}

function normalizeStripeLikeAddress(
  address: unknown
): { line1: string | null; line2: string | null; city: string | null; state: string | null; postal_code: string | null; country: string | null } | null {
  if (!address || typeof address !== "object") return null;
  const a = address as Record<string, unknown>;
  const asString = (v: unknown) => (typeof v === "string" ? v : null);
  // Stripe Address
  if (typeof a.line1 === "string" || typeof a.postal_code === "string") {
    return {
      line1: asString(a.line1),
      line2: asString(a.line2),
      city: asString(a.city),
      state: asString(a.state),
      postal_code: asString(a.postal_code),
      country: asString(a.country),
    };
  }
  // Some DBs may store Shippo-like keys; convert to Stripe-like shape.
  if (typeof a.street1 === "string" || typeof a.zip === "string") {
    return {
      line1: asString(a.street1),
      line2: asString(a.street2),
      city: asString(a.city),
      state: asString(a.state),
      postal_code: asString(a.zip),
      country: asString(a.country),
    };
  }
  return null;
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    if (!process.env.SHIPPO_API_TOKEN) {
      return new NextResponse(
        [
          "Missing SHIPPO_API_TOKEN",
          "",
          "Add to .env.local:",
          'SHIPPO_API_TOKEN=shippo_test_...',
        ].join("\n"),
        { status: 500 }
      );
    }
    if (!process.env.SHIPPO_FROM_ADDRESS_JSON || !process.env.SHIPPO_PARCEL_JSON) {
      return new NextResponse(
        [
          "Missing Shippo config in .env.local",
          `SHIPPO_FROM_ADDRESS_JSON=${process.env.SHIPPO_FROM_ADDRESS_JSON ? "present" : "missing"}`,
          `SHIPPO_PARCEL_JSON=${process.env.SHIPPO_PARCEL_JSON ? "present" : "missing"}`,
          "",
          "Example:",
          'SHIPPO_FROM_ADDRESS_JSON={"name":"Phantom Track","street1":"123 Main St","city":"Los Angeles","state":"CA","zip":"90001","country":"US","phone":"555-555-5555","email":"support@yourdomain.com"}',
          'SHIPPO_PARCEL_JSON={"length":"10","width":"6","height":"4","distance_unit":"in","weight":"2","mass_unit":"lb"}',
        ].join("\n"),
        { status: 500 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userHasAdminAccess(user)) return new NextResponse("Forbidden", { status: 403 });

    const body = (await request.json()) as Body;
    const orderId = body?.orderId?.trim();
    if (!orderId) return new NextResponse("Missing orderId", { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("id, stripe_session_id, shipping_address, shipping_name, shipping_phone, customer_email, shipping_email_sent_at")
      .eq("id", orderId)
      .maybeSingle();
    if (orderErr) return new NextResponse(orderErr.message, { status: 500 });
    if (!order?.stripe_session_id) return new NextResponse("Order missing stripe_session_id", { status: 400 });

    // NOTE: `shipping_details` is already included on Checkout Sessions and cannot be expanded.
    const session = (await stripe.checkout.sessions.retrieve(order.stripe_session_id)) as unknown as CheckoutSessionWithShipping;
    const shipping = session.shipping_details;
    const addressFromShipping = normalizeStripeLikeAddress(shipping?.address);
    const addressFromCustomer = normalizeStripeLikeAddress(session.customer_details?.address);
    const addressFromOrder = normalizeStripeLikeAddress(order.shipping_address);
    const addressTo = addressFromShipping ?? addressFromCustomer ?? addressFromOrder;
    if (!addressTo) {
      return new NextResponse(
        [
          "No address available to create a label.",
          `stripe_session_id=${session.id}`,
          `shipping_details.address=${addressFromShipping ? "present" : "missing"}`,
          `customer_details.address=${addressFromCustomer ? "present" : "missing"}`,
          `orders.shipping_address=${addressFromOrder ? "present" : "missing"}`,
          "",
          "Fix options:",
          "- Place a new test order (Checkout now requires address collection).",
          "- Or add an address to the order in admin and retry label creation.",
        ].join("\n"),
        { status: 400 }
      );
    }

    const fromRaw = parseJsonEnv<ShippoAddress>("SHIPPO_FROM_ADDRESS_JSON");
    const from: ShippoAddress = { ...fromRaw };
    if (String(from.country || "").toUpperCase() === "US") {
      const st = normalizeUsState(from.state);
      if (!st) {
        return new NextResponse(
          'Shippo "address_from" is invalid. Fix `SHIPPO_FROM_ADDRESS_JSON.state` to a 2-letter US code (e.g. "CA").',
          { status: 400 }
        );
      }
      from.state = st;
    }
    const parcel = parseJsonEnv<ShippoParcel>("SHIPPO_PARCEL_JSON");

    const to: ShippoAddress = {
      name: shipping?.name ?? session.customer_details?.name ?? order.shipping_name ?? undefined,
      street1: addressTo.line1 || "",
      street2: addressTo.line2 || undefined,
      city: addressTo.city || "",
      state: addressTo.state || "",
      zip: addressTo.postal_code || "",
      country: addressTo.country || "US",
      phone: session.customer_details?.phone ?? order.shipping_phone ?? undefined,
      email: session.customer_details?.email ?? undefined,
    };

    if (String(to.country || "").toUpperCase() === "US") {
      const st = normalizeUsState(to.state);
      if (st) to.state = st;
    }

    const missing: string[] = [];
    if (!to.street1) missing.push("street1");
    if (!to.city) missing.push("city");
    if (!to.state) missing.push("state");
    if (!to.zip) missing.push("zip");
    if (!to.country) missing.push("country");
    if (missing.length) {
      return new NextResponse(
        `Address is incomplete for Shippo label creation. Missing: ${missing.join(", ")}\n\nTip: use the admin "Override shipping address" fields and save, then retry.`,
        { status: 400 }
      );
    }

    const shipment = await shippoRequest<ShippoShipment>("/shipments/", {
      method: "POST",
      body: JSON.stringify({
        address_from: from,
        address_to: to,
        parcels: [parcel],
        async: false,
      }),
    });

    if (!shipment?.rates?.length) {
      return new NextResponse("Shippo returned no rates (check address/parcel settings).", { status: 400 });
    }

    const rates = shipment.rates
      .filter((r) => r.currency?.toUpperCase() === "USD" && !Number.isNaN(Number(r.amount)))
      .sort((a, b) => Number(a.amount) - Number(b.amount));
    const candidates = (rates.length ? rates : shipment.rates).slice(0, 10);

    let tx: ShippoTransaction | null = null;
    let usedRate: (typeof candidates)[number] | null = null;
    const failures: unknown[] = [];

    for (const rate of candidates) {
      const attempt = await shippoRequest<ShippoTransaction>("/transactions/", {
        method: "POST",
        body: JSON.stringify({
          rate: rate.object_id,
          label_file_type: "PDF",
          async: false,
        }),
      });

      if (attempt.status === "SUCCESS") {
        tx = attempt;
        usedRate = rate;
        break;
      }

      failures.push({
        provider: rate.provider,
        amount: rate.amount,
        currency: rate.currency,
        servicelevel: rate.servicelevel?.name ?? null,
        messages: attempt.messages ?? null,
        status: attempt.status,
      });

      // Common case: UPS rate is cheapest but UPS carrier isn't activated in Shippo.
      const codes = Array.isArray(attempt.messages)
        ? attempt.messages
            .map((m) => {
              if (!m || typeof m !== "object") return null;
              const code = (m as Record<string, unknown>).code;
              return typeof code === "string" ? code : null;
            })
            .filter(Boolean)
        : [];
      if (codes.includes("ups_registration_error")) {
        continue; // try next rate
      }
    }

    if (!tx || !usedRate) {
      return new NextResponse(
        [
          "Shippo transaction not successful for any candidate rate.",
          "",
          "Top failures:",
          JSON.stringify(failures.slice(0, 5), null, 2),
          "",
          'If this is "ups_registration_error", activate UPS in Shippo Dashboard (Settings → Carriers) or rely on USPS/FedEx rates.',
        ].join("\n"),
        { status: 400 }
      );
    }

    // Update order with tracking + label (if columns exist). If not, return a helpful message.
    const update = await admin
      .from("orders")
      .update({
        shippo_shipment_id: shipment.object_id,
        shippo_transaction_id: tx.object_id,
        tracking_number: tx.tracking_number,
        tracking_carrier: tx.rate?.provider ?? usedRate.provider ?? null,
        tracking_url: tx.tracking_url_provider,
        label_url: tx.label_url,
        fulfillment_status: "shipped",
        tracking_status: "UNKNOWN",
        tracking_status_details: null,
      })
      .eq("id", orderId);

    if (update.error) {
      return new NextResponse(
        `Label created, but failed to save to Supabase. Run the SQL in SUPABASE_SETUP.md (Section 7) to add shipping/tracking columns.\n\n${update.error.message}`,
        { status: 400 }
      );
    }

    // Send "on the way" email when label/tracking is created (best-effort).
    try {
      const orderRow = order as unknown as {
        id?: string;
        customer_email?: string | null;
        shipping_name?: string | null;
        shipping_email_sent_at?: string | null;
      } | null;

      const alreadySent = Boolean(orderRow?.shipping_email_sent_at);
      const toEmail = session.customer_details?.email ?? orderRow?.customer_email ?? null;
      const trackingNumber = tx.tracking_number ?? null;
      if (!alreadySent && toEmail && trackingNumber && isEmailConfigured()) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
        const orderUrl = order?.id && siteUrl ? `${siteUrl.replace(/\/$/, "")}/account/orders/${order.id}` : null;

        const email = buildShippingNotificationEmail({
          brandName: process.env.BRAND_NAME || "Phantom Track",
          orderId: order?.id ?? session.id,
          orderUrl,
          customerName: orderRow?.shipping_name ?? session.customer_details?.name ?? null,
          customerEmail: toEmail,
          trackingNumber,
          trackingUrl: tx.tracking_url_provider ?? null,
          carrier: tx.rate?.provider ?? usedRate.provider ?? null,
        });

        await sendEmail({ to: toEmail, subject: email.subject, html: email.html, text: email.text });
        console.log("Shipping email sent (shippo label):", { to: toEmail, orderId: order?.id ?? orderId });

        // Best-effort mark sent (if column exists).
        await admin.from("orders").update({ shipping_email_sent_at: new Date().toISOString() }).eq("id", orderId);
      }
    } catch (e) {
      console.warn("Shipping email failed (shippo label):", e);
    }

    return NextResponse.json({
      ok: true,
      label_url: tx.label_url,
      tracking_number: tx.tracking_number,
      tracking_url: tx.tracking_url_provider,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shippo label creation failed";
    return new NextResponse(message, { status: 500 });
  }
}

