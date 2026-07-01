---
title: "How to Add FAQ Schema Markup (Step-by-Step)"
description: "FAQPage JSON-LD lets AI engines extract Q&A content directly. Here's the exact markup, where to put it, and common validation mistakes to avoid."
publishedAt: "2026-04-17"
author: "Aeorch Team"
category: "AEO"
keywords:
  - "faq schema markup"
  - "how to add faqpage schema"
  - "faqpage json-ld example"
  - "faq structured data"
  - "faq schema google"
  - "faq rich results"
faq:
  - question: "Where do I put FAQPage schema on my page?"
    answer: "Inside a script tag with type='application/ld+json', typically in the page head or anywhere in the body — placement doesn't affect parsing, since search and AI engines read the full JSON-LD block regardless of position in the DOM."
  - question: "Does the FAQ content need to be visible on the page too?"
    answer: "Yes. Google's guidelines require that structured data reflect content actually visible to users — hiding the Q&A text while only including it in JSON-LD risks a manual action and won't help with AI extraction either, since it looks unreliable to both systems."
  - question: "How many questions should I include in one FAQPage schema?"
    answer: "There's no hard limit, but include only genuine, distinct questions relevant to that page. Padding with repetitive or overly generic questions dilutes relevance and can look like an attempt to game rich results."
  - question: "Why isn't my FAQ schema showing up in Google's rich results?"
    answer: "Common causes: the schema doesn't validate (check with Google's Rich Results Test), the visible text doesn't match the JSON-LD content, or Google has determined the page doesn't qualify for the rich result treatment even with valid markup — inclusion isn't guaranteed."
---

FAQPage schema is a JSON-LD block that marks up question-and-answer content so search engines and AI answer engines can extract it directly, rather than inferring it from unstructured prose. Here's the exact markup, where it goes, and the mistakes that most commonly break it.

## The Markup Itself

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is FAQPage schema?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "FAQPage schema is structured data that marks up question-and-answer content so search and AI engines can extract it directly."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need multiple Question entries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — include one Question/acceptedAnswer pair per distinct Q&A on the page, inside the same mainEntity array."
      }
    }
  ]
}
```

Wrap this in a `<script type="application/ld+json">` tag anywhere on the page. Multiple questions belong in the same `mainEntity` array as separate objects, not as separate script blocks.

## Where It Goes in Your HTML

```html
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [ ... ] }
</script>
```

Placement in `<head>` versus `<body>` doesn't affect how parsers read it — what matters is that the block is valid JSON and present somewhere in the rendered HTML.

## The Most Common Mistake: Hidden Content Mismatch

Google's structured data guidelines require that FAQPage content correspond to text actually visible on the page. A frequent mistake is writing more thorough answers in the JSON-LD than what's shown to users — either because the visible copy was trimmed for design reasons, or the schema was written separately from the page content. This mismatch risks a manual action from Google and looks unreliable to AI crawlers evaluating trustworthiness, so keep the JSON-LD and visible text in sync exactly.

## Validating Your Markup

Before publishing, check your markup with [Google's Rich Results Test](https://search.google.com/test/rich-results) — paste your URL or raw HTML and it flags syntax errors, missing required fields, and warnings. A block that fails validation won't be parsed reliably by any consumer, human-facing rich results or AI extraction alike.

## Which Pages Should Have FAQPage Schema

Add it to pages with genuine, distinct Q&A content — a dedicated FAQ page, or a blog post with a natural "frequently asked questions" section. Don't retrofit it onto pages without real question-and-answer content just to gain the schema; Google's guidelines explicitly discourage this, and it provides little AEO benefit since there's no real Q&A structure underneath.

## Checking Coverage Across Your Whole Site

Auditing every page manually for schema presence and validity doesn't scale past a handful of pages. [Aeorch's scanner](/scan) checks FAQPage schema validity and visible-content matching across your whole site as part of its AEO score.

## Key Takeaways

- FAQPage JSON-LD needs one Question/acceptedAnswer object per Q&A, inside a shared mainEntity array
- Visible page text must match the JSON-LD content — mismatches risk manual actions and reduce AI trust
- Validate with Google's Rich Results Test before publishing, and only add it to pages with genuine Q&A content

## Further Reading

- [Schema.org FAQPage specification](https://schema.org/FAQPage)
- [Google: FAQ structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [What is AEO (Answer Engine Optimization)?](/blog/what-is-aeo)

Check FAQ schema validity across your whole site in the [complete SEO, AEO, GEO audit checklist](/blog/complete-website-audit-checklist).
