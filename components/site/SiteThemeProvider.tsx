'use client';

import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { SITE_THEMES, type SiteThemeName, type SiteThemeTokens } from '@/lib/siteTheme';

const STORAGE_KEY = 'aeorch-theme';

interface SiteThemeContextValue {
  themeName: SiteThemeName;
  theme: SiteThemeTokens;
  toggleTheme: () => void;
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

export function useSiteTheme(): SiteThemeContextValue {
  const ctx = useContext(SiteThemeContext);
  if (!ctx) throw new Error('useSiteTheme must be used within SiteThemeProvider');
  return ctx;
}

export default function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<SiteThemeName>('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') setThemeName(saved);
  }, []);

  function toggleTheme() {
    setThemeName(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  const theme = SITE_THEMES[themeName];

  // CSS custom properties so server-rendered content (e.g. MDX post body) can stay theme-reactive
  // without needing to know the theme at render time.
  const rootStyle = {
    '--site-bg': theme.bg,
    '--site-card': theme.card,
    '--site-border': theme.border,
    '--site-text': theme.textPrimary,
    '--site-text-secondary': theme.textSecondary,
    '--site-code-bg': `${theme.textSecondary}14`,
    background: theme.bg,
    color: theme.textPrimary,
    minHeight: '100vh',
    fontFamily: 'var(--font-inter), Roboto, system-ui, sans-serif',
  } as CSSProperties;

  return (
    <SiteThemeContext.Provider value={{ themeName, theme, toggleTheme }}>
      <div style={rootStyle}>{children}</div>
    </SiteThemeContext.Provider>
  );
}
