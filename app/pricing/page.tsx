import type { Metadata } from 'next';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PricingBody from '@/components/pricing/PricingBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Pricing — Aeorch',
  description: 'Simple pricing for agencies. Starter for single-site freelancers, Agency for teams managing client portfolios. Founding pricing locked for your first 6 months.',
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    title: 'Pricing — Aeorch',
    description: 'Simple pricing for agencies reporting AI search visibility to clients.',
    url: `${siteUrl}/pricing`,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${siteUrl}/pricing` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Pricing — Aeorch',
  url: `${siteUrl}/pricing`,
  datePublished: '2026-08-18',
  dateModified: '2026-08-18',
};

// Kept in sync with the FAQS array in components/pricing/PricingBody.tsx — structured data should match visible content.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Can I switch plans later?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, upgrade or downgrade anytime, billing prorates automatically.' } },
    { '@type': 'Question', name: 'What counts as a "site"?', acceptedAnswer: { '@type': 'Answer', text: 'One root domain. Subdomains you monitor separately count as additional sites.' } },
    { '@type': 'Question', name: 'Do you offer white-label branding on Starter?', acceptedAnswer: { '@type': 'Answer', text: 'White-label PDF export is an Agency-tier feature, Starter reports carry the Aeorch mark.' } },
    { '@type': 'Question', name: 'Is there a free option?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the llm.txt generator is free with no login. Full scans require a plan.' } },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader active="pricing" />
        <PricingBody />
        <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/free-tool', label: 'Free Tool' }]} />
      </SiteThemeProvider>
    </>
  );
}
