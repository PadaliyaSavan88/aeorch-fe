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

export default function FreeToolPage() {
  return (
    <SiteThemeProvider>
      <MarketingHeader active="free-tool" />
      <FreeToolBody />
      <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/pricing', label: 'Pricing' }]} />
    </SiteThemeProvider>
  );
}
