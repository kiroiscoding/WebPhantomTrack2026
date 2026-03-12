"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WaitlistForm } from "@/components/WaitlistForm";

const FINALE_BACKGROUND_VIDEO = "/videos/TestCanlanVid.mp4";
const FINALE_VIDEO_POSTER = "/websiteBottomNEWEST.png";

export function GrandFinale() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [lockedMobileHeight, setLockedMobileHeight] = useState<number | null>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");

        const updateViewportMode = () => {
            const mobile = mediaQuery.matches;
            setIsMobileViewport(mobile);

            // Lock height on mobile to avoid Chrome URL bar resize jank.
            if (mobile) {
                setLockedMobileHeight(window.innerHeight);
                return;
            }

            setLockedMobileHeight(null);
        };

        updateViewportMode();
        mediaQuery.addEventListener("change", updateViewportMode);
        window.addEventListener("orientationchange", updateViewportMode);

        return () => {
            mediaQuery.removeEventListener("change", updateViewportMode);
            window.removeEventListener("orientationchange", updateViewportMode);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full bg-[#050505] flex items-center justify-center overflow-hidden pt-32 pb-20 mt-16 z-10 rounded-t-[60px]"
            style={{
                minHeight: lockedMobileHeight ? `${lockedMobileHeight}px` : "100svh",
            }}
        >
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
                    style={isMobileViewport ? undefined : { y }}
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

                {/* Waitlist CTA */}
                <div className="w-full max-w-lg">
                    <WaitlistForm variant="finale" />
                </div>

                {/* Footer Signature - Moved relative below button */}
                <div className="mt-12 text-center text-white/20 text-xs tracking-[0.5em] font-mono">
                    PHANTOM TRACK // ELITE SERIES
                </div>

            </div>

        </section>
    );
}
