"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Same footage in two codecs, both hardware-decoded. Browsers only report HEVC
// support when a hardware decoder exists; everyone else gets the H.264 file.
// HEVC (~13MB) is visually identical to the H.264 fallback (~19MB).
const HERO_BG_VIDEO_HEVC = "/videos/TestCanlanVid.hevc.mp4";
const HERO_BG_VIDEO = "/videos/TestCanlanVid.mp4";
const HERO_BG_POSTER = "/images/hero-bg.jpg";

// Entrance animations run in CSS (see .hero-enter in globals.css) so they start
// at first paint instead of waiting for hydration. Same offset/duration/delay/
// easing as the framer-motion tweens they replace.
function heroEnter(fromY: number, duration: number, delay: number): React.CSSProperties {
    return {
        "--hero-from-y": `${fromY}px`,
        "--hero-duration": `${duration}s`,
        "--hero-delay": `${delay}s`,
    } as React.CSSProperties;
}

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [lockedMobileHeight, setLockedMobileHeight] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // Stop decoding the 1080p background video while the hero is off-screen,
    // so the rest of the page scrolls without competing for the GPU.
    useEffect(() => {
        const section = containerRef.current;
        const video = videoRef.current;
        if (!section || !video) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

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
            className="relative w-full overflow-hidden bg-black"
            style={{
                height: lockedMobileHeight ? `${lockedMobileHeight}px` : "100svh",
            }}
        >
            {/* Fetch the poster at top priority so the hero is never a black box */}
            <link rel="preload" as="image" href={HERO_BG_POSTER} fetchPriority="high" />

            {/* Background Image with Parallax */}
            <motion.div
                style={isMobileViewport ? undefined : { y: bgY }}
                className="absolute inset-0 md:-top-[10%] md:-bottom-[10%]"
            >
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={HERO_BG_POSTER}
                >
                    <source src={HERO_BG_VIDEO_HEVC} type='video/mp4; codecs="hvc1.1.6.L120.90"' />
                    <source src={HERO_BG_VIDEO} type="video/mp4" />
                </video>
            </motion.div>

            {/* Ambient gradient background (shows when no image) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/55 to-black/50" />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/18 pointer-events-none" />

            {/* Shop CTA — top right, desktop only */}
            <div
                className="hero-enter absolute top-8 right-10 z-20 hidden md:block"
                style={heroEnter(-10, 0.5, 1)}
            >
                <Link
                    href="/products"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold tracking-wide text-black transition-all hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                >
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Main content — bottom left editorial layout */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-10 px-5 md:px-10 pb-10 md:pb-14"
            >
                {/* Headline — full width, large */}
                <h1
                    style={heroEnter(40, 0.8, 0.3)}
                    className="hero-enter text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[11vw] font-black tracking-tighter text-white leading-[0.85] mb-6 md:mb-8"
                >
                    DATA<br />DRIVEN<span className="text-primary">.</span>
                </h1>

                {/* Bottom row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    {/* Subtitle */}
                    <p
                        style={heroEnter(20, 0.6, 0.6)}
                        className="hero-enter text-sm md:text-base text-white/50 font-medium max-w-[260px] md:max-w-xs leading-snug"
                    >
                        Elevate your training experience,<br />bringing data to life.
                    </p>

                </div>
            </motion.div>

        </section>
    );
}
