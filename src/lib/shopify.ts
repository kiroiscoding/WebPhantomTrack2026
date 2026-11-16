import "server-only";

/**
 * Minimal Shopify Storefront API client (server-only).
 *
 * Reads `SHOPIFY_STORE_DOMAIN` (e.g. `your-store.myshopify.com`) and
 * `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (the Headless channel's *public* access
 * token). The token never ships to the browser: this module can only be
 * imported from server code.
 */

const DEFAULT_API_VERSION = "2026-07";

function normalizeDomain(raw: string): string {
  return raw.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function isShopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN?.trim() && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim());
}

function storefrontEndpoint(): string {
  const domain = normalizeDomain(process.env.SHOPIFY_STORE_DOMAIN || "");
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || DEFAULT_API_VERSION;
  return `https://${domain}/api/${version}/graphql.json`;
}

/** Cache tag for all Shopify catalog reads (use with `revalidateTag`). */
export const SHOPIFY_PRODUCTS_TAG = "shopify-products";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function shopifyFetch<T>(params: {
  query: string;
  variables?: Record<string, unknown>;
  /** Seconds to cache the response. Pass `0` for uncached (cart/checkout) calls. */
  revalidate?: number;
  tags?: string[];
}): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error("Shopify is not configured: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  const { query, variables, revalidate = 60, tags } = params;

  const res = await fetch(storefrontEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!.trim(),
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === 0 ? { cache: "no-store" as const } : { next: { revalidate, tags } }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Shopify Storefront API ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`Shopify Storefront API error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) throw new Error("Shopify Storefront API returned no data");
  return json.data;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export type ShopifyMoney = { amount: string; currencyCode: string };

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: ShopifyMoney };
  options: { name: string; optionValues: { name: string }[] }[];
  images: { nodes: { url: string; altText: string | null; width: number | null; height: number | null }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: ShopifyMoney;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query StorefrontProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT) {
      nodes {
        id
        handle
        title
        description
        productType
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          name
          optionValues {
            name
          }
        }
        images(first: 20) {
          nodes {
            url
            altText
            width
            height
          }
        }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

/** All products published to the Headless sales channel. */
export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first: 100 },
    tags: [SHOPIFY_PRODUCTS_TAG],
  });
  return data.products.nodes;
}

export function moneyToCents(money: ShopifyMoney): number {
  return Math.round(Number.parseFloat(money.amount) * 100);
}

// ---------------------------------------------------------------------------
// Cart → Checkout
// ---------------------------------------------------------------------------

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
      warnings {
        code
        message
      }
    }
  }
`;

export type CartLineInput = { merchandiseId: string; quantity: number };

/**
 * Create a Shopify cart and return its hosted checkout URL. Shopify prices the
 * lines itself, so the browser can't tamper with amounts.
 */
export async function createShopifyCheckout(params: {
  lines: CartLineInput[];
  /** Pre-fills the checkout email when the shopper is signed in. */
  email?: string;
}): Promise<string> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[] | null; message: string }[];
      warnings: { code: string; message: string }[];
    };
  }>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: params.lines,
        ...(params.email ? { buyerIdentity: { email: params.email } } : {}),
      },
    },
    revalidate: 0,
  });

  const { cart, userErrors, warnings } = data.cartCreate;
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  // Shopify silently drops/reduces lines that are out of stock — surface that
  // instead of sending the shopper to a checkout that doesn't match their cart.
  const stockWarnings = warnings.filter((w) => w.code.startsWith("MERCHANDISE_"));
  if (stockWarnings.length) throw new Error(stockWarnings.map((w) => w.message).join("; "));
  if (!cart?.checkoutUrl) {
    throw new Error(warnings.map((w) => w.message).join("; ") || "Shopify did not return a checkout URL");
  }
  return cart.checkoutUrl;
}
