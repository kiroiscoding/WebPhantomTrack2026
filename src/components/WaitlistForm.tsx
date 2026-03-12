"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, Users } from "lucide-react";

type Variant = "hero" | "finale" | "inline";

export function WaitlistForm({ variant = "hero" }: { variant?: Variant }) {
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

    return (
        <div className={isInline ? "" : "w-full"}>
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className={`flex gap-2 ${isFinale ? "flex-col sm:flex-row items-center justify-center max-w-lg mx-auto" : isInline ? "flex-row" : "flex-row"}`}
                    >
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
                                } ${isFinale
                                    ? "px-6 py-4 rounded-full text-base"
                                    : "px-4 py-2.5 rounded-full text-sm"
                                }`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className={`group relative inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-60 ${
                                isFinale
                                    ? "px-8 py-4 bg-white text-black rounded-full text-base hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                                    : "px-5 py-2.5 bg-white text-black rounded-full text-sm hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                            }`}
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
                    </motion.form>
                )}
            </AnimatePresence>

            {status === "error" && message && (
                <p className={`text-red-400 text-xs mt-2 ${isFinale ? "text-center" : ""}`}>{message}</p>
            )}

            {count != null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
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
