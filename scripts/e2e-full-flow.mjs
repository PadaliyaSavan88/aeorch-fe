#!/usr/bin/env node
/**
 * End-to-end Puppeteer flow exercising the real UI + backend + worker:
 * signup -> scan savanpadaliya.com -> scan susea.ai -> contact form -> admin panel.
 *
 * Usage: node scripts/e2e-full-flow.mjs
 * Requires: backend on http://localhost:8000, frontend on FRONTEND_URL, real Mongo+Redis.
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3002';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'savanstudy8@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AeorchAdmin!2026';

const stamp = Date.now();
const TEST_PASSWORD = 'Test1234!';
const TEST_NAME = 'E2E Test User';

const SITES = ['https://savanpadaliya.com', 'https://susea.ai'];
// Each site gets its own freshly signed-up user (20 free credits each) since a single
// user's credits can be exhausted by one large site, which would starve the next scan.
const testEmails = [];

const OUT_DIR = path.join(__dirname, '..', 'e2e-results');
const SHOTS_DIR = path.join(OUT_DIR, 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

const results = [];

function record(name, ok, extra = {}) {
  results.push({ name, ok, ...extra, at: new Date().toISOString() });
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${extra.error ? `: ${extra.error}` : ''}`);
}

async function shot(page, name) {
  const file = path.join(SHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return path.relative(OUT_DIR, file);
}

async function step(name, fn) {
  try {
    const extra = (await fn()) || {};
    record(name, true, extra);
    return extra;
  } catch (err) {
    record(name, false, { error: err.message });
    return null;
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1400, height: 1000 },
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  await step('Load homepage', async () => {
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
    return { screenshot: await shot(page, '01-homepage') };
  });

  async function signup(email) {
    await page.goto(`${FRONTEND_URL}/signup`, { waitUntil: 'networkidle2' });
    await page.type('input[type="text"]', TEST_NAME);
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', TEST_PASSWORD);
    await Promise.all([
      page.waitForFunction(() => location.pathname === '/dashboard', { timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);
  }

  const firstEmail = `e2e.${stamp}.0@example.com`;
  testEmails.push(firstEmail);
  await step('Sign up new test user', async () => {
    await signup(firstEmail);
    return { screenshot: await shot(page, '02-dashboard-after-signup'), email: firstEmail };
  });

  await step('Dashboard shows welcome + credits', async () => {
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.includes('Welcome back')) throw new Error('Dashboard heading not found');
    return { screenshot: await shot(page, '03-dashboard') };
  });

  for (const [i, site] of SITES.entries()) {
    const label = new URL(site).hostname;
    let scanId = null;

    if (i > 0) {
      // fresh user + fresh 20 credits so the previous site's usage can't starve this one
      const email = `e2e.${stamp}.${i}@example.com`;
      testEmails.push(email);
      await step(`Sign up test user for ${label}`, async () => {
        await signup(email);
        return { email };
      });
    }

    await step(`Scan ${label}: submit`, async () => {
      await page.goto(`${FRONTEND_URL}/scan`, { waitUntil: 'networkidle2' });
      await page.type('input[type="text"]', site);
      await page.click('button[type="submit"]');
      // Either straight to polling, or a confirm screen if pages > credits
      await page.waitForFunction(
        () => document.body.innerText.includes('Scanning your website') ||
              document.body.innerText.includes('Credit limit reached'),
        { timeout: 30000 },
      );
      const needsConfirm = await page.evaluate(() => document.body.innerText.includes('Credit limit reached'));
      if (needsConfirm) {
        await shot(page, `0${4 + i * 3}-${label}-confirm`);
        await page.evaluate(() => {
          const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('use all credits'));
          if (btn) btn.click();
        });
      }
      return { screenshot: await shot(page, `0${4 + i * 3}-${label}-scanning`) };
    });

    await step(`Scan ${label}: wait for report`, async () => {
      await page.waitForFunction(() => location.pathname.startsWith('/report/'), { timeout: 180000 });
      scanId = page.url().split('/report/')[1];
      await page.waitForSelector('h1', { timeout: 15000 });
      return { screenshot: await shot(page, `0${5 + i * 3}-${label}-report`), scanId };
    });

    await step(`Scan ${label}: report has score`, async () => {
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!/Overall Score/i.test(bodyText)) throw new Error('Overall Score not found on report page');
      return { scanId };
    });
  }

  const lastEmail = testEmails[testEmails.length - 1];

  await step('Submit contact form', async () => {
    await page.goto(`${FRONTEND_URL}/contact`, { waitUntil: 'networkidle2' });
    await page.type('input[name="name"]', TEST_NAME);
    await page.type('input[name="email"]', lastEmail);
    await page.type('textarea[name="message"]', 'This is an automated E2E test submission.');
    await page.click('button[type="submit"]');
    await page.waitForFunction(
      () => document.body.innerText.toLowerCase().includes('thank') ||
            document.body.innerText.toLowerCase().includes('sent') ||
            document.body.innerText.toLowerCase().includes('success'),
      { timeout: 15000 },
    );
    return { screenshot: await shot(page, '10-contact-submitted') };
  });

  await step('Log out test user', async () => {
    await page.goto(`${FRONTEND_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => localStorage.clear());
    return {};
  });

  await step('Log in as admin', async () => {
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', ADMIN_EMAIL);
    await page.type('input[type="password"]', ADMIN_PASSWORD);
    await Promise.all([
      page.waitForFunction(() => location.pathname === '/dashboard', { timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);
    return {};
  });

  await step('Admin panel: Overview tab', async () => {
    await page.goto(`${FRONTEND_URL}/admin`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Total users'), { timeout: 15000 });
    return { screenshot: await shot(page, '11-admin-overview') };
  });

  await step('Admin panel: Users tab shows test users', async () => {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Users');
      if (btn) btn.click();
    });
    await page.waitForFunction(
      (emails) => emails.some(e => document.body.innerText.includes(e)),
      { timeout: 15000 },
      testEmails,
    );
    return { screenshot: await shot(page, '12-admin-users') };
  });

  await step('Admin panel: Scans tab shows scanned sites', async () => {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Scans');
      if (btn) btn.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes('savanpadaliya') || document.body.innerText.includes('susea'), { timeout: 15000 });
    return { screenshot: await shot(page, '13-admin-scans') };
  });

  await step('Admin panel: Contacts tab shows submission', async () => {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Contacts');
      if (btn) btn.click();
    });
    await page.waitForFunction((email) => document.body.innerText.includes(email), { timeout: 15000 }, lastEmail);
    return { screenshot: await shot(page, '14-admin-contacts') };
  });

  await browser.close();

  const summary = {
    ranAt: new Date().toISOString(),
    testUsers: testEmails.map(email => ({ email, password: TEST_PASSWORD })),
    sitesScanned: SITES,
    total: results.length,
    passed: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    steps: results,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify(summary, null, 2));
  console.log(`\n${summary.passed}/${summary.total} steps passed. Full results: ${path.join(OUT_DIR, 'results.json')}`);
  if (summary.failed > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error('E2E run crashed:', err);
  process.exitCode = 1;
});
