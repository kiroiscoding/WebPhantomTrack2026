"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type ReviewItem = {
    type: "review";
    name: string;
    role: string;
    content: string;
    rating: number;
    width: string;
};

type ImageItem = {
    type: "image";
    label: string;
    width: string;
    src: string;
};

type MarqueeItem = ReviewItem | ImageItem;

const IMAGE_CARD_SOURCES = [
    "/finalPictures%20copy/DSC03542.jpg",
    "/finalPictures%20copy/DSC03976.jpg",
    "/finalPictures%20copy/DSC03625.jpg",
    "/finalPictures%20copy/DSC03581.jpg",
    "/finalPictures%20copy/DSC03547.jpg",
    "/finalPictures%20copy/DSC04127.jpg",
    "/finalPictures%20copy/DSC03635.jpg",
    "/finalPictures%20copy/DSC04008.jpg",
    "/finalPictures%20copy/DSC04070.jpg",
    "/finalPictures%20copy/DSC03673.jpg",
    "/finalPictures%20copy/DSC04156.jpg",
    "/finalPictures%20copy/DSC03952.jpg",
    "/finalPictures%20copy/DSC04170.jpg",
    "/finalPictures%20copy/DSC04077.jpg",
    "/finalPictures%20copy/DSC04022.jpg",
    "/finalPictures%20copy/DSC03856.jpg",
    "/finalPictures%20copy/DSC04147.jpg",
    "/finalPictures%20copy/DSC03482.jpg",
    "/finalPictures%20copy/DSC03590.jpg",
    "/finalPictures%20copy/DSC03505.jpg",
    "/finalPictures%20copy/DSC03961.jpg",
    "/finalPictures%20copy/DSC04118.jpg",
    "/finalPictures%20copy/DSC03959.jpg",
    "/finalPictures%20copy/DSC03776.jpg",
    "/finalPictures%20copy/DSC04133.jpg",
    "/finalPictures%20copy/DSC03819.jpg",
    "/finalPictures%20copy/DSC04027.jpg",
    "/finalPictures%20copy/DSC03970.jpg",
];

