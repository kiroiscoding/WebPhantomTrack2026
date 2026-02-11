"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, ChevronRight, ArrowUpRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cartStore";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const openCart = useCartStore((s) => s.openCart);

    const menuItems = [
        { name: "Products", href: "/products" },
        { name: "App", href: "/app" },
        { name: "About us", href: "/about" },
        { name: "Support", href: "/support" },
    ];

    const featuredProducts = [
        { name: "Tracker Combo", href: "/products/tracker-combo" },
        { name: "Phantom Vest", href: "/products/phantom-vest" },
        { name: "Apparel (Coming soon)", href: "/products/apparel" },
    ];

    return (
        <>
            {/* Backdrop (click outside to close) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.button
                        type="button"
                        aria-label="Close menu backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-black/40"
                    />
                )}
            </AnimatePresence>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
            >
                <motion.div
                    className="relative z-50 flex-none w-[550px] max-w-[calc(100%-2rem)] overflow-hidden rounded-[28px] bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto"
                    initial={false}
                    animate={{
                        height: isOpen ? 520 : 56,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 38,
                    }}
                >
                    {/* Header row (always visible) */}
                    <div className="relative flex h-14 items-center justify-between pl-6 pr-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen((v) => !v)}
                            className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        {/* Center: Logo */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform pointer-events-none">
                            <Link
                                href="/"
                                className="pointer-events-auto text-lg font-bold tracking-widest text-white uppercase"
                            >
                                Phantom Track
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                aria-label="Open cart"
                                onClick={openCart}
                                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Expanding content (fades/staggers in after the grow) */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key="menu-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut", delay: 0.08 }}
                                className="px-6 pb-6 pt-4"
                            >
                                {/* Featured row */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: {},
                                        show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
                                    }}
                                    className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6"
                                >
                                    {featuredProducts.map((p) => (
                                        <Link key={p.name} href={p.href} onClick={() => setIsOpen(false)}>
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0, y: 10 },
                                                    show: { opacity: 1, y: 0 },
                                                }}
                                                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                                className="rounded-2xl bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors cursor-pointer group h-full"
                                            >
                                                <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 mb-3" />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-white">{p.name}</span>
                                                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </motion.div>

                                {/* Menu list */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: {},
                                        show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
                                    }}
                                    className="mt-6 space-y-2"
                                >
                                    {menuItems.map((item) => (
                                        <motion.a
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                show: { opacity: 1, x: 0 },
                                            }}
                                            transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                            className="group flex items-center justify-between py-1.5"
                                        >
                                            <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-primary transition-colors">
                                                {item.name}
                                            </span>
                                            <ChevronRight className="w-6 h-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                                        </motion.a>
                                    ))}
                                </motion.div>

                                {/* Footer row */}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut", delay: 0.22 }}
                                    className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-sm text-muted-foreground"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                                            <Globe className="h-3.5 w-3.5 text-white/70" />
                                        </span>
                                        EN / USD
                                    </span>
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="text-white hover:text-primary transition-colors"
                                    >
                                        Account
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.nav>
        </>
    );
}
