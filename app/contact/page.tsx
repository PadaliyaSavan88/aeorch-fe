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

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${siteUrl}/contact` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Contact Aeorch',
  url: `${siteUrl}/contact`,
  datePublished: '2026-08-18',
  dateModified: '2026-08-18',
};

// Kept in sync with the FAQS array in components/contact/ContactBody.tsx — structured data should match visible content.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How fast does Aeorch respond to messages?', acceptedAnswer: { '@type': 'Answer', text: 'We typically respond within one business day.' } },
    { '@type': 'Question', name: 'How do I report a bug?', acceptedAnswer: { '@type': 'Answer', text: 'Select "Bug report" from the subject dropdown below and describe the issue — we read every submission.' } },
    { '@type': 'Question', name: 'Do you offer white-label reports for agencies?', acceptedAnswer: { '@type': 'Answer', text: 'White-label PDF export is an Agency-tier feature — reach out via Premium plan enquiry for agency onboarding.' } },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader />
        <ContactBody />
        <SiteFooter links={[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }]} />
      </SiteThemeProvider>
    </>
  );
}
