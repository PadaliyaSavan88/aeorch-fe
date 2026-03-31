import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight, Target, Zap, Users } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'About Aeorch — Free SEO, AEO & GEO Audit Tool',
  description: 'Aeorch is a free website audit tool that scores your site across SEO, AEO, GEO, AI Compatibility and Authority. Built for the AI era of search.',
  alternates: { canonical: `${siteUrl}/about` },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aeorch',
  url: siteUrl,
  description: 'Free SEO, AEO and GEO audit tool that scores websites across five dimensions: SEO, AEO, GEO, AI Compatibility and Authority.',
  foundingDate: '2025',
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: `${siteUrl}/contact` },
  sameAs: [
    'https://twitter.com/aeorch',
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${siteUrl}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">About Aeorch</h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              We built the SEO audit tool we wished existed when AI search became mainstream.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose-brand mb-12">
              <h2>Why we built Aeorch</h2>
              <p>
                When AI-powered search tools — ChatGPT, Perplexity, Google AI Overviews — became mainstream, most website owners had no way to know whether their sites were optimised for this new layer of discovery. Traditional SEO tools check Google signals. Nobody was checking AI signals.
              </p>
              <p>
                Aeorch was built to fill that gap. We check not just whether your website ranks in Google, but whether it&apos;s discoverable, readable, and citable by the AI engines that are increasingly where people go for answers.
              </p>
              <h2>What Aeorch checks</h2>
              <p>
                Every Aeorch scan checks five dimensions:
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 mb-12">
              {[
                { icon: Target, title: 'Our mission', desc: 'Help every website owner understand and improve their presence in the AI era of search.' },
                { icon: Zap, title: 'Free first', desc: '20 page credits per month, forever free. Earn more by referring friends — no cap.' },
                { icon: Users, title: 'Built for everyone', desc: 'From solo bloggers to marketing teams. No SEO expertise required.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/scan" className="btn-primary !py-4 !px-8">
                Try Aeorch free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
