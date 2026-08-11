'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useSiteTheme } from './SiteThemeProvider';
import { SITE_ACCENT } from '@/lib/siteTheme';
import { authApi } from '@/lib/api';
import { clearTokens } from '@/lib/auth';

export type AppNavKey = 'dashboard' | 'agency' | 'competitors' | 'export' | 'settings' | 'billing';

const NAV: { key: AppNavKey; href: string; label: string; badge?: string }[] = [
  { key: 'dashboard', href: '/dashboard', label: 'Dashboard' },
  { key: 'agency', href: '/agency', label: 'Multi-site' },
  { key: 'competitors', href: '/agency/competitors', label: 'Competitors' },
  { key: 'export', href: '/agency/export', label: 'Export' },
  { key: 'settings', href: '/agency/settings', label: 'Settings' },
  { key: 'billing', href: '/agency/billing', label: 'Billing' },
];

function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
      <rect width="28" height="28" rx="7" fill={SITE_ACCENT} />
      <rect x="6" y="17" width="3.5" height="7" rx="1" fill="#121314" />
      <rect x="12" y="13" width="3.5" height="11" rx="1" fill="#121314" />
      <rect x="18" y="9" width="3.5" height="15" rx="1" fill="#121314" />
    </svg>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span
      style={{
        fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em',
        color: '#D99E32', background: '#D99E3226', padding: '2px 6px', borderRadius: 20, marginLeft: 8,
      }}
    >
      {text}
    </span>
  );
}

/**
 * Logged-in "portal" shell — sidebar bg (#2A4736) and text colors are fixed across both
 * themes by design (see design_handoff_admin_panel/README.md), unlike MarketingHeader.
 *
 * `active` is optional: drill-down flows (e.g. /scan, /report/[id]) intentionally render
 * with no nav item highlighted, since they're not themselves a top-level section.
 */
export default function AppSidebar({ active }: { active?: AppNavKey }) {
  const { themeName, toggleTheme } = useSiteTheme();
  const router = useRouter();

  async function handleSignOut() {
    try {
      const refresh = localStorage.getItem('refreshToken') || undefined;
      await authApi.logout(refresh);
    } catch {}
    clearTokens();
    router.push('/');
  }

  return (
    <aside
      style={{
        width: 220, flexShrink: 0, background: '#2A4736', color: '#F9F9F8',
        padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px' }}>
        <Logo />
        <span style={{ fontSize: 16, fontWeight: 700, color: '#F9F9F8' }}>Aeorch</span>
      </Link>

      {NAV.map(item =>
        item.key === active ? (
          <div
            key={item.key}
            style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 6, fontSize: 13.5, fontWeight: 600, color: '#F9F9F8', background: '#ffffff1a' }}
          >
            {item.label}
            {item.badge && <Badge text={item.badge} />}
          </div>
        ) : (
          <Link
            key={item.key}
            href={item.href}
            className="flex items-center transition-colors hover:![background:#ffffff14] hover:!text-[#F9F9F8]"
            style={{ padding: '10px 12px', borderRadius: 6, fontSize: 13.5, fontWeight: 500, color: '#C9D3CC' }}
          >
            {item.label}
            {item.badge && <Badge text={item.badge} />}
          </Link>
        ),
      )}

      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 transition-colors hover:!text-[#F9F9F8]"
        style={{
          marginTop: 'auto', background: 'none', border: 'none', color: '#C9D3CC',
          padding: '8px 12px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
        }}
      >
        <LogOut className="w-3.5 h-3.5" /> Sign out
      </button>

      <button
        onClick={toggleTheme}
        className="transition-colors hover:!border-[#3CD070] hover:!text-[#F9F9F8] focus:outline focus:outline-2 focus:outline-[#3CD070] focus:outline-offset-2"
        style={{
          background: 'none', border: '1px solid #ffffff33', color: '#C9D3CC',
          padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}
      >
        {themeName === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </aside>
  );
}
