import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

const DESCRIPTION =
  "How to delete your Phantom Track account and data, in the app or by email, and what is deleted or kept.";

export const metadata: Metadata = {
  title: "Delete Your Account",
  description: DESCRIPTION,
  alternates: { canonical: "/delete-account" },
  openGraph: {
    type: "website",
    url: "/delete-account",
    title: "Delete Your Account | Phantom Track",
    description: DESCRIPTION,
    images: [{ url: "/Device_Web.png", width: 1200, height: 630, alt: "Phantom Track performance hardware" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete Your Account | Phantom Track",
    description: DESCRIPTION,
    images: ["/Device_Web.png"],
  },
};

const MAIL_SUBJECT = encodeURIComponent("Delete my Phantom Track account");
const MAIL_BODY = encodeURIComponent(
  "Please delete my Phantom Track account and its data.\n\nAccount email: \n",
);

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter text-white">
            DELETE YOUR ACCOUNT<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-white/70 text-lg md:text-xl max-w-3xl font-medium">
            You can delete your Phantom Track account and the data linked to it at any time, from the app or by email.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#050505] text-white border border-white/10 shadow-2xl p-8 md:p-12 space-y-8">
            <Section title="In the app (fastest)">
              <ol className="list-decimal pl-5 space-y-2 text-white/70">
                <li>Open the Phantom Track app on your iPhone or Android phone and sign in.</li>
                <li>Tap your profile photo at the top right to open <strong className="text-white">Settings</strong>.</li>
                <li>Tap <strong className="text-white">Delete Account</strong>.</li>
                <li>Type <strong className="text-white">DELETE</strong> and confirm.</li>
              </ol>
              <p className="mt-3 text-white/70">
                Your account is deleted straight away and you are signed out.
              </p>
            </Section>

            {/* TODO-LEGAL-REVIEW: confirm the 30-day completion window for emailed requests. */}
            <Section title="Without the app">
              <p className="text-white/70">
                If you can&rsquo;t sign in to the app, email{" "}
                <a
                  className="text-primary underline"
                  href={`mailto:contact@phantom-track.com?subject=${MAIL_SUBJECT}&body=${MAIL_BODY}`}
                >
                  contact@phantom-track.com
                </a>{" "}
                from the email address on your account, with the subject &ldquo;Delete my Phantom Track account&rdquo;.
                We may ask you to confirm the request from that address before we delete anything. We complete
                emailed requests within 30 days and reply when it&rsquo;s done.
              </p>
            </Section>

            <Section title="What is deleted">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li><strong className="text-white">Account</strong>: your email address, password and sign-in links (Google or Apple).</li>
                <li><strong className="text-white">Profile</strong>: name, date of birth, team, position, unit setting and profile photo.</li>
                <li><strong className="text-white">Sessions</strong>: every synced match, including GPS tracks, heatmaps, sprints and stats.</li>
                <li><strong className="text-white">Friends</strong>: your friend list, friend requests and invite links.</li>
                <li><strong className="text-white">Notifications</strong>: the push notification tokens for your phones.</li>
              </ul>
            </Section>

            {/* TODO-LEGAL-REVIEW: set how long deletion records and unlinked orders are kept. */}
            <Section title="What is kept">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  A deletion record (your account ID, email address and the date) so we can show the request was
                  carried out and prevent abuse.
                </li>
                <li>
                  Shop orders from phantom-track.com: the order, payment and shipping details are kept for tax,
                  refund and warranty records, but are no longer linked to an account.
                </li>
                <li>
                  Payment and shipping records held by our payment processor (Stripe) and shipping provider, which
                  they keep as the law requires. We can&rsquo;t delete those for you.
                </li>
                <li>
                  Data on your phone or tracker that was never synced. Uninstalling the app removes what it stored on
                  your phone.
                </li>
              </ul>
            </Section>

            <Section title="Questions">
              <p className="text-white/70">
                See our <a className="text-primary underline" href="/privacy">Privacy Policy</a> or email{" "}
                <a className="text-primary underline" href="mailto:contact@phantom-track.com">contact@phantom-track.com</a>.
              </p>
            </Section>

            <div className="pt-2 text-xs text-white/40 font-mono uppercase tracking-wider">
              Last updated: November 15, 2026
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
