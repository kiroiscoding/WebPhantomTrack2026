# Supabase setup (Auth + Stripe customer ID)

## 1) Create a Supabase project

- Supabase Dashboard → New project

## 2) Add env vars to `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Server-only (used to write stripe_customer_id + orders). Keep secret.
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Restart `npm run dev` after changing env vars.

## 3) Enable Google login

Supabase Dashboard → Authentication → Providers → Google → Enable.

You will need to paste Google OAuth client credentials there, and set these URLs in Google:

- **Authorized redirect URI**: use the exact callback URL Supabase shows you (usually `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)
- **Site URL** (Supabase Auth settings): `http://localhost:3000` (dev) and your production domain later

Also in Supabase → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

## 4) Create `profiles` table for Stripe customer IDs

Supabase Dashboard → SQL Editor → run:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id);
```

Optional (recommended): auto-create profile rows when a user signs up:

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

## 5) Where auth lives in this repo

- `/account`: sign in with Google + email magic link
- `/auth/callback`: completes OAuth and writes Supabase session cookies
- `middleware.ts`: keeps session cookies refreshed

## 6) Create `orders` table (for Order History)

Supabase Dashboard → SQL Editor → run:

```sql
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_session_id text unique,
  stripe_customer_id text,
  amount_total_cents integer,
  currency text,
  status text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);
```

Notes:
- Orders are written server-side (webhook or success-page sync) using the Service Role key.
- Guest checkout (not signed in) won’t attach to a `user_id`, so it won’t show in order history.

## 7) Add shipping + tracking fields to `orders` (recommended)

Run this after Section 6:

```sql
alter table public.orders
  add column if not exists shipping_name text,
  add column if not exists shipping_phone text,
  add column if not exists customer_email text,
  add column if not exists shipping_address jsonb,
  add column if not exists line_items jsonb,
  add column if not exists email_sent_at timestamptz,
  add column if not exists shipping_email_sent_at timestamptz,
  add column if not exists fulfillment_status text,
  add column if not exists tracking_number text,
  add column if not exists tracking_carrier text,
  add column if not exists tracking_url text,
  add column if not exists label_url text,
  add column if not exists shippo_shipment_id text,
  add column if not exists shippo_transaction_id text,
  add column if not exists tracking_status text,
  add column if not exists tracking_status_details jsonb;
```

## 8) Admin tracking updates (optional)

This repo includes an admin-only endpoint to update tracking fields:
- `POST /api/orders/[id]/tracking`

To enable it locally, add to `.env.local`:

```bash
ADMIN_EMAILS=you@domain.com,other@domain.com
```

## 9) Shippo setup (recommended for automatic tracking)

Add to `.env.local`:

```bash
SHIPPO_API_TOKEN=shippo_test_...
SHIPPO_WEBHOOK_SECRET=some-long-random-string

# Required for label creation:
SHIPPO_FROM_ADDRESS_JSON={"name":"Phantom Track","street1":"...","city":"...","state":"CA","zip":"...","country":"US","phone":"...","email":"..."}
SHIPPO_PARCEL_JSON={"length":"10","width":"6","height":"4","distance_unit":"in","weight":"2","mass_unit":"lb"}
```

Notes:
- If `country` is `US`, Shippo expects `state` as a **2-letter code** (e.g. `CA`, `NY`), not a full name.

Create a Shippo webhook in Shippo Dashboard pointing to:
- `http://localhost:3000/api/shippo/webhook?secret=YOUR_SHIPPO_WEBHOOK_SECRET`

## 10) Order confirmation emails (Google Workspace)

This app can send a “thank you / order confirmation” email on `checkout.session.completed` (Stripe webhook).

### A) Create a Google Workspace App Password

- Enable **2-Step Verification** on the `orders@phantom-track.com` account.
- Create an **App Password** (Google Account → Security → App passwords).
- Use that app password as `SMTP_PASS` (NOT your normal login password).

### B) Add SMTP env vars

Add to `.env.local` (and to your production host env vars):

```bash
# Base URL used for links inside emails (required for “View your order” link)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Brand name used in the email template (optional)
BRAND_NAME=Phantom Track

# SMTP (Google Workspace / Gmail SMTP)
EMAIL_FROM="Phantom Track <orders@phantom-track.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=orders@phantom-track.com
SMTP_PASS=YOUR_GOOGLE_APP_PASSWORD
```

### C) Install dependency

```bash
npm install
```
