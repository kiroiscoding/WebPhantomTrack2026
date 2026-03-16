"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Target, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { ContactButton } from "@/components/ContactButton";

/* ── Swap these paths to choose your photos ─────────────────────── */
const HERO_PHOTO = "/finalPictures%20copy/DSC03674.jpg";
const STORY_PHOTO = "/finalPictures%20copy/DSC04062.jpg";
const TEAM_PHOTO = "/finalPictures%20copy/DSC03952.jpg";
/* ──────────────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.7, delay, ease: EASE },
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ═══════════ HERO — full-bleed photo + overlay title ═══════════ */}
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden">
        <Image
          src={HERO_PHOTO}
          alt="Phantom Track in action"
          fill
          sizes="100vw"
          unoptimized
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
          <motion.p
            {...fade(0)}
            className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/50 font-medium mb-4"
          >
            Est. 2025 — Chicago, IL
          </motion.p>
          <motion.h1
            {...fade(0.1)}
            className="text-[15vw] md:text-[10vw] lg:text-[8vw] font-black tracking-tighter leading-[0.85] drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]"
          >
            OUR ORIGIN<span className="text-primary">.</span>
          </motion.h1>
          <motion.p
            {...fade(0.25)}
            className="mt-5 text-lg md:text-xl text-white/60 max-w-md font-medium"
          >
            Two engineers. One pitch. No compromises.
          </motion.p>
        </div>
      </section>

      {/* ═══════════ STORY — photo + text split ═══════════ */}
      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Photo side */}
          <motion.div
            {...fade(0)}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden"
          >
            <Image
              src={STORY_PHOTO}
              alt="Building Phantom Track"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              className="object-cover"
            />
          </motion.div>

          {/* Text side */}
          <div className="lg:py-8">
            <motion.span
              {...fade(0)}
              className="inline-block text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6"
            >
              The Story
            </motion.span>
            <motion.h2
              {...fade(0.1)}
              className="text-3xl md:text-5xl font-bold leading-tight mb-8 tracking-tight"
            >
              We believe the loudest statement is made without words.
            </motion.h2>
            <div className="space-y-5 text-base md:text-lg text-white/55 leading-relaxed">
              <motion.p {...fade(0.2)}>
                Phantom Track was born from a simple frustration on our high school field:
                sports technology had become too noisy. Too many notifications, too much
                gamification, and not enough raw, actionable truth.
              </motion.p>
              <motion.p {...fade(0.3)}>
                As seniors, soccer players, and engineers, we didn&apos;t want another toy. We
                wanted a tool. So we set out to build the &quot;Invisible Edge&quot;—a sensor so
                lightweight you forget it&apos;s there, and an interface so clean it feels like
                second nature.
              </motion.p>
              <motion.p {...fade(0.4)}>
                We made this accessible for every player who, like us, demands precision over
                hype.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VALUES ═══════════ */}
      <section className="px-6 md:px-12 lg:px-20 pb-24 md:pb-36">
        <div className="mx-auto max-w-[1400px]">
          <motion.span
            {...fade(0)}
            className="inline-block text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4"
          >
            What We Stand For
          </motion.span>
          <motion.h3
            {...fade(0.05)}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-16"
          >
            Our Code<span className="text-primary">.</span>
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-3xl overflow-hidden">
            {[
              {
                icon: Target,
                title: "Precision First",
                desc: "Our sensors are calibrated to lab standards, ensuring every sprint and turn is captured with absolute fidelity.",
              },
              {
                icon: Shield,
                title: "Privacy by Design",
                desc: "Your data belongs to you. No social feeds, no public leaderboards unless you choose. We build for athletes, not ad networks.",
              },
              {
                icon: Zap,
                title: "Relentless Speed",
                desc: "From hardware to software, latency is the enemy. We engineer for real-time feedback that moves as fast as you do.",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fade(i * 0.1)}
                className="bg-[#0a0a0a] p-8 md:p-10 flex flex-col justify-between min-h-[280px] group hover:bg-[#0f0f0f] transition-colors duration-500"
              >
                <div className="w-11 h-11 rounded-full bg-white/[0.06] flex items-center justify-center mb-10 group-hover:bg-primary/20 transition-colors duration-500">
                  <v.icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors duration-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-3">{v.title}</h4>
                  <p className="text-white/45 leading-relaxed text-sm">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TEAM — photo above, text below ═══════════ */}
      <section className="px-6 md:px-12 lg:px-20 pb-24 md:pb-36">
        <div className="mx-auto max-w-[1400px] rounded-[28px] md:rounded-[40px] overflow-hidden">
          {/* Full photo, no overlay */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={TEAM_PHOTO}
              alt="The Phantom Track team"
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Text block below the photo */}
          <div className="bg-[#0a0a0a] p-8 md:p-16">
            <motion.span
              {...fade(0)}
              className="inline-block text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4"
            >
              The Team
            </motion.span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <motion.h2
                  {...fade(0.1)}
                  className="text-3xl md:text-5xl font-bold tracking-tight mb-4 max-w-2xl"
                >
                  Built on the pitch<span className="text-primary">.</span>
                </motion.h2>
                <motion.p
                  {...fade(0.2)}
                  className="text-white/55 text-base md:text-lg max-w-lg leading-relaxed"
                >
                  We aren&apos;t a big corporation. We&apos;re two high school seniors building the tech we
                  wished we had. We code it, we test it, and we play with it every single day.
                </motion.p>
              </div>
              <motion.div {...fade(0.3)} className="flex-shrink-0">
                <ContactButton label="Reach Out" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
