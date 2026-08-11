'use client';

import Link from 'next/link';
import { Search, MessageSquare, MapPin, Bot, ShieldCheck, Check, X, ArrowRight } from 'lucide-react';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

const PILLARS = [
  {
    icon: Search,
    color: '#3CD070',
    title: 'SEO Score',
    description: 'Audit titles, meta descriptions, H1 tags, canonical URLs, Open Graph tags and more. Fix the fundamentals that Google still rewards.',
    checks: ['Title & meta tags', 'Heading structure', 'Canonical URLs', 'OG tags'],
  },
  {
    icon: MessageSquare,
    color: '#B57FE0',
    title: 'AEO Score',
    description: 'Answer Engine Optimization. Measure how well your content is structured for ChatGPT, Perplexity and other AI answer engines.',
    checks: ['FAQPage schema', 'Q&A headings', 'HowTo markup', 'Article schema'],
  },
  {
    icon: MapPin,
    color: '#7FB2FF',
    title: 'GEO Score',
    description: 'Generative Engine Optimization. Ensure your content depth, citations, and signals make AI models confident enough to surface your site.',
    checks: ['Content depth', 'Author attribution', 'External citations', 'Publication dates'],
  },
  {
    icon: Bot,
    color: '#D99E32',
    title: 'AI Compatibility',
    description: 'Check if 10+ AI bots can actually access your site. Generate llm.txt and ai-plugin.json to help AI engines understand your content.',
    checks: ['robots.txt AI directives', 'llm.txt file', 'ai-plugin.json', '10 AI bots checked'],
  },
  {
    icon: ShieldCheck,
    color: '#E0533C',
    title: 'Authority Score',
    description: 'Trust signals that both Google and AI engines use to verify credibility — from About and Contact pages to HTTPS, social profiles and Organization schema.',
    checks: ['About & Contact pages', 'HTTPS sitewide', 'Social profile links', 'Organization schema'],
  },
];

const FREE_FEATURES = [
  { label: '20 pages per month', included: true },
  { label: '+20 pages per referral (no cap)', included: true },
  { label: 'All 5 audit dimensions', included: true },
  { label: 'Full HTML report', included: true },
  { label: 'Generated llm.txt & ai-plugin.json', included: true },
  { label: 'Unlimited scans (within credits)', included: true },
  { label: 'API access', included: false },
  { label: 'Scheduled scans', included: false },
  { label: 'White-label reports', included: false },
];

const PREMIUM_FEATURES = [
  'Unlimited page credits',
  'API access for integrations',
  'Scheduled automated scans',
  'White-label PDF reports',
  'Priority support',
  'Multiple websites',
];

export default function FeaturesBody() {
  const { theme } = useSiteTheme();
  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card };

  return (
    <>
      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '90px 24px 50px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: SITE_ACCENT, background: '#3CD07026', border: '1px solid #3CD07066', padding: '6px 14px', borderRadius: 20, marginBottom: 20 }}>
          Features & Pricing
        </div>
        <h1 className="[text-wrap:pretty]" style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          One audit. Five scores. Free every month.
        </h1>
        <p className="[text-wrap:pretty]" style={{ fontSize: 17, color: theme.textSecondary, margin: '0 auto 32px', maxWidth: 620, lineHeight: 1.6 }}>
          Aeorch checks your website across every dimension that matters in the AI era — from classic SEO to whether ChatGPT can actually find you.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/signup"
            className="flex items-center gap-2"
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '14px 26px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
            onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:!border-[#3CD070]"
            style={{ border: `1px solid ${theme.border}`, color: theme.textPrimary, padding: '14px 26px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
          >
            View pricing
          </Link>
        </div>
      </section>

      {/* 5 Dimensions */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 24px 100px' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
          One audit. Five scores.
        </h2>
        <p style={{ textAlign: 'center', color: theme.textSecondary, fontSize: 16, margin: '0 0 48px' }}>
          Aeorch checks your website across every dimension that matters — from classic SEO to AI discoverability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {PILLARS.map(p => (
            <div key={p.title} style={{ ...card, padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p.icon className="w-5 h-5" style={{ color: p.color }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{p.title}</div>
                <p style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>{p.description}</p>
              </div>
              <ul style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 0, listStyle: 'none' }}>
                {p.checks.map(check => (
                  <li key={check} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: theme.textSecondary }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 920, margin: '0 auto', padding: '0 24px 100px' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
          Free to start. Powerful from day one.
        </h2>
        <p style={{ textAlign: 'center', color: theme.textSecondary, fontSize: 16, margin: '0 auto 48px', maxWidth: 560 }}>
          Start with 20 free page credits every month. Earn more by referring friends, or connect with us for a custom premium plan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          <div style={{ ...card, border: `2px solid ${SITE_ACCENT}`, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Free</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary, margin: '4px 0 0' }}>Everything you need to get started</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#121314', background: SITE_ACCENT, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>Current plan</span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 700 }}>$0</span>
              <span style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 8 }}>/ month</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 24px', padding: 0, listStyle: 'none' }}>
              {FREE_FEATURES.map(f => (
                <li key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                  {f.included
                    ? <Check className="w-4 h-4 flex-shrink-0" style={{ color: SITE_ACCENT }} />
                    : <X className="w-4 h-4 flex-shrink-0" style={{ color: theme.border }} />}
                  <span style={{ color: f.included ? theme.textPrimary : theme.textSecondary }}>{f.label}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2"
              style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '13px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}
              onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div style={{ ...card, background: SITE_CTA_BG, border: 'none', padding: 32 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#F9F9F8' }}>Premium</h3>
              <p style={{ fontSize: 13, color: '#D7DED9', margin: 0 }}>Custom plans for agencies and power users</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#F9F9F8' }}>Custom</span>
              <span style={{ fontSize: 13, color: '#D7DED9', marginLeft: 8 }}>pricing</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 24px', padding: 0, listStyle: 'none' }}>
              {PREMIUM_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#F9F9F8' }}>
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#7FB2FF' }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2"
              style={{ background: '#F9F9F8', color: SITE_CTA_BG, padding: '13px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}
            >
              Contact for pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: theme.textSecondary, marginTop: 32 }}>
          💡 Refer a friend and both of you get +20 free page credits. No cap on referrals.{' '}
          <Link href="/signup" style={{ color: SITE_ACCENT, fontWeight: 600 }}>Start referring →</Link>
        </p>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 12px' }}>Ready to audit your site?</h2>
          <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 24px' }}>
            Free, no credit card required. 20 page credits per month to get you started.
          </p>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2"
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, width: 'fit-content', margin: '0 auto' }}
            onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
