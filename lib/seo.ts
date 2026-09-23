import type { Metadata } from 'next';

// App Pages (see CONTEXT.md) must never appear in search. They set no canonical;
// the root layout deliberately has none either, so nothing inherits the homepage URL.
export const APP_PAGE_ROBOTS: Metadata['robots'] = { index: false, follow: true };
