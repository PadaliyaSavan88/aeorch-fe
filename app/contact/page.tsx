import type { Metadata } from 'next';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ContactBody from '@/components/contact/ContactBody';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Contact Aeorch',
  description: 'Get in touch with Aeorch for general enquiries, premium plans, bug reports or partnerships.',
  alternates: { canonical: `${siteUrl}/contact` },
};

export default function ContactPage() {
  return (
    <SiteThemeProvider>
      <MarketingHeader />
      <ContactBody />
      <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }]} />
    </SiteThemeProvider>
  );
}
