"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Reuse the same nav items as the header menu (Navbar).
const navItems = [
    { name: "App", href: "/app" },
    { name: "About us", href: "/about" },
    { name: "Support", href: "/support" },
];

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.77a4.85 4.85 0 01-1-.08z" />
        </svg>
    );
}

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
        <footer className="relative w-full overflow-hidden z-10 rounded-t-[40px] md:rounded-t-[60px] bg-[#0a0a0a] border-t border-white/[0.06]">
            {/* === CTA: text on the left, large device bleeding off the right === */}
            <div className="relative w-full overflow-hidden">
                {/* Text (comes first so it stacks above the image on mobile) */}
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

                {/* Device beauty still.
                    Mobile: full-width banner below the copy.
                    Desktop: large, anchored right, bleeding off the edge. */}
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
                        priority
                        quality={100}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover object-center select-none"
                    />

                    {/* Desktop: long, soft fade over the empty gap on the left so the
                        image edge dissolves into the background (no hard seam). */}
                    <div
                        aria-hidden
                        className="hidden lg:block absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0a] to-transparent"
                    />
                    {/* Desktop: gentle top/bottom feather */}
                    <div
                        aria-hidden
                        className="hidden lg:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent"
                    />
                    <div
                        aria-hidden
                        className="hidden lg:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent"
                    />
                    {/* Mobile: top/bottom blend (edges are at the viewport sides) */}
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

            <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
                {/* === Utility footer row === */}
                <motion.div
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="border-t border-white/10 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
                >
                    {/* Logo / wordmark */}
                    <Link href="/" aria-label="Phantom Track home" className="flex-shrink-0">
                        <Image
                            src="/logo_light.png"
                            alt="Phantom Track"
                            width={320}
                            height={36}
                            unoptimized
                            className="h-7 w-auto object-contain"
                        />
                    </Link>

                    {/* Nav links */}
                    <nav className="flex flex-wrap items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Social icons */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/phantomtrackofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Phantom Track on Instagram"
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <InstagramIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.x.com/phantomtrackco"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Phantom Track on X"
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <XIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@phantomtrackofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Phantom Track on TikTok"
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <TikTokIcon className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>

                <div className="pb-8">
                    <p className="text-xs text-white/40">© 2026 Phantom Track LLC</p>
                </div>
            </div>
        </footer>
    );
}
