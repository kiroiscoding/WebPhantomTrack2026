"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginClient() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data.session?.user) {
          const status = await fetch("/api/admin/status", { cache: "no-store" }).then((r) => r.json());
          if (status?.isAdmin) {
            router.replace(next);
          } else {
            setError("Signed in, but your account does not have admin access.");
          }
        }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to check session");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, [next, router, supabase]);

  async function signInWithGoogle() {
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
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
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setEmailLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setNotice("Check your email for a secure sign-in link.");
    }
  }

  return (
    <div className="relative">
      {/* Full-screen overlay so login doesn't feel like “inside” the console */}
      <div className="fixed inset-0 z-40 bg-[#0b0b0b]">
        <div className="min-h-screen flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[560px]">
            <div className="mb-10">
              <div className="flex items-center gap-3 text-primary font-mono uppercase tracking-wider text-sm">
                <ShieldCheck className="h-5 w-5" />
                Admin sign-in
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Phantom Track Console
              </h1>
              <p className="mt-3 text-white/50">
                Sign in to access orders, fulfillment tools, customer insights, and analytics.
              </p>
            </div>

            {error ? (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-200">
                {error}
              </div>
            ) : null}
            {notice ? (
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/80">
                {notice}
              </div>
            ) : null}

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
              <button
                type="button"
                disabled={loading}
                onClick={signInWithGoogle}
                className="w-full inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                CONTINUE WITH GOOGLE <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <div className="mt-6 border-t border-white/10 pt-6">
                <form onSubmit={signInWithEmailMagicLink} className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                    Email magic link
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full rounded-full bg-black/30 border border-white/10 pl-12 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
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

              <div className="mt-6 text-xs text-white/40">
                Tip: If you sign in successfully but see an access error, add your email to `ADMIN_EMAILS`
                temporarily, then use the Admin Settings page to grant yourself a role.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

