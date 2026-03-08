"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

const HERO_BG_VIDEO = "/videos/TestCanlanVid.mp4";
const HERO_BG_POSTER = "/images/hero-bg.jpg";

const reviews = [
    {
        id: 1,
        text: "I stopped guessing and started seeing the pitch like a pro scout.",
    },
    {
        id: 2,
        text: "Every sprint, every turn captured with precision I haven't seen before.",
    },
    {
        id: 3,
        text: "Battery life that lasts through double sessions. Finally.",
    },
];

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeReview, setActiveReview] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[100svh] w-full overflow-hidden bg-black"
        >
            {/* Background Image with Parallax */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[10%] -bottom-[10%]">
                <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={HERO_BG_POSTER}
                >
                    <source src={HERO_BG_VIDEO} type="video/mp4" />
                </video>
            </motion.div>

            {/* Ambient gradient background (shows when no image) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/55 to-black/50" />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/18 pointer-events-none" />

            {/* Buy Now CTA — top right, desktop only */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute top-8 right-10 z-20 hidden md:block"
            >
                <Link
                    href="/products/tracker-combo"
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold tracking-wide hover:bg-primary hover:text-white transition-colors"
                >
                    Buy Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </motion.div>

            {/* Main content — bottom left editorial layout */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="absolute bottom-0 left-0 right-0 z-10 px-5 md:px-10 pb-10 md:pb-14"
            >
                {/* Headline — full width, large */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[11vw] font-black tracking-tighter text-white leading-[0.85] mb-6 md:mb-8"
                >
                    DATA<br />DRIVEN<span className="text-primary">.</span>
                </motion.h1>

                {/* Bottom row: subtitle left, review right */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-sm md:text-base text-white/50 font-medium max-w-[260px] md:max-w-xs leading-snug"
                    >
                        Elevate your training experience,<br />bringing data to life.
                    </motion.p>

                    {/* Review strip — bottom right */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-col items-start sm:items-end gap-2"
                    >
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                        </div>

                        <div className="h-10 relative w-full sm:w-[280px] md:w-[320px] flex sm:justify-end">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeReview}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-[11px] md:text-xs text-white/50 font-medium leading-snug absolute sm:text-right"
                                >
                                    &quot;{reviews[activeReview].text}&quot;
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-2">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveReview(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        activeReview === index
                                            ? "bg-primary w-5"
                                            : "bg-white/20 hover:bg-white/40 w-1.5"
                                    }`}
                                    aria-label={`Go to review ${index + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

        </section>
    );
}
