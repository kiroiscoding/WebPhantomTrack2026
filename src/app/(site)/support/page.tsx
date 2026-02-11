"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Book,
  Wrench,
  User,
  Shield,
  Mail,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      {/* Hero Section */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-[10vw] lg:text-[12vw] leading-[0.8] font-bold tracking-tighter text-[#050505] mb-8">
              SUPPORT<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#050505]/70 max-w-2xl mx-auto font-medium mb-12">
              Operational assistance. Manuals. Direct engineering contact.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-black/40" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm border border-black/5 rounded-full py-4 pl-14 pr-6 text-lg text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-lg"
              />
            </div>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            <CategoryCard
              icon={Book}
              title="Getting Started"
              desc="Quick start guides and setup protocols."
              delay={0.1}
            />
            <CategoryCard
              icon={Wrench}
              title="Troubleshooting"
              desc="Diagnose hardware and software anomalies."
              delay={0.2}
            />
            <CategoryCard
              icon={User}
              title="Account"
              desc="Manage subscriptions and team access."
              delay={0.3}
            />
            <CategoryCard
              icon={Shield}
              title="Warranty"
              desc="Claims, returns, and hardware policies."
              delay={0.4}
            />
          </div>

          {/* FAQ Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
            <div className="lg:col-span-4">
              <h2 className="text-4xl font-bold text-[#050505] mb-6">
                FREQUENTLY
                <br />
                ASKED.
              </h2>
              <p className="text-[#050505]/70 text-lg">
                Common queries from the Phantom Track community.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <FAQItem
                question="How do I calibrate the Phantom Vest?"
                answer="Calibration is automatic. The vest initiates a GNSS lock upon startup. Ensure you are outdoors with a clear view of the sky for at least 30 seconds before beginning your session."
              />
              <FAQItem
                question="Is the hardware water resistant?"
                answer="Yes, the Phantom Track module is IP67 rated, meaning it can withstand immersion in water up to 1 meter for 30 minutes. It is designed for all-weather play."
              />
              <FAQItem
                question="Can I export data to other platforms?"
                answer="Absolutely. The App supports export to CSV, GPX, and direct integration with major coaching platforms via our API."
              />
              <FAQItem
                question="What is the battery life?"
                answer="The module features a 12-hour active tracking battery life. Standby time is up to 7 days."
              />
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-[#050505] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden mb-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">STILL OFFLINE?</h2>
              <p className="text-white/60 max-w-xl mb-10 text-lg">
                Our engineering team is on standby. No bots, just ballers who code.
              </p>
              <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <span>Open Ticket</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CategoryCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group bg-[#e5e5e5] hover:bg-white p-8 rounded-[32px] transition-colors duration-300 cursor-pointer"
    >
      <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
      <p className="text-black/60 text-sm">{desc}</p>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#e5e5e5] rounded-[24px] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
      >
        <span className="text-lg font-bold text-black">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 opacity-50" />
        ) : (
          <ChevronDown className="w-5 h-5 opacity-50" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 md:px-8 pb-8 text-black/70 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

