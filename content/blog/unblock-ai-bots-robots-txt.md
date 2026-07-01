---
title: "How to Unblock GPTBot and ClaudeBot in Robots.txt"
description: "Exact robots.txt rules to allow GPTBot, ClaudeBot, and PerplexityBot without opening your site to every scraper. Copy-paste examples included."
publishedAt: "2026-04-27"
author: "Aeorch Team"
category: "AI Compatibility"
keywords:
  - "unblock gptbot robots.txt"
  - "allow ai crawlers robots.txt"
  - "claudebot robots.txt rule"
  - "perplexitybot allow"
  - "ai bot robots.txt example"
faq:
  - question: "Does allowing GPTBot mean I'm allowing every bot?"
    answer: "No. robots.txt rules are scoped per user-agent — you can write a specific Allow rule for GPTBot while leaving a broader Disallow rule in place for a generic wildcard user-agent, so unwanted scrapers stay blocked."
  - question: "Do I need separate rules for GPTBot and OAI-SearchBot?"
    answer: "Yes. OpenAI operates GPTBot (training/browsing) and OAI-SearchBot (search) as distinct user-agents, and ChatGPT-User for live browsing during a chat — each needs its own User-agent block if you want to allow all three explicitly."
  - question: "How long does a robots.txt change take to apply?"
    answer: "Most crawlers re-fetch robots.txt periodically rather than on every request, typically within 24 hours, though caching layers (CDNs) can delay visibility of the update further if not purged."
  - question: "Can I allow AI bots but disallow specific pages for them?"
    answer: "Yes — add path-specific Disallow rules under that bot's User-agent block, e.g. disallowing /account/ while allowing everything else, the same pattern used for any other crawler."
---

Unblocking AI crawlers in `robots.txt` is a matter of adding specific `Allow` rules for each bot's user-agent — without touching whatever rules you already have for other crawlers. Here are the exact blocks to add.

## The Core Rule Set

```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

Add these as their own blocks anywhere in your `robots.txt`. Each is independent — a bot only follows the rules under its own `User-agent` line (or a wildcard `*` block if it has no specific one).

## Why Separate Blocks for OpenAI's Three Bots

OpenAI operates three distinct crawlers with different purposes: `GPTBot` (training and general crawling), `OAI-SearchBot` (powers ChatGPT search results), and `ChatGPT-User` (live browsing triggered during an active chat session). Allowing one doesn't automatically allow the others — if your goal is full ChatGPT visibility, all three need explicit rules.

## Allowing AI Bots Without Opening Everything Up

A common concern is that adding these rules exposes the site to unwanted scrapers too. It doesn't — robots.txt matches bots by their declared user-agent string, so a rule scoped to `User-agent: GPTBot` has no effect on any other crawler. You can keep a restrictive wildcard rule for everything else:

```
User-agent: *
Disallow: /admin/
Disallow: /account/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

Here, GPTBot and ClaudeBot get full access while the wildcard rule still restricts unnamed crawlers from `/admin/` and `/account/`.

## Blocking Specific Paths for AI Bots Only

If you want AI crawlers to access most of your site but exclude certain sections (e.g. user account pages), scope the Disallow under that bot's own block:

```
User-agent: GPTBot
Allow: /
Disallow: /account/
```

## Verifying the Change Took Effect

After deploying, fetch the file directly to confirm the live version matches what you expect:

```
curl https://yourdomain.com/robots.txt
```

If a CDN or edge cache serves a stale copy, purge it — otherwise crawlers may keep reading the old rules for longer than expected.

## Confirming Bots Can Actually Reach Your Content

Allowing a bot in robots.txt is necessary but not sufficient — the content also needs to be reachable without a login wall and present in the raw HTML response. [Aeorch's scanner](/scan) checks both the robots.txt rule and actual reachability for each major AI bot in one pass.

## Key Takeaways

- Add a separate User-agent block with Allow: / for each AI bot you want to permit
- Rules are scoped per user-agent — allowing AI bots doesn't open access to unrelated scrapers
- Verify changes took effect by fetching robots.txt directly, since caches can delay visibility

## Further Reading

- [OpenAI GPTBot documentation](https://platform.openai.com/docs/gptbot)
- [Google Search Central: robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Is Your Site Blocked From GPTBot or ClaudeBot?](/blog/check-ai-crawler-access)

Check crawler access alongside every other signal in the [complete audit checklist](/blog/complete-website-audit-checklist).
