import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Engineered for Athletes",
  description:
    "Meet the team behind Phantom Track — athletes and engineers building elite GNSS performance wearables for soccer and field sports. This is our story.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Phantom Track — Engineered for Athletes",
    description:
      "Athletes and engineers building elite GNSS performance wearables for soccer and field sports.",
    images: [{ url: "/Device_Web.png", width: 1200, height: 630, alt: "Phantom Track performance hardware" }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
