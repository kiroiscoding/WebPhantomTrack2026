import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
    </>
  );
}

