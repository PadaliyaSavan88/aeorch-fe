'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/auth';
import { authApi } from '@/lib/api';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT } from '@/lib/siteTheme';

function CallbackHandler() {
  const { theme } = useSiteTheme();
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
      <span className="animate-pulse" style={{ width: 48, height: 48, borderRadius: 14, background: SITE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 28 28">
          <rect x="6" y="17" width="3.5" height="7" rx="1" fill="#121314" />
          <rect x="12" y="13" width="3.5" height="11" rx="1" fill="#121314" />
          <rect x="18" y="9" width="3.5" height="15" rx="1" fill="#121314" />
        </svg>
      </span>
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
