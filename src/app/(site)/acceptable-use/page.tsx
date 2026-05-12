import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Phantom Track is a sports performance wearable that athletes wear on themselves. Tracking another person without their explicit consent is strictly prohibited.",
  alternates: { canonical: "/acceptable-use" },
};

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 text-white">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[9vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter">
            ACCEPTABLE USE<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
            Phantom Track is a consumer sports performance wearable. Athletes
            wear the Phantom Core sensor on themselves — secured in our chest-
            strap vest between the shoulder blades — to record their own
            training data. This page explains what Phantom Track is for and
            what it is explicitly <span className="text-primary">not</span>{" "}
            for.
          </p>

          <div className="mt-10 rounded-[40px] bg-[#0a0a0a] border border-white/10 shadow-2xl p-8 md:p-12 space-y-10">
            <Section title="What Phantom Track is">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  A wearable GNSS sensor and companion app for athletes to
                  measure their own physical performance — sprint speed,
                  distance covered, accelerations, heart-rate zones, and
                  similar training metrics.
                </li>
                <li>
                  Designed for soccer, lacrosse, rugby, American football,
                  and other field sports, used during practices and matches.
                </li>
                <li>
                  Sold as a piece of athletic equipment, like a smartwatch
                  or chest-strap heart-rate monitor. It is worn visibly in
                  a fitted vest and pairs with an app the wearer signs into
                  with their own account.
                </li>
              </ul>
            </Section>

            <Section title="Prohibited uses">
              <p className="text-white/70 mb-4">
                You may not use Phantom Track to:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-white/70">
                <li>
                  <strong className="text-white">
                    Track or surveil another person without their explicit,
                    informed consent.
                  </strong>{" "}
                  Hiding the device on a person, in their belongings, or in
                  their vehicle is strictly prohibited and may violate
                  federal, state, and local laws (including but not limited
                  to stalking, harassment, and electronic surveillance
                  statutes).
                </li>
                <li>
                  Track a minor without the consent of a parent or legal
                  guardian.
                </li>
                <li>
                  Place the device on any person, animal, vehicle, or
                  property that you do not own or have explicit permission
                  to track.
                </li>
                <li>
                  Use the device or app to facilitate domestic abuse,
                  stalking, harassment, kidnapping, theft, or any other
                  unlawful activity.
                </li>
                <li>
                  Resell, distribute, or market Phantom Track in any way
                  that implies it can be used for covert tracking, location
                  surveillance, or hidden monitoring.
                </li>
              </ul>
            </Section>

            <Section title="By design, not for covert use">
              <ul className="list-disc pl-5 space-y-2 text-white/70">
                <li>
                  Phantom Track hardware is visible: it is worn in a fitted
                  chest-strap vest sized for the athlete. It is not
                  miniaturized for concealment and is not magnetized for
                  attachment to vehicles or property.
                </li>
                <li>
                  Data is delivered to the wearer&apos;s own authenticated
                  account in our app. There is no way to silently view
                  another person&apos;s location data without them sharing
                  it with you.
                </li>
                <li>
                  The companion app makes it clear when data is being
                  recorded.
                </li>
              </ul>
            </Section>

            <Section title="Enforcement">
              <p className="text-white/70">
                We reserve the right to terminate any account, refuse
                service, and where appropriate cooperate with law
                enforcement if we have a reasonable basis to believe a user
                has violated this Acceptable Use Policy. If you suspect
                Phantom Track is being misused, please contact us
                immediately at{" "}
                <a className="text-primary underline" href="mailto:security@phantom-track.com">
                  security@phantom-track.com
                </a>
                .
              </p>
            </Section>

            <Section title="If you believe you are being tracked">
              <p className="text-white/70">
                If you believe someone is using a Phantom Track device to
                track you without your consent, contact us immediately at{" "}
                <a className="text-primary underline" href="mailto:security@phantom-track.com">
                  security@phantom-track.com
                </a>{" "}
                with any details you can share. In the United States, you
                can also call the National Domestic Violence Hotline at{" "}
                <strong className="text-white">1-800-799-7233</strong> or
                contact local law enforcement.
              </p>
            </Section>

            <Section title="Related policies">
              <p className="text-white/70">
                See also our{" "}
                <Link className="text-primary underline" href="/privacy">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link className="text-primary underline" href="/terms">
                  Terms of Service
                </Link>
                .
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
