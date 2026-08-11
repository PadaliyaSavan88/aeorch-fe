export type SiteThemeName = 'dark' | 'light';

export interface SiteThemeTokens {
  bg: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
}

/** Design tokens from the Claude Design "Website redesign project" — not the site's old light/blue theme. */
export const SITE_THEMES: Record<SiteThemeName, SiteThemeTokens> = {
  dark: { bg: '#121314', card: '#1D1F21', border: '#34373B', textPrimary: '#F9F9F8', textSecondary: '#8E918F' },
  light: { bg: '#F7F6F2', card: '#FFFFFF', border: '#E2DFD8', textPrimary: '#1C1D1B', textSecondary: '#6B6E69' },
};

/** Accent and category colors are constant across both themes. */
export const SITE_ACCENT = '#3CD070';
export const SITE_ACCENT_HOVER = '#5ddb8c';

/** Deep-green CTA button color (sidebar/primary-button color) — constant across both themes. */
export const SITE_CTA_BG = '#2A4736';
export const SITE_CTA_BG_HOVER = '#35573F';

export const SITE_CATEGORY_COLORS: Record<string, string> = {
  SEO: '#3CD070',
  AEO: '#D9A441',
  GEO: '#7FB2FF',
  Authority: '#B57FE0',
  'AI Compatibility': '#E0533C',
};

export const SITE_CATEGORIES = ['All', 'SEO', 'AEO', 'GEO', 'Authority', 'AI Compatibility'] as const;

export function categoryColor(category: string, fallback: string): string {
  return SITE_CATEGORY_COLORS[category] ?? fallback;
}
