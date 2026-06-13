import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & FAQ — Setup, Warranty, Help",
  description:
    "Get help with your Phantom Track device: setup guides, troubleshooting, warranty, and answers to common questions. Reach our engineering team directly.",
  alternates: { canonical: "/support" },
  openGraph: {
    type: "website",
    url: "/support",
    title: "Phantom Track Support & FAQ",
    description:
      "Setup guides, troubleshooting, warranty, and direct engineering contact for Phantom Track athletes.",
    images: [{ url: "/Device_Web.png", width: 1200, height: 630, alt: "Phantom Track performance hardware" }],
  },
};

// FAQPage structured data — mirrors the on-page FAQ verbatim so it is eligible
// for FAQ rich results. Keep in sync with the FAQItem entries in page.tsx.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I calibrate the Phantom Vest?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Calibration is automatic. The vest initiates a GNSS lock upon startup. Ensure you are outdoors with a clear view of the sky for at least 30 seconds before beginning your session.",
      },
    },
    {
      "@type": "Question",
      name: "Is the hardware water resistant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the Phantom Track module is IP67 rated, meaning it can withstand immersion in water up to 1 meter for 30 minutes. It is designed for all-weather play.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export data to other platforms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The app supports export to CSV, GPX, and direct integration with major coaching platforms via our API.",
      },
    },
    {
      "@type": "Question",
      name: "What is the battery life?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The module features a 12-hour active tracking battery life. Standby time is up to 7 days.",
      },
    },
  ],
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
