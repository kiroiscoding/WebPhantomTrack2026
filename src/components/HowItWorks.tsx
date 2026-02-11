"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Attach",
    description: "Securely fasten the Phantom Track device to your gear using the universal mount.",
  },
  {
    id: "02",
    title: "Train",
    description: "Focus on your performance while our advanced sensors capture every metric in real-time.",
  },
  {
    id: "03",
    title: "Review",
    description: "Sync with the app to analyze your data, gain insights, and improve your technique.",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="features" className="py-20 bg-[#b5b5b5]">
      <div className="w-full px-4 md:px-8">
        <div className="mx-auto max-w-[1400px] bg-[#050505] rounded-[40px] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-24 text-center">
              Seamless Integration
            </h2>

            <div ref={containerRef} className="relative space-y-32">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent -translate-x-1/2 hidden md:block" />

              {steps.map((step, index) => (
                <StepCard key={step.id} step={step} index={index} />
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className={`flex flex-col md:flex-row items-center gap-12 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1 text-center md:text-left">
         <div className={`flex flex-col ${isEven && "md:items-end md:text-right"}`}>
            <span className="text-6xl font-bold text-primary/20 mb-4">{step.id}</span>
            <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
            <p className="text-muted-foreground text-lg max-w-md">
              {step.description}
            </p>
         </div>
      </div>
      
      {/* Center Marker */}
      <div className="relative z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black border border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
        <div className="w-3 h-3 bg-primary rounded-full" />
      </div>

      <div className="flex-1 w-full md:w-auto">
        <div className="aspect-video rounded-2xl glass border border-white/5 flex items-center justify-center bg-white/5">
             <span className="text-muted-foreground/50">Visual for {step.title}</span>
        </div>
      </div>
    </motion.div>
  );
}
