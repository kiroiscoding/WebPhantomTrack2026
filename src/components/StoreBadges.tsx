"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const APP_STORE_URL = "https://apps.apple.com/us/app/phantom-track/id6758968140";

const badgeLinkClass =
  "rounded-[10px] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/** Official App Store badge, plus an Android status line until the Play listing exists. */
export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className}`}>
      <motion.a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={badgeLinkClass}
      >
        <Image
          src="/badges/app-store.svg"
          alt="Download on the App Store"
          width={168}
          height={56}
          unoptimized
          className="h-12 w-auto md:h-14"
        />
      </motion.a>
      <span className="text-sm text-white/50 font-medium">Android app coming soon</span>
    </div>
  );
}
