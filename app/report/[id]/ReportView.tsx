'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown, ChevronUp, ExternalLink,
  CheckCircle2, XCircle, Info,
  Bot, FileText, Globe, Search, Cpu, BookOpen, ShieldCheck,
} from 'lucide-react';
import { scanApi } from '@/lib/api';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT } from '@/lib/siteTheme';


// ─── Types ────────────────────────────────────────────────────────────────────

interface Issue {
  code: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  recommendation?: string;
  page?: string;
}

interface DimensionResult {
  score: number;
  totalChecks: number;
  issues: Issue[];
}

interface TopIssue {
  code: string;
  dimension: 'seo' | 'aeo' | 'geo' | 'authority' | 'aiCompatibility';
  severity: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  message: string;
  recommendation?: string;
  pagesAffected: number;
  samplePages: string[];
  priorityScore: number;
}

interface BotAccessResult {
  bot: string;
  engine: string;
  status: 'allowed' | 'blocked' | 'unspecified';
}

interface AiCompatibilityResult extends DimensionResult {
  meta: {
    hasLlmTxt: boolean;
    hasLlmsFullTxt?: boolean;
    hasAiPluginJson: boolean;
    botAccess: BotAccessResult[];
    generatedLlmTxt?: string;
    generatedAiPluginJson?: string | object;
  };
}

interface AuthorityResult extends DimensionResult {
  meta?: { generatedOrgSchema?: string };
}

interface PageFix {
  url: string;
  articleSchema?: string;
  metaTags?: string;
}

interface AnalyzerReport {
  finalScore: number;
  coverage: { discovered: number; analyzed: number; failed: number };
  topIssues: TopIssue[];
  pageFixes?: PageFix[];
  breakdown: {
    seo: DimensionResult;
    aeo: DimensionResult;
    geo: DimensionResult;
    authority: AuthorityResult;
    aiCompatibility: AiCompatibilityResult;
  };
}

interface ReportData {
  _id: string;
  url: string;
  status: string;
  finalScore: number;
  creditsUsed: number;
  createdAt: string;
  completedAt: string;
  report: AnalyzerReport;
}

// ─── Severity / score colors (fixed hex, matching the rest of the redesign) ────

const SEVERITY_COLOR: Record<Issue['severity'], string> = { high: '#E0533C', medium: '#D99E32', low: '#3CD070' };
const EFFORT_COLOR: Record<TopIssue['effort'], string> = { easy: '#3CD070', medium: '#D99E32', hard: '#E0533C' };
const EFFORT_LABEL: Record<TopIssue['effort'], string> = { easy: 'Quick fix', medium: 'Moderate fix', hard: 'Heavier fix' };

function scoreColor(score: number) {
  if (score >= 80) return { ring: '#3CD070', label: 'Good' };
  if (score >= 50) return { ring: '#D99E32', label: 'Needs Work' };
  return { ring: '#E0533C', label: 'Poor' };
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score, label, size = 90 }: { score: number; label: string; size?: number }) {
  const { theme } = useSiteTheme();
  const { ring } = scoreColor(score);
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.border} strokeWidth={9} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={ring} strokeWidth={9}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill={ring} fontSize={size * 0.21} fontWeight={700} fontFamily="inherit">
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 12, fontWeight: 600, color: theme.textSecondary }}>{label}</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, delta }: { label: string; value: string | number; sub?: string; color?: string; delta?: number }) {
  const { theme } = useSiteTheme();
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: color ?? theme.textPrimary }}>{value}</span>
        {delta !== undefined && delta !== 0 && (
          <span style={{ fontSize: 12.5, fontWeight: 600, color: delta > 0 ? '#3CD070' : '#E0533C' }}>
            {delta > 0 ? '▲' : '▼'} {delta > 0 ? '+' : ''}{delta}
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: 11, color: theme.textSecondary }}>{sub}</div>}
    </div>
  );
}

