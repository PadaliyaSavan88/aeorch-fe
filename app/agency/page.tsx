'use client';

import Link from 'next/link';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT } from '@/lib/siteTheme';

const STATS = [
  { label: 'Sites monitored', value: '12' },
  { label: 'Average AEO score', value: '68' },
  { label: 'Open alerts', value: '3' },
];

const SITE_ROWS = [
  { name: 'brightpeak-marketing.com', score: '72', trend: '▲ +6', up: true, lastScan: '2 days ago', status: 'Healthy' },
  { name: 'northlanedigital.com', score: '81', trend: '▲ +2', up: true, lastScan: '1 day ago', status: 'Healthy' },
  { name: 'vertex-legalgroup.com', score: '54', trend: '▼ -4', up: false, lastScan: '5 days ago', status: 'Needs attention' },
  { name: 'hearthstone-realty.com', score: '63', trend: '▲ +1', up: true, lastScan: '3 days ago', status: 'Healthy' },
  { name: 'primecare-dental.com', score: '47', trend: '▼ -9', up: false, lastScan: '6 days ago', status: 'Needs attention' },
  { name: 'urbanroots-landscaping.com', score: '77', trend: '▲ +3', up: true, lastScan: '1 day ago', status: 'Healthy' },
];

function DashboardBody() {
  const { theme } = useSiteTheme();
  return (
    <AppShell active="agency-preview" maxWidth={1160}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
            Agency dashboard <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>· preview, not yet connected to live data</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Client sites</h1>
        </div>
        <button
          disabled
          title="Coming soon"
          style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: 'not-allowed', opacity: 0.6 }}
        >
          + Add site
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
        <div className="hidden sm:grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: `1px solid ${theme.border}`, fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <div>Site</div><div>Score</div><div>Trend</div><div>Last scan</div><div>Status</div>
        </div>
        {SITE_ROWS.map(row => (
          <Link
            key={row.name}
            href="/dashboard"
            className="grid grid-cols-1 sm:[grid-template-columns:2fr_1fr_1fr_1fr_1fr] transition-colors hover:![background:#ffffff08]"
            style={{ padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, alignItems: 'center', color: theme.textPrimary, gap: 4 }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{row.score}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: row.up ? SITE_ACCENT : '#E0533C' }}>{row.trend}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary }}>{row.lastScan}</div>
            <div>
              <span
                style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
                  background: row.status === 'Healthy' ? '#3CD07026' : '#D99E3226',
                  color: row.status === 'Healthy' ? '#3CD070' : '#D99E32',
                }}
              >
                {row.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

export default function AgencyDashboardPage() {
  return (
    <SiteThemeProvider>
      <DashboardBody />
    </SiteThemeProvider>
  );
}
