"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ArrowRight } from "lucide-react";

const HERO_BG_IMAGE = "/images/hero-bg.jpg";

const reviews = [
    {
        id: 1,
        text: "completely changed how I see the game. I stopped guessing and started seeing the pitch like a pro scout.",
    },
    {
        id: 2,
        text: "The accuracy is unreal. Every sprint, every turn is captured with precision I haven't seen before.",
    },
    {
        id: 3,
        text: "Battery life that actually lasts through double sessions. Finally, tech that keeps up with the schedule.",
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
    const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            {/* Background Image with Parallax */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[10%] -bottom-[10%]">
                <Image
                    src={HERO_BG_IMAGE}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </motion.div>

            {/* Buy Now CTA — top right */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute top-6 md:top-8 right-6 md:right-10 z-20"
            >
                <Link
                    href="/products/tracker-combo"
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold tracking-wide hover:bg-primary hover:text-white transition-colors"
                >
                    Buy Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </motion.div>

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90 pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
            >
                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xs md:text-sm font-mono tracking-[0.3em] text-primary uppercase mb-6"
                >
                    Phantom Track
                </motion.p>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.85]"
                >
                    DATA DRIVEN<span className="text-primary">.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-6 text-base md:text-lg text-white/50 font-medium max-w-md"
                >
                    Elevate your training experience, bringing data to life.
                </motion.p>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-12"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-5 h-5 text-white/30" />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Review Strip — pinned to bottom */}
            <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-20 flex flex-col items-center gap-3 px-6">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 fill-primary text-primary" />
                    ))}
                </div>

                <div className="h-12 md:h-14 relative w-full max-w-md flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={activeReview}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs md:text-sm text-white/60 font-medium leading-relaxed text-center absolute"
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
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                activeReview === index
                                    ? "bg-primary w-5"
                                    : "bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Go to review ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

        </section>
    );
}
