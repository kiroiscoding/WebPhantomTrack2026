"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronRight, ArrowRight, Check, Loader2, Users, X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE, delay: i * 0.12 },
    }),
};

function WaitlistInline() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [count, setCount] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        fetch("/api/waitlist")
            .then((r) => r.json())
            .then((d) => setCount(d.count ?? null))
            .catch(() => {});
    }, []);

    React.useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim() || status === "loading") return;
        setStatus("loading");
        setMessage("");
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) { setStatus("error"); setMessage(data.error ?? "Something went wrong."); return; }
            setStatus("success");
            setMessage(data.message ?? "You're on the list.");
            if (data.count != null) setCount(data.count);
            if (!data.alreadyJoined) setEmail("");
        } catch {
            setStatus("error");
            setMessage("Network error. Try again.");
        }
    }

    return (
        <div className="w-full pt-1">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3 py-2"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-white font-semibold text-base">{message}</p>
                        {count != null && (
                            <span className="text-white/40 text-xs flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-primary/60" />
                                {count} people on the waitlist
                            </span>
                        )}
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3"
                    >
                        <input
                            ref={inputRef}
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                            placeholder="your@email.com"
                            required
                            className={`w-full bg-white/[0.07] border text-white placeholder:text-white/30 font-medium outline-none transition-all duration-200 focus:border-primary/60 focus:bg-white/[0.1] px-5 py-4 rounded-2xl text-base ${status === "error" ? "border-red-500/50" : "border-white/10"}`}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="group relative w-full inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all disabled:opacity-60 px-6 py-4 bg-primary text-white rounded-2xl text-base active:scale-[0.98]"
                        >
                            {status === "loading" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Join the Waitlist
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                        {status === "error" && message && (
                            <p className="text-red-400 text-xs text-center">{message}</p>
                        )}
                        {count != null && (
                            <p className="text-white/35 text-xs text-center flex items-center justify-center gap-1.5">
                                <Users className="w-3 h-3 text-primary/50" />
                                {count} people already waiting
                            </p>
                        )}
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ScanPage() {
    const [waitlistOpen, setWaitlistOpen] = useState(false);

    return (
        <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#050505] flex flex-col">
            {/* Video background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/TestCanlanVid.mp4"
            />

            {/* Layered overlays for depth */}
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" style={{ background: "linear-gradient(to top, #050505 0%, transparent 45%)" }} />

            {/* Subtle purple glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-sm rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-[100dvh] px-5 pt-safe-top pb-8">

                {/* Top: Logo */}
                <motion.div
                    className="flex items-center justify-center pt-12 pb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo_light.png" alt="PhantomTrack" className="h-7 w-auto opacity-90" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </motion.div>

                {/* Center: Hero text */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-primary/80">You found us</span>
                    </motion.div>

                    <motion.h1
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight"
                    >
                        Track smarter.<br />
                        <span className="text-primary">Move faster.</span>
                    </motion.h1>

                    <motion.p
                        custom={2}
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="text-white/50 text-base max-w-xs leading-relaxed"
                    >
                        The tracking system built for the 1%. Choose where you want to go.
                    </motion.p>
                </div>

                {/* Action cards */}
                <motion.div
                    custom={3}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-3 w-full max-w-sm mx-auto"
                >
                    {/* Download App */}
                    <div className="rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm overflow-hidden">
                        {/* iOS — tappable */}
                        <Link
                            href="https://apps.apple.com/us/app/phantom-track/id6758968140"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 px-5 py-4 active:scale-[0.98] transition-all duration-200 hover:bg-white/[0.04]"
                        >
                            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                {/* Apple logo */}
                                <svg className="w-5 h-5 text-primary" viewBox="0 0 814 1000" fill="currentColor">
                                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-157.5-127.8c-45-74.6-81.9-193.7-81.9-307.1 0-197.5 129-302 255.8-302 64.4 0 117.9 42.2 158.4 42.2 39.2 0 100.7-44.7 173.7-44.7 28 0 130.1 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-semibold text-base leading-tight">Download on iOS</p>
                                <p className="text-white/40 text-xs mt-0.5">Available on the App Store</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </Link>

                        {/* Divider */}
                        <div className="mx-5 h-px bg-white/[0.06]" />

                        {/* Android — coming soon */}
                        <div className="flex items-center gap-4 px-5 py-3.5 opacity-50">
                            <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.523 15.341a.836.836 0 0 1-.836-.835.836.836 0 0 1 .836-.836.836.836 0 0 1 .835.836.836.836 0 0 1-.835.835m-11.046 0a.836.836 0 0 1-.835-.835.836.836 0 0 1 .835-.836.836.836 0 0 1 .836.836.836.836 0 0 1-.836.835M17.7 10.08l1.674-2.899a.348.348 0 0 0-.127-.476.348.348 0 0 0-.476.127l-1.696 2.937A10.466 10.466 0 0 0 12 8.976c-1.47 0-2.868.3-4.075.793L6.229 6.832a.348.348 0 0 0-.476-.127.348.348 0 0 0-.127.476L7.3 10.08C4.95 11.374 3.353 13.722 3.353 16.4H20.647c0-2.678-1.598-5.026-3.947-6.32"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white/60 font-semibold text-base leading-tight">Android</p>
                                <p className="text-white/30 text-xs mt-0.5">Coming soon</p>
                            </div>
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/25 border border-white/10 rounded-full px-2 py-0.5">Soon</span>
                        </div>
                    </div>

                    {/* Homepage */}
                    <Link
                        href="/"
                        className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm active:scale-[0.98] transition-all duration-200 hover:border-white/20 hover:bg-white/[0.09]"
                    >
                        <div className="w-11 h-11 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-white/60" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-semibold text-base leading-tight">Explore the Website</p>
                            <p className="text-white/40 text-xs mt-0.5">See everything we&apos;re building</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Join Waitlist — expandable */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm overflow-hidden">
                        <button
                            onClick={() => setWaitlistOpen((o) => !o)}
                            className="w-full group flex items-center gap-4 px-5 py-4 active:scale-[0.98] transition-all duration-200"
                        >
                            <div className="w-11 h-11 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center flex-shrink-0">
                                <AnimatePresence mode="wait" initial={false}>
                                    {waitlistOpen ? (
                                        <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <X className="w-5 h-5 text-white/60" />
                                        </motion.span>
                                    ) : (
                                        <motion.span key="mail" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-semibold text-base leading-tight">Join the Waitlist</p>
                                <p className="text-white/40 text-xs mt-0.5">Be first when we launch</p>
                            </div>
                            <motion.div
                                animate={{ rotate: waitlistOpen ? 90 : 0 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ChevronRight className="w-5 h-5 text-white/20 flex-shrink-0" />
                            </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                            {waitlistOpen && (
                                <motion.div
                                    key="waitlist"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 border-t border-white/[0.06]">
                                        <WaitlistInline />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    custom={4}
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
