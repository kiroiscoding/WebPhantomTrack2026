export type ProductTheme = "dark" | "light";

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  priceCents: number;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  images: string[]; // Tailwind bg-* placeholders for now
  theme: ProductTheme;
  purchasable: boolean;
};

export const PRODUCTS: Record<string, Product> = {
  "tracker-combo": {
    slug: "tracker-combo",
    name: "Tracker Combo",
    subtitle: "The Complete Ecosystem",
    priceCents: 12000,
    rating: 4.9,
    reviews: 128,
    description:
      "The Phantom Core Gen-2 meets our elite compression vest. This is the gold standard for athlete monitoring. Capture 1000 data points per second with surgical precision.",
    features: [
      "1000Hz GNSS Module",
      "Elite Compression Vest (Unisex)",
      "Magnetic Charging Dock",
      "Unlimited Cloud Storage",
      "1-Year Warranty",
    ],
    specs: [
      { label: "Battery Life", value: "12 Hours Active" },
      { label: "Water Resistance", value: "IP67 Certified" },
      { label: "Connectivity", value: "Bluetooth 5.3 / Ant+" },
      { label: "Weight", value: "45g (Module)" },
    ],
    images: ["bg-[#1a1a1a]", "bg-[#262626]", "bg-[#333333]"],
    theme: "dark",
    purchasable: true,
  },
  "phantom-vest": {
    slug: "phantom-vest",
    name: "Phantom Vest",
    subtitle: "Professional Grade Textile",
    priceCents: 3500,
    rating: 4.8,
    reviews: 84,
    description:
      "Engineered for zero distraction. The Phantom Vest holds the core unit securely between the shoulder blades for optimal satellite reception and comfort.",
    features: [
      "Surgical-Grade Elastane",
      "Anti-Slip Silicone Grip",
      "Machine Washable",
      "Breathable Mesh Back",
    ],
    specs: [
      { label: "Material", value: "Polyester / Elastane Blend" },
      { label: "Fit", value: "Compression" },
      { label: "Sizes", value: "XS - XXL" },
      { label: "Care", value: "Cold Wash / Hang Dry" },
    ],
    images: ["bg-[#e5e5e5]", "bg-[#d4d4d4]", "bg-[#c4c4c4]"],
    theme: "light",
    purchasable: true,
  },
  apparel: {
    slug: "apparel",
    name: "Apparel",
    subtitle: "Performance Wear",
    priceCents: 0,
    rating: 0,
    reviews: 0,
    description:
      "Performance wear that keeps up. Moisture-wicking drill top and shorts designed for high-intensity sessions.",
    features: ["4-Way Stretch Fabric", "Thermal Regulation", "Reflective Detailing", "Quick-Dry Technology"],
    specs: [],
    images: ["bg-[#1a1a1a]", "bg-[#262626]", "bg-[#333333]"],
    theme: "dark",
    purchasable: false,
  },
};

export function getProduct(slug: string): Product | null {
  return PRODUCTS[slug] ?? null;
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

