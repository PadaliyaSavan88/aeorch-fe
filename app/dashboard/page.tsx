'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, CreditCard, Share2, Clock, ExternalLink, Copy, Check, LogOut, Plus, X, BookOpen, ArrowRight, Search, MessageSquare, MapPin, Bot, ShieldCheck } from 'lucide-react';
import { authApi, scanApi } from '@/lib/api';
import { clearTokens, isLoggedIn } from '@/lib/auth';
import AppHeader from '@/components/layout/AppHeader';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  plan: string;
  referralCode: string;
  creditResetDate: string;
}

interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  creditsEarned: number;
}

interface Scan {
  _id: string;
  url: string;
  status: string;
  finalScore?: number;
  creditsUsed?: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }

    Promise.all([authApi.me(), authApi.referral(), scanApi.list()])
      .then(([meRes, refRes, scansRes]) => {
        setUser(meRes.data);
        setReferral(refRes.data);
        setScans(scansRes.data);
      })
      .catch(() => { clearTokens(); router.replace('/login'); })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    try {
      const refresh = localStorage.getItem('refreshToken') || undefined;
      await authApi.logout(refresh);
    } catch {}
    clearTokens();
    router.push('/');
  }

  function copyReferralLink() {
    if (!referral) return;
    navigator.clipboard.writeText(referral.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const resetDate = user?.creditResetDate
    ? new Date(user.creditResetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader>
        <nav className="hidden md:flex items-center gap-1">
          {([['features', 'Features'], ['/blog', 'Learn']] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href.startsWith('/') ? href : `/${href}`} className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-navy-900 hover:bg-slate-50 transition-colors font-medium">{label}</Link>
          ))}
        </nav>
        <span className="text-sm text-slate-400 hidden sm:block">|</span>
        <span className="text-sm text-slate-600 hidden sm:block truncate">{user?.email}</span>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors flex-shrink-0">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </AppHeader>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-sm mt-1">Here&apos;s your Aeorch overview.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* Credits card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-600" />
              </div>
              <span className="badge bg-slate-100 text-slate-600 capitalize">{user?.plan} plan</span>
            </div>
            <div className="text-3xl font-bold text-navy-900 mb-1">{user?.credits ?? 0}</div>
            <div className="text-sm text-slate-500">page credits remaining</div>
            <div className="mt-4 text-xs text-slate-400">Resets on {resetDate}</div>
            <Link href="/scan" className="btn-primary w-full justify-center mt-4 !py-2.5 !text-sm">
              <Plus className="w-4 h-4" /> Run a scan
            </Link>
          </div>

          {/* Referral card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">{referral?.referralCount ?? 0} referrals</span>
            </div>
            <div className="text-3xl font-bold text-navy-900 mb-1">{referral?.creditsEarned ?? 0}</div>
            <div className="text-sm text-slate-500">credits earned from referrals</div>
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2">Your referral link (+20 credits each)</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={referral?.referralLink ?? ''}
                  className="input-field !py-2 !text-xs flex-1 min-w-0"
                />
                <button
                  onClick={copyReferralLink}
                  className="flex-shrink-0 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="card p-6 bg-gradient-hero text-white">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-lg mb-1">Need more?</h3>
            <p className="text-slate-300 text-sm mb-5">
              Unlimited credits, API access, scheduled scans, and white-label reports.
            </p>
            <Link href="/features#pricing" className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-white text-navy-900 font-semibold text-sm hover:bg-slate-100 transition-colors">
              View plans
            </Link>
          </div>
        </div>

        {/* Recent scans */}
        <div className="card" id="scans">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="font-semibold text-navy-900">Recent scans</h2>
            <Link href="/scan" className="text-sm text-brand-600 hover:underline font-medium">New scan →</Link>
          </div>

          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Clock className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-slate-500 text-sm font-medium mb-1">No scans yet</p>
              <p className="text-slate-400 text-xs mb-6">Run your first scan to see results here.</p>
              <Link href="/scan" className="btn-primary !text-sm !py-2.5">Run a scan</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {scans.map(scan => (
                <div key={scan._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <StatusBadge status={scan.status} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{scan.url}</p>
                      <p className="text-xs text-slate-400">{new Date(scan.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {scan.finalScore !== undefined && (
                      <span className="text-sm font-bold text-navy-900">{scan.finalScore}<span className="text-slate-400 font-normal">/100</span></span>
                    )}
                    {scan.status === 'completed' && (
                      <Link href={`/report/${scan._id}`} className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
                        Report <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Features & Learn links ──────────────────────────────── */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <Link href="/features" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-brand-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-navy-900 group-hover:text-brand-600 transition-colors">Features & Pricing</p>
              <p className="text-xs text-slate-400 mt-0.5">See what&apos;s included in each plan</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors ml-auto flex-shrink-0" />
          </Link>
          <Link href="/blog" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-navy-900 group-hover:text-brand-600 transition-colors">Learn</p>
              <p className="text-xs text-slate-400 mt-0.5">Why AEO, GEO & AI compatibility matter</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors ml-auto flex-shrink-0" />
          </Link>
        </div>

      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: 'bg-slate-100 text-slate-500',
    running: 'bg-amber-50 text-amber-600',
    completed: 'bg-emerald-50 text-emerald-700',
    failed: 'bg-red-50 text-red-600',
  };
  return <span className={`badge ${map[status] ?? 'bg-slate-100 text-slate-500'} capitalize`}>{status}</span>;
}
