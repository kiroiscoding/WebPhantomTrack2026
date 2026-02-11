import Stripe from "stripe";
import { NextResponse } from "next/server";
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
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 400 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as CheckoutSessionWithShipping;
      const supabaseUserId = session.client_reference_id || null;
      const admin = createSupabaseAdminClient();

      // Write order history when we know which user it belongs to.
      if (supabaseUserId) {
        const createdAtIso = session.created
          ? new Date(session.created * 1000).toISOString()
          : new Date().toISOString();

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

        const base = {
          user_id: supabaseUserId,
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
          customer_email: session.customer_details?.email ?? null,
          // Some checkouts may not populate `shipping_details`; fall back to billing/customer address.
          shipping_address: session.shipping_details?.address ?? session.customer_details?.address ?? null,
          line_items: lineItems.data ?? null,
        };

        const write1 = await admin.from("orders").upsert(extended, { onConflict: "stripe_session_id" });
        if (write1.error) {
          const write2 = await admin.from("orders").upsert(base, { onConflict: "stripe_session_id" });
          if (write2.error) throw write2.error;
        }
      }

      // Send order confirmation email (best-effort).
      // IMPORTANT: We do this even if `client_reference_id` is missing, so local `stripe trigger` works.
      try {
        const toEmail = session.customer_details?.email ?? null;
        if (!toEmail) {
          console.log("Order confirmation email skipped (webhook): missing customer email on session", session.id);
        } else if (!isEmailConfigured()) {
          console.log(
            "Order confirmation email skipped (webhook): SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally EMAIL_FROM)."
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
          if (alreadySent) {
            console.log("Order confirmation email skipped (webhook): already sent", session.id);
          } else {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
            const orderUrl = row?.id && siteUrl ? `${siteUrl.replace(/\/$/, "")}/account/orders/${row.id}` : null;

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
            console.log("Order confirmation email sent (webhook):", { to: toEmail, sessionId: session.id });

            // Best-effort mark sent (if column exists + row exists).
            if (orderRow?.id) {
              await admin.from("orders").update({ email_sent_at: new Date().toISOString() }).eq("id", orderRow.id);
            }
          }
        }
      } catch (e) {
        // Swallow email errors so webhook always succeeds for Stripe.
        console.warn("Order confirmation email failed (webhook):", e);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    return new NextResponse(message, { status: 400 });
  }
}

