"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function GrandFinale() {
    const reduce = useReducedMotion();

    const containerV: Variants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: reduce ? 0 : 0.12,
                delayChildren: reduce ? 0 : 0.05,
            },
        },
    };

    const itemV: Variants = {
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    };

    const headlineV: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
    };

    const lineV: Variants = {
        hidden: reduce ? { opacity: 0 } : { y: "115%" },
        show: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.7, ease: EASE },
        },
    };

    const headlineLines = ["THE DATA IS", "IN YOUR", "HANDS"];

    return (
        <section className="relative w-full overflow-hidden z-10 rounded-t-[40px] md:rounded-t-[60px] bg-[#0a0a0a] border-t border-white/[0.06]">
            <div className="relative w-full overflow-hidden">
                <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:min-h-[700px] xl:min-h-[760px] flex items-center">
                    <motion.div
                        variants={containerV}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex flex-col items-start text-left max-w-xl pt-20 pb-10 lg:py-24"
                    >
                        <motion.div variants={itemV} className="flex items-center gap-3 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            <p className="text-xs font-mono tracking-[0.3em] text-primary uppercase">
                                Phantom Track // Elite Series
                            </p>
                        </motion.div>

                        <motion.h2
                            variants={headlineV}
                            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.88]"
                        >
                            {headlineLines.map((lineText, i) => (
                                <span key={lineText} className="block overflow-hidden pb-[0.06em]">
                                    <motion.span variants={lineV} className="block">
                                        {lineText}
                                        {i === headlineLines.length - 1 && (
                                            <span className="text-primary">.</span>
                                        )}
                                    </motion.span>
                                </span>
                            ))}
                        </motion.h2>

                        <motion.p variants={itemV} className="mt-6 text-sm md:text-base text-white/60">
                            Pro-grade GPS performance tracking. Available now.
                        </motion.p>

                        <motion.div variants={itemV} className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                            <Link
                                href="/products"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-bold text-base tracking-wide transition-all hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                            >
                                Shop Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/products/tracker-combo"
                                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-base tracking-wide text-white border border-white/15 hover:bg-white/10 transition-colors"
                            >
                                View the Tracker
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 70, scale: 0.97 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-[300px] sm:h-[400px] w-full overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[60%] xl:w-[56%]"
                >
                    <Image
                        src="/productImage.png"
                        alt="Phantom Track device — Elite Series performance tracker"
                        fill
                        quality={100}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover object-center select-none"
                    />

                    <div
                        aria-hidden
                        className="hidden lg:block absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0a] to-transparent"
                    />
                    <div
                        aria-hidden
                        className="hidden lg:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent"
                    />
                    <div
                        aria-hidden
                        className="hidden lg:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent"
                    />
                    <div
                        aria-hidden
                        className="lg:hidden absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent"
                    />
                    <div
                        aria-hidden
                        className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent"
                    />
                </motion.div>
            </div>
        </section>
    );
}
