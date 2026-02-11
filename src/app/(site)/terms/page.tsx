import { Footer } from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-[#050505]">
            TERMS OF SERVICE<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-[#050505]/70 text-lg md:text-xl max-w-3xl font-medium">
            These terms govern use of Phantom Track’s website, app, and purchases.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-8 md:p-12 space-y-8">
            <Section title="1. Acceptance">
              <p className="text-white/70">
                By accessing or using Phantom Track, you agree to these Terms. If you do not agree, do not use the service.
              </p>
            </Section>

            <Section title="2. Accounts">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>You are responsible for maintaining access to your account and for activity under your account.</li>
                <li>You must provide accurate information and keep it up to date.</li>
              </ul>
            </Section>

            <Section title="3. Purchases">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>Prices and availability may change.</li>
                <li>Payments are processed by our payment provider.</li>
                <li>Shipping timelines are estimates and may vary.</li>
              </ul>
            </Section>

            <Section title="4. App and device data">
              <p className="text-white/70">
                Some features require collecting and processing device/app data and metrics. See our{" "}
                <a className="text-primary underline" href="/privacy">Privacy Policy</a> for details.
              </p>
            </Section>

            <Section title="5. Prohibited use">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>Do not misuse the service, attempt unauthorized access, or interfere with security.</li>
                <li>Do not violate applicable laws or third-party rights.</li>
              </ul>
            </Section>

            <Section title="6. Disclaimers">
              <p className="text-white/70">
                The service is provided “as is” and “as available.” To the maximum extent permitted by law, we disclaim all warranties.
              </p>
            </Section>

            <Section title="7. Limitation of liability">
              <p className="text-white/70">
                To the maximum extent permitted by law, Phantom Track will not be liable for indirect, incidental, or consequential damages.
              </p>
            </Section>

            <Section title="8. Changes">
              <p className="text-white/70">
                We may update these Terms. Continued use after changes means you accept the updated Terms.
              </p>
            </Section>

            <Section title="Contact">
              <p className="text-white/70">
                Questions? Contact us via the <a className="text-primary underline" href="/support">Support</a> page.
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

