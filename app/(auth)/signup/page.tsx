'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Gift } from 'lucide-react';
import { authApi } from '@/lib/api';
import { saveTokens } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
      <rect width="28" height="28" rx="7" fill={SITE_ACCENT} />
      <rect x="6" y="17" width="3.5" height="7" rx="1" fill="#121314" />
      <rect x="12" y="13" width="3.5" height="11" rx="1" fill="#121314" />
      <rect x="18" y="9" width="3.5" height="15" rx="1" fill="#121314" />
    </svg>
  );
}

function SignupForm() {
  const { theme, themeName, toggleTheme } = useSiteTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const { data: body } = await authApi.register(name, email, password, refCode || undefined);
      saveTokens(body.data.accessToken, body.data.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', background: theme.card, border: `1px solid ${theme.border}`,
    borderRadius: 8, padding: '12px 14px', fontSize: 14, color: theme.textPrimary, marginBottom: 16,
    transition: 'border-color 150ms ease', fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '20px 48px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
          <Logo />
          <span style={{ fontSize: 17, fontWeight: 700, color: theme.textPrimary }}>Aeorch</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070] focus:outline focus:outline-2 focus:outline-[#3CD070] focus:outline-offset-2"
          style={{ background: 'none', border: `1px solid ${theme.border}`, color: theme.textSecondary, padding: '7px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        >
          {themeName === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <div style={{ maxWidth: 400, width: '100%', margin: '0 auto', padding: '80px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Create your account</h1>
        <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 32px' }}>
          No card required. Start with 20 free page credits.
        </p>

        {refCode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 14px', borderRadius: 8, background: '#3CD07014', border: '1px solid #3CD07055' }}>
            <Gift className="w-4 h-4 flex-shrink-0" style={{ color: SITE_ACCENT }} />
            <p style={{ fontSize: 13.5, color: SITE_ACCENT, fontWeight: 500, margin: 0 }}>
              Referral code applied — you&apos;ll get +20 bonus credits on signup!
            </p>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 8, background: '#E0533C1a', border: '1px solid #E0533C55', fontSize: 13.5, color: '#E0533C' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Full name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Smith"
            required
            autoComplete="name"
            className="focus:!border-[#3CD070] focus:!outline-none"
            style={inputStyle}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Work email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@youragency.com"
            required
            autoComplete="email"
            className="focus:!border-[#3CD070] focus:!outline-none"
            style={inputStyle}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
              className="focus:!border-[#3CD070] focus:!outline-none"
              style={{ ...inputStyle, marginBottom: 24, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 0 }}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'block', width: '100%', textAlign: 'center', background: SITE_CTA_BG, color: '#F9F9F8',
              padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15, marginBottom: 20,
              border: 'none', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 20px' }}>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
          <span style={{ fontSize: 12, color: theme.textSecondary }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
        </div>

        <a
          href={GOOGLE_AUTH_URL}
          className="transition-colors hover:!border-[#3CD070]"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box',
            border: `1px solid ${theme.border}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontWeight: 600,
            color: theme.textPrimary, marginBottom: 20,
          }}
        >
          <GoogleIcon />
          Continue with Google
        </a>

        <p style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', margin: '0 0 24px' }}>
          By creating an account you agree to our{' '}
          <Link href="/privacy" style={{ color: theme.textSecondary, textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: theme.textSecondary, margin: 0 }}>
          Already have an account? <Link href="/login" style={{ color: SITE_ACCENT }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <SiteThemeProvider>
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </SiteThemeProvider>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
