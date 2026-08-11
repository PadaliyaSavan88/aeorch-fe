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

export default function PrivacyPage() {
  return (
    <SiteThemeProvider>
      <MarketingHeader />
      <PrivacyBody />
      <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/contact', label: 'Contact' }]} />
    </SiteThemeProvider>
  );
}
