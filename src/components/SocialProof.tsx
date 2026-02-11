"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type ReviewItem = {
  type: "review";
  name: string;
  role: string;
  content: string;
  rating: number;
  width: string;
};

type ImageItem = {
  type: "image";
  label: string;
  width: string;
};

type MarqueeItem = ReviewItem | ImageItem;

// Data Source
const baseItems: MarqueeItem[] = [
  { type: "review", name: "Alex M.", role: "Pro Athlete", content: "A total shift in perspective.", rating: 5, width: "w-[300px]" },
  { type: "image", label: "MATCH DAY", width: "w-[400px]" },
  { type: "review", name: "Luca T.", role: "Coach", content: "Metrics that actually matter.", rating: 5, width: "w-[300px]" },
  { type: "review", name: "Sam T.", role: "Data Analyst", content: "Unmatched precision.", rating: 5, width: "w-[350px]" },
  { type: "image", label: "TRAINING", width: "w-[450px]" },
  { type: "review", name: "Sarah K.", role: "Runner", content: "Battery life is phenomenal.", rating: 5, width: "w-[300px]" },
];

// Create offset base sets for variety
const baseRow1 = baseItems;
const baseRow2 = [...baseItems.slice(2), ...baseItems.slice(0, 2)];
const baseRow3 = [...baseItems.slice(4), ...baseItems.slice(0, 4)];

// Quadruple the items for seamless looping (4 sets allows moving 25% safely)
const row1 = [...baseRow1, ...baseRow1, ...baseRow1, ...baseRow1];
const row2 = [...baseRow2, ...baseRow2, ...baseRow2, ...baseRow2];
const row3 = [...baseRow3, ...baseRow3, ...baseRow3, ...baseRow3];

export function SocialProof() {
  return (
    <section id="reviews" className="py-24 bg-[#b5b5b5] overflow-hidden relative">
      <div className="mx-auto max-w-full px-0">
        
        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#050505] mb-16 text-center px-6">
          TRUSTED BY <span className="text-primary">BALLERS</span>
        </h2>

        {/* 3 Infinite Marquee Rows */}
        <div className="flex flex-col gap-8 relative w-full overflow-hidden">
            
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#b5b5b5] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#b5b5b5] to-transparent z-20 pointer-events-none" />

            {/* Row 1: Right */}
            <MarqueeRow items={row1} direction="right" speed={40} />

            {/* Row 2: Left */}
            <MarqueeRow items={row2} direction="left" speed={50} />

            {/* Row 3: Right */}
            <MarqueeRow items={row3} direction="right" speed={45} />
        </div>

      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
}: {
  items: MarqueeItem[];
  direction: "left" | "right";
  speed: number;
}) {
    return (
        <motion.div 
            className="flex gap-6 pl-6 w-max"
            animate={{ x: direction === "right" ? ["-25%", "0%"] : ["0%", "-25%"] }}
            transition={{ 
                duration: speed, 
                repeat: Infinity, 
                ease: "linear" 
            }}
        >
            {items.map((item, index) => (
                <Card key={index} item={item} />
            ))}
        </motion.div>
    )
}

function Card({ item }: { item: MarqueeItem }) {
    if (item.type === "review") {
        return (
            <div className={cn(
                "flex-shrink-0 bg-[#e5e5e5] border border-white/40 p-8 rounded-[32px] flex flex-col justify-between shadow-xl h-[280px]",
                item.width
            )}>
                <div className="mb-4">
                    <div className="flex gap-1 mb-3">
                        {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-xl font-bold text-[#050505] leading-tight">
                        &quot;{item.content}&quot;
                    </p>
                </div>
                <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#050505]/5 flex items-center justify-center text-[#050505] font-bold">
                        {item.name[0]}
                    </div>
                    <div>
                        <div className="font-bold text-[#050505]">{item.name}</div>
                        <div className="text-xs text-[#050505]/50 uppercase tracking-wider">{item.role}</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={cn(
                "flex-shrink-0 rounded-[32px] bg-white overflow-hidden relative group h-[280px] shadow-xl border border-white/40",
                item.width
            )}>
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 group-hover:scale-105 transition-transform duration-700" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center shadow-sm">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-[#050505]/40 font-bold tracking-[0.2em] text-sm">{item.label}</span>
                </div>
            </div>
        );
    }
}
