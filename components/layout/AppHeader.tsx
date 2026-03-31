import Link from 'next/link';
import { Zap } from 'lucide-react';

interface AppHeaderProps {
  /** Content rendered on the right side of the header */
  children?: React.ReactNode;
}

/**
 * Shared top bar for authenticated app pages (dashboard, scan, report).
 * Uses the same structural tokens as the marketing Header:
 *   bg-white border-b border-slate-100 sticky top-0 z-40
 *   max-w-6xl mx-auto px-4 sm:px-6 h-16
 */
export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
            <Zap className="w-4 h-4 text-white" />
          </span>
          <span className="font-bold text-lg text-navy-900">
            AEO<span className="text-brand-600">rch</span>
          </span>
        </Link>
        {children && (
          <div className="flex items-center gap-4 min-w-0">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
