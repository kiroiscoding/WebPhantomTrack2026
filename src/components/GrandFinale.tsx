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

            <div className="relative z-10 w-full mt-14 md:mt-20">
                <ExplodingView3D embedded />
            </div>

            <div className="mt-14 text-center text-white/25 text-xs tracking-[0.5em] font-mono">
                PHANTOM TRACK // ELITE SERIES
            </div>
        </section>
    );
}
