"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Check,
  Shield,
  Truck,
  RotateCcw,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import {
  getProduct,
  formatUsdFromCents,
  VEST_SIZE_CHART,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";

// Per-photo crop focus for the gallery (default is centered).
const IMAGE_FOCUS: Record<string, string> = {
  // Keep the ball at the top of the bicycle kick in frame.
  "/products/phantom-vest/BicyclePicture.png": "50% 20%",
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const selectedSizeInfo = VEST_SIZE_CHART.find((row) => row.size === selectedSize);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const product = slug ? getProduct(slug) : null;
  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center text-white/60">
        Loading...
      </div>
    );
  }

  const comingSoon = !product.purchasable;
  const gallery = product.images;
  const activeSrc = gallery[activeImage] ?? gallery[0];
  const hasSizes = product.sizes.length > 0;
  const isVestAccessory = Boolean(product.requiresDevice);
  const combo = getProduct("tracker-combo");
  const freeShippingLabel = `Free shipping on orders over ${formatUsdFromCents(FREE_SHIPPING_THRESHOLD_CENTS)}`;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 md:pt-10">
      <div className="px-6 lg:px-8 max-w-[1400px] mx-auto mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Armory
        </Link>
      </div>

      <section className="px-6 lg:px-8 mb-20 md:mb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-stretch">
            {/* Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full overflow-hidden rounded-[28px] md:rounded-[32px] bg-[#0a0a0a] shadow-2xl min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]"
              >
                {activeSrc ? (
                  <Image
                    key={activeSrc}
                    src={activeSrc}
                    alt={`${product.name} — ${product.imageLabels?.[activeImage] ?? `photo ${activeImage + 1}`}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                    style={{ objectPosition: IMAGE_FOCUS[activeSrc] }}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1/2 h-1/2 rounded-3xl bg-white/5 border border-white/10" />
                  </div>
                )}

                {product.imageLabels?.[activeImage] && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm ring-1 ring-white/15">
                    {product.imageLabels[activeImage]}
                  </span>
                )}
              </motion.div>

              {gallery.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {gallery.map((img, idx) => {
                    const label = product.imageLabels?.[idx];
                    return (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setActiveImage(idx)}
                        aria-label={label ? `Show ${label}` : `Show photo ${idx + 1}`}
                        aria-pressed={activeImage === idx}
                        className={`group/thumb relative flex cursor-pointer flex-col gap-1.5 focus-visible:outline-none`}
                      >
                        <span
                          className={`relative block h-20 w-20 overflow-hidden rounded-2xl transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                            activeImage === idx
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-[#050505]"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover object-center"
                            style={{ objectPosition: IMAGE_FOCUS[img] }}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-5 flex flex-col h-full">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#050505] text-white rounded-[28px] md:rounded-[40px] p-6 md:p-12 shadow-2xl flex-1"
              >
                <div className="mb-2">
                  <div className="text-primary font-mono text-sm tracking-wider uppercase mb-3">
                    {product.subtitle}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                    {product.name}
                  </h1>
                </div>

                {isVestAccessory && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/15">
                      Vest only
                    </span>
                    <span className="text-sm text-white/55">
                      Does not include the tracker · Requires {product.requiresDevice}
                    </span>
                  </div>
                )}

                {/* Stars only — no review count until real reviews exist */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-8" aria-label={`Rated ${product.rating} out of 5`}>
                    <div className="flex text-primary" aria-hidden="true">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating) ? "fill-current" : "fill-transparent opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-4xl font-mono mb-8 border-b border-white/10 pb-6">
                  {comingSoon ? "Coming soon" : formatUsdFromCents(product.priceCents)}
                </div>

                {/* Size picker + guide */}
                {hasSizes && !comingSoon && (
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-bold text-white/40 uppercase tracking-widest">
                        Size
                      </label>
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen((v) => !v)}
                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primary hover:text-purple-300 transition-colors"
                        aria-expanded={sizeGuideOpen}
                      >
                        Size guide
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${sizeGuideOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    <div className="flex gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`h-12 w-12 cursor-pointer rounded-xl font-bold flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            selectedSize === size
                              ? "bg-white text-black"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {selectedSizeInfo && (
                      <p className="text-sm font-semibold text-white/80">
                        Chest band circumference: {selectedSizeInfo.bandCm} ({selectedSizeInfo.bandIn})
                      </p>
                    )}

                    <AnimatePresence initial={false}>
                      {sizeGuideOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-white/40 text-xs uppercase tracking-wider">
                                  <th className="pb-2 pr-2 font-semibold">Size</th>
                                  <th className="pb-2 pr-2 font-semibold">Band</th>
                                  <th className="pb-2 pr-2 font-semibold">Chest</th>
                                  <th className="pb-2 pr-2 font-semibold">Height</th>
                                  <th className="pb-2 font-semibold">Weight</th>
                                </tr>
                              </thead>
                              <tbody>
                                {VEST_SIZE_CHART.map((row) => (
                                  <tr
                                    key={row.size}
                                    className={`border-t border-white/10 ${
                                      selectedSize === row.size ? "text-white" : "text-white/70"
                                    }`}
                                  >
                                    <td className="py-2.5 pr-2 font-bold">{row.size}</td>
                                    <td className="py-2.5 pr-2 font-mono text-xs whitespace-nowrap">
                                      {row.bandCm}
                                      <span className="hidden sm:inline"> ({row.bandIn})</span>
                                    </td>
                                    <td className="py-2.5 pr-2 font-mono text-xs whitespace-nowrap">{row.chest}</td>
                                    <td className="py-2.5 pr-2 text-xs whitespace-nowrap">{row.height}</td>
                                    <td className="py-2.5 text-xs whitespace-nowrap">{row.weight}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* CTA + trust */}
                <div className="space-y-4 mb-8">
                  <button
                    type="button"
                    disabled={comingSoon}
                    onClick={() =>
                      addItem(product, {
                        quantity: 1,
                        variant: hasSizes ? selectedSize : undefined,
                      })
                    }
                    className="w-full cursor-pointer py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {comingSoon
                      ? "Coming soon"
                      : `Add to Cart - ${formatUsdFromCents(product.priceCents)}`}
                  </button>

                  <div className="text-center text-white/40 text-sm">
                    {comingSoon ? "This item isn’t available yet." : freeShippingLabel}
                  </div>

                  {!comingSoon && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {product.requiresDevice && (
                        <li className="flex items-start gap-2 text-sm text-white/70 sm:col-span-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          Fits {product.requiresDevice}
                        </li>
                      )}
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        30-day returns
                      </li>
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        1-year warranty
                      </li>
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        Machine washable
                      </li>
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {freeShippingLabel.replace("Free shipping on orders over ", "Free ship over ")}
                      </li>
                    </ul>
                  )}
                </div>

                {/* Cross-sell to combo when buying vest alone */}
                {isVestAccessory && combo?.purchasable && (
                  <Link
                    href={`/products/${combo.slug}`}
                    className="group mt-2 flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#111]">
                      {combo.images[0] && (
                        <Image
                          src={combo.images[0]}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Need the full kit?
                      </div>
                      <div className="truncate font-bold text-white">{combo.name}</div>
                      <div className="text-sm text-white/50">
                        Tracker + vest · {formatUsdFromCents(combo.priceCents)}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="px-6 lg:px-8 mb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111111] border border-white/10 p-6 md:p-12 rounded-[28px] md:rounded-[40px]">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">WHATS INSIDE.</h3>
              <div className="space-y-6">
                {(product.inTheBox ?? product.features).map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-lg text-white/80 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 md:p-12 rounded-[28px] md:rounded-[40px] text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">TECH SPECS.</h3>
              <div className="space-y-0">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 border-b border-white/10 last:border-0"
                  >
                    <span className="text-white/60">{spec.label}</span>
                    <span className="font-mono font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