/** Hand-rolled inline SVG sparkline — no chart library in this repo, matches ScoreGauge's approach. */
function ScoreSparkline({ scores }: { scores: number[] }) {
  const { theme } = useSiteTheme();
  if (scores.length < 2) return null;

  const width = 200;
  const height = 40;
  const pad = 4;
  const points = scores.map((score, i) => {
    const x = pad + (i / (scores.length - 1)) * (width - pad * 2);
    const y = height - pad - (Math.max(0, Math.min(100, score)) / 100) * (height - pad * 2);
    return `${x},${y}`;
  });
  const lastUp = scores[scores.length - 1] >= scores[0];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={lastUp ? '#3CD070' : '#E0533C'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const [x, y] = p.split(',');
        return <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 3 : 2} fill={theme.card} stroke={lastUp ? '#3CD070' : '#E0533C'} strokeWidth={1.5} />;
      })}
    </svg>
  );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Issue['severity'] }) {
  const c = SEVERITY_COLOR[severity];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${c}22`, color: c, textTransform: 'capitalize' }}>
      {severity}
    </span>
  );
}

function EffortBadge({ effort }: { effort: TopIssue['effort'] }) {
  const c = EFFORT_COLOR[effort];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${c}22`, color: c }}>
      {EFFORT_LABEL[effort]}
    </span>
  );
}

// ─── Top Priority Fixes ───────────────────────────────────────────────────────

const dimensionLabel: Record<TopIssue['dimension'], string> = {
  seo: 'SEO', aeo: 'AEO', geo: 'GEO', authority: 'Authority', aiCompatibility: 'AI Compat.',
};

function PriorityFixCard({ rank, issue }: { rank: number; issue: TopIssue }) {
  const { theme } = useSiteTheme();
  const [open, setOpen] = useState(false);
  const ring = SEVERITY_COLOR[issue.severity];

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: ring, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {rank}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, background: theme.bg, padding: '2px 8px', borderRadius: 20 }}>{dimensionLabel[issue.dimension]}</span>
            <SeverityBadge severity={issue.severity} />
            <EffortBadge effort={issue.effort} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{issue.message}</div>
          {issue.recommendation && <p style={{ color: theme.textSecondary, fontSize: 13.5, margin: '4px 0 0' }}>{issue.recommendation}</p>}
          <div style={{ marginTop: 8 }}>
            {issue.samplePages.length > 0 ? (
              <button
                onClick={() => setOpen(o => !o)}
                className="transition-colors hover:!text-[#5ddb8c]"
                style={{ fontSize: 12, fontWeight: 600, color: SITE_ACCENT, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Affects {issue.pagesAffected} page{issue.pagesAffected !== 1 ? 's' : ''}
                {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            ) : (
              <span style={{ fontSize: 12, color: theme.textSecondary }}>Site-wide check</span>
            )}
            {open && (
              <ul style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4, padding: 0, listStyle: 'none' }}>
                {issue.samplePages.map((p, i) => (
                  <li key={i}>
                    <a href={p} target="_blank" rel="noopener noreferrer" className="transition-colors hover:!text-[#3CD070]" style={{ fontSize: 12, color: theme.textSecondary, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p}
                    </a>
                  </li>
                ))}
                {issue.pagesAffected > issue.samplePages.length && (
                  <li style={{ fontSize: 12, color: theme.textSecondary }}>+ {issue.pagesAffected - issue.samplePages.length} more page{issue.pagesAffected - issue.samplePages.length !== 1 ? 's' : ''}</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopIssuesSection({ topIssues }: { topIssues: TopIssue[] }) {
  const { theme } = useSiteTheme();
  if (topIssues.length === 0) {
    return (
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24, display: 'flex', alignItems: 'center', gap: 8, color: '#3CD070', fontSize: 14, fontWeight: 500 }}>
        <CheckCircle2 className="w-4 h-4" /> No issues found — this site is in great shape.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 12, color: theme.textSecondary, margin: '-4px 0 0' }}>
        Ranked by impact (severity × pages affected) × ease of fix — start at #1.
      </p>
      {topIssues.map((issue, i) => (
        <PriorityFixCard key={issue.code} rank={i + 1} issue={issue} />
      ))}
    </div>
  );
}

// ─── AI Citation Tracking (preview — not real data, see report/[id] plan notes) ─

function CitationPreview() {
  const { theme } = useSiteTheme();
  const bars = Array.from({ length: 12 }, (_, i) => i < 3);
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Authority — AI citation tracking</div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#D99E32', background: '#D99E3226', padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          Preview
        </span>
      </div>
      <p style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.6, margin: '0 0 16px' }}>
        Upcoming feature — how often models cite this site as a source across tracked prompts. Illustrative example below; not yet measuring live data for this scan. The real Authority checks (trust pages, HTTPS, social links, Organization schema) are still scored in Detailed Analysis below.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {bars.map((cited, i) => (
          <div key={i} style={{ width: 16, height: 32, borderRadius: 3, background: cited ? '#3CD070' : theme.border }} />
        ))}
      </div>
    </div>
  );
}

