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
  /** "What's inside" list on the PDP. Falls back to `features` when unset. */
  inTheBox?: string[];
  specs: { label: string; value: string }[];
  /** Public image paths (e.g. `/products/phantom-vest/vest-1.png`). Empty = no photos yet. */
  images: string[];
  /** Size options shown on the PDP. Empty = no size picker. */
  sizes: string[];
  /** Short labels for gallery thumbs (same order as `images`). */
  imageLabels?: string[];
  /** If set, PDP clarifies this accessory needs the named device. */
  requiresDevice?: string;
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
    inTheBox: ["Phantom Vest", "Phantom Tracker", "Charging Cable"],
    specs: [
      { label: "Battery Life", value: "12 Hours" },
      { label: "Water Resistance", value: "Water Resistant" },
      { label: "Connectivity", value: "Bluetooth" },
    ],
    images: [
      "/productImage.png",
      "/products/phantom-vest/BicyclePicture.png",
      "/images/juggle-vest.png",
      "/images/IMG_1580.jpg",
      "/images/IMG_1468.jpg",
      "/images/IMG_1607.jpg",
      "/products/phantom-vest/vest-2.png",
      "/images/ReviewStep3.png",
    ],
    imageLabels: [
      "Phantom Core",
      "In action",
      "On the pitch",
      "Vest back",
      "Training",
      "Play",
      "Elite Vest",
      "In the app",
    ],
    sizes: ["S", "M", "L"],
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
      { label: "Sizes", value: "S – L" },
      { label: "Care", value: "Cold Wash / Hang Dry" },
    ],
    images: [
      "/products/phantom-vest/BicyclePicture.png",
      "/images/juggle-vest.png",
      "/images/IMG_1580.jpg",
      "/products/phantom-vest/vest-2.png",
      "/products/phantom-vest/vest-1.png",
    ],
    imageLabels: ["In action", "Chest branding", "Back view", "Front & back", "Sensor pouch"],
    sizes: ["S", "M", "L"],
    requiresDevice: "Phantom Core Gen-2",
    theme: "dark",
    purchasable: true,
  },
};

export function getProduct(slug: string): Product | null {
  return PRODUCTS[slug] ?? null;
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export type VestSize = {
  size: string;
  /** Elastic band circumference, unstretched. */
  bandCm: string;
  bandIn: string;
  /** Band laid flat (half the circumference). */
  flat: string;
  /** Chest the band comfortably stretches to fit. */
  chest: string;
  height: string;
  weight: string;
};

/**
 * Band measurements are exact; chest/height/weight are approximate fit
 * ranges (band stretch + athlete feedback). Chest matters more than height.
 */
export const VEST_SIZE_CHART: VestSize[] = [
  { size: "S", bandCm: "76 cm", bandIn: "30 in", flat: "38 cm", chest: "34–37 in", height: "≤ 5'8\"", weight: "≤ 155 lb" },
  { size: "M", bandCm: "80 cm", bandIn: "31.5 in", flat: "40 cm", chest: "36–40 in", height: "5'9\"–6'1\"", weight: "155–175 lb" },
  { size: "L", bandCm: "84 cm", bandIn: "33 in", flat: "42 cm", chest: "39–42 in", height: "6'2\"+", weight: "175 lb+" },
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;

