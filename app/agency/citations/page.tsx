'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { authApi, organizationApi, citationApi } from '@/lib/api';
import { clearTokens, isLoggedIn } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

interface Me {
  id: string;
  orgRole?: 'owner' | 'admin' | 'member';
}

interface OrgSite {
  _id: string;
  url: string;
  label?: string;
}

interface PromptResult {
  prompt: string;
  modelResponse: string;
  cited: boolean;
}

interface CitationCheckData {
  _id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  prompts: PromptResult[];
  score: number | null;
  modelName: string;
  source: 'scheduled' | 'manual';
  errorMessage?: string;
  createdAt: string;
}

interface HistoryEntry {
  score: number;
  createdAt: string;
}

interface CitationsResult {
  latest: CitationCheckData | null;
  history: HistoryEntry[];
}

function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

const STATUS_LABEL: Record<CitationCheckData['status'], string> = {
  queued: 'Queued', running: 'Running', completed: 'Completed', failed: 'Failed',
};
const STATUS_COLOR: Record<CitationCheckData['status'], string> = {
  queued: '#D99E32', running: '#D99E32', completed: '#3CD070', failed: '#E0533C',
};

/** Hand-rolled inline SVG sparkline, same approach as ReportView.tsx's ScoreSparkline,
 * duplicated rather than shared since this codebase's small presentational pieces are
 * defined per-page throughout (ScoreGauge/StatCard/etc.), not centralized. */
function TrendSparkline({ scores }: { scores: number[] }) {
  const { theme } = useSiteTheme();
  if (scores.length < 2) return null;

  const width = 200;
  const height = 40;
  const pad = 4;
  const points = scores.map((score, i) => {
    const x = pad + (i / (scores.length - 1)) * (width - pad * 2);
    const y = height - pad - (Math.max(0, Math.min(1, score)) / 1) * (height - pad * 2);
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

function PromptRow({ result }: { result: PromptResult }) {
  const { theme } = useSiteTheme();
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        {result.cited
          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#3CD070', marginTop: 2 }} />
          : <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: theme.textSecondary, marginTop: 2 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{result.prompt}</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: result.cited ? '#3CD070' : theme.textSecondary }}>
            {result.cited ? 'Cited' : 'Not cited'}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: theme.textSecondary, lineHeight: 1.6, margin: '0 0 0 26px', whiteSpace: 'pre-wrap' }}>
        {result.modelResponse}
      </p>
    </div>
  );
}

