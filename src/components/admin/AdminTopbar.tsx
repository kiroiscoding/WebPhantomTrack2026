"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminTopbar() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const pathname = usePathname() || "";
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const next = encodeURIComponent(pathname + (currentSearch || ""));
    router.push(`/admin/login?next=${next}`);
  }

  const meta = (user?.app_metadata ?? {}) as Record<string, unknown>;
  const role = typeof meta.role === "string" ? meta.role : null;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl">
      <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-white/70">
              {role ? `role:${role}` : "role:unknown"}
            </span>
          </div>
          <Link href="/" className="text-white/50 hover:text-white text-xs font-mono uppercase tracking-wider">
            View site
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-white/60">
            <User className="h-4 w-4" />
            <span className="text-sm">{user?.email ?? "Not signed in"}</span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-semibold">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

