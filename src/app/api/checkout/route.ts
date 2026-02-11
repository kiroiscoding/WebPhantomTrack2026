import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
});

type CheckoutBody = {
  items: { slug: string; quantity: number; variant?: string }[];
};

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const body = (await request.json()) as CheckoutBody;
    const items = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const i of items) {
      const product = getProduct(i.slug);
      if (!product || !product.purchasable) {
        return NextResponse.json({ error: `Invalid product: ${i.slug}` }, { status: 400 });
      }
      const quantity = Math.max(1, Math.min(10, Number(i.quantity || 1)));
      const variant = i.variant?.trim();

      line_items.push({
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.priceCents,
          product_data: {
            name: variant ? `${product.name} (${variant})` : product.name,
            description: product.subtitle,
          },
        },
      });
    }

    // If user is logged in, attach (and persist) a Stripe Customer ID in Supabase.
    let stripeCustomerId: string | undefined;
    let clientReferenceId: string | undefined;
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user?.id) {
        clientReferenceId = user.id;
        // Only attempt DB write if service role is configured and profiles table exists.
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const admin = createSupabaseAdminClient();
          const { data: profile, error: profileErr } = await admin
            .from("profiles")
            .select("stripe_customer_id")
            .eq("id", user.id)
            .maybeSingle();

          if (profileErr) throw profileErr;

          stripeCustomerId = profile?.stripe_customer_id ?? undefined;

          if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
              email: user.email ?? undefined,
              metadata: {
                supabase_user_id: user.id,
              },
            });

            stripeCustomerId = customer.id;
            await admin.from("profiles").upsert({ id: user.id, stripe_customer_id: stripeCustomerId });
          }
        }
      }
    } catch {
      // Non-fatal: guest checkout will still work.
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      // Ensure we always get an address back on the Session (at minimum billing/customer_details.address).
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      // Ensure Checkout actually collects a shipping address by providing at least one shipping option.
      // (Without shipping options, some flows won't populate `shipping_details`.)
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
      ...(clientReferenceId ? { client_reference_id: clientReferenceId } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return new NextResponse(message, { status: 500 });
  }
}

