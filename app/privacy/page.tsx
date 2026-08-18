import type { Metadata } from 'next';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PrivacyBody from '@/components/privacy/PrivacyBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Aeorch Privacy Policy — how we collect, use and protect your data.',
  alternates: { canonical: `${siteUrl}/privacy` },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${siteUrl}/privacy` },
  ],
};

// Kept in sync with the "Last updated" copy in components/privacy/PrivacyBody.tsx.
const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  url: `${siteUrl}/privacy`,
  datePublished: '2025-03-01',
  dateModified: '2025-03-01',
};

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader />
        <PrivacyBody />
        <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/contact', label: 'Contact' }]} />
      </SiteThemeProvider>
    </>
  );
}
