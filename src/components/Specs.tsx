"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Smartphone, Zap, Map, BarChart3, type LucideIcon } from "lucide-react";

// Easy sizing knob for the homepage app preview (keeps aspect ratio).
// Change this one value to scale the preview up/down.
const APP_PREVIEW_MAX_WIDTH_PX = 400;

export function Specs() {
    return (
        <section id="technology" className="relative min-h-screen w-full bg-[#b5b5b5] flex items-center py-20 pt-32 overflow-visible z-10 rounded-t-[40px] -mt-10">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-8"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#050505] leading-[0.9]">
                            YOUR DATA,<br />
                            <span className="text-primary">UNLEASHED.</span>
                        </h2>
                        <p className="text-xl text-[#050505]/70 max-w-lg leading-relaxed">
                            The Phantom Track App transforms raw metrics into actionable insights. Analyze heatmaps, sprint zones, and tactical positioning in real-time.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            <FeatureItem
                                icon={Map}
                                title="Heatmap Visuals"
                                text="See exactly where you dominate the pitch."
                            />
                            <FeatureItem
                                icon={Zap}
                                title="Sprint Analysis"
                                text="Break down top speeds and acceleration bursts."
                            />
                            <FeatureItem
                                icon={BarChart3}
                                title="Pro Metrics"
                                text="Compare your stats with professional benchmarks."
                            />
                            <FeatureItem
                                icon={Smartphone}
                                title="Live Sync"
                                text="Instant data transfer from device to phone."
                            />
                        </div>

                        <div className="mt-8">
                            <button className="px-8 py-4 bg-[#050505] text-white rounded-full font-bold text-lg hover:bg-primary transition-colors shadow-lg hover:shadow-xl">
                                Download the App
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 10 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* App preview (PNG with transparency) */}
                        <div
                            className="w-full"
                            style={{ maxWidth: APP_PREVIEW_MAX_WIDTH_PX }}
                        >
                            <Image
                                src="/app/screenshots/Newmockup.png"
                                alt="Phantom Track app preview"
                                width={718}
                                height={1440}
                                className="w-full h-auto select-none"
                                priority={false}
                            />
                        </div>

                        {/* Floating Badge removed */}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-[#050505]/5 text-primary">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-[#050505]">{title}</h4>
                <p className="text-sm text-[#050505]/60 leading-tight">{text}</p>
            </div>
        </div>
    )
}
