# Aeorch Frontend

Next.js frontend for Aeorch, an SEO/AEO/GEO website audit tool. This context covers the marketing site and the authenticated app (scan flow, user dashboard, agency workspace).

## Language

**User Dashboard**:
The individual user's personal overview at `/dashboard` — scan credits, referral program, recent scan history. Every logged-in user has one, regardless of plan or agency membership.
_Avoid_: "the dashboard" (ambiguous with Agency Dashboard)

**Agency Dashboard**:
The organization-level overview at `/agency` — tracked client sites, team members, rolled-up scores across an agency workspace. Only exists for users who belong to an Organization.
_Avoid_: "the dashboard", "multi-site view"

**Public Page**:
A page meant to be found through search and AI engines: marketing pages, blog posts, the free tool, the scan entry page, and signup. Declares itself as its own canonical and is listed in the sitemap.
_Avoid_: "marketing page" (blog and scan entry are Public Pages too)

**App Page**:
A page that belongs to one user or one session: login, dashboards, onboarding, admin, and every Report. Never meant to appear in search results.
_Avoid_: "private page" (login is an App Page yet is reachable without an account)

**Report**:
The result of one scan of one site, viewable only by its owner while logged in. Always an App Page.
