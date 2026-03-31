'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Zap, LogOut } from 'lucide-react';
import { isLoggedIn, clearTokens } from '@/lib/auth';
import { authApi } from '@/lib/api';

const marketingNav = [
  { href: '/features', label: 'Features' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const appNav = [
  { href: '/features', label: 'Features' },
  { href: '/blog', label: 'Learn' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === '/';
  const loggedIn = isLoggedIn();
  const logoHref = loggedIn ? '/dashboard' : '/';

  // When logged in, always use white app-style header so it matches the dashboard
  const darkMode = isLanding && !loggedIn;
  const nav = loggedIn ? appNav : marketingNav;

  async function handleLogout() {
    try {
      const refresh = localStorage.getItem('refreshToken') || undefined;
      await authApi.logout(refresh);
    } catch {}
    clearTokens();
    router.push('/');
  }

  return (
    <header className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-navy-900 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
            <Zap className="w-4 h-4 text-white" />
          </span>
          <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-navy-900'}`}>
            AEO<span className={darkMode ? 'text-brand-400' : 'text-brand-600'}>rch</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary !py-2 !text-sm">
                Get started free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-white' : 'text-navy-900'}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'bg-navy-900 border-white/10' : 'bg-white border-slate-100'}`}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {nav.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  darkMode ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {loggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium text-center border ${
                      darkMode ? 'text-white border-white/20' : 'border-slate-200'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 border border-slate-200"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className={`px-4 py-3 rounded-lg text-sm font-medium text-center ${darkMode ? 'text-white border border-white/20' : 'border border-slate-200'}`}>
                    Log in
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
