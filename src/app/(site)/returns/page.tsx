import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Returns & 30-Day Money-Back Guarantee",
  description:
    "Phantom Track offers a 30-day return policy with a full money-back guarantee. See how to start a return, what qualifies, and how refunds are processed.",
  alternates: { canonical: "/returns" },
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-white">
            RETURNS<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-white/70 text-lg md:text-xl max-w-3xl font-medium">
            30-day returns. Full refund to your original payment method when eligibility is met.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-8 md:p-12 space-y-8">
            <Section title="Eligibility">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  Returns are accepted within <strong className="text-white">30 days</strong> of
                  delivery for most new hardware purchases.
                </li>
                <li>
                  Items should be returned in original condition. Light use from reasonable testing
                  is acceptable; excessive wear, damage, or missing components may affect eligibility.
                </li>
                <li>Include the device, vest (if purchased), accessories, and packaging when possible.</li>
                <li>
                  Final-sale or specially marked items (if any) will be noted at checkout and are not
                  eligible for return unless defective.
                </li>
              </ul>
            </Section>

            <Section title="How to start a return">
              <ol className="list-decimal pl-5 space-y-2 text-white/70">
                <li>
                  Email{" "}
                  <a className="text-primary underline" href="mailto:contact@phantom-track.com">
                    contact@phantom-track.com
                  </a>{" "}
                  or open a request via{" "}
                  <Link className="text-primary underline" href="/support">
                    Support
                  </Link>{" "}
                  with your order email and order reference.
                </li>
                <li>We’ll confirm eligibility and send return instructions and the return address.</li>
                <li>Ship the package using a trackable method and keep your receipt until the refund clears.</li>
              </ol>
            </Section>

            <Section title="Refunds">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  Once we receive and inspect your return (typically within{" "}
                  <strong className="text-white">3–5 business days</strong> of arrival), refunds are
                  issued to the original payment method.
                </li>
                <li>
                  Card refunds usually appear within <strong className="text-white">5–10 business days</strong>,
                  depending on your bank.
                </li>
                <li>
                  Original outbound shipping charges are non-refundable unless the return is due to our
                  error or a defective product, or as otherwise required by law.
                </li>
              </ul>
            </Section>

            <Section title="Exchanges &amp; defective items">
              <p className="text-white/70">
                If your order arrives damaged or defective, contact Support with photos and your order
                details. We’ll arrange a replacement or refund — you shouldn’t pay to fix our mistake.
              </p>
            </Section>

            <Section title="Warranty">
              <p className="text-white/70">
                Hardware is covered by a <strong className="text-white">1-year limited warranty</strong>{" "}
                against manufacturing defects under normal use. Warranty service is separate from the
                30-day return window — reach out via Support and we’ll walk you through next steps.
              </p>
            </Section>

            <Section title="Shipping for returns">
              <p className="text-white/70">
                For details on outbound delivery, free-shipping thresholds, and tracking, see our{" "}
                <Link className="text-primary underline" href="/shipping">
                  Shipping Policy
                </Link>
                . Return shipping costs are the customer’s responsibility unless the item is defective
                or we shipped the wrong product.
              </p>
            </Section>

            <Section title="Questions">
              <p className="text-white/70">
                Contact{" "}
                <a className="text-primary underline" href="mailto:contact@phantom-track.com">
                  contact@phantom-track.com
                </a>
                .
              </p>
            </Section>
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
