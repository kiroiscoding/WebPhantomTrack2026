---
phase: 01-anti-phishing-deep-link-fixes
plan: "01"
subsystem: deep-link-pages
tags: [anti-phishing, deep-links, security-headers, seo]
dependency_graph:
  requires: []
  provides:
    - immediate-render-invite-page
    - immediate-render-add-page
    - security-headers-all-routes
    - robots-txt
    - correct-metadata
  affects:
    - src/app/invite/InviteClient.tsx
    - src/app/add/AddClient.tsx
    - src/app/layout.tsx
    - next.config.ts
    - public/robots.txt
tech_stack:
  added: []
  patterns:
    - useState lazy initializer for synchronous IAB detection before first render
    - Security headers via Next.js headers() config
key_files:
  modified:
    - src/app/invite/InviteClient.tsx
    - src/app/add/AddClient.tsx
    - src/app/layout.tsx
    - next.config.ts
  created:
    - public/robots.txt
decisions:
  - "Removed phase state entirely rather than keeping it as a loading guard — content renders unconditionally from first paint"
  - "webCtx lazy initializer is safe for SSR because detectWebContext() already guards typeof navigator"
  - "Outer AnimatePresence wrappers removed; inner AnimatePresence for CopiedCard/CopyFailedCard switcher kept"
  - "Security headers entry placed before AASA entry per convention (general before specific)"
metrics:
  duration: ~8 minutes
  completed: 2026-05-17
  tasks_completed: 3
  files_modified: 4
  files_created: 1
---

# Phase 01 Plan 01: Anti-Phishing Deep Link Fixes Summary

**One-liner:** Eliminated 2-second black-screen spinner phase on /invite and /add pages by rendering full UI at t=0ms using synchronous IAB detection, and added robots.txt, security headers, and corrected metadata to establish site legitimacy signals.

## Tasks Completed

### Task 1: Refactor InviteClient.tsx
**Commit:** 4b8e7b5

Changes applied to `src/app/invite/InviteClient.tsx`:

1. **Removed `phase` state** — deleted `const [phase, setPhase] = useState<"opening" | "fallback">("opening")` entirely. No more phase tracking.

2. **webCtx lazy initializer** — changed from a deferred setState inside a 2-second setTimeout to a synchronous lazy initializer:
   ```tsx
   const [webCtx] = useState<WebContext>(() =>
       typeof navigator === 'undefined' ? { isWebView: false, appName: '' } : detectWebContext()
   );
   ```
   IAB detection now runs synchronously before the first render, not 2 seconds after mount.

3. **useEffect simplified** — removed the `setTimeout` block entirely. For non-IABs: `window.location.href` fires immediately on mount. For IABs: `copyToClipboard` fires immediately on mount. Cleanup only removes the meta tag.

4. **JSX phase switcher removed** — deleted the `<AnimatePresence mode="wait">` wrapper that toggled between the "opening" spinner branch and the "fallback" content branch. The fallback content (badge, headline, description) now renders directly without a key prop.

5. **Outer AnimatePresence gate removed** — deleted the `<AnimatePresence>` wrapper that gated the action area on `phase === "fallback"`. The action area (CTA buttons, App Store link) renders unconditionally from first paint.

6. **Inner AnimatePresence kept** — the `<AnimatePresence mode="wait">` that switches between `CopiedCard` and `CopyFailedCard` inside the IAB branch was preserved, keeping the import valid.

7. **Dependency array updated** — `[code, router]` → `[code, router, webCtx.isWebView]`.

### Task 2: Refactor AddClient.tsx
**Commit:** 2e9a97b

Applied identical structural changes as Task 1 with AddClient-specific differences:
- URL param: `uid` (not `code`)
- Deep link scheme: `phantomtrack://add?uid=${uid}`
- Meta content: `app-id=6758968140, app-argument=phantomtrack://add?uid=${uid}`
- Guard: `if (!uid)`, null check: `if (!uid) return null`
- Headline: "Add me on Phantom Track", badge: "Add Me"
- Dependency array: `[uid, router, webCtx.isWebView]`

### Task 3: Fix layout.tsx + add robots.txt + add security headers
**Commit:** cbfad37

**3a. src/app/layout.tsx** — corrected metadata description:
- Before: `"Elevate your listening experience with Phantom Track."`
- After: `"Track your soccer performance with Phantom Track — the AI-powered wearable for football players."`

**3b. public/robots.txt** — created new file:
```
User-agent: *
Allow: /

Sitemap: https://phantom-track.com/sitemap.xml
```

**3c. next.config.ts** — added security headers entry before the existing AASA entry:
```ts
{
  source: "/(.*)",
  headers: [
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ],
},
```
The AASA entry (`source: "/.well-known/apple-app-site-association"`) remains intact.

## Verification Results

All post-execution checks passed:

| Check | Expected | Result |
|-------|----------|--------|
| `npx tsc --noEmit` | exits 0 | PASS |
| `useState<WebContext>(() =>` count in InviteClient | 1 | 1 |
| `useState<WebContext>(() =>` count in AddClient | 1 | 1 |
| `setTimeout` count in InviteClient | 0 | 0 |
| `setTimeout` count in AddClient | 0 | 0 |
| `soccer performance` in layout.tsx | 1 match | 1 match |
| `Sitemap` in public/robots.txt | 1 match | 1 match |
| Security header keys in next.config.ts | 4 | 4 |
| `apple-app-site-association` in next.config.ts | intact | intact |

## Deviations from Plan

None — plan executed exactly as written.

## Threat Model Coverage

All `mitigate` dispositions from the STRIDE threat register were addressed:

| Threat ID | Mitigation | Status |
|-----------|------------|--------|
| T-01-04 | X-Frame-Options: SAMEORIGIN prevents clickjacking | Done — next.config.ts |
| T-01-05 | Correct metadata description matches app category | Done — layout.tsx |
| T-01-06 | robots.txt allows crawler indexing for reputation recovery | Done — public/robots.txt |

## Post-Deployment Manual Step Required

After deploying to production, a human must request a Google Safe Browsing review via Search Console for phantom-track.com. See PLAN.md `<post_deployment_manual_step>` for detailed instructions.

## Self-Check: PASSED

All files confirmed present and commits verified:
- `src/app/invite/InviteClient.tsx` — modified, commit 4b8e7b5
- `src/app/add/AddClient.tsx` — modified, commit 2e9a97b
- `src/app/layout.tsx` — modified, commit cbfad37
- `next.config.ts` — modified, commit cbfad37
- `public/robots.txt` — created, commit cbfad37

Status: **COMPLETE**
