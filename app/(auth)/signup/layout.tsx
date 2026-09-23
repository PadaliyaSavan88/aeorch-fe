import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Sign Up Free',
  description:
    'Create a free Aeorch account to scan your website for SEO, AEO and GEO issues and track how AI engines see it.',
  alternates: { canonical: `${siteUrl}/signup` },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
