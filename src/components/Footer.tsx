import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="block mb-4" aria-label="Phantom Track home">
              <Image
                src="/logo_light.png"
                alt="Phantom Track"
                width={320}
                height={36}
                unoptimized
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              The invisible edge for athletes who demand perfection.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products/tracker-combo" className="hover:text-primary transition-colors">Tracker Combo</Link></li>
              <li><Link href="/products/phantom-vest" className="hover:text-primary transition-colors">Phantom Vest</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All products</Link></li>
            </ul>
          </div>
          
          <div>
             <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Warranty</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Return Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Phantom Track. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <div className="w-5 h-5 bg-white/10 rounded-full" />
            <div className="w-5 h-5 bg-white/10 rounded-full" />
            <div className="w-5 h-5 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}

