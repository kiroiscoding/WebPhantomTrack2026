import "server-only";

import { cache } from "react";
import type { Product, ProductVariant } from "@/lib/products";
import { getShopifyProducts, isShopifyConfigured, moneyToCents, type ShopifyProduct } from "@/lib/shopify";

/**
 * The storefront catalog — exactly what's published to the Shopify Headless
 * sales channel. Products are keyed (and routed) by their Shopify handle:
 * `/products/<handle>`.
 */

const SIZE_OPTION = /^size$/i;

function toVariants(sp: ShopifyProduct): ProductVariant[] {
  return sp.variants.nodes.map((v) => ({
    id: v.id,
    title: v.title,
    size: v.selectedOptions.find((o) => SIZE_OPTION.test(o.name))?.value,
    priceCents: moneyToCents(v.price),
    availableForSale: v.availableForSale,
  }));
}

function toProduct(sp: ShopifyProduct): Product {
  const sizeOption = sp.options.find((o) => SIZE_OPTION.test(o.name));
  return {
    slug: sp.handle,
    name: sp.title,
    // Shopify "Product type" (e.g. "Performance Vest") shows as the small label above the name.
    subtitle: sp.productType,
    description: sp.description,
    priceCents: moneyToCents(sp.priceRange.minVariantPrice),
    images: sp.images.nodes.map((img) => img.url),
    imageLabels: sp.images.nodes.map((img) => img.altText ?? ""),
    sizes: sizeOption ? sizeOption.optionValues.map((v) => v.name) : [],
    purchasable: sp.availableForSale,
    variants: toVariants(sp),
    rating: 0,
    reviews: 0,
    features: [],
    specs: [],
    theme: "dark",
  };
}

/** All products, in Shopify order (oldest first). */
export const getCatalogList = cache(async (): Promise<Product[]> => {
  if (!isShopifyConfigured()) {
    console.warn("[catalog] Shopify not configured (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN) — no products.");
    return [];
  }
  return (await getShopifyProducts()).map(toProduct);
});

export async function getCatalogProduct(slug: string): Promise<Product | null> {
  return (await getCatalogList()).find((p) => p.slug === slug) ?? null;
}
