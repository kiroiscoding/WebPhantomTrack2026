"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function GrandFinale() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

    return (
        <section ref={containerRef} className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden pt-32 pb-20 -mt-20 z-10 rounded-t-[60px]">

            {/* Background Pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">

                {/* The Monolith - Product Reveal */}
                <motion.div
                    style={{ scale, opacity }}
                    className="mb-12 relative w-[300px] md:w-[500px] aspect-square"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-20" />
                    <div className="w-full h-full bg-[#111] rounded-[60px] border border-white/5 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                        {/* Device Texture */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/90" />

                        {/* Center "Eye" */}
                        <div className="relative w-32 h-32 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_20px_#a855f7]" />
                        </div>
                    </div>
                </motion.div>

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
                    className="text-white/50 text-xl md:text-2xl font-medium max-w-lg mb-12"
                >
                    Precision is not for everyone.<br />It is for you.
                </motion.p>

                {/* Static Button (Removed Magnetic Effect) */}
                <Link href="/products/tracker-combo" className="group relative px-12 py-6 bg-white text-black rounded-full font-bold text-lg tracking-widest overflow-hidden hover:bg-gray-200 transition-colors inline-block">
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
