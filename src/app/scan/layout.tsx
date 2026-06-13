import type { Metadata } from "next";

// Utility QR-code landing — not a search destination.
export const metadata: Metadata = {
  title: "Scan",
  robots: { index: false, follow: false },
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
