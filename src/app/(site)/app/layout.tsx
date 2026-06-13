import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phantom-track.com";
const APP_STORE_URL = "https://apps.apple.com/us/app/phantom-track/id6758968140";

export const metadata: Metadata = {
  title: "iOS App — Stats, Heatmaps & AI Coach",
  description:
    "Download the Phantom Track iOS app. Track sprint speed, distance, and 3D field heatmaps, then get AI-powered coaching after every session. Free on the App Store.",
  alternates: { canonical: "/app" },
  openGraph: {
    type: "website",
    url: "/app",
    title: "Phantom Track iOS App — Your Game. Your Data.",
    description:
      "Real-time performance tracking, AI-powered coaching, and social leaderboards — all in your pocket. Free on the App Store.",
    images: [{ url: "/app/new-screenshots/home.png", alt: "Phantom Track app home screen" }],
  },
};

// MobileApplication structured data — qualifies the page for app rich results.
// Facts are limited to what is verifiable; no aggregateRating is fabricated.
const appSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Phantom Track",
  applicationCategory: "SportsApplication",
  operatingSystem: "iOS",
  url: `${SITE_URL}/app`,
  downloadUrl: APP_STORE_URL,
  installUrl: APP_STORE_URL,
  description:
    "Phantom Track turns your training data into your competitive edge — real-time session stats, 3D field heatmaps, sprint maps, AI coaching, and social leaderboards for soccer and field-sport athletes.",
  publisher: { "@type": "Organization", name: "Phantom Track" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  screenshot: [
    `${SITE_URL}/app/new-screenshots/home.png`,
    `${SITE_URL}/app/new-screenshots/stats.png`,
    `${SITE_URL}/app/new-screenshots/sprint-map.png`,
    `${SITE_URL}/app/new-screenshots/ai-coach.png`,
    `${SITE_URL}/app/new-screenshots/compare.png`,
    `${SITE_URL}/app/new-screenshots/friends.png`,
  ],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {children}
    </>
  );
}
