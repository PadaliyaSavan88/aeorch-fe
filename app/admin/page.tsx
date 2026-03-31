'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, BarChart2, Mail, Zap, Trash2, ChevronLeft, ChevronRight,
  Search, CreditCard, LogOut, RefreshCw, Shield,
} from 'lucide-react';
import { authApi, adminApi } from '@/lib/api';
import { clearTokens, isLoggedIn } from '@/lib/auth';
import AppHeader from '@/components/layout/AppHeader';

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

type Tab = 'overview' | 'users' | 'scans' | 'contacts';

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [currentUser, setCurrentUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }
    authApi.me()
      .then(res => {
        if (!res.data.isAdmin) { router.replace('/dashboard'); return; }
        setCurrentUser(res.data);
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
    return (
      <>
        <AppHeader />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview',  icon: BarChart2 },
    { id: 'users',    label: 'Users',     icon: Users },
    { id: 'scans',    label: 'Scans',     icon: Zap },
    { id: 'contacts', label: 'Contacts',  icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-medium text-navy-900">Admin</span>
        </div>
        <span className="text-sm text-slate-400 hidden sm:block">|</span>
        <span className="text-sm text-slate-600 hidden sm:block truncate">{currentUser?.email}</span>
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-navy-900 transition-colors">Dashboard</Link>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </AppHeader>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Manage users, scans, and contact submissions.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 mb-8 w-fit shadow-sm">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && <OverviewTab />}
        {tab === 'users'    && <UsersTab />}
        {tab === 'scans'    && <ScansTab />}
        {tab === 'contacts' && <ContactsTab />}
      </main>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.stats().then(r => setStats(r.data));
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: 'Total users',      value: stats.totalUsers,       icon: Users,      color: 'bg-brand-50 text-brand-600' },
    { label: 'Total scans',      value: stats.totalScans,       icon: Zap,        color: 'bg-violet-50 text-violet-600' },
    { label: 'Completed scans',  value: stats.completedScans,   icon: BarChart2,  color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Referrals',        value: stats.referralCount,    icon: RefreshCw,  color: 'bg-amber-50 text-amber-600' },
    { label: 'Credits used',     value: stats.totalCreditsUsed, icon: CreditCard, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Contact messages', value: stats.totalContacts,    icon: Mail,       color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="card p-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-navy-900">{c.value.toLocaleString()}</div>
            <div className="text-sm text-slate-500 mt-1">{c.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const [data, setData]       = useState<{ users: AdminUser[]; total: number; pages: number } | null>(null);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [creditModal, setCreditModal] = useState<AdminUser | null>(null);
  const [creditAmt, setCreditAmt]     = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [saving, setSaving]   = useState(false);

  const load = useCallback(() => {
    setData(null);
    adminApi.listUsers(page, query).then(r => setData(r.data));
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

  return (
    <div>
      {/* Search */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field !pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setPage(1); setQuery(search); } }}
          />
        </div>
        <button onClick={() => { setPage(1); setQuery(search); }} className="btn-primary !py-2 !text-sm">Search</button>
      </div>

      {!data ? <Spinner /> : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-semibold text-navy-900">User</th>
                    <th className="px-4 py-3 font-semibold text-navy-900">Plan</th>
                    <th className="px-4 py-3 font-semibold text-navy-900">Credits</th>
                    <th className="px-4 py-3 font-semibold text-navy-900">Scans</th>
                    <th className="px-4 py-3 font-semibold text-navy-900">Referrals</th>
                    <th className="px-4 py-3 font-semibold text-navy-900">Joined</th>
                    <th className="px-4 py-3 font-semibold text-navy-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-navy-900">{u.name}</div>
                        <div className="text-slate-400 text-xs">{u.email}</div>
                        {u.isAdmin && <span className="badge bg-brand-50 text-brand-700 text-xs">admin</span>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.plan}
                          onChange={e => handlePlanChange(u, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 font-medium text-navy-900">{u.credits}</td>
                      <td className="px-4 py-3 text-slate-600">{u.scanCount}</td>
                      <td className="px-4 py-3 text-slate-600">{u.referralCount}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCreditModal(u)}
                            className="text-xs px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                            title="Adjust credits"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          {!u.isAdmin && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="text-xs px-2 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete user"
                            >
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

      {/* Credit adjustment modal */}
      {creditModal && (
        <Modal title={`Adjust credits — ${creditModal.email}`} onClose={() => setCreditModal(null)}>
          <p className="text-sm text-slate-500 mb-4">Current balance: <strong>{creditModal.credits}</strong> credits</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Amount (use negative to deduct)</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 20 or -10"
                value={creditAmt}
                onChange={e => setCreditAmt(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Reason (optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Compensation for failed scan"
                value={creditReason}
                onChange={e => setCreditReason(e.target.value)}
              />
            </div>
            <button onClick={handleCreditSave} disabled={saving} className="btn-primary w-full justify-center">
              {saving ? 'Saving…' : 'Apply'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Scans Tab ────────────────────────────────────────────────────────────────

function ScansTab() {
  const [data, setData] = useState<{ scans: Scan[]; total: number; pages: number } | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setData(null);
    adminApi.listScans(page).then(r => setData(r.data));
  }, [page]);

  const statusColor: Record<string, string> = {
    queued:    'bg-slate-100 text-slate-500',
    running:   'bg-amber-50 text-amber-600',
    completed: 'bg-emerald-50 text-emerald-700',
    failed:    'bg-red-50 text-red-600',
  };

  return !data ? <Spinner /> : (
    <div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-navy-900">URL</th>
                <th className="px-4 py-3 font-semibold text-navy-900">User</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Status</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Score</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Credits</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Date</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.scans.map(s => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 max-w-[200px] truncate text-navy-900 font-medium">{s.url}</td>
                  <td className="px-4 py-3">
                    {s.userId ? (
                      <div>
                        <div className="font-medium text-navy-900">{s.userId.name}</div>
                        <div className="text-slate-400 text-xs">{s.userId.email}</div>
                      </div>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${statusColor[s.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {s.finalScore !== undefined ? `${s.finalScore}/100` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.creditsUsed ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {s.status === 'completed' && (
                      <Link href={`/report/${s._id}`} target="_blank" className="text-brand-600 hover:underline text-xs">
                        View →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

function ContactsTab() {
  const [data, setData]   = useState<{ contacts: Contact[]; total: number; pages: number } | null>(null);
  const [page, setPage]   = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(() => {
    setData(null);
    adminApi.listContacts(page).then(r => setData(r.data));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this submission?')) return;
    await adminApi.deleteContact(id);
    load();
  }

  return !data ? <Spinner /> : (
    <div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-navy-900">From</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Subject</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Message</th>
                <th className="px-4 py-3 font-semibold text-navy-900">Date</th>
                <th className="px-4 py-3 font-semibold text-navy-900"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.contacts.map(c => (
                <>
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy-900">{c.name}</div>
                      <div className="text-slate-400 text-xs">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.subject}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[240px] truncate">{c.message}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(c._id); }}
                        className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                  {expanded === c._id && (
                    <tr key={`${c._id}-expanded`}>
                      <td colSpan={5} className="px-4 py-4 bg-slate-50">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.message}</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
    </div>
  );
}

function Pagination({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <button disabled={page === 1} onClick={() => onPage(page - 1)} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-navy-900 font-medium">{page} / {pages}</span>
        <button disabled={page === pages} onClick={() => onPage(page + 1)} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-navy-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-navy-900 transition-colors text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
