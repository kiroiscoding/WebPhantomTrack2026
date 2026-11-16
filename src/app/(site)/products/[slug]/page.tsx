import { notFound } from "next/navigation";
import { getCatalogProduct } from "@/lib/catalog";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
