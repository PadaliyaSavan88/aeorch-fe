'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { categoryColor, SITE_ACCENT, SITE_ACCENT_HOVER } from '@/lib/siteTheme';
import type { BlogFaqItem } from '@/lib/blog';

export interface BlogReaderPost {
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  faq: BlogFaqItem[];
}

function fmtDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogReaderClient({ post, children }: { post: BlogReaderPost; children: ReactNode }) {
  const { theme } = useSiteTheme();
  const [backHover, setBackHover] = useState(false);
  const catColor = categoryColor(post.category, theme.textSecondary);

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 100px' }}>
      <Link
        href="/blog"
        className="transition-colors"
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: backHover ? SITE_ACCENT_HOVER : SITE_ACCENT,
          marginBottom: 28,
          display: 'inline-block',
        }}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
      >
        ← All articles
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.04em',
            textTransform: 'uppercase',
            color: catColor,
            background: `${catColor}22`,
            padding: '4px 10px',
            borderRadius: 20,
          }}
        >
          {post.category}
        </span>
        <span style={{ fontSize: 12.5, color: theme.textSecondary }}>
          {fmtDate(post.publishedAt)} · {post.readingTime} min read · {post.author}
        </span>
      </div>

      <h1
        className="[text-wrap:pretty]"
        style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 16px' }}
      >
        {post.title}
      </h1>
      <p
        className="[text-wrap:pretty]"
        style={{ fontSize: 17, color: theme.textSecondary, lineHeight: 1.6, margin: '0 0 36px' }}
      >
        {post.description}
      </p>

      <div className="prose-blog">{children}</div>

      {post.faq.length > 0 && (
        <div style={{ marginTop: 48, paddingTop: 36, borderTop: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Frequently asked questions</div>
          {post.faq.map(f => (
            <div key={f.question} style={{ padding: '18px 0', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.question}</div>
              <div style={{ fontSize: 14.5, color: theme.textSecondary, lineHeight: 1.65 }}>{f.answer}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
