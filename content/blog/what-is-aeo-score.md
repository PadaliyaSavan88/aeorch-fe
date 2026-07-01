---
title: "What Is an AEO Score and How Is It Calculated?"
description: "An AEO score (0-100) measures FAQPage schema, question headings, HowTo markup, and AI bot access. Here's exactly how each factor is weighted."
publishedAt: "2026-03-23"
author: "Aeorch Team"
category: "AEO"
keywords:
  - "aeo score"
  - "how is aeo score calculated"
  - "aeo scoring"
  - "answer engine optimization score"
  - "aeo rating"
faq:
  - question: "What is a good AEO score?"
    answer: "80 or above generally indicates strong FAQPage/HowTo/Article schema coverage and unblocked AI crawler access. Below 50 usually points to a structural issue like blocked bots or missing schema across most pages, rather than a content quality problem."
  - question: "Does AEO score affect Google ranking?"
    answer: "Not directly for classic Google Search — but many AEO signals (schema markup, clear headings) also help traditional SEO, so improving one often improves the other indirectly."
  - question: "Can a small site have a high AEO score?"
    answer: "Yes. AEO score isn't about site size or traffic — it's about whether the pages you do have are structured with the right schema and accessible to AI crawlers. A five-page site with correct FAQPage markup can outscore a thousand-page site without it."
  - question: "How often does AEO score change?"
    answer: "It changes whenever you add, remove, or restructure content or schema, or when robots.txt rules change. It doesn't fluctuate on its own the way search rankings can — it's a direct reflection of your site's current state."
---

An AEO score is a 0-100 measure of how well your website is structured for AI answer engines to extract and cite. Unlike a search ranking, it isn't personalized or volatile — it's a direct reflection of testable signals on your site today. Here's what goes into the number.

## The Five Signals Behind an AEO Score

| Signal | What's checked | Typical weight |
|---|---|---|
| FAQPage schema | Presence and validity of FAQPage JSON-LD on Q&A content | High |
| Question-based headings | H2/H3 tags phrased as questions ("What is...", "How to...") | Medium |
| HowTo schema | Structured markup on instructional/step-by-step content | Medium |
| Article schema | Author, headline, and date markup on content pages | Medium |
| AI bot access | robots.txt rules for GPTBot, ClaudeBot, PerplexityBot, etc. | High (gating) |

AI bot access is weighted as a gating factor rather than a simple additive one: if a major AI crawler is fully blocked, it caps how high your score can go regardless of how well everything else is structured, since a blocked crawler can't read any of it.

## Why Some Signals Matter More Than Others

FAQPage schema and AI bot access carry more weight because they're binary, high-impact gates — either the schema is valid and present, or an answer engine has literally nothing to extract from that page; either a bot is allowed, or it can't reach your site at all. Question-based headings and HowTo/Article schema are treated as strong-but-partial signals: they help, but their absence doesn't zero out a page's score the way a full crawler block does.

## Worked Example

Consider a blog with 20 pages:
- 15 pages have clear Article schema and question-based H2s → strong baseline
- 8 of those 15 also have FAQPage schema on genuinely Q&A-shaped content → high-value bonus
- robots.txt fully allows GPTBot, ClaudeBot, and PerplexityBot → no gating penalty

This site would likely score in the 70s-80s: strong structural coverage, no blocking issue, but room to add FAQPage schema to the remaining pages that would benefit from it.

Contrast that with a site that has excellent schema everywhere but blocks GPTBot entirely — that one gating issue could hold the score in the 30s-40s regardless of how good everything else is, because the blocked engine can't access any of it.

## How to Calculate Yours

Manually checking schema validity and crawler rules across every page doesn't scale. [Aeorch's free scanner](/scan) computes this automatically: it crawls your site, validates schema against Schema.org specs, checks robots.txt against major AI bots, and returns your AEO score with the specific pages and issues holding it back.

## Key Takeaways

- AEO score combines FAQPage/HowTo/Article schema, question-based headings, and AI bot access
- Bot access acts as a gating factor — a full block caps your score regardless of other signals
- The score is deterministic and directly tied to your site's current state, not personalized or volatile like search rankings

## Further Reading

- [Schema.org FAQPage specification](https://schema.org/FAQPage)
- [What is AEO (Answer Engine Optimization)?](/blog/what-is-aeo)
- [Free AEO Checker: Audit Your Answer Engine Score](/blog/free-aeo-checker)

See how your AEO score fits alongside SEO, GEO, and Authority in the [complete audit checklist](/blog/complete-website-audit-checklist).
