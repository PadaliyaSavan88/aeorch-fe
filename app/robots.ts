import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // App Pages stay out of search via a noindex meta tag, not a disallow:
      // Google cannot see noindex on a URL it is blocked from crawling.
      { userAgent: '*', allow: '/' },
      // Explicitly allow all major AI bots
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'DuckAssistBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'FacebookBot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
