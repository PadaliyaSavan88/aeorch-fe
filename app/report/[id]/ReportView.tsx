'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ChevronDown, ChevronUp, ExternalLink,
  CheckCircle2, XCircle, Info,
  Bot, FileText, Globe, Search, Cpu, BookOpen, ShieldCheck,
} from 'lucide-react';
import { scanApi } from '@/lib/api';
import AppHeader from '@/components/layout/AppHeader';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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

interface AnalyzerReport {
  finalScore: number;
  coverage: { discovered: number; analyzed: number; failed: number };
  breakdown: {
    seo: DimensionResult;
    aeo: DimensionResult;
    geo: DimensionResult;
    authority: DimensionResult;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return { ring: '#10b981', label: 'Good', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
  if (score >= 50) return { ring: '#f59e0b', label: 'Needs Work', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' };
  return { ring: '#ef4444', label: 'Poor', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' };
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score, label, size = 90 }: { score: number; label: string; size?: number }) {
  const { ring } = scoreColor(score);
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={9} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={ring} strokeWidth={9}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%" y="52%"
          textAnchor="middle" dominantBaseline="middle"
          fill={ring} fontSize={size * 0.21} fontWeight={700} fontFamily="inherit"
        >
          {score}
        </text>
      </svg>
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="card p-5 text-center">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</div>
      <div className="text-3xl font-bold mb-1" style={color ? { color } : undefined}>{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Issue['severity'] }) {
  const map = {
    high: 'bg-red-50 text-red-600',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`badge ${map[severity]} capitalize`}>{severity}</span>;
}

// ─── Issue Table ──────────────────────────────────────────────────────────────

function IssueGroup({ severity, issues }: { severity: Issue['severity']; issues: Issue[] }) {
  const [open, setOpen] = useState(severity === 'high');
  if (issues.length === 0) return null;

  const colors = {
    high: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', count: 'bg-red-500' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', count: 'bg-amber-500' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', count: 'bg-emerald-500' },
  };
  const c = colors[severity];

  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-4 py-3 ${c.bg} text-left`}
      >
        <span className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
        <span className={`text-sm font-semibold ${c.text} capitalize flex-1`}>{severity} severity</span>
        <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${c.count}`}>{issues.length}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap w-24">Severity</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Issue</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Recommendation</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-40">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issues.map((issue, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap"><SeverityBadge severity={issue.severity} /></td>
                  <td className="px-4 py-3 text-navy-900 font-medium text-sm">{issue.message}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{issue.recommendation ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px]">
                    {issue.page
                      ? <a href={issue.page} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline truncate block">{issue.page}</a>
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
      <div className="flex items-center gap-2 py-4 text-emerald-600 text-sm font-medium">
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

const dimensionMeta: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  seo: { label: 'SEO — Search Engine Optimisation', Icon: Search },
  aeo: { label: 'AEO — Answer Engine Optimisation', Icon: BookOpen },
  geo: { label: 'GEO — Generative Engine Optimisation', Icon: Cpu },
  authority: { label: 'Authority & Trust', Icon: ShieldCheck },
  aiCompatibility: { label: 'AI Compatibility', Icon: Bot },
};

function DimensionCard({ name, data }: { name: string; data: DimensionResult }) {
  const meta = dimensionMeta[name] ?? { label: name, Icon: Globe };
  const { ring, bg, text } = scoreColor(data.score);
  const highCount = data.issues.filter(i => i.severity === 'high').length;
  const medCount = data.issues.filter(i => i.severity === 'medium').length;
  const lowCount = data.issues.filter(i => i.severity === 'low').length;
  const [open, setOpen] = useState(highCount > 0);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <meta.Icon className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-navy-900 text-sm">{meta.label}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-400">{data.totalChecks} checks</span>
            {highCount > 0 && <span className="text-xs font-semibold text-red-500">{highCount} high</span>}
            {medCount > 0 && <span className="text-xs font-semibold text-amber-500">{medCount} medium</span>}
            {lowCount > 0 && <span className="text-xs font-semibold text-emerald-600">{lowCount} low</span>}
            {data.issues.length === 0 && <span className="text-xs font-semibold text-emerald-600">All clear</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl font-bold" style={{ color: ring }}>{data.score}</span>
          <span className={`badge ${bg} ${text} hidden sm:inline-flex`}>/100</span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 pt-3 pb-5">
          <div className="text-xs text-slate-400 mb-3">{data.issues.length} issue{data.issues.length !== 1 ? 's' : ''} found</div>
          <IssuePanel issues={data.issues} />
        </div>
      )}
    </div>
  );
}

// ─── Bot Grid ─────────────────────────────────────────────────────────────────

function BotGrid({ botAccess }: { botAccess: BotAccessResult[] }) {
  if (!botAccess?.length) return null;

  const statusStyle = {
    allowed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    blocked: 'bg-red-50 text-red-600 border border-red-100',
    unspecified: 'bg-slate-50 text-slate-500 border border-slate-100',
  };
  const StatusIcon = ({ status }: { status: BotAccessResult['status'] }) => {
    if (status === 'allowed') return <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />;
    if (status === 'blocked') return <XCircle className="w-3.5 h-3.5 flex-shrink-0" />;
    return <Info className="w-3.5 h-3.5 flex-shrink-0" />;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {botAccess.map((b, i) => (
        <div key={i} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium ${statusStyle[b.status]}`}>
          <StatusIcon status={b.status} />
          <div className="min-w-0">
            <div className="font-semibold truncate">{b.engine}</div>
            <div className="opacity-70 truncate">{b.bot} · {b.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AI File Status ───────────────────────────────────────────────────────────

function FileStatusRow({ has, name }: { has: boolean; name: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      {has
        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
      <code className="text-sm text-slate-700 flex-1">{name}</code>
      <span className={`badge ${has ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
        {has ? 'Found' : 'Missing'}
      </span>
    </div>
  );
}

// ─── Generated File ───────────────────────────────────────────────────────────

function GeneratedFile({ title, content, filename }: { title: string; content: string; filename: string }) {
  const [open, setOpen] = useState(false);

  function download() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
        <span className="flex-1 text-sm font-semibold text-navy-900">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-3">
          <p className="text-xs text-slate-500 mb-3">
            Add this file to the root of your web server to improve AI engine discoverability.
          </p>
          <pre className="text-xs text-slate-200 bg-slate-800 rounded-xl p-4 overflow-x-auto max-h-72 whitespace-pre-wrap break-words leading-relaxed">{content}</pre>
          <button onClick={download} className="btn-primary !text-xs !py-2 !px-4 mt-3">
            Download {filename}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left mb-4 group"
      >
        <h2 className="text-base font-bold text-navy-900 flex-1 group-hover:text-brand-600 transition-colors">{title}</h2>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportView({ id }: { id: string }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scanApi.getReport(id)
      .then(res => setData(res.data))
      .catch(err => {
        const msg = err.response?.data?.message ?? 'Failed to load report.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Zap className="w-8 h-8 text-brand-600 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card p-8 max-w-sm w-full text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy-900 mb-2">Could not load report</h2>
          <p className="text-slate-500 text-sm mb-5">{error ?? 'Report not found.'}</p>
          <Link href="/dashboard" className="btn-primary w-full justify-center !text-sm !py-2.5">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (data.status !== 'completed') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card p-8 max-w-sm w-full text-center">
          <Zap className="w-10 h-10 text-brand-600 animate-pulse mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy-900 mb-2">
            {data.status === 'failed' ? 'Scan failed' : 'Report not ready yet'}
          </h2>
          <p className="text-slate-500 text-sm mb-5 capitalize">Status: {data.status}</p>
          <Link href="/dashboard" className="btn-primary w-full justify-center !text-sm !py-2.5">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { url, finalScore, report, completedAt, creditsUsed, _id } = data;
  const { breakdown, coverage } = report;
  const aiMeta = breakdown.aiCompatibility?.meta;

  const completedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  const totalIssues = Object.values(breakdown).reduce((n, r) => n + (r as DimensionResult).issues.length, 0);
  const blockedCount = (aiMeta?.botAccess ?? []).filter(b => b.status === 'blocked').length;
  const totalBots = (aiMeta?.botAccess ?? []).length;

  const dimensions = ['seo', 'aeo', 'geo', 'authority', 'aiCompatibility'] as const;
  const gaugeLabels: Record<string, string> = { seo: 'SEO', aeo: 'AEO', geo: 'GEO', authority: 'Authority', aiCompatibility: 'AI Compat.' };

  const generatedLlmTxt = aiMeta?.generatedLlmTxt;
  const generatedAiPlugin = aiMeta?.generatedAiPluginJson
    ? (typeof aiMeta.generatedAiPluginJson === 'string'
        ? aiMeta.generatedAiPluginJson
        : JSON.stringify(aiMeta.generatedAiPluginJson, null, 2))
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader>
        <p className="text-sm text-slate-500 truncate hidden sm:block flex-1 min-w-0">{url}</p>
        <a
          href={`${API}/scans/${_id}/report/html`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1 text-sm text-slate-400 hover:text-navy-900 transition-colors"
        >
          HTML <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <Link href="/dashboard" className="flex-shrink-0 text-sm text-brand-600 hover:text-brand-700 font-medium">
          ← Dashboard
        </Link>
      </AppHeader>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 break-all">{url}</h1>
          <p className="text-slate-400 text-sm mt-1">
            Scanned {completedDate} · {creditsUsed} page{creditsUsed !== 1 ? 's' : ''} analysed
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Overall Score"
            value={finalScore}
            sub={scoreColor(finalScore).label}
            color={scoreColor(finalScore).ring}
          />
          <StatCard
            label="Pages Scanned"
            value={coverage?.analyzed ?? creditsUsed}
            sub={coverage ? `${coverage.discovered} found · ${coverage.failed} failed` : undefined}
          />
          <StatCard
            label="AI Bots Blocked"
            value={blockedCount}
            sub={totalBots ? `of ${totalBots} checked` : undefined}
            color={blockedCount > 0 ? '#ef4444' : '#10b981'}
          />
          <StatCard
            label="Total Issues"
            value={totalIssues}
            sub="across all checks"
          />
        </div>

        {/* Score gauges */}
        <Section title="Score Breakdown">
          <div className="card p-6">
            <div className="flex flex-wrap justify-around gap-6">
              {dimensions.map(d => {
                const dim = breakdown[d] as DimensionResult;
                if (!dim) return null;
                return <ScoreGauge key={d} score={dim.score} label={gaugeLabels[d]} />;
              })}
            </div>
          </div>
        </Section>

        {/* AI Engine Access Matrix */}
        {aiMeta?.botAccess?.length > 0 && (
          <Section title="AI Engine Access Matrix">
            <div className="card p-5">
              <p className="text-xs text-slate-400 mb-4">
                Shows which AI crawlers can access your site based on your <code className="bg-slate-100 px-1 rounded">robots.txt</code> directives.
              </p>
              <BotGrid botAccess={aiMeta.botAccess} />
            </div>
          </Section>
        )}

        {/* AI Compatibility Files */}
        {aiMeta && (
          <Section title="AI Compatibility Files">
            <div className="card px-5 py-2">
              <FileStatusRow has={!!aiMeta.hasLlmTxt} name="/llm.txt" />
              {aiMeta.hasLlmsFullTxt !== undefined && (
                <FileStatusRow has={!!aiMeta.hasLlmsFullTxt} name="/llms-full.txt" />
              )}
              <FileStatusRow has={!!aiMeta.hasAiPluginJson} name="/.well-known/ai-plugin.json" />
            </div>
          </Section>
        )}

        {/* Detailed dimension cards */}
        <Section title="Detailed Analysis">
          <div className="flex flex-col gap-3">
            {dimensions.map(d => {
              const dim = breakdown[d] as DimensionResult;
              if (!dim) return null;
              return <DimensionCard key={d} name={d} data={dim} />;
            })}
          </div>
        </Section>

        {/* Generated Files */}
        {(generatedLlmTxt || generatedAiPlugin) && (
          <Section title="Generated Files" defaultOpen={false}>
            <div className="flex flex-col gap-3">
              {generatedLlmTxt && (
                <GeneratedFile
                  title="llms.txt — AI assistant context file"
                  content={generatedLlmTxt}
                  filename="llms.txt"
                />
              )}
              {generatedAiPlugin && (
                <GeneratedFile
                  title="ai-plugin.json — OpenAI plugin manifest"
                  content={generatedAiPlugin}
                  filename="ai-plugin.json"
                />
              )}
            </div>
          </Section>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-6 mt-2">
          <span>Powered by <span className="font-semibold text-navy-900">Aeorch</span></span>
          <a
            href={`${API}/scans/${_id}/report/html`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-navy-900 transition-colors"
          >
            Full HTML report <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </main>
    </div>
  );
}
