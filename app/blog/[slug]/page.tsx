import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPost, getAllPosts } from '@/lib/blog';
import AuthHeader from '@/components/layout/AuthHeader';
import Footer from '@/components/layout/Footer';
import { Clock, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

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
      cssSelector: ['h1', 'h2', '.prose-brand > p:first-of-type'],
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
      <AuthHeader />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-600 truncate">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <span className="badge bg-brand-50 text-brand-700 mb-4">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">{post.description}</p>

            <div className="flex items-center gap-5 text-sm text-slate-400 pt-4 border-t border-slate-100">
              <span className="font-medium text-slate-600">{post.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            </div>
          </header>

          {/* Cover image */}
          <img
            src={ogImagePath(post)}
            alt={`${post.title} — Aeorch ${post.category} guide`}
            width={1200}
            height={630}
            className="w-full rounded-2xl mb-10"
          />

          {/* Content */}
          <div className="prose-brand">
            <MDXRemote source={post.content} />
          </div>

          {/* FAQ */}
          {post.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faq.map(item => (
                  <div key={item.question}>
                    <h3 className="font-semibold text-navy-900 mb-1.5">{item.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-hero text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to check your {post.category} score?</h2>
            <p className="text-slate-300 text-sm mb-5">
              Get a free SEO, AEO, GEO, AI Compatibility and Authority audit for your website.
            </p>
            <Link href="/scan" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-900 font-semibold text-sm hover:bg-slate-100 transition-colors">
              Scan my website free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium">
              <ArrowLeft className="w-4 h-4" /> All articles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
