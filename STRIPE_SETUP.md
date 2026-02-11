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

