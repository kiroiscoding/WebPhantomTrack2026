"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    motion,
    useInView,
    useScroll,
    useTransform,
    useMotionTemplate,
    useSpring,
    useMotionValue,
} from "framer-motion";
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
    float = false,
}: {
    src: string;
    alt: string;
    glow?: boolean;
    width?: number;
    height?: number;
    className?: string;
    float?: boolean;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 30 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    }
    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div
            className={`relative flex-shrink-0 cursor-pointer ${className}`}
            style={{ width, height, perspective: 800, rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={float ? { y: [0, -14, 0] } : {}}
            transition={float ? { duration: 4, ease: "easeInOut", repeat: Infinity } : {}}
            whileHover={{ scale: 1.03 }}
        >
            {glow && (
                <motion.div
                    className="absolute inset-0 rounded-[44px] blur-[70px] bg-primary/35 scale-110 pointer-events-none"
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                />
            )}
            <div className="relative w-full h-full rounded-[44px] border-[2px] border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">
                <div className="relative w-full h-full">
                    <Image src={src} alt={alt} fill className="object-cover object-top" sizes={`${width}px`} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-[4px] bg-white/20 rounded-full z-20" />
            </div>
        </motion.div>
    );
}

// ─── Directional reveal ───────────────────────────────────────────────────────
function SlideIn({
    children,
    from = "bottom",
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    from?: "left" | "right" | "bottom";
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const initial =
        from === "left"   ? { opacity: 0, x: -60, y: 0 }  :
        from === "right"  ? { opacity: 0, x:  60, y: 0 }  :
                            { opacity: 0, x:   0, y: 50 };
    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Staggered bullet list ────────────────────────────────────────────────────
function AnimatedBullets({ bullets, dotColor }: { bullets: string[]; dotColor: string }) {
    const ref = useRef<HTMLUListElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    return (
        <ul ref={ref} className="flex flex-col gap-3">
            {bullets.map((b, i) => (
                <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.12 }}
                    className="flex items-start gap-3 text-white/70 text-sm"
                >
                    <motion.span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`}
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 + i * 0.12 }}
                    />
                    {b}
                </motion.li>
            ))}
        </ul>
    );
}

// ─── Ambient orb ─────────────────────────────────────────────────────────────
function Orb({ color, className }: { color: string; className?: string }) {
    return (
        <motion.div
            className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
            style={{ background: color }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />
    );
}

// ─── Feature Section ─────────────────────────────────────────────────────────
type AccentColor = "primary" | "blue" | "emerald" | "orange";

const colorMap: Record<AccentColor, { tag: string; dot: string; glow: boolean; orb: string }> = {
    primary: { tag: "text-primary bg-primary/10 border-primary/20",             dot: "bg-primary",      glow: true,  orb: "rgba(168,85,247,0.15)"  },
    blue:    { tag: "text-blue-400 bg-blue-400/10 border-blue-400/20",          dot: "bg-blue-400",     glow: false, orb: "rgba(96,165,250,0.12)"  },
    emerald: { tag: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400",  glow: false, orb: "rgba(52,211,153,0.12)"  },
    orange:  { tag: "text-orange-400 bg-orange-400/10 border-orange-400/20",    dot: "bg-orange-400",   glow: false, orb: "rgba(251,146,60,0.12)"  },
};

function FeatureSection({
    tag, tagIcon: TagIcon, title, description, bullets,
    phoneSrc, phoneAlt, flip = false, accentColor = "primary",
}: {
    tag: string; tagIcon: React.ElementType; title: React.ReactNode;
    description: string; bullets: string[]; phoneSrc: string; phoneAlt: string;
    flip?: boolean; accentColor?: AccentColor;
}) {
    const c = colorMap[accentColor];
    const phoneFrom = flip ? "right" : "left";
    const textFrom  = flip ? "left"  : "right";

    return (
        <section className="relative px-6 lg:px-16 py-20 md:py-32 overflow-hidden">
            {/* Per-section ambient orb */}
            <Orb color={c.orb} className={`w-[500px] h-[400px] ${flip ? "right-0 top-1/2 -translate-y-1/2" : "left-0 top-1/2 -translate-y-1/2"}`} />

            <div className="mx-auto max-w-[1200px] relative z-10">
                <div className={`flex flex-col ${flip ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16 lg:gap-24`}>
                    <SlideIn from={phoneFrom} className="flex-1 flex justify-center" delay={0}>
                        <PhoneFrame src={phoneSrc} alt={phoneAlt} glow={c.glow} float />
                    </SlideIn>
                    <SlideIn from={textFrom} className="flex-1" delay={0.1}>
                        <div className="flex flex-col gap-6 max-w-lg">
                            <motion.div
                                className={`inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${c.tag}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <TagIcon className="w-3.5 h-3.5" />
                                {tag}
                            </motion.div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                                {title}
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed">{description}</p>
                            <AnimatedBullets bullets={bullets} dotColor={c.dot} />
                        </div>
                    </SlideIn>
                </div>
            </div>
        </section>
    );
}

// ─── Animated feature card ────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, label, desc, index }: { icon: React.ElementType; label: string; desc: string; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const bg = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, rgba(168,85,247,0.08), transparent)`;

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -4, borderColor: "rgba(168,85,247,0.2)" }}
            className="flex flex-col gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden cursor-default transition-colors duration-300"
        >
            <motion.div className="absolute inset-0 rounded-2xl" style={{ background: bg }} />
            <div className="relative z-10 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <p className="relative z-10 text-white font-bold text-base">{label}</p>
            <p className="relative z-10 text-white/40 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY     = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <div className="min-h-screen bg-[#050505]">

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative px-6 lg:px-16 pt-28 md:pt-40 pb-0 overflow-hidden">
                {/* Animated background orbs */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-primary/10 blur-[140px] pointer-events-none"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-20 left-[15%] w-[300px] h-[300px] rounded-full bg-blue-500/8 blur-[100px] pointer-events-none"
                    animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                    transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-20 right-[15%] w-[300px] h-[300px] rounded-full bg-purple-500/8 blur-[100px] pointer-events-none"
                    animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
                />

                <motion.div
                    style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
                    className="mx-auto max-w-[1200px] text-center relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8"
                    >
                        <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        Now on the App Store
                    </motion.div>

                    {/* Title word-by-word */}
                    <div className="text-6xl sm:text-7xl md:text-[9vw] lg:text-[8rem] font-extrabold tracking-tighter text-white leading-[0.9] mb-8 overflow-hidden">
                        {["YOUR GAME.", "YOUR DATA."].map((line, li) => (
                            <div key={li} className="overflow-hidden">
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.9, ease: EASE, delay: 0.08 + li * 0.14 }}
                                    className={li === 1 ? "text-primary" : ""}
                                >
                                    {line}
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.36 }}
                        className="text-white/50 text-xl max-w-xl mx-auto leading-relaxed mb-10"
                    >
                        Real-time performance tracking, AI-powered coaching, and social leaderboards — all in your pocket.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.46 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                            <Link
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-white text-black rounded-full font-bold text-base hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-shadow duration-300"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 814 1000" fill="currentColor">
                                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-157.5-127.8c-45-74.6-81.9-193.7-81.9-307.1 0-197.5 129-302 255.8-302 64.4 0 117.9 42.2 158.4 42.2 39.2 0 100.7-44.7 173.7-44.7 28 0 130.1 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                </svg>
                                Download for iOS
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </motion.div>
                        <span className="inline-flex items-center gap-2 px-7 py-4 border border-white/10 text-white/40 rounded-full font-semibold text-base cursor-default">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.523 15.341a.836.836 0 0 1-.836-.835.836.836 0 0 1 .836-.836.836.836 0 0 1 .835.836.836.836 0 0 1-.835.835m-11.046 0a.836.836 0 0 1-.835-.835.836.836 0 0 1 .835-.836.836.836 0 0 1 .836.836.836.836 0 0 1-.836.835M17.7 10.08l1.674-2.899a.348.348 0 0 0-.127-.476.348.348 0 0 0-.476.127l-1.696 2.937A10.466 10.466 0 0 0 12 8.976c-1.47 0-2.868.3-4.075.793L6.229 6.832a.348.348 0 0 0-.476-.127.348.348 0 0 0-.127.476L7.3 10.08C4.95 11.374 3.353 13.722 3.353 16.4H20.647c0-2.678-1.598-5.026-3.947-6.32" />
                            </svg>
                            Android — Coming Soon
                        </span>
                    </motion.div>

                    {/* Hero phone trio */}
                    <motion.div
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
                        className="relative flex items-end justify-center gap-4 md:gap-8"
                    >
                        <motion.div
                            className="hidden md:block"
                            initial={{ opacity: 0, x: -60, rotate: -8 }}
                            animate={{ opacity: 0.45, x: 0, rotate: -8, y: 48 }}
                            transition={{ duration: 1, ease: EASE, delay: 0.65 }}
                        >
                            <PhoneFrame src={SS.stats} alt="App stats screen" width={200} height={430} />
                        </motion.div>

                        <motion.div
                            className="relative z-10"
                            animate={{ y: [0, -18, 0] }}
                            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                        >
                            <PhoneFrame src={SS.home} alt="App home screen" glow />
                        </motion.div>

                        <motion.div
                            className="hidden md:block"
                            initial={{ opacity: 0, x: 60, rotate: 8 }}
                            animate={{ opacity: 0.45, x: 0, rotate: 8, y: 48 }}
                            transition={{ duration: 1, ease: EASE, delay: 0.65 }}
                        >
                            <PhoneFrame src={SS.friends} alt="App friends screen" width={200} height={430} />
                        </motion.div>

                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Animated divider */}
            <motion.div
                className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-16 mt-8"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE }}
            />

            {/* ── Feature sections ───────────────────────────────────────── */}
            <FeatureSection
                tag="Dashboard" tagIcon={LayoutDashboard}
                title={<>Everything at<br /><span className="text-primary">a glance.</span></>}
                description="Your performance hub. See your latest session stats, personal bests, and progress the moment you open the app."
                bullets={["Live session overview with real-time metrics","Weekly and monthly performance summaries","Quick-launch your next session in one tap"]}
                phoneSrc={SS.home} phoneAlt="App home dashboard" accentColor="primary"
            />

            <FeatureSection
                tag="Stats & Heatmap" tagIcon={Flame}
                title={<>See every<br /><span className="text-orange-400">move you made.</span></>}
                description="A full breakdown of your session — from distance covered to your 3D heatmap. Know exactly where you dominated and where to improve."
                bullets={["3D field heatmap showing your movement density","Distance, top speed, sprint count, and more","Compare stats across different sessions easily"]}
                phoneSrc={SS.stats} phoneAlt="Stats and heatmap screen" flip accentColor="orange"
            />

            <FeatureSection
                tag="Sprint Map" tagIcon={Zap}
                title={<>Break every<br /><span className="text-blue-400">speed limit.</span></>}
                description="Every sprint, burst, and acceleration mapped directly onto the pitch. Understand how fast, how far, and how often you push the pace."
                bullets={["Top speed, average speed, and sprint count per session","Sprint corridors visualized on a field map","Acceleration and deceleration zones flagged automatically"]}
                phoneSrc={SS.sprintMap} phoneAlt="Sprint map screen" accentColor="blue"
            />

            <FeatureSection
                tag="AI Coach" tagIcon={Brain}
                title={<>Your personal<br /><span className="text-emerald-400">coach. 24/7.</span></>}
                description="An AI that studies your data and tells you exactly what to work on. No guesswork — just data-driven coaching tailored to your game."
                bullets={["Post-session feedback personalized to your play style","Identifies recurring patterns and weaknesses","Weekly training focus recommendations"]}
                phoneSrc={SS.aiCoach} phoneAlt="AI coach screen" flip accentColor="emerald"
            />

            <FeatureSection
                tag="Compare" tagIcon={GitCompare}
                title={<>Stack up<br /><span className="text-primary">against anyone.</span></>}
                description="Compare your sessions side-by-side against teammates, past versions of yourself, or anyone in your network."
                bullets={["Head-to-head stat comparison with any player","Session vs. session performance breakdowns","Identify gaps and celebrate improvements"]}
                phoneSrc={SS.compare} phoneAlt="Compare screen" accentColor="primary"
            />

            {/* ── Friends & Social ───────────────────────────────────────── */}
            <section className="relative px-6 lg:px-16 py-20 md:py-32 overflow-hidden">
                <Orb color="rgba(168,85,247,0.1)" className="w-[700px] h-[500px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />

                <div className="mx-auto max-w-[1200px] relative z-10">
                    <SlideIn from="bottom" className="text-center mb-16">
                        <motion.div
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            Friends · Leaderboard · Share
                        </motion.div>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                            Compete. Connect.<br />
                            <span className="text-primary">Dominate.</span>
                        </h2>
                        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
                            Challenge your teammates, climb the leaderboard, and share your best moments with one tap.
                        </p>
                    </SlideIn>

                    {/* Three-phone spread */}
                    <div className="flex items-end justify-center gap-5 md:gap-10">
                        <motion.div
                            className="hidden sm:block"
                            initial={{ opacity: 0, x: -80, rotate: -6 }}
                            whileInView={{ opacity: 0.4, x: 0, rotate: -6, y: 40 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                        >
                            <PhoneFrame src={SS.compare} alt="Compare screen" width={200} height={430} />
                        </motion.div>

                        <motion.div
                            className="relative z-10"
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: EASE, delay: 0 }}
                            animate={{ y: [0, -14, 0] }}
                        >
                            <PhoneFrame src={SS.friends} alt="Friends screen" glow />
                        </motion.div>

                        <motion.div
                            className="hidden sm:block"
                            initial={{ opacity: 0, x: 80, rotate: 6 }}
                            whileInView={{ opacity: 0.4, x: 0, rotate: 6, y: 40 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                        >
                            <PhoneFrame src={SS.stats} alt="Leaderboard screen" width={200} height={430} />
                        </motion.div>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20">
                        {[
                            { icon: Trophy, label: "Leaderboards", desc: "Ranked by distance, sprints, top speed, and more — across your friend group or globally." },
                            { icon: Users,  label: "Friends",      desc: "Add teammates, follow their sessions, and compete directly against their stats." },
                            { icon: Share2, label: "Share",        desc: "Export a clean performance card and post your best sessions straight to social media." },
                        ].map(({ icon, label, desc }, i) => (
                            <FeatureCard key={label} icon={icon} label={label} desc={desc} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Download CTA ──────────────────────────────────────────────── */}
            <section className="px-6 lg:px-16 py-24 md:py-36">
                <div className="mx-auto max-w-[1200px]">
                    <SlideIn from="bottom">
                        <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/[0.06] p-10 md:p-20 text-center">
                            <motion.div
                                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.25),transparent_65%)]"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                            />
                            {/* Animated ring */}
                            <motion.div
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/10"
                                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                            />
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                <div className="overflow-hidden">
                                    <motion.h2
                                        initial={{ y: "100%" }}
                                        whileInView={{ y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: EASE }}
                                        className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[0.9]"
                                    >
                                        READY TO<br />
                                        <span className="text-primary">LEVEL UP?</span>
                                    </motion.h2>
                                </div>
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                                    className="text-white/40 text-lg max-w-sm"
                                >
                                    Download Phantom Track and start turning your training data into your competitive edge.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                                    className="flex flex-col sm:flex-row items-center gap-4"
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                        <Link
                                            href={APP_STORE_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black rounded-full font-bold text-base hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transition-shadow duration-300"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 814 1000" fill="currentColor">
                                                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-157.5-127.8c-45-74.6-81.9-193.7-81.9-307.1 0-197.5 129-302 255.8-302 64.4 0 117.9 42.2 158.4 42.2 39.2 0 100.7-44.7 173.7-44.7 28 0 130.1 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                            </svg>
                                            Download for iOS
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                        </Link>
                                    </motion.div>
                                    <span className="inline-flex items-center gap-2 px-7 py-4 border border-white/10 text-white/35 rounded-full font-semibold text-sm">
                                        Android — Coming Soon
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </SlideIn>
                </div>
            </section>

            <Footer />
        </div>
    );
}
