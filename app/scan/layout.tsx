import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Free Website SEO, AEO & GEO Audit — Scan Your Site',
  description:
    'Enter any URL and get a free SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AI Compatibility and Authority score in under 2 minutes.',
  alternates: { canonical: `${siteUrl}/scan` },
  openGraph: {
    title: 'Free Website SEO, AEO & GEO Audit — Aeorch',
    description: 'Scan any URL and get scores for SEO, AEO, GEO, AI Compatibility and Authority.',
    url: `${siteUrl}/scan`,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Scan', item: `${siteUrl}/scan` },
  ],
};

// Kept in sync with SCAN_STEPS in app/scan/page.tsx — structured data should match visible content.
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to run a free SEO, AEO & GEO audit',
  step: [
    { '@type': 'HowToStep', name: 'Discovering pages via sitemap' },
    { '@type': 'HowToStep', name: 'Crawling and analysing each page' },
    { '@type': 'HowToStep', name: 'Running SEO, AEO & GEO checks' },
    { '@type': 'HowToStep', name: 'Checking AI bot access' },
    { '@type': 'HowToStep', name: 'Generating your report' },
  ],
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {children}
    </>
  );
}
