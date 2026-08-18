'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';
import { toolsApi } from '@/lib/api';

interface BotAccessResult {
  bot: string;
  engine: string;
  status: 'allowed' | 'blocked' | 'unspecified';
}

const STEPS = [
  { title: 'Paste your site URL', description: 'No login or credits required — just the domain you want to check.' },
  { title: 'Aeorch checks AI-crawler access', description: 'We check whether major AI bots (GPTBot, ClaudeBot, Google-Extended, PerplexityBot) can access your site, and whether llm.txt and ai-plugin.json already exist.' },
  { title: 'Download or copy the generated files', description: 'If either file is missing, Aeorch generates it from your site so you can drop it straight in.' },
];

const FAQS = [
  { q: 'Is the llm.txt generator really free?', a: 'Yes — no login, no scan credits, no card required. Every check is free.' },
  { q: 'What does the free tool check?', a: 'It checks whether major AI bots can access your site, and whether you already have an llm.txt and ai-plugin.json file.' },
  { q: 'What if my site already has these files?', a: "You'll see a confirmation that llm.txt and ai-plugin.json are already present — nothing to generate." },
];

interface CheckResult {
  url: string;
  botAccess: BotAccessResult[];
  hasLlmTxt: boolean;
  hasLlmsFullTxt: boolean;
  hasAiPluginJson: boolean;
  generatedLlmTxt: string;
  generatedAiPluginJson: object | null;
}

