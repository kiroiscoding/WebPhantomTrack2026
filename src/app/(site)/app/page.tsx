"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
    ArrowRight,
    Users,
    Share2,
    Flame,
    Zap,
    Brain,
    LayoutDashboard,
    Trophy,
    GitCompare,
} from "lucide-react";
import { Footer } from "@/components/Footer";

const APP_STORE_URL = "https://apps.apple.com/us/app/phantom-track/id6758968140";
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Screenshot paths — swap these when new images are added
const SS = {
    home:      "/app/new-screenshots/home.png",
    stats:     "/app/new-screenshots/stats.png",
    sprintMap: "/app/new-screenshots/sprint-map.png",
    aiCoach:   "/app/new-screenshots/ai-coach.png",
    compare:   "/app/new-screenshots/compare.png",
    friends:   "/app/new-screenshots/friends.png",
};

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneFrame({
    src,
    alt,
    glow = false,
    width = 270,
    height = 580,
    className = "",
}: {
    src: string;
    alt: string;
    glow?: boolean;
    width?: number;
    height?: number;
    className?: string;
}) {
    return (
        <div className={`relative flex-shrink-0 ${className}`} style={{ width, height }}>
            {glow && (
                <div className="absolute inset-0 rounded-[44px] blur-[60px] bg-primary/30 scale-110 pointer-events-none" />
            )}
            <div className="relative w-full h-full rounded-[44px] border-[2px] border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">

                <div className="relative w-full h-full">
                    <Image src={src} alt={alt} fill className="object-cover object-top" sizes={`${width}px`} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-[4px] bg-white/20 rounded-full z-20" />
            </div>
        </div>
    );
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Feature Section (alternating) ───────────────────────────────────────────
type AccentColor = "primary" | "blue" | "emerald" | "orange";

const colorMap: Record<AccentColor, { tag: string; dot: string; glow: boolean }> = {
    primary: { tag: "text-primary bg-primary/10 border-primary/20",       dot: "bg-primary",      glow: true  },
    blue:    { tag: "text-blue-400 bg-blue-400/10 border-blue-400/20",    dot: "bg-blue-400",     glow: false },
    emerald: { tag: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400", glow: false },
    orange:  { tag: "text-orange-400 bg-orange-400/10 border-orange-400/20", dot: "bg-orange-400", glow: false },
};

function FeatureSection({
    tag,
    tagIcon: TagIcon,
    title,
    description,
    bullets,
    phoneSrc,
    phoneAlt,
    flip = false,
    accentColor = "primary",
}: {
    tag: string;
    tagIcon: React.ElementType;
    title: React.ReactNode;
    description: string;
    bullets: string[];
    phoneSrc: string;
    phoneAlt: string;
    flip?: boolean;
    accentColor?: AccentColor;
}) {
    const c = colorMap[accentColor];

    return (
        <section className="px-6 lg:px-16 py-20 md:py-32">
            <div className="mx-auto max-w-[1200px]">
                <div className={`flex flex-col ${flip ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16 lg:gap-24`}>
                    <Reveal className="flex-1 flex justify-center" delay={0}>
                        <PhoneFrame src={phoneSrc} alt={phoneAlt} glow={c.glow} />
                    </Reveal>
                    <Reveal className="flex-1" delay={0.12}>
                        <div className="flex flex-col gap-6 max-w-lg">
                            <div className={`inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${c.tag}`}>
                                <TagIcon className="w-3.5 h-3.5" />
                                {tag}
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                                {title}
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed">{description}</p>
                            <ul className="flex flex-col gap-3">
                                {bullets.map((b, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppPage() {
    return (
        <div className="min-h-screen bg-[#050505]">

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative px-6 lg:px-16 pt-28 md:pt-40 pb-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-[1200px] text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Now on the App Store
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
                        className="text-6xl sm:text-7xl md:text-[9vw] lg:text-[8rem] font-extrabold tracking-tighter text-white leading-[0.9] mb-8"
                    >
                        YOUR GAME.<br />
                        <span className="text-primary">YOUR DATA.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
                        className="text-white/50 text-xl max-w-xl mx-auto leading-relaxed mb-10"
                    >
                        Real-time performance tracking, AI-powered coaching, and social leaderboards — all in your pocket.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Link
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-7 py-4 bg-white text-black rounded-full font-bold text-base hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-300 active:scale-[0.97]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 814 1000" fill="currentColor">
                                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-157.5-127.8c-45-74.6-81.9-193.7-81.9-307.1 0-197.5 129-302 255.8-302 64.4 0 117.9 42.2 158.4 42.2 39.2 0 100.7-44.7 173.7-44.7 28 0 130.1 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                            </svg>
                            Download for iOS
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <span className="inline-flex items-center gap-2 px-7 py-4 border border-white/10 text-white/40 rounded-full font-semibold text-base cursor-default">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.523 15.341a.836.836 0 0 1-.836-.835.836.836 0 0 1 .836-.836.836.836 0 0 1 .835.836.836.836 0 0 1-.835.835m-11.046 0a.836.836 0 0 1-.835-.835.836.836 0 0 1 .835-.836.836.836 0 0 1 .836.836.836.836 0 0 1-.836.835M17.7 10.08l1.674-2.899a.348.348 0 0 0-.127-.476.348.348 0 0 0-.476.127l-1.696 2.937A10.466 10.466 0 0 0 12 8.976c-1.47 0-2.868.3-4.075.793L6.229 6.832a.348.348 0 0 0-.476-.127.348.348 0 0 0-.127.476L7.3 10.08C4.95 11.374 3.353 13.722 3.353 16.4H20.647c0-2.678-1.598-5.026-3.947-6.32" />
                            </svg>
                            Android — Coming Soon
                        </span>
                    </motion.div>

                    {/* Hero phone trio */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                        className="relative flex items-end justify-center gap-4 md:gap-8"
                    >
                        <div className="hidden md:block opacity-45 translate-y-12 rotate-[-8deg]">
                            <PhoneFrame src={SS.stats} alt="App stats screen" width={200} height={430} />
                        </div>
                        <div className="relative z-10">
                            <PhoneFrame src={SS.home} alt="App home screen" glow />
                        </div>
                        <div className="hidden md:block opacity-45 translate-y-12 rotate-[8deg]">
                            <PhoneFrame src={SS.friends} alt="App friends screen" width={200} height={430} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-16 mt-8" />

            {/* ── Section 1: Home / Dashboard ─────────────────────────────── */}
            <FeatureSection
                tag="Dashboard"
                tagIcon={LayoutDashboard}
                title={<>Everything at<br /><span className="text-primary">a glance.</span></>}
                description="Your performance hub. See your latest session stats, personal bests, and progress the moment you open the app."
                bullets={[
                    "Live session overview with real-time metrics",
                    "Weekly and monthly performance summaries",
                    "Quick-launch your next session in one tap",
                ]}
                phoneSrc={SS.home}
                phoneAlt="App home dashboard"
                accentColor="primary"
            />

            {/* ── Section 2: Stats Page ────────────────────────────────────── */}
            <FeatureSection
                tag="Stats & Heatmap"
                tagIcon={Flame}
                title={<>See every<br /><span className="text-orange-400">move you made.</span></>}
                description="A full breakdown of your session — from distance covered to your 3D heatmap. Know exactly where you dominated and where to improve."
                bullets={[
                    "3D field heatmap showing your movement density",
                    "Distance, top speed, sprint count, and more",
                    "Compare stats across different sessions easily",
                ]}
                phoneSrc={SS.stats}
                phoneAlt="Stats and heatmap screen"
                flip
                accentColor="orange"
            />

            {/* ── Section 3: Sprint Map ────────────────────────────────────── */}
            <FeatureSection
                tag="Sprint Map"
                tagIcon={Zap}
                title={<>Break every<br /><span className="text-blue-400">speed limit.</span></>}
                description="Every sprint, burst, and acceleration mapped directly onto the pitch. Understand how fast, how far, and how often you push the pace."
                bullets={[
                    "Top speed, average speed, and sprint count per session",
                    "Sprint corridors visualized on a field map",
                    "Acceleration and deceleration zones flagged automatically",
                ]}
                phoneSrc={SS.sprintMap}
                phoneAlt="Sprint map screen"
                accentColor="blue"
            />

            {/* ── Section 4: AI Coach ──────────────────────────────────────── */}
            <FeatureSection
                tag="AI Coach"
                tagIcon={Brain}
                title={<>Your personal<br /><span className="text-emerald-400">coach. 24/7.</span></>}
                description="An AI that studies your data and tells you exactly what to work on. No guesswork — just data-driven coaching tailored to your game."
                bullets={[
                    "Post-session feedback personalized to your play style",
                    "Identifies recurring patterns and weaknesses",
                    "Weekly training focus recommendations",
                ]}
                phoneSrc={SS.aiCoach}
                phoneAlt="AI coach screen"
                flip
                accentColor="emerald"
            />

            {/* ── Section 5: Compare ──────────────────────────────────────── */}
            <FeatureSection
                tag="Compare"
                tagIcon={GitCompare}
                title={<>Stack up<br /><span className="text-primary">against anyone.</span></>}
                description="Compare your sessions side-by-side against teammates, past versions of yourself, or anyone in your network."
                bullets={[
                    "Head-to-head stat comparison with any player",
                    "Session vs. session performance breakdowns",
                    "Identify gaps and celebrate improvements",
                ]}
                phoneSrc={SS.compare}
                phoneAlt="Compare screen"
                accentColor="primary"
            />

            {/* ── Section 6: Friends & Social ─────────────────────────────── */}
            <section className="px-6 lg:px-16 py-20 md:py-32">
                <div className="mx-auto max-w-[1200px]">
                    <Reveal className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                            <Trophy className="w-3.5 h-3.5" />
                            Friends · Leaderboard · Share
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                            Compete. Connect.<br />
                            <span className="text-primary">Dominate.</span>
                        </h2>
                        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
                            Challenge your teammates, climb the leaderboard, and share your best moments with one tap.
                        </p>
                    </Reveal>

                    {/* Three-phone spread */}
                    <Reveal className="flex items-end justify-center gap-5 md:gap-10" delay={0.1}>
                        <div className="hidden sm:block opacity-40 translate-y-10 rotate-[-6deg]">
                            <PhoneFrame src={SS.compare} alt="Compare screen" width={200} height={430} />
                        </div>
                        <div className="relative z-10">
                            <PhoneFrame src={SS.friends} alt="Friends screen" glow />
                        </div>
                        <div className="hidden sm:block opacity-40 translate-y-10 rotate-[6deg]">
                            <PhoneFrame src={SS.stats} alt="Leaderboard screen" width={200} height={430} />
                        </div>
                    </Reveal>

                    {/* Three feature cards */}
                    <Reveal delay={0.2}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20">
                            {[
                                { icon: Trophy, label: "Leaderboards", desc: "Ranked by distance, sprints, top speed, and more — across your friend group or globally." },
                                { icon: Users,  label: "Friends",      desc: "Add teammates, follow their sessions, and compete directly against their stats." },
                                { icon: Share2, label: "Share",        desc: "Export a clean performance card and post your best sessions straight to social media." },
                            ].map(({ icon: Icon, label, desc }) => (
                                <div key={label} className="flex flex-col gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-white font-bold text-base">{label}</p>
                                    <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Download CTA ──────────────────────────────────────────────── */}
            <section className="px-6 lg:px-16 py-24 md:py-36">
                <div className="mx-auto max-w-[1200px]">
                    <Reveal>
                        <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/[0.06] p-10 md:p-20 text-center">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.2),transparent_65%)]" />
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[0.9]">
                                    READY TO<br />
                                    <span className="text-primary">LEVEL UP?</span>
                                </h2>
                                <p className="text-white/40 text-lg max-w-sm">
                                    Download Phantom Track and start turning your training data into your competitive edge.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Link
                                        href={APP_STORE_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black rounded-full font-bold text-base hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-300 active:scale-[0.97]"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 814 1000" fill="currentColor">
                                            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-157.5-127.8c-45-74.6-81.9-193.7-81.9-307.1 0-197.5 129-302 255.8-302 64.4 0 117.9 42.2 158.4 42.2 39.2 0 100.7-44.7 173.7-44.7 28 0 130.1 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                        </svg>
                                        Download for iOS
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                    <span className="inline-flex items-center gap-2 px-7 py-4 border border-white/10 text-white/35 rounded-full font-semibold text-sm">
                                        Android — Coming Soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <Footer />
        </div>
    );
}
