import type { Metadata } from 'next';
import ReportView from './ReportView';
import { APP_PAGE_ROBOTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Scan Report — Aeorch',
  robots: APP_PAGE_ROBOTS,
};

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportView id={id} />;
}
