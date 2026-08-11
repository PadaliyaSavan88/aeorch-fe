# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Aeorch frontend

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind frontend for Aeorch, a SEO/AEO/GEO website audit tool. Backend lives in the sibling repo `../aeorch` (Express API on `:8000`).

## Commands

- `npm run dev` — Next dev server (port 3000; falls back to 3002 if 3000 is taken by another project — the backend's CORS allow-list already covers both).
- `npm run build` — runs `prebuild` (`scripts/generate-llms-txt.mjs`) then `next build`.
- `npm run lint` — `next lint`.
- `npm run e2e` — Puppeteer full-flow test (`scripts/e2e-full-flow.mjs`); see below.
- No unit test suite exists in this repo.
- Requires the backend running at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000/api/v1`) for any page that calls the API.

## Architecture

**Data layer.** `lib/api.ts` is the single Axios client for all backend calls, grouped into `authApi`, `scanApi`, `adminApi`, `contactApi`. It attaches the JWT access token from `localStorage` on every request and transparently refreshes on a 401 (via `/auth/refresh`), redirecting to `/login` if the refresh token is also invalid. `lib/auth.ts` holds the plain `localStorage` get/set/clear helpers for `accessToken`/`refreshToken`. There is no client-side auth context/provider — pages check `isLoggedIn()` and fetch `authApi.me()` themselves (see `app/dashboard/page.tsx`). Auth is entirely client-side/token-based; there's no Next.js middleware gating routes server-side.

**Google OAuth callback** (`app/(auth)/callback/page.tsx`) — note the actual route is `/callback`, not `/auth/callback`: `app/(auth)` is a Next.js route group and doesn't appear in the URL (the backend used to redirect to the wrong path entirely; fixed). The backend never puts real tokens in this redirect — it sends a single-use opaque `?code=...`, and the callback page's `useEffect` calls `authApi.exchangeGoogleCode(code)` to trade it for the real `accessToken`/`refreshToken` before calling `saveTokens(...)`. Any change to this exchange contract is a two-repo change (backend: `auth.controller.ts`'s `googleCallback`/`googleExchange`).

**Routing (App Router).** Route groups: `app/(auth)/{login,signup,callback}` for auth pages. Core product flow is `app/scan` (submit a URL) → `app/report/[id]` (poll/display the scan report, split into a client component `ReportView.tsx`) → `app/dashboard` (scan history, credits, referral). `app/admin` is the admin panel (gated by `isAdmin` on the logged-in user, checked client-side against `adminApi`). Marketing/content pages (`app/page.tsx`, `app/about`, `app/features`, `app/contact`) compose components from `components/landing/*`; `components/layout/*` holds header/footer variants (`Header`/`AuthHeader` for logged-out vs marketing, `AppHeader` for logged-in app pages).

**Blog/content.** Markdown files in `content/blog/*.md` (frontmatter via `gray-matter`) are the source of truth for blog posts — no CMS. `lib/blog.ts` reads and parses them at build/request time (`getAllPosts()`, plus a per-slug loader used by `app/blog/[slug]/page.tsx`) and rendered via `next-mdx-remote`. Adding a post is just adding a `.md` file with the expected frontmatter (`title`, `description`, `publishedAt`, `author`, `category`, `keywords`, `faq`).

**AEO/GEO self-dogfooding.** Because the product audits sites for AI-crawler readiness, the marketing site implements the same things it checks for: `scripts/generate-llms-txt.mjs` generates `public/llms.txt` (llmstxt.org convention) from the static pages + blog posts before every build (`prebuild` script — if you add a new static marketing page, add it to `STATIC_PAGES` in that script or it won't appear in `llms.txt`); `app/llm.txt/route.ts` and `app/.well-known/ai-plugin.json/route.ts` serve related AI-discovery endpoints; `app/robots.ts` and `app/sitemap.ts` are the standard Next.js metadata routes. JSON-LD (`WebSite` schema, FAQ schema on blog posts) is embedded directly in page components rather than via a shared helper.

## E2E testing

- `scripts/e2e-full-flow.mjs` (Puppeteer) drives a real signup → scan → report → contact form → admin panel flow through the actual UI, using real network crawls (currently configured against `savanpadaliya.com` and `susea.ai`). Requires both the backend (`:8000`) and this frontend dev server running, plus the backend's Mongo/Redis up.
- Screenshots and a `results.json` pass/fail summary land in `e2e-results/` (gitignored).

## Env vars

- `NEXT_PUBLIC_API_URL` — backend base URL, defaults to `http://localhost:8000/api/v1`.
- `NEXT_PUBLIC_SITE_URL` — canonical site URL used in metadata/JSON-LD/`llms.txt` generation, defaults to `https://aeorch.com`.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — optional; Google Analytics is only mounted (`app/layout.tsx`) if this is set.
