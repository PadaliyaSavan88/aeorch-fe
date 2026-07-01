---
title: "How to Make Your Website AI-Ready (Checklist)"
description: "A step-by-step guide to making your website discoverable by ChatGPT, Perplexity, Claude and Gemini. Covers llms.txt, robots.txt, and schema markup."
publishedAt: "2025-03-18"
author: "Aeorch Team"
category: "AI Compatibility"
keywords:
  - "how to optimize website for answer engines"
  - "make website ai ready"
  - "llms.txt file"
  - "ai plugin json"
  - "how to improve aeo score"
  - "website ai compatibility"
  - "seo audit tool"
faq:
  - question: "What makes a website 'AI-ready'?"
    answer: "A site that AI crawlers can access (robots.txt allows GPTBot, ClaudeBot, PerplexityBot), that exposes a llms.txt summary file, and that has structured data (FAQPage, Article, HowTo schema) so AI models can confidently extract and cite it."
  - question: "Do I need both llms.txt and ai-plugin.json?"
    answer: "llms.txt is the higher-priority file today — it's a widely adopted convention AI assistants check for a quick site summary. ai-plugin.json matters mainly if you expose an API that AI agents can call directly."
  - question: "How do I know if my site is already AI-ready?"
    answer: "Run a free scan at Aeorch (/scan). It checks robots.txt AI bot access, llms.txt presence, structured data, and content depth in one pass and returns a prioritized fix list."
---

## What Does "AI-Ready" Mean for a Website?

An **AI-ready website** is one that:

1. Can be crawled and read by AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.)
2. Provides AI-specific discovery files (`llms.txt`, `ai-plugin.json`)
3. Has structured content that AI can confidently extract and cite
4. Has enough trust signals for LLMs to reference it as a credible source

In 2025, being AI-ready is no longer optional. Perplexity AI serves over 100 million queries per day. Google's AI Overviews appear in the majority of US searches. OpenAI's [GPTBot](https://platform.openai.com/docs/gptbot) and Anthropic's ClaudeBot actively crawl the web for training and citation data. AI-powered search tools now account for a growing percentage of informational traffic, and that share increases every month.

## Step 1: Check Your robots.txt for AI Bot Blocks

Many websites accidentally block AI crawlers. Open your `robots.txt` file (at `yourdomain.com/robots.txt`) and check for `Disallow` rules affecting:

- `GPTBot` (OpenAI / ChatGPT)
- `ClaudeBot` (Anthropic / Claude)
- `Google-Extended` (Google AI training)
- `PerplexityBot` (Perplexity AI)
- `FacebookBot` (Meta AI)
- `Amazonbot` (Amazon Alexa)
- `anthropic-ai`
- `CCBot`
- `ChatGPT-User`
- `cohere-ai`

If you see `Disallow: /` under any of these user-agents, those AI engines cannot access your site.

To allow all AI bots while still blocking human scrapers, add:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /
```

## Step 2: Create an llms.txt File

`llms.txt` is an emerging standard (similar to `robots.txt` but for LLMs) that tells AI models which content on your site is most important and how to summarize it.

Place a file at `yourdomain.com/llms.txt` with the following structure:

```
# Site: Your Website Name
# Description: What your website is about

## Main Pages
- /: Homepage — main overview of your products/services
- /about: About page — company background and team

## Articles & Guides
- /blog/guide-1: Title of guide — brief description
- /blog/guide-2: Title of guide — brief description
```

Aeorch auto-generates a complete `llms.txt` file from your crawled pages, ready to download and upload to your domain.

## Step 3: Add an ai-plugin.json File

`ai-plugin.json` (used by OpenAI's plugin system and adopted by other AI tools) helps AI agents understand what APIs and capabilities your site exposes.

Place it at `yourdomain.com/.well-known/ai-plugin.json`:

```json
{
  "schema_version": "v1",
  "name_for_human": "Your Brand Name",
  "name_for_model": "yourbrand",
  "description_for_human": "What your site does",
  "description_for_model": "Brief description for the AI model",
  "auth": { "type": "none" },
  "api": { "type": "openapi", "url": "/openapi.json" },
  "logo_url": "https://yourdomain.com/logo.png",
  "contact_email": "contact@yourdomain.com",
  "legal_info_url": "https://yourdomain.com/privacy"
}
```

Aeorch generates this file automatically from your scan results.

## Step 4: Add FAQPage Schema Markup

AI answer engines actively look for FAQPage structured data to extract Q&A content. Add this JSON-LD to any page with questions and answers:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is [your topic]?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Your concise answer here..."
    }
  }]
}
</script>
```

## Step 5: Add Open Graph Tags to Every Page

AI tools that crawl your site use OG tags to understand page context. Every page should have:

```html
<meta property="og:title" content="Your Page Title" />
<meta property="og:description" content="A clear description" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/page" />
```

## Step 6: Add Author Attribution and Dates

LLMs are more likely to cite pages that have clear author attribution and publication dates. For every content page:

- Add an author name (real person or organization)
- Add a publication date
- Add a "last updated" date where relevant
- Use `Article` or `BlogPosting` schema to mark this up

## Step 7: Ensure Sufficient Content Depth

AI models avoid citing thin content. Each substantive page should:

- Contain at least 300 words of original content
- Open with a clear definitional sentence ("What is X" or "How to Y")
- Include at least one statistic or specific data point
- Reference at least one external authoritative source

## The AI-Ready Website Checklist

Use this checklist to audit your site:

- [ ] robots.txt allows major AI bots
- [ ] llms.txt file exists at root
- [ ] ai-plugin.json exists at /.well-known/
- [ ] FAQPage schema on Q&A pages
- [ ] Open Graph tags on all pages
- [ ] Article schema on blog posts
- [ ] Author attribution on content pages
- [ ] Publication dates on all articles
- [ ] Minimum 300 words on key pages
- [ ] External citations where relevant
- [ ] About, Contact, Privacy pages exist

## Automate the Audit with Aeorch

Checking all of these manually across every page of your website is tedious. Aeorch automates the entire checklist in a single scan:

1. Enter your URL
2. Get a score for each dimension (SEO, AEO, GEO, AI Compatibility, Authority)
3. Download your auto-generated `llms.txt` and `ai-plugin.json` files
4. Get a prioritized list of issues to fix

The free plan covers 20 pages per month — enough to audit most small websites completely.

## Further Reading

- [OpenAI GPTBot: usage policies and documentation](https://platform.openai.com/docs/gptbot)
- [Anthropic: ClaudeBot and web crawling](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-the-web-and-how-can-site-owners-block-the-crawler)
- [llmstxt.org: the llms.txt standard](https://llmstxt.org)
- [Google Search Central: robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)

For unblocking specific AI crawlers step-by-step, see [how to unblock GPTBot and ClaudeBot in robots.txt](/blog/unblock-ai-bots-robots-txt), or check the [complete SEO, AEO, GEO audit checklist](/blog/complete-website-audit-checklist) for the full picture.
