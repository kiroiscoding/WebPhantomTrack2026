"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, Copy, Globe, ClipboardPaste, Zap, Smartphone } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: EASE, delay: i * 0.1 },
    }),
};

interface WebContext {
    isWebView: boolean;
    appName: string;
}

function detectWebContext(): WebContext {
    if (typeof navigator === "undefined") return { isWebView: false, appName: "" };
    const ua = navigator.userAgent;
    if (/Snapchat/.test(ua))   return { isWebView: true, appName: "Snapchat" };
    if (/Instagram/.test(ua))  return { isWebView: true, appName: "Instagram" };
    if (/FBAN|FBAV|FB_IAB/.test(ua)) return { isWebView: true, appName: "Facebook" };
    if (/TikTok|musical_ly/.test(ua)) return { isWebView: true, appName: "TikTok" };
    if (/Twitter/.test(ua))    return { isWebView: true, appName: "X" };
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const hasSafari = /Safari/.test(ua) && !/CriOS|Chrome/.test(ua);
    if (isIOS && !hasSafari)   return { isWebView: true, appName: "" };
    return { isWebView: false, appName: "" };
}

async function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText(text); return true; } catch {}
    }
    try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
        document.body.appendChild(el);
        el.focus(); el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        return ok;
    } catch { return false; }
}

// ── IAB "Open in App" card (primary CTA for Snapchat / WebViews) ─────────────
function WebViewOpenCard({ appName, onOpen }: { appName: string; onOpen: () => void }) {
    const label = appName ? `Opening from ${appName}` : "In-app browser detected";
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full rounded-2xl bg-primary/[0.08] border border-primary/20 backdrop-blur-sm overflow-hidden"
        >
            <div className="flex flex-col items-center gap-4 px-5 py-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-white font-bold text-base tracking-tight">Open Phantom Track</p>
                    <p className="text-white/40 text-xs leading-snug">{label} — tap below to open directly</p>
                </div>
                <button
                    onClick={onOpen}
                    className="group relative w-full inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all px-6 py-4 bg-primary text-white rounded-xl text-sm active:scale-[0.98] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">Open in App</span>
                    <ChevronRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}

// ── "Opening…" mini state shown right after the button tap ───────────────────
function OpeningCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="w-full rounded-2xl bg-primary/[0.06] border border-primary/15 backdrop-blur-sm flex flex-col items-center gap-3 py-6 px-5"
        >
            <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/70"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    />
                ))}
            </div>
            <p className="text-white/50 text-sm">Launching Phantom Track…</p>
        </motion.div>
    );
}

