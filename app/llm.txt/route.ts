import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export function GET() {
  const content = `# Aeorch — Free SEO, AEO & GEO Audit Tool
> Aeorch (aeorch.com) is a free website audit tool that scores any website across five dimensions: SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AI Compatibility, and Authority. It is built for website owners who want to make their sites discoverable and citable by AI-powered search engines like ChatGPT, Perplexity, Google AI Overviews, and Claude.

## What Aeorch Does

Aeorch crawls a website via its sitemap, analyses each page, and returns scored reports across five dimensions:

1. **SEO Score** — title tags, meta descriptions, H1 structure, canonical URLs, Open Graph tags
2. **AEO Score** — FAQPage schema, HowTo schema, Article schema, question-based headings, Speakable markup
3. **GEO Score** — content depth (minimum word count), named author attribution, publication dates, external citations, definitional sentences
4. **AI Compatibility Score** — checks 14 major AI bot user-agents in robots.txt, presence of llm.txt and ai-plugin.json
5. **Authority Score** — About, Contact, and Privacy pages presence

## Main Pages

- ${siteUrl}/: Homepage with features overview, pricing, FAQ, and scan CTA
- ${siteUrl}/scan: Free scan tool — enter any URL to receive a full 5-dimension audit report
- ${siteUrl}/blog: Blog with SEO, AEO, GEO guides
- ${siteUrl}/about: About page — mission and product overview
- ${siteUrl}/contact: Support and premium plan enquiries
- ${siteUrl}/privacy: Privacy Policy

## Blog Articles

- ${siteUrl}/blog/what-is-aeo: What is AEO (Answer Engine Optimization) and Why It Matters in 2025
- ${siteUrl}/blog/seo-aeo-geo-guide: SEO vs AEO vs GEO — The Complete 2025 Guide
- ${siteUrl}/blog/ai-ready-website: How to Make Your Website AI-Ready in 2025 (Complete Checklist)

## Pricing

- Free plan: 20 page credits per month, all 5 audit dimensions, full HTML report, auto-generated llm.txt and ai-plugin.json
- Referral programme: +20 credits for referrer and referee, no cap
- Premium: unlimited credits, API access, scheduled scans, white-label reports (contact via /contact page)

## Technical

- Backend: TypeScript / Express / MongoDB / Redis / BullMQ
- Frontend: Next.js 15 App Router
- Scan reports served as HTML at /api/v1/scans/:id/report
`;


  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
