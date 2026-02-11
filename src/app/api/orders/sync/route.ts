import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildOrderConfirmationEmail, isEmailConfigured, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: { name?: string | null; address?: unknown } | null;
  customer_details?: { name?: string | null; email?: string | null; phone?: string | null; address?: unknown } | null;
};

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });

    const body = (await request.json()) as { session_id?: string };
    const sessionId = body?.session_id?.trim();
    if (!sessionId) return new NextResponse("Missing session_id", { status: 400 });

    const session = (await stripe.checkout.sessions.retrieve(sessionId)) as unknown as CheckoutSessionWithShipping;
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });

    // Verify the session belongs to this user (we set this when creating checkout).
    if (session.client_reference_id && session.client_reference_id !== user.id) {
      return new NextResponse("Session does not belong to this user", { status: 403 });
    }

    // Only store paid/completed sessions.
    const paid =
      session.payment_status === "paid" ||
      session.status === "complete";
    if (!paid) return new NextResponse("Session not paid", { status: 400 });

    const admin = createSupabaseAdminClient();
    const createdAtIso = session.created
      ? new Date(session.created * 1000).toISOString()
      : new Date().toISOString();

    // Try to write extended fields (if your orders table has them). If not, fall back to core fields.
    const base = {
      user_id: user.id,
      stripe_session_id: session.id,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      amount_total_cents: session.amount_total ?? null,
      currency: session.currency ?? null,
      status: session.payment_status ?? session.status ?? null,
      created_at: createdAtIso,
    };

    const extended = {
      ...base,
      shipping_name: session.shipping_details?.name ?? session.customer_details?.name ?? null,
      shipping_phone: session.customer_details?.phone ?? null,
      customer_email: session.customer_details?.email ?? user.email ?? null,
      // Some checkouts may not populate `shipping_details`; fall back to billing/customer address.
      shipping_address: session.shipping_details?.address ?? session.customer_details?.address ?? null,
      line_items: lineItems.data ?? null,
    };

    const write1 = await admin.from("orders").upsert(extended, { onConflict: "stripe_session_id" });
    if (write1.error) {
      const write2 = await admin.from("orders").upsert(base, { onConflict: "stripe_session_id" });
      if (write2.error) throw write2.error;
    }

    // Send confirmation email from sync as well (useful in local dev before webhooks are set up).
    // If you add `email_sent_at` (SUPABASE_SETUP.md Section 7), this will avoid duplicates.
    try {
      const toEmail = session.customer_details?.email ?? user.email ?? null;
      if (!toEmail) {
        console.log("Order confirmation email skipped (sync): missing customer email", session.id);
      } else if (!isEmailConfigured()) {
        console.log(
          "Order confirmation email skipped (sync): SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally EMAIL_FROM)."
        );
      } else {
        const { data: orderRow } = await admin
          .from("orders")
          .select("id, shipping_name, shipping_address, email_sent_at")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        const row = orderRow as unknown as {
          id?: string;
          shipping_name?: string | null;
          shipping_address?: unknown;
          email_sent_at?: string | null;
        } | null;
        const alreadySent = Boolean(row?.email_sent_at);
        if (!alreadySent) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
          const orderUrl =
            row?.id && siteUrl ? `${siteUrl.replace(/\/$/, "")}/account/orders/${row.id}` : null;

          const amount =
            session.amount_total != null && session.currency
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: session.currency.toUpperCase() }).format(
                session.amount_total / 100
              )
              : null;

          const addressUnknown =
            row?.shipping_address ?? session.shipping_details?.address ?? session.customer_details?.address ?? null;
          const address =
            addressUnknown && typeof addressUnknown === "object"
              ? (addressUnknown as Record<string, unknown>)
              : null;
          const lines: string[] = [];
          const line1 = typeof address?.line1 === "string" ? address.line1 : null;
          const line2 = typeof address?.line2 === "string" ? address.line2 : null;
          const city = typeof address?.city === "string" ? address.city : null;
          const state = typeof address?.state === "string" ? address.state : null;
          const postal = typeof address?.postal_code === "string" ? address.postal_code : null;
          const country = typeof address?.country === "string" ? address.country : null;

          if (line1) lines.push(line1);
          if (line2) lines.push(line2);
          const cityLine = [city, state, postal].filter(Boolean).join(" ");
          if (cityLine) lines.push(cityLine);
          if (country) lines.push(country);

          const items = (lineItems.data ?? []).map((li) => ({
            description: String(li.description ?? "Item"),
            quantity: Number(li.quantity ?? 1),
          }));

          const email = buildOrderConfirmationEmail({
            brandName: process.env.BRAND_NAME || "Phantom Track",
            orderId: row?.id ?? session.id,
            orderUrl,
            customerName: row?.shipping_name ?? session.customer_details?.name ?? null,
            customerEmail: toEmail,
            amount,
            items,
            shippingAddressLines: lines,
          });

          await sendEmail({ to: toEmail, subject: email.subject, html: email.html, text: email.text });
          console.log("Order confirmation email sent (sync):", { to: toEmail, sessionId: session.id });

          // Best-effort mark sent (if column exists).
          await admin
            .from("orders")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("stripe_session_id", session.id);
        }
      }
    } catch (e) {
      // Non-fatal
      console.warn("Order confirmation email failed (sync):", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Order sync failed";
    return new NextResponse(message, { status: 500 });
  }
}

