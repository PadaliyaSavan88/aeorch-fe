import type { Metadata } from 'next';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FreeToolBody from '@/components/free-tool/FreeToolBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Free llm.txt Generator — Aeorch',
  description: 'Generate an llm.txt and ai-plugin.json starter template for any domain, free, no login required.',
  alternates: { canonical: `${siteUrl}/free-tool` },
  openGraph: {
    title: 'Free llm.txt Generator — Aeorch',
    description: 'Generate an llm.txt and ai-plugin.json starter template for any domain, free, no login required.',
    url: `${siteUrl}/free-tool`,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Free Tool', item: `${siteUrl}/free-tool` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Free llm.txt Generator — Aeorch',
  url: `${siteUrl}/free-tool`,
  datePublished: '2026-08-18',
  dateModified: '2026-08-18',
};

// Kept in sync with the STEPS array in components/free-tool/FreeToolBody.tsx — structured data should match visible content.
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to generate an llm.txt file for your site',
  step: [
    { '@type': 'HowToStep', name: 'Paste your site URL', text: 'No login or credits required — just the domain you want to check.' },
    { '@type': 'HowToStep', name: 'Aeorch checks AI-crawler access', text: 'We check whether major AI bots (GPTBot, ClaudeBot, Google-Extended, PerplexityBot) can access your site, and whether llm.txt and ai-plugin.json already exist.' },
    { '@type': 'HowToStep', name: 'Download or copy the generated files', text: 'If either file is missing, Aeorch generates it from your site so you can drop it straight in.' },
  ],
};

// Kept in sync with the FAQS array in components/free-tool/FreeToolBody.tsx — structured data should match visible content.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is the llm.txt generator really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — no login, no scan credits, no card required. Every check is free.' } },
    { '@type': 'Question', name: 'What does the free tool check?', acceptedAnswer: { '@type': 'Answer', text: 'It checks whether major AI bots can access your site, and whether you already have an llm.txt and ai-plugin.json file.' } },
    { '@type': 'Question', name: 'What if my site already has these files?', acceptedAnswer: { '@type': 'Answer', text: "You'll see a confirmation that llm.txt and ai-plugin.json are already present — nothing to generate." } },
  ],
};

export default function FreeToolPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader active="free-tool" />
        <FreeToolBody />
        <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/pricing', label: 'Pricing' }]} />
      </SiteThemeProvider>
    </>
  );
}
