"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";

export function ClearCartOnSuccess() {
  const clear = useCartStore((s) => s.clear);
  const closeCart = useCartStore((s) => s.closeCart);

  useEffect(() => {
    closeCart();
    clear();
  }, [clear, closeCart]);

  return null;
}

