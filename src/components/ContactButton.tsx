"use client";

import React, { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL = "contact@phantom-track.com";

export function ContactButton({
    label = "Reach Out",
    className = "",
}: {
    label?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(EMAIL).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="inline-flex flex-col items-center gap-3">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={className || "px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"}
            >
                <span>{label}</span>
                <Mail className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-4 w-[280px]">
                            <p className="text-xs text-white/40 uppercase tracking-widest font-mono mb-2">Email us directly</p>
                            <div className="flex items-center justify-between gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5">
                                <a
                                    href={`mailto:${EMAIL}`}
                                    className="text-sm font-medium text-white hover:text-primary transition-colors truncate"
                                >
                                    {EMAIL}
                                </a>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    aria-label="Copy email"
                                    className="text-white/40 hover:text-primary transition-colors flex-shrink-0"
                                >
                                    {copied
                                        ? <Check className="w-4 h-4 text-primary" />
                                        : <Copy className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                            {copied && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-primary mt-2 text-center font-medium"
                                >
                                    Copied to clipboard!
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
