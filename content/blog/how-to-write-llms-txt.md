---
title: "How to Write an llms.txt File (With Examples)"
description: "llms.txt is a plain-text index of your site for AI assistants. Here's the exact format, a real example, and where to host it."
publishedAt: "2026-04-22"
author: "Aeorch Team"
category: "AI Compatibility"
keywords:
  - "llms.txt file example"
  - "how to create llms.txt"
  - "llms.txt format"
  - "llms.txt standard"
  - "llm.txt vs llms.txt"
  - "ai discovery file website"
faq:
  - question: "Is it llm.txt or llms.txt?"
    answer: "The correct, community-adopted convention is llms.txt (with an 's'), as defined at llmstxt.org. Some earlier informal references used llm.txt without the 's', but llms.txt is the standard name to use."
  - question: "Where do I host my llms.txt file?"
    answer: "At the root of your domain — yourdomain.com/llms.txt — the same convention as robots.txt and sitemap.xml, so AI assistants and crawlers can find it at a predictable location without discovery."
  - question: "Is llms.txt required for AI crawlers to read my site?"
    answer: "No, it's not required — crawlers can still fetch and read your pages without it. llms.txt is a convenience file that gives AI assistants a fast, structured summary instead of requiring them to crawl and infer your site structure themselves."
  - question: "Do I need to update llms.txt manually every time I publish content?"
    answer: "You can, but it's better to automate it — generate the file from your CMS or blog directory as part of your build process so it's always current without manual upkeep."
---

`llms.txt` is a plain-text file, hosted at your domain's root, that gives AI assistants a structured summary of your site — its purpose and a list of key pages with one-line descriptions — without requiring them to crawl and infer that structure themselves. Here's the exact format and a real working example.

## The Format

The convention, defined at [llmstxt.org](https://llmstxt.org), is Markdown-based:

```
# Site Name

> One or two sentence summary of what the site is and does.

## Section Name

- [Page Title](https://example.com/page): One-sentence description.
- [Another Page](https://example.com/other): One-sentence description.

## Another Section

- [Page](https://example.com/page2): Description.
```

The H1 is your site name, the blockquote is a short overall summary, and each H2 groups related pages with markdown links and one-line descriptions.

## A Real Example

Here's a trimmed version of Aeorch's own `llms.txt`:

```
# Aeorch

> Free SEO, AEO, GEO, Authority and AI Compatibility audit tool. Scan any website and get a scored report with actionable fixes.

## Product

- [https://aeorch.com/](https://aeorch.com/): Free SEO, AEO, GEO, Authority and AI Compatibility audit tool.
- [https://aeorch.com/scan](https://aeorch.com/scan): Run a free audit of any website.

## Blog

### AEO

- [What Is AEO?](https://aeorch.com/blog/what-is-aeo): What Answer Engine Optimization is and why it matters.
```

## Where to Host It

Place the file at `yourdomain.com/llms.txt` — root level, same as `robots.txt` and `sitemap.xml`. This predictable location is the entire point of the convention: an AI assistant checks one known path instead of needing site-specific discovery logic.

## Keeping It Current Without Manual Work

Manually updating `llms.txt` every time you publish a new page doesn't scale. The more durable approach is generating it automatically as part of your build process — a script that reads your content directory (blog posts, key pages) and regenerates the file with current titles and descriptions every time you deploy, so it never goes stale.

## What to Include (and What Not To)

Include your most important, evergreen pages — homepage, core product/feature pages, and your blog index grouped by category. Don't include every single page on a large site indiscriminately; the value of `llms.txt` is a curated, high-signal summary, not a full sitemap duplicate (that's what `sitemap.xml` is already for).

## Checking Whether You Have One

Not sure if your site already has this? Visit `yourdomain.com/llms.txt` directly, or run a check with [Aeorch's scanner](/scan), which flags whether the file exists as part of your AI Compatibility score.

## Key Takeaways

- llms.txt (with an 's') is the correct convention, hosted at your domain root as plain Markdown
- Format: H1 site name, blockquote summary, H2 sections with markdown-linked pages and one-line descriptions
- Automate generation as part of your build process so it stays current without manual upkeep

## Further Reading

- [llmstxt.org: the llms.txt standard](https://llmstxt.org)
- [How to Make Your Website AI-Ready (Checklist)](/blog/ai-ready-website)
- [AI Search Visibility Checker for ChatGPT & Claude](/blog/ai-search-visibility-checker)

Check for llms.txt alongside every other AI Compatibility signal in the [complete audit checklist](/blog/complete-website-audit-checklist).
