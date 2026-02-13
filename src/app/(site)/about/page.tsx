"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Shield, Target, Zap, type LucideIcon } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
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
              OUR ORIGIN<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#050505]/70 max-w-2xl mx-auto font-medium">
              Two engineers. One pitch. No compromises.
            </p>
          </motion.div>

          {/* Mission Statement - Floating Black Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#050505] rounded-[28px] md:rounded-[40px] p-6 md:p-24 shadow-2xl relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(168,85,247,0.1),transparent_70%)]" />

            <div className="relative z-10 max-w-4xl">
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">
                We believe the loudest statement is made without words.
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-white/60 leading-relaxed">
                <p>
                  Phantom Track was born from a simple frustration on our high school field:
                  sports technology had become too noisy. Too many notifications, too much
                  gamification, and not enough raw, actionable truth.
                </p>
                <p>
                  As seniors, soccer players, and engineers, we didn&apos;t want another toy. We
                  wanted a tool. So we set out to build the &quot;Invisible Edge&quot;—a sensor so
                  lightweight you forget it&apos;s there, and an interface so clean it feels like
                  second nature.
                </p>
                <p>
                  We made this accessible for every player who, like us, demands precision over
                  hype.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="px-6 lg:px-8 mb-32">
        <div className="mx-auto max-w-[1400px]">
          <h3 className="text-4xl font-bold text-[#050505] mb-12 tracking-tight">OUR CODE</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={Target}
              title="Precision First"
              desc="We don't guess. Our sensors are calibrated to lab standards, ensuring every sprint and turn is captured with absolute fidelity."
              className="bg-[#050505] text-white"
            />
            <ValueCard
              icon={Shield}
              title="Privacy by Design"
              desc="Your data belongs to you. No social feeds, no public leaderboards unless you choose. We build for the athlete, not the ad network."
              className="bg-[#e5e5e5] text-black"
            />
            <ValueCard
              icon={Zap}
              title="Relentless Speed"
              desc="From hardware to software, latency is the enemy. We engineer for real-time feedback that moves as fast as you do."
              className="bg-[#e5e5e5] text-black"
            />
          </div>
        </div>
      </section>

      {/* Team / Culture */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="mx-auto max-w-[1400px] bg-[#050505] rounded-[28px] md:rounded-[40px] p-8 md:p-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tight">
                BUILT ON THE PITCH.
              </h2>
              <p className="text-white/60 text-lg mb-8">
                We aren&apos;t a big corporation. We&apos;re two high school seniors building the tech we
                wished we had. We code it, we test it, and we play with it every single day.
              </p>
              <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <span>Reach Out</span>
                <Mail className="w-5 h-5" />
              </button>
            </div>

            {/* Abstract Team Visual */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="aspect-square bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                <span className="text-2xl md:text-4xl font-bold text-white mb-2">ENG.</span>
                <span className="text-white/30 text-xs md:text-sm">Hardware & Code</span>
              </div>
              <div className="aspect-square bg-white/10 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 md:p-6 text-center lg:translate-y-8">
                <span className="text-2xl md:text-4xl font-bold text-white mb-2">11</span>
                <span className="text-white/30 text-xs md:text-sm">Jersey Number</span>
              </div>
              <div className="aspect-square bg-white/10 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 md:p-6 text-center lg:-translate-y-8">
                <span className="text-2xl md:text-4xl font-bold text-white mb-2">07</span>
                <span className="text-white/30 text-xs md:text-sm">Jersey Number</span>
              </div>
              <div className="aspect-square bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                <span className="text-2xl md:text-4xl font-bold text-white mb-2">FWD.</span>
                <span className="text-white/30 text-xs md:text-sm">Position</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ValueCard({
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

