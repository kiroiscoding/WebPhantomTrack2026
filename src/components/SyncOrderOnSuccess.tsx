"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function SyncOrderOnSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!sessionId) return;
      setStatus("syncing");
      try {
        const res = await fetch("/api/orders/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!res.ok) throw new Error(await res.text());
        if (!cancelled) setStatus("done");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) return null;
  if (status === "done") return null;

  return (
    <div className="mt-6 text-white/40 text-sm">
      {status === "syncing" ? "Saving your order to your account…" : "Order saved. Refresh your account page."}
    </div>
  );
}

