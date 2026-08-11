import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getPost, getAllPosts } from '@/lib/blog';
import SiteThemeProvider from '@/components/site/SiteThemeProvider';
import MarketingHeader from '@/components/site/MarketingHeader';
import SiteFooter from '@/components/site/SiteFooter';
import BlogReaderClient from '@/components/blog/BlogReaderClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

function ogImagePath(post: { title: string; category: string }): string {
  return `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;
}

function ogImageUrl(post: { title: string; category: string }): string {
  return `${siteUrl}${ogImagePath(post)}`;
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: ogImageUrl(post), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl(post)],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Organization', name: post.author, url: siteUrl },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    publisher: { '@type': 'Organization', name: 'Aeorch', url: siteUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` },
    keywords: post.keywords.join(', '),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.prose-blog > p:first-of-type'],
    },
    isPartOf: { '@type': 'Blog', name: 'Aeorch Blog', url: `${siteUrl}/blog` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  const faqJsonLd = post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <SiteThemeProvider>
        <MarketingHeader active="blog" />
        <BlogReaderClient post={post}>
          <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </BlogReaderClient>
        <SiteFooter variant="center" links={[{ href: '/', label: 'Home' }]} />
      </SiteThemeProvider>
    </>
  );
}
