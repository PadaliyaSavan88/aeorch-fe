# Aeorch Frontend

Next.js frontend for Aeorch, an SEO/AEO/GEO website audit tool. This context covers the marketing site and the authenticated app (scan flow, user dashboard, agency workspace).

## Language

**User Dashboard**:
The individual user's personal overview at `/dashboard` — scan credits, referral program, recent scan history. Every logged-in user has one, regardless of plan or agency membership.
_Avoid_: "the dashboard" (ambiguous with Agency Dashboard)

**Agency Dashboard**:
The organization-level overview at `/agency` — tracked client sites, team members, rolled-up scores across an agency workspace. Only exists for users who belong to an Organization.
_Avoid_: "the dashboard", "multi-site view"
