import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import AuthHeader from '@/components/layout/AuthHeader';
import Footer from '@/components/layout/Footer';
import { Clock, ArrowRight } from 'lucide-react';

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
      <AuthHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero text-white py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <span className="badge bg-white/10 text-cyan-300 border border-white/20 mb-6">Resources</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">SEO, AEO & GEO Guides</h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Practical guides to help you rank in search engines and get cited by AI tools like ChatGPT, Perplexity and Gemini.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400">Blog posts coming soon.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                    <article className="card p-6 h-full flex flex-col gap-4 hover:shadow-md transition-shadow">
                      <span className="badge bg-brand-50 text-brand-700">{post.category}</span>
                      <div className="flex-1">
                        <h2 className="font-bold text-navy-900 text-lg leading-snug mb-2 group-hover:text-brand-700 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{post.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readingTime} min read
                        </div>
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
