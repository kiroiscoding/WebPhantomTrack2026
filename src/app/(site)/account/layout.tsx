import type { Metadata } from "next";

// Private, per-user pages — keep out of the search index. Covers /account and
// all nested routes (e.g. /account/orders/[id]).
export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
