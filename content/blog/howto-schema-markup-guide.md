---
title: "HowTo Schema Markup: A Complete AEO Guide"
description: "HowTo schema structures step-by-step content for AI extraction. Here's the exact JSON-LD format, required fields, and when not to use it."
publishedAt: "2026-05-07"
author: "Aeorch Team"
category: "AEO"
keywords:
  - "howto schema markup"
  - "howto structured data"
  - "howto json-ld example"
  - "howto schema google"
  - "step by step schema markup"
faq:
  - question: "What is HowTo schema used for?"
    answer: "HowTo schema marks up step-by-step instructional content — recipes, tutorials, assembly guides — so search and AI engines can parse the individual steps directly rather than inferring them from unstructured prose."
  - question: "Does HowTo schema require images for each step?"
    answer: "No, images are optional per the specification, though including a relevant image for each step can improve how the content is displayed in rich results where supported."
  - question: "Can I use HowTo schema on any instructional blog post?"
    answer: "Only if the content is genuinely a sequential set of steps to accomplish a task. Google's guidelines advise against using HowTo schema on content that isn't actually instructional, since it can be considered misleading markup."
  - question: "Did Google remove HowTo rich results?"
    answer: "Google reduced HowTo rich result visibility in some search surfaces over time, but the schema itself remains valid and useful for AI engines parsing instructional content, independent of whether Google displays a specific rich result for it."
---

HowTo schema is JSON-LD structured data that marks up step-by-step instructional content, letting search and AI engines parse individual steps directly instead of inferring them from prose. Here's the exact format and when it's appropriate to use.

## The Markup Itself

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Allow AI Bots in Robots.txt",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Open your robots.txt file",
      "text": "Locate the robots.txt file at the root of your domain, typically yourdomain.com/robots.txt."
    },
    {
      "@type": "HowToStep",
      "name": "Add a User-agent block for each AI bot",
      "text": "Add 'User-agent: GPTBot' followed by 'Allow: /' as its own block, repeating for ClaudeBot and PerplexityBot."
    },
    {
      "@type": "HowToStep",
      "name": "Deploy and verify",
      "text": "Publish the updated file and fetch it directly to confirm the change is live."
    }
  ]
}
```

Each `HowToStep` needs a `name` (short step title) and `text` (the actual instruction). Steps are read in array order, so sequence matters.

## Optional Fields Worth Adding

- `totalTime` — estimated duration in ISO 8601 duration format (e.g. `PT10M` for 10 minutes)
- `image` — a relevant image URL per step, where one exists
- `tool` / `supply` — items needed to complete the task, relevant for physical/DIY instructions

These aren't required, but they add detail that can improve how thoroughly the content is understood and, where supported, displayed.

## When Not to Use HowTo Schema

Only apply it to content that's genuinely a sequential set of steps toward a specific outcome. Google's structured data guidelines explicitly caution against using HowTo markup on content that isn't actually instructional — a general "tips" listicle or an opinion piece dressed up with fake steps is a misuse that can be flagged, and it doesn't help AI extraction either, since there's no real step sequence underneath.

## HowTo vs FAQPage: Choosing the Right Schema

| | Use HowTo when... | Use FAQPage when... |
|---|---|---|
| Content shape | Sequential steps toward one outcome | Standalone questions with independent answers |
| Example | "How to unblock GPTBot in robots.txt" | "Is GPTBot blocking dangerous for SEO?" |

Some pages legitimately warrant both — a tutorial with a sequential main body and a separate FAQ section addressing tangential questions.

## Validating Your Markup

Test your HowTo JSON-LD with [Google's Rich Results Test](https://search.google.com/test/rich-results) before publishing — it flags missing required fields (`name` and `text` on each step) and structural errors that would otherwise silently fail to parse.

## Checking Coverage Across Your Site

[Aeorch's scanner](/scan) checks HowTo schema presence and validity on instructional content as part of your AEO score, flagging tutorial pages that would benefit from it but don't have it yet.

## Key Takeaways

- HowTo schema requires an array of HowToStep objects, each with a name and text field
- Optional fields like totalTime and image add detail but aren't required
- Only use it on genuinely sequential instructional content — misuse risks a manual action and provides no real AEO benefit

## Further Reading

- [Schema.org HowTo specification](https://schema.org/HowTo)
- [Google: HowTo structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/how-to)
- [How to Add FAQ Schema Markup (Step-by-Step)](/blog/faq-schema-markup-guide)

Check HowTo and FAQ schema together in the [complete audit checklist](/blog/complete-website-audit-checklist).
