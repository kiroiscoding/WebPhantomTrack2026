import React from "react";
import Link from "next/link";
import Image from "next/image";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.77a4.85 4.85 0 01-1-.08z"/>
    </svg>
  );
}

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
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </div>
          
          <div>
             <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li>
                <a href="mailto:contact@phantom-track.com" className="hover:text-primary transition-colors" title="contact@phantom-track.com">Contact Us</a>
              </li>
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
            <a
              href="https://www.instagram.com/phantomtrackofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Phantom Track on Instagram"
              className="text-white/40 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.x.com/phantomtrackco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Phantom Track on X"
              className="text-white/40 hover:text-white transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@phantomtrackofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Phantom Track on TikTok"
              className="text-white/40 hover:text-white transition-colors"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

