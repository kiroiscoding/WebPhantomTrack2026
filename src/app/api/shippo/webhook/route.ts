import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireShippoWebhookSecret } from "@/lib/shippo";

export const runtime = "nodejs";

function mapStatus(raw?: string | null): { tracking_status: string; fulfillment_status: string } {
  const s = (raw || "").toLowerCase();
  if (s.includes("delivered")) return { tracking_status: "DELIVERED", fulfillment_status: "delivered" };
  if (s.includes("transit")) return { tracking_status: "IN_TRANSIT", fulfillment_status: "shipped" };
  if (s.includes("out_for_delivery")) return { tracking_status: "OUT_FOR_DELIVERY", fulfillment_status: "shipped" };
  if (s.includes("return")) return { tracking_status: "RETURNED", fulfillment_status: "returned" };
  if (s.includes("fail")) return { tracking_status: "FAILURE", fulfillment_status: "shipping_issue" };
  return { tracking_status: raw ? raw.toUpperCase() : "UNKNOWN", fulfillment_status: "shipped" };
}

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    // Simple shared secret gate (configure the same URL in Shippo Dashboard).
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    if (!secret || secret !== requireShippoWebhookSecret()) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const payload = (await request.json()) as Record<string, unknown>;

    // Shippo sends different shapes depending on event type; normalize to a plain object.
    const data =
      payload.data && typeof payload.data === "object" && payload.data !== null
        ? (payload.data as Record<string, unknown>)
        : payload;

    const trackingNumber =
      (typeof data.tracking_number === "string" && data.tracking_number) ||
      (typeof data.trackingNumber === "string" && data.trackingNumber) ||
      (data.tracking && typeof data.tracking === "object" && typeof (data.tracking as Record<string, unknown>).tracking_number === "string"
        ? ((data.tracking as Record<string, unknown>).tracking_number as string)
        : null);

    if (!trackingNumber) return NextResponse.json({ received: true });

    const trackingStatusObj =
      data.tracking_status && typeof data.tracking_status === "object" ? (data.tracking_status as Record<string, unknown>) : null;

    const rawStatus =
      (typeof trackingStatusObj?.status === "string" ? trackingStatusObj.status : null) ??
      (typeof data.tracking_status === "string" ? data.tracking_status : null) ??
      (typeof data.status === "string" ? data.status : null);

    const mapped = mapStatus(rawStatus);
    const details = trackingStatusObj ?? data ?? null;

    const admin = createSupabaseAdminClient();
    const update = await admin
      .from("orders")
      .update({
        tracking_number: trackingNumber,
        tracking_status: mapped.tracking_status,
        fulfillment_status: mapped.fulfillment_status,
        tracking_status_details: details,
      })
      .eq("tracking_number", trackingNumber);

    if (update.error) {
      return new NextResponse(update.error.message, { status: 400 });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shippo webhook error";
    return new NextResponse(message, { status: 400 });
  }
}

