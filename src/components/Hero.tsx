"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, Activity, MapPin, Ghost, Infinity as InfinityIcon } from "lucide-react";

const reviews = [
    {
        id: 1,
        text: "completely changed how I see the game. I stopped guessing and started seeing the pitch like a pro scout."
    },
    {
        id: 2,
        text: "The accuracy is unreal. Every sprint, every turn is captured with precision I haven't seen before."
    },
    {
        id: 3,
        text: "Battery life that actually lasts through double sessions. Finally, tech that keeps up with the schedule."
    }
];

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeReview, setActiveReview] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);

    // Auto-rotate reviews
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen w-full flex flex-col font-sans overflow-visible z-20 bg-[#b5b5b5] pt-48 mb-[-100px]">

            {/* Top Half Content */}
            <div className="flex-1 relative flex flex-col justify-end pb-27 w-full z-10">

                {/* Defined Faint Purple Circle - Moved Down */}
                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#af9db3]/20 pointer-events-none" />

                <div className="w-full relative z-10 px-4 flex flex-col items-center">
                    {/* Main Headline - Single Line */}
                    <motion.div
                        style={{ y: textY }}
                        className="w-full max-w-[95vw] mx-auto text-center relative"
                    >
                        <h1 className="text-[13vw] xl:text-[16vw] leading-[0.8] font-bold tracking-tighter text-[#e5e5e5] whitespace-nowrap w-full mix-blend-difference">
                            DATA DRIVEN<span className="text-[#a855f7]">.</span>
                        </h1>

                        {/* Subtext positioned relative to the headline */}
                        <div className="absolute -bottom-12 right-0 hidden md:block text-right">
                            <p className="text-lg xl:text-xl text-black/60 font-medium leading-tight">
                                Elevate your training experience,<br />
                                bringing data to life.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Floating Box (Card Style) - Higher Z-Index to cover circle */}
            <div className="w-full px-4 md:px-8 pb-8 relative z-20">
                <div className="mx-auto w-full max-w-[1400px] bg-[#050505] rounded-[40px] min-h-[60vh] relative flex items-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="w-full px-8 py-12 md:py-0 grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">

                        {/* Left Review - Spans 4 cols */}
                        <div className="hidden md:flex flex-col gap-4 md:col-span-4 pl-0 pr-12 -mt-40 items-end text-right">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4.5 h-4.5 fill-primary text-primary" />
                                ))}
                            </div>

                            <div className="h-24 relative w-full flex justify-end">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={activeReview}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-lg text-white/80 font-medium leading-relaxed max-w-sm absolute right-0"
                                    >
                                        &quot;{reviews[activeReview].text}&quot;
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Review Dots */}
                            <div className="flex gap-2 mt-2">
                                {reviews.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveReview(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeReview === index
                                            ? "bg-primary w-6"
                                            : "bg-white/20 hover:bg-white/40"
                                            }`}
                                        aria-label={`Go to review ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Dashboard Bento Grid - Spans 8 cols */}
                        <div className="col-span-1 md:col-span-8 h-full flex flex-col justify-center md:pl-125">
                            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl ml-auto">

                                {/* Pro-Grade Dynamics */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <Activity className="w-6 h-6 text-primary" />
                                        <div className="flex gap-1">
                                            <div className="w-1 h-3 bg-white/20 rounded-full" />
                                            <div className="w-1 h-4 bg-primary rounded-full" />
                                            <div className="w-1 h-2 bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Pro-Grade Dynamics</h3>
                                        <p className="text-xs text-white/50 font-mono">1000Hz SAMPLING</p>
                                    </div>
                                </div>

                                {/* Positional Intelligence */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <MapPin className="w-6 h-6 text-primary" />
                                        <div className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-1 rounded flex flex-col leading-tight">
                                            <span>X: 42.1</span>
                                            <span>Y: 18.9</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Positional Intel</h3>
                                        <p className="text-xs text-white/50 font-mono">SUB-METER GNSS</p>
                                    </div>
                                </div>

                                {/* Invisible Footprint */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <Ghost className="w-6 h-6 text-primary" />
                                        <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white/10 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Invisible Footprint</h3>
                                        <p className="text-xs text-white/50 font-mono">12g • IP67 RATED</p>
                                    </div>
                                </div>

                                {/* Unlimited Sessions */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <InfinityIcon className="w-6 h-6 text-primary" />
                                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Unlimited Sessions</h3>
                                        <p className="text-xs text-white/50 font-mono">40HR BATTERY</p>
                                    </div>
                                </div>

                            </div>

                            {/* Live Data Ticker - Seamless Loop */}
                            <div className="mt-6 w-full max-w-2xl ml-auto border-t border-white/10 pt-4 overflow-hidden relative mask-linear-gradient">
                                <div className="flex whitespace-nowrap text-[10px] font-mono text-primary/60 tracking-widest min-w-max">
                                    <motion.div
                                        animate={{ x: ["0%", "-25%"] }}
                                        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                        className="flex gap-8 pr-8"
                                    >
                                        {/* Set 1 */}
                                        <span>GNSS_SYNC... OK</span>
                                        <span>IMU_HZ: 1000... ACTIVE</span>
                                        <span>CALIBRATING_HEATMAP... DONE</span>
                                        <span>BATTERY_OPT... 98%</span>
                                        <span>BLE_CONN... STABLE</span>
                                        <span>SESSION_ID... #88291</span>

                                        {/* Set 2 */}
                                        <span>GNSS_SYNC... OK</span>
                                        <span>IMU_HZ: 1000... ACTIVE</span>
                                        <span>CALIBRATING_HEATMAP... DONE</span>
                                        <span>BATTERY_OPT... 98%</span>
                                        <span>BLE_CONN... STABLE</span>
                                        <span>SESSION_ID... #88291</span>

                                        {/* Set 3 */}
                                        <span>GNSS_SYNC... OK</span>
                                        <span>IMU_HZ: 1000... ACTIVE</span>
                                        <span>CALIBRATING_HEATMAP... DONE</span>
                                        <span>BATTERY_OPT... 98%</span>
                                        <span>BLE_CONN... STABLE</span>
                                        <span>SESSION_ID... #88291</span>

                                        {/* Set 4 */}
                                        <span>GNSS_SYNC... OK</span>
                                        <span>IMU_HZ: 1000... ACTIVE</span>
                                        <span>CALIBRATING_HEATMAP... DONE</span>
                                        <span>BATTERY_OPT... 98%</span>
                                        <span>BLE_CONN... STABLE</span>
                                        <span>SESSION_ID... #88291</span>
                                    </motion.div>
                                </div>
                                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10" />
                                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradient Bridge - Smooth Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-[#050505]/0 pointer-events-none z-10" />

            {/* Center Image (Overlapping Both) - Highest Z to sit on top of everything */}
            <motion.div
                style={{ scale }}
                className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[500px] aspect-square z-30"
            >
                <div className="w-full h-full rounded-[60px] bg-[#111] border border-white/10 shadow-2xl shadow-black/80 flex items-center justify-center relative overflow-hidden group">
                    {/* Placeholder for the actual device */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/90" />

                    {/* Product Texture / Detail */}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <span className="text-white/30 font-mono text-xl tracking-[0.2em] group-hover:text-primary/70 transition-colors duration-500">
                            PHANTOM
                        </span>
                        <div className="w-20 h-1 bg-primary/50 rounded-full blur-[2px]" />
                    </div>

                    {/* Glowing Ring Effect */}
                    <div className="absolute w-[65%] h-[65%] rounded-full border border-white/5 bg-white/5 blur-md" />
                    <div className="absolute w-[35%] h-[35%] rounded-full bg-[#050505] border border-white/10 shadow-inner" />
                </div>
            </motion.div>

        </section>
    );
}
