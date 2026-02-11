"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/products";

export type CartLine = {
  id: string; // unique line id (product+variant)
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  variant?: string; // e.g. size
};

type CartState = {
  isOpen: boolean;
  items: CartLine[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, opts?: { quantity?: number; variant?: string }) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, quantity: number) => void;
  clear: () => void;
};

function lineId(slug: string, variant?: string) {
  return `${slug}::${variant ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addItem: (product, opts) => {
        const quantity = Math.max(1, opts?.quantity ?? 1);
        const variant = opts?.variant?.trim() || undefined;
        const id = lineId(product.slug, variant);

        set((state) => {
          const existing = state.items.find((x) => x.id === id);
          if (existing) {
            return {
              items: state.items.map((x) => (x.id === id ? { ...x, quantity: x.quantity + quantity } : x)),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                quantity,
                variant,
              },
            ],
            isOpen: true,
          };
        });
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
      setQty: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((x) => (x.id === id ? { ...x, quantity: Math.max(1, quantity) } : x))
            .filter((x) => x.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "phantomtrack_cart_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function cartSubtotalCents(items: CartLine[]): number {
  return items.reduce((sum, x) => sum + x.priceCents * x.quantity, 0);
}

