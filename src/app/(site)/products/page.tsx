import { getCatalogList } from "@/lib/catalog";
import ProductsClient from "./ProductsClient";

// Re-fetch products, prices and stock from Shopify at most once a minute.
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getCatalogList();
  return <ProductsClient products={products} />;
}
