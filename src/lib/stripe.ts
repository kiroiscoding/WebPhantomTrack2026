import Stripe from "stripe";

// Pin to the API version the installed SDK targets so a Stripe-side default
// change can never silently alter this integration's behavior. Bump this
// intentionally when upgrading the `stripe` package.
export const STRIPE_API_VERSION = "2025-12-15.clover" as const;

// Stripe Tax is opt-in: it only works once an origin address and default tax
// code are configured in the Stripe Dashboard, so gate it behind an env flag to
// avoid breaking checkout before that setup is done.
export const STRIPE_AUTOMATIC_TAX_ENABLED = process.env.STRIPE_AUTOMATIC_TAX === "true";

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: STRIPE_API_VERSION,
  });
}
