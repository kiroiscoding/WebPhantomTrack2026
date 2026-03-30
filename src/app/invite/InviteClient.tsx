"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE, delay: i * 0.12 },
    }),
};

export default function InviteClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");

    const [phase, setPhase] = useState<"opening" | "fallback">("opening");

    useEffect(() => {
        if (!code) {
            router.replace("/");
            return;
        }

        // Fire deep link immediately
        window.location.href = `phantomtrack://invite?code=${code}`;

        // After 2s, show fallback UI
        const timer = setTimeout(() => setPhase("fallback"), 2000);
        return () => clearTimeout(timer);
    }, [code, router]);

    // No code = redirecting, show nothing
    if (!code) return null;

    return (
        <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#050505] flex flex-col">

            {/* Layered overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050505 0%, transparent 45%)" }} />

            {/* Purple glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-sm rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-[100dvh] px-5 pb-8">

                {/* Logo */}
                <motion.div
                    className="flex items-center justify-center pt-12 pb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo_light.png"
                        alt="Phantom Track"
                        className="h-7 w-auto opacity-90"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                </motion.div>

                {/* Center content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-8">
                    <AnimatePresence mode="wait">
                        {phase === "opening" ? (
                            <motion.div
                                key="opening"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.5, ease: EASE }}
                                className="flex flex-col items-center gap-5"
                            >
                                <p className="text-white/70 text-lg font-semibold tracking-tight">
                                    Opening Phantom Track...
                                </p>
                                {/* Three pulsing dots */}
                                <div className="flex items-center gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-primary/70"
                                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                                            transition={{
                                                duration: 1.2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="fallback"
                                className="flex flex-col items-center gap-4"
                            >
                                <motion.div
                                    custom={0}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[11px] font-semibold tracking-widest uppercase text-primary/80">Invite</span>
                                </motion.div>

                                <motion.h1
                                    custom={1}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight max-w-xs"
                                >
                                    You&apos;ve been invited to{" "}
                                    <span className="text-primary">Phantom&nbsp;Track</span>
                                </motion.h1>

                                <motion.p
                                    custom={2}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="text-white/50 text-base max-w-xs leading-relaxed"
                                >
                                    Track your soccer performance. Compare yourself to the pros.
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action cards — only shown in fallback */}
                <AnimatePresence>
                    {phase === "fallback" && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                            className="flex flex-col gap-3 w-full max-w-sm mx-auto"
                        >
                            {/* Open in App */}
                            <a
                                href={`phantomtrack://invite?code=${code}`}
                                className="group relative w-full inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all px-6 py-5 bg-primary text-white rounded-2xl text-base active:scale-[0.98]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative">Open in App</span>
                                <ChevronRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>

                            {/* Download on App Store */}
                            <Link
                                href="https://apps.apple.com/us/app/phantom-track/id6758968140"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm active:scale-[0.98] transition-all duration-200 hover:border-white/20 hover:bg-white/[0.09]"
                            >
                                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-primary" viewBox="0 0 814 1000" fill="currentColor">
                                        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-157.5-127.8c-45-74.6-81.9-193.7-81.9-307.1 0-197.5 129-302 255.8-302 64.4 0 117.9 42.2 158.4 42.2 39.2 0 100.7-44.7 173.7-44.7 28 0 130.1 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-white font-semibold text-base leading-tight">Download on the App Store</p>
                                    <p className="text-white/40 text-xs mt-0.5">Free on iOS</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <motion.p
                    custom={5}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="text-center text-white/20 text-[11px] mt-6 tracking-wide"
                >
                    phantom-track.com
                </motion.p>
            </div>
        </div>
    );
}
