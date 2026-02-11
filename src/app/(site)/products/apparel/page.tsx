import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function ApparelComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      <section className="px-6 lg:px-8 mb-20">
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-black/60 hover:text-black mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Armory
          </Link>

          <h1 className="text-[10vw] lg:text-[7vw] leading-[0.8] font-bold tracking-tighter text-[#050505]">
            APPAREL<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-[#050505]/70 max-w-2xl font-medium">
            Coming soon.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10 md:p-14">
            <div className="flex items-center gap-3 text-primary font-mono uppercase tracking-wider text-sm mb-4">
              <Clock className="h-5 w-5" />
              Coming soon
            </div>
            <div className="text-white/70 text-lg leading-relaxed">
              Phantom Track apparel is in the works. Check back soon for launch details.
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products/tracker-combo"
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors"
              >
                SHOP TRACKER COMBO
              </Link>
              <Link
                href="/products/phantom-vest"
                className="inline-flex items-center justify-center rounded-full border border-white/20 text-white px-8 py-4 font-bold tracking-widest hover:bg-white/10 transition-colors"
              >
                SHOP PHANTOM VEST
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

