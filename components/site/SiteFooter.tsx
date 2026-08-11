'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSiteTheme } from './SiteThemeProvider';

function FooterLink({ href, label }: { href: string; label: string }) {
  const { theme } = useSiteTheme();
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      className="transition-colors"
      style={{ color: hover ? theme.textPrimary : theme.textSecondary }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
}

export default function SiteFooter({
  links = [{ href: '/', label: 'Home' }],
  variant = 'split',
}: {
  links?: { href: string; label: string }[];
  variant?: 'split' | 'center';
}) {
  const { theme } = useSiteTheme();

  if (variant === 'center') {
    return (
      <footer
        style={{
          borderTop: `1px solid ${theme.border}`,
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: 13,
          color: theme.textSecondary,
        }}
      >
        © {new Date().getFullYear()} Aeorch
        {links.map(link => (
          <span key={link.href}>
            {' · '}
            <FooterLink href={link.href} label={link.label} />
          </span>
        ))}
      </footer>
    );
  }

  return (
    <footer
      style={{
        borderTop: `1px solid ${theme.border}`,
        padding: '32px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 13,
        color: theme.textSecondary,
      }}
    >
      <span>© {new Date().getFullYear()} Aeorch</span>
      <div style={{ display: 'flex', gap: 24 }}>
        {links.map(link => (
          <FooterLink key={link.href} href={link.href} label={link.label} />
        ))}
      </div>
    </footer>
  );
}
