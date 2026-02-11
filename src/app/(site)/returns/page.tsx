import { Footer } from "@/components/Footer";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-[#050505]">
            RETURN POLICY<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-[#050505]/70 text-lg md:text-xl max-w-3xl font-medium">
            30-day return. Money-back guarantee.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-8 md:p-12 space-y-8">
            <Section title="Eligibility">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>Returns are accepted within <strong className="text-white">30 days</strong> of delivery.</li>
                <li>Items must be returned in original condition (normal wear from reasonable testing is okay).</li>
                <li>Include all accessories and packaging when possible.</li>
              </ul>
            </Section>

            <Section title="Refunds">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>Refunds are issued to the original payment method after inspection.</li>
                <li>Shipping fees may be non-refundable unless required by law or the return is due to our error.</li>
              </ul>
            </Section>

            <Section title="How to start a return">
              <div className="text-white/70 space-y-3">
                <p>
                  Go to <a className="text-primary underline" href="/support">Support</a> and open a ticket with your order email and order reference.
                </p>
                <p>We’ll reply with the return address and next steps.</p>
              </div>
            </Section>

            <Section title="Exchanges / damaged items">
              <p className="text-white/70">
                If your item arrives damaged or defective, contact <a className="text-primary underline" href="/support">Support</a> and we’ll make it right.
              </p>
            </Section>

            <div className="pt-2 text-xs text-white/40 font-mono uppercase tracking-wider">
              Last updated: {new Date().toLocaleDateString()}
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

