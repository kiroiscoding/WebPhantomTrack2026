"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FINALE_BACKGROUND_VIDEO = "/videos/TestCanlanVid.mp4";
const FINALE_VIDEO_POSTER = "/websiteBottomNEWEST.png";

export function GrandFinale() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    return (
        <section ref={containerRef} className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden pt-32 pb-20 mt-16 z-10 rounded-t-[60px]">
            {/* Full-bleed background video */}
            <div className="absolute inset-0">
                <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={FINALE_VIDEO_POSTER}
                >
                    <source src={FINALE_BACKGROUND_VIDEO} type="video/mp4" />
                </video>
            </div>

            {/* Readability overlays */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/18" />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                {/* Typography */}
                <motion.h2
                    style={{ y }}
                    className="text-[12vw] md:text-[10vw] leading-[0.8] font-bold tracking-tighter text-white mb-8 mix-blend-difference"
                >
                    JOIN THE <span className="text-primary">1%</span>.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/50 text-base md:text-2xl font-medium max-w-lg mb-8 md:mb-12"
                >
                    Precision is not for everyone.<br />It is for you.
                </motion.p>

                {/* Static Button (Removed Magnetic Effect) */}
                <Link href="/products/tracker-combo" className="group relative px-8 py-4 md:px-12 md:py-6 bg-white text-black rounded-full font-bold text-base md:text-lg tracking-widest overflow-hidden hover:bg-gray-200 transition-colors inline-block">
                    <span className="relative z-10 flex items-center gap-2">
                        SECURE YOURS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div
                        className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    />
                </Link>

                {/* Footer Signature - Moved relative below button */}
                <div className="mt-12 text-center text-white/20 text-xs tracking-[0.5em] font-mono">
                    PHANTOM TRACK // ELITE SERIES
                </div>

            </div>

        </section>
    );
}
