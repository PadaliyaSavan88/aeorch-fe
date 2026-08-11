'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { scanApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

type Stage = 'input' | 'discovering' | 'confirm' | 'queued' | 'polling';

interface DiscoverResult {
  totalPages: number;
  availableCredits: number;
  requiresConfirmation: boolean;
}

const SCAN_STEPS = ['Discovering pages via sitemap', 'Crawling and analysing each page', 'Running SEO, AEO & GEO checks', 'Checking AI bot access', 'Generating your report'];

function ScanFlow() {
  const { theme } = useSiteTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [stage, setStage] = useState<Stage>('input');
  const [discover, setDiscover] = useState<DiscoverResult | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) router.replace('/login');
  }, [router]);

  async function handleDiscover(e: FormEvent) {
    e.preventDefault();
    setError('');
    setStage('discovering');
    try {
      const { data: body } = await scanApi.discover(url);
      const data = body.data;
      setDiscover(data);
      if (data.requiresConfirmation) {
        setStage('confirm');
      } else {
        await startScan(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to discover pages. Check the URL and try again.');
      setStage('input');
    }
  }

  async function startScan(confirm: boolean) {
    setError('');
    setStage('queued');
    try {
      const { data: body } = await scanApi.create(url, confirm);
      const data = body.data;
      setScanId(data._id);
      setStage('polling');
      pollScan(data._id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start scan.');
      setStage('input');
    }
  }

  function pollScan(id: string) {
    const interval = setInterval(async () => {
      try {
        const { data: body } = await scanApi.get(id);
        const data = body.data;
        if (data.status === 'completed') {
          clearInterval(interval);
          router.push(`/report/${id}`);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError('Scan failed. Please try again.');
          setStage('input');
        }
      } catch {
        clearInterval(interval);
        setError('Lost connection while polling. Check your scan status in the dashboard.');
      }
    }, 3000);
  }

  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 32 };
  const iconBox = (bg: string): React.CSSProperties => ({ width: 56, height: 56, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' });

  return (
    <AppShell maxWidth={520}>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
          {(stage === 'input' || stage === 'discovering') && (
            <div style={{ ...card, textAlign: 'center' }}>
              <div style={iconBox('#3CD07022')}>
                <Search className="w-6 h-6" style={{ color: SITE_ACCENT }} />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Scan your website</h1>
              <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 28px' }}>
                Enter your website URL. We&apos;ll check SEO, AEO, GEO, AI Compatibility and Authority.
              </p>

              {error && (
                <div style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 8, background: '#E0533C1a', border: '1px solid #E0533C55', fontSize: 13, color: '#E0533C', textAlign: 'left' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleDiscover} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="yourwebsite.com"
                  required
                  disabled={stage === 'discovering'}
                  className="focus:!border-[#3CD070] focus:!outline-none"
                  style={{ width: '100%', boxSizing: 'border-box', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '14px 16px', fontSize: 15, color: theme.textPrimary, fontFamily: 'inherit' }}
                />
                <button
                  type="submit"
                  disabled={stage === 'discovering'}
                  className="flex items-center justify-center gap-2"
                  style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '14px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: stage === 'discovering' ? 'default' : 'pointer', opacity: stage === 'discovering' ? 0.7 : 1, fontFamily: 'inherit' }}
                  onMouseEnter={e => stage !== 'discovering' && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
                >
                  {stage === 'discovering' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Discovering pages…</>
                  ) : (
                    <>Start scan <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p style={{ fontSize: 11.5, color: theme.textSecondary, marginTop: 20 }}>1 credit = 1 page scanned</p>
            </div>
          )}

          {stage === 'confirm' && discover && (
            <div style={card}>
              <div style={iconBox('#D99E3222')}>
                <AlertTriangle className="w-6 h-6" style={{ color: '#D99E32' }} />
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 16px', textAlign: 'center' }}>Credit limit reached</h2>

              <div style={{ background: theme.bg, borderRadius: 10, padding: 18, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: theme.textSecondary }}>Pages discovered</span>
                  <span style={{ fontWeight: 600 }}>{discover.totalPages}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: theme.textSecondary }}>Your available credits</span>
                  <span style={{ fontWeight: 600 }}>{discover.availableCredits}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>
                  <span style={{ color: theme.textSecondary }}>Pages that will be scanned</span>
                  <span style={{ fontWeight: 700, color: SITE_ACCENT }}>{discover.availableCredits}</span>
                </div>
              </div>

              <p style={{ fontSize: 13.5, color: theme.textSecondary, textAlign: 'center', margin: '0 0 20px', lineHeight: 1.6 }}>
                This site has <strong style={{ color: theme.textPrimary }}>{discover.totalPages} pages</strong> but you only have{' '}
                <strong style={{ color: theme.textPrimary }}>{discover.availableCredits} credits</strong>. We&apos;ll scan the first{' '}
                <strong style={{ color: theme.textPrimary }}>{discover.availableCredits} pages</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => startScan(true)}
                  className="flex items-center justify-center gap-2"
                  style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '13px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Scan {discover.availableCredits} pages (use all credits)
                </button>
                <button
                  onClick={() => setStage('input')}
                  className="transition-colors hover:!border-[#3CD070]"
                  style={{ border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, padding: '13px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>

              <p style={{ fontSize: 11.5, color: theme.textSecondary, textAlign: 'center', marginTop: 16 }}>
                Need more credits?{' '}
                <Link href="/contact" style={{ color: SITE_ACCENT }}>Contact us for premium</Link>{' '}
                or{' '}
                <Link href="/dashboard" style={{ color: SITE_ACCENT }}>refer friends</Link>.
              </p>
            </div>
          )}

          {(stage === 'queued' || stage === 'polling') && (
            <div style={{ ...card, textAlign: 'center' }}>
              <div className="animate-pulse" style={iconBox('#3CD07022')}>
                <Search className="w-6 h-6" style={{ color: SITE_ACCENT }} />
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>Scanning your website…</h2>
              <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 28px' }}>
                We&apos;re crawling your pages and running all 5 analysis dimensions. This usually takes 1–2 minutes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                {SCAN_STEPS.map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Loader2 className={i < 2 ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} style={{ color: SITE_ACCENT, opacity: i < 2 ? 1 : 0.3 }} />
                    <span style={{ fontSize: 13.5, color: i < 2 ? theme.textPrimary : theme.textSecondary }}>{step}</span>
                  </div>
                ))}
              </div>

              {scanId && (
                <p style={{ fontSize: 11.5, color: theme.textSecondary, marginTop: 28 }}>
                  Scan ID: <code style={{ fontFamily: 'ui-monospace,monospace' }}>{scanId}</code>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function ScanPage() {
  return (
    <SiteThemeProvider>
      <Suspense fallback={null}>
        <ScanFlow />
      </Suspense>
    </SiteThemeProvider>
  );
}
