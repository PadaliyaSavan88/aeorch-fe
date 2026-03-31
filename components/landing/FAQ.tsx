'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is AEO (Answer Engine Optimization)?',
    answer:
      'AEO stands for Answer Engine Optimization — the practice of structuring your content so AI-powered search engines like ChatGPT, Perplexity, and Google\'s AI Overviews can extract and surface your answers. Unlike traditional SEO that targets ranking, AEO targets being cited as a source in AI-generated responses.',
  },
  {
    question: 'What is GEO (Generative Engine Optimization)?',
    answer:
      'GEO stands for Generative Engine Optimization. It focuses on making your content suitable for AI content generators and large language models. GEO signals include content depth, author attribution, publication dates, external citations, and factual precision — all factors that make AI models confident enough to reference your site.',
  },
  {
    question: 'How do I improve my AEO score?',
    answer:
      'To improve your AEO score: (1) Add FAQPage structured data markup, (2) Use question-based H2/H3 headings, (3) Add HowTo and Article schema where relevant, (4) Write concise, direct answers below each question, and (5) Ensure your content is accessible to AI bots in robots.txt.',
  },
  {
    question: 'How do I check my GEO relevance?',
    answer:
      'Aeorch checks your GEO score by analyzing content depth (minimum word count), definitional sentences ("What is X"), statistical references, author attribution, publication dates, and external citations. All of these signal authority and factual reliability to AI generation engines.',
  },
  {
    question: 'What is an llm.txt file and why do I need one?',
    answer:
      'An llm.txt file (similar to robots.txt but for LLMs) helps AI models understand what content on your site is most valuable and how to summarize it. Aeorch auto-generates an llm.txt file from your crawled pages, ready to upload to your root domain.',
  },
  {
    question: 'Is Aeorch a free SEO audit tool?',
    answer:
      'Yes — Aeorch is free to use with 20 page credits per month. You earn an additional 20 credits for every friend you refer (and they get 20 too). For unlimited credits and premium features like API access and scheduled scans, contact us for a custom plan.',
  },
  {
    question: 'How is Aeorch different from other SEO audit tools?',
    answer:
      'Most SEO tools focus only on traditional search engine signals. Aeorch is built for the AI era — it specifically audits AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and AI Compatibility alongside classic SEO. It also checks whether your site is accessible to 10 major AI bots including GPTBot, ClaudeBot, Google-Extended, and Perplexity.',
  },
  {
    question: 'How many pages does the free plan scan?',
    answer:
      'The free plan includes 20 page credits per month, where 1 credit = 1 page scanned. If your site has more pages than your credits, Aeorch will ask you to confirm before capping the scan at your available credits. You\'ll never be charged without explicit confirmation.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="badge bg-slate-200 text-slate-700 mb-4">FAQ</span>
          <h2 className="section-title mb-4">Frequently asked questions</h2>
          <p className="section-subtitle mx-auto text-center">
            Everything you need to know about SEO, AEO, GEO and Aeorch.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-navy-900 text-sm leading-relaxed">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
