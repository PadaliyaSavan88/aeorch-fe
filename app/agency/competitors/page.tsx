'use client';

import { useEffect, useState, useCallback, FormEvent, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { authApi, organizationApi } from '@/lib/api';
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

interface Breakdown {
  seo: number | null;
  aeo: number | null;
  geo: number | null;
  authority: number | null;
  aiCompatibility: number | null;
}

interface ScoredEntity {
  _id: string;
  url: string;
  label?: string;
  score: number | null;
  breakdown: Breakdown | null;
  lastScanId: string | null;
}

interface CompareResult {
  site: ScoredEntity;
  competitors: ScoredEntity[];
}

const METRICS: { key: 'final' | keyof Breakdown; label: string }[] = [
  { key: 'final', label: 'Overall score' },
  { key: 'seo', label: 'SEO' },
  { key: 'aeo', label: 'AEO' },
  { key: 'geo', label: 'GEO' },
  { key: 'authority', label: 'Authority' },
  { key: 'aiCompatibility', label: 'AI Compat.' },
];

function metricValue(entity: ScoredEntity, key: (typeof METRICS)[number]['key']): number | null {
  if (key === 'final') return entity.score;
  return entity.breakdown?.[key] ?? null;
}

function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

function buildTakeaway(compare: CompareResult): string | null {
  const comparable = METRICS.filter((m) => {
    const you = metricValue(compare.site, m.key);
    if (you === null) return false;
    return compare.competitors.some((c) => metricValue(c, m.key) !== null);
  });
  if (comparable.length === 0) return null;

  let leadCount = 0;
  let worstGap: { label: string; you: number; best: number } | null = null;

  for (const m of comparable) {
    const you = metricValue(compare.site, m.key) as number;
    const bestCompetitor = Math.max(...compare.competitors.map((c) => metricValue(c, m.key) ?? -Infinity));
    if (you >= bestCompetitor) {
      leadCount += 1;
    } else {
      const gap = bestCompetitor - you;
      if (!worstGap || gap > worstGap.best - worstGap.you) {
        worstGap = { label: m.label, you, best: bestCompetitor };
      }
    }
  }

  if (leadCount === comparable.length) {
    return `You lead on all ${comparable.length} comparable metrics.`;
  }
  const lead = `You lead on ${leadCount} of ${comparable.length} comparable metrics`;
  return worstGap ? `${lead} — the biggest gap is ${worstGap.label} (${worstGap.you} vs. ${worstGap.best}).` : `${lead}.`;
}

function CompetitorsBody() {
  const { theme } = useSiteTheme();
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [hasOrg, setHasOrg] = useState<boolean | null>(null);
  const [orgId, setOrgId] = useState<string>('');
  const [sites, setSites] = useState<OrgSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [compare, setCompare] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(true);

  const [newUrl, setNewUrl] = useState('');
  const [addError, setAddError] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadCompare = useCallback(async (org: string, siteId: string) => {
    const res = await organizationApi.compareSite(org, siteId);
    setCompare(res.data.data);
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }

    authApi.me()
      .then(async (meRes) => {
        setMe(meRes.data.data);
        const res = await organizationApi.getMine();
        setHasOrg(true);
        setOrgId(res.data.data.organization._id);
        const orgSites: OrgSite[] = res.data.data.sites;
        setSites(orgSites);
        if (orgSites.length > 0) {
          setSelectedSiteId(orgSites[0]._id);
          await loadCompare(res.data.data.organization._id, orgSites[0]._id);
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
    setCompare(null);
    await loadCompare(orgId, siteId);
  }

  async function handleAddCompetitor(e: FormEvent) {
    e.preventDefault();
    setAddError('');
    setAddSubmitting(true);
    try {
      await organizationApi.addCompetitor(orgId, selectedSiteId, newUrl);
      setNewUrl('');
      await loadCompare(orgId, selectedSiteId);
    } catch (err: any) {
      setAddError(err.response?.data?.message || 'Failed to add competitor.');
    } finally {
      setAddSubmitting(false);
    }
  }

  async function handleRemoveCompetitor(competitorId: string) {
    setRemovingId(competitorId);
    try {
      await organizationApi.removeCompetitor(orgId, selectedSiteId, competitorId);
      await loadCompare(orgId, selectedSiteId);
    } finally {
      setRemovingId(null);
    }
  }

  const canManage = me?.orgRole === 'owner' || me?.orgRole === 'admin';
  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 };

  if (loading) {
    return (
      <AppShell active="competitors" maxWidth={1080}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  if (!hasOrg) {
    return (
      <AppShell active="competitors" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No agency workspace yet</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>Create one first, then come back here to compare a site against its competitors.</p>
          <Link href="/agency" style={{ color: SITE_ACCENT, fontSize: 13.5, fontWeight: 600 }}>Go to Multi-site →</Link>
        </div>
      </AppShell>
    );
  }

  if (sites.length === 0) {
    return (
      <AppShell active="competitors" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No sites yet</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>Add a client site first, then come back here to compare it against competitors.</p>
          <Link href="/agency" style={{ color: SITE_ACCENT, fontSize: 13.5, fontWeight: 600 }}>Go to Multi-site →</Link>
        </div>
      </AppShell>
    );
  }

  const takeaway = compare ? buildTakeaway(compare) : null;

  return (
    <AppShell active="competitors" maxWidth={1080}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
          Competitor comparison
        </div>
        <div className="flex items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {compare ? domainOf(compare.site.url) : ''} vs. {compare?.competitors.length ?? 0} competitor{compare?.competitors.length === 1 ? '' : 's'}
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
      </div>

      {canManage && (
        <form onSubmit={handleAddCompetitor} style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            required
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Add a competitor URL…"
            className="focus:!border-[#3CD070] focus:!outline-none"
            style={{ flex: 1, minWidth: 200, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '11px 14px', fontSize: 14, color: theme.textPrimary, fontFamily: 'ui-monospace,monospace' }}
          />
          <button
            type="submit"
            disabled={addSubmitting}
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: addSubmitting ? 'default' : 'pointer', opacity: addSubmitting ? 0.7 : 1 }}
            onMouseEnter={(e) => !addSubmitting && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={(e) => !addSubmitting && (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            {addSubmitting ? 'Adding…' : 'Add competitor'}
          </button>
          {addError && <p style={{ color: '#E0533C', fontSize: 13, margin: 0, width: '100%' }}>{addError}</p>}
        </form>
      )}

      {compare && (
        <>
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `1.6fr repeat(${compare.competitors.length + 1}, 1fr)`, minWidth: 360 + compare.competitors.length * 140 }}>
              <div style={{ padding: '16px 20px', fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: `1px solid ${theme.border}` }}>Metric</div>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: SITE_ACCENT }}>You</div>
                <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: theme.textSecondary }}>{domainOf(compare.site.url)}</div>
              </div>
              {compare.competitors.map((c) => (
                <div key={c._id} style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}`, position: 'relative' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.label || 'Competitor'}</div>
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: theme.textSecondary }}>{domainOf(c.url)}</div>
                  {canManage && (
                    <button
                      onClick={() => handleRemoveCompetitor(c._id)}
                      disabled={removingId === c._id}
                      title="Remove competitor"
                      className="transition-colors hover:!text-[#E0533C]"
                      style={{ position: 'absolute', top: 12, right: 8, background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 4 }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {METRICS.map((metric) => {
                const values = [compare.site, ...compare.competitors].map((e) => metricValue(e, metric.key));
                const nonNull = values.filter((v): v is number => v !== null);
                const max = nonNull.length > 1 ? Math.max(...nonNull) : null;
                return (
                  <Fragment key={metric.key}>
                    <div style={{ padding: '14px 20px', fontSize: 13.5, fontWeight: 500, borderBottom: `1px solid ${theme.border}` }}>{metric.label}</div>
                    {[compare.site, ...compare.competitors].map((entity, i) => {
                      const v = values[i];
                      const isBest = max !== null && v === max;
                      return (
                        <div key={`${metric.key}-${entity._id}`} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${theme.border}` }}>
                          {v === null ? (
                            entity.lastScanId ? (
                              <span style={{ fontSize: 13, color: theme.textSecondary }}>—</span>
                            ) : (
                              <Link href={`/scan?url=${encodeURIComponent(entity.url)}`} className="transition-colors hover:!text-[#3CD070]" style={{ fontSize: 12, color: theme.textSecondary }}>
                                Not scanned
                              </Link>
                            )
                          ) : (
                            <>
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: isBest ? SITE_ACCENT : theme.textPrimary }}>{v}</span>
                              {isBest && <span style={{ fontSize: 10, fontWeight: 700, color: SITE_ACCENT, background: '#3CD07026', padding: '2px 6px', borderRadius: 10 }}>BEST</span>}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {takeaway && (
            <div style={{ marginTop: 20, border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: '20px 24px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Takeaway</div>
              <p style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>{takeaway}</p>
            </div>
          )}
        </>
      )}
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