// ─── Issue Table ──────────────────────────────────────────────────────────────

function IssueGroup({ severity, issues }: { severity: Issue['severity']; issues: Issue[] }) {
  const { theme } = useSiteTheme();
  const [open, setOpen] = useState(severity === 'high');
  if (issues.length === 0) return null;
  const c = SEVERITY_COLOR[severity];

  return (
    <div style={{ borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden', marginBottom: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: `${c}14`, textAlign: 'left', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: c, textTransform: 'capitalize', flex: 1 }}>{severity} severity</span>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 20, background: c }}>{issues.length}</span>
        {open ? <ChevronUp className="w-4 h-4" style={{ color: theme.textSecondary }} /> : <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />}
      </button>
      {open && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Severity</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase' }}>Issue</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase' }}>Recommendation</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase' }}>Page</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}><SeverityBadge severity={issue.severity} /></td>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{issue.message}</td>
                  <td style={{ padding: '10px 14px', color: theme.textSecondary }}>{issue.recommendation ?? '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: theme.textSecondary, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {issue.page
                      ? <a href={issue.page} target="_blank" rel="noopener noreferrer" className="transition-colors hover:!text-[#3CD070]" style={{ color: theme.textSecondary, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{issue.page}</a>
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function IssuePanel({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', color: '#3CD070', fontSize: 13, fontWeight: 500 }}>
        <CheckCircle2 className="w-4 h-4" /> No issues found on this dimension
      </div>
    );
  }
  const high = issues.filter(i => i.severity === 'high');
  const medium = issues.filter(i => i.severity === 'medium');
  const low = issues.filter(i => i.severity === 'low');
  return (
    <div>
      <IssueGroup severity="high" issues={high} />
      <IssueGroup severity="medium" issues={medium} />
      <IssueGroup severity="low" issues={low} />
    </div>
  );
}

// ─── Dimension Card ───────────────────────────────────────────────────────────

const dimensionMeta: Record<string, { label: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  seo: { label: 'SEO — Search Engine Optimisation', Icon: Search },
  aeo: { label: 'AEO — Answer Engine Optimisation', Icon: BookOpen },
  geo: { label: 'GEO — Generative Engine Optimisation', Icon: Cpu },
  authority: { label: 'Authority & Trust', Icon: ShieldCheck },
  aiCompatibility: { label: 'AI Compatibility', Icon: Bot },
};

function DimensionCard({ name, data }: { name: string; data: DimensionResult }) {
  const { theme } = useSiteTheme();
  const meta = dimensionMeta[name] ?? { label: name, Icon: Globe };
  const { ring } = scoreColor(data.score);
  const highCount = data.issues.filter(i => i.severity === 'high').length;
  const medCount = data.issues.filter(i => i.severity === 'medium').length;
  const lowCount = data.issues.filter(i => i.severity === 'low').length;
  const [open, setOpen] = useState(highCount > 0);

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="transition-colors hover:![background:#ffffff08]"
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 8, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <meta.Icon className="w-4 h-4" style={{ color: theme.textSecondary }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{meta.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: theme.textSecondary }}>{data.totalChecks} checks</span>
            {highCount > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: SEVERITY_COLOR.high }}>{highCount} high</span>}
            {medCount > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: SEVERITY_COLOR.medium }}>{medCount} medium</span>}
            {lowCount > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: '#3CD070' }}>{lowCount} low</span>}
            {data.issues.length === 0 && <span style={{ fontSize: 11, fontWeight: 600, color: '#3CD070' }}>All clear</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: ring }}>{data.score}</span>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: theme.textSecondary }} /> : <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />}
        </div>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: '10px 18px 18px' }}>
          <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 10 }}>{data.issues.length} issue{data.issues.length !== 1 ? 's' : ''} found</div>
          <IssuePanel issues={data.issues} />
        </div>
      )}
    </div>
  );
}

