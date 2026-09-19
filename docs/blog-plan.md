# Aeorch Blog Content Plan: Oct 2026 to Mar 2027

> **For Claude Code:** This file is the source of truth for the aeorch.com blog. Before writing any post, read sections 1 to 4. When you finish a post, update its `Status` in the calendar (section 6) and add any new internal links to older posts. Do not create a post whose slug or main topic already appears in section 4.

---

## 1. How to use this file

**Status values:** `todo`, `drafting`, `review`, `published` (add the live date)

**For each post:**

1. Read the brief in section 7 and the rules in sections 3 and 8.
2. Check section 4 for existing posts on the same topic. Link to them; do not repeat their content.
3. **Check competitor facts at the time you write.** Look up current pricing and features on the competitor's own site and add a "Pricing checked on <date>" note. The competitor details in this file are a starting point only.
4. Write the post using the template in section 8. Include a direct answer at the top, a `faq:` array in the frontmatter (this is what generates FAQPage schema), and at least 3 internal links.
5. Add the CTA from section 3 that matches the post's funnel stage.
6. Update this file: status, publish date, and any older posts that should now link to this one.

**Publishing rhythm:** 2 posts a week, on Tuesday and Thursday. 26 weeks. Weeks 13 and 14 each have only one post because of the holidays.

**Git workflow (per repo policy in the root CLAUDE.md):** one branch and one PR per calendar week containing all of that week's posts, named `blog/week-NN-<first-slug>` (for example `blog/week-01-best-aeo-tools-for-agencies`). Never commit to `main`; merge only when the owner says so. Merging to `main` deploys the site, and `lib/blog.ts` does not filter on `publishedAt`, so every post in the PR goes live at merge. Set `publishedAt` on all posts in a week's PR to the merge date (the Tuesday), not the calendar date, so no post is dated in the future. Open each week's PR by the Monday before.

---

## 2. Business context

