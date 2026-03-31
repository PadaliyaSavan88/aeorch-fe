import Link from 'next/link';
import { Zap } from 'lucide-react';

const footerLinks = {
  Product: [
    { href: '/scan', label: 'Run a Scan' },
    { href: '/features', label: 'Features' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/contact', label: 'Premium' },
  ],
  Resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/blog/what-is-aeo', label: 'What is AEO?' },
    { href: '/blog/seo-aeo-geo-guide', label: 'SEO vs AEO vs GEO' },
    { href: '/blog/ai-ready-website', label: 'AI-Ready Website Guide' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
                <Zap className="w-4 h-4 text-white" />
              </span>
              <span className="font-bold text-xl text-white">
                AEO<span className="text-brand-400">rch</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The free SEO audit tool built for the AI era. Score your website across SEO, AEO, GEO, AI Compatibility and Authority.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Aeorch. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Free SEO audit tool · AEO optimization · GEO score checker · AI Compatibility
          </p>
        </div>
      </div>
    </footer>
  );
}
