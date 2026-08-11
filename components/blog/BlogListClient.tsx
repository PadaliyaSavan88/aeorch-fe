'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_CATEGORIES, SITE_ACCENT, categoryColor } from '@/lib/siteTheme';

export interface BlogListPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

function fmtDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function PostCard({ post }: { post: BlogListPost }) {
  const { theme } = useSiteTheme();
  const [hover, setHover] = useState(false);
  const catColor = categoryColor(post.category, theme.textSecondary);

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: 26,
        background: theme.card,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        color: theme.textPrimary,
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: hover ? 'translateY(-3px)' : undefined,
        boxShadow: hover ? '0 10px 24px -12px #00000055' : undefined,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        <span style={{ fontSize: 12, color: theme.textSecondary }}>
          {fmtDate(post.publishedAt)} · {post.readingTime} min read
        </span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{post.title}</div>
      <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6, flex: 1 }}>{post.description}</div>
    </Link>
  );
}

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const { theme } = useSiteTheme();
  return (
    <button
      onClick={onClick}
      className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070] focus:outline focus:outline-2 focus:outline-[#3CD070] focus:outline-offset-2"
      style={{
        border: active ? `1px solid ${SITE_ACCENT}` : `1px solid ${theme.border}`,
        background: 'none',
        color: active ? SITE_ACCENT : theme.textSecondary,
        padding: '9px 14px',
        borderRadius: 20,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

export default function BlogListClient({ posts }: { posts: BlogListPost[] }) {
  const { theme } = useSiteTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      p =>
        (category === 'All' || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [posts, query, category]);

  const resultCount = posts.length ? `${filtered.length} of ${posts.length} articles` : '';

  return (
    <>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px' }}>The Aeorch Blog</h1>
        <p style={{ fontSize: 16, color: theme.textSecondary, margin: 0 }}>
          Practical guides on SEO, AEO, GEO, Authority, and getting cited by AI.
        </p>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 20px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles"
          className="focus:!outline focus:!outline-2 focus:!outline-[#3CD070] focus:!outline-offset-2 focus:!border-[#3CD070]"
          style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 320,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13.5,
            fontFamily: 'inherit',
            transition: 'border-color 150ms ease',
          }}
        />
        {SITE_CATEGORIES.map(c => (
          <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12.5, color: theme.textSecondary }}>{resultCount}</div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '12px 24px 100px' }}>
        {posts.length > 0 && filtered.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: theme.textSecondary, fontSize: 14 }}>
            No articles match that search.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
          {filtered.map(p => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
