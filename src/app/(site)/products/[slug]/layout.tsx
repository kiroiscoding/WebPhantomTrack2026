import type { Metadata } from "next";
import { getProduct, formatUsdFromCents } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phantom-track.com";

type LayoutParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<LayoutParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "This product is not available.",
    };
  }

  const url = `${SITE_URL}/products/${product.slug}`;
  const priceLabel = product.purchasable ? formatUsdFromCents(product.priceCents) : "Coming soon";

  return {
    title: product.name,
    description: `${product.subtitle} — ${product.description}`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} — Phantom Track`,
      description: `${product.subtitle} — ${priceLabel}`,
      siteName: "Phantom Track",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Phantom Track`,
      description: `${product.subtitle} — ${priceLabel}`,
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: `${product.description} Worn by the athlete in a fitted chest-strap vest, this is a self-tracking sports performance wearable — not a covert tracking device.`,
        sku: product.slug,
        brand: {
          "@type": "Brand",
          name: "Phantom Track",
        },
        category: "Sports & Fitness > Wearable Performance Trackers",
        additionalType: "https://schema.org/WearableMeasurementDevice",
        audience: {
          "@type": "PeopleAudience",
          audienceType: "Athletes (soccer, lacrosse, rugby, American football, and other field sports)",
          suggestedMinAge: 13,
        },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/products/${product.slug}`,
          priceCurrency: "USD",
          price: (product.priceCents / 100).toFixed(2),
          availability: product.purchasable
            ? "https://schema.org/InStock"
            : "https://schema.org/PreOrder",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Phantom Track",
          },
        },
        ...(product.reviews > 0 && product.rating > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating.toFixed(1),
                reviewCount: product.reviews,
                bestRating: "5",
                worstRating: "1",
              },
            }
          : {}),
      }
    : null;

  const breadcrumbSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Armory", item: `${SITE_URL}/products` },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `${SITE_URL}/products/${product.slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
