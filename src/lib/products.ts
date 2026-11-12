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
  specs: { label: string; value: string }[];
  /** Image URLs (Shopify CDN). Empty = no photos yet. */
  images: string[];
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

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

/** Placeholder chest measurements until a measured chart is provided. */
export const VEST_SIZE_CHART: { size: string; chest: string }[] = [
  { size: "S", chest: "34–36 in" },
  { size: "M", chest: "37–39 in" },
  { size: "L", chest: "40–42 in" },
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;

