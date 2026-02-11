import { Footer } from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#b5b5b5] pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-[#050505]">
            PRIVACY POLICY<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-[#050505]/70 text-lg md:text-xl max-w-3xl font-medium">
            This policy explains how Phantom Track collects, uses, and protects your information in our website and app.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-8 md:p-12 space-y-8">
            <Section title="Summary (high level)">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>We collect the minimum data needed to run the product (account, orders, and app telemetry you choose to sync).</li>
                <li>We don’t sell your personal data.</li>
                <li>We use trusted vendors (e.g., payments, email) only to provide the service.</li>
                <li>You can request deletion of your account data.</li>
              </ul>
            </Section>

            <Section title="Information we collect">
              <div className="text-white/70 space-y-3">
                <p><strong className="text-white">Account</strong>: email address and authentication identifiers.</p>
                <p><strong className="text-white">Orders</strong>: purchase details, shipping address, and fulfillment/tracking information.</p>
                <p><strong className="text-white">App data (if you use the app)</strong>: device/app diagnostics and performance metrics needed to deliver features. Exact data depends on what you enable.</p>
                <p><strong className="text-white">Support</strong>: messages you send to us and any attachments you provide.</p>
              </div>
            </Section>

            <Section title="How we use information">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>Provide and improve the website/app.</li>
                <li>Process payments, deliver products, and send order/shipping updates.</li>
                <li>Prevent fraud and secure accounts.</li>
                <li>Respond to support requests.</li>
              </ul>
            </Section>

            <Section title="Sharing">
              <div className="text-white/70 space-y-3">
                <p>We share data only with service providers needed to operate Phantom Track (for example: payment processing, email delivery, shipping label providers, and hosting).</p>
                <p>We may disclose information if required by law or to protect rights and safety.</p>
              </div>
            </Section>

            <Section title="Retention">
              <p className="text-white/70">
                We retain data as long as needed to provide the service and meet legal/accounting obligations (for example, order records).
              </p>
            </Section>

            <Section title="Your choices">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>Access/update your account information.</li>
                <li>Request deletion of your account (subject to required record retention).</li>
                <li>Opt out of non-essential communications.</li>
              </ul>
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

