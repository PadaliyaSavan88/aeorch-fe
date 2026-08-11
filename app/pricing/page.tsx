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

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader active="pricing" />
        <PricingBody />
        <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/free-tool', label: 'Free Tool' }]} />
      </SiteThemeProvider>
    </>
  );
}
