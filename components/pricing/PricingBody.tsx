'use client';

import Link from 'next/link';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT } from '@/lib/siteTheme';

const STARTER_FEATURES = [
  '1 site monitored',
  'Monthly re-scan',
  'Prioritized issue list',
  'Score history',
  'Email alerts on regression',
];

const AGENCY_FEATURES = [
  'Up to 15 client sites',
  'Everything in Starter',
  'Competitor comparison',
  'White-label PDF export',
  'Multi-site dashboard',
  'Priority support',
  'Founding pricing locked for 6 months',
];

const FAQS = [
  { q: 'Can I switch plans later?', a: 'Yes, upgrade or downgrade anytime, billing prorates automatically.' },
  { q: 'What counts as a "site"?', a: 'One root domain. Subdomains you monitor separately count as additional sites.' },
  { q: 'Do you offer white-label branding on Starter?', a: 'White-label PDF export is an Agency-tier feature, Starter reports carry the Aeorch mark.' },
  { q: 'Is there a free option?', a: 'Yes, the llm.txt generator is free with no login. Full scans require a plan.' },
];

function PlanCard({
  tier, price, blurb, features, featured, ctaLabel,
}: {
  tier: string; price: string; blurb: string; features: string[]; featured?: boolean; ctaLabel: string;
}) {
  const { theme } = useSiteTheme();
  return (
    <div
      className={featured ? undefined : 'transition-colors'}
      style={{
        border: featured ? `2px solid ${SITE_ACCENT}` : `1px solid ${theme.border}`,
        borderRadius: 6,
        padding: 36,
        background: theme.card,
        position: 'relative',
      }}
    >
      {featured && (
        <div
          style={{
            position: 'absolute', top: -13, right: 28, background: SITE_ACCENT, color: '#121314',
            fontSize: 11, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 20,
          }}
        >
          Most popular
        </div>
      )}
      <div style={{ fontSize: 13, fontWeight: 600, color: featured ? SITE_ACCENT : theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>
        {tier}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 44, fontWeight: 700 }}>{price}</span>
        <span style={{ color: theme.textSecondary, fontSize: 14 }}>/mo</span>
      </div>
      <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 28 }}>{blurb}</div>
      <Link
        href="/signup"
        className={featured ? undefined : 'transition-colors hover:!border-[#3CD070] hover:![background:#3CD07014]'}
        style={
          featured
            ? { display: 'block', textAlign: 'center', background: '#2A4736', color: '#F9F9F8', padding: 12, borderRadius: 8, fontWeight: 600, fontSize: 14, marginBottom: 28 }
            : { display: 'block', textAlign: 'center', border: `1px solid ${theme.border}`, color: theme.textPrimary, padding: 12, borderRadius: 8, fontWeight: 600, fontSize: 14, marginBottom: 28 }
        }
      >
        {ctaLabel}
      </Link>
      {features.map(f => (
        <div key={f} style={{ display: 'flex', gap: 10, padding: '8px 0', fontSize: 14 }}>
          <span style={{ color: SITE_ACCENT }}>✓</span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}

export default function PricingBody() {
  const { theme } = useSiteTheme();
  return (
    <>
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '90px 24px 50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px' }}>Simple pricing for agencies</h1>
        <p style={{ fontSize: 17, color: theme.textSecondary, margin: 0 }}>Cancel anytime. Founding pricing locked in for your first 6 months.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2" style={{ maxWidth: 920, margin: '0 auto', padding: '0 24px 100px', gap: 24 }}>
        <PlanCard tier="Starter" price="$29" blurb="For freelancers running one site" features={STARTER_FEATURES} ctaLabel="Start with Starter" />
        <PlanCard tier="Agency" price="$79" blurb="For agencies reporting to multiple clients" features={AGENCY_FEATURES} featured ctaLabel="Start with Agency" />
      </section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 120px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>Questions</h2>
        {FAQS.map(item => (
          <div key={item.q} style={{ borderBottom: `1px solid ${theme.border}`, padding: '18px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6 }}>{item.a}</div>
          </div>
        ))}
      </section>
    </>
  );
}
