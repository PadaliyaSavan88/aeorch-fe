'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { isLoggedIn, clearTokens } from '@/lib/auth';
import { authApi } from '@/lib/api';
import AppHeader from './AppHeader';
import Header from './Header';

export default function AuthHeader() {
  const router = useRouter();
  const loggedIn = isLoggedIn();

  if (!loggedIn) return <Header />;

  async function handleLogout() {
    try {
      const refresh = localStorage.getItem('refreshToken') || undefined;
      await authApi.logout(refresh);
    } catch {}
    clearTokens();
    router.push('/');
  }

  return (
    <AppHeader>
      <nav className="hidden md:flex items-center gap-1">
        {([['/features', 'Features'], ['/blog', 'Learn']] as [string, string][]).map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-navy-900 hover:bg-slate-50 transition-colors font-medium"
          >
            {label}
          </Link>
        ))}
      </nav>
      <Link href="/dashboard" className="btn-primary !py-2 !text-sm flex-shrink-0">
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors flex-shrink-0"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </AppHeader>
  );
}
