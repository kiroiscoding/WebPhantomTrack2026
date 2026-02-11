"use client";

import React, { useEffect, useState } from "react";

type Point = { date: string; orders: number; revenue_cents: number };

export function AdminAnalyticsClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<Point[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/analytics", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = (await res.json()) as { series: Point[] };
        if (mounted) setSeries(json.series ?? []);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-primary">Insights</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tighter">Analytics</h1>
        <p className="mt-3 text-white/50 max-w-2xl">
          Revenue and order volume trends (v1). We’ll upgrade this to charts next.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="text-xs font-mono uppercase tracking-wider text-white/40">Last 30 days</div>
        </div>
        <div className="divide-y divide-white/10">
          {(series ?? []).map((p) => (
            <div key={p.date} className="px-6 py-3 flex items-center justify-between gap-4">
              <div className="text-white/80 font-mono">{p.date}</div>
              <div className="text-white/60 text-sm">
                {p.orders} orders · ${(p.revenue_cents / 100).toFixed(2)}
              </div>
            </div>
          ))}
          {!loading && series.length === 0 ? (
            <div className="px-6 py-10 text-white/50">No data yet.</div>
          ) : null}
          {loading ? <div className="px-6 py-10 text-white/50">Loading…</div> : null}
        </div>
      </div>
    </div>
  );
}

