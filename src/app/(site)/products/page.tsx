"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart, Eye } from "lucide-react";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      {/* Hero Section */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <h1 className="text-[10vw] lg:text-[12vw] leading-[0.8] font-bold tracking-tighter text-[#050505] mb-8">
              THE ARMORY<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#050505]/70 max-w-2xl mx-auto font-medium">
              Professional grade hardware. Engineered for the elite.
            </p>
          </motion.div>

          <div className="space-y-32 mb-32">
            {/* Product 1: Tracker Combo */}
            <ProductSection
              title="TRACKER COMBO"
              price="$120.00"
              desc="The complete ecosystem. Includes the Gen-2 Phantom Core, Elite Vest, and lifetime app access. Everything you need to start tracking immediately."
              features={[
                "1000Hz GNSS Module",
                "Elite Compression Vest",
                "Magnetic Charging Dock",
                "Unlimited Cloud Storage",
              ]}
              link="/products/tracker-combo"
              hideCart={true}
              imagePlaceholder={
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-64 h-80 bg-[#1a1a1a] rounded-[32px] border border-white/10 shadow-2xl relative z-10 flex flex-col items-center justify-center p-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="w-32 h-48 bg-black rounded-2xl border border-white/5 relative z-20" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-[100px]" />
                </div>
              }
              theme="dark"
            />

            {/* Product 2: Phantom Vest */}
            <ProductSection
              title="PHANTOM VEST"
              price="$35.00"
              desc="A replacement vest for your growing team or personal rotation. Ultra-lightweight, sweat-wicking, and designed for maximum signal reception."
              features={[
                "Surgical-Grade Elastane",
                "Anti-Slip Silicone Grip",
                "Machine Washable",
                "Unisex Ergonomic Fit",
              ]}
              link="/products/phantom-vest"
              hideCart={true}
              imagePlaceholder={
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-[300px] h-[400px] bg-[#e5e5e5] rounded-[40px] shadow-xl flex items-center justify-center relative z-10">
                    {/* Abstract Vest Shape */}
                    <div className="w-48 h-64 bg-[#d4d4d4] rounded-[20px] relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#e5e5e5] rounded-b-full" />
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/10 rounded-sm" />
                    </div>
                  </div>
                </div>
              }
              theme="light"
              reversed
            />

            {/* Product 3: Apparel */}
            <ProductSection
              title="APPAREL"
              price="Coming soon"
              desc="Performance wear that keeps up. Moisture-wicking drill top and shorts designed for high-intensity sessions."
              features={[
                "4-Way Stretch Fabric",
                "Thermal Regulation",
                "Reflective Detailing",
                "Quick-Dry Technology",
              ]}
              link="/products/apparel"
              hideCart={true}
              imagePlaceholder={
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative z-10 flex gap-4">
                    <div className="w-48 h-64 bg-[#1a1a1a] rounded-2xl shadow-2xl rotate-[-6deg] translate-y-4" />
                    <div className="w-48 h-64 bg-[#262626] rounded-2xl shadow-2xl rotate-[6deg] -translate-y-4" />
                  </div>
                </div>
              }
              theme="dark"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductSection({
  title,
  price,
  desc,
  features,
  imagePlaceholder,
  theme = "dark",
  reversed = false,
  link,
  hideCart = false,
}: {
  title: string;
  price: string;
  desc: string;
  features: string[];
  imagePlaceholder: React.ReactNode;
  theme?: "dark" | "light";
  reversed?: boolean;
  link?: string;
  hideCart?: boolean;
}) {
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#050505]" : "bg-[#e5e5e5]";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-white/60" : "text-black/60";

  return (
    <div
      className={`group relative rounded-[40px] overflow-hidden ${bgColor} ${textColor} min-h-[600px] flex flex-col lg:flex-row`}
    >
      {/* Content Side */}
      <div
        className={`flex-1 p-8 md:p-16 flex flex-col justify-center relative z-10 ${
          reversed ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{title}</h2>
        {price && <div className="text-2xl font-mono text-primary mb-8">{price}</div>}
        <p className={`text-lg md:text-xl ${subTextColor} mb-12 max-w-md leading-relaxed`}>{desc}</p>
        <div className="space-y-4 mb-12">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full ${
                  isDark ? "bg-white/10" : "bg-black/10"
                } flex items-center justify-center`}
              >
                <Check className="w-3 h-3" />
              </div>
              <span className="font-medium opacity-80">{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          {!hideCart && (
            <button
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 ${
                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          )}
          {link && (
            <Link
              href={link}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 border ${
                isDark
                  ? "border-white/20 hover:bg-white/10 text-white"
                  : "border-black/20 hover:bg-black/5 text-black"
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>View</span>
            </Link>
          )}
        </div>
      </div>

      {/* Image Side */}
      <div
        className={`flex-1 min-h-[400px] lg:min-h-auto relative overflow-hidden ${
          reversed ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-black/5 to-transparent"
          }`}
        />
        {imagePlaceholder}
      </div>
    </div>
  );
}

