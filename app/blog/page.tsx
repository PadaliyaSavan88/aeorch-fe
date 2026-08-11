import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import BlogListClient from '@/components/blog/BlogListClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Blog — SEO, AEO & GEO Guides',
  description:
    'Practical guides on SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and making your website AI-ready for ChatGPT, Perplexity and Google.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Aeorch Blog — SEO, AEO & GEO Guides',
    description: 'Practical guides on making your website AI-ready.',
    url: `${siteUrl}/blog`,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
  ],
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteThemeProvider>
        <MarketingHeader active="blog" />
        <BlogListClient posts={posts} />
        <SiteFooter variant="center" links={[{ href: '/', label: 'Home' }]} />
      </SiteThemeProvider>
    </>
  );
}