const REVIEW_ITEMS: ReviewItem[] = [
    { type: "review", name: "Alex M.", role: "Pro Athlete", content: "A total shift in perspective.", rating: 5, width: "w-[300px]" },
    { type: "review", name: "Luca T.", role: "Coach", content: "Metrics that actually matter.", rating: 5, width: "w-[300px]" },
    { type: "review", name: "Sam T.", role: "Data Analyst", content: "Unmatched precision.", rating: 5, width: "w-[350px]" },
    { type: "review", name: "Sarah K.", role: "Runner", content: "Battery life is phenomenal.", rating: 5, width: "w-[300px]" },
    { type: "review", name: "Noah R.", role: "Midfielder", content: "The sprint breakdown changed how I train every week.", rating: 5, width: "w-[380px]" },
    { type: "review", name: "Ethan J.", role: "Academy Coach", content: "Clear data, zero noise. Exactly what players need.", rating: 5, width: "w-[360px]" },
    { type: "review", name: "Mia C.", role: "Winger", content: "I can finally see where my intensity drops late game.", rating: 5, width: "w-[370px]" },
    { type: "review", name: "Daniel P.", role: "Performance Analyst", content: "The positional maps are absurdly useful for session planning.", rating: 5, width: "w-[420px]" },
    { type: "review", name: "Riley B.", role: "Defender", content: "Fast sync and clean UI. No fluff, just useful insights.", rating: 5, width: "w-[360px]" },
    { type: "review", name: "Omar H.", role: "Strength Coach", content: "Workload trends make recovery decisions way smarter.", rating: 5, width: "w-[380px]" },
    { type: "review", name: "Isabella G.", role: "Forward", content: "I trust the numbers now more than my guesswork.", rating: 5, width: "w-[340px]" },
    { type: "review", name: "Caleb N.", role: "Team Captain", content: "Our whole squad competes better with this feedback loop.", rating: 5, width: "w-[390px]" },
    { type: "review", name: "Ava L.", role: "Box-to-Box Mid", content: "The heatmap view instantly highlights my off-ball movement.", rating: 5, width: "w-[410px]" },
    { type: "review", name: "Julian S.", role: "Scout", content: "Objective metrics made video review far more efficient.", rating: 5, width: "w-[390px]" },
    { type: "review", name: "Leah W.", role: "Club Athlete", content: "Comfortable vest, reliable tracking, and no distractions.", rating: 5, width: "w-[390px]" },
    { type: "review", name: "Mason D.", role: "Assistant Coach", content: "It surfaces the exact moments players lose tempo.", rating: 5, width: "w-[360px]" },
    { type: "review", name: "Nina F.", role: "Youth Coach", content: "My players actually understand their movement habits now.", rating: 5, width: "w-[400px]" },
    { type: "review", name: "Tyler V.", role: "Goalkeeper Coach", content: "Even keeper footwork sessions are easier to quantify.", rating: 5, width: "w-[390px]" },
    { type: "review", name: "Harper E.", role: "Athletic Trainer", content: "Recovery planning improved because effort levels are visible.", rating: 5, width: "w-[410px]" },
    { type: "review", name: "Victor A.", role: "Wingback", content: "Acceleration zones exposed where I needed extra power work.", rating: 5, width: "w-[410px]" },
    { type: "review", name: "Grace Y.", role: "College Player", content: "I brought my stats to recruitment meetings with confidence.", rating: 5, width: "w-[400px]" },
    { type: "review", name: "Jonah Q.", role: "Conditioning Coach", content: "Finally a reliable way to compare session intensity.", rating: 5, width: "w-[380px]" },
    { type: "review", name: "Sofia I.", role: "Striker", content: "The app shows progress week to week without overcomplicating.", rating: 5, width: "w-[420px]" },
    { type: "review", name: "Marcus Z.", role: "Pro Academy", content: "Precision and consistency are leagues above other trackers.", rating: 5, width: "w-[400px]" },
];

const IMAGE_WIDTHS = ["w-[430px]", "w-[440px]", "w-[450px]", "w-[460px]", "w-[420px]", "w-[470px]"] as const;

const IMAGE_ITEMS: ImageItem[] = IMAGE_CARD_SOURCES.map((src, index) => ({
    type: "image",
    label: `Phantom Track photo ${index + 1}`,
    width: IMAGE_WIDTHS[index % IMAGE_WIDTHS.length],
    src,
}));

const baseItems: MarqueeItem[] = [];
const maxItems = Math.max(REVIEW_ITEMS.length, IMAGE_ITEMS.length);
for (let i = 0; i < maxItems; i += 1) {
    if (REVIEW_ITEMS[i]) baseItems.push(REVIEW_ITEMS[i]);
    if (IMAGE_ITEMS[i]) baseItems.push(IMAGE_ITEMS[i]);
}

// Each row gets a unique set (no cross-row repeats on screen).
const row1Base = baseItems.filter((_, index) => index % 3 === 0);
const row2Base = baseItems.filter((_, index) => index % 3 === 1);
const row3Base = baseItems.filter((_, index) => index % 3 === 2);

// Duplicate each row once for a seamless infinite loop.
const row1 = [...row1Base, ...row1Base];
const row2 = [...row2Base, ...row2Base];
const row3 = [...row3Base, ...row3Base];

