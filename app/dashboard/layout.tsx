import type { Metadata } from 'next';
import { APP_PAGE_ROBOTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: APP_PAGE_ROBOTS,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
