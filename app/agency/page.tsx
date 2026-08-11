'use client';

import { useEffect, useState, FormEvent } from 'react';
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

interface Organization {
  _id: string;
  name: string;
  url: string;
}

interface Site {
  _id: string;
  url: string;
  label?: string;
  score: number | null;
  lastScan: string | null;
  lastScanId: string | null;
  trend: number | null;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  orgRole: 'owner' | 'admin' | 'member';
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Not scanned yet';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function DashboardBody() {
  const { theme } = useSiteTheme();
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgUrl, setNewOrgUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [addingSite, setAddingSite] = useState(false);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [addSiteError, setAddSiteError] = useState('');
  const [addSiteSubmitting, setAddSiteSubmitting] = useState(false);

  const [removingSiteId, setRemovingSiteId] = useState<string | null>(null);

  async function refreshOrg() {
    try {
      const res = await organizationApi.getMine();
      setOrg(res.data.data.organization);
      setSites(res.data.data.sites);
      setMembers(res.data.data.members);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setOrg(null);
        setSites([]);
        setMembers([]);
      }
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }

    authApi.me()
      .then(meRes => {
        setMe(meRes.data.data);
        return refreshOrg();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          clearTokens();
          router.replace('/login');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleCreateOrg(e: FormEvent) {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      await organizationApi.create(newOrgName, newOrgUrl);
      const meRes = await authApi.me();
      setMe(meRes.data.data);
      await refreshOrg();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create organization.');
    } finally {
      setCreating(false);
    }
  }

  async function handleAddSite(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setAddSiteError('');
    setAddSiteSubmitting(true);
    try {
      await organizationApi.addSite(org._id, newSiteUrl);
      setNewSiteUrl('');
      setAddingSite(false);
      await refreshOrg();
    } catch (err: any) {
      setAddSiteError(err.response?.data?.message || 'Failed to add site.');
    } finally {
      setAddSiteSubmitting(false);
    }
  }

  async function handleRemoveSite(siteId: string) {
    if (!org) return;
    setRemovingSiteId(siteId);
    try {
      await organizationApi.removeSite(org._id, siteId);
      await refreshOrg();
    } finally {
      setRemovingSiteId(null);
    }
  }

  const canManage = me?.orgRole === 'owner' || me?.orgRole === 'admin';
  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 };
  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', background: theme.bg, border: `1px solid ${theme.border}`,
    borderRadius: 6, padding: '10px 12px', fontSize: 14, color: theme.textPrimary, fontFamily: 'inherit',
  };

  if (loading) {
    return (
      <AppShell active="agency" maxWidth={1160}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  if (!org) {
    return (
      <AppShell active="agency" maxWidth={640}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Set up your agency workspace</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, marginTop: 6 }}>
            Create an organization to track multiple client sites, invite your team, and (soon) export white-label reports.
          </p>
        </div>
        <form onSubmit={handleCreateOrg} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Agency name</label>
            <input required value={newOrgName} onChange={e => setNewOrgName(e.target.value)} placeholder="Bright Peak Marketing" className="focus:!border-[#3CD070] focus:!outline-none" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Website</label>
            <input required value={newOrgUrl} onChange={e => setNewOrgUrl(e.target.value)} placeholder="https://youragency.com" className="focus:!border-[#3CD070] focus:!outline-none" style={{ ...inputStyle, fontFamily: 'ui-monospace,monospace' }} />
          </div>
          {createError && <p style={{ color: '#E0533C', fontSize: 13, margin: 0 }}>{createError}</p>}
          <button
            type="submit"
            disabled={creating}
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: creating ? 'default' : 'pointer', opacity: creating ? 0.7 : 1 }}
            onMouseEnter={e => !creating && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => !creating && (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            {creating ? 'Creating…' : 'Create workspace'}
          </button>
        </form>
      </AppShell>
    );
  }

  const scoredSites = sites.filter(s => s.score !== null);
  const avgScore = scoredSites.length ? Math.round(scoredSites.reduce((sum, s) => sum + (s.score as number), 0) / scoredSites.length) : null;
  const stats = [
    { label: 'Sites monitored', value: String(sites.length) },
    { label: 'Average score', value: avgScore !== null ? String(avgScore) : '—' },
    { label: 'Team members', value: String(members.length) },
  ];

  return (
    <AppShell active="agency" maxWidth={1160}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
            {org.name}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Client sites</h1>
        </div>
        {canManage && (
          <button
            onClick={() => setAddingSite(a => !a)}
            className="transition-colors hover:!background-[#345940]"
            style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}
          >
            + Add site
          </button>
        )}
      </div>

      {addingSite && (
        <form onSubmit={handleAddSite} style={{ ...card, display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            required
            autoFocus
            value={newSiteUrl}
            onChange={e => setNewSiteUrl(e.target.value)}
            placeholder="https://client-site.com"
            className="focus:!border-[#3CD070] focus:!outline-none"
            style={{ ...inputStyle, flex: 1, minWidth: 220, fontFamily: 'ui-monospace,monospace' }}
          />
          <button
            type="submit"
            disabled={addSiteSubmitting}
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '10px 18px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: addSiteSubmitting ? 'default' : 'pointer', opacity: addSiteSubmitting ? 0.7 : 1 }}
          >
            {addSiteSubmitting ? 'Adding…' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => { setAddingSite(false); setAddSiteError(''); }}
            style={{ background: 'none', border: `1px solid ${theme.border}`, color: theme.textSecondary, padding: '10px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            Cancel
          </button>
          {addSiteError && <p style={{ color: '#E0533C', fontSize: 13, margin: 0, width: '100%' }}>{addSiteError}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
        {sites.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 4px' }}>No sites yet</p>
            <p style={{ fontSize: 12, color: theme.textSecondary, margin: 0 }}>Add a client site to start tracking its AEO/GEO score over time.</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', padding: '14px 24px', borderBottom: `1px solid ${theme.border}`, fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              <div>Site</div><div>Score</div><div>Trend</div><div>Last scan</div><div>Status</div><div />
            </div>
            {sites.map(site => {
              const status = site.score === null ? null : site.score >= 60 ? 'Healthy' : 'Needs attention';
              const href = site.lastScanId ? `/report/${site.lastScanId}` : `/scan?url=${encodeURIComponent(site.url)}`;
              return (
                <div key={site._id} className="group grid grid-cols-1 sm:[grid-template-columns:2fr_1fr_1fr_1fr_1fr_auto]" style={{ padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, alignItems: 'center', gap: 4 }}>
                  <Link href={href} className="transition-colors hover:!text-[#3CD070]" style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>{site.url.replace(/^https?:\/\//, '')}</Link>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{site.score ?? '—'}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: site.trend === null ? theme.textSecondary : site.trend >= 0 ? SITE_ACCENT : '#E0533C' }}>
                    {site.trend === null ? '—' : `${site.trend >= 0 ? '▲' : '▼'} ${site.trend >= 0 ? '+' : ''}${site.trend}`}
                  </div>
                  <div style={{ fontSize: 13, color: theme.textSecondary }}>{relativeTime(site.lastScan)}</div>
                  <div>
                    {status && (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12, background: status === 'Healthy' ? '#3CD07026' : '#D99E3226', color: status === 'Healthy' ? '#3CD070' : '#D99E32' }}>
                        {status}
                      </span>
                    )}
                  </div>
                  <div>
                    {canManage && (
                      <button
                        onClick={() => handleRemoveSite(site._id)}
                        disabled={removingSiteId === site._id}
                        title="Remove site"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:!text-[#E0533C]"
                        style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 4 }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
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
