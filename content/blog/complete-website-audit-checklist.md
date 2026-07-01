---
title: "The Complete SEO, AEO, GEO Audit Checklist"
description: "A single checklist covering SEO, AEO, GEO, Authority, and AI Compatibility — five dimensions, one scan, ranked by what to fix first."
publishedAt: "2026-06-28"
author: "Aeorch Team"
category: "SEO"
keywords:
  - "complete website audit checklist"
  - "seo aeo geo checklist"
  - "website audit five dimensions"
  - "ai compatibility checklist"
  - "full site audit tool"
  - "seo aeo geo authority checklist"
faq:
  - question: "What are the five dimensions of a complete website audit?"
    answer: "SEO (search engine ranking fundamentals), AEO (answer engine extractability via schema and structure), GEO (generative engine trust via depth, authorship, and citations), Authority (trust pages and credibility signals), and AI Compatibility (crawler access and AI-specific discovery files)."
  - question: "Do I need to fix all five dimensions at once?"
    answer: "No — prioritize by severity. Blocked AI crawlers (AI Compatibility) and missing title tags or broken canonicals (SEO) tend to be the highest-impact, gating issues to fix first, before refining AEO schema or GEO depth signals."
  - question: "How long does a full five-dimension audit take?"
    answer: "Manually, it can take hours per page across dozens of checks. An automated scanner like Aeorch checks all five dimensions across your whole site in minutes, returning a prioritized fix list."
  - question: "Is this checklist a one-time task or ongoing?"
    answer: "Ongoing. Site redesigns, CMS migrations, and new content can silently reintroduce previously-fixed issues — re-running the full checklist quarterly, and after any major change, catches regressions before they compound."
---

A complete website audit covers five distinct dimensions — SEO, AEO, GEO, Authority, and AI Compatibility — each measuring a different system's criteria for finding, extracting, trusting, and citing your content. This checklist walks through all five, links to a dedicated deep-dive for each item, and tells you what to fix first.

## Why Five Dimensions, Not One

Search engines, AI answer engines, and generative models don't evaluate content identically. A page can rank well in Google (SEO) while being invisible to ChatGPT (blocked by robots.txt — an AI Compatibility failure) and unlikely to be referenced by Perplexity (no authorship or citations — a GEO gap). Auditing only one dimension leaves the others as blind spots, and each has grown into a real traffic and visibility channel in its own right.

## Dimension 1: SEO (Search Engine Optimization)

The foundation everything else builds on. Core items:

- [ ] Robots.txt allows Googlebot and Bingbot
- [ ] XML sitemap is valid and lists canonical URLs
- [ ] Every page has a unique title tag and meta description
- [ ] Canonical tags prevent duplicate-content dilution
- [ ] One clear H1 per page
- [ ] Core Web Vitals pass thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Site is mobile-friendly and HTTPS throughout
- [ ] No broken internal links or long redirect chains

→ Full detail: [Technical SEO Checklist for 2026 (15 Items)](/blog/technical-seo-checklist-2026) and [SEO Rank Checker: See Where You Rank for Free](/blog/seo-rank-checker)

## Dimension 2: AEO (Answer Engine Optimization)

Whether ChatGPT, Perplexity, and Google AI Overviews can extract your content as a direct answer:

- [ ] FAQPage schema on genuine Q&A content, matching visible text exactly
- [ ] HowTo schema on sequential, instructional content
- [ ] Article schema with author and date on content pages
- [ ] Headings phrased as questions ("What is...", "How to...")
- [ ] Direct answers stated in the first 1-2 sentences after a question heading

→ Full detail: [What is AEO (Answer Engine Optimization)?](/blog/what-is-aeo), [How to Add FAQ Schema Markup](/blog/faq-schema-markup-guide), [HowTo Schema Markup: A Complete AEO Guide](/blog/howto-schema-markup-guide), and [10 Common AEO Mistakes Hurting Your AI Visibility](/blog/common-aeo-mistakes)

## Dimension 3: GEO (Generative Engine Optimization)

Whether LLMs trust your content enough to reference it when generating an answer:

- [ ] Substantive content depth (300+ words on key pages)
- [ ] Named authorship on every content page
- [ ] Visible and machine-readable publication/update dates
- [ ] At least one external citation to a credible source per substantive page
- [ ] Clear, fluent writing — direct statements, not keyword-stuffed phrasing

→ Full detail: [What Is GEO? A Beginner's Guide to AI Search](/blog/what-is-geo), [What Is a GEO Score? Your AI Ranking Explained](/blog/what-is-geo-score), and [How to Improve Your GEO Score: 9 Tactics](/blog/improve-geo-score)

## Dimension 4: Authority

Whether your site presents as a credible, real organization worth citing:

- [ ] About, Contact, and Privacy pages exist with real, specific information
- [ ] Organization or Person schema is present
- [ ] Author bios include a credibility statement (role, expertise)
- [ ] External validation exists — mentions or links from credible sites in your industry

→ Full detail: [Website Authority Checker: What It Measures](/blog/website-authority-checker) and [What Are AI Citations and Why They're the New Backlinks](/blog/ai-citations-new-backlinks)

## Dimension 5: AI Compatibility

Whether AI crawlers can technically reach and read your content at all — often the highest-leverage fix since it gates everything else:

- [ ] Robots.txt explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, and Google-Extended
- [ ] Key content is present in raw HTML, not requiring JavaScript execution to render
- [ ] No login wall in front of content you want cited
- [ ] A `llms.txt` file exists at your domain root

→ Full detail: [Is Your Site Blocked From GPTBot or ClaudeBot?](/blog/check-ai-crawler-access), [How to Unblock GPTBot and ClaudeBot in Robots.txt](/blog/unblock-ai-bots-robots-txt), [How to Write an llms.txt File](/blog/how-to-write-llms-txt), and [How to Make Your Website AI-Ready (Checklist)](/blog/ai-ready-website)

## What to Fix First

Not all 20+ items above carry equal weight. In order of typical impact:

1. **AI Compatibility crawler access** — a blocked bot makes every other AEO/GEO fix on that page irrelevant to that engine
2. **SEO indexability basics** — missing titles, broken canonicals, robots.txt issues affecting Google/Bing
3. **AEO schema on your highest-traffic pages** — FAQPage and Article schema where it matters most first
4. **GEO authorship and dates** — same-day fixes with broad impact
5. **Authority trust pages** — foundational credibility, often already partially in place
6. **GEO depth and citations** — the most content-intensive item, worth doing deliberately rather than all at once

## Running All Five Checks in One Scan

Working through this checklist manually across every page of a real site takes hours, and needs repeating after every redesign or migration. [Aeorch's free scanner](/scan) runs all five dimensions in a single pass — enter your URL, and get a 0-100 score for SEO, AEO, GEO, Authority, and AI Compatibility, with every item above checked automatically and ranked by severity.

The free plan covers 20 pages per month, enough to fully audit most small-to-mid-sized sites.

## Key Takeaways

- A complete audit covers five distinct dimensions: SEO, AEO, GEO, Authority, and AI Compatibility
- AI Compatibility (crawler access) is the highest-leverage fix, since it gates whether any other signal even reaches the engine in question
- Re-run the full checklist quarterly and after any site redesign, since regressions are common and easy to miss manually

## Further Reading

- [SEO vs AEO vs GEO: The Complete Guide](/blog/seo-aeo-geo-guide)
- [Google Search Central: Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [llmstxt.org: the llms.txt standard](https://llmstxt.org)

[Run the full five-dimension scan on your site now →](/scan)
