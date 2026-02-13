"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Map, Zap, BarChart3, Share2, ArrowRight, type LucideIcon } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      {/* Hero Section */}
      <section className="px-6 lg:px-8 mb-32">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-[10vw] lg:text-[12vw] leading-[0.8] font-bold tracking-tighter text-[#050505] mb-8">
              COMMAND CENTER<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#050505]/70 max-w-2xl mx-auto font-medium">
              Your pocket analyst. Real-time metrics, heatmap visualization, and professional-grade
              insights at your fingertips.
            </p>
          </motion.div>

          {/* Hero Visual - Floating Black Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#050505] rounded-[28px] md:rounded-[40px] p-4 md:p-20 shadow-2xl relative overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center justify-center"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Phone Trio Mockup */}
            <div className="relative z-10 flex items-center justify-center gap-3 md:gap-12 transform scale-[0.6] min-[400px]:scale-75 md:scale-100">
              {/* Left Phone (Behind) */}
              <div className="hidden md:block w-[280px] h-[580px] rounded-[40px] border-[6px] border-[#222] shadow-2xl transform -rotate-12 translate-y-12 opacity-60">
                <div className="relative w-full h-full bg-[#050505] rounded-[32px] overflow-hidden">
                  <Image
                    src="/app/screenshots/LeftScreenshot.PNG"
                    alt="Phantom Track app screenshot (left)"
                    fill
                    className="object-cover"
                    priority
                    sizes="280px"
                  />
                </div>
              </div>

              {/* Center Phone (Main) */}
              <div className="w-[320px] h-[650px] bg-[#050505] rounded-[50px] border-[8px] border-[#1a1a1a] shadow-[0_0_50px_rgba(168,85,247,0.3)] z-20 relative overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="/app/screenshots/MiddleScreenshot.PNG"
                    alt="Phantom Track app screenshot (center)"
                    fill
                    className="object-cover"
                    priority
                    sizes="320px"
                  />
                  {/* subtle gloss */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                </div>
              </div>

              {/* Right Phone (Behind) */}
              <div className="hidden md:block w-[280px] h-[580px] rounded-[40px] border-[6px] border-[#222] shadow-2xl transform rotate-12 translate-y-12 opacity-60">
                <div className="relative w-full h-full bg-[#050505] rounded-[32px] overflow-hidden">
                  <Image
                    src="/app/screenshots/RightScreenshot.PNG"
                    alt="Phantom Track app screenshot (right)"
                    fill
                    className="object-cover"
                    priority
                    sizes="280px"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AppFeatureCard
              icon={Map}
              title="Positional Heatmaps"
              desc="Visualize your movement patterns with precision. Identify zones of dominance and areas for improvement."
              className="lg:col-span-2 bg-[#050505] text-white"
            />
            <AppFeatureCard
              icon={Zap}
              title="Sprint Analysis"
              desc="Break down every burst. Analyze acceleration, max speed, and sprint frequency."
              className="bg-[#e5e5e5] text-black"
            />
            <AppFeatureCard
              icon={BarChart3}
              title="Performance Trends"
              desc="Track your progress over time. Compare sessions and monitor workload."
              className="bg-[#e5e5e5] text-black"
            />
            <AppFeatureCard
              icon={Share2}
              title="Social Sharing"
              desc="Share your stats with teammates and coaches instantly."
              className="lg:col-span-2 bg-[#050505] text-white"
            />
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-6 lg:px-8 mt-32 mb-32">
        <div className="mx-auto max-w-[1400px] bg-[#050505] rounded-[28px] md:rounded-[40px] p-8 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2),transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              READY TO LEVEL UP?
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <span>Download for iOS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                Android Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function AppFeatureCard({
  icon: Icon,
  title,
  desc,
  className,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div className={`p-8 rounded-[32px] flex flex-col justify-between min-h-[300px] ${className}`}>
      <div className="w-12 h-12 rounded-full bg-current opacity-10 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="opacity-70 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// (kept for future use)

