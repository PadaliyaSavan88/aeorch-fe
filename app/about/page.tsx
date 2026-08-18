import type { Metadata } from 'next';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import AboutBody from '@/components/about/AboutBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'About Aeorch — Free SEO, AEO & GEO Audit Tool',
  description: 'Aeorch is a free website audit tool that scores your site across SEO, AEO, GEO, AI Compatibility and Authority. Built for the AI era of search.',
  alternates: { canonical: `${siteUrl}/about` },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aeorch',
  url: siteUrl,
  description: 'Free SEO, AEO and GEO audit tool that scores websites across five dimensions: SEO, AEO, GEO, AI Compatibility and Authority.',
  foundingDate: '2025',
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: `${siteUrl}/contact` },
  sameAs: [
    'https://twitter.com/aeorch',
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${siteUrl}/about` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'About Aeorch — Free SEO, AEO & GEO Audit Tool',
  url: `${siteUrl}/about`,
  datePublished: '2026-08-18',
  dateModified: '2026-08-18',
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader />
        <AboutBody />
        <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/contact', label: 'Contact' }]} />
      </SiteThemeProvider>
    </>
  );
}
