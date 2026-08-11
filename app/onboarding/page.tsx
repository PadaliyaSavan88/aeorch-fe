'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

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

const SCAN_STEPS = ['Crawled 84 pages', 'Checked structured data', 'Scored content quality', 'Checked AI citation coverage'];

const nextButtonStyle = {
  background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '14px 24px', borderRadius: 8,
  fontWeight: 600, fontSize: 15, cursor: 'pointer', width: '100%', fontFamily: 'inherit',
} as const;

function OnboardingBody() {
  const { theme, themeName, toggleTheme } = useSiteTheme();
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');

  const next = () => setStep(s => Math.min(s + 1, 4));

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

      <div style={{ maxWidth: 560, width: '100%', margin: '0 auto', padding: '64px 24px', flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= step ? SITE_ACCENT : theme.border }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: SITE_ACCENT, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Step 1 of 4</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.01em' }}>What site should we scan?</h1>
            <p style={{ fontSize: 14.5, color: theme.textSecondary, margin: '0 0 28px' }}>
              We&apos;ll run a full AEO/GEO scan, crawlability, structured data, content quality and AI citations.
            </p>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://yourclient.com"
              className="focus:!border-[#3CD070] focus:!outline-none"
              style={{ width: '100%', boxSizing: 'border-box', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '14px 16px', fontSize: 15, color: theme.textPrimary, fontFamily: 'ui-monospace,monospace', marginBottom: 20 }}
            />
            <button onClick={next} style={nextButtonStyle} onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)} onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}>
              Start scan
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: SITE_ACCENT, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Step 2 of 4</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.01em' }}>Scanning {url || 'your site'}…</h1>
            <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 24 }}>
              {SCAN_STEPS.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: SITE_ACCENT, color: '#121314', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: 14 }}>{s}</span>
                </div>
              ))}
            </div>
            <button onClick={next} style={{ ...nextButtonStyle, marginTop: 24 }} onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)} onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}>
              See results
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: SITE_ACCENT, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Step 3 of 4</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.01em' }}>Here&apos;s what we found</h1>
            <div style={{ border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 28, textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 44, fontWeight: 700, color: SITE_ACCENT }}>61</div>
              <div style={{ fontSize: 11, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 2 }}>AEO score · 14 fixes identified</div>
            </div>
            <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 24px', lineHeight: 1.6 }}>
              Create an account to save this report, track it over time, and unlock competitor comparison.
            </p>
            <button onClick={next} style={nextButtonStyle} onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)} onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}>
              Create free account
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: SITE_ACCENT, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Step 4 of 4</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.01em' }}>Choose a plan</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <label style={{ border: `2px solid ${SITE_ACCENT}`, borderRadius: 8, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: theme.card }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Agency · $79/mo</div>
                  <div style={{ fontSize: 12.5, color: theme.textSecondary }}>Up to 15 sites, competitor comparison, white-label PDF</div>
                </div>
                <input type="radio" name="plan" defaultChecked />
              </label>
              <label style={{ border: `1px solid ${theme.border}`, borderRadius: 8, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: theme.card }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Starter · $29/mo</div>
                  <div style={{ fontSize: 12.5, color: theme.textSecondary }}>1 site, monthly re-scan, alerts</div>
                </div>
                <input type="radio" name="plan" />
              </label>
            </div>
            <Link
              href="/signup"
              style={{ display: 'block', textAlign: 'center', background: SITE_CTA_BG, color: '#F9F9F8', padding: '14px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
              onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
            >
              Create your account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <SiteThemeProvider>
      <OnboardingBody />
    </SiteThemeProvider>
  );
}