// ─── Bot Grid ─────────────────────────────────────────────────────────────────

function BotGrid({ botAccess }: { botAccess: BotAccessResult[] }) {
  const { theme } = useSiteTheme();
  if (!botAccess?.length) return null;

  const statusColor = { allowed: '#3CD070', blocked: '#E0533C', unspecified: theme.textSecondary };
  const StatusIcon = ({ status }: { status: BotAccessResult['status'] }) => {
    if (status === 'allowed') return <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />;
    if (status === 'blocked') return <XCircle className="w-3.5 h-3.5 flex-shrink-0" />;
    return <Info className="w-3.5 h-3.5 flex-shrink-0" />;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: 8 }}>
      {botAccess.map((b, i) => {
        const c = statusColor[b.status];
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: `${c}14`, border: `1px solid ${c}33`, color: c }}>
            <StatusIcon status={b.status} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.engine}</div>
              <div style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.bot} · {b.status}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── AI File Status ───────────────────────────────────────────────────────────

function FileStatusRow({ has, name }: { has: boolean; name: string }) {
  const { theme } = useSiteTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
      {has ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#3CD070' }} /> : <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#E0533C' }} />}
      <code style={{ fontSize: 13.5, flex: 1 }}>{name}</code>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, color: has ? '#3CD070' : '#E0533C', background: has ? '#3CD07022' : '#E0533C22' }}>
        {has ? 'Found' : 'Missing'}
      </span>
    </div>
  );
}

// ─── Generated File ───────────────────────────────────────────────────────────

