# Stripe setup (local + production)

## Required environment variables

Create a `.env.local` in the project root with:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Optional (recommended if you want webhooks):

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

Optional (enable automatic sales tax via Stripe Tax):

```bash
# Only set this to "true" after configuring Stripe Tax in the Dashboard
# (origin address + default product tax code). If enabled without that setup,
# Checkout session creation will fail.
STRIPE_AUTOMATIC_TAX=true
```

## Notes on this integration

- **API version is pinned** in `src/lib/stripe.ts` (`STRIPE_API_VERSION`) so Stripe-side default changes can't silently alter behavior. Bump it intentionally when you upgrade the `stripe` package.
- **Restricted API key (recommended):** prefer a restricted key (`rk_...`) with least-privilege scopes over a full secret key (`sk_...`) for `STRIPE_SECRET_KEY`. Create one on the [API keys page](https://dashboard.stripe.com/apikeys).
- **Dynamic payment methods:** we intentionally do not pass `payment_method_types`, so Stripe shows the best-converting methods (cards, wallets, Link). Manage which methods appear from the Dashboard.
- **Webhook is the source of truth** for recording orders + sending confirmation emails. The success-page sync is a best-effort fast path only.

## Stripe test card

- Card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC
- Any ZIP

## Webhooks (optional)

If you want Stripe to notify your app when checkout completes:

1. Create a webhook endpoint in Stripe Dashboard for:
   - `checkout.session.completed`
2. Point it to:
   - `http://localhost:3000/api/webhook` (local)
   - `https://YOUR_DOMAIN/api/webhook` (prod)
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

