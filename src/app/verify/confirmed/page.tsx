import type { Metadata } from "next";
import { VerifyConfirmedClient } from "./VerifyConfirmedClient";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Email confirmed | Phantom Track",
  description: "Your Phantom Track email has been confirmed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerifyConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return <VerifyConfirmedClient searchParams={resolvedSearchParams} />;
}
