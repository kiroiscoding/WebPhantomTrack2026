import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildShippingNotificationEmail, isEmailConfigured, sendEmail } from "@/lib/email";
import { userHasAdminAccess } from "@/lib/admin";

export const runtime = "nodejs";

type Body = {
  tracking_number?: string;
  tracking_carrier?: string;
  tracking_url?: string;
  fulfillment_status?: string;
};

type OrderEmailRow = {
  id: string;
  customer_email: string | null;
  shipping_name: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  tracking_url: string | null;
  shipping_email_sent_at: string | null;
};

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userHasAdminAccess(user)) return new NextResponse("Forbidden", { status: 403 });

    const { id } = await context.params;
    const body = (await request.json()) as Body;

    const admin = createSupabaseAdminClient();
    const result = await admin
      .from("orders")
      .update({
        tracking_number: body.tracking_number?.trim() || null,
        tracking_carrier: body.tracking_carrier?.trim() || null,
        tracking_url: body.tracking_url?.trim() || null,
        fulfillment_status: body.fulfillment_status?.trim() || null,
      })
      .eq("id", id);

    if (result.error) {
      return new NextResponse(
        `Failed to update tracking. If you haven't added tracking columns yet, run the SQL in SUPABASE_SETUP.md (Section 7).\n\n${result.error.message}`,
        { status: 400 }
      );
    }

    // Send "on the way" email when tracking gets set (best-effort).
    try {
      if (isEmailConfigured()) {
        const { data: order } = await admin
          .from("orders")
          .select("id, customer_email, shipping_name, tracking_number, tracking_carrier, tracking_url, shipping_email_sent_at")
          .eq("id", id)
          .maybeSingle();

        const row = order as unknown as OrderEmailRow | null;
        const toEmail = row?.customer_email ?? null;
        const trackingNumber = row?.tracking_number ?? null;
        const alreadySent = Boolean(row?.shipping_email_sent_at);

        if (toEmail && trackingNumber && !alreadySent) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
          const orderUrl = row?.id && siteUrl ? `${siteUrl.replace(/\/$/, "")}/account/orders/${row.id}` : null;

          const email = buildShippingNotificationEmail({
            brandName: process.env.BRAND_NAME || "Phantom Track",
            orderId: row?.id ?? id,
            orderUrl,
            customerName: row?.shipping_name ?? null,
            customerEmail: toEmail,
            trackingNumber,
            trackingUrl: row?.tracking_url ?? null,
            carrier: row?.tracking_carrier ?? null,
          });

          await sendEmail({ to: toEmail, subject: email.subject, html: email.html, text: email.text });
          console.log("Shipping email sent (tracking update):", { to: toEmail, orderId: row?.id ?? id });

          // Best-effort mark sent (if column exists).
          await admin.from("orders").update({ shipping_email_sent_at: new Date().toISOString() }).eq("id", id);
        }
      }
    } catch (e) {
      console.warn("Shipping email failed (tracking update):", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update tracking";
    return new NextResponse(message, { status: 500 });
  }
}