export function SocialProof() {
    return (
        <section id="reviews" className="py-24 bg-[#050505] overflow-hidden relative">
            <div className="mx-auto max-w-full px-0">

                {/* Headline */}
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16 text-center px-6">
                    TRUSTED BY <span className="text-primary">BALLERS</span>
                </h2>

                {/* 3 Infinite Marquee Rows */}
                <div className="flex flex-col gap-8 relative w-full overflow-hidden">

                    {/* Soft edge fade masks for smoother marquee blend */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-28 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-28 bg-gradient-to-l from-[#050505] via-[#050505]/85 to-transparent z-20 pointer-events-none" />

                    {/* Row 1: Right */}
                    <MarqueeRow items={row1} direction="right" speed={180} />

                    {/* Row 2: Left */}
                    <MarqueeRow items={row2} direction="left" speed={320} />

                    {/* Row 3: Right */}
                    <MarqueeRow items={row3} direction="right" speed={300} />
                </div>

            </div>
        </section>
    );
}

function MarqueeRow({
    items,
    direction,
    speed,
}: {
    items: MarqueeItem[];
    direction: "left" | "right";
    speed: number;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [loopWidth, setLoopWidth] = useState(0);
    const initializedRef = useRef(false);
    const glideVelocityRef = useRef(0);

    useEffect(() => {
        const measure = () => {
            const fullWidth = rowRef.current?.scrollWidth ?? 0;
            const halfWidth = fullWidth / 2;
            setLoopWidth(halfWidth);

            // Set initial offset once after dimensions are known.
            if (!initializedRef.current && halfWidth > 0) {
                x.set(direction === "right" ? -halfWidth : 0);
                initializedRef.current = true;
            }
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [direction, x]);

    useAnimationFrame((_, delta) => {
        if (loopWidth <= 0) return;

        let next = x.get();

        // Natural glide after release: velocity decays over time.
        let inertialStep = 0;
        if (!isDragging && Math.abs(glideVelocityRef.current) > 1) {
            inertialStep = glideVelocityRef.current * (delta / 1000);
            // Frame-rate independent damping.
            const damping = Math.pow(0.92, delta / 16.67);
            glideVelocityRef.current *= damping;
        } else if (!isDragging) {
            glideVelocityRef.current = 0;
        }

        // `speed` is the seconds needed to travel one loop width.
        const pxPerSecond = loopWidth / speed;
        const autoStep = pxPerSecond * (delta / 1000);

        if (!isDragging) {
            next += direction === "right" ? autoStep : -autoStep;
            next += inertialStep;
        }

        // Keep x in a stable looping range to avoid drift.
        while (next >= 0) next -= loopWidth;
        while (next < -loopWidth) next += loopWidth;
        x.set(next);
    });

    const normalizeToLoopRange = (value: number) => {
        if (loopWidth <= 0) return value;
        let normalized = value % loopWidth;
        if (normalized > 0) normalized -= loopWidth;
        return normalized;
    };

    return (
        <motion.div
            ref={rowRef}
            className="flex gap-6 pl-6 w-max cursor-grab active:cursor-grabbing select-none touch-pan-y"
            style={{ x }}
            drag="x"
            dragMomentum={false}
            onDragStart={() => {
                setIsDragging(true);
                glideVelocityRef.current = 0;
            }}
            onDragEnd={(_, info) => {
                setIsDragging(false);
                glideVelocityRef.current = info.velocity.x;
                x.set(normalizeToLoopRange(x.get()));
            }}
        >
            {items.map((item, index) => (
                <Card key={index} item={item} />
            ))}
        </motion.div>
    )
}

function Card({ item }: { item: MarqueeItem }) {
    if (item.type === "review") {
        return (
            <div className={cn(
                "flex-shrink-0 bg-[#111111] border border-white/12 p-8 rounded-[32px] flex flex-col justify-between shadow-xl h-[280px]",
                item.width
            )}>
                <div className="mb-4">
                    <div className="flex gap-1 mb-3">
                        {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-xl font-bold text-white leading-tight">
                        &quot;{item.content}&quot;
                    </p>
                </div>
                <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#050505]/5 flex items-center justify-center text-white font-bold">
                        {item.name[0]}
                    </div>
                    <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">{item.role}</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={cn(
                "flex-shrink-0 rounded-[32px] bg-[#111111] overflow-hidden relative group h-[280px] shadow-xl border border-white/10",
                item.width
            )}>
                <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 80vw, 420px"
                    draggable={false}
                    className="object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                />

                {/* Keep photos clean with no overlay markers/text */}
            </div>
        );
    }
}
