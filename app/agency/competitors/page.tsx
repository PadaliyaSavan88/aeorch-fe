'use client';

import { Fragment, useState } from 'react';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT } from '@/lib/siteTheme';

const SITES = [
  { label: 'You', domain: 'brightpeak-marketing.com', you: true },
  { label: 'Competitor A', domain: 'northlanedigital.com', you: false },
  { label: 'Competitor B', domain: 'summitreachagency.com', you: false },
];

const METRICS: { label: string; values: { val: string; best: boolean }[] }[] = [
  { label: 'AEO score', values: [{ val: '72', best: false }, { val: '81', best: true }, { val: '58', best: false }] },
  { label: 'Crawlability', values: [{ val: '88', best: true }, { val: '74', best: false }, { val: '70', best: false }] },
  { label: 'Structured data', values: [{ val: '61', best: false }, { val: '79', best: true }, { val: '55', best: false }] },
  { label: 'Citations found', values: [{ val: '3/12', best: false }, { val: '9/12', best: true }, { val: '2/12', best: false }] },
  { label: 'Content quality', values: [{ val: '79', best: true }, { val: '77', best: false }, { val: '64', best: false }] },
];

function CompetitorsBody() {
  const { theme } = useSiteTheme();
  const [url, setUrl] = useState('');

  return (
    <AppShell active="competitors" maxWidth={1080}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
          Competitor comparison <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>· preview, not yet connected to live scans</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>brightpeak-marketing.com vs. 2 competitors</h1>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Add a competitor URL…"
          className="focus:!border-[#3CD070] focus:!outline-none"
          style={{ flex: 1, minWidth: 200, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '11px 14px', fontSize: 14, color: theme.textPrimary, fontFamily: 'ui-monospace,monospace' }}
        />
        <button
          disabled
          title="Coming soon"
          style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: 'not-allowed', opacity: 0.6 }}
        >
          Add competitor
        </button>
      </div>

      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', minWidth: 560 }}>
          <div style={{ padding: '16px 20px', fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: `1px solid ${theme.border}` }}>Metric</div>
          {SITES.map(site => (
            <div key={site.domain} style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: site.you ? SITE_ACCENT : theme.textPrimary }}>{site.label}</div>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: theme.textSecondary }}>{site.domain}</div>
            </div>
          ))}
          {METRICS.map(metric => (
            <Fragment key={metric.label}>
              <div style={{ padding: '14px 20px', fontSize: 13.5, fontWeight: 500, borderBottom: `1px solid ${theme.border}` }}>{metric.label}</div>
              {metric.values.map((v, i) => (
                <div key={`${metric.label}-${i}`} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${theme.border}` }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: v.best ? SITE_ACCENT : theme.textPrimary }}>{v.val}</span>
                  {v.best && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: SITE_ACCENT, background: '#3CD07026', padding: '2px 6px', borderRadius: 10 }}>BEST</span>
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: '20px 24px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Takeaway</div>
        <p style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>
          brightpeak-marketing.com leads on crawlability but trails both competitors on citations, the fastest path to closing the gap is the structured-data fixes flagged in the scan report.
        </p>
      </div>
    </AppShell>
  );
}

export default function CompetitorComparisonPage() {
  return (
    <SiteThemeProvider>
      <CompetitorsBody />
    </SiteThemeProvider>
  );
}
