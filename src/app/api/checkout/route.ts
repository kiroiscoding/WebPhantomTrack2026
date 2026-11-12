import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createShopifyCheckout, isShopifyConfigured } from "@/lib/shopify";

export const runtime = "nodejs";

type CheckoutBody = {
  items: { variantId: string; quantity: number }[];
};

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

/**
 * Turns the site cart into a Shopify cart and returns Shopify's hosted
 * checkout URL. Shopify owns pricing, shipping, tax, payment, the order and
 * the confirmation email from here on.
 */
export async function POST(request: Request) {
  try {
    if (!isShopifyConfigured()) {
      return new NextResponse("Checkout is not configured (missing Shopify env vars)", { status: 500 });
    }

    const body = (await request.json().catch(() => null)) as CheckoutBody | null;
    const items = Array.isArray(body?.items) ? body.items : [];
    if (items.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    const lines = [];
    for (const i of items) {
      if (typeof i?.variantId !== "string" || !VARIANT_GID.test(i.variantId)) {
        return new NextResponse("Your cart has an outdated item. Please remove it and add it again.", {
          status: 400,
        });
      }
      lines.push({ merchandiseId: i.variantId, quantity: Math.max(1, Math.min(10, Math.floor(Number(i.quantity) || 1))) });
    }

    // Pre-fill the checkout email for signed-in shoppers (optional).
    let email: string | undefined;
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? undefined;
    } catch {
      // Guest checkout.
    }

    const url = await createShopifyCheckout({ lines, email });
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    console.error("[checkout]", message);
    return new NextResponse(message, { status: 500 });
  }
}
