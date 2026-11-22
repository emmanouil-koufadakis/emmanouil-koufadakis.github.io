/**
 * Renders the downloadable CV PDF and the social preview image:
 *   public/Emmanouil_Koufadakis_CV.pdf     ← /cv
 *   public/og.png                          ← /og
 *   public/Emmanouil_Koufadakis_CV_EL.pdf  ← /el/cv   (Greek)
 *   public/og-el.png                       ← /el/og   (Greek)
 *
 * Usage:
 *   CV_PHONE="07…" SITE_URL="https://<user>.github.io" npm run render:assets
 *
 * Both variables are optional (they can also live in .env). The phone number is
 * only ever written into the PDF, never into the deployed HTML.
 * Uses your installed Google Chrome, so no browser download is needed.
 */
import { dev } from 'astro';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = (f) => path.join(root, 'public', f);
const port = 4399;

const server = await dev({ root, logLevel: 'warn', devToolbar: { enabled: false }, server: { port, host: '127.0.0.1' } });
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome' });
  const base = `http://127.0.0.1:${port}`;

  // English at the root, Greek under /el/.
  const versions = [
    { path: '', pdf: 'Emmanouil_Koufadakis_CV.pdf', og: 'og.png' },
    { path: '/el', pdf: 'Emmanouil_Koufadakis_CV_EL.pdf', og: 'og-el.png' },
  ];
  for (const v of versions) {
    const cv = await browser.newPage();
    await cv.goto(`${base}${v.path}/cv/`, { waitUntil: 'networkidle' });
    await cv.evaluate(() => document.fonts.ready);
    await cv.pdf({ path: out(v.pdf), preferCSSPageSize: true, printBackground: true });
    console.log(`✓ public/${v.pdf}`);

    const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await og.goto(`${base}${v.path}/og/`, { waitUntil: 'networkidle' });
    await og.evaluate(() => document.fonts.ready);
    await og.screenshot({ path: out(v.og), clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log(`✓ public/${v.og}`);
  }
} finally {
  await browser?.close();
  await server.stop();
}
