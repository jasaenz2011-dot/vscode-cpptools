import { chromium } from 'playwright';

const OUT =
  '/tmp/claude-0/-home-user-vscode-cpptools/419eb09f-30e5-5366-a284-7012ae2bb3da/scratchpad';
const URL = 'http://127.0.0.1:5173/';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

const problems = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text().slice(0, 200)}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
page.on('response', (r) => {
  if (r.status() >= 400) problems.push(`[${r.status()}] ${r.url()}`);
});

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1600);
await page.screenshot({ path: `${OUT}/bm-1920.png` });

// Girl base
await page.getByRole('button', { name: 'Girl' }).click();
await page.waitForTimeout(1400);
await page.screenshot({ path: `${OUT}/bm-girl.png` });

// Back to boy, open a couple of categories
await page.getByRole('button', { name: 'Boy' }).click();
await page.waitForTimeout(900);
await page.getByRole('button', { name: 'Hair', exact: true }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/bm-hair.png` });

// A locked style + an unavailable view
await page.getByRole('button', { name: /Watercolor/i }).click().catch(() => {});
await page.getByRole('button', { name: '360' }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/bm-360.png` });
await page.getByRole('button', { name: 'Front' }).click();
await page.waitForTimeout(500);

// Smaller laptop
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/bm-1440.png` });

const overflow = await page.evaluate(() => ({
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
  sh: document.documentElement.scrollHeight,
  ch: document.documentElement.clientHeight,
}));
console.log(`overflow 1440: x ${overflow.sw}/${overflow.cw}  y ${overflow.sh}/${overflow.ch}`);

console.log('--- console/network ---');
console.log(problems.length ? [...new Set(problems)].join('\n') : '(clean)');

await browser.close();
