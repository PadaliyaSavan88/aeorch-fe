---
title: "What to Tell a Client When ChatGPT Doesn't Cite Their Site"
description: "A script for explaining to a client why ChatGPT or Perplexity isn't citing their site, grounded in the actual technical causes, not a shrug."
publishedAt: "2026-07-06"
author: "Aeorch Team"
category: "AEO"
keywords:
  - "chatgpt not citing my website"
  - "why isn't my site in chatgpt"
  - "ai search visibility client question"
  - "perplexity not citing site"
  - "explain aeo to clients"
  - "ai citation troubleshooting"
faq:
  - question: "Why would ChatGPT never cite a site at all?"
    answer: "Most commonly a blocked crawler: robots.txt disallowing GPTBot or OAI-SearchBot means the content was never indexed by that engine in the first place. This is the first thing to check, since every other fix is irrelevant if the crawler can't reach the page."
  - question: "Is being cited by ChatGPT the same as ranking in Google?"
    answer: "No. Ranking in Google means matching a query well enough to appear in a results list. Citation in a generative answer means the model chose to quote or paraphrase the page while composing a response, a different mechanism with different signals: structured data, clarity, and trust markers matter more than backlink volume."
  - question: "Can a site be AI-visible even with zero ChatGPT citations right now?"
    answer: "Yes. Citations are visible outcomes, not the only signal worth tracking. A site with clean crawler access, correct schema, and strong content depth is well-positioned even before a specific citation appears, since citation timing depends on the model's training and retrieval behavior, not just the site's readiness."
---

When a client asks why ChatGPT doesn't cite their site, the honest answer is almost always one of three causes: a blocked AI crawler, missing structured data the model needs to extract a clean answer, or content too thin to be worth quoting. Diagnosing which one applies beats reassurance every time.

## The Question Behind the Question

When a client asks "why doesn't ChatGPT mention us," they're really asking whether the agency understands a channel they've started noticing matters. A vague answer ("AI is still new, it takes time") sounds like a dodge. A specific answer ("here's exactly what's blocking it, and here's the fix") sounds like expertise. The difference is diagnosis, not reassurance.

## The Three Most Common Causes

- **Blocked crawler**: `robots.txt` disallowing GPTBot, OAI-SearchBot, or ChatGPT-User means the content was never indexed by that engine. Nothing else on this list matters until this is checked first.
- **Missing structured data**: without FAQPage, Article, or HowTo schema, the model has to infer structure from prose instead of extracting a clean, quotable answer, which lowers the odds it gets picked over a competitor's more clearly marked-up page.
- **Thin or generic content**: pages under roughly 300 words, with no definitional opening sentence and no external citations, give a generative model little worth quoting directly.

## Answer Box: How Do You Diagnose Which Cause Applies?

Check crawler access first, since it's binary and rules out everything else in one step. If the crawler can reach the page, check for structured data next, since that's the highest-leverage fix for the lowest effort. Only after both of those are confirmed clean does content depth become the likely explanation, and that's the slowest fix of the three to execute.

## Why "It Takes Time" Isn't a Real Answer

Generative engines don't run on the same lag Google's index does. A site with a blocked crawler will never be cited no matter how much time passes, because the block is not a timing problem, it's an access problem. Telling a client to wait when the actual issue is a one-line robots.txt rule wastes a month of goodwill on a fix that takes five minutes once identified.

## Key Takeaways

- Diagnose before reassuring: crawler access, then structured data, then content depth, in that order
- A blocked crawler is the most common cause and the fastest to fix once found
- "It takes time" is the wrong answer when the actual cause is a fixable technical block

## Further Reading

- [Is Your Site Blocked From GPTBot or ClaudeBot?](/blog/check-ai-crawler-access)
- [How to Add FAQ Schema Markup (Step-by-Step)](/blog/faq-schema-markup-guide)
- [schema.org: FAQPage](https://schema.org/FAQPage)

Diagnose all three causes in one pass with the [complete SEO, AEO, GEO audit checklist](/blog/complete-website-audit-checklist).
