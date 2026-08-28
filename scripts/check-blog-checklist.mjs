#!/usr/bin/env node
/**
 * Checks every content/blog/*.md post against the blog deployment checklist:
 * frontmatter limits, one-H1 rule, direct-answer lead paragraph, typed code fences.
 *
 * Usage: node scripts/check-blog-checklist.mjs
 * Exits non-zero if any post fails.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const KEYWORDS_MIN = 5;
const KEYWORDS_MAX = 8;
const FAQ_MIN = 3;

/** Strips fenced code blocks so their contents (e.g. a `#`-comment in a config example) don't get mistaken for markdown headings. */
function stripCodeFences(content) {
  return content.replace(/^```[\s\S]*?^```$/gm, '');
}

function checkPost(file, data, content) {
  const issues = [];
  const prose = stripCodeFences(content);

  if (!data.title || data.title.length > TITLE_MAX) {
    issues.push(`title ${data.title ? data.title.length : 0}/${TITLE_MAX} chars`);
  }
  if (!data.description || data.description.length > DESCRIPTION_MAX) {
    issues.push(`description ${data.description ? data.description.length : 0}/${DESCRIPTION_MAX} chars`);
  }
  const keywordCount = Array.isArray(data.keywords) ? data.keywords.length : 0;
  if (keywordCount < KEYWORDS_MIN || keywordCount > KEYWORDS_MAX) {
    issues.push(`keywords=${keywordCount} (need ${KEYWORDS_MIN}-${KEYWORDS_MAX})`);
  }
  const faqCount = Array.isArray(data.faq) ? data.faq.length : 0;
  if (faqCount < FAQ_MIN) {
    issues.push(`faq=${faqCount} (need >=${FAQ_MIN})`);
  }

  const h1Count = (prose.match(/^# [^#]/gm) || []).length;
  if (h1Count > 0) {
    issues.push(`h1-in-body=${h1Count} (page template already renders the title as the only H1)`);
  }

  const firstBlock = prose.trim().split(/\n\n+/)[0] || '';
  if (firstBlock.startsWith('#')) {
    issues.push('first-paragraph-is-a-heading (no direct-answer lead paragraph)');
  }

  // Fences alternate open/close; only opening fences (even index) should carry a language tag.
  const fenceLangs = [...content.matchAll(/^```(\w*)/gm)].map(m => m[1]);
  const openingFences = fenceLangs.filter((_, i) => i % 2 === 0);
  const untyped = openingFences.filter(lang => lang === '').length;
  if (untyped > 0) {
    issues.push(`untyped-code-blocks=${untyped}`);
  }

  return issues;
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`No blog directory at ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let failCount = 0;

  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const issues = checkPost(file, data, content);
    if (issues.length > 0) {
      failCount++;
      console.log(`FAIL ${file}`);
      for (const issue of issues) console.log(`  - ${issue}`);
    } else {
      console.log(`OK   ${file}`);
    }
  }

  console.log(`\n${files.length - failCount}/${files.length} posts pass the checklist.`);
  process.exit(failCount > 0 ? 1 : 0);
}

main();
