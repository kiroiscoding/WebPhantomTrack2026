import Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildOrderConfirmationEmail, isEmailConfigured, sendEmail } from "@/lib/email";

export type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: { name?: string | null; address?: unknown } | null;
  customer_details?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: unknown;
  } | null;
};

type OrderSource = "webhook" | "sync";

function addressToLines(addressUnknown: unknown): string[] {
  const address =
    addressUnknown && typeof addressUnknown === "object"
      ? (addressUnknown as Record<string, unknown>)
      : null;
  const line1 = typeof address?.line1 === "string" ? address.line1 : null;
  const line2 = typeof address?.line2 === "string" ? address.line2 : null;
  const city = typeof address?.city === "string" ? address.city : null;
  const state = typeof address?.state === "string" ? address.state : null;
  const postal = typeof address?.postal_code === "string" ? address.postal_code : null;
  const country = typeof address?.country === "string" ? address.country : null;

  const lines: string[] = [];
  if (line1) lines.push(line1);
  if (line2) lines.push(line2);
  const cityLine = [city, state, postal].filter(Boolean).join(" ");
  if (cityLine) lines.push(cityLine);
  if (country) lines.push(country);
  return lines;
}

/**
 * Persist a paid Checkout Session as an order and send the confirmation email.
 *
 * This is the single source of truth for turning a Stripe Checkout Session into
 * a Phantom Track order. It is idempotent (upsert on `stripe_session_id`, email
 * de-duped via `email_sent_at`) so it is safe to call from both the webhook
 * (primary) and the success-page sync (best-effort fast path), and safe for
 * Stripe to retry.
 *
 * `userId` is nullable so guest checkouts are still recorded.
 */
export async function recordOrderFromSession(params: {
  stripe: Stripe;
  admin: SupabaseClient;
  session: CheckoutSessionWithShipping;
  userId?: string | null;
  fallbackEmail?: string | null;
  source: OrderSource;
}): Promise<void> {
  const { stripe, admin, session, userId = null, fallbackEmail = null, source } = params;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

  const createdAtIso = session.created
    ? new Date(session.created * 1000).toISOString()
    : new Date().toISOString();

  const base = {
    user_id: userId,
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
    customer_email: session.customer_details?.email ?? fallbackEmail ?? null,
    // Some flows may not populate `shipping_details`; fall back to billing/customer address.
    shipping_address: session.shipping_details?.address ?? session.customer_details?.address ?? null,
    line_items: lineItems.data ?? null,
  };

  const write1 = await admin.from("orders").upsert(extended, { onConflict: "stripe_session_id" });
  if (write1.error) {
    const write2 = await admin.from("orders").upsert(base, { onConflict: "stripe_session_id" });
    if (write2.error) throw write2.error;
  }

  await sendConfirmationEmail({ session, lineItems, admin, fallbackEmail, source });
}

async function sendConfirmationEmail(params: {
  session: CheckoutSessionWithShipping;
  lineItems: Stripe.ApiList<Stripe.LineItem>;
  admin: SupabaseClient;
  fallbackEmail: string | null;
  source: OrderSource;
}): Promise<void> {
  const { session, lineItems, admin, fallbackEmail, source } = params;

  try {
    const toEmail = session.customer_details?.email ?? fallbackEmail ?? null;
    if (!toEmail) {
      console.log(`Order confirmation email skipped (${source}): missing customer email`, session.id);
      return;
    }
    if (!isEmailConfigured()) {
      console.log(
        `Order confirmation email skipped (${source}): SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally EMAIL_FROM).`
      );
      return;
    }

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

    if (row?.email_sent_at) {
      console.log(`Order confirmation email skipped (${source}): already sent`, session.id);
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const orderUrl =
      row?.id && siteUrl ? `${siteUrl.replace(/\/$/, "")}/account/orders/${row.id}` : null;

    const amount =
      session.amount_total != null && session.currency
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: session.currency.toUpperCase(),
          }).format(session.amount_total / 100)
        : null;

    const shippingAddressLines = addressToLines(
      row?.shipping_address ?? session.shipping_details?.address ?? session.customer_details?.address ?? null
    );

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
      shippingAddressLines,
    });

    await sendEmail({ to: toEmail, subject: email.subject, html: email.html, text: email.text });
    console.log(`Order confirmation email sent (${source}):`, { to: toEmail, sessionId: session.id });

    if (row?.id) {
      await admin.from("orders").update({ email_sent_at: new Date().toISOString() }).eq("id", row.id);
    } else {
      await admin
        .from("orders")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id);
    }
  } catch (e) {
    // Never fail the caller (esp. the webhook) because of email problems.
    console.warn(`Order confirmation email failed (${source}):`, e);
  }
}
