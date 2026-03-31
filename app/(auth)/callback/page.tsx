'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/auth';
import { Zap } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      router.replace('/dashboard');
    } else {
      router.replace('/login?error=oauth_failed');
    }
  }, [params, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 animate-pulse">
        <Zap className="w-6 h-6 text-white" />
      </span>
      <p className="text-slate-500 text-sm">Signing you in…</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <CallbackHandler />
    </Suspense>
  );
}
