'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, organizationApi, scanApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT } from '@/lib/siteTheme';

interface TopIssue {
  dimension: 'seo' | 'aeo' | 'geo' | 'authority' | 'aiCompatibility';
  severity: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  message: string;
  recommendation?: string;
}

interface ReportData {
  _id: string;
  url: string;
  completedAt: string;
  report: {
    finalScore: number;
    topIssues: TopIssue[];
    breakdown: {
      seo: { score: number };
      aeo: { score: number };
      geo: { score: number };
      authority: { score: number };
      aiCompatibility: { score: number };
    };
  };
}

interface ScanListItem {
  _id: string;
  url: string;
  status: string;
  finalScore?: number;
  createdAt: string;
}

interface Branding {
  name: string;
  brandColor: string;
  logoUrl?: string;
}

const DIMENSION_LABEL: Record<TopIssue['dimension'], string> = {
  seo: 'SEO', aeo: 'AEO', geo: 'GEO', authority: 'Authority', aiCompatibility: 'AI Compat.',
};
const SEVERITY_COLOR: Record<TopIssue['severity'], string> = { high: '#E0533C', medium: '#D99E32', low: '#3CD070' };
const EFFORT_LABEL: Record<TopIssue['effort'], string> = { easy: 'Quick fix', medium: 'Moderate fix', hard: 'Heavier fix' };

