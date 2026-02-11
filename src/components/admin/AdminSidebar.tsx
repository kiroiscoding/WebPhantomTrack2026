"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, LayoutDashboard, PackageSearch, Settings, Truck } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: PackageSearch },
  { href: "/admin/fulfillment", label: "Fulfillment", icon: Truck },
  { href: "/admin/customers", label: "Customers", icon: Boxes },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname() || "";

  return (
    <aside className="hidden lg:flex lg:flex-col w-[280px] shrink-0 border-r border-white/10 bg-[#050505]">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="block">
          <div className="text-white font-bold tracking-widest uppercase">Phantom Track</div>
          <div className="mt-1 text-xs font-mono uppercase tracking-wider text-white/40">
            Admin Console
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors",
                active
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent",
              ].join(" ")}
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-white/10">
        <div className="text-xs text-white/40 font-mono uppercase tracking-wider">Environment</div>
        <div className="mt-2 text-sm text-white/70 break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL ? "Supabase: configured" : "Supabase: missing env"}</div>
      </div>
    </aside>
  );
}

