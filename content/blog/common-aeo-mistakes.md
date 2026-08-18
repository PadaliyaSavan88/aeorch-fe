---
title: "10 Common AEO Mistakes Hurting Your AI Visibility"
description: "From blocked AI crawlers to hidden FAQ schema, here are 10 AEO mistakes that quietly prevent AI answer engines from citing your content."
publishedAt: "2026-06-06"
author: "Aeorch Team"
category: "AEO"
keywords:
  - "aeo mistakes"
  - "common aeo errors"
  - "why isn't chatgpt citing my site"
  - "aeo audit issues"
  - "answer engine optimization mistakes"
faq:
  - question: "Why isn't ChatGPT citing my website at all?"
    answer: "The most common causes, in order: robots.txt blocking GPTBot/OAI-SearchBot entirely, content requiring JavaScript to render (which some crawlers don't execute), or simply no FAQPage/Article schema giving the engine a clean structure to extract from."
  - question: "Can too much schema markup hurt AEO?"
    answer: "Invalid or mismatched schema (JSON-LD that doesn't match visible page content) can hurt more than having none, since it signals unreliability. Valid, accurate schema doesn't have a downside from having 'too much' of it."
  - question: "Is it a mistake to only optimize for Google and ignore AEO?"
    answer: "Given AI-driven queries are a fast-growing share of how people find information, treating AEO as optional increasingly means ceding an entire visibility channel to competitors who have addressed it."
---

Most AEO failures aren't about content quality — they're structural mistakes that silently prevent an otherwise good page from ever reaching an AI answer engine, or from being extracted cleanly once it does. Here are ten of the most common.

## 1. Blocking AI Crawlers in Robots.txt

The single most damaging mistake: a `Disallow: /` rule (explicit or via wildcard) blocking GPTBot, ClaudeBot, or PerplexityBot entirely. No other AEO fix matters if the crawler can't reach the page.

## 2. No FAQPage Schema on Genuine Q&A Content

Pages that clearly answer specific questions in prose, without the corresponding FAQPage JSON-LD, leave AI engines to infer structure that could have been stated explicitly.

## 3. FAQ Schema That Doesn't Match Visible Text

Writing more thorough answers in JSON-LD than what's actually shown on the page violates Google's guidelines and looks unreliable to any system evaluating trustworthiness.

## 4. Headings That Don't Match How People Ask Questions

"Our Services" instead of "What services do we offer?" — generic headings miss the direct match to how conversational queries are phrased.

## 5. Burying the Answer Below the Fold (Content-Wise)

Leading with a scene-setting introduction before stating the actual answer makes extraction harder. AI summarization favors content with the direct answer stated early.

## 6. Content That Requires JavaScript to Render

If key content only appears after client-side JavaScript executes, crawlers that don't run JS see an empty shell — invisible in a normal browser, but a real blocker for some AI systems.

## 7. No Author Attribution

Anonymous content gives an AI model no credibility anchor — this is technically a GEO signal, but it compounds with AEO's structural signals to affect overall citation likelihood.

## 8. Treating HowTo Schema as Optional for Tutorials

Sequential, step-by-step content without HowTo markup leaves the step structure to be inferred rather than stated explicitly.

## 9. Ignoring llms.txt

Not yet required, but an increasingly common convenience convention — its absence means AI assistants have to infer your site structure through crawling alone rather than a quick, curated summary.

## 10. Never Re-Checking After Site Changes

A redesign, CMS migration, or new robots.txt template can silently reintroduce a crawler block or strip schema that was previously in place. Treating AEO as a one-time project rather than an ongoing check is itself a mistake.

## Fixing These Systematically

Most of these are structural and checkable — they don't require rewriting your content, just correcting configuration and markup. [Aeorch's scanner](/scan) checks all ten categories above in a single scan and returns a prioritized fix list ranked by severity.

## Key Takeaways

- Blocked AI crawlers and hidden-content schema mismatches are the most damaging, highest-priority fixes
- Most AEO mistakes are structural (schema, robots.txt, rendering) rather than content-quality issues
- Re-check after any site redesign or migration — these commonly reintroduce previously-fixed issues

## Further Reading

- [What is AEO (Answer Engine Optimization)?](/blog/what-is-aeo)
- [How to Add FAQ Schema Markup (Step-by-Step)](/blog/faq-schema-markup-guide)
- [Is Your Site Blocked From GPTBot or ClaudeBot?](/blog/check-ai-crawler-access)
- [schema.org: HowTo](https://schema.org/HowTo)

Catch all of these in one pass with the [complete SEO, AEO, GEO audit checklist](/blog/complete-website-audit-checklist).