// ── Clipboard success card (app not installed fallback) ──────────────────────
function CopiedCard({ displayUrl, onCopyAgain }: { displayUrl: string; onCopyAgain: () => void }) {
    const steps = [
        { icon: Globe,            label: "Open Safari on your iPhone" },
        { icon: ClipboardPaste,   label: "Paste in the address bar" },
        { icon: Zap,              label: "Phantom Track opens automatically" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full rounded-2xl bg-primary/[0.08] border border-primary/20 backdrop-blur-sm overflow-hidden"
        >
            <div className="flex flex-col items-center gap-3 px-5 pt-6 pb-5">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        className="absolute w-16 h-16 rounded-full border border-primary/40"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.7, opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    />
                    <motion.div
                        className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.15, 1] }}
                        transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                    >
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, ease: EASE, delay: 0.25 }}
                        >
                            <Check className="w-5 h-5 text-primary" strokeWidth={2.5} />
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    className="flex flex-col items-center gap-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.2 }}
                >
                    <p className="text-white font-bold text-lg tracking-tight">Link copied!</p>
                    <p className="text-white/45 text-sm text-center leading-snug">
                        Now open Safari and paste
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                    <p className="text-white/50 text-[11px] font-mono tracking-tight truncate max-w-[220px]">
                        {displayUrl}
                    </p>
                </motion.div>
            </div>

            <div className="mx-5 h-px bg-white/[0.07]" />

            <div className="px-5 py-4 flex flex-col gap-0">
                {steps.map(({ icon: Icon, label }, i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="flex items-center gap-3 py-2.5"
                        >
                            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-primary/80" />
                            </div>
                            <p className="text-white/70 text-sm font-medium leading-tight">{label}</p>
                        </motion.div>
                        {i < steps.length - 1 && (
                            <div className="ml-3.5 w-px h-3 bg-primary/15" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex justify-center pb-4">
                <button
                    onClick={onCopyAgain}
                    className="flex items-center gap-1.5 text-white/25 text-[11px] hover:text-white/50 transition-colors cursor-pointer"
                >
                    <Copy className="w-3 h-3" />
                    Copy again
                </button>
            </div>
        </motion.div>
    );
}

// ── Clipboard failed card ────────────────────────────────────────────────────
function CopyFailedCard({ displayUrl, onCopy, copying }: { displayUrl: string; onCopy: () => void; copying: boolean }) {
    const steps = [
        { icon: Globe,          label: "Open Safari on your iPhone" },
        { icon: ClipboardPaste, label: "Paste in the address bar" },
        { icon: Zap,            label: "Phantom Track opens automatically" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-sm overflow-hidden"
        >
            <div className="px-5 pt-5 pb-4 flex flex-col items-center gap-3">
                <p className="text-white/60 text-sm text-center leading-snug">
                    App not installed? Download it first, then open the link
                </p>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10 w-full justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                    <p className="text-white/45 text-[11px] font-mono tracking-tight truncate max-w-[220px]">
                        {displayUrl}
                    </p>
                </div>

                <button
                    onClick={onCopy}
                    disabled={copying}
                    className="group relative w-full inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all px-6 py-4 bg-primary text-white rounded-xl text-sm active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Copy className="relative w-4 h-4" />
                    <span className="relative">{copying ? "Copying…" : "Copy Link"}</span>
                </button>
            </div>

            <div className="mx-5 h-px bg-white/[0.07]" />

            <div className="px-5 py-4 flex flex-col gap-0">
                {steps.map(({ icon: Icon, label }, i) => (
                    <React.Fragment key={i}>
                        <div className="flex items-center gap-3 py-2.5 opacity-40">
                            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-white/60" />
                            </div>
                            <p className="text-white/60 text-sm font-medium leading-tight">{label}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="ml-3.5 w-px h-3 bg-white/10" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </motion.div>
    );
}

// ── App Store link row ───────────────────────────────────────────────────────
function AppStoreLink({ label = "Download on the App Store", sub = "Free on iOS" }: { label?: string; sub?: string }) {
    return (
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
                <p className="text-white font-semibold text-base leading-tight">{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{sub}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AddClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const uid = searchParams.get("uid");

    const [phase, setPhase] = useState<"opening" | "fallback">("opening");
    const [webCtx, setWebCtx] = useState<WebContext>({ isWebView: false, appName: "" });
    // For IAB flow: track whether the user has already tapped "Open in App"
    const [webviewTapped, setWebviewTapped] = useState(false);
    const [showInstallFallback, setShowInstallFallback] = useState(false);
    // For non-IAB fallback clipboard
    const [clipboardState, setClipboardState] = useState<"idle" | "copied" | "failed">("idle");
    const [copying, setCopying] = useState(false);

    const displayUrl = `phantom-track.com/add?uid=${uid ?? ""}`;

    useEffect(() => {
        if (!uid) { router.replace("/"); return; }

        const meta = document.createElement("meta");
        meta.name = "apple-itunes-app";
        meta.content = `app-id=6758968140, app-argument=phantomtrack://add?uid=${uid}`;
        document.head.appendChild(meta);

        // Detect IAB synchronously — before deciding whether to auto-redirect
        const ctx = detectWebContext();
        setWebCtx(ctx);

        if (ctx.isWebView) {
            // ── IAB path (Snapchat, Instagram, etc.) ──────────────────────────
            // Do NOT fire window.location.href here — non-gesture JS navigation
            // to custom URL schemes is blocked by WebKit in in-app browsers.
            // Instead, skip straight to the fallback UI which has an "Open in App"
            // button. When the user taps it (a real user gesture), the custom
            // scheme navigation will succeed.
            setPhase("fallback");
            return () => { document.head.removeChild(meta); };
        }

        // ── Non-IAB path (Safari, Chrome) ─────────────────────────────────────
        // Auto-redirect works fine here.
        window.location.href = `phantomtrack://add?uid=${uid}`;

        const timer = setTimeout(() => {
            setPhase("fallback");
        }, 2000);

        return () => { clearTimeout(timer); document.head.removeChild(meta); };
    }, [uid, router]);

    // Called when the user taps "Open in App" from within an IAB
    const handleWebViewOpen = () => {
        if (!uid) return;
        // This is a user gesture — WebKit allows custom URL scheme navigation here
        window.location.href = `phantomtrack://add?uid=${uid}`;
        setWebviewTapped(true);
        // If app is installed the user will be gone; if not, show install fallback
        setTimeout(() => {
            setShowInstallFallback(true);
        }, 1500);
    };

    // For non-IAB manual copy (fallback "Open in App" button didn't redirect)
    const handleManualCopy = async () => {
        if (!uid) return;
        setCopying(true);
        const ok = await copyToClipboard(window.location.href);
        setCopying(false);
        setClipboardState(ok ? "copied" : "failed");
    };

    if (!uid) return null;

    return (
        <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#050505] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050505 0%, transparent 45%)" }} />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-sm rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-[100dvh] px-5 pb-8">

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
                                <p className="text-white/70 text-lg font-semibold tracking-tight">Opening Phantom Track...</p>
                                <div className="flex items-center gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-primary/70"
                                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="fallback" className="flex flex-col items-center gap-4">
                                <motion.div
                                    custom={0} variants={fadeUp} initial="hidden" animate="show"
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[11px] font-semibold tracking-widest uppercase text-primary/80">Add Me</span>
                                </motion.div>

                                <motion.h1
                                    custom={1} variants={fadeUp} initial="hidden" animate="show"
                                    className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight max-w-xs"
                                >
                                    Add me on{" "}
                                    <span className="text-primary">Phantom&nbsp;Track</span>
                                </motion.h1>

                                <motion.p
                                    custom={2} variants={fadeUp} initial="hidden" animate="show"
                                    className="text-white/50 text-base max-w-xs leading-relaxed"
                                >
                                    Track your soccer performance. Compare yourself to the pros.
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action area */}
                <AnimatePresence>
                    {phase === "fallback" && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                            className="flex flex-col gap-3 w-full max-w-sm mx-auto"
                        >
                            {webCtx.isWebView ? (
                                // ── IAB flow ──────────────────────────────────────────────────────
                                <AnimatePresence mode="wait">
                                    {!webviewTapped ? (
                                        // Step 1: Show "Open in App" button (tap = user gesture)
                                        <motion.div key="webview-open" className="flex flex-col gap-3">
                                            <WebViewOpenCard
                                                appName={webCtx.appName}
                                                onOpen={handleWebViewOpen}
                                            />
                                            <AppStoreLink label="Don't have the app?" sub="Download free on the App Store" />
                                        </motion.div>
                                    ) : !showInstallFallback ? (
                                        // Step 2: Briefly show "Launching…" while waiting
                                        <motion.div key="webview-opening" className="flex flex-col gap-3">
                                            <OpeningCard />
                                            <AppStoreLink label="Don't have the app?" sub="Download free on the App Store" />
                                        </motion.div>
                                    ) : (
                                        // Step 3: App wasn't installed — show install fallback + copy
                                        <motion.div key="webview-install" className="flex flex-col gap-3">
                                            <CopyFailedCard
                                                displayUrl={displayUrl}
                                                onCopy={handleManualCopy}
                                                copying={copying}
                                            />
                                            <AppStoreLink label="Download on the App Store" sub="Free on iOS" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            ) : (
                                // ── Non-IAB flow (Safari / Chrome) ────────────────────────────────
                                <AnimatePresence mode="wait">
                                    {clipboardState === "copied" ? (
                                        <CopiedCard
                                            key="copied"
                                            displayUrl={displayUrl}
                                            onCopyAgain={handleManualCopy}
                                        />
                                    ) : (
                                        <motion.div key="non-iab" className="flex flex-col gap-3">
                                            <a
                                                href={`phantomtrack://add?uid=${uid}`}
                                                className="group relative w-full inline-flex items-center justify-center gap-2 font-bold tracking-wide overflow-hidden transition-all px-6 py-5 bg-primary text-white rounded-2xl text-base active:scale-[0.98]"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <span className="relative">Open in App</span>
                                                <ChevronRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </a>
                                            <AppStoreLink label="Download on the App Store" sub="Free on iOS" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.p
                    custom={5} variants={fadeUp} initial="hidden" animate="show"
                    className="text-center text-white/20 text-[11px] mt-6 tracking-wide"
                >
                    phantom-track.com
                </motion.p>
            </div>
        </div>
    );
}
