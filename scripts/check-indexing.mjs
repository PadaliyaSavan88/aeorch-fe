#!/usr/bin/env node
// Guards the Public Page / App Page split (see CONTEXT.md) against a running site.
// Every sitemap URL must be crawlable, self-canonical and indexable.
// Every App Page must carry noindex and no canonical.
//
// Usage: BASE_URL=http://localhost:3000 node scripts/check-indexing.mjs
// Needs only the frontend running (next start or next dev), not the backend.

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const APP_PAGES = [
  '/login',
  '/callback',
  '/dashboard',
  '/agency',
  '/agency/billing',
  '/agency/citations',
  '/agency/competitors',
  '/agency/export',
  '/agency/settings',
  '/onboarding',
  '/admin',
  '/report/check-indexing',
];

const failures = [];
const fail = (path, msg) => failures.push(`${path}: ${msg}`);

async function get(path) {
  const res = await fetch(BASE_URL + path, { redirect: 'manual' });
  return { status: res.status, body: await res.text() };
}

function canonicalOf(html) {
  const m = html.match(/<link[^>]+rel="canonical"[^>]*>/);
  return m ? (m[0].match(/href="([^"]*)"/) || [])[1] ?? '' : null;
}

function robotsMetaOf(html) {
  const m = html.match(/<meta[^>]+name="robots"[^>]*>/);
  return m ? (m[0].match(/content="([^"]*)"/) || [])[1] ?? '' : '';
}

function starDisallows(robotsTxt) {
  const disallows = [];
  let inStar = false;
  for (const raw of robotsTxt.split('\n')) {
    const line = raw.trim();
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (/^user-agent$/i.test(key)) inStar = value === '*';
    else if (inStar && /^disallow$/i.test(key) && value) disallows.push(value);
  }
  return disallows;
}

const robots = await get('/robots.txt');
const disallows = starDisallows(robots.body);

const sitemap = await get('/sitemap.xml');
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
if (locs.length === 0) fail('/sitemap.xml', 'no <loc> entries found');

for (const loc of locs) {
  const path = new URL(loc).pathname;
  if (disallows.some(d => path.startsWith(d))) fail(path, 'in sitemap but disallowed by robots.txt');
  const { status, body } = await get(path);
  if (status !== 200) { fail(path, `in sitemap but returned ${status}`); continue; }
  const canonical = canonicalOf(body);
  if (canonical !== loc) fail(path, `canonical is ${canonical ?? 'missing'}, expected ${loc}`);
  if (/noindex/i.test(robotsMetaOf(body))) fail(path, 'in sitemap but has noindex');
}

for (const path of APP_PAGES) {
  const { status, body } = await get(path);
  if (status !== 200) { fail(path, `returned ${status}`); continue; }
  if (!/noindex/i.test(robotsMetaOf(body))) fail(path, 'App Page is missing noindex');
  const canonical = canonicalOf(body);
  if (canonical !== null) fail(path, `App Page should have no canonical, has ${canonical}`);
}

console.log(`Checked ${locs.length} sitemap URLs and ${APP_PAGES.length} App Pages against ${BASE_URL}`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n` + failures.map(f => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('All indexing checks passed.');
