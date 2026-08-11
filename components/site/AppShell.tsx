'use client';

import type { ReactNode } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import AppSidebar, { type AppNavKey } from './AppSidebar';

export default function AppShell({
  active, maxWidth = 1080, children,
}: {
  active?: AppNavKey;
  maxWidth?: number;
  children: ReactNode;
}) {
  const { theme } = useSiteTheme();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar active={active} />
      <main style={{ flex: 1, minWidth: 0, padding: '36px 48px', background: theme.bg, boxSizing: 'border-box' }}>
        <div style={{ maxWidth, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  );
}
