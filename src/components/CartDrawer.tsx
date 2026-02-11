"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, ArrowRight, Trash2, Lock } from "lucide-react";
import { useCartStore, cartSubtotalCents } from "@/lib/cartStore";
import { formatUsdFromCents } from "@/lib/products";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const subtotalCents = useMemo(() => cartSubtotalCents(items), [items]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((x) => ({ slug: x.slug, quantity: x.quantity, variant: x.variant })),
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Checkout failed");
      }
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("Stripe session URL missing");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setIsCheckingOut(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/40"
          />

          <motion.aside
            aria-label="Cart"
            initial={{ x: 420, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-4 top-4 z-[80] h-[calc(100vh-2rem)] w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <div className="text-white font-bold tracking-tight text-lg">Cart</div>
                  <div className="text-white/50 text-sm">{items.length} item{items.length === 1 ? "" : "s"}</div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-white/60">
                    Your cart is empty.
                  </div>
                ) : (
                  items.map((x) => (
                    <div
                      key={x.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-white font-semibold truncate">{x.name}</div>
                          {x.variant ? (
                            <div className="text-white/50 text-xs mt-1">Variant: {x.variant}</div>
                          ) : null}
                          <div className="text-primary font-mono mt-2">{formatUsdFromCents(x.priceCents)}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(x.id)}
                          className="text-white/60 hover:text-white transition-colors p-2 -mt-1 -mr-1"
                          aria-label={`Remove ${x.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQty(x.id, x.quantity - 1)}
                            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="w-10 text-center text-white font-mono">{x.quantity}</div>
                          <button
                            type="button"
                            onClick={() => setQty(x.id, x.quantity + 1)}
                            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-white/80 font-mono">
                          {formatUsdFromCents(x.priceCents * x.quantity)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-white">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-mono">{formatUsdFromCents(subtotalCents)}</span>
                </div>

                {error ? (
                  <div className="text-red-300 text-sm">{error}</div>
                ) : null}

                <button
                  type="button"
                  disabled={items.length === 0 || isCheckingOut}
                  onClick={onCheckout}
                  className="w-full group relative py-4 bg-white text-black rounded-full font-bold text-base tracking-widest overflow-hidden hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" />
                    {isCheckingOut ? "REDIRECTING…" : "CHECKOUT"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>

                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => clear()}
                    className="w-full text-white/60 hover:text-white text-sm py-2 transition-colors"
                  >
                    Clear cart
                  </button>
                ) : null}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

