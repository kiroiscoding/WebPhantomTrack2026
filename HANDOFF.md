# phantom-track.com handoff (last updated 2026-11-16)

Start here if you're an AI or a new developer picking up the site. Read `CLAUDE.md` first: it lists the owner's standing rules.

## Branches and deploys

The site is Next.js 16 (Turbopack) with Tailwind v4 and framer-motion.

**Branches**
- **`main`**: production. Vercel deploys phantom-track.com from it.
- **`site-cleanup`**: the working branch. Vercel gives it login-protected previews.
  - **Went live 2026-11-16** (owner's OK): `site-cleanup` took in `main`'s Shopify headless checkout (`c14abac`) and `main` was fast-forwarded to it.
  - Keep working here. **Merge into `main` only when the owner says so.**

**What going live would publish**

Merging `site-cleanup` into `main` publishes:
- copy and claims clean-up;
- the Acceptable Use page removed (it now redirects to `/terms`);
- Support page fixes;
- per-page share previews;
- legal drafts;
- About photo optimisation;
- the three real App Store reviews;
- all the screenshot, mockup and gallery work below.

**Running it locally**

- Run `npm run dev` and open http://localhost:3000.
- `?platform=ios` or `?platform=android` forces either screenshot set, for example `/app?platform=android`.

## Shop (Shopify headless)

Since 2026-11-12 the shop runs on Shopify's Storefront API instead of Stripe (`src/lib/shopify.ts`, `src/lib/catalog.ts`). Products, prices, photos and copy come from whatever is published to the Shopify **Headless** sales channel, and each product's URL is its Shopify handle: `/products/<handle>`.

- When `site-cleanup` merged on 2026-11-16, the owner said **Shopify supersedes**: every conflict took the Shopify version. The only things re-applied on top were the approved copy fixes ("Shop", not "Armory"; no "touch" claim; "What's inside" vs "Features").
- The old hard-coded slugs `tracker-combo` and `phantom-vest` no longer exist, so the homepage buttons (Hero, InAction) now go to `/products`. Point them at real product pages once those handles exist in Shopify. On 2026-11-16 the only live product was `test-product-shopify`.
- **Building locally:** `.env.local` has no Shopify, Supabase or Stripe settings, so `npm run build` fails (the Stripe and Supabase clients are made at import time). Pass `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and a dummy `STRIPE_SECRET_KEY` on the command line; without Shopify settings the shop is just empty. Vercel has the real values.
- `npm run lint` has 2 errors (`account/page.tsx`, `VerifyConfirmedClient.tsx`, setState in an effect) that pre-date the merge.

## How the app screenshots work

**Choosing the set**

- `src/lib/devicePlatform.ts` checks the user agent in the browser. Android visitors get the Android set; everyone else gets iOS.
- The check returns `null` during server render and hydration. Images wait for it, so nobody downloads both sets.

**Where the images live**

| What | Path |
|---|---|
| Raw screenshots, 1206×2622, 7 per platform | `public/app/new-screenshots/` (iOS), `public/app/android-screenshots/` |
| Device frames used on `/app`, 600 px WebP | `public/app/devices/{ios,android}/*.webp` |
| Homepage mockup, used in `src/components/Specs.tsx` | `public/app/screenshots/newPhotosAPP.webp` (iOS), `newPhotosAPP-android.webp` |

- The iPhone frame is the Xcode Simulator's iPhone 17 Pro chrome.
- The Pixel frame is the Android emulator's Pixel 9 Pro skin.

**The `/app` page** (`src/app/(site)/app/page.tsx`)

- **Tilt:** `PhoneFrame` takes a `tilt` prop, which is a resting rotateY that eases with scroll.
- **Edge:** 8 `translateZ` layers show a solid metal edge. Each is a brushed-metal gradient masked by the frame image's silhouette. Don't go back to stacking copies of the full screenshot: that looked like a hologram.
- **Side phones:** the side phones in the trios are fully opaque.

**Images and loading**

- Phone images ship as pre-compressed WebP with `unoptimized`.
- next/image's AVIF encoding was very slow for these, so don't send them through the optimiser.
- After replacing an image under the same filename, run `rm -rf .next/dev/cache/images` or the dev server keeps showing the old one.

**The fake people in the screenshots**

| Who | Role |
|---|---|
| Liam Caddick | The profile you see ("Welcome back, Liam") |
| Tyler Murray | Ranked 1st |
| Finley Williams | Ranked 2nd |
| Carter Abed, Timi Amu, Diego Ramirez | The other teammates |

**Regenerating screenshots, frames or mockups**

The app repo has all the tools in `screenshot_tools/README.md`, on its `screenshots/marketing-mode` branch.

## Review gallery

The homepage "Trusted by Ballers" section is `src/components/SocialProof.tsx`, built on `ReviewMorphGallery.tsx` and `ui/morph-gallery.tsx`.

- **Layout:** text on the left, photo on the right, with prev and next arrows. There is no autoplay; the owner asked for that.
- **Animation:** the photo morph takes 1.1 s and the text fade 0.9 s. The owner tuned those to "meet in the middle".
- **Slides:** 12 slides. The outdoor shoot photos alternate with the indoor facility ones. No black-and-white photos; the owner rejected them.
- **Image loading:** photos in `public/gallery/` are about 6.6 MB in total. The gallery loads them as plain `<img>` and `Image()` elements, not through next/image.

## Still to do

1. **Check the live site at phone widths.** The merge went live on 2026-11-16. The angled phones on `/app` still haven't been checked at around 375–430 px.
2. **Account deletion page.** `/delete-account` (added 2026-11-15) is the URL Google Play asks for under Data safety → account deletion. Live since 2026-11-16. Two drafts are marked `TODO-LEGAL-REVIEW`: the 30-day window for emailed requests and how long deletion records are kept. The page lists what the app's `delete_account` function removes; update it if that function changes.
3. **Android launch copy.**
   - Google Play internal testing can start on 2026-10-22.
   - Once the app is public on Play, update the iOS-only wording:
     - "free iOS app" in the `products/layout.tsx` and `app/layout.tsx` metadata;
     - "iOS app" in the privacy and terms text, and the iPhone-only settings line in Privacy.
   - The Google Play buttons on `/invite` and `/add` are already on `main`. They point at the Play listing, which only works once the app is published.
4. **Frame licensing.**
   - The iPhone frame is the Simulator's chrome.
   - For marketing, consider switching to Apple's official Product Bezels from developer.apple.com/design/resources.
   - Apply the same check to the Pixel skin.
5. **iOS homepage mockup.**
   - The iOS mockup is still a 2D composite onto the older template. The Android one is a 3D studio render.
   - Restyle the iOS one if the owner wants them to match.
6. **Gallery weight.** Consider smaller or WebP gallery photos if the homepage feels slow on mobile.
