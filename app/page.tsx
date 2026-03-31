import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import FreemiumSection from '@/components/landing/FreemiumSection';
import FAQ from '@/components/landing/FAQ';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Aeorch — Free SEO, AEO & GEO Audit Tool | Make Your Website AI-Ready',
  description:
    "Free SEO audit tool that scores your website across SEO, AEO, GEO, AI Compatibility and Authority. Find out why your site isn't showing in ChatGPT or Perplexity — and fix it.",
  alternates: { canonical: siteUrl },
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aeorch',
  url: siteUrl,
  description: 'Free SEO audit tool for SEO, AEO, GEO, AI Compatibility and Authority scoring.',
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Aeorch SEO Audit Tool',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free SEO audit tool that scores websites across SEO, AEO, GEO, AI Compatibility and Authority.',
  url: siteUrl,
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to audit your website for SEO, AEO and GEO',
  description: 'Get a comprehensive SEO, AEO, GEO, AI Compatibility and Authority score for your website in under 2 minutes.',
  totalTime: 'PT2M',
  tool: [{ '@type': 'HowToTool', name: 'Aeorch free audit tool' }],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Enter your URL',
      text: 'Paste your website address into Aeorch. It discovers all your pages via sitemap and crawls up to your credit limit.',
      url: `${siteUrl}/#how-it-works`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Get your five scores',
      text: 'Within minutes, receive scores for SEO, AEO, GEO, AI Compatibility and Authority — each with detailed issue breakdowns and prioritised recommendations.',
      url: `${siteUrl}/#how-it-works`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Fix issues and download AI files',
      text: 'Apply the actionable recommendations and download auto-generated llm.txt and ai-plugin.json files to boost AI discoverability instantly.',
      url: `${siteUrl}/#how-it-works`,
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is AEO (Answer Engine Optimization)?', acceptedAnswer: { '@type': 'Answer', text: 'AEO stands for Answer Engine Optimization — the practice of structuring your content so AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews can extract and surface your answers as direct citations rather than just links.' } },
    { '@type': 'Question', name: 'What is GEO (Generative Engine Optimization)?', acceptedAnswer: { '@type': 'Answer', text: 'GEO (Generative Engine Optimization) focuses on making your content trustworthy enough for large language models (LLMs) to reference and generate around. Key GEO signals include content depth, named author attribution, publication dates, and external citations to authoritative sources.' } },
    { '@type': 'Question', name: 'What is the difference between SEO, AEO and GEO?', acceptedAnswer: { '@type': 'Answer', text: 'SEO targets traditional search engines like Google for ranked results. AEO targets AI answer engines (ChatGPT, Perplexity, AI Overviews) for direct citations using structured data like FAQPage and HowTo schemas. GEO targets LLMs for content generation trust, using signals like authorship, depth, and external citations.' } },
    { '@type': 'Question', name: 'How do I improve my AEO score?', acceptedAnswer: { '@type': 'Answer', text: 'To improve your AEO score: (1) Add FAQPage structured data to Q&A pages, (2) Use question-based H2/H3 headings (What, How, Why), (3) Add HowTo and Article schema for instructional content, (4) Write concise direct answers after each question heading, (5) Ensure AI bots like GPTBot and ClaudeBot can crawl your site via robots.txt.' } },
    { '@type': 'Question', name: 'How do I check my GEO relevance score?', acceptedAnswer: { '@type': 'Answer', text: 'Aeorch checks your GEO score by analyzing content depth (minimum word count per page), definitional sentences ("What is X"), statistical references, named author attribution, publication dates, and external citations to authoritative sources. Each signal contributes to your GEO score out of 100.' } },
    { '@type': 'Question', name: 'What is an llm.txt file and why do I need one?', acceptedAnswer: { '@type': 'Answer', text: 'An llm.txt file (at yourdomain.com/llm.txt) tells AI models which pages on your site are most important and how to summarise your content — similar to robots.txt but designed for large language models. Aeorch auto-generates a complete llm.txt from your crawled pages.' } },
    { '@type': 'Question', name: 'Is Aeorch a free SEO audit tool?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Aeorch is free with 20 page credits per month. One credit equals one page scanned. You earn an additional 20 credits for every friend you refer (and they get 20 too). There is no credit card required.' } },
    { '@type': 'Question', name: 'How is Aeorch different from other SEO audit tools?', acceptedAnswer: { '@type': 'Answer', text: 'Most SEO tools only audit traditional Google signals. Aeorch is built for the AI era — it audits AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and AI Compatibility alongside classic SEO. It checks whether 10+ major AI bots including GPTBot, ClaudeBot, Google-Extended, and PerplexityBot can access your site, and generates llm.txt and ai-plugin.json files automatically.' } },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={faqJsonLd} />

      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FreemiumSection />
        <FAQ />

        {/* Final CTA */}
        <section className="py-20 bg-gradient-brand text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to make your site AI-ready?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join website owners using Aeorch to audit their SEO, AEO and GEO scores — free, every month.
            </p>
            <Link href="/signup" className="btn-primary bg-white !text-navy-900 hover:bg-slate-100 !py-4 !px-8">
              Start your free audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
