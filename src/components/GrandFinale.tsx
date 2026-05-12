"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ExplodingView3D } from "@/components/ExplodingView3D";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function GrandFinale() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-60, 0]);

    return (
        <section
            ref={containerRef}
            className="relative w-full flex flex-col items-center overflow-hidden pt-32 pb-24 mt-16 z-10 rounded-t-[60px] bg-[#141414]"
        >
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-6">
                <motion.h2
                    style={{ y }}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="text-[10vw] md:text-[8vw] leading-none font-bold tracking-tighter text-white whitespace-nowrap text-center mb-12"
                >
                    JOIN THE <span className="text-primary">1%</span>.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                    className="w-full max-w-2xl"
                >
                    <WaitlistForm variant="finale" />
                </motion.div>
            </div>

            {/* 3D model stage */}
            <div className="relative z-10 w-full mt-14 md:mt-20">
                {/* Purple glow aura behind the model */}
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    aria-hidden
                >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full bg-primary/10 blur-[80px]" />
                </div>

                {/* Decorative concentric rings */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                    aria-hidden
                >
                    <div className="absolute w-[320px] h-[320px] md:w-[440px] md:h-[440px] rounded-full border border-white/[0.04]" />
                    <div className="absolute w-[460px] h-[460px] md:w-[600px] md:h-[600px] rounded-full border border-white/[0.03]" />
                    <div className="absolute w-[600px] h-[600px] md:w-[760px] md:h-[760px] rounded-full border border-white/[0.02]" />
                </div>

                <div className="relative z-10">
                    <ExplodingView3D embedded />
                </div>

                {/* Drag-to-rotate hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="relative z-10 flex items-center justify-center gap-2 mt-4 md:mt-6"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-white/30"
                    >
                        <path
                            d="M2 8h12M10 4l4 4-4 4M6 4L2 8l4 4"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="text-white/30 text-xs tracking-[0.3em] font-mono uppercase">
                        Drag to explore
                    </span>
                </motion.div>
            </div>

            <div className="mt-14 text-center text-white/25 text-xs tracking-[0.5em] font-mono">
                PHANTOM TRACK // ELITE SERIES
            </div>
        </section>
    );
}
