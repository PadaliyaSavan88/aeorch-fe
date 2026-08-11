import type { Metadata } from 'next';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FeaturesBody from '@/components/features/FeaturesBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Features & Pricing — Aeorch SEO, AEO & GEO Audit Tool',
  description:
    'See everything Aeorch checks: SEO, AEO, GEO, AI Compatibility and Authority scoring. Free plan with 20 page credits per month — no credit card required.',
  alternates: { canonical: `${siteUrl}/features` },
  openGraph: {
    title: 'Features & Pricing — Aeorch',
    description: 'Five audit dimensions. One free tool. See what Aeorch checks and how much it costs.',
    url: `${siteUrl}/features`,
  },
};

export default function FeaturesPage() {
  return (
    <SiteThemeProvider>
      <MarketingHeader active="product" />
      <FeaturesBody />
      <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/pricing', label: 'Pricing' }]} />
    </SiteThemeProvider>
  );
}
