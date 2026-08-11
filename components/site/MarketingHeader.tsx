'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSiteTheme } from './SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

export type MarketingNavKey = 'free-tool' | 'product' | 'pricing' | 'blog';

const navLinks: { key: MarketingNavKey; href: string; label: string }[] = [
  { key: 'free-tool', href: '/free-tool', label: 'Free Tool' },
  { key: 'product', href: '/features', label: 'Product' },
  { key: 'pricing', href: '/pricing', label: 'Pricing' },
  { key: 'blog', href: '/blog', label: 'Blog' },
];

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
      <rect width="28" height="28" rx="7" fill={SITE_ACCENT} />
      <rect x="6" y="17" width="3.5" height="7" rx="1" fill="#121314" />
      <rect x="12" y="13" width="3.5" height="11" rx="1" fill="#121314" />
      <rect x="18" y="9" width="3.5" height="15" rx="1" fill="#121314" />
    </svg>
  );
}

export default function MarketingHeader({
  active,
  showCta = false,
}: {
  active?: MarketingNavKey;
  showCta?: boolean;
}) {
  const { theme, themeName, toggleTheme } = useSiteTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginHover, setLoginHover] = useState(false);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky',
        top: 0,
        background: theme.bg,
        zIndex: 10,
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo />
        <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', color: theme.textPrimary }}>
          Aeorch
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 28, fontSize: 14, fontWeight: 500 }}>
        {navLinks.map(link =>
          link.key === active ? (
            <span key={link.key} style={{ color: SITE_ACCENT, fontWeight: 700 }}>
              {link.label}
            </span>
          ) : (
            <Link
              key={link.key}
              href={link.href}
              className="transition-colors hover:!text-[#3CD070]"
              style={{ color: theme.textPrimary }}
            >
              {link.label}
            </Link>
          ),
        )}
        <Link
          href="/login"
          className="transition-colors"
          style={{ color: loginHover ? theme.textPrimary : theme.textSecondary }}
          onMouseEnter={() => setLoginHover(true)}
          onMouseLeave={() => setLoginHover(false)}
        >
          Log in
        </Link>
        <button
          onClick={toggleTheme}
          className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070] focus:outline focus:outline-2 focus:outline-[#3CD070] focus:outline-offset-2"
          style={{
            background: 'none',
            border: `1px solid ${theme.border}`,
            color: theme.textSecondary,
            padding: '7px 12px',
            borderRadius: 20,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {themeName === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        {showCta && (
          <Link
            href="/scan"
            className="transition-all"
            style={{
              background: SITE_CTA_BG,
              color: '#F9F9F8',
              padding: '9px 18px',
              borderRadius: 8,
              fontWeight: 600,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            Start free scan
          </Link>
        )}
      </nav>

      {/* Mobile toggle */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Toggle menu"
        style={{ background: 'none', border: 'none', color: theme.textPrimary, padding: 8, cursor: 'pointer' }}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: theme.bg,
            borderBottom: `1px solid ${theme.border}`,
            padding: '12px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {navLinks.map(link =>
            link.key === active ? (
              <span key={link.key} style={{ color: SITE_ACCENT, fontWeight: 700, padding: '10px 0', fontSize: 14 }}>
                {link.label}
              </span>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ color: theme.textPrimary, padding: '10px 0', fontSize: 14, fontWeight: 500 }}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{ color: theme.textSecondary, padding: '10px 0', fontSize: 14, fontWeight: 500 }}
          >
            Log in
          </Link>
          {showCta && (
            <Link
              href="/scan"
              onClick={() => setMobileOpen(false)}
              style={{
                background: SITE_CTA_BG,
                color: '#F9F9F8',
                padding: '10px 12px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Start free scan
            </Link>
          )}
          <button
            onClick={() => { toggleTheme(); setMobileOpen(false); }}
            style={{
              marginTop: 8,
              background: 'none',
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              padding: '10px 12px',
              borderRadius: 20,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            {themeName === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      )}
    </header>
  );
}
