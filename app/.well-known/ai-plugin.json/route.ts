import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export function GET() {
  const plugin = {
    schema_version: 'v1',
    name_for_human: 'Aeorch SEO Audit Tool',
    name_for_model: 'aeorch',
    description_for_human: 'Free SEO, AEO, GEO and AI Compatibility audit tool for websites.',
    description_for_model:
      'Aeorch audits websites and returns scores for SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AI Compatibility, and Authority. Use this to check if a website is optimised for AI-powered search engines.',
    auth: { type: 'none' },
    api: { type: 'openapi', url: `${siteUrl}/openapi.json` },
    logo_url: `${siteUrl}/logo.png`,
    contact_email: '',
    legal_info_url: `${siteUrl}/privacy`,
  };

  return NextResponse.json(plugin);
}
