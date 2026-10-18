"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HERO = {
  src: "/products/phantom-vest/BicyclePicture.png",
  alt: "Athlete wearing the Phantom Vest mid bicycle kick on the pitch",
};

const GALLERY = [
  {
    src: "/images/juggle-vest.png",
    alt: "Athlete juggling in the Phantom Vest — chest branding visible",
  },
  {
    src: "/images/IMG_1580.jpg",
    alt: "Back view of the Phantom Vest during a juggle",
  },
  {
    src: "/images/IMG_1468.jpg",
    alt: "Athlete striking the ball in the Phantom Vest",
  },
  {
    src: "/images/IMG_1607.jpg",
    alt: "Side bicycle kick wearing the Phantom Vest",
  },
  {
    src: "/images/IMG_1703.jpg",
    alt: "Phantom Vest in training on the pitch",
  },
  {
    src: "/images/IMG_1722.jpg",
    alt: "Full-body action shot in the Phantom Vest",
  },
] as const;

export function InAction() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Phantom Vest in action"
      className="relative w-full overflow-hidden bg-[#050505]"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-[0.28em] text-primary uppercase mb-3">
              Phantom Vest // On the pitch
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
              BUILT FOR
              <br />
              THE MOMENT
              <span className="text-primary">.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/60 max-w-md leading-relaxed">
              Zero distraction. Locked between the shoulder blades. Capture every sprint and
              turn — while you play.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/products/tracker-combo"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold tracking-wide text-black transition-colors hover:bg-gray-200"
            >
              Get the Tracker Combo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/products/phantom-vest"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Spare vest only
            </Link>
          </div>
        </motion.div>

        {/* Editorial layout: full bicycle hero + supporting grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Hero — portrait frame so the kick stays zoomed out (full figure) */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none aspect-[3/4] overflow-hidden rounded-[28px] md:rounded-[36px] bg-[#0a0a0a] ring-1 ring-white/10 shadow-[0_30px_80px_-40px_rgba(168,85,247,0.45)]">
              <Image
                src={HERO.src}
                alt={HERO.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 55vw"
                // object-contain = true zoom-out: entire bicycle kick visible
                className="object-contain object-center"
                priority={false}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm ring-1 ring-white/15">
                The moment
              </span>
            </div>
          </motion.div>

          {/* Supporting shots — asymmetric stack */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4 content-start">
            {GALLERY.map((shot, i) => {
              const tall = i === 0 || i === 3;
              return (
                <motion.div
                  key={shot.src}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.5,
                    delay: reduce ? 0 : 0.08 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#0a0a0a] ring-1 ring-white/10 ${
                    tall ? "aspect-[3/4]" : "aspect-[4/5]"
                  } ${i === 1 ? "mt-0 lg:mt-8" : ""} ${i === 4 ? "lg:-mt-6" : ""}`}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
