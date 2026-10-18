import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatUsdFromCents } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Phantom Track shipping details for the US and Canada — processing times, delivery estimates, free shipping threshold, and order tracking.",
  alternates: { canonical: "/shipping" },
  openGraph: {
    type: "website",
    url: "/shipping",
    title: "Shipping Policy | Phantom Track",
    description: "Phantom Track shipping details for the US and Canada — processing times, delivery estimates, free shipping threshold, and order tracking.",
    images: [{ url: "/Device_Web.png", width: 1200, height: 630, alt: "Phantom Track performance hardware" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | Phantom Track",
    description: "Phantom Track shipping details for the US and Canada — processing times, delivery estimates, free shipping threshold, and order tracking.",
    images: ["/Device_Web.png"],
  },
};

const FREE_SHIP = formatUsdFromCents(FREE_SHIPPING_THRESHOLD_CENTS);

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-white">
            SHIPPING<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-white/70 text-lg md:text-xl max-w-3xl font-medium">
            How we pack, ship, and deliver Phantom Track hardware across the United States and
            Canada.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-8 md:p-12 space-y-8">
            <Section title="Where we ship">
              <p className="text-white/70">
                We currently ship to addresses in the <strong className="text-white">United States</strong> and{" "}
                <strong className="text-white">Canada</strong>. If your order requires delivery outside
                these regions, contact{" "}
                <a className="text-primary underline" href="mailto:contact@phantom-track.com">
                  contact@phantom-track.com
                </a>{" "}
                before purchasing and we’ll advise on availability.
              </p>
            </Section>

            <Section title="Processing time">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  Orders are typically processed within <strong className="text-white">1–2 business days</strong>{" "}
                  after payment confirmation.
                </li>
                <li>Orders placed on weekends or U.S. holidays begin processing the next business day.</li>
                <li>
                  You’ll receive an order confirmation email immediately, and a separate shipping
                  notification with tracking once your package is handed to the carrier.
                </li>
              </ul>
            </Section>

            <Section title="Delivery estimates">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  <strong className="text-white">Standard shipping</strong>: usually{" "}
                  <strong className="text-white">3–7 business days</strong> after your order ships,
                  depending on destination and carrier performance.
                </li>
                <li>
                  Delivery windows are estimates, not guarantees. Weather, carrier volume, and remote
                  addresses can extend transit time.
                </li>
              </ul>
            </Section>

            <Section title="Shipping rates">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  <strong className="text-white">Free standard shipping</strong> on qualifying orders of{" "}
                  <strong className="text-white">{FREE_SHIP}</strong> or more (before tax).
                </li>
                <li>
                  Orders below {FREE_SHIP} are charged standard shipping at checkout based on your
                  destination.
                </li>
                <li>Applicable sales tax is calculated at checkout where required.</li>
              </ul>
            </Section>

            <Section title="Order tracking">
              <div className="text-white/70 space-y-3">
                <p>
                  When your order ships, we email tracking details to the address used at checkout.
                  If you’re signed in, you can also review order status from your{" "}
                  <Link className="text-primary underline" href="/account">
                    Account
                  </Link>
                  .
                </p>
                <p>
                  Tracking can take up to 24 hours to update after the label is created. If you
                  haven’t received tracking within 3 business days of purchase, contact Support.
                </p>
              </div>
            </Section>

            <Section title="Customs, duties &amp; Canada">
              <p className="text-white/70">
                For Canadian deliveries, any duties, taxes, or brokerage fees assessed by customs are
                the recipient’s responsibility unless otherwise stated at checkout. Delivery may be
                delayed while packages clear customs.
              </p>
            </Section>

            <Section title="Lost, delayed, or damaged packages">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  If tracking shows no movement for an extended period, or your package arrives
                  damaged, contact{" "}
                  <Link className="text-primary underline" href="/support">
                    Support
                  </Link>{" "}
                  with your order email and order reference.
                </li>
                <li>
                  We’ll work with the carrier to locate the shipment or arrange a replacement /
                  refund when appropriate.
                </li>
              </ul>
            </Section>

            <Section title="Returns">
              <p className="text-white/70">
                Changed your mind? See our{" "}
                <Link className="text-primary underline" href="/returns">
                  Return Policy
                </Link>{" "}
                for the 30-day return window and refund process. Return shipping is covered in our
                returns documentation.
              </p>
            </Section>

            <Section title="Questions">
              <p className="text-white/70">
                Email{" "}
                <a className="text-primary underline" href="mailto:contact@phantom-track.com">
                  contact@phantom-track.com
                </a>{" "}
                or visit{" "}
                <Link className="text-primary underline" href="/support">
                  Support
                </Link>
                .
              </p>
            </Section>

            <div className="pt-2 text-xs text-white/40 font-mono uppercase tracking-wider">
              Last updated: September 1, 2026
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-primary font-mono uppercase tracking-wider text-sm">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
