import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AuthHeader from '@/components/layout/AuthHeader';
import Footer from '@/components/layout/Footer';
import Features from '@/components/landing/Features';
import FreemiumSection from '@/components/landing/FreemiumSection';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Features & Pricing — Aeorch SEO, AEO & GEO Audit Tool',
  description:
    'See everything Aeorch checks: SEO, AEO, GEO, AI Compatibility and Authority scoring. Free plan with 20 page credits per month — no credit card required.',
  alternates: { canonical: `${siteUrl}/features` },
  openGraph: {
    title: 'Features & Pricing — Aeorch',
    description: 'Five audit dimensions. One free tool. See what Aeorch checks and how much it costs.',
    url: `${siteUrl}/features`,
  },
};

export default function FeaturesPage() {
  return (
    <>
      <AuthHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero text-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <span className="badge bg-white/10 text-cyan-300 border border-white/20 mb-6">Features & Pricing</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              One audit. Five scores. Free every month.
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
              Aeorch checks your website across every dimension that matters in the AI era — from classic SEO to whether ChatGPT can actually find you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary bg-white !text-navy-900 hover:bg-slate-100 !py-3 !px-8">
                Start for free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#pricing" className="inline-flex items-center justify-center gap-2 py-3 px-8 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-medium text-sm">
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* 5 Dimensions */}
        <Features />

        {/* Pricing */}
        <FreemiumSection />

        {/* Bottom CTA */}
        <section className="py-16 bg-slate-50 text-center">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-navy-900 mb-3">Ready to audit your site?</h2>
            <p className="text-slate-500 text-sm mb-6">
              Free, no credit card required. 20 page credits per month to get you started.
            </p>
            <Link href="/signup" className="btn-primary !py-3 !px-8">
              Get started free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
