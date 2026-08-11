'use client';

import Link from 'next/link';
import { Target, Zap, Users, ArrowRight } from 'lucide-react';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

const PILLARS = [
  { icon: Target, title: 'Our mission', desc: 'Help every website owner understand and improve their presence in the AI era of search.' },
  { icon: Zap, title: 'Free first', desc: '20 page credits per month, forever free. Earn more by referring friends — no cap.' },
  { icon: Users, title: 'Built for everyone', desc: 'From solo bloggers to marketing teams. No SEO expertise required.' },
];

export default function AboutBody() {
  const { theme } = useSiteTheme();
  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card };

  return (
    <>
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '90px 24px 50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>About Aeorch</h1>
        <p style={{ fontSize: 17, color: theme.textSecondary, margin: 0, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          We built the SEO audit tool we wished existed when AI search became mainstream.
        </p>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 24px' }}>
        <div className="prose-blog">
          <h2>Why we built Aeorch</h2>
          <p>
            When AI-powered search tools — ChatGPT, Perplexity, Google AI Overviews — became mainstream, most website owners had no way to know whether their sites were optimised for this new layer of discovery. Traditional SEO tools check Google signals. Nobody was checking AI signals.
          </p>
          <p>
            Aeorch was built to fill that gap. We check not just whether your website ranks in Google, but whether it&apos;s discoverable, readable, and citable by the AI engines that are increasingly where people go for answers.
          </p>
          <h2>What Aeorch checks</h2>
          <p>Every Aeorch scan checks five dimensions:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 20, margin: '32px 0 48px' }}>
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ ...card, padding: 24, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3CD07022', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon className="w-5 h-5" style={{ color: SITE_ACCENT }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 14.5, margin: '0 0 6px' }}>{title}</h3>
              <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2"
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
            onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            Try Aeorch free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
