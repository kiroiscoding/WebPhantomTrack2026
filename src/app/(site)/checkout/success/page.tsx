import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";
import { SyncOrderOnSuccess } from "@/components/SyncOrderOnSuccess";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
      <ClearCartOnSuccess />
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10 md:p-14">
          <div className="flex items-center gap-3 text-primary font-mono uppercase tracking-wider text-sm mb-4">
            <CheckCircle2 className="h-5 w-5" />
            Payment complete
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9]">
            YOU’RE IN<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg md:text-xl max-w-2xl">
            Your order is confirmed. You’ll receive a receipt and shipping updates via email.
          </p>
          <Suspense fallback={null}>
            <SyncOrderOnSuccess />
          </Suspense>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors"
            >
              BACK HOME
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/20 text-white px-8 py-4 font-bold tracking-widest hover:bg-white/10 transition-colors"
            >
              BROWSE MORE <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

