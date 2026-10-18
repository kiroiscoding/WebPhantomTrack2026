import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phantom-track.com";
const SITE_NAME = "Phantom Track";
const SITE_DESCRIPTION =
  "Phantom Track is a GPS performance tracker for soccer players. Wear the tracker in the Phantom Vest to record distance, top speed and sprints, then see a 3D heatmap of every session in the free iOS app. Vest + tracker for $120.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Phantom Track — Elite Athlete Performance Tracking",
    template: "%s | Phantom Track",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  authors: [{ name: "Phantom Track", url: SITE_URL }],
  creator: "Phantom Track",
  publisher: "Phantom Track",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Phantom Track — Elite Athlete Performance Tracking",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/Device_Web.png",
        width: 1200,
        height: 630,
        alt: "Phantom Track — Performance Tracking Hardware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phantom Track — Elite Athlete Performance Tracking",
    description: SITE_DESCRIPTION,
    images: ["/Device_Web.png"],
  },
  icons: {
    icon: ["/favicon.ico", "/favicon.png"],
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Replace with the value from Google Search Console (Settings > Ownership verification > HTML tag)
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // Replace with the value from Bing Webmaster Tools
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION] }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "Phantom Track",
  url: SITE_URL,
  logo: `${SITE_URL}/logo_light.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2025",
  knowsAbout: [
    "Sports performance analytics",
    "GNSS for athletes",
    "Wearable training technology",
    "Soccer performance tracking",
    "Field sport analytics",
  ],
  sameAs: [
    "https://www.instagram.com/phantomtrackofficial",
    "https://www.tiktok.com/@phantomtrackofficial",
    "https://www.x.com/phantomtrackco",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@phantom-track.com",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Syne is self-hosted (see globals.css) — no render-blocking Google Fonts round trip */}
        <link
          rel="preload"
          href="/fonts/syne-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