function CitationsBody() {
  const { theme } = useSiteTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deepLinkedSiteId = searchParams.get('siteId');

  const [me, setMe] = useState<Me | null>(null);
  const [hasOrg, setHasOrg] = useState<boolean | null>(null);
  const [isAgencyPlan, setIsAgencyPlan] = useState(true);
  const [orgId, setOrgId] = useState('');
  const [sites, setSites] = useState<OrgSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [result, setResult] = useState<CitationsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState('');

  const loadCitations = useCallback(async (org: string, siteId: string) => {
    const res = await citationApi.get(org, siteId);
    setResult(res.data.data);
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }

    authApi.me()
      .then(async (meRes) => {
        setMe(meRes.data.data);
        const res = await organizationApi.getMine();
        setHasOrg(true);
        setOrgId(res.data.data.organization._id);
        setIsAgencyPlan(res.data.data.organization.plan === 'agency');
        const orgSites: OrgSite[] = res.data.data.sites;
        setSites(orgSites);
        if (orgSites.length > 0 && res.data.data.organization.plan === 'agency') {
          // Deep-linked from the report page's teaser (?siteId=...) when it matched one
          // of this org's sites; falls back to the first site otherwise.
          const initialSiteId = (deepLinkedSiteId && orgSites.some((s) => s._id === deepLinkedSiteId))
            ? deepLinkedSiteId
            : orgSites[0]._id;
          setSelectedSiteId(initialSiteId);
          await loadCitations(res.data.data.organization._id, initialSiteId);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setHasOrg(false);
        } else if (err.response?.status === 401) {
          clearTokens();
          router.replace('/login');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleSelectSite(siteId: string) {
    setSelectedSiteId(siteId);
    setResult(null);
    setRunError('');
    await loadCitations(orgId, siteId);
  }

  async function handleRunNow() {
    setRunning(true);
    setRunError('');
    try {
      await citationApi.trigger(orgId, selectedSiteId);
      await loadCitations(orgId, selectedSiteId);
    } catch (err: any) {
      setRunError(err.response?.data?.message || 'Failed to queue a citation check.');
    } finally {
      setRunning(false);
    }
  }

  const canManage = me?.orgRole === 'owner' || me?.orgRole === 'admin';
  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 };

  if (loading) {
    return (
      <AppShell active="citations" maxWidth={1080}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  if (!hasOrg) {
    return (
      <AppShell active="citations" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No agency workspace yet</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>Create one first, then come back here to track AI citations for a site.</p>
          <Link href="/agency" style={{ color: SITE_ACCENT, fontSize: 13.5, fontWeight: 600 }}>Go to Multi-site →</Link>
        </div>
      </AppShell>
    );
  }

  if (!isAgencyPlan) {
    return (
      <AppShell active="citations" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Agency-plan feature</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>
            AI citation tracking is included with the Agency plan. Upgrade to start checking whether an AI model mentions your sites.
          </p>
          <Link href="/agency/billing" style={{ color: SITE_ACCENT, fontSize: 13.5, fontWeight: 600 }}>View plans →</Link>
        </div>
      </AppShell>
    );
  }

  if (sites.length === 0) {
    return (
      <AppShell active="citations" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No sites yet</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>Add a client site first, then come back here to track its AI citations.</p>
          <Link href="/agency" style={{ color: SITE_ACCENT, fontSize: 13.5, fontWeight: 600 }}>Go to Multi-site →</Link>
        </div>
      </AppShell>
    );
  }

  const selectedSite = sites.find((s) => s._id === selectedSiteId);
  const latest = result?.latest ?? null;
  const trendScores = [...(result?.history ?? [])].reverse().map((h) => h.score);

  return (
    <AppShell active="citations" maxWidth={1080}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
          AI citation tracking
        </div>
        <div className="flex items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {selectedSite ? domainOf(selectedSite.url) : ''}
          </h1>
          {sites.length > 1 && (
            <select
              value={selectedSiteId}
              onChange={(e) => handleSelectSite(e.target.value)}
              style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '6px 10px', background: theme.card }}
            >
              {sites.map((s) => (
                <option key={s._id} value={s._id}>{domainOf(s.url)}</option>
              ))}
            </select>
          )}
        </div>
        <p style={{ fontSize: 12.5, color: theme.textSecondary, margin: '8px 0 0', maxWidth: 640, lineHeight: 1.6 }}>
          Checks whether the operator&apos;s self-hosted Gemma 4 model mentions this site when asked a small set of auto-generated prompts. This measures one local model, not ChatGPT, Claude, or Perplexity: a useful directional signal, not a claim about how real AI answer engines treat this site.
        </p>
      </div>

      {canManage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <button
            onClick={handleRunNow}
            disabled={running || latest?.status === 'queued' || latest?.status === 'running'}
            className="flex items-center"
            style={{
              gap: 8, background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '10px 18px', borderRadius: 8,
              fontWeight: 600, fontSize: 13.5, cursor: running ? 'default' : 'pointer', opacity: running ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !running && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={(e) => !running && (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            <RefreshCw className="w-3.5 h-3.5" style={{ animation: running ? 'spin 1s linear infinite' : undefined }} />
            {running ? 'Queuing…' : 'Run now'}
          </button>
          {runError && <p style={{ color: '#E0533C', fontSize: 13, margin: 0 }}>{runError}</p>}
        </div>
      )}

      {!latest && (
        <div style={card}>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: 0 }}>
            No citation checks yet for this site. {canManage ? 'Run one now, or wait for the next scheduled weekly check.' : 'Waiting for the next scheduled weekly check.'}
          </p>
        </div>
      )}

      {latest && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: latest.status === 'completed' ? 20 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: STATUS_COLOR[latest.status], background: `${STATUS_COLOR[latest.status]}22`, padding: '3px 10px', borderRadius: 20 }}>
                  {STATUS_LABEL[latest.status]}
                </span>
                <span style={{ fontSize: 12, color: theme.textSecondary }}>
                  {latest.source === 'manual' ? 'Manually triggered' : 'Scheduled'} · {new Date(latest.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · model: {latest.modelName}
                </span>
              </div>
              {latest.status === 'completed' && latest.score !== null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: latest.score > 0 ? '#3CD070' : theme.textSecondary }}>
                      {Math.round(latest.score * 100)}%
                    </div>
                    <div style={{ fontSize: 11, color: theme.textSecondary }}>
                      {latest.prompts.filter((p) => p.cited).length} of {latest.prompts.length} prompts cited
                    </div>
                  </div>
                  {trendScores.length >= 2 && <TrendSparkline scores={trendScores} />}
                </div>
              )}
            </div>
            {latest.status === 'failed' && (
              <p style={{ fontSize: 13, color: '#E0533C', margin: '8px 0 0' }}>{latest.errorMessage ?? 'This check failed unexpectedly.'}</p>
            )}
            {(latest.status === 'queued' || latest.status === 'running') && (
              <p style={{ fontSize: 13, color: theme.textSecondary, margin: '8px 0 0' }}>This check is still in progress, refresh in a moment.</p>
            )}
          </div>

          {latest.status === 'completed' && latest.prompts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {latest.prompts.map((p, i) => <PromptRow key={i} result={p} />)}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

export default function CitationsPage() {
  return (
    <SiteThemeProvider>
      <Suspense fallback={null}>
        <CitationsBody />
      </Suspense>
    </SiteThemeProvider>
  );
}
