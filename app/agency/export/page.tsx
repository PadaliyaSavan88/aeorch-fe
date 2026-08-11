'use client';

import { useState } from 'react';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';

const SUBSCORES = [
  { label: 'Crawlability', value: '88' },
  { label: 'Structured data', value: '61' },
  { label: 'Content quality', value: '79' },
  { label: 'Citations', value: '25' },
];

const ISSUES = [
  { rank: 1, title: 'Missing FAQ schema on 12 service pages', impact: '+9 pts' },
  { rank: 2, title: 'llm.txt blocks GPTBot from /blog', impact: '+7 pts' },
  { rank: 3, title: 'No citable stats on pricing page', impact: '+5 pts' },
  { rank: 4, title: 'Author bios missing structured data', impact: '+3 pts' },
  { rank: 5, title: 'Duplicate title tags across 6 pages', impact: '+2 pts' },
];

const GENERATED_LABEL = 'Generated Aug 7, 2026';

/** The client-facing "page" is always white/light — it's what gets printed and handed to a client,
    independent of which theme the agency user has the portal set to. */
function ReportPage() {
  return (
    <section
      style={{
        background: '#FFFFFF', color: '#1C1D1B', padding: '0.7in', boxSizing: 'border-box',
        width: '8.5in', maxWidth: '100%', minHeight: '11in', display: 'flex', flexDirection: 'column',
        borderRadius: 4, boxShadow: '0 1px 3px #00000022',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <div style={{ width: 150, height: 44, border: '1px dashed #E2DFD8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#8E8B84' }}>
          agency logo
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: '#6B6E69' }}>
          <div>AI Visibility Report</div>
          <div>{GENERATED_LABEL}</div>
        </div>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em' }}>brightpeak-marketing.com</h1>
      <p style={{ fontSize: 13, color: '#6B6E69', margin: '0 0 32px' }}>Prepared for Bright Peak Marketing · Monthly AEO/GEO audit</p>

      <div className="grid grid-cols-1 sm:[grid-template-columns:160px_1fr]" style={{ gap: 28, marginBottom: 32 }}>
        <div style={{ border: '1px solid #E2DFD8', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ fontSize: 40, fontWeight: 600, color: '#2E9A54' }}>72</div>
          <div style={{ fontSize: 11, color: '#6B6E69', textTransform: 'uppercase', letterSpacing: '.04em' }}>AEO score</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 14 }}>
          {SUBSCORES.map(s => (
            <div key={s.label} style={{ border: '1px solid #E2DFD8', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10.5, color: '#6B6E69', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Top priority fixes</div>
      {ISSUES.map(issue => (
        <div key={issue.rank} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid #EDEBE5', alignItems: 'center' }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: '#3CD07026', color: '#2A4736', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {issue.rank}
          </div>
          <div style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{issue.title}</div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#2E9A54' }}>{issue.impact}</div>
        </div>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #E2DFD8', display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#8E8B84' }}>
        <span>Prepared by Bright Peak Marketing</span>
        <span>Page 1 of 1</span>
      </div>
    </section>
  );
}

function PreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: '#00000099', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#FFFFFF', color: '#1C1D1B', width: 'min(680px,100%)', maxHeight: '90vh', overflow: 'auto', borderRadius: 10, boxShadow: '0 30px 80px -20px #00000066' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #E2DFD8', position: 'sticky', top: 0, background: '#FFFFFF' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6B6E69' }}>Client-facing preview</span>
          <button
            onClick={onClose}
            className="transition-colors hover:!text-[#1C1D1B]"
            style={{ background: 'none', border: 'none', fontSize: 20, color: '#6B6E69', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '0.6in' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ width: 130, height: 36, background: '#F7F6F2', border: '1px dashed #E2DFD8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#8E8B84' }}>
              agency logo
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, color: '#6B6E69' }}>
              <div>AI Visibility Report</div>
              <div>{GENERATED_LABEL}</div>
            </div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em' }}>brightpeak-marketing.com</h2>
          <p style={{ fontSize: 12.5, color: '#6B6E69', margin: '0 0 24px' }}>Prepared for Bright Peak Marketing · Monthly AEO/GEO audit</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 36, fontWeight: 600, color: '#2E9A54' }}>72</div>
            <div style={{ fontSize: 11, color: '#6B6E69', textTransform: 'uppercase', letterSpacing: '.04em' }}>AEO score</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Top priority fixes</div>
          {ISSUES.map(issue => (
            <div key={issue.rank} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid #EDEBE5', alignItems: 'center' }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: '#3CD07026', color: '#2A4736', fontSize: 10.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {issue.rank}
              </div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{issue.title}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#2E9A54' }}>{issue.impact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExportBody() {
  const { theme } = useSiteTheme();
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <AppShell active="export" maxWidth={900}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
            Export <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>· preview, PDF generation not wired up yet</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>White-label PDF preview</h1>
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
            disabled
            title="Coming soon"
            style={{ background: '#3CD070', color: '#121314', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'not-allowed', opacity: 0.6 }}
          >
            Download PDF
          </button>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: theme.textSecondary, margin: '0 0 24px' }}>
        This is what the client sees, no Aeorch branding, only your agency&apos;s logo and colors.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <ReportPage />
      </div>

      {previewOpen && <PreviewModal onClose={() => setPreviewOpen(false)} />}
    </AppShell>
  );
}

export default function PdfExportPage() {
  return (
    <SiteThemeProvider>
      <ExportBody />
    </SiteThemeProvider>
  );
}
