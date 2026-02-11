import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32 px-6 lg:px-8">
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-10 md:p-14">
          <div className="text-white/50 font-mono uppercase tracking-wider text-sm mb-4">
            Checkout canceled
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9]">
            NO STRESS<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg md:text-xl max-w-2xl">
            Your cart is still here when you’re ready.
          </p>

          <div className="mt-10">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              BACK TO PRODUCTS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

