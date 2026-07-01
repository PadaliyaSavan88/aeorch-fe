---
title: "Is Your Site Blocked From GPTBot or ClaudeBot?"
description: "A three-minute manual check plus a free automated way to see if GPTBot, ClaudeBot, or PerplexityBot are blocked from crawling your website."
publishedAt: "2026-03-08"
author: "Aeorch Team"
category: "AI Compatibility"
keywords:
  - "check ai crawler access"
  - "is my site blocked from chatgpt"
  - "gptbot blocked"
  - "claudebot access check"
  - "ai bot robots.txt check"
  - "perplexitybot blocked"
faq:
  - question: "How do I check if GPTBot is blocked on my site?"
    answer: "Visit yourdomain.com/robots.txt and look for a 'User-agent: GPTBot' block. If it's followed by 'Disallow: /', GPTBot is fully blocked. No mention of GPTBot at all usually means it's allowed by default, unless a wildcard 'User-agent: *' rule disallows everything."
  - question: "Why would robots.txt accidentally block AI bots?"
    answer: "Most robots.txt files predate GPTBot, ClaudeBot, and PerplexityBot, or use a blanket 'Disallow: /' under 'User-agent: *' intended to stop scrapers — which also blocks every AI crawler that doesn't have its own explicit Allow rule."
  - question: "Does blocking AI bots affect my Google ranking?"
    answer: "Not directly — Googlebot is a separate user-agent from Google-Extended (which feeds Gemini and AI Overviews). Blocking Google-Extended doesn't hurt classic Search ranking, but it does exclude you from being cited in AI Overviews."
  - question: "Can I allow some AI bots and block others?"
    answer: "Yes. robots.txt rules are per user-agent, so you can explicitly Allow GPTBot and ClaudeBot while disallowing a scraper bot you don't want, by listing separate User-agent blocks for each."
---

The fastest way to find out if your site is invisible to ChatGPT, Claude, or Perplexity is to check one file: `robots.txt`. It takes about three minutes manually, or a few seconds with an automated scanner. Here's exactly what to look for.

## Step 1: Open Your robots.txt File

Go to `yourdomain.com/robots.txt` in a browser. You're looking for blocks like this:

```
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /
```

Any AI bot listed with `Disallow: /` cannot crawl a single page of your site. There's no partial access — it's a complete block.

## Step 2: Check for a Catch-All Block

Even if none of the AI bots are named explicitly, a wildcard rule can still block them:

```
User-agent: *
Disallow: /
```

This disallows every crawler that doesn't have its own more-specific `Allow` rule elsewhere in the file — including GPTBot, ClaudeBot, and PerplexityBot. This is the most common accidental block: a rule written years ago to stop generic scrapers, never updated to carve out exceptions for AI engines.

## The Bots Worth Checking For

| User-agent | Powers |
|---|---|
| `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` | ChatGPT (training, search, and browsing) |
| `ClaudeBot`, `anthropic-ai` | Claude |
| `PerplexityBot` | Perplexity |
| `Google-Extended` | Gemini and Google AI Overviews |
| `Amazonbot` | Alexa and Amazon AI features |
| `CCBot` | Common Crawl (used to train many models) |

## Step 3: Fix a Block

To explicitly allow an AI bot regardless of other rules, add a dedicated block for it:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

More specific user-agent rules take precedence over the wildcard `*` rule, so this reliably overrides a catch-all block for just these engines while leaving your other robots.txt rules untouched.

## Step 4: Verify the Fix

After updating `robots.txt`, re-check it by fetching the file directly (`curl yourdomain.com/robots.txt`) to confirm the change is live — CDN or cache layers sometimes serve a stale copy for several minutes after deployment.

## Automating This Check

Doing this manually across dozens of user-agents and confirming propagation is tedious to repeat regularly. [Aeorch's free scanner](/scan) checks your robots.txt against 10+ major AI bots in one pass and flags exactly which ones are blocked.

## Key Takeaways

- Check `yourdomain.com/robots.txt` directly for `Disallow: /` under GPTBot, ClaudeBot, or PerplexityBot
- A wildcard `User-agent: *` block also silently blocks AI bots unless overridden with a more specific rule
- More specific `Allow` rules for named bots take precedence over a catch-all `Disallow`

## Further Reading

- [OpenAI GPTBot documentation](https://platform.openai.com/docs/gptbot)
- [Google Search Central: robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [How to Unblock GPTBot and ClaudeBot in Robots.txt](/blog/unblock-ai-bots-robots-txt)

Check crawler access alongside every other AEO/GEO signal in the [complete audit checklist](/blog/complete-website-audit-checklist).
