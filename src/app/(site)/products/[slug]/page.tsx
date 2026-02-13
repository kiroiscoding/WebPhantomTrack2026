"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingCart, Check, Shield, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { getProduct, formatUsdFromCents } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const addItem = useCartStore((s) => s.addItem);

  const product = slug ? getProduct(slug) : null;
  if (!product) {
    return (
      <div className="min-h-screen bg-[#b5b5b5] pt-32 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isDark = product.theme === "dark";
  const comingSoon = !product.purchasable;

  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-24 md:pt-10">
      {/* Breadcrumb / Back */}
      <div className="px-6 lg:px-8 max-w-[1400px] mx-auto mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Armory
        </Link>
      </div>

      <section className="px-6 lg:px-8 mb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`aspect-[4/5] md:aspect-[16/10] lg:aspect-square w-full rounded-[40px] overflow-hidden relative shadow-2xl ${product.images[activeImage]}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Placeholder Visuals */}
                  <div
                    className={`w-1/2 h-1/2 rounded-3xl ${
                      isDark
                        ? "bg-white/5 border border-white/10"
                        : "bg-black/5 border border-black/10"
                    }`}
                  />
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-4">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-[20px] ${img} transition-all ${
                      activeImage === idx
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-[#b5b5b5]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-5 flex flex-col h-full">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#050505] text-white rounded-[28px] md:rounded-[40px] p-6 md:p-12 shadow-2xl flex-1"
              >
                {/* Header */}
                <div className="mb-2">
                  <div className="text-primary font-mono text-sm tracking-wider uppercase mb-2">
                    {product.subtitle}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                    {product.name}
                  </h1>
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white/40 text-sm">({product.reviews} Reviews)</span>
                </div>

                {/* Price */}
                <div className="text-4xl font-mono mb-8 border-b border-white/10 pb-8">
                  {comingSoon ? "Coming soon" : formatUsdFromCents(product.priceCents)}
                </div>

                {/* Description */}
                <p className="text-white/70 text-lg leading-relaxed mb-10">{product.description}</p>

                {/* Selectors */}
                <div className="mb-10 space-y-6">
                  <div>
                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3 block">
                      Size
                    </label>
                    <div className="flex gap-3">
                      {["S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-xl font-bold flex items-center justify-center transition-all ${
                            selectedSize === size
                              ? "bg-white text-black"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-4 mb-12">
                  <button
                    type="button"
                    disabled={comingSoon}
                    onClick={() => addItem(product, { quantity: 1, variant: selectedSize })}
                    className="w-full py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-60 disabled:hover:bg-primary disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {comingSoon ? "Coming soon" : `Add to Cart - ${formatUsdFromCents(product.priceCents)}`}
                  </button>
                  <div className="text-center text-white/40 text-sm">
                    {comingSoon ? "This item isn’t available yet." : "Free shipping on orders over $150"}
                  </div>
                </div>

                {/* Value Props */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-8">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield className="w-6 h-6 text-white/20" />
                    <span className="text-xs text-white/40">2-Year Warranty</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Truck className="w-6 h-6 text-white/20" />
                    <span className="text-xs text-white/40">Express Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <RotateCcw className="w-6 h-6 text-white/20" />
                    <span className="text-xs text-white/40">30-Day Returns</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive / Specs Section */}
      <section className="px-6 lg:px-8 mb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Features List */}
            <div className="bg-white p-6 md:p-12 rounded-[28px] md:rounded-[40px]">
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8">WHATS INSIDE.</h3>
              <div className="space-y-6">
                {product.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-lg text-black/80 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Specs */}
            <div className="bg-[#1a1a1a] p-6 md:p-12 rounded-[28px] md:rounded-[40px] text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">TECH SPECS.</h3>
              <div className="space-y-0">
                {product.specs.map((spec, i: number) => (
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

