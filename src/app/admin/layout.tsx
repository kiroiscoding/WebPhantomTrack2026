import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

// Internal dashboard — never index, and already blocked in robots.ts.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <AdminTopbar />
          <main className="px-6 lg:px-10 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

