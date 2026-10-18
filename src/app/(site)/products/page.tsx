"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Shirt,
  Clock,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Brands } from "@/components/Brands";
import { PRODUCTS, formatUsdFromCents, getPrimaryImage, type Product } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";

type Display = {
  slug: string;
  badge?: { label: string; tone: "accent" | "neutral" };
  image?: string;
  featureCount: number;
};

// Presentation config, keyed to the single source of truth in lib/products.ts
const DISPLAY_ORDER: Display[] = [
  { slug: "tracker-combo", badge: { label: "Best value", tone: "accent" }, featureCount: 4 },
  { slug: "phantom-vest", featureCount: 4 },
];

const trustItems = [
  { icon: ShieldCheck, label: "1-year warranty" },
  { icon: Truck, label: "Free shipping over $75" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Lock, label: "Secure checkout" },
];

export default function ProductsPage() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f6f7f9] to-[#eceef2] text-slate-900">
      {/* Header */}
      <section className="px-5 md:px-8 pt-28 md:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Shop the lineup
              </span>
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Shop<span className="text-primary">.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
              Professional-grade tracking hardware, engineered for the elite. Pick your setup and
              start capturing every sprint and turn.
            </p>
          </motion.div>

          {/* Trust strip */}
          <motion.ul
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3"
          >
            {trustItems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.06]">
                  <Icon className="h-4 w-4 text-primary" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <Brands tone="light" />

      {/* Product grid */}
      <section className="px-5 md:px-8 mt-4 md:mt-8 pb-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {DISPLAY_ORDER.map((d, i) => {
              const product = PRODUCTS[d.slug];
              if (!product) return null;
              return (
                <ProductCard
                  key={d.slug}
                  product={product}
                  display={d}
                  index={i}
                  reduce={Boolean(reduce)}
                />
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductCard({
  product,
  display,
  index,
  reduce,
}: {
  product: Product;
  display: Display;
  index: number;
  reduce: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const purchasable = product.purchasable;
  const priceLabel = purchasable ? formatUsdFromCents(product.priceCents) : "Coming soon";
  const features = (product.inTheBox ?? product.features).slice(0, display.featureCount);
  const cardImage = display.image ?? getPrimaryImage(product);

  function handleAdd() {
    addItem(product, { quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/[0.06] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
    >
      {/* Media panel */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name} details`}
        className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#2b1c46_0%,#12101c_60%,#0b0a12_100%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        {display.badge && (
          <span
            className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
              display.badge.tone === "accent"
                ? "bg-primary text-white"
                : "bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20"
            }`}
          >
            {display.badge.label}
          </span>
        )}

        {cardImage ? (
          <Image
            src={cardImage}
            alt={`${product.name} — ${product.subtitle}`}
            fill
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Shirt className="h-20 w-20 text-white/25 transition-transform duration-500 group-hover:scale-[1.06]" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {product.subtitle}
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">{product.name}</h2>

        {/* Features */}
        <ul className="mt-4 mb-6 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-2.5 w-2.5 text-primary" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Price + actions */}
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-5">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {purchasable ? "Price" : "Availability"}
            </div>
            <div className="text-2xl font-bold text-slate-900">{priceLabel}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {purchasable ? (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-400"
            >
              <Clock className="h-4 w-4" />
              Coming soon
            </button>
          )}

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
