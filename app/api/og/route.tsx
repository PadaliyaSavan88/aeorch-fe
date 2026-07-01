import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const CATEGORY_COLORS: Record<string, string> = {
  SEO: '#2563eb',
  AEO: '#0891b2',
  GEO: '#7c3aed',
  Authority: '#d97706',
  'AI Compatibility': '#059669',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Aeorch — AI-Ready SEO Audits').slice(0, 140);
  const category = searchParams.get('category') || 'SEO';
  const accent = CATEGORY_COLORS[category] || CATEGORY_COLORS.SEO;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #164e63 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: 'white',
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, color: 'white' }}>
            AEO<span style={{ color: '#22d3ee' }}>rch</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 48 : 60,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              padding: '8px 20px',
              borderRadius: 999,
              background: accent,
              color: 'white',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#94a3b8' }}>
            Free SEO · AEO · GEO Audit
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
