import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aeorch — Free SEO, AEO & GEO Audit Tool | Make Your Website AI-Ready',
    template: '%s | Aeorch',
  },
  description:
    'Aeorch is a free SEO audit tool that scores your website across SEO, AEO, GEO, AI Compatibility and Authority. Make your website AI-ready for ChatGPT, Claude, Perplexity and Google.',
  keywords: [
    'seo audit tool',
    'seo score checker',
    'aeo optimization tool',
    'answer engine optimization audit',
    'seo aeo geo score tool',
    'website seo checker',
    'ai seo tool',
    'seo audit report generator',
    'make website ai ready',
  ],
  authors: [{ name: 'Aeorch' }],
  creator: 'Aeorch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Aeorch',
    title: 'Aeorch — Free SEO, AEO & GEO Audit Tool',
    description:
      'Score your website across SEO, AEO, GEO, AI Compatibility and Authority. Free SEO audit tool built for the AI era.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Aeorch SEO Audit Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aeorch — Free SEO, AEO & GEO Audit Tool',
    description: 'Score your website across SEO, AEO, GEO, AI Compatibility and Authority.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: siteUrl },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Aeorch',
  url: siteUrl,
  description: 'Free SEO audit tool that scores websites across SEO, AEO, GEO, AI Compatibility and Authority.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/scan?url={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
