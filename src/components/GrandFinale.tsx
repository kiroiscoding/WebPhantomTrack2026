"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ExplodingView3D } from "@/components/ExplodingView3D";
import { ShaderAnimation } from "@/components/ui/spiral-shader";

type IntroStage = "intro" | "headline-settle" | "form-reveal" | "complete";

const INTRO_MS = 3600;
const HEADLINE_SETTLE_MS = 1100;
const FORM_REVEAL_MS = 3800;
const RING_FADE_DURATION = 1.0;
const HEADLINE_MOVE_DURATION = 0.85;
/** Extra ms after headline-settle so ring is fully faded before form appears (no orange remnant). */
const RING_FADE_BUFFER_MS = 350;

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export function GrandFinale() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineWrapRef = useRef<HTMLDivElement>(null);
    const [stage, setStage] = useState<IntroStage>("intro");
    const [formReveal, setFormReveal] = useState(false);
    const [interactive, setInteractive] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);

    const formRevealStartMs = INTRO_MS + HEADLINE_SETTLE_MS + RING_FADE_BUFFER_MS;

    useEffect(() => {
        const t1 = setTimeout(() => setStage("headline-settle"), INTRO_MS);
        const t2 = setTimeout(() => setStage("form-reveal"), formRevealStartMs);
        const t3 = setTimeout(() => setFormReveal(true), formRevealStartMs + 50);
        const t4 = setTimeout(() => {
            setStage("complete");
            setInteractive(true);
        }, formRevealStartMs + FORM_REVEAL_MS);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    const showRing = stage === "intro" || stage === "headline-settle";
    const ringFading = stage === "headline-settle";
    const heroFullPage = stage === "intro" || stage === "headline-settle";

    return (
        <section
            ref={containerRef}
            className="relative w-full flex flex-col items-center overflow-hidden pt-32 pb-24 mt-16 z-10 rounded-t-[60px] bg-[#141414]"
            style={{
                minHeight: heroFullPage ? "100svh" : undefined,
            }}
        >
            {/* Full-bleed shader: long fade so no orange remnant; exit runs before content shows */}
            <AnimatePresence mode="wait">
                {showRing && (
                    <motion.div
                        key="shader"
                        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: ringFading ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: RING_FADE_DURATION, ease: EASE_SMOOTH }}
                    >
                        <ShaderAnimation runOnceMs={INTRO_MS} className="rounded-t-[60px]" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center px-6 min-h-0">
                {/* Hero block: full viewport during intro, then collapses so headline + form flow */}
                <motion.div
                    ref={headlineWrapRef}
                    className="relative flex flex-col items-center justify-center flex-shrink-0"
                    animate={{
                        minHeight: heroFullPage ? "calc(100svh - 8rem)" : 0,
                        transition: {
                            duration: stage === "headline-settle" ? 1.0 : 0.4,
                            ease: EASE_SMOOTH,
                        },
                    }}
                    style={{ overflow: "hidden" }}
                >
                    <div className="relative inline-flex flex-col items-center justify-center min-h-[200px]">
                        <motion.h2
                            style={stage === "complete" ? { y } : undefined}
                            className="relative z-10 text-[10vw] md:text-[8vw] leading-none font-bold tracking-tighter text-white whitespace-nowrap text-center"
                            initial={{ y: 32 }}
                            animate={{
                                y: stage === "intro" ? 32 : 0,
                                transition:
                                    stage === "headline-settle"
                                        ? { duration: HEADLINE_MOVE_DURATION, ease: EASE_SMOOTH }
                                        : undefined,
                            }}
                        >
                            JOIN THE <span className="text-primary">1%</span>.
                        </motion.h2>
                    </div>
                </motion.div>

                {/* Spacer: same as final mb-12 so no layout shift */}
                <div className="w-full h-12 flex-shrink-0" aria-hidden />

                {/* Form: hidden until form-reveal, then stagger in */}
                <div className="relative z-10 w-full max-w-2xl flex-shrink-0">
                    <WaitlistForm
                        variant="finale"
                        reveal={formReveal}
                        interactive={interactive}
                    />
                </div>
            </div>

            <div className="relative z-10 w-full mt-14 md:mt-20">
                <ExplodingView3D embedded />
            </div>

            <div className="mt-14 text-center text-white/25 text-xs tracking-[0.5em] font-mono">
                PHANTOM TRACK // ELITE SERIES
            </div>
        </section>
    );
}