export default function FreeToolBody() {
  const { theme } = useSiteTheme();
  const [url, setUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);

  async function runCheck() {
    if (!url.trim()) return;
    setChecking(true);
    setError(null);
    try {
      const { data: body } = await toolsApi.llmTxtCheck(url.trim());
      setResult(body.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Could not check that site. Double-check the URL and try again.');
      setResult(null);
    } finally {
      setChecking(false);
    }
  }

  const blockedBots = result?.botAccess.filter(b => b.status === 'blocked') ?? [];
  const summaryText = result
    ? blockedBots.length > 0
      ? `${blockedBots.length} of ${result.botAccess.length} AI bots blocked: ${blockedBots.map(b => b.engine).join(', ')}`
      : `All ${result.botAccess.length} checked AI bots allowed`
    : '';
  const summaryColor = blockedBots.length > 0 ? '#E0533C' : '#3CD070';

  const aiPluginJsonText = result?.generatedAiPluginJson ? JSON.stringify(result.generatedAiPluginJson, null, 2) : '';
  const filesToGenerate = result
    ? [
        ...(!result.hasLlmTxt ? [{ name: 'llm.txt', content: result.generatedLlmTxt }] : []),
        ...(!result.hasAiPluginJson ? [{ name: 'ai-plugin.json', content: aiPluginJsonText }] : []),
      ]
    : [];

  function download() {
    for (const { name, content } of filesToGenerate) {
      const blob = new Blob([content], { type: 'text/plain' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl; a.download = name; a.click();
      URL.revokeObjectURL(blobUrl);
    }
  }

  function copy() {
    navigator.clipboard.writeText(filesToGenerate.map(f => f.content).join('\n\n'));
  }

  return (
    <>
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#D99E32', background: '#D99E3226', padding: '6px 14px', borderRadius: 20, marginBottom: 20 }}>
          Free · no login
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px' }}>llm.txt generator</h1>
        <p style={{ fontSize: 16, color: theme.textSecondary, margin: '0 0 32px', lineHeight: 1.6 }}>
          Check whether AI crawlers can access your site, then generate an llm.txt and ai-plugin.json to fix it. Free every time, no scan credits, no signup.
        </p>
      </section>

      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') runCheck(); }}
            placeholder="https://youragency.com"
            className="focus:!border-[#3CD070] focus:!outline-none"
            style={{ flex: 1, minWidth: 220, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '14px 16px', fontSize: 15, color: theme.textPrimary, fontFamily: 'ui-monospace,monospace', transition: 'border-color 150ms ease' }}
          />
          <button
            onClick={runCheck}
            disabled={checking || !url.trim()}
            style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '14px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: checking ? 'default' : 'pointer', opacity: checking || !url.trim() ? 0.7 : 1 }}
            onMouseEnter={e => !checking && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
          >
            {checking ? 'Checking…' : 'Check my site'}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 8, background: '#E0533C1a', border: '1px solid #E0533C55', fontSize: 13.5, color: '#E0533C' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: 32, border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${theme.border}`, background: theme.bg, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: summaryColor, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: summaryColor }}>{summaryText}</span>
              </div>
              <button
                onClick={runCheck}
                disabled={checking}
                className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070]"
                style={{ background: 'none', border: `1px solid ${theme.border}`, padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: theme.textSecondary, cursor: checking ? 'default' : 'pointer' }}
              >
                Regenerate check
              </button>
            </div>

            {filesToGenerate.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', fontSize: 13.5, color: '#3CD070', fontWeight: 500 }}>
                ✓ llm.txt and ai-plugin.json are already present — nothing to generate.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div style={{ padding: 20, borderRight: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
                      llm.txt {result.hasLlmTxt && '✓ found'}
                    </div>
                    {result.hasLlmTxt ? (
                      <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Already present at /llm.txt.</p>
                    ) : (
                      <pre style={{ margin: 0, fontFamily: 'ui-monospace,monospace', fontSize: 12.5, lineHeight: 1.7, color: theme.textPrimary, whiteSpace: 'pre-wrap' }}>{result.generatedLlmTxt}</pre>
                    )}
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
                      ai-plugin.json {result.hasAiPluginJson && '✓ found'}
                    </div>
                    {result.hasAiPluginJson ? (
                      <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Already present at /.well-known/ai-plugin.json.</p>
                    ) : (
                      <pre style={{ margin: 0, fontFamily: 'ui-monospace,monospace', fontSize: 12.5, lineHeight: 1.7, color: theme.textPrimary, whiteSpace: 'pre-wrap' }}>{aiPluginJsonText}</pre>
                    )}
                  </div>
                </div>
                <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={download} className="transition-opacity hover:!opacity-85" style={{ background: theme.textPrimary, color: theme.bg, border: 'none', padding: '10px 18px', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    Download files
                  </button>
                  <button onClick={copy} className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070]" style={{ background: 'none', border: `1px solid ${theme.border}`, padding: '10px 18px', borderRadius: 7, fontWeight: 600, fontSize: 13, color: theme.textPrimary, cursor: 'pointer' }}>
                    Copy to clipboard
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <section style={{ maxWidth: 680, margin: '100px auto 0', padding: '32px 24px', background: SITE_CTA_BG, borderRadius: '6px 6px 0 0', textAlign: 'center' }}>
        <div style={{ color: '#F9F9F8', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Want the full audit?</div>
        <p style={{ color: '#D7DED9', fontSize: 14, margin: '0 0 20px' }}>
          Full scans rank every fix by impact, compare you to competitors, and export white-label for clients.
        </p>
        <Link
          href="/scan"
          className="transition-transform hover:!-translate-y-0.5"
          style={{ display: 'inline-block', background: '#F9F9F8', color: SITE_CTA_BG, padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}
        >
          Run a full scan
        </Link>
      </section>

      <section style={{ maxWidth: 680, margin: '0 auto', padding: '100px 24px 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', margin: '0 0 40px' }}>How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ textAlign: 'center' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#3CD07026', color: '#3CD070', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                {i + 1}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 120px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>Questions</h2>
        {FAQS.map(item => (
          <div key={item.q} style={{ borderBottom: `1px solid ${theme.border}`, padding: '18px 0' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>{item.q}</h3>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6 }}>{item.a}</div>
          </div>
        ))}
      </section>
    </>
  );
}
