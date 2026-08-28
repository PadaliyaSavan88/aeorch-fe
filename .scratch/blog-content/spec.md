# Blog content: checklist compliance + new agency-angle posts

Status: ready-for-agent

## Problem Statement

Aeorch's blog (`content/blog/*.md`, 28 posts) hasn't published anything since 2026-06-28 — a real content gap. Separately, the user provided a full SEO/AEO/GEO deployment checklist (frontmatter, structure, machine-readability, keyword rules) that the existing posts were never checked against, and an audit found real gaps: 11 posts have untyped code fences, 3 posts open straight into a heading with no direct-answer lead paragraph, and 2 posts have a stray H1 inside the markdown body (producing two H1s on the rendered page alongside the template's own `<h1>{title}</h1>`). There's also a strategic gap: none of the 28 posts target the agency/client-reporting angle that the growth plan explicitly calls for as the differentiated positioning — every existing post is generic AEO/GEO/SEO education, which the growth plan itself flags as a top risk (saturated space).

## Solution

Two tracks, both graded against the same checklist (`feedback_blog_deployment_checklist` memory):

1. Fix the 28 existing posts' checklist violations (typed code blocks, added lead paragraphs, H1→H2 demotion).
2. Write 8 new posts filling the content gap, explicitly agency-angled (client reporting, white-label, competitor comparison, multi-site monitoring) rather than more generic education, backdated on an alternate-day cadence starting right after the last post (2026-06-28) through 2026-07-14, per user decision.

Both tracks are verified by a new reusable script (`scripts/check-blog-checklist.mjs`) rather than by hand, so compliance is checkable for every future post too, not just this batch.

## User Stories

1. As an Aeorch visitor searching for how agencies report AI visibility to clients, I want to find a post that speaks directly to that need, so that I recognize Aeorch as built for me rather than generic AEO tooling.
2. As an Aeorch visitor evaluating the product, I want blog posts that showcase real shipped features (competitor comparison, multi-site dashboard, white-label PDF export) with concrete framing, so that I understand what the product actually does before signing up.
3. As an AI crawler/answer engine indexing an Aeorch post, I want a direct-answer first paragraph, one H1, typed code blocks, and correct Article/FAQPage JSON-LD, so that the content is citable and machine-readable per the site's own AEO/GEO standards.
4. As the site owner, I want a script that checks every post against the deployment checklist, so that I can verify compliance without manually re-reading each file every time I publish.
5. As the site owner, I want the 8 new posts' dates to not collide and to follow a specific backdated cadence, so that the blog's publish history reads as continuous.
6. As the site owner, I want `llms.txt` to pick up every new/fixed post automatically via the existing `prebuild` step, so that AI discovery stays in sync without manual maintenance.

## Implementation Decisions

- **Checklist source of truth**: `feedback_blog_deployment_checklist` memory (already saved). The OG image API check adapts `savanpadaliya.com` → `aeorch.com/api/og?title=[Title]`, since the checklist as given referenced a different project's domain.
- **Existing-post fixes** (28 posts, per the audit): add a language tag to every untyped fenced code block (`txt` for robots.txt/llms.txt config snippets, `json` for schema examples, `bash` for curl commands, `html` where applicable); demote stray in-body `# H1` headings to `## H2` in `ai-ready-website.md` and `how-to-write-llms-txt.md`; add a direct-answer lead paragraph before the first heading in `ai-ready-website.md`, `seo-aeo-geo-guide.md`, and `what-is-aeo.md`.
- **New posts**: 8 posts, `content/blog/<slug>.md`, following the existing frontmatter shape (`title`, `description`, `publishedAt`, `author`, `category`, `keywords`, `faq`) and the full checklist. Category stays within the existing 5-value taxonomy (SEO/AEO/GEO/Authority/AI Compatibility) — no new category invented. Dates: 2026-06-30, 07-02, 07-04, 07-06, 07-08, 07-10, 07-12, 07-14 (alternate days from the last real post). Titles/angles/categories as agreed:
  1. How Agencies Report AI Search Visibility to Clients (AEO) — pillar/positioning piece
  2. White-Label AEO Reports: What Agencies Actually Need (AEO) — showcases white-label PDF export
  3. How to Compare a Client's AI Visibility Against Competitors (GEO) — showcases competitor comparison
  4. What to Tell a Client When ChatGPT Doesn't Cite Their Site (AEO) — client-communication angle
  5. Building an AEO Retainer: How to Price AI Visibility Reporting (AEO) — agency business angle
  6. Multi-Site AI Visibility Monitoring: Tracking All Your Clients in One Dashboard (SEO) — showcases multi-site dashboard
  7. AI Citations as a New Authority Signal: What Agencies Should Track for Clients (Authority) — fills underserved category, still agency-angled
  8. The Agency's Guide to Explaining AEO/GEO Scores to Non-Technical Clients (AEO) — client-education angle
- **Verification seam**: `scripts/check-blog-checklist.mjs`, a standalone Node script (matches the existing `generate-llms-txt.mjs` convention — reads all `content/blog/*.md`, parses frontmatter via the same lib already used, no new dependency). Checks per post: title ≤60 chars, description ≤155 chars, keyword count 5-8, FAQ count ≥3, exactly one H1 in the rendered page (i.e. zero `# ` in the markdown body), first paragraph is not itself a heading, every fenced code block has a language tag. Prints a pass/fail table across all posts; non-zero exit code if any post fails, so it can be run standalone or wired into CI later (CI wiring itself is out of scope, see below).
- Each new/fixed post gets at least one real external citation (continuing the convention already established earlier: only 3 of the original 28 lacked one, now fixed) — checked manually, not by the script, since "does this citation genuinely support a claim" isn't mechanically checkable.
- `npm run build` (which runs the existing `prebuild` → `generate-llms-txt.mjs`) is run once after all posts are written/fixed, to confirm `llms.txt` picks up the new/changed posts — no changes needed to that script itself, since it already reads `getAllPosts()`.

## Testing Decisions

- `scripts/check-blog-checklist.mjs` is the primary verification tool — run it against all 36 posts (28 existing + 8 new) after the work is done; it must report zero failures.
- No unit test suite exists in `aeorch-fe` (confirmed, per the repo's own CLAUDE.md) — this script is a standalone check, not a Jest/Vitest test, consistent with how `generate-llms-txt.mjs` and `e2e-full-flow.mjs` already work outside any test framework in this repo.
- After writing, spot-verify via `npm run build` (catches MDX/frontmatter parse errors) and a manual read of 2-3 posts per category to confirm tone matches the agency-angle direction, not just mechanical checklist compliance.
- Reuse the earlier verification pattern from the AEO/GEO structured-data work this session: run the real backend rule logic (`AEO_RULES`/`GEO_RULES`) against rendered HTML for at least the new posts, to confirm FAQPage/Article schema and citations genuinely register as passing — not just "looks right."

## Out of Scope

- Full Stripe billing, tracking-scan auto-trigger work, and the comparison-report PDF export (separate spec, already ADR'd in the backend repo — unrelated to blog content).
- Wiring `check-blog-checklist.mjs` into CI (`.github/workflows/*`) — script exists and is runnable, but CI integration is a separate decision the user hasn't asked for yet.
- Images/alt text — none of the existing or planned posts currently use images, so this checklist item is not-applicable for this batch; revisit if/when a post actually needs one.
- Fixing the `GEO_NO_DEFINITION_START` backend rule (nav-before-content DOM order issue, discussed and deliberately deferred earlier this session) — unrelated to this markdown-content work.
- Retroactively backdating already-correct posts' dates, or otherwise touching any of the 28 posts beyond the specific checklist violations found in the audit.

## Further Notes

- The OG-image-URL domain mismatch in the user-provided checklist (`savanpadaliya.com` vs `aeorch.com`) suggests the checklist may have originated from a different project and was reused here — flagged and adapted, not silently changed, in the memory file.
- The "backdated, alternate-day" publish-date decision was explicitly confirmed with the user after flagging that it undermines the site's own GEO freshness signals (`GEO_NO_DATE_PUBLISHED` etc.) — a deliberate, informed trade-off, not an oversight.
- This spec covers writing/fixing content only. It does not cover promoting or distributing the new posts (social, newsletter, etc.) — out of scope unless raised separately.
