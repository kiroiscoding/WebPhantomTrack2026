export type ProductTheme = "dark" | "light";

/** A purchasable Shopify variant (e.g. Vest / size M). */
export type ProductVariant = {
  /** Shopify ProductVariant GID — what the Shopify cart/checkout needs. */
  id: string;
  title: string;
  /** Value of the variant's "Size" option, if it has one. */
  size?: string;
  priceCents: number;
  availableForSale: boolean;
};

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
  /** Image URLs (Shopify CDN). Empty = no photos yet. */
  images: string[];
  /** Product shot for the shop card, checkout and cross-sell. Defaults to `images[0]`. */
  primaryImage?: string;
  /** Size options shown on the PDP. Empty = no size picker. */
  sizes: string[];
  /** Short labels for gallery thumbs (same order as `images`). */
  imageLabels?: string[];
  /** If set, PDP clarifies this accessory needs the named device. */
  requiresDevice?: string;
  theme: ProductTheme;
  purchasable: boolean;
  /** Shopify variants (one per size, or a single default variant). */
  variants: ProductVariant[];
};

/** Find the Shopify variant for a chosen size (or the only/first variant when there's no size picker). */
export function findVariant(product: Product, size?: string): ProductVariant | undefined {
  if (size) {
    const match = product.variants.find((v) => v.size?.toLowerCase() === size.toLowerCase());
    if (match) return match;
  }
  return product.variants.find((v) => v.availableForSale) ?? product.variants[0];
}

export function getPrimaryImage(product: Product): string | undefined {
  return product.primaryImage ?? product.images[0];
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export type VestSize = {
  size: string;
  /** Elastic band circumference, unstretched. */
  bandCm: string;
  bandIn: string;
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
  { size: "S", bandCm: "76 cm", bandIn: "30 in", chest: "34–37 in", height: "≤ 5'8\"", weight: "≤ 155 lb" },
  { size: "M", bandCm: "80 cm", bandIn: "31.5 in", chest: "36–40 in", height: "5'9\"–6'1\"", weight: "155–175 lb" },
  { size: "L", bandCm: "84 cm", bandIn: "33 in", chest: "39–42 in", height: "6'2\"+", weight: "175 lb+" },
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;

