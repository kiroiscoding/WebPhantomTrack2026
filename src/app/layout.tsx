import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phantom Track | The Invisible Edge",
  description: "Elevate your listening experience with Phantom Track.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
