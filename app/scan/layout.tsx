import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Free Website SEO, AEO & GEO Audit — Scan Your Site',
  description:
    'Enter any URL and get a free SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AI Compatibility and Authority score in under 2 minutes.',
  alternates: { canonical: `${siteUrl}/scan` },
  openGraph: {
    title: 'Free Website SEO, AEO & GEO Audit — Aeorch',
    description: 'Scan any URL and get scores for SEO, AEO, GEO, AI Compatibility and Authority.',
    url: `${siteUrl}/scan`,
  },
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
