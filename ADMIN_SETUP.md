# Admin Dashboard Setup

## What you get
- **Admin console** at `/admin/*` (or `admin.<your-domain>` via middleware rewrite)
- **Role-based access control** using Supabase Auth `app_metadata.role`:
  - `admin`: full admin access (can grant roles)
  - `staff`: admin console access (cannot grant roles)
- **Fallback access** (bootstrapping): `ADMIN_EMAILS` env allowlist

## Local development (subdomain-style)

### 1) Add hosts entries
Edit `/etc/hosts` and add:

```text
127.0.0.1 phantom-track.com
127.0.0.1 admin.phantom-track.com
```

### 2) Start the dev server

```bash
npm run dev
```

If your machine blocks custom hostnames, run:

```bash
npm run dev -- --hostname 0.0.0.0
```

### 3) Open the URLs
- Public site: `http://phantom-track.com:3000`
- Admin console: `http://admin.phantom-track.com:3000`

> The admin subdomain is routed by `middleware.ts` (host-based rewrite to `/admin/*`).

## Environment variables

### Required for auth
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Required for admin APIs (service role)
- `SUPABASE_SERVICE_ROLE_KEY`

### Optional (bootstrap access)
- `ADMIN_EMAILS=you@domain.com,other@domain.com`

## Assigning roles (recommended)
1. Sign in at `/admin/login`.
2. If you don’t yet have access, temporarily add yourself to `ADMIN_EMAILS`.
3. Go to `/admin/settings` and grant roles to users by email.
4. Remove `ADMIN_EMAILS` once you’re confident roles are set correctly.

## Production DNS / deployment
- Point both `phantom-track.com` and `admin.phantom-track.com` to the **same** deployment.
- The app detects the `admin.` host and rewrites to the admin routes.

## OAuth callback note
OAuth/magic-link callbacks use `/auth/callback`. The middleware explicitly avoids rewriting `/auth/*` so sign-in works on the admin subdomain too.