function GeneratedFile({ title, content, filename, description }: { title: string; content: string; filename: string; description?: string }) {
  const { theme } = useSiteTheme();
  const [open, setOpen] = useState(false);

  function download() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <FileText className="w-4 h-4 flex-shrink-0" style={{ color: SITE_ACCENT }} />
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4" style={{ color: theme.textSecondary }} /> : <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />}
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: '10px 18px 18px' }}>
          <p style={{ fontSize: 11.5, color: theme.textSecondary, margin: '0 0 10px' }}>{description ?? 'Add this file to the root of your web server to improve AI engine discoverability.'}</p>
          <pre style={{ fontSize: 11.5, color: '#e2e8f0', background: '#1e293b', borderRadius: 8, padding: 14, overflowX: 'auto', maxHeight: 280, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{content}</pre>
          <button onClick={download} style={{ marginTop: 10, background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
            Download {filename}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const { theme } = useSiteTheme();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 32 }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="transition-colors hover:!text-[#3CD070]"
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', marginBottom: 14, background: 'none', border: 'none', cursor: 'pointer', color: theme.textPrimary }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 700, flex: 1, margin: 0 }}>{title}</h2>
        {open ? <ChevronUp className="w-4 h-4" style={{ color: theme.textSecondary }} /> : <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />}
      </button>
      {open && children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ReportBody({ id }: { id: string }) {
  const { theme } = useSiteTheme();
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [priorScores, setPriorScores] = useState<number[]>([]);

  useEffect(() => {
    scanApi.getReport(id)
      .then(res => setData(res.data.data))
      .catch(err => {
        const msg = err.response?.data?.message ?? 'Failed to load report.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!data) return;
    // Score trend: reuse the existing scan-list endpoint (already returns url/finalScore/
    // createdAt/status for a user's scans, capped at 50) and filter client-side — no
    // dedicated history endpoint yet, matches Phase 2's build-light scope.
    scanApi.list()
      .then(res => {
        const scans: { url: string; status: string; finalScore?: number; createdAt: string }[] = res.data.data;
        const scores = scans
          .filter(s => s.url === data.url && s.status === 'completed' && s.finalScore !== undefined && new Date(s.createdAt) < new Date(data.createdAt))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .slice(-8)
          .map(s => s.finalScore as number);
        setPriorScores(scores);
      })
      .catch(() => {}); // trend is a nice-to-have — fail silently, don't block the report
  }, [data]);

  async function openFullHtmlReport() {
    const res = await scanApi.getReportHtml(id);
    const url = URL.createObjectURL(res.data);
    // Deliberately not revoking the object URL immediately — the new tab needs it to still be
    // valid while it loads; the browser reclaims it on that tab's unload.
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (loading) {
    return (
      <AppShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell maxWidth={420}>
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 32, textAlign: 'center' }}>
          <XCircle className="w-10 h-10 mx-auto mb-4" style={{ color: '#E0533C' }} />
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Could not load report</h2>
          <p style={{ color: theme.textSecondary, fontSize: 13.5, margin: '0 0 20px' }}>{error ?? 'Report not found.'}</p>
          <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', background: '#2A4736', color: '#F9F9F8', padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
            ← Back to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  if (data.status !== 'completed') {
    return (
      <AppShell maxWidth={420}>
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 32, textAlign: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{data.status === 'failed' ? 'Scan failed' : 'Report not ready yet'}</h2>
          <p style={{ color: theme.textSecondary, fontSize: 13.5, margin: '0 0 20px', textTransform: 'capitalize' }}>Status: {data.status}</p>
          <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', background: '#2A4736', color: '#F9F9F8', padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
            ← Back to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const { url, finalScore, report, completedAt, creditsUsed, _id } = data;
  const { breakdown, coverage } = report;
  const aiMeta = breakdown.aiCompatibility?.meta;

  const completedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';
  const pagesAnalysed = coverage?.analyzed ?? creditsUsed;

  const totalIssues = Object.values(breakdown).reduce((n, r) => n + (r as DimensionResult).issues.length, 0);
  const blockedCount = (aiMeta?.botAccess ?? []).filter(b => b.status === 'blocked').length;
  const totalBots = (aiMeta?.botAccess ?? []).length;

  const dimensions = ['seo', 'aeo', 'geo', 'authority', 'aiCompatibility'] as const;
  const gaugeLabels: Record<string, string> = { seo: 'SEO', aeo: 'AEO', geo: 'GEO', authority: 'Authority', aiCompatibility: 'AI Compat.' };

  const generatedLlmTxt = aiMeta?.generatedLlmTxt;
  const generatedAiPlugin = aiMeta?.generatedAiPluginJson
    ? (typeof aiMeta.generatedAiPluginJson === 'string' ? aiMeta.generatedAiPluginJson : JSON.stringify(aiMeta.generatedAiPluginJson, null, 2))
    : null;
  const generatedOrgSchema = breakdown.authority?.meta?.generatedOrgSchema;
  const pageFixes = report.pageFixes ?? [];

  return (
    <AppShell maxWidth={1080}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Scan report</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em', wordBreak: 'break-all' }}>{url}</h1>
          <p style={{ fontSize: 12.5, color: theme.textSecondary, marginTop: 6 }}>
            Scanned {completedDate} · {pagesAnalysed} page{pagesAnalysed !== 1 ? 's' : ''} analysed
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/agency/competitors" className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070]" style={{ border: `1px solid ${theme.border}`, color: theme.textPrimary, padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
            Compare competitors
          </Link>
          <Link href={`/agency/export?scanId=${_id}`} style={{ background: '#2A4736', color: '#F9F9F8', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
            Export PDF
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 16, marginBottom: priorScores.length >= 2 ? 12 : 32 }}>
        <StatCard
          label="Overall Score"
          value={finalScore}
          sub={scoreColor(finalScore).label}
          color={scoreColor(finalScore).ring}
          delta={priorScores.length > 0 ? finalScore - priorScores[priorScores.length - 1] : undefined}
        />
        <StatCard label="Pages Scanned" value={pagesAnalysed} sub={coverage ? `${coverage.discovered} found · ${coverage.failed} failed` : undefined} />
        <StatCard label="AI Bots Blocked" value={blockedCount} sub={totalBots ? `of ${totalBots} checked` : undefined} color={blockedCount > 0 ? '#E0533C' : '#3CD070'} />
        <StatCard label="Total Issues" value={totalIssues} sub="across all checks" />
      </div>

      {priorScores.length >= 2 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '10px 16px', border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, width: 'fit-content' }}>
          <span style={{ fontSize: 11.5, color: theme.textSecondary }}>Score trend (last {priorScores.length + 1} scans)</span>
          <ScoreSparkline scores={[...priorScores, finalScore]} />
        </div>
      )}

      {/* Score gauges */}
      <Section title="Score Breakdown">
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: 24 }}>
            {dimensions.map(d => {
              const dim = breakdown[d] as DimensionResult;
              if (!dim) return null;
              return <ScoreGauge key={d} score={dim.score} label={gaugeLabels[d]} />;
            })}
          </div>
        </div>
      </Section>

      {/* Top Priority Fixes */}
      <Section title="Top Priority Fixes">
        <TopIssuesSection topIssues={report.topIssues ?? []} />
      </Section>

      {/* AI Citation Tracking (preview) */}
      <Section title="AI Citation Tracking">
        <CitationPreview />
      </Section>

      {/* AI Engine Access Matrix */}
      {aiMeta?.botAccess?.length > 0 && (
        <Section title="AI Engine Access Matrix">
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 20 }}>
            <p style={{ fontSize: 12, color: theme.textSecondary, margin: '0 0 14px' }}>
              Shows which AI crawlers can access your site based on your <code style={{ background: theme.bg, padding: '1px 5px', borderRadius: 4 }}>robots.txt</code> directives.
            </p>
            <BotGrid botAccess={aiMeta.botAccess} />
          </div>
        </Section>
      )}

      {/* AI Compatibility Files */}
      {aiMeta && (
        <Section title="AI Compatibility Files">
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: '0 20px' }}>
            <FileStatusRow has={!!aiMeta.hasLlmTxt} name="/llm.txt" />
            {aiMeta.hasLlmsFullTxt !== undefined && <FileStatusRow has={!!aiMeta.hasLlmsFullTxt} name="/llms-full.txt" />}
            <FileStatusRow has={!!aiMeta.hasAiPluginJson} name="/.well-known/ai-plugin.json" />
          </div>
        </Section>
      )}

      {/* Detailed dimension cards */}
      <Section title="Detailed Analysis (all checks)" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dimensions.map(d => {
            const dim = breakdown[d] as DimensionResult;
            if (!dim) return null;
            return <DimensionCard key={d} name={d} data={dim} />;
          })}
        </div>
      </Section>

      {/* Generated Files */}
      {(generatedLlmTxt || generatedAiPlugin || generatedOrgSchema) && (
        <Section title="Generated Files" defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {generatedLlmTxt && <GeneratedFile title="llms.txt — AI assistant context file" content={generatedLlmTxt} filename="llms.txt" />}
            {generatedAiPlugin && <GeneratedFile title="ai-plugin.json — OpenAI plugin manifest" content={generatedAiPlugin} filename="ai-plugin.json" />}
            {generatedOrgSchema && (
              <GeneratedFile
                title="Organization schema (JSON-LD)"
                content={generatedOrgSchema}
                filename="organization-schema.json"
                description={`Paste this inside a <script type="application/ld+json"> tag in your site's <head>.`}
              />
            )}
          </div>
        </Section>
      )}

      {/* Example Page Fixes */}
      {pageFixes.length > 0 && (
        <Section title="Example Page Fixes" defaultOpen={false}>
          <p style={{ fontSize: 12, color: theme.textSecondary, margin: '0 0 12px' }}>
            Example fixes for a few of the affected pages from the crawled sample — not every affected page, just enough to show the pattern to apply site-wide.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pageFixes.map(fix => (
              <div key={fix.url} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {fix.articleSchema && (
                  <GeneratedFile
                    title={`Article schema — ${fix.url}`}
                    content={fix.articleSchema}
                    filename="article-schema.json"
                    description={`Paste this inside a <script type="application/ld+json"> tag in this page's <head>.`}
                  />
                )}
                {fix.metaTags && (
                  <GeneratedFile
                    title={`OG / Twitter meta tags — ${fix.url}`}
                    content={fix.metaTags}
                    filename="meta-tags.html"
                    description="Paste these tags into this page's <head>."
                  />
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: theme.textSecondary, borderTop: `1px solid ${theme.border}`, paddingTop: 20, marginTop: 8 }}>
        <span>Powered by <span style={{ fontWeight: 600, color: theme.textPrimary }}>Aeorch</span></span>
        <button onClick={openFullHtmlReport} className="transition-colors hover:!text-[#3CD070]" style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textSecondary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}>
          Full HTML report <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </AppShell>
  );
}

export default function ReportView({ id }: { id: string }) {
  return (
    <SiteThemeProvider>
      <ReportBody id={id} />
    </SiteThemeProvider>
  );
}
