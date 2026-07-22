import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { recordOrderFromSession, type CheckoutSessionWithShipping } from "@/lib/orders";

export const runtime = "nodejs";

const stripe = getStripe();

// Best-effort fast path used by the success page so a signed-in buyer sees their
// order immediately. The webhook (`/api/webhook`) is the source of truth; this
// endpoint just calls the same idempotent recorder a little earlier.
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

    const session = (await stripe.checkout.sessions.retrieve(
      sessionId
    )) as unknown as CheckoutSessionWithShipping;

    // Verify the session belongs to this user (we set this when creating checkout).
    if (session.client_reference_id && session.client_reference_id !== user.id) {
      return new NextResponse("Session does not belong to this user", { status: 403 });
    }

    // Only store paid/completed sessions.
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (!paid) return new NextResponse("Session not paid", { status: 400 });

    const admin = createSupabaseAdminClient();

    await recordOrderFromSession({
      stripe,
      admin,
      session,
      userId: user.id,
      fallbackEmail: user.email ?? null,
      source: "sync",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Order sync failed";
    return new NextResponse(message, { status: 500 });
  }
}
