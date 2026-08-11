'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Share2, Clock, ExternalLink, Copy, Check, Plus, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { authApi, scanApi } from '@/lib/api';
import { clearTokens, isLoggedIn } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

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

const STATUS_COLOR: Record<string, string> = {
  queued: '#8E918F', running: '#D99E32', completed: '#3CD070', failed: '#E0533C',
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? '#8E918F';
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${c}22`, color: c, textTransform: 'capitalize' }}>
      {status}
    </span>
  );
}

/** Delta vs. the closest earlier completed scan of the same URL, or null if there isn't one. */
function computeDelta(scans: Scan[], scan: Scan): number | null {
  if (scan.finalScore === undefined || scan.status !== 'completed') return null;
  const earlier = scans
    .filter(s => s.url === scan.url && s.status === 'completed' && s.finalScore !== undefined && new Date(s.createdAt) < new Date(scan.createdAt))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (earlier.length === 0) return null;
  return scan.finalScore - (earlier[0].finalScore as number);
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return null;
  const up = delta > 0;
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color: up ? SITE_ACCENT : '#E0533C' }}>
      {up ? '▲' : '▼'} {up ? '+' : ''}{delta}
    </span>
  );
}

function DashboardBody() {
  const { theme } = useSiteTheme();
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
        setUser(meRes.data.data);
        setReferral(refRes.data.data);
        setScans(scansRes.data.data);
      })
      .catch(() => { clearTokens(); router.replace('/login'); })
      .finally(() => setLoading(false));
  }, [router]);

  function copyReferralLink() {
    if (!referral) return;
    navigator.clipboard.writeText(referral.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const resetDate = user?.creditResetDate
    ? new Date(user.creditResetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';

  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 };

  if (loading) {
    return (
      <AppShell active="dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  return (
    <AppShell active="dashboard" maxWidth={1080}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p style={{ fontSize: 13.5, color: theme.textSecondary, marginTop: 4 }}>Here&apos;s your Aeorch overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20, marginBottom: 28 }}>
        {/* Credits card */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#3CD07022', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard className="w-5 h-5" style={{ color: SITE_ACCENT }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: theme.bg, color: theme.textSecondary, textTransform: 'capitalize' }}>
              {user?.plan} plan
            </span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{user?.credits ?? 0}</div>
          <div style={{ fontSize: 13.5, color: theme.textSecondary }}>page credits remaining</div>
          <div style={{ marginTop: 14, fontSize: 12, color: theme.textSecondary }}>Resets on {resetDate}</div>
          <Link
            href="/scan"
            className="flex items-center justify-center gap-2"
            style={{ marginTop: 16, background: SITE_CTA_BG, color: '#F9F9F8', padding: '11px', borderRadius: 8, fontWeight: 600, fontSize: 13.5 }}
            onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            <Plus className="w-4 h-4" /> Run a scan
          </Link>
        </div>

        {/* Referral card */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#7FB2FF22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 className="w-5 h-5" style={{ color: '#7FB2FF' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: '#3CD07022', color: SITE_ACCENT }}>
              {referral?.referralCount ?? 0} referrals
            </span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{referral?.creditsEarned ?? 0}</div>
          <div style={{ fontSize: 13.5, color: theme.textSecondary }}>credits earned from referrals</div>
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 11.5, color: theme.textSecondary, margin: '0 0 8px' }}>Your referral link (+20 credits each)</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                readOnly
                value={referral?.referralLink ?? ''}
                style={{ flex: 1, minWidth: 0, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '8px 10px', fontSize: 12, color: theme.textPrimary }}
              />
              <button
                onClick={copyReferralLink}
                title="Copy link"
                className="transition-colors hover:!border-[#3CD070]"
                style={{ flexShrink: 0, padding: 8, borderRadius: 6, border: `1px solid ${theme.border}`, background: 'none', cursor: 'pointer' }}
              >
                {copied ? <Check className="w-4 h-4" style={{ color: SITE_ACCENT }} /> : <Copy className="w-4 h-4" style={{ color: theme.textSecondary }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Premium CTA */}
        <div style={{ ...card, background: SITE_CTA_BG }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ffffff1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Sparkles className="w-5 h-5" style={{ color: '#F9F9F8' }} />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: '#F9F9F8', margin: '0 0 4px' }}>Need more?</h3>
          <p style={{ color: '#D7DED9', fontSize: 13.5, margin: '0 0 18px' }}>
            Unlimited credits, API access, scheduled scans, and white-label reports.
          </p>
          <Link
            href="/pricing"
            className="flex items-center justify-center"
            style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: 8, background: '#F9F9F8', color: SITE_CTA_BG, fontWeight: 600, fontSize: 13.5 }}
          >
            View plans
          </Link>
        </div>
      </div>

      {/* Recent scans */}
      <div style={{ ...card, padding: 0, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${theme.border}` }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Recent scans</h2>
          <Link href="/scan" className="transition-colors hover:!text-[#5ddb8c]" style={{ fontSize: 13, color: SITE_ACCENT, fontWeight: 600 }}>New scan →</Link>
        </div>

        {scans.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', textAlign: 'center' }}>
            <Clock className="w-9 h-9" style={{ color: theme.border, marginBottom: 12 }} />
            <p style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 4px' }}>No scans yet</p>
            <p style={{ fontSize: 12, color: theme.textSecondary, margin: '0 0 20px' }}>Run your first scan to see results here.</p>
            <Link href="/scan" style={{ background: SITE_CTA_BG, color: '#F9F9F8', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>Run a scan</Link>
          </div>
        ) : (
          <div>
            {scans.map(scan => (
              <div key={scan._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <StatusBadge status={scan.status} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scan.url}</p>
                    <p style={{ fontSize: 11.5, color: theme.textSecondary, margin: 0 }}>{new Date(scan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  {scan.finalScore !== undefined && (
                    <span style={{ fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {scan.finalScore}<span style={{ color: theme.textSecondary, fontWeight: 400 }}>/100</span>
                      {(() => {
                        const delta = computeDelta(scans, scan);
                        return delta !== null ? <DeltaBadge delta={delta} /> : null;
                      })()}
                    </span>
                  )}
                  {scan.status === 'completed' && (
                    <Link href={`/report/${scan._id}`} className="flex items-center gap-1 transition-colors hover:!text-[#5ddb8c]" style={{ fontSize: 13, color: SITE_ACCENT }}>
                      Report <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features & Learn links */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
        <Link href="/features" className="flex items-center transition-colors hover:!border-[#3CD070]" style={{ ...card, gap: 16 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#3CD07022', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles className="w-5 h-5" style={{ color: SITE_ACCENT }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Features & Pricing</p>
            <p style={{ fontSize: 11.5, color: theme.textSecondary, margin: '2px 0 0' }}>See what&apos;s included in each plan</p>
          </div>
          <ArrowRight className="w-4 h-4" style={{ color: theme.textSecondary, marginLeft: 'auto', flexShrink: 0 }} />
        </Link>
        <Link href="/blog" className="flex items-center transition-colors hover:!border-[#3CD070]" style={{ ...card, gap: 16 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#B57FE022', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen className="w-5 h-5" style={{ color: '#B57FE0' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Learn</p>
            <p style={{ fontSize: 11.5, color: theme.textSecondary, margin: '2px 0 0' }}>Why AEO, GEO & AI compatibility matter</p>
          </div>
          <ArrowRight className="w-4 h-4" style={{ color: theme.textSecondary, marginLeft: 'auto', flexShrink: 0 }} />
        </Link>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <SiteThemeProvider>
      <DashboardBody />
    </SiteThemeProvider>
  );
}
