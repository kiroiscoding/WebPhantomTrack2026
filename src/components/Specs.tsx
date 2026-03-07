"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Smartphone, Zap, Map, BarChart3, type LucideIcon } from "lucide-react";

const APP_PREVIEW_MAX_WIDTH_PX = 360;
const APP_STORE_URL = "https://apps.apple.com/us/app/phantom-track/id6758968140";

const features = [
    { icon: Map,        title: "Heatmap Visuals",  text: "See exactly where you dominate the pitch.", stat: "100%", statLabel: "pitch coverage" },
    { icon: Zap,        title: "Sprint Analysis",  text: "Break down top speeds and acceleration bursts.", stat: "0.1s", statLabel: "precision" },
    { icon: BarChart3,  title: "Pro Metrics",      text: "Compare your stats with professional benchmarks.", stat: "50+", statLabel: "metrics" },
    { icon: Smartphone, title: "Live Sync",        text: "Instant data transfer from device to phone.", stat: "<1s", statLabel: "sync time" },
];

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
    return (
        <span className="tabular-nums">
            {value}{suffix}
        </span>
    );
}

export function Specs() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);
    const isPhoneInView = useInView(phoneRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const phoneY = useTransform(scrollYProgress, [0, 1], [120, -60]);
    const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.2, 0.8]);

    return (
        <section
            ref={sectionRef}
            id="technology"
            className="relative w-full bg-[#060606] overflow-hidden z-10 rounded-t-[40px]"
        >
            {/* Animated grid background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="h-full w-full" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />
            </div>

            {/* Primary glow — follows scroll */}
            <motion.div
                style={{ scale: glowScale }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[160px] pointer-events-none"
            />

            {/* Secondary accent glow */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-5 md:px-10 w-full relative">

                {/* Header area */}
                <div className="pt-20 md:pt-32">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-primary uppercase flex items-center gap-3"
                    >
                        <span className="w-8 h-px bg-primary" />
                        The App
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="mt-5 text-[13vw] sm:text-7xl md:text-[5.5rem] lg:text-[7rem] font-black tracking-tighter text-white leading-[0.85]"
                    >
                        YOUR DATA,<br />
                        <span className="text-primary">UNLEASHED.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        viewport={{ once: true }}
                        className="mt-6 text-sm md:text-base text-white/40 max-w-md leading-relaxed"
                    >
                        Transform raw metrics into actionable insights. Heatmaps, sprint zones, and tactical positioning — all in real-time.
                    </motion.p>
                </div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#0a0a0a] p-5 md:p-6 group hover:bg-white/[0.03] transition-colors"
                        >
                            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                <AnimatedCounter value={f.stat} />
                            </div>
                            <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-wider mt-1 font-medium">{f.statLabel}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main content grid */}
                <div className="mt-14 md:mt-20 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

                    {/* Left: Feature cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <FeatureCard key={f.title} icon={f.icon} title={f.title} text={f.text} index={i} />
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="sm:col-span-2 mt-2"
                        >
                            <a
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full sm:w-auto group relative px-8 py-4 bg-white text-black rounded-full font-bold text-base overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                            >
                                <span className="relative z-10">Download the App</span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="absolute inset-0 z-10 flex items-center justify-center font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Download the App</span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right: Phone mockup with float animation */}
                    <div ref={phoneRef} className="lg:col-span-5 relative flex justify-center lg:justify-end lg:sticky lg:top-28">
                        {/* Animated ring */}
                        <motion.div
                            animate={isPhoneInView ? {
                                scale: [1, 1.1, 1],
                                opacity: [0.1, 0.25, 0.1],
                            } : {}}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-primary/20 pointer-events-none"
                        />

                        {/* Glow behind phone */}
                        <motion.div
                            animate={isPhoneInView ? {
                                opacity: [0.08, 0.2, 0.08],
                            } : {}}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary rounded-full blur-[100px] pointer-events-none"
                        />

                        {/* Phone with parallax float */}
                        <motion.div
                            style={{ maxWidth: APP_PREVIEW_MAX_WIDTH_PX, y: phoneY }}
                            className="relative w-full"
                        >
                            <motion.div
                                animate={isPhoneInView ? { y: [0, -12, 0] } : {}}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/app/screenshots/Newmockup.png"
                                    alt="Phantom Track app preview"
                                    width={718}
                                    height={1440}
                                    className="w-full h-auto select-none"
                                    style={{ filter: "drop-shadow(0 20px 60px rgba(168,85,247,0.15))" }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, text, index }: { icon: LucideIcon; title: string; text: string; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 overflow-hidden"
        >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="mb-4 p-2.5 w-fit rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
                <p className="text-xs text-white/35 leading-relaxed">{text}</p>
            </div>
        </motion.div>
    );
}
