"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, LogOut, Mail, ShieldCheck, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatOrderRef } from "@/lib/orderRef";

type OrderLineItem = { description?: string | null };

type OrderRow = {
  id: string;
  created_at: string;
  amount_total_cents: number | null;
  currency: string | null;
  status: string | null;
  line_items?: OrderLineItem[] | null;
};

function formatMoney(cents?: number | null, currency?: string | null) {
  if (!cents || !currency) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100
  );
}

function itemsPreview(lineItems?: OrderLineItem[] | null) {
  const items = Array.isArray(lineItems) ? lineItems : [];
  const names = items
    .map((li) => (li?.description ? String(li.description) : null))
    .filter(Boolean) as string[];
  const shown = names.slice(0, 2);
  const rest = Math.max(0, names.length - shown.length);
  if (shown.length === 0) return "Items: —";
  return `Items: ${shown.join(", ")}${rest ? ` +${rest} more` : ""}`;
}

export default function AccountPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const searchParams = useSearchParams();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    searchParams.get("auth_error") || null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      // "No session" is normal; don't surface as an error.
      if (error && !/auth session missing/i.test(error.message)) setError(error.message);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    let mounted = true;
    async function loadOrders() {
      if (!user?.id) {
        setOrders([]);
        return;
      }
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, amount_total_cents, currency, status, line_items")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!mounted) return;
      if (error) {
        // Orders table may not exist yet; don't spam the UI.
        setOrders([]);
      } else {
        setOrders((data ?? []) as OrderRow[]);
      }
      setOrdersLoading(false);
    }
    loadOrders();
    return () => {
      mounted = false;
    };
  }, [supabase, user?.id]);

  async function signInWithGoogle() {
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start Google sign-in");
    }
  }

  async function signInWithEmailMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const clean = email.trim();
    if (!clean) return;
    setEmailLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setEmailLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setNotice("Check your email for a secure sign-in link.");
    }
  }

  async function signOut() {
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10">
          <h1 className="text-[9vw] md:text-[6vw] leading-[0.85] font-bold tracking-tighter text-[#050505]">
            ACCOUNT<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-[#050505]/70 text-lg md:text-xl max-w-2xl font-medium">
            Sign in to view order history and manage your Phantom Track profile.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-[#050505]">
            {error}
          </div>
        ) : null}
        {notice ? (
          <div className="mb-6 rounded-2xl border border-[#050505]/10 bg-white/60 px-5 py-4 text-[#050505]">
            {notice}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10">
            <div className="flex items-center gap-3 text-primary font-mono uppercase tracking-wider text-sm mb-4">
              <User className="h-5 w-5" />
              Account
            </div>

            {loading ? (
              <div className="text-white/60">Loading…</div>
            ) : user ? (
              <>
                <div className="text-white/80 text-lg font-semibold">Signed in</div>
                <div className="mt-2 text-white/50 text-sm break-all">{user.email}</div>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                <div className="text-white/80 text-lg font-semibold">Sign in</div>
                <div className="mt-2 text-white/50 text-sm">
                  Choose Google or get a secure magic link by email.
                </div>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors"
                >
                  CONTINUE WITH GOOGLE <ArrowRight className="ml-2 h-5 w-5" />
                </button>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <form onSubmit={signInWithEmailMagicLink} className="space-y-3">
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="w-full inline-flex items-center justify-center rounded-full border border-white/20 text-white px-8 py-4 font-bold tracking-widest hover:bg-white/10 transition-colors disabled:opacity-60"
                    >
                      {emailLoading ? "SENDING…" : "EMAIL ME A SIGN-IN LINK"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10">
            <div className="flex items-center gap-3 text-primary font-mono uppercase tracking-wider text-sm mb-4">
              <ShieldCheck className="h-5 w-5" />
              Orders
            </div>
            {!user ? (
              <div className="text-white/70">Sign in to see your order history.</div>
            ) : ordersLoading ? (
              <div className="text-white/60">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="text-white/70">No orders yet. Complete a checkout while signed in.</div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/account/orders/${o.id}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-white font-semibold">
                          {formatMoney(o.amount_total_cents, o.currency)}
                        </div>
                        <div className="mt-1 text-white/50 text-xs font-mono uppercase tracking-wider">
                          {o.status ?? "paid"}
                        </div>
                        <div className="mt-2 text-white/30 text-xs font-mono uppercase tracking-wider">
                          {formatOrderRef(o.id)}
                        </div>
                      </div>
                      <div className="text-white/50 text-xs">{new Date(o.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="mt-3 text-white/70 text-sm">{itemsPreview(o.line_items)}</div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-white/20 text-white px-8 py-4 font-bold tracking-widest hover:bg-white/10 transition-colors"
              >
                SHOP <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

