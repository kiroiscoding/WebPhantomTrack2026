import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve modern formats for smaller transfers / faster LCP. Pages using
  // <Image unoptimized> opt out of this on a per-image basis.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 100],
  },
  async redirects() {
    return [
      // Apparel was removed from the store; send old links to the shop.
      { source: "/products/apparel", destination: "/products", permanent: false },
      // The Acceptable Use page was removed; prohibited use lives in the Terms.
      { source: "/acceptable-use", destination: "/terms", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' localhost:3000 wlkdenterprises.com *.wlkdenterprises.com" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Static media in /public is otherwise served with max-age=0, forcing a
        // revalidation round trip for every image/video on every visit.
        source: "/:all*(\\.mp4|\\.webm|\\.jpg|\\.jpeg|\\.png|\\.webp|\\.avif|\\.svg|\\.woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/fonts/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
        ],
      },
    ];
  },
};

export default nextConfig;
