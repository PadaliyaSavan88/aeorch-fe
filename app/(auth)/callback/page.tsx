'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/auth';
import { authApi } from '@/lib/api';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';

function CallbackHandler() {
  const { theme, themeName } = useSiteTheme();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get('code');
    if (!code) {
      router.replace('/login?error=oauth_failed');
      return;
    }

    // The backend hands us a single-use opaque code rather than putting real
    // tokens in this URL — exchange it for the actual tokens now.
    authApi.exchangeGoogleCode(code)
      .then(res => {
        const { accessToken, refreshToken } = res.data.data;
        saveTokens(accessToken, refreshToken);
        router.replace('/dashboard');
      })
      .catch(() => router.replace('/login?error=oauth_failed'));
  }, [params, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <img
        className="animate-pulse"
        src={themeName === 'dark' ? '/logo/icon-dark.png' : '/logo/icon-light.png'}
        alt="Aeorch"
        width={48}
        height={48}
        style={{ borderRadius: 14 }}
      />
      <p style={{ fontSize: 13.5, color: theme.textSecondary }}>Signing you in…</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <SiteThemeProvider>
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </SiteThemeProvider>
  );
}
