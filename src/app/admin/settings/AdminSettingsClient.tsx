"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";

type Status = { isAdmin: boolean; isSuperAdmin: boolean; role: "admin" | "staff" | null };

export function AdminSettingsClient() {
  const [status, setStatus] = useState<Status | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/status", { cache: "no-store" });
        const json = (await res.json()) as Status;
        if (mounted) setStatus(json);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load admin status");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function grantRole(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, role }),
      });
      if (!res.ok) throw new Error(await res.text());
      setNotice(`Granted ${role} to ${clean}`);
      setEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to grant role");
    } finally {
      setSaving(false);
    }
  }

  const isSuperAdmin = !!status?.isSuperAdmin;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-primary">Admin</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tighter">Settings</h1>
        <p className="mt-3 text-white/50 max-w-2xl">
          Console configuration and admin access management.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-200">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/80">
          {notice}
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3 text-white">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="font-semibold">Your access</div>
        </div>
        <div className="mt-3 text-white/50 text-sm">
          {loading ? "Loading…" : `role: ${status?.role ?? "unknown"} · super-admin: ${isSuperAdmin ? "yes" : "no"}`}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-white">
              <UserPlus className="h-5 w-5 text-primary" />
              <div className="font-semibold">Grant admin access</div>
            </div>
            <div className="mt-2 text-white/50 text-sm">
              Only <span className="text-white">role=admin</span> can grant roles (v1).
            </div>
          </div>
          <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
            API: /api/admin/roles
          </div>
        </div>

        <form onSubmit={grantRole} className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@domain.com"
            className="md:col-span-6 w-full rounded-full bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20"
            disabled={!isSuperAdmin}
          />
          <select
            value={role}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "admin" || v === "staff") setRole(v);
            }}
            className="md:col-span-3 w-full rounded-full bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/20"
            disabled={!isSuperAdmin}
          >
            <option value="staff">staff</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="submit"
            disabled={!isSuperAdmin || saving}
            className="md:col-span-3 inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            {saving ? "SAVING…" : "GRANT"}
          </button>
        </form>
      </div>
    </div>
  );
}

