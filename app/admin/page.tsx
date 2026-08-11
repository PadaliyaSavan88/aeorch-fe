'use client';

import { Fragment, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, BarChart2, Mail, Zap, Trash2, ChevronLeft, ChevronRight,
  Search, CreditCard, LogOut, RefreshCw, Shield, DollarSign, ScrollText,
} from 'lucide-react';
import { authApi, adminApi } from '@/lib/api';
import { clearTokens, isLoggedIn } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT } from '@/lib/siteTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  totalScans: number;
  completedScans: number;
  totalContacts: number;
  referralCount: number;
  totalCreditsUsed: number;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  isAdmin: boolean;
  referralCount: number;
  scanCount: number;
  createdAt: string;
}

interface Scan {
  _id: string;
  url: string;
  status: string;
  finalScore?: number;
  creditsUsed?: number;
  createdAt: string;
  userId?: { name: string; email: string };
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

type Tab = 'overview' | 'users' | 'scans' | 'contacts' | 'revenue' | 'logs';

// ─── Page ────────────────────────────────────────────────────────────────────

function AdminBody() {
  const { theme } = useSiteTheme();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [currentUser, setCurrentUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }
    authApi.me()
      .then(res => {
        const user = res.data.data;
        if (!user.isAdmin) { router.replace('/dashboard'); return; }
        setCurrentUser(user);
        setLoading(false);
      })
      .catch(() => { clearTokens(); router.replace('/login'); });
  }, [router]);

  async function handleLogout() {
    try {
      const refresh = localStorage.getItem('refreshToken') || undefined;
      await authApi.logout(refresh);
    } catch {}
    clearTokens();
    router.push('/');
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: SITE_ACCENT, background: theme.bg }}>Loading…</div>;
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; real: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2, real: true },
    { id: 'users', label: 'Users', icon: Users, real: true },
    { id: 'scans', label: 'Scans', icon: Zap, real: true },
    { id: 'contacts', label: 'Contacts', icon: Mail, real: true },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, real: false },
    { id: 'logs', label: 'Logs', icon: ScrollText, real: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: theme.bg }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, background: theme.bg, zIndex: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield className="w-4 h-4" style={{ color: SITE_ACCENT }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Admin</span>
        </div>
        <span style={{ color: theme.textSecondary, fontSize: 13 }} className="hidden sm:inline">|</span>
        <span className="hidden sm:inline" style={{ fontSize: 13, color: theme.textSecondary }}>{currentUser?.email}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" className="transition-colors hover:!text-[#3CD070]" style={{ fontSize: 13, color: theme.textSecondary }}>Dashboard</Link>
          <button onClick={handleLogout} className="transition-colors hover:!text-[#3CD070]" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: theme.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Admin Panel</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, marginTop: 4 }}>Manage users, scans, and contact submissions.</p>
        </div>

        <div style={{ display: 'flex', gap: 4, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 4, marginBottom: 28, width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: 'none', cursor: 'pointer', background: active ? '#2A4736' : 'none', color: active ? '#F9F9F8' : theme.textSecondary,
                }}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && <OverviewTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'scans' && <ScansTab />}
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'revenue' && <RevenueTab />}
        {tab === 'logs' && <LogsTab />}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <SiteThemeProvider>
      <AdminBody />
    </SiteThemeProvider>
  );
}

// ─── Overview Tab (real) ──────────────────────────────────────────────────────

