import type { Metadata } from "next";

export const metadata: Metadata = {
  // `default` titles the /products list page (the root template appends the
  // "| Phantom Track" suffix); `template` is re-declared so that same suffix
  // keeps applying to child routes (apparel, [slug]) — a plain-string title
  // here would otherwise strip it from them.
  title: {
    default: "The Armory — Shop Trackers & Vests",
    template: "%s | Phantom Track",
  },
  description:
    "Shop Phantom Track hardware: the Phantom Core GNSS sensor, elite compression vest, and the complete Tracker Combo. Pro-grade gear engineered for athletes.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: "/products",
    title: "The Armory — Phantom Track Hardware",
    description:
      "Pro-grade athlete performance hardware: the Phantom Core GNSS sensor, compression vest, and Tracker Combo.",
    images: [{ url: "/Device_Web.png", width: 1200, height: 630, alt: "Phantom Track performance hardware" }],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
