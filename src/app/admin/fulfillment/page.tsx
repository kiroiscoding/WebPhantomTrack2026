import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { userHasAdminAccess } from "@/lib/admin";

export default async function AdminFulfillmentPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!userHasAdminAccess(user)) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-primary">Operations</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tighter">Fulfillment</h1>
        <p className="mt-3 text-white/50 max-w-2xl">
          Shipping workflow, label creation, tracking, and exception handling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-white/40">Quick actions</div>
          <div className="mt-4 space-y-3">
            <Link
              href="/admin/orders"
              className="block rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/5 transition-colors"
            >
              <div className="text-white font-semibold">Create labels</div>
              <div className="mt-1 text-white/40 text-sm">
                Open Orders and generate Shippo labels for unshipped purchases.
              </div>
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/5 transition-colors"
            >
              <div className="text-white font-semibold">Resolve exceptions</div>
              <div className="mt-1 text-white/40 text-sm">
                Fix missing addresses, failed carrier activation, or invalid rates.
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-white/40">Notes</div>
          <div className="mt-4 text-white/50 text-sm leading-relaxed space-y-2">
            <p>
              This page will become the “work queue” (needs label, needs tracking, missing address,
              carrier errors) as we add the fulfillment-focused endpoints.
            </p>
            <p className="text-white/40">
              For now, all fulfillment tools live on individual order pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