function scoreColor(score: number): string {
  if (score >= 80) return '#2E9A54';
  if (score >= 50) return '#B5790A';
  return '#C0392B';
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** The client-facing report content is always white/light — it's what gets handed to a client,
    independent of which theme the agency user has the portal set to. Shared between the inline
    preview and the pop-up modal so they never drift apart. */
function ReportPageContent({ data, branding }: { data: ReportData; branding: Branding | null }) {
  const { finalScore, breakdown, topIssues } = data.report;
  const preparedBy = branding?.name ?? 'Aeorch';
  const accent = branding?.brandColor || '#2E9A54';
  const categories = [
    { label: 'SEO', value: breakdown.seo.score },
    { label: 'AEO', value: breakdown.aeo.score },
    { label: 'GEO', value: breakdown.geo.score },
    { label: 'Authority', value: breakdown.authority.score },
    { label: 'AI Compat.', value: breakdown.aiCompatibility.score },
  ];

  return (
    <section
      style={{
        background: '#FFFFFF', color: '#1C1D1B', padding: '0.7in', boxSizing: 'border-box',
        width: '8.5in', maxWidth: '100%', minHeight: '11in', display: 'flex', flexDirection: 'column',
        borderRadius: 4, boxShadow: '0 1px 3px #00000022',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        {branding?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={branding.logoUrl} alt={preparedBy} style={{ maxHeight: 44, maxWidth: 220, objectFit: 'contain' }} />
        ) : (
          <div style={{ fontSize: 18, fontWeight: 800, color: accent }}>{preparedBy}</div>
        )}
        <div style={{ textAlign: 'right', fontSize: 12, color: '#6B6E69' }}>
          <div>AI Visibility Report</div>
          <div>Generated {formatDate(data.completedAt)}</div>
        </div>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em', wordBreak: 'break-all' }}>{data.url}</h1>
      <p style={{ fontSize: 13, color: '#6B6E69', margin: '0 0 32px' }}>Prepared by {preparedBy}</p>

      <div className="grid grid-cols-1 sm:[grid-template-columns:160px_1fr]" style={{ gap: 28, marginBottom: 32 }}>
        <div style={{ border: '1px solid #E2DFD8', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ fontSize: 40, fontWeight: 600, color: scoreColor(finalScore) }}>{finalScore}</div>
          <div style={{ fontSize: 11, color: '#6B6E69', textTransform: 'uppercase', letterSpacing: '.04em' }}>Overall score</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5" style={{ gap: 14 }}>
          {categories.map(c => (
            <div key={c.label} style={{ border: '1px solid #E2DFD8', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10.5, color: '#6B6E69', marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: scoreColor(c.value) }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Top priority fixes</div>
      {topIssues.length === 0 ? (
        <p style={{ fontSize: 12.5, color: '#2E9A54', fontWeight: 600 }}>No issues found — this site is in great shape.</p>
      ) : (
        topIssues.slice(0, 5).map((issue, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid #EDEBE5', alignItems: 'flex-start' }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: '#3CD07026', color: '#2A4736', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, background: '#F1F0EC', color: '#6B6E69', padding: '2px 7px', borderRadius: 20 }}>{DIMENSION_LABEL[issue.dimension]}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: SEVERITY_COLOR[issue.severity], background: `${SEVERITY_COLOR[issue.severity]}1a`, padding: '2px 7px', borderRadius: 20 }}>{issue.severity.toUpperCase()}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#6B6E69', background: '#F1F0EC', padding: '2px 7px', borderRadius: 20 }}>{EFFORT_LABEL[issue.effort]}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>{issue.message}</div>
            </div>
          </div>
        ))
      )}

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #E2DFD8', display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#8E8B84' }}>
        <span>Prepared by {preparedBy}</span>
        <span>Page 1 of 1</span>
      </div>
    </section>
  );
}

function PreviewModal({ data, branding, onClose }: { data: ReportData; branding: Branding | null; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: '#00000099', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24, overflow: 'auto' }}
    >
      <div onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflow: 'auto', borderRadius: 10, boxShadow: '0 30px 80px -20px #00000066' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #E2DFD8', position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6B6E69' }}>Client-facing preview</span>
          <button onClick={onClose} className="transition-colors hover:!text-[#1C1D1B]" style={{ background: 'none', border: 'none', fontSize: 20, color: '#6B6E69', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <ReportPageContent data={data} branding={branding} />
      </div>
    </div>
  );
}

function ExportBody() {
  const { theme } = useSiteTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scanId');

  const [data, setData] = useState<ReportData | null>(null);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [scanList, setScanList] = useState<ScanListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }

    authApi.me()
      .then(async () => {
        try {
          const orgRes = await organizationApi.getMine();
          const org = orgRes.data.data.organization;
          setBranding(org.whiteLabel ? { name: org.name, brandColor: org.brandColor, logoUrl: org.logoUrl } : null);
        } catch {
          setBranding(null); // no org — plain Aeorch branding, not an error
        }

        if (scanId) {
          const res = await scanApi.getReport(scanId);
          setData(res.data.data);
        } else {
          const res = await scanApi.list();
          const scans: ScanListItem[] = res.data.data;
          setScanList(scans.filter(s => s.status === 'completed'));
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load report.');
      })
      .finally(() => setLoading(false));
  }, [scanId, router]);

  async function handleDownload() {
    if (!data) return;
    setDownloading(true);
    try {
      const res = await scanApi.getReportPdf(data._id);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = `aeorch-report-${data._id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 };

  if (loading) {
    return (
      <AppShell active="export" maxWidth={900}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell active="export" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Couldn&apos;t load this report</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: 0 }}>{error}</p>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell active="export" maxWidth={640}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Export a report as PDF</h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6 }}>Pick a completed scan to preview and download.</p>
        </div>
        {!scanList || scanList.length === 0 ? (
          <div style={card}>
            <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: 0 }}>No completed scans yet. <Link href="/scan" style={{ color: SITE_ACCENT, fontWeight: 600 }}>Run a scan</Link> first.</p>
          </div>
        ) : (
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            {scanList.map(s => (
              <button
                key={s._id}
                onClick={() => router.push(`/agency/export?scanId=${s._id}`)}
                className="transition-colors hover:![background:#ffffff08]"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${theme.border}`, background: 'none', border: 'none', borderTop: 'none', cursor: 'pointer', textAlign: 'left', color: theme.textPrimary }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s.url}</span>
                <span style={{ fontSize: 12, color: theme.textSecondary }}>{s.finalScore ?? '—'}/100 · {formatDate(s.createdAt)}</span>
              </button>
            ))}
          </div>
        )}
      </AppShell>
    );
  }

  return (
    <AppShell active="export" maxWidth={900}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
            Export
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>White-label PDF export</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setPreviewOpen(true)}
            className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070]"
            style={{ border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            Preview in pop-up
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ background: '#3CD070', color: '#121314', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: downloading ? 'default' : 'pointer', opacity: downloading ? 0.7 : 1 }}
          >
            {downloading ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: theme.textSecondary, margin: '0 0 24px' }}>
        {branding ? "This is what the client sees, no Aeorch branding, only your agency's logo and colors." : 'This is what the client sees. Set up white-label branding in Settings to replace the Aeorch mark with your own.'}
      </p>

      <div style={{ overflowX: 'auto' }}>
        <ReportPageContent data={data} branding={branding} />
      </div>

      {previewOpen && <PreviewModal data={data} branding={branding} onClose={() => setPreviewOpen(false)} />}
    </AppShell>
  );
}

export default function PdfExportPage() {
  return (
    <SiteThemeProvider>
      <Suspense fallback={null}>
        <ExportBody />
      </Suspense>
    </SiteThemeProvider>
  );
}
