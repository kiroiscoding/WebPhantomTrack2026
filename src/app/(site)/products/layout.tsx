import type { Metadata } from "next";

export const metadata: Metadata = {
  // `default` titles the /products list page (the root template appends the
  // "| Phantom Track" suffix); `template` is re-declared so that same suffix
  // keeps applying to child routes ([slug]) — a plain-string title
  // here would otherwise strip it from them.
  title: {
    default: "Shop — Trackers & Vests",
    template: "%s | Phantom Track",
  },
  description:
    "Shop Phantom Track: the Tracker Combo (GPS tracker + compression vest, $120) and the Phantom Vest ($35). Works with the free iOS app.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: "/products",
    title: "Shop Phantom Track",
    description:
      "The Tracker Combo (GPS tracker + compression vest, $120) and the Phantom Vest ($35). Works with the free iOS app.",
    images: [{ url: "/Device_Web.png", width: 1200, height: 630, alt: "Phantom Track performance hardware" }],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
