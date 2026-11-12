"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const APP_STORE_URL = "https://apps.apple.com/us/app/phantom-track/id6758968140";
// Set once the Android app is live on Google Play; until then the badge isn't a link.
export const GOOGLE_PLAY_URL: string | null = null;

const badgeLinkClass =
  "rounded-[10px] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const badgeImageClass = "h-12 w-auto md:h-14";

/** Official App Store / Google Play badges. */
export function StoreBadges({ className = "" }: { className?: string }) {
  const googlePlay = (
    <Image
      src="/badges/google-play.svg"
      alt="Get it on Google Play"
      width={190}
      height={56}
      unoptimized
      className={badgeImageClass}
    />
  );

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
          className={badgeImageClass}
        />
      </motion.a>
      {GOOGLE_PLAY_URL ? (
        <motion.a
          href={GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className={badgeLinkClass}
        >
          {googlePlay}
        </motion.a>
      ) : (
        <span className="cursor-default opacity-50" title="Coming soon to Google Play">
          {googlePlay}
        </span>
      )}
    </div>
  );
}
