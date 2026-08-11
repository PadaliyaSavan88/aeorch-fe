'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, BarChart3, FileText } from 'lucide-react';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { theme } = useSiteTheme();
  return (
    <section style={{ maxWidth: 920, margin: '0 auto', padding: '120px 24px 90px', textAlign: 'center', position: 'relative' }}>
      <div
        style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 500, background: 'radial-gradient(circle,#3CD07022,transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div
        style={{
          display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase',
          color: SITE_ACCENT, background: '#3CD07026', border: '1px solid #3CD07066', padding: '6px 14px',
          borderRadius: 20, marginBottom: 24, position: 'relative',
        }}
      >
        Built for agencies
      </div>
      <h1 className="[text-wrap:pretty]" style={{ fontSize: 58, lineHeight: 1.06, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
        Prove your clients are visible in AI search.
      </h1>
      <p className="[text-wrap:pretty]" style={{ fontSize: 19, lineHeight: 1.6, color: theme.textSecondary, maxWidth: 640, margin: '0 auto 40px' }}>
        Aeorch scans any site for AEO/GEO readiness, ranks the fixes that actually move the needle, and turns it into a report your clients understand, with your logo on it.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/scan"
          style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '14px 26px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
          onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
        >
          Run a free scan
        </Link>
        <Link
          href="/pricing"
          className="transition-colors hover:!border-[#3CD070]"
          style={{ border: `1px solid ${theme.border}`, color: theme.textPrimary, padding: '14px 26px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
        >
          See pricing
        </Link>
      </div>
      <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 16 }}>No card required · results in under a minute</p>
    </section>
  );
}

// ─── Sample "Top priority fixes" preview card ──────────────────────────────────

const SAMPLE_ISSUES = [
  { rank: 1, title: 'Missing FAQ schema on 12 service pages', impact: '+9 pts' },
  { rank: 2, title: 'llm.txt blocks GPTBot from /blog', impact: '+7 pts' },
  { rank: 3, title: 'No citable stats on pricing page', impact: '+5 pts' },
  { rank: 4, title: 'Author bios missing structured data', impact: '+3 pts' },
];

function SamplePreview() {
  const { theme } = useSiteTheme();
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 100px' }}>
      <p style={{ fontSize: 11, color: theme.textSecondary, textAlign: 'center', marginBottom: 10 }}>Illustrative example</p>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 8 }}>
        <div style={{ borderRadius: 6, overflow: 'hidden', background: theme.bg, padding: 28, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
              Top priority fixes
            </div>
            {SAMPLE_ISSUES.map(issue => (
              <div key={issue.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: '#3CD07026', color: SITE_ACCENT, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {issue.rank}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{issue.title}</div>
                <div style={{ fontSize: 12, color: SITE_ACCENT, fontWeight: 600 }}>{issue.impact}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: theme.card, borderRadius: 6, border: `1px solid ${theme.border}`, boxShadow: '0 12px 32px -8px #3CD07033' }}>
            <div style={{ fontSize: 56, fontWeight: 700 }}>72</div>
            <div style={{ fontSize: 11, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em' }}>AEO Score</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Feature grid ───────────────────────────────────────────────────────────────

const FEATURES = [
  { title: 'Prioritized fixes', desc: 'Every issue scored by impact × ease, so you fix the 3 things that matter instead of scrolling a wall of 6,000.', bg: '#3CD07026' },
  { title: 'Competitor comparison', desc: "See how a client's AI visibility stacks up against named competitors, side by side.", bg: '#D99E3226' },
  { title: 'White-label PDF export', desc: 'Drop in your agency logo and hand clients a report that looks like it came from you.', bg: '#2A473680' },
  { title: 'Multi-site dashboard', desc: 'Monitor every client site from one view, with monthly re-scans and regression alerts.', bg: '#E0533C26' },
];

function Features() {
  const { theme } = useSiteTheme();
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 24px 100px' }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
        Everything you need to report AI visibility
      </h2>
      <p style={{ textAlign: 'center', color: theme.textSecondary, fontSize: 16, margin: '0 0 56px' }}>
        One scan, four ways to prove the work is working.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        {FEATURES.map(f => (
          <div
            key={f.title}
            className="transition-transform hover:!-translate-y-1 hover:![box-shadow:0_10px_24px_-12px_#00000055]"
            style={{ border: `1px solid ${theme.border}`, borderRadius: 6, padding: 28, background: theme.card }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 8, background: f.bg, marginBottom: 16 }} />
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.55 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

function Testimonial() {
  const { theme } = useSiteTheme();
  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '20px 24px 100px', textAlign: 'center' }}>
      <div style={{ width: 40, height: 2, background: SITE_ACCENT, margin: '0 auto 28px' }} />
      <p className="[text-wrap:pretty]" style={{ fontSize: 24, lineHeight: 1.5, fontWeight: 500, letterSpacing: '-0.005em', margin: '0 0 24px' }}>
        &ldquo;We used to dread the monthly AI-visibility call. Now we open the report, scroll to the top three fixes, and the client sees exactly what we&apos;re doing for them.&rdquo;
      </p>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Jordan Reyes</div>
      <div style={{ fontSize: 13, color: theme.textSecondary }}>Founder, Bright Peak Marketing</div>
    </section>
  );
}

// ─── Free tool teaser ─────────────────────────────────────────────────────────

function FreeToolTeaser() {
  return (
    <section style={{ background: SITE_CTA_BG, padding: '80px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#D99E32', background: '#D99E3226', padding: '6px 14px', borderRadius: 20, marginBottom: 20 }}>
          Free, no login
        </div>
        <h2 style={{ color: '#F9F9F8', fontSize: 32, fontWeight: 700, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
          Generate an llm.txt file for any site
        </h2>
        <p style={{ color: '#D7DED9', fontSize: 16, margin: '0 0 32px', lineHeight: 1.6 }}>
          The free tool agencies use to check and fix AI-crawler access before running a full audit.
        </p>
        <Link
          href="/free-tool"
          className="transition-transform hover:!-translate-y-0.5"
          style={{ display: 'inline-block', background: '#F9F9F8', color: SITE_CTA_BG, padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
        >
          Try the free tool
        </Link>
      </div>
    </section>
  );
}

// ─── Pricing teaser ───────────────────────────────────────────────────────────

function PricingTeaser() {
  const { theme } = useSiteTheme();
  return (
    <section style={{ maxWidth: 920, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 16px' }}>
        Priced for agencies, not solo hobbyists
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: 16, margin: '0 0 36px' }}>
        Starter for single-site freelancers. Agency for teams managing client portfolios.
      </p>
      <Link
        href="/pricing"
        style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '14px 26px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
        onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
        onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
      >
        View plans
      </Link>
    </section>
  );
}

// ─── How it works (kept from the previous landing page — real, working product steps) ──

const STEPS = [
  { step: '01', Icon: Globe, title: 'Enter your URL', description: 'Paste your website address. Aeorch discovers all your pages via sitemap and crawls up to your credit limit.' },
  { step: '02', Icon: BarChart3, title: 'Get your scores', description: 'Within minutes, receive scores for SEO, AEO, GEO, AI Compatibility and Authority — each with detailed issue breakdowns.' },
  { step: '03', Icon: FileText, title: 'Fix and generate', description: 'Get actionable recommendations for every issue. Download auto-generated llm.txt and ai-plugin.json files to boost AI discoverability instantly.' },
];

function HowItWorks() {
  const { theme } = useSiteTheme();
  return (
    <section id="how-it-works" style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 24px 100px' }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.01em', margin: '0 0 12px' }}>How it works</h2>
      <p style={{ textAlign: 'center', color: theme.textSecondary, fontSize: 16, margin: '0 0 56px' }}>
        From URL to a full SEO + AEO + GEO audit report in under 2 minutes.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 32 }}>
        {STEPS.map(s => (
          <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 18 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 68, height: 68, borderRadius: 16, background: '#3CD07026', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.Icon className="w-7 h-7" style={{ color: SITE_ACCENT }} />
              </div>
              <span
                style={{
                  position: 'absolute', top: -8, right: -8, width: 26, height: 26, borderRadius: '50%',
                  background: theme.bg, border: `2px solid ${SITE_ACCENT}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 700, color: SITE_ACCENT,
                }}
              >
                {s.step}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6 }}>{s.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ (kept from the previous landing page — backs the FAQPage JSON-LD) ─────

// Kept in sync with the FAQPage JSON-LD in app/page.tsx — structured data should match visible content.
const FAQS = [
  { question: 'What is AEO (Answer Engine Optimization)?', answer: "AEO stands for Answer Engine Optimization — the practice of structuring your content so AI-powered search engines like ChatGPT, Perplexity, and Google's AI Overviews can extract and surface your answers as direct citations rather than just links." },
  { question: 'What is GEO (Generative Engine Optimization)?', answer: 'GEO (Generative Engine Optimization) focuses on making your content trustworthy enough for large language models (LLMs) to reference and generate around. Key GEO signals include content depth, named author attribution, publication dates, and external citations to authoritative sources.' },
  { question: 'What is the difference between SEO, AEO and GEO?', answer: 'SEO targets traditional search engines like Google for ranked results. AEO targets AI answer engines (ChatGPT, Perplexity, AI Overviews) for direct citations using structured data like FAQPage and HowTo schemas. GEO targets LLMs for content generation trust, using signals like authorship, depth, and external citations.' },
  { question: 'How do I improve my AEO score?', answer: 'To improve your AEO score: (1) Add FAQPage structured data to Q&A pages, (2) Use question-based H2/H3 headings (What, How, Why), (3) Add HowTo and Article schema for instructional content, (4) Write concise direct answers after each question heading, (5) Ensure AI bots like GPTBot and ClaudeBot can crawl your site via robots.txt.' },
  { question: 'How do I check my GEO relevance score?', answer: 'Aeorch checks your GEO score by analyzing content depth (minimum word count per page), definitional sentences ("What is X"), statistical references, named author attribution, publication dates, and external citations to authoritative sources. Each signal contributes to your GEO score out of 100.' },
  { question: 'What is an llm.txt file and why do I need one?', answer: 'An llm.txt file (at yourdomain.com/llm.txt) tells AI models which pages on your site are most important and how to summarise your content — similar to robots.txt but designed for large language models. Aeorch auto-generates a complete llm.txt from your crawled pages.' },
  { question: 'Is Aeorch a free SEO audit tool?', answer: 'Yes — Aeorch is free with 20 page credits per month. One credit equals one page scanned. You earn an additional 20 credits for every friend you refer (and they get 20 too). There is no credit card required.' },
  { question: 'How is Aeorch different from other SEO audit tools?', answer: 'Most SEO tools only audit traditional Google signals. Aeorch is built for the AI era — it audits AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and AI Compatibility alongside classic SEO. It checks whether 10+ major AI bots including GPTBot, ClaudeBot, Google-Extended, and PerplexityBot can access your site, and generates llm.txt and ai-plugin.json files automatically.' },
];

function FAQ() {
  const { theme } = useSiteTheme();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 120px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>Questions</h2>
      {FAQS.map((f, i) => (
        <div key={f.question} style={{ borderBottom: `1px solid ${theme.border}` }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{
              width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
              padding: '18px 0', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: theme.textPrimary,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{f.question}</span>
            <ChevronDown
              className="transition-transform flex-shrink-0"
              style={{ width: 16, height: 16, color: theme.textSecondary, marginTop: 2, transform: open === i ? 'rotate(180deg)' : undefined }}
            />
          </button>
          {open === i && (
            <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6, margin: '0 0 18px' }}>{f.answer}</p>
          )}
        </div>
      ))}
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function LandingBody() {
  return (
    <>
      <Hero />
      <SamplePreview />
      <Features />
      <Testimonial />
      <FreeToolTeaser />
      <PricingTeaser />
      <HowItWorks />
      <FAQ />
    </>
  );
}
