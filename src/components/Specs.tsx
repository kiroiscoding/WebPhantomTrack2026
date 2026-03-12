"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Map, Download, ArrowRight, Brain, Users, Star } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/us/app/phantom-track/id6758968140";

const appHighlights = [
    { title: "AI Coaching", description: "Personalized training insights", icon: Brain },
    { title: "Friends & Team Stats", description: "Compare performance with teammates", icon: Users },
    { title: "Session Heatmaps", description: "Visualize your movement on the pitch", icon: Map },
];

export function Specs() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const phonesRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const springY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const phonesY = useTransform(springY, [0, 1], [40, -40]);

    return (
        <section
            ref={sectionRef}
            id="technology"
            className="relative w-full bg-[#030303] overflow-hidden z-10 rounded-t-[40px] md:rounded-t-[60px] border-t border-white/[0.05]"
        >
            {/* --- Cohesive Background Elements --- */}
            {/* Top-down subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#030303] pointer-events-none" />
            
            {/* Animated Dot Matrix Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
            }} />

            {/* Glowing Orbs */}
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/[0.04] rounded-full blur-[150px] pointer-events-none" />

            <div className="mx-auto max-w-[1400px] px-5 md:px-10 w-full relative z-10">

                {/* === SHOWCASE STAGE === */}
                <div className="relative pt-24 md:pt-32 lg:pt-36 pb-16 lg:pb-24 flex flex-col lg:block min-h-[auto] lg:min-h-[880px] xl:min-h-[960px]">
                    
                    {/* Desktop Left Text - Anchored Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="lg:absolute left-0 lg:-left-4 xl:-left-12 top-[12%] xl:top-[16%] z-20 max-w-[480px] mb-12 lg:mb-0"
                    >
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "32px" }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="h-px bg-primary w-8" />
                            <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-primary uppercase whitespace-nowrap">
                                The App
                            </p>
                        </motion.div>

                        <h2 className="text-[12vw] sm:text-6xl lg:text-[4.2rem] xl:text-[5.5rem] font-black tracking-tighter text-white leading-[0.9]">
                            YOUR DATA,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-400 pr-2 -mr-2">UNLEASHED</span><span className="text-white">.</span>
                        </h2>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-black rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                            >
                                <Download className="w-4 h-4" />
                                <span className="relative z-10">Download App</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2.5 font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Download className="w-4 h-4" />
                                    Download App
                                </span>
                            </a>
                            <a
                                href="#features"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm tracking-wide text-white/70 border border-white/10 hover:border-primary/50 hover:bg-primary/5 hover:text-white transition-all duration-300"
                            >
                                See How It Works
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Desktop Right Text - Anchored Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="lg:absolute right-0 lg:-right-4 xl:-right-12 top-[55%] xl:top-[60%] lg:-translate-y-1/2 z-20 w-full lg:w-[340px] xl:w-[400px] mt-12 lg:mt-0 order-last lg:order-none"
                    >
                        <p className="text-sm xl:text-base text-white/50 leading-relaxed lg:text-right mb-8 max-w-md lg:ml-auto">
                            AI coaching, match analytics, and team insights — all in one performance app designed for the modern baller.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            {appHighlights.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ x: -6, scale: 1.02 }}
                                        className="group flex items-center gap-4 bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.04] p-3 xl:p-4 rounded-2xl hover:border-primary/30 hover:from-primary/[0.05] hover:to-transparent transition-all duration-300 w-full backdrop-blur-md shadow-xl cursor-default"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center text-white/70 group-hover:text-primary transition-all duration-300 flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:shadow-[inset_0_1px_5px_rgba(168,85,247,0.3)]">
                                            <Icon className="w-5 h-5 xl:w-6 xl:h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-sm xl:text-base tracking-wide group-hover:text-primary transition-colors">{item.title}</div>
                                            <p className="text-xs xl:text-sm text-white/40 mt-0.5 leading-snug">{item.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Center Image - The Stage */}
                    <div ref={phonesRef} className="relative z-10 flex justify-center w-full mx-auto my-8 lg:my-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 pointer-events-none">
                        {/* A soft pedestal glow directly under the phone to anchor it */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />
                        
                        <motion.div
                            style={{ y: phonesY }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="relative w-full max-w-[360px] md:max-w-[440px] lg:max-w-[500px]"
                        >
                            <Image
                                src="/app/screenshots/newPhotosAPP.png"
                                alt="Phantom Track app — performance dashboard and match analysis"
                                width={1400}
                                height={1800}
                                className="w-full h-auto select-none drop-shadow-2xl"
                                priority
                            />
                        </motion.div>
                    </div>
                </div>

                {/* === BOTTOM: App Store trust strip === */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="pb-20 md:pb-28 pt-8 lg:pt-0 relative z-20"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-14">
                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <span className="text-sm text-white/50 font-medium">5.0 on the App Store</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-5 bg-white/10" />

                        {/* Downloads */}
                        <div className="flex items-center gap-2.5">
                            <Download className="w-4 h-4 text-primary" />
                            <span className="text-sm text-white/50 font-medium">Free on iOS</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-5 bg-white/10" />

                        {/* CTA */}
                        <a
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors"
                        >
                            Get the App
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