### Product (aeorch.com)
- **What it is:** A website audit tool that scores a site on 5 things: **SEO, AEO, GEO, AI Compatibility and Authority**. It returns a list of fixes ranked by impact and effort.
- **Features that exist today (safe to claim):** competitor side-by-side comparison, white-label PDF reports (Agency plan), multi-site dashboard, prioritized issue list, auto-generated `llms.txt` and `ai-plugin.json`, and a free `llms.txt` generator (no login needed).
- **Do NOT claim in any post until confirmed built:** email or regression alerts, automatic monthly rescans, score history. They appear in marketing copy but are not confirmed as implemented. Posts may still give general advice about re-audit cadence (post #43), but must not describe these as Aeorch features.
- **Do NOT write posts about AI citation tracking.** It is out of scope for this plan by owner decision.
- **Free plan:** every account gets 20 free page credits (1 credit = 1 page scored), which covers all 5 audit dimensions and a full HTML report. "Run a free scan" is accurate. The free `llms.txt` generator needs no login and no credits.
- **Paid pricing:**
  - **Starter:** $29/mo for 1 site
  - **Agency:** $79/mo. Up to 15 client sites and 5 team seats (owner decision, 2026-09-19). Adds competitor comparison, white-label PDF, multi-site dashboard and priority support. Founding pricing is locked for 6 months.
  - Plans can be switched any time with prorated billing.
- **Main CTAs on the site:** "Run a free scan", "Start free scan", "Try the free tool"

### Audience (in priority order)
1. **SEO and digital agencies** adding AEO/GEO as a new service and needing to show clients where they stand against competitors.
2. **Freelancers and small shops** (1 to 10 people). Price-sensitive, want a client-ready report fast.
3. **In-house marketing teams** comparing their brand against competitors and building a case for budget.

### Main blog goal
**Signups and free scans (bottom of the funnel).** Every post has to lead naturally to a scan, the Agency plan, or a free template or tool that captures the reader.

### Main competitor: AEOChecker.ai
- They position as a "free AEO/GEO checker" plus **brand monitoring across ChatGPT, Claude, Gemini and Perplexity**: prompt tracking, sentiment, citation sources, and Slack/Zapier/webhook integrations. Paid plans reportedly start around $5/mo (verify before citing).
- Their blog covers how answer engines choose sources, agentic shopping protocols, feature announcements, and "AthenaHQ vs AEO Checker".
- **Where we win:**
  - Built for agencies from the ground up: multiple client sites on one plan, white-label PDFs, a multi-site dashboard, and **competitor comparison as a core feature**.
  - We tell users **what to fix**, in priority order. We do not just monitor mentions.
  - One tool covers SEO, AEO, GEO, AI compatibility and authority.
- **Where they are stronger (be honest in comparison posts):** prompt-level brand-mention tracking, sentiment, and integrations. Present Aeorch as the **audit, fix and prove-it-to-clients** layer. Say plainly that a prompt tracker can sit alongside it.

### Other competitors that show up in agency buying searches
Otterly AI, Profound, Peec AI, AthenaHQ, Semrush AI Visibility Toolkit, Ahrefs Brand Radar, Scrunch, Writesonic GEO, WorkDuo. Most are prompt and mention trackers priced at $29 to $250+/mo. Our angle: **fix-focused audits plus agency reporting at $79/mo.**

---

## 3. Positioning and writing rules

**Core message:** *"Show every client where they stand in AI search against their competitors, and exactly what to fix first."*

**Voice:** Practical and written by practitioners, like an agency ops lead talking to another agency. Specific numbers, screenshots, and templates. No hype about AI.

**Rules:**
- **No emojis and no dashes used as punctuation (em or en) anywhere in post content, frontmatter, code or comments.** Use commas, colons, parentheses or "to" for ranges. This is a project-wide rule.
- Answer the main question in the first 40 to 60 words, in a short paragraph or a bulleted TL;DR box. This is the part AI engines quote.
- Use H2s phrased as questions where it reads naturally.
- Add at least one table or checklist per post. AI engines often cite these.
- Show Aeorch in use with real screenshots (score cards, competitor comparison view, white-label PDF). Use `<!-- SCREENSHOT: description -->` placeholders if you do not have one.
- Comparison posts must be fair. Include a "When to choose [competitor]" section, cite their site, and date the pricing. Never make claims about a competitor that we cannot back up.
- Never make up statistics, customer names or case-study numbers. Mark unknowns as `<!-- TODO: data needed -->`.
- Spelling: always `llms.txt` (the llmstxt.org standard). The product's audit accepts either `/llms.txt` or `/llm.txt`, so a site is not penalized for the older spelling, but posts always recommend `llms.txt`.
- Never describe an Aeorch feature that is not in the "safe to claim" list in section 2.

**CTA blocks** (match the post's funnel stage):

| Stage | CTA copy | Link |
|---|---|---|
| BOFU (comparisons, alternatives, pricing) | "Compare your client against 3 competitors in one scan. Agency plan: $79/mo." | /pricing |
| MOFU (how-to, benchmarking, playbooks) | "Run a free scan to see your AEO, GEO and competitor gaps. Every account starts with 20 free page credits." | /scan |
| Template / lead magnet | "Download the template" plus secondary "Fill it automatically with an Aeorch scan" | template asset + /scan |
| TOFU (rare in this plan) | "Try the free llms.txt generator" | /free-tool |

---

## 4. Existing content: do not duplicate, do link

There are 36 published posts. New posts **must link to these** where relevant and must not target the same main keyword.

| Existing slug | Topic | Plan |
|---|---|---|
| what-is-aeo | AEO definition | Link from all beginner-level mentions |
| seo-aeo-geo-guide | SEO vs AEO vs GEO (2025) | **Refresh to 2026** (see section 9) |
| ai-ready-website | AI-ready checklist (2025) | **Refresh** |
| free-aeo-checker | Free AEO checker | Link from comparison posts |
| geo-checker | GEO checker | Link |
| seo-rank-checker | SEO rank checker | Link |
| ai-search-visibility-checker | AI visibility checker | Link |
| check-ai-crawler-access | Is your site blocked from GPTBot | Link from technical posts |
| website-authority-checker | Authority checker | Link |
| what-is-geo | GEO beginner guide | Link |
| what-is-aeo-score | AEO score explained | Link from every score mention |
| what-is-geo-score | GEO score explained | Link |
| google-ai-overviews-seo | AI Overviews | Link from #47 |
| aeo-vs-seo-differences | 7 differences | Link from objection-handling posts |
| ai-citations-new-backlinks | Citations as backlinks | Link |
| faq-schema-markup-guide | FAQ schema | Link from #28 |
| how-to-write-llms-txt | llms.txt | Link from #33 |
| unblock-ai-bots-robots-txt | robots.txt for AI bots | Link from #33 |
| optimize-content-for-ai-citations | Get cited by ChatGPT/Perplexity | Link from #39, #41 |
| howto-schema-markup-guide | HowTo schema | Link |
| technical-seo-checklist-2026 | Technical SEO | Link |
| improve-geo-score | 9 GEO tactics | Link |
| ecommerce-seo-ai-search | E-commerce | Vertical hub; do not write a new e-com vertical post |
| saas-seo-ai-search | SaaS | Vertical hub; do not write a new SaaS vertical post |
| local-seo-aeo-small-business | Local | Link from vertical posts #14, #19, #24, #37 |
| common-aeo-mistakes | 10 mistakes | Link |
| content-freshness-ai-search | Publish date and AEO | Link from #43 |
| complete-website-audit-checklist | Full audit checklist | Link from #4 (template version) |
| agency-ai-visibility-reporting | Agency reporting | **Hub** for reporting posts #13, #17 |
| white-label-aeo-reports-for-agencies | White-label reports | Link from BOFU posts |
| compare-client-ai-visibility-against-competitors | Competitor comparison | **Pillar for Cluster B**; every Cluster B post links here |
| chatgpt-not-citing-client-site | Client not cited | Link from #32 |
| aeo-retainer-pricing-guide | Retainer pricing | Link from #5, #20, #46 |
| multi-site-ai-visibility-monitoring | Multi-site | Link from #37, #44 |
| ai-citations-authority-signal-for-agencies | Citations as authority | Link |
| explaining-aeo-geo-scores-to-clients | Explaining scores | Link from #30, #34 |

---

## 5. Topic clusters

| Cluster | Purpose | Funnel | Posts |
|---|---|---|---|
| **A. Comparisons & alternatives** | Show up for people comparing tools. Highest purchase intent. | BOFU | 1, 2, 6, 9, 12, 15, 18, 21, 25, 29, 44 |
| **B. Competitor AEO benchmarking** | Our main difference from other tools. Owns "compare against competitors". | MOFU to BOFU | 3, 7, 16, 22, 32, 33, 43 |
| **C. Agency growth & operations** | Sell, package, report on and retain AEO clients | MOFU to BOFU | 5, 10, 20, 27, 30, 34, 40 |
| **D. Templates & lead magnets** | Downloadable assets that capture emails and lead to scans | MOFU | 4, 8, 11, 13, 17, 35 |
| **E. Vertical playbooks for agencies** | "AEO for [client industry]" searches | MOFU | 14, 19, 24, 31, 37, 45 |
| **F. Freelancers & in-house** | Secondary audiences | MOFU to BOFU | 23, 38, 46, 48 |
| **G. Fix guides** | Link to the audit's fix list. Brings in organic traffic that leads to scans. | MOFU | 28, 39, 41, 47 |
| **Proof** | Case studies (need real customer data) | BOFU | 26, 36, 42 |

**Site categories.** The site has a fixed `category` frontmatter field. Clusters are plan-only labels. Map each post to one of the five existing categories: `AEO`, `GEO`, `SEO`, `AI Compatibility`, `Authority`. Default mapping: comparisons, agency operations, templates, verticals, freelancer and in-house posts use `AEO`; Cluster B uses `GEO`; #28 uses `AEO` (schema); #33 uses `AI Compatibility`; #22 uses `GEO`; #40 uses `SEO`. Override when a post is clearly about another category.

---

## 6. Content calendar

Target keywords are hypotheses. **Before drafting, check search volume and difficulty with the user's SEO tool** and adjust the H1 if a close variant is clearly stronger. `n/a` marks slots with no value.

| # | Date | Title (H1) | Slug | Primary keyword | Cluster | Audience | Intent | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-09-29 | Best AEO Tools for Agencies in 2026 (Compared) | best-aeo-tools-for-agencies | aeo tools for agencies | A | Agency | BOFU | review (PR open, publishedAt 2026-09-29) |
| 2 | 2026-10-01 | AEOChecker.ai Alternative for Agencies: Aeorch vs AEO Checker | aeochecker-alternative | aeo checker alternative | A | Agency | BOFU | review (PR open, publishedAt 2026-09-29) |
| 3 | 2026-10-06 | AI Share of Voice: How to Measure Competitors in ChatGPT & Perplexity | ai-share-of-voice | ai share of voice | B | All | MOFU | todo |
| 4 | 2026-10-08 | Free AEO Audit Template for Agencies (Google Sheet) | aeo-audit-template | aeo audit template | D | Agency/Freelancer | MOFU | todo |
| 5 | 2026-10-13 | How to Sell AEO Services to Your Existing SEO Clients | sell-aeo-services | how to sell aeo services | C | Agency | MOFU | todo |
| 6 | 2026-10-15 | Otterly AI Alternative: Audit + Competitor Comparison for Agencies | otterly-ai-alternative | otterly ai alternative | A | Agency | BOFU | todo |
| 7 | 2026-10-20 | AEO Competitor Gap Analysis: Why AI Cites Them and Not You | aeo-competitor-gap-analysis | aeo competitor analysis | B | All | MOFU | todo |
| 8 | 2026-10-22 | AEO Proposal Template for Agencies (Free Download) | aeo-proposal-template | aeo proposal template | D | Agency | MOFU | todo |
| 9 | 2026-10-27 | Profound Alternative for Agencies and Small Teams | profound-alternative | profound alternative | A | Agency | BOFU | todo |
| 10 | 2026-10-29 | The Competitor-Scan Pitch: Using a Free AEO Audit to Win New Clients | aeo-audit-sales-pitch | aeo audit lead generation | C | Agency/Freelancer | BOFU | todo |
| 11 | 2026-11-03 | AEO Client Onboarding Checklist (First 30 Days) | aeo-client-onboarding-checklist | aeo onboarding checklist | D | Agency | MOFU | todo |
| 12 | 2026-11-05 | Peec AI Alternative: A Cheaper Option for Multi-Client Agencies | peec-ai-alternative | peec ai alternative | A | Agency | BOFU | todo |
| 13 | 2026-11-10 | AEO Competitor Benchmark Report Template | aeo-competitor-report-template | competitor benchmark report template | D | Agency/In-house | MOFU | todo |
| 14 | 2026-11-12 | AEO for Law Firms: An Agency Playbook | aeo-for-law-firms | aeo for law firms | E | Agency | MOFU | todo |
| 15 | 2026-11-17 | AthenaHQ Alternative for Agencies | athenahq-alternative | athenahq alternative | A | Agency | BOFU | todo |
| 16 | 2026-11-19 | How to Choose Which Competitors to Track in AI Search | choose-competitors-ai-search | ai search competitors | B | All | MOFU | todo |
| 17 | 2026-11-24 | AEO Monthly Report Template: What to Show Clients | aeo-monthly-report-template | aeo report template | D | Agency | MOFU | todo |
| 18 | 2026-11-26 | Semrush AI Visibility Toolkit vs Aeorch: Which Fits Your Agency? | semrush-ai-visibility-vs-aeorch | semrush ai visibility toolkit alternative | A | Agency | BOFU | todo |
| 19 | 2026-12-01 | AEO for Dental and Medical Practices: An Agency Playbook | aeo-for-healthcare-practices | aeo for dentists | E | Agency | MOFU | todo |
| 20 | 2026-12-03 | How to Package AEO Services: 3 Tiers Agencies Can Sell | aeo-service-packages | aeo service packages | C | Agency | BOFU | todo |
| 21 | 2026-12-08 | Ahrefs Brand Radar vs Aeorch: Monitoring vs Fixing | ahrefs-brand-radar-vs-aeorch | ahrefs brand radar alternative | A | Agency/In-house | BOFU | todo |
| 22 | 2026-12-10 | AEO & GEO Score Benchmarks by Industry (2026 Data) | aeo-benchmarks-by-industry | aeo benchmarks | B | All | MOFU | todo |
| 23 | 2026-12-15 | How In-House Teams Benchmark AI Visibility Against Competitors | in-house-ai-visibility-benchmark | ai visibility benchmark | F | In-house | MOFU | todo |
| 24 | 2026-12-17 | AEO for Home Services (HVAC, Plumbing, Roofing): Agency Playbook | aeo-for-home-services | aeo for home services | E | Agency | MOFU | todo |
| 25 | 2026-12-22 | Free vs Paid AEO Tools: What Agencies Actually Need | free-vs-paid-aeo-tools | free aeo tools | A | Agency/Freelancer | BOFU | todo |
| n/a | 2026-12-24 | *(holiday, no post)* | | | | | | |
| 27 | 2026-12-29 | AEO Trends for 2027: What Agencies Should Plan For | aeo-trends-2027 | aeo trends 2027 | C | All | MOFU | todo |
| n/a | 2026-12-31 | *(holiday, no post)* | | | | | | |
| 28 | 2027-01-05 | Organization & Product Schema for AI Search: The Agency Fix Guide | organization-product-schema-ai-search | organization schema ai search | G | Agency | MOFU | todo |
| 26 | 2027-01-07 | Case Study #1: [Agency] Grows Client AI Visibility vs Competitors | case-study-1-slug-tbd | n/a | Proof | Agency | BOFU | todo (needs customer) |
| 29 | 2027-01-12 | Aeorch vs Manual AEO Audits: Time and Cost Compared | automated-vs-manual-aeo-audit | manual aeo audit | A | Agency/Freelancer | BOFU | todo |
| 30 | 2027-01-14 | "Isn't AEO Just SEO?" How to Handle 7 Client Objections | aeo-client-objections | aeo client objections | C | Agency | MOFU | todo |
| 31 | 2027-01-19 | AEO for Real Estate: An Agency Playbook | aeo-for-real-estate | aeo for real estate | E | Agency | MOFU | todo |
| 32 | 2027-01-21 | Why Your Competitor Shows Up in ChatGPT (and How to Catch Up) | competitor-shows-up-in-chatgpt | competitor in chatgpt | B | All | BOFU | todo |
| 33 | 2027-01-26 | Spy on Competitors' AI Setup: robots.txt, llms.txt and Schema | competitor-ai-crawler-setup | competitor llms.txt | B | Agency/In-house | MOFU | todo |
| 34 | 2027-01-28 | AEO KPIs: 8 Metrics Clients Actually Care About | aeo-kpis | aeo kpis | C | Agency/In-house | MOFU | todo |
| 35 | 2027-02-02 | AEO Retainer Scope of Work Template | aeo-scope-of-work-template | aeo scope of work | D | Agency/Freelancer | MOFU | todo |
| 36 | 2027-02-04 | Case Study #2: [Freelancer/Agency] AEO Win | case-study-2-slug-tbd | n/a | Proof | Freelancer | BOFU | todo (needs customer) |
| 37 | 2027-02-09 | AEO for Multi-Location and Franchise Brands | aeo-for-multi-location-brands | multi location aeo | E | Agency | MOFU | todo |
| 38 | 2027-02-11 | The Business Case for AEO: Getting Budget From Your CMO | aeo-business-case | aeo roi | F | In-house | MOFU | todo |
| 39 | 2027-02-16 | Content Formats AI Engines Cite Most (With Examples) | content-formats-ai-citations | content formats for ai search | G | All | MOFU | todo |
| 40 | 2027-02-18 | AEO Audit vs SEO Audit: Should Agencies Run Both? | aeo-audit-vs-seo-audit | aeo audit vs seo audit | C | Agency | BOFU | todo |
| 41 | 2027-02-23 | How to Get Client Sites Cited in Perplexity | get-cited-in-perplexity | how to rank in perplexity | G | All | MOFU | todo |
| 42 | 2027-02-25 | Case Study #3: In-House Team Closes Competitor Gap | case-study-3-slug-tbd | n/a | Proof | In-house | BOFU | todo (needs customer) |
| 43 | 2027-03-02 | How Often Should You Re-Audit AI Visibility? (Rescan Cadence Guide) | aeo-rescan-frequency | aeo monitoring frequency | B | Agency | MOFU | todo |
| 44 | 2027-03-04 | The 2027 AEO Tool Stack for Agencies | aeo-agency-tool-stack | aeo tool stack | A | Agency | BOFU | todo |
| 45 | 2027-03-09 | AEO for B2B Professional Services (Accountants, Consultants, IT) | aeo-for-professional-services | aeo for b2b | E | Agency | MOFU | todo |
| 46 | 2027-03-11 | How to Price a One-Time AEO Audit (Freelancer Guide) | one-time-aeo-audit-pricing | aeo audit pricing | F | Freelancer | BOFU | todo |
| 47 | 2027-03-16 | How to Get Cited in Google AI Mode and Gemini | google-ai-mode-citations | google ai mode optimization | G | All | MOFU | todo |
| 48 | 2027-03-18 | Freelancer's Guide to Starting an AEO Service | start-aeo-freelance-service | aeo freelancer | F | Freelancer | MOFU | todo |
| n/a | 2027-03-23 | *Buffer: publish the most-needed case study or a refresh from section 9* | | | | | | |
| n/a | 2027-03-25 | *Buffer* | | | | | | |

---

## 7. Post briefs

Each brief gives the angle, what the post must include, internal links, and the CTA. Aim for 1,500 to 2,500 words for BOFU and pillar posts and 1,200 to 1,800 for the rest, unless noted otherwise.

### Cluster A: Comparisons & alternatives

**#1 Best AEO Tools for Agencies in 2026**: *Pillar, 3,000+ words.* Judge each tool on what agencies care about: multi-client scale, competitor benchmarking, white-label, fix recommendations vs monitoring only, and price per client site. Include a comparison table with 8 to 10 tools: Aeorch, AEOChecker.ai, Otterly, Profound, Peec, AthenaHQ, Semrush, Ahrefs Brand Radar, Scrunch, WorkDuo. Add a "best for" line for each tool and a "how we evaluated" section. Aeorch is "best for audit, fix and client reporting on a budget." Link to #2, #6, #9, #12, #15, #18, #21 and white-label-aeo-reports-for-agencies. CTA: BOFU.

**#2 AEOChecker.ai Alternative**: Compare the two fairly. They are strong on prompt/mention tracking, sentiment and integrations. We are stronger on agency use: white-label PDF, competitor comparison, prioritized fixes, multi-site dashboard, and scoring across 5 areas. Include a feature table, pricing (checked on the day), a "choose AEO Checker if..." section, a "choose Aeorch if..." section, and a "use both" option. Link to #1 and compare-client-ai-visibility-against-competitors. CTA: BOFU.

**#6 Otterly AI Alternative** / **#9 Profound Alternative** / **#12 Peec AI Alternative** / **#15 AthenaHQ Alternative**: Use the same structure for all four: who the tool is for, where it is strong, where agencies hit limits (price per client, no fix list, no white-label, etc., but **only if verified**), a side-by-side table, and a price-per-client-site calculation (use the confirmed Agency site limit). Change the angle for each: Profound is enterprise, Peec and AthenaHQ are $245+/mo, and Otterly is a similarly priced tracker. CTA: BOFU.

**#18 Semrush AI Visibility Toolkit vs Aeorch** / **#21 Ahrefs Brand Radar vs Aeorch**: Angle: "You already pay for Semrush/Ahrefs. Do you need Aeorch?" Be honest that they are complementary. Their AI add-ons monitor visibility; Aeorch audits sites and gives agencies client-ready output. Include total cost for a 10-client agency. CTA: BOFU.

**#25 Free vs Paid AEO Tools**: What free tools do well (including our free llms.txt generator, the 20 free page credits every account gets, and AEOChecker's free check) and where agencies need paid features: competitors, white-label and multiple sites. Include a decision table. CTA: BOFU + free tool.

**#29 Aeorch vs Manual AEO Audits**: Break down the time for a manual audit (schema, robots, llms.txt, content structure, authority, competitors x 3), roughly 4 to 8 hours per client (label this as an estimate). Compare that with a scan. Show the cost at a $75 to $150 hourly rate. Include a calculator table. CTA: BOFU.

**#44 The 2027 AEO Tool Stack for Agencies**: Stack by job: audit and fix (Aeorch), prompt tracking, content, schema, and reporting. Show example stacks for a solo freelancer, a 5-person agency and a 20-person agency. CTA: BOFU.

### Cluster B: Competitor AEO benchmarking (our main differentiator)

Every post in this cluster links to the pillar **compare-client-ai-visibility-against-competitors**.

**#3 AI Share of Voice**: Define it, give the formula, and show how to measure it manually across ChatGPT, Perplexity, Gemini and AI Overviews with a prompt set. Explain its limits and how audit scores relate to it: scores predict whether you can be cited, share of voice measures whether you are. Link to #7 and #16. CTA: MOFU.

**#7 AEO Competitor Gap Analysis**: A step-by-step framework: pick competitors (link #16), scan all of them, compare the 5 scores, find structural gaps (schema, crawler access, llms.txt, answer formatting, authority), then turn them into a prioritized fix plan. Include a gap-matrix table and a walkthrough screenshot of the Aeorch comparison view. CTA: MOFU.

**#16 How to Choose Which Competitors to Track**: Business competitors vs "AI answer competitors" (the sites AI actually cites: directories, review sites, publishers). Show how to find them by running prompts and noting who is cited. Recommend 3 to 5 per client. CTA: MOFU.

**#22 AEO & GEO Score Benchmarks by Industry**: *Linkable asset, and it needs original data.* Aggregate anonymized Aeorch scan data by industry: median score, top-quartile score, most common failures. **Do not publish without real data.** If there is not enough, export anonymized stats from the scan database or scan a public sample (for example the top 50 sites in 10 industries) and explain the method. Add a downloadable chart. Promote it to agencies and newsletters. CTA: MOFU.

**#32 Why Your Competitor Shows Up in ChatGPT**: A high-intent pain point. List the 6 to 8 most common reasons (crawler access, entity clarity, schema, third-party mentions, answer-ready content, freshness) and how to check each against a competitor. Link to chatgpt-not-citing-client-site. CTA: BOFU.

**#33 Spy on Competitors' AI Setup**: How to check a competitor's robots.txt, llms.txt, schema types and AI plugin files, and what each finding means. Include a checklist. Link to how-to-write-llms-txt and unblock-ai-bots-robots-txt. CTA: MOFU (+ free llms.txt tool).

**#43 Rescan Cadence Guide**: General guidance only: how often scores change, and what should trigger a re-audit (site migration, redesign, content push, a competitor launch). Recommend monthly for retainers. Do not present automatic rescans or alerts as Aeorch features. Link to content-freshness-ai-search. CTA: MOFU.

### Cluster C: Agency growth & operations

**#5 How to Sell AEO Services to Existing SEO Clients**: Covers the upsell conversation, a script, and using a competitor scan as the "aha" moment. Link to aeo-retainer-pricing-guide and #20. CTA: MOFU.

**#10 The Competitor-Scan Pitch**: A cold or warm outreach process. Scan the prospect and 2 competitors, send a one-page white-label PDF, then book a call. Include email templates (3 variants) and follow-up timing. This is a strong BOFU post. CTA: BOFU.

**#20 How to Package AEO Services**: Three tiers (Audit only / Audit + Fix / Ongoing Monitoring + Competitor Reporting) with deliverables and suggested price ranges (labelled as examples). Link to aeo-retainer-pricing-guide and #35. CTA: BOFU.

**#27 AEO Trends for 2027**: For agencies: agentic browsing, AI Mode, commerce protocols, measurement changes, and consolidation among tools. Keep it grounded and cite sources. CTA: MOFU.

**#30 Handling Client Objections**: Seven objections, each with a response and proof point: "Isn't this just SEO?", "AI traffic is tiny", "We can't measure it", "Too early", and others. Link to aeo-vs-seo-differences and explaining-aeo-geo-scores-to-clients. CTA: MOFU.

**#34 AEO KPIs**: Eight metrics (AEO/GEO scores, share of voice, citation count, AI referral traffic in GA4, branded search lift, and more). Explain how to report each one and which ones clients actually care about. Include a GA4 setup snippet for AI referrers. CTA: MOFU.

**#40 AEO Audit vs SEO Audit**: What overlaps, what is new, and how to bundle them. Show that Aeorch covers both in one scan. CTA: BOFU.

### Cluster D: Templates & lead magnets

Each post has a **downloadable asset** (Google Sheet, Doc, or PDF) behind an optional email capture. Create the asset or add `<!-- ASSET: description -->` for the dev side.

- **#4 AEO Audit Template**: A sheet with 40 to 50 checks grouped by the 5 Aeorch categories. Mention that "Aeorch fills this in automatically." Link to complete-website-audit-checklist.
- **#8 AEO Proposal Template**: A proposal doc with sections for the competitor snapshot, findings, scope, timeline and pricing.
- **#11 AEO Client Onboarding Checklist**: Access, baseline scan, competitor selection, prompt set, and reporting cadence for the first 30 days.
- **#13 Competitor Benchmark Report Template**: A slide/PDF layout with sample commentary. Link to the agency-ai-visibility-reporting hub.
- **#17 AEO Monthly Report Template**: Sections, charts and a "what we fixed / what is next" narrative. Link to the hub and white-label-aeo-reports-for-agencies.
- **#35 AEO Scope of Work Template**: Deliverables, exclusions and acceptance criteria.

### Cluster E: Vertical playbooks

Use the same structure for each: why AI search matters for the industry, the prompts customers ask AI, which sites AI cites in that industry (directories, review sites), the top 8 fixes, and a sample competitor comparison. Link to local-seo-aeo-small-business where relevant. CTA: MOFU.
- **#14 Law firms**: legal directories and YMYL trust signals.
- **#19 Dental/medical**: YMYL, review sites and physician schema.
- **#24 Home services**: local, service-area pages and review volume.
- **#31 Real estate**: portals as AI answer competitors, and neighborhood content.
- **#37 Multi-location/franchise**: location pages at scale, consistent entity data, and the multi-site dashboard. Link to multi-site-ai-visibility-monitoring.
- **#45 B2B professional services**: expertise signals, thought leadership, and LinkedIn/third-party mentions.

### Cluster F: Freelancers & in-house

- **#23 In-house benchmarking**: Quarterly competitor benchmarking process and presenting it to leadership. Link to #13 and #38. CTA: MOFU (Starter plan).
- **#38 The business case for AEO**: A slide outline plus ROI framing and risk framing ("competitors are being cited instead of us"). CTA: MOFU.
- **#46 How to price a one-time AEO audit**: Pricing models (flat, tiered by site size, audit plus fix credit) and example ranges (labelled). Link to aeo-retainer-pricing-guide. CTA: BOFU (Starter to Agency).
- **#48 Freelancer's guide to starting an AEO service**: Positioning, first 3 clients, tools, templates (link all of Cluster D), and a path to retainers. CTA: BOFU.

### Cluster G: Fix guides

- **#28 Organization & Product schema for AI search**: JSON-LD examples, common errors, and how to validate. Link to the faq and howto schema guides.
- **#39 Content formats AI engines cite most**: Definition blocks, comparison tables, stat lists, step lists and FAQs, with before/after examples. Link to optimize-content-for-ai-citations.
- **#41 Getting cited in Perplexity**: How Perplexity sources work, freshness, and citation-friendly formatting. Mark any claim about how the engine works as observed, not official.
- **#47 Google AI Mode & Gemini**: Differences from AI Overviews and what to fix. Link to google-ai-overviews-seo.

### Proof: Case studies (#26, #36, #42)
**Needs real customer data and permission.** Structure: client situation, competitors, starting scores, fixes shipped, results (scores plus any traffic or citation data), and a quote. If there is no customer by the scheduled date, move the post back and publish a section 9 refresh in its slot. **Never invent results.**

---

## 8. Post template (use for every post)

This matches what `lib/blog.ts` and `app/blog/[slug]/page.tsx` actually read. Do not add other frontmatter fields: they are ignored. The slug is the filename (`content/blog/<slug>.md`). FAQPage JSON-LD is generated from the `faq:` array, so the FAQ lives in frontmatter, and the visible FAQ on the page is rendered from it too.

```markdown
---
title: "<H1>"
description: "<150 to 160 char meta description with primary keyword>"
publishedAt: "<YYYY-MM-DD>"
author: "Aeorch Team"
category: "<AEO|GEO|SEO|AI Compatibility|Authority>"
keywords:
  - "<primary keyword>"
  - "<secondary keyword>"
faq:
  - question: "<Question 1>"
    answer: "<2 to 4 sentence answer>"
  - question: "<Question 2>"
    answer: "<...>"
---

**TL;DR:** <40 to 60 word direct answer>

<Intro: problem framed for agencies, 2 to 3 short paragraphs>

## <Question-style H2>
...

<Table or checklist>

<!-- SCREENSHOT: Aeorch <view> showing <thing> -->

## How to do this with Aeorch
<3 to 5 steps, product-led but useful on its own>

<CTA block from section 3>

## Further Reading
- <3+ internal links from section 4 or earlier posts>
- <1 to 2 authoritative outbound links>
```

Before writing, open one existing post (for example `content/blog/what-is-aeo.md`) and confirm the heading and closing-section conventions it uses, then match them.

**Pre-publish checklist:**
- [ ] Primary keyword in the H1/title, first 100 words, filename and meta description
- [ ] TL;DR answer at the top
- [ ] At least one table or checklist
- [ ] `faq:` array present (2 to 4 items)
- [ ] 3+ internal links (section 4) and 1 to 2 authoritative outbound links
- [ ] Competitor facts checked and dated
- [ ] Only "safe to claim" product features mentioned (section 2)
- [ ] CTA matches the funnel stage
- [ ] No emojis, no em or en dashes anywhere
- [ ] `llms.txt` spelled with an "s" everywhere
- [ ] `npm run lint` and `npm run build` pass (the build also regenerates `public/llms.txt`)
- [ ] Section 6 status updated; older related posts updated to link to this one

---

## 9. Refresh queue (existing posts)

Do these in buffer slots or alongside new posts:

1. **seo-aeo-geo-guide**: Retitle to "SEO vs AEO vs GEO: The Complete 2026 Guide". Update the examples and add an agency section plus links to #1 and #7. Also change `llm.txt` to `llms.txt`.
2. **ai-ready-website**: Update to 2026/2027 and add AI Mode and agentic browsing.
3. **what-is-aeo**: Add a "for agencies" section and link to #5 and #1.
4. **compare-client-ai-visibility-against-competitors**: Upgrade into the **Cluster B pillar**. Expand it, and link to #3, #7, #16, #22, #32, #33 and #43 as they go live.
5. **agency-ai-visibility-reporting**: Make it the reporting hub. Link to #13, #17 and #34.

---

## 10. Measurement

Review monthly and log results here.

| Metric | Source | Target (6 mo) |
|---|---|---|
| Free scans started from blog | Analytics event with `utm_source=blog` / referrer | Set a baseline in month 1 |
| Signups (Starter/Agency) attributed to blog | Analytics / billing | Set a baseline |
| Template downloads (Cluster D) | Form/asset events | Set a baseline |
| Rankings for BOFU keywords (Cluster A) | Search Console | Top 10 for 5+ "alternative" keywords |
| AI citations of aeorch.com | Manual prompt checks in ChatGPT, Perplexity and Gemini (monthly) | Cited for 3+ agency AEO queries |
| AI referral sessions | GA4 (chatgpt.com, perplexity.ai, gemini.google.com referrers) | Growing month over month |

**Tracking setup for the dev side:** Add UTM parameters to all blog CTAs (`utm_source=blog&utm_medium=cta&utm_campaign=<slug>`), fire a `scan_started` event with the referring post, and set up a GA4 channel group for AI referrers.

---

## 11. Decisions log and open items

**Resolved (2026-09-19):**
- Publishing: weekly PR containing that week's posts; all go live at merge (see section 1).
- `llms.txt` vs `llm.txt`: treated as equivalent by the audit; copy standardized on `llms.txt`. Shipped as separate PRs (backend `fix/llms-txt-naming`, frontend `fix/llms-txt-naming`).
- Pricing page free-plan FAQ corrected to the 20 free credits (same frontend PR).
- Agency plan: 15 sites and 5 team seats. Note: the backend has no plan-to-limit mapping; `siteLimit`/`seatLimit` are set per org through `PATCH /admin/organizations/:id/plan`, and the schema default `seatLimit` is 3.

**Still open:**
- **Marketing copy claims:** the pricing and landing pages list regression alerts, monthly re-scans and score history. Confirm which exist, or remove the claims.
- **Case studies:** need real customers, permission and data.
- **Benchmarks (#22):** need an anonymized data export or a public-sample scan.
- **Screenshots and assets:** template downloads (Cluster D) and product screenshots need to be produced.

---

*Plan created 2026-09-19, revised the same day after owner review. Competitor info was gathered from public pages on that date; check it again before publishing.*
