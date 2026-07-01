#!/usr/bin/env node
/**
 * Generates public/llms.txt following the llmstxt.org convention: a plain-text
 * index of the site's pages with one-sentence summaries, so AI assistants can
 * quickly understand what the site offers without crawling everything.
 *
 * Runs automatically before `next build` (see package.json "prebuild").
 * Usage: node scripts/generate-llms-txt.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = path.join(process.cwd());
const BLOG_DIR = path.join(ROOT, 'content', 'blog');
const OUT_FILE = path.join(ROOT, 'public', 'llms.txt');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

const STATIC_PAGES = [
  { url: `${SITE_URL}/`, summary: 'Aeorch — free SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), Authority and AI Compatibility audit tool.' },
  { url: `${SITE_URL}/scan`, summary: 'Run a free audit of any website across SEO, AEO, GEO, Authority and AI Compatibility, with a scored report and fix recommendations.' },
  { url: `${SITE_URL}/features`, summary: 'Overview of what Aeorch checks: structured data, AI crawler access, sitemap health, authority signals, and more.' },
  { url: `${SITE_URL}/about`, summary: 'About Aeorch and why AI-era search visibility requires more than traditional SEO.' },
  { url: `${SITE_URL}/contact`, summary: 'Contact Aeorch for support, partnerships, or higher scan volume.' },
];

function loadPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title,
        description: data.description,
        category: data.category || 'SEO',
        publishedAt: data.publishedAt,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function main() {
  const posts = loadPosts();

  const byCategory = posts.reduce((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  const lines = [];
  lines.push('# Aeorch');
  lines.push('');
  lines.push('> Free SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), Authority and AI Compatibility audit tool. Scan any website and get a scored report with actionable fixes for ranking in Google, ChatGPT, Perplexity, Claude and Gemini.');
  lines.push('');
  lines.push('## Product');
  lines.push('');
  for (const p of STATIC_PAGES) {
    lines.push(`- [${p.url}](${p.url}): ${p.summary}`);
  }
  lines.push('');
  lines.push('## Blog');
  lines.push('');
  for (const category of Object.keys(byCategory).sort()) {
    lines.push(`### ${category}`);
    lines.push('');
    for (const p of byCategory[category]) {
      lines.push(`- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`);
    }
    lines.push('');
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
  console.log(`llms.txt written: ${OUT_FILE} (${posts.length} blog posts, ${STATIC_PAGES.length} static pages)`);
}

main();
