import { chromium } from 'playwright';

const OUT =
  '/tmp/claude-0/-home-user-vscode-cpptools/419eb09f-30e5-5366-a284-7012ae2bb3da/scratchpad';
const URL = 'http://127.0.0.1:5173/';
const KEY = 'be-me:v0.1';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const problems = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text().slice(0, 180)}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));

const store = () => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY);
const pass = (name, ok, detail = '') =>
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

/* 1. Selecting an option updates state immediately, no reload. */
await page.getByRole('button', { name: 'Hair', exact: true }).click();
await page.waitForTimeout(250);
await page.getByRole('button', { name: /^Curl Top\b/ }).first().click();
await page.waitForTimeout(350);
let s = await store();
pass('select hair updates state', s?.current?.selection?.hair === 'hair_003', `hair=${s?.current?.selection?.hair}`);

/* 2. Randomize fills from enabled assets only. */
await page.getByRole('button', { name: 'Randomize' }).click();
await page.waitForTimeout(500);
s = await store();
const filled = Object.entries(s.current.selection).filter(([, v]) => v !== null);
pass('randomize fills slots', filled.length >= 6, `${filled.length}/8 filled`);

/* 3. Save. */
await page.getByRole('button', { name: 'Save Avatar' }).click();
await page.waitForTimeout(300);
await page.getByPlaceholder('Untitled Build').fill('Test Build One');
await page.getByRole('button', { name: 'Save', exact: true }).click();
await page.waitForTimeout(450);
s = await store();
pass('save writes to storage', s.saved.length === 1 && s.saved[0].name === 'Test Build One', `${s.saved.length} saved`);
const savedSelection = JSON.stringify(s.saved[0].config.selection);

/* 4. Reset clears customisation but keeps the master. */
await page.getByRole('button', { name: 'Reset' }).click();
await page.waitForTimeout(400);
s = await store();
const allNull = Object.values(s.current.selection).every((v) => v === null);
pass('reset clears selection', allNull);

/* 5. Load restores the saved build exactly. */
await page.getByRole('button', { name: /My Avatars/i }).click();
await page.waitForTimeout(350);
await page.getByRole('button', { name: /^Test Build One/ }).first().click();
await page.waitForTimeout(450);
s = await store();
pass('load restores selection', JSON.stringify(s.current.selection) === savedSelection);

/* 6. Body base switch changes the master avatar. */
await page.getByRole('button', { name: 'Girl' }).click();
await page.waitForTimeout(900);
const girlSrc = await page.getAttribute('img[alt^="base:"]', 'src');
pass('girl master loads', girlSrc?.includes('/girl/base/master.png'), girlSrc ?? 'none');
await page.getByRole('button', { name: 'Boy' }).click();
await page.waitForTimeout(900);
const boySrc = await page.getAttribute('img[alt^="base:"]', 'src');
pass('boy master loads', boySrc?.includes('/boy/base/master.png'), boySrc ?? 'none');

/* 7. Every composited layer occupies the identical box — the canvas contract.
      Stack several slots first so there is more than one layer to compare. */
for (const [cat, option] of [['Hair', 'Waves'], ['Tops', 'Hoodie'], ['Shoes', 'Boots'], ['Extras', 'Backpack']]) {
  await page.getByRole('button', { name: cat, exact: true }).click();
  await page.waitForTimeout(180);
  await page.getByRole('button', { name: new RegExp(`^${option}\\b`) }).first().click();
  await page.waitForTimeout(180);
}
await page.waitForTimeout(400);
const boxes = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img[alt*=":"]')].filter((i) =>
    i.closest('[data-master-canvas]'),
  );
  return imgs.map((i) => {
    const r = i.getBoundingClientRect();
    return { alt: i.alt, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
});
const identical =
  boxes.length > 0 && boxes.every((b) => b.x === boxes[0].x && b.y === boxes[0].y && b.w === boxes[0].w && b.h === boxes[0].h);
pass('all layers share one box', identical, `${boxes.length} layers @ ${boxes[0]?.w}x${boxes[0]?.h}`);

/* 8. Persistence across a reload. */
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const after = await store();
pass('persists across reload', after.saved.length === 1 && after.current.bodyBase === 'boy');

/* 9. New avatar resets everything but keeps saves. */
await page.getByRole('button', { name: 'New', exact: true }).click();
await page.waitForTimeout(400);
s = await store();
pass('new avatar clears build, keeps saves', Object.values(s.current.selection).every((v) => v === null) && s.saved.length === 1);

await page.screenshot({ path: `${OUT}/bm-final.png` });

console.log('--- console ---');
console.log(problems.length ? [...new Set(problems)].join('\n') : '(clean)');
await browser.close();
