"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export type Brand = {
  name: string;
  src: string;
};

export const TEAM_BRANDS: Brand[] = [
  { name: "Crystal Lake Force", src: "/Logos/crystal-lake-force.png" },
  { name: "Sockers FC", src: "/Logos/sockers-fc.png" },
  { name: "Rockford Raptors FC", src: "/Logos/rockford-raptors.png" },
  { name: "Northwestern Wildcats", src: "/Logos/northwestern-wildcats.svg" },
  { name: "North Central Cardinals", src: "/Logos/north-central-cardinals.png" },
  { name: "MCC Scots", src: "/Logos/mcc-scots.png" },
  { name: "Huntley High School", src: "/Logos/huntley-high-school.png" },
  { name: "ECNL", src: "/Logos/ECNL-Badge.webp" },
  { name: "MLS Next", src: "/Logos/MLS_Next_logo.svg" },
  { name: "NPL / MAPL", src: "/Logos/npl-mapl.png" },
  { name: "NCAA", src: "/Logos/NCAA_logo.svg.webp" },
];

type BrandsProps = {
  /** Visual tone — dark for homepage, light for the Armory. */
  tone?: "dark" | "light";
  /** Optional custom eyebrow. */
  eyebrow?: string;
};

export function Brands({
  tone = "dark",
  eyebrow = "Athletes from these programs",
}: BrandsProps) {
  const reduce = useReducedMotion();
  const isDark = tone === "dark";

  return (
    <section
      aria-label="Teams and programs"
      className={`relative w-full overflow-hidden ${
        isDark
          ? "bg-[#050505] border-y border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 md:py-16">
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className={`text-center text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] mb-8 md:mb-10 ${
            isDark ? "text-white/40" : "text-slate-500"
          }`}
        >
          {eyebrow}
        </motion.p>

        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14 md:gap-y-10">
          {TEAM_BRANDS.map((brand, i) => (
            <motion.li
              key={brand.src}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-center"
            >
              <div
                className={`relative h-12 w-[120px] sm:h-14 sm:w-[140px] ${
                  isDark
                    ? "opacity-80 hover:opacity-100"
                    : "opacity-70 hover:opacity-100"
                } transition-opacity duration-200`}
                title={brand.name}
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  sizes="140px"
                  className="object-contain"
                  unoptimized={brand.src.endsWith(".svg")}
                />
              </div>
              <span className="sr-only">{brand.name}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
