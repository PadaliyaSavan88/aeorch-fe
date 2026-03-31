'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Zap, Search, AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { scanApi } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import AppHeader from '@/components/layout/AppHeader';

type Stage = 'input' | 'discovering' | 'confirm' | 'queued' | 'polling';

interface DiscoverResult {
  totalPages: number;
  availableCredits: number;
  requiresConfirmation: boolean;
}

function ScanFlow() {
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
      const { data } = await scanApi.discover(url);
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
      const { data } = await scanApi.create(url, confirm);
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
        const { data } = await scanApi.get(id);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader>
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-navy-900 transition-colors">← Dashboard</Link>
      </AppHeader>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-xl">

          {/* Input stage */}
          {(stage === 'input' || stage === 'discovering') && (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
                <Search className="w-7 h-7 text-brand-600" />
              </div>
              <h1 className="text-2xl font-bold text-navy-900 mb-2">Scan your website</h1>
              <p className="text-slate-500 text-sm mb-8">
                Enter your website URL. We&apos;ll check SEO, AEO, GEO, AI Compatibility and Authority.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 text-left">
                  {error}
                </div>
              )}

              <form onSubmit={handleDiscover} className="flex flex-col gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="input-field !py-4 text-base"
                  placeholder="https://yourwebsite.com"
                  required
                  disabled={stage === 'discovering'}
                />
                <button type="submit" className="btn-primary !py-4 justify-center" disabled={stage === 'discovering'}>
                  {stage === 'discovering' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Discovering pages…</>
                  ) : (
                    <>Start scan <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-400 mt-6">1 credit = 1 page scanned</p>
            </div>
          )}

          {/* Confirmation stage */}
          {stage === 'confirm' && discover && (
            <div className="card p-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 mb-3 text-center">Credit limit reached</h2>

              <div className="bg-slate-50 rounded-xl p-5 mb-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pages discovered</span>
                  <span className="font-semibold text-navy-900">{discover.totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Your available credits</span>
                  <span className="font-semibold text-navy-900">{discover.availableCredits}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="text-slate-500">Pages that will be scanned</span>
                  <span className="font-bold text-brand-600">{discover.availableCredits}</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 text-center mb-6">
                This site has <strong className="text-navy-900">{discover.totalPages} pages</strong> but you only have{' '}
                <strong className="text-navy-900">{discover.availableCredits} credits</strong>. We&apos;ll scan the first{' '}
                <strong className="text-navy-900">{discover.availableCredits} pages</strong>.
              </p>

              <div className="flex flex-col gap-3">
                <button onClick={() => startScan(true)} className="btn-primary w-full justify-center">
                  <CheckCircle className="w-4 h-4" />
                  Scan {discover.availableCredits} pages (use all credits)
                </button>
                <button onClick={() => setStage('input')} className="btn-secondary w-full justify-center">
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Need more credits?{' '}
                <Link href="/contact" className="text-brand-600 hover:underline">Contact us for premium</Link>{' '}
                or{' '}
                <Link href="/dashboard" className="text-brand-600 hover:underline">refer friends</Link>.
              </p>
            </div>
          )}

          {/* Scanning / polling stage */}
          {(stage === 'queued' || stage === 'polling') && (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Zap className="w-7 h-7 text-brand-600" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 mb-2">Scanning your website…</h2>
              <p className="text-slate-500 text-sm mb-8">
                We&apos;re crawling your pages and running all 5 analysis dimensions. This usually takes 1–2 minutes.
              </p>

              <div className="space-y-3 text-sm text-left">
                {['Discovering pages via sitemap', 'Crawling and analysing each page', 'Running SEO, AEO & GEO checks', 'Checking AI bot access', 'Generating your report'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <Loader2 className={`w-4 h-4 text-brand-600 ${i < 2 ? 'animate-spin' : 'opacity-30'}`} />
                    <span className={i < 2 ? 'text-slate-700' : 'text-slate-400'}>{step}</span>
                  </div>
                ))}
              </div>

              {scanId && (
                <p className="text-xs text-slate-400 mt-8">
                  Scan ID: <code className="font-mono">{scanId}</code>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ScanFlow />
    </Suspense>
  );
}
