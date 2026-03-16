"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, Users } from "lucide-react";

type Variant = "hero" | "finale" | "inline";

type WaitlistFormProps = {
    variant?: Variant;
    /** When true, form elements stagger in (finale intro). */
    reveal?: boolean;
    /** When false, form is non-interactive (pointer-events: none). */
    interactive?: boolean;
};

const STAGGER = { input: 0, button: 0.52, count: 1.04 };
const REVEAL_TRANSITION = { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const };

export function WaitlistForm({ variant = "hero", reveal = true, interactive = true }: WaitlistFormProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/waitlist")
            .then((r) => r.json())
            .then((d) => setCount(d.count ?? null))
            .catch(() => {});
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

            if (!res.ok) {
                setStatus("error");
                setMessage(data.error ?? "Something went wrong.");
                return;
            }

            setStatus("success");
            setMessage(data.message ?? "You're in!");
            if (data.count != null) setCount(data.count);
            if (!data.alreadyJoined) setEmail("");
        } catch {
            setStatus("error");
            setMessage("Network error. Try again.");
        }
    }

    const isFinale = variant === "finale";
    const isInline = variant === "inline";
    const useStagger = isFinale && !reveal;
    const finaleReveal = isFinale && reveal;

    return (
        <div
            className={isInline ? "" : "w-full"}
            style={isFinale && !interactive ? { pointerEvents: "none" } : undefined}
        >
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-3 ${isFinale ? "justify-center" : ""}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className={`font-bold ${isFinale ? "text-white text-lg" : "text-white text-sm"}`}>
                            {message}
                        </span>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={useStagger ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className={`flex gap-3 ${isFinale ? "flex-col sm:flex-row items-stretch sm:items-center justify-center w-full mx-auto" : isInline ? "flex-row" : "flex-row"}`}
                    >
                        {isFinale ? (
                            <>
                                <motion.div
                                    className="relative flex-1 min-w-0"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                                    transition={reveal ? { ...REVEAL_TRANSITION, delay: STAGGER.input } : { duration: 0.2 }}
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === "error") setStatus("idle");
                                        }}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 font-medium outline-none transition-all duration-200 focus:border-primary/50 focus:bg-white/[0.08] px-7 py-5 rounded-full text-lg"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                                    transition={reveal ? { ...REVEAL_TRANSITION, delay: STAGGER.button } : { duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="group relative inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-60 px-10 py-5 bg-white text-black rounded-full text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                                    >
                                        {status === "loading" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <span className="relative z-10">Join Waitlist</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform relative z-10" />
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                        <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {status === "loading" ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Join Waitlist
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <div className="relative flex-1 min-w-0">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === "error") setStatus("idle");
                                        }}
                                        placeholder="Enter your email"
                                        required
                                        className={`w-full bg-white/[0.06] border text-white placeholder:text-white/30 font-medium outline-none transition-all duration-200 focus:border-primary/50 focus:bg-white/[0.08] ${
                                            status === "error" ? "border-red-500/50" : "border-white/10"
                                        } px-4 py-2.5 rounded-full text-sm`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="group relative inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-60 px-5 py-2.5 bg-white text-black rounded-full text-sm hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">Join Waitlist</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform relative z-10" />
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {status === "loading" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Join Waitlist
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </>
                        )}
                    </motion.form>
                )}
            </AnimatePresence>

            {status === "error" && message && (
                <p className={`text-red-400 text-xs mt-2 ${isFinale ? "text-center" : ""}`}>{message}</p>
            )}

            {count != null && (
                <motion.div
                    initial={isFinale ? { opacity: 0, y: 12 } : { opacity: 0 }}
                    animate={isFinale ? (reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }) : { opacity: 1, y: 0 }}
                    transition={isFinale && reveal ? { ...REVEAL_TRANSITION, delay: STAGGER.count } : isFinale ? { duration: 0.2 } : { delay: 0.3 }}
                    className={`flex items-center gap-2 mt-3 ${isFinale ? "justify-center" : ""}`}
                >
                    <Users className="w-3 h-3 text-primary" />
                    <span className="text-[11px] text-white/40 font-medium">
                        <span className="text-white/70 font-bold tabular-nums">{count}</span> people on the waitlist
                    </span>
                </motion.div>
            )}
        </div>
    );
}