function OverviewTab() {
  const { theme } = useSiteTheme();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.stats().then(r => setStats(r.data.data));
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: 'Total users', value: stats.totalUsers, icon: Users, color: SITE_ACCENT },
    { label: 'Total scans', value: stats.totalScans, icon: Zap, color: '#B57FE0' },
    { label: 'Completed scans', value: stats.completedScans, icon: BarChart2, color: '#3CD070' },
    { label: 'Referrals', value: stats.referralCount, icon: RefreshCw, color: '#D99E32' },
    { label: 'Credits used', value: stats.totalCreditsUsed, icon: CreditCard, color: '#7FB2FF' },
    { label: 'Contact messages', value: stats.totalContacts, icon: Mail, color: '#E0533C' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.label} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 22 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon className="w-5 h-5" style={{ color: c.color }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{c.value.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>{c.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Users Tab (real) ─────────────────────────────────────────────────────────

function UsersTab() {
  const { theme } = useSiteTheme();
  const [data, setData] = useState<{ users: AdminUser[]; total: number; pages: number } | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [creditModal, setCreditModal] = useState<AdminUser | null>(null);
  const [creditAmt, setCreditAmt] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setData(null);
    adminApi.listUsers(page, query).then(r => setData(r.data.data));
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  async function handleDeleteUser(user: AdminUser) {
    if (!confirm(`Delete ${user.email}? This also deletes all their scans.`)) return;
    await adminApi.deleteUser(user._id);
    load();
  }

  async function handlePlanChange(user: AdminUser, plan: string) {
    await adminApi.changePlan(user._id, plan);
    load();
  }

  async function handleCreditSave() {
    if (!creditModal) return;
    const amt = parseInt(creditAmt);
    if (isNaN(amt)) return;
    setSaving(true);
    await adminApi.adjustCredits(creditModal._id, amt, creditReason || undefined);
    setSaving(false);
    setCreditModal(null);
    setCreditAmt('');
    setCreditReason('');
    load();
  }

  const th: React.CSSProperties = { padding: '10px 14px', fontWeight: 600, fontSize: 12, color: theme.textSecondary, textAlign: 'left' };
  const td: React.CSSProperties = { padding: '10px 14px', fontSize: 13 };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search className="w-4 h-4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setPage(1); setQuery(search); } }}
            className="focus:!border-[#3CD070] focus:!outline-none"
            style={{ width: '100%', boxSizing: 'border-box', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '10px 12px 10px 36px', fontSize: 13.5, color: theme.textPrimary }}
          />
        </div>
        <button onClick={() => { setPage(1); setQuery(search); }} style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Search
        </button>
      </div>

      {!data ? <Spinner /> : (
        <>
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg }}>
                    <th style={th}>User</th><th style={th}>Plan</th><th style={th}>Credits</th><th style={th}>Scans</th><th style={th}>Referrals</th><th style={th}>Joined</th><th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(u => (
                    <tr key={u._id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={td}>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ color: theme.textSecondary, fontSize: 11.5 }}>{u.email}</div>
                        {u.isAdmin && <span style={{ fontSize: 10.5, fontWeight: 600, color: SITE_ACCENT, background: '#3CD07022', padding: '1px 7px', borderRadius: 20 }}>admin</span>}
                      </td>
                      <td style={td}>
                        <select
                          value={u.plan}
                          onChange={e => handlePlanChange(u, e.target.value)}
                          style={{ fontSize: 12, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '4px 8px', background: theme.bg, color: theme.textPrimary }}
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                        </select>
                      </td>
                      <td style={{ ...td, fontWeight: 600 }}>{u.credits}</td>
                      <td style={{ ...td, color: theme.textSecondary }}>{u.scanCount}</td>
                      <td style={{ ...td, color: theme.textSecondary }}>{u.referralCount}</td>
                      <td style={{ ...td, color: theme.textSecondary, fontSize: 11.5 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setCreditModal(u)} title="Adjust credits" style={{ padding: 6, borderRadius: 6, border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, cursor: 'pointer' }}>
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          {!u.isAdmin && (
                            <button onClick={() => handleDeleteUser(u)} title="Delete user" style={{ padding: 6, borderRadius: 6, border: '1px solid #E0533C55', background: 'none', color: '#E0533C', cursor: 'pointer' }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
        </>
      )}

      {creditModal && (
        <Modal title={`Adjust credits — ${creditModal.email}`} onClose={() => setCreditModal(null)}>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>Current balance: <strong style={{ color: theme.textPrimary }}>{creditModal.credits}</strong> credits</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Amount (use negative to deduct)</label>
              <input
                type="number"
                placeholder="e.g. 20 or -10"
                value={creditAmt}
                onChange={e => setCreditAmt(e.target.value)}
                className="focus:!border-[#3CD070] focus:!outline-none"
                style={{ width: '100%', boxSizing: 'border-box', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '10px 12px', fontSize: 14, color: theme.textPrimary }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Reason (optional)</label>
              <input
                placeholder="e.g. Compensation for failed scan"
                value={creditReason}
                onChange={e => setCreditReason(e.target.value)}
                className="focus:!border-[#3CD070] focus:!outline-none"
                style={{ width: '100%', boxSizing: 'border-box', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '10px 12px', fontSize: 14, color: theme.textPrimary }}
              />
            </div>
            <button onClick={handleCreditSave} disabled={saving} style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Apply'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Scans Tab (real) ─────────────────────────────────────────────────────────

function ScansTab() {
  const { theme } = useSiteTheme();
  const [data, setData] = useState<{ scans: Scan[]; total: number; pages: number } | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setData(null);
    adminApi.listScans(page).then(r => setData(r.data.data));
  }, [page]);

  const statusColor: Record<string, string> = { queued: theme.textSecondary, running: '#D99E32', completed: '#3CD070', failed: '#E0533C' };
  const th: React.CSSProperties = { padding: '10px 14px', fontWeight: 600, fontSize: 12, color: theme.textSecondary, textAlign: 'left' };
  const td: React.CSSProperties = { padding: '10px 14px', fontSize: 13 };

  return !data ? <Spinner /> : (
    <div>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg }}>
                <th style={th}>URL</th><th style={th}>User</th><th style={th}>Status</th><th style={th}>Score</th><th style={th}>Credits</th><th style={th}>Date</th><th style={th}>Report</th>
              </tr>
            </thead>
            <tbody>
              {data.scans.map(s => {
                const c = statusColor[s.status] ?? theme.textSecondary;
                return (
                  <tr key={s._id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ ...td, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.url}</td>
                    <td style={td}>
                      {s.userId ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.userId.name}</div>
                          <div style={{ color: theme.textSecondary, fontSize: 11.5 }}>{s.userId.email}</div>
                        </div>
                      ) : <span style={{ color: theme.textSecondary }}>—</span>}
                    </td>
                    <td style={td}><span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${c}22`, color: c, textTransform: 'capitalize' }}>{s.status}</span></td>
                    <td style={{ ...td, fontWeight: 600 }}>{s.finalScore !== undefined ? `${s.finalScore}/100` : '—'}</td>
                    <td style={{ ...td, color: theme.textSecondary }}>{s.creditsUsed ?? '—'}</td>
                    <td style={{ ...td, color: theme.textSecondary, fontSize: 11.5 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      {s.status === 'completed' && (
                        <Link href={`/report/${s._id}`} target="_blank" className="transition-colors hover:!text-[#5ddb8c]" style={{ color: SITE_ACCENT, fontSize: 12 }}>View →</Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
    </div>
  );
}

// ─── Contacts Tab (real) ──────────────────────────────────────────────────────

function ContactsTab() {
  const { theme } = useSiteTheme();
  const [data, setData] = useState<{ contacts: Contact[]; total: number; pages: number } | null>(null);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(() => {
    setData(null);
    adminApi.listContacts(page).then(r => setData(r.data.data));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this submission?')) return;
    await adminApi.deleteContact(id);
    load();
  }

  const th: React.CSSProperties = { padding: '10px 14px', fontWeight: 600, fontSize: 12, color: theme.textSecondary, textAlign: 'left' };
  const td: React.CSSProperties = { padding: '10px 14px', fontSize: 13 };

  return !data ? <Spinner /> : (
    <div>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg }}>
                <th style={th}>From</th><th style={th}>Subject</th><th style={th}>Message</th><th style={th}>Date</th><th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {data.contacts.map(c => (
                <Fragment key={c._id}>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }} onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ color: theme.textSecondary, fontSize: 11.5 }}>{c.email}</div>
                    </td>
                    <td style={{ ...td, color: theme.textSecondary }}>{c.subject}</td>
                    <td style={{ ...td, color: theme.textSecondary, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                    <td style={{ ...td, color: theme.textSecondary, fontSize: 11.5 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      <button onClick={e => { e.stopPropagation(); handleDelete(c._id); }} style={{ padding: 6, borderRadius: 6, border: '1px solid #E0533C55', background: 'none', color: '#E0533C', cursor: 'pointer' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                  {expanded === c._id && (
                    <tr>
                      <td colSpan={5} style={{ padding: '14px', background: theme.bg }}>
                        <p style={{ fontSize: 13.5, whiteSpace: 'pre-wrap', margin: 0 }}>{c.message}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
    </div>
  );
}

// ─── Revenue Tab (dummy — no billing backend yet) ─────────────────────────────

const REVENUE_CARDS = [
  { label: 'Collected this month', value: '$0', note: 'No billing provider connected yet' },
  { label: 'Refunded', value: '$0', note: '—' },
  { label: 'Outstanding', value: '$0', note: '—' },
  { label: 'Lifetime revenue', value: '$0', note: '—' },
];

function RevenueTab() {
  const { theme } = useSiteTheme();
  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 12.5, color: theme.textSecondary }}>
        Preview — Stripe isn&apos;t wired up yet, so these are placeholder figures matching the design, not real transactions.
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 16, marginBottom: 20 }}>
        {REVENUE_CARDS.map(c => (
          <div key={c.label} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 20 }}>
            <div style={{ fontSize: 11.5, color: theme.textSecondary, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: theme.textSecondary }}>{c.note}</div>
          </div>
        ))}
      </div>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 40, textAlign: 'center', color: theme.textSecondary, fontSize: 13.5 }}>
        Transaction history will appear here once billing is connected.
      </div>
    </div>
  );
}

// ─── Logs Tab (dummy — no activity-log backend yet) ───────────────────────────

const LOG_KIND_COLOR: Record<string, string> = { billing: '#3CD070', auth: '#7FB2FF', system: '#D99E32', account: '#B57FE0' };
const SAMPLE_LOGS = [
  { time: '—', kind: 'system', message: 'Activity log not connected yet — this feed will show billing, auth, account and system events.' },
];

function LogsTab() {
  const { theme } = useSiteTheme();
  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 12.5, color: theme.textSecondary }}>
        Preview — no activity-log backend exists yet, so this is a placeholder feed matching the design.
      </div>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
        {SAMPLE_LOGS.map((log, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 92px 1fr', padding: '12px 16px', borderBottom: i < SAMPLE_LOGS.length - 1 ? `1px solid ${theme.border}` : undefined, fontSize: 12.5, alignItems: 'center', gap: 8 }}>
            <span style={{ color: theme.textSecondary, fontVariantNumeric: 'tabular-nums' }}>{log.time}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: LOG_KIND_COLOR[log.kind], background: `${LOG_KIND_COLOR[log.kind]}22`, padding: '2px 8px', borderRadius: 20, width: 'fit-content' }}>
              {log.kind}
            </span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: SITE_ACCENT }}>
      Loading…
    </div>
  );
}

function Pagination({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (p: number) => void }) {
  const { theme } = useSiteTheme();
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 13, color: theme.textSecondary }}>
      <span>{total} total</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button disabled={page === 1} onClick={() => onPage(page - 1)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span style={{ color: theme.textPrimary, fontWeight: 600 }}>{page} / {pages}</span>
        <button disabled={page === pages} onClick={() => onPage(page + 1)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, cursor: page === pages ? 'default' : 'pointer', opacity: page === pages ? 0.4 : 1 }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const { theme } = useSiteTheme();
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#00000066' }}>
      <div onClick={e => e.stopPropagation()} style={{ border: `1px solid ${theme.border}`, background: theme.card, borderRadius: 8, padding: 24, width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{title}</h3>
          <button onClick={onClose} className="transition-colors hover:!text-[#3CD070]" style={{ color: theme.textSecondary, background: 'none', border: 'none', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
