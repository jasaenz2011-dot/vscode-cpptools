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
pass('randomize fills slots', filled.length >= 7, `${filled.length}/9 filled`);

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

/* 5. Load restores the saved build exactly, from the Your Creations panel. */
await page.getByRole('button', { name: 'Load Test Build One' }).click();
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
for (const [cat, option] of [['Hair', 'Waves'], ['Tops', 'Hoodie'], ['Shoes', 'Boots'], ['Accessories', 'Backpack'], ['Extras', 'Cape']]) {
  await page.getByRole('button', { name: cat, exact: true }).click();
  await page.waitForTimeout(180);
  await page.getByRole('button', { name: new RegExp(`^${option}\\b`) }).first().click();
  await page.waitForTimeout(180);
}
await page.waitForTimeout(400);
// There are now several independent stages on screen (orb, preview strip,
// saved slots). The contract is per stage: within ONE stage every layer must
// occupy an identical box. Group by stage and assert that for each.
const stages = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-master-canvas]')].map((stage) => {
    const imgs = [...stage.querySelectorAll('img[alt*=":"]')];
    return imgs.map((i) => {
      const r = i.getBoundingClientRect();
      return {
        alt: i.alt,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    });
  });
});
const multi = stages.filter((layers) => layers.length > 1);
const identical =
  multi.length > 0 &&
  multi.every((layers) =>
    layers.every(
      (b) => b.x === layers[0].x && b.y === layers[0].y && b.w === layers[0].w && b.h === layers[0].h,
    ),
  );
const biggest = multi.reduce((a, b) => (b.length > a.length ? b : a), multi[0] ?? []);
pass(
  'every stage aligns its layers',
  identical,
  `${stages.length} stages, ${multi.length} multi-layer, largest ${biggest.length} layers @ ${biggest[0]?.w}x${biggest[0]?.h}`,
);

/* 7b. The style rail must not borrow another style's art for a locked tile. */
const lockedTilesHaveNoArt = await page.evaluate(() => {
  const tiles = [...document.querySelectorAll('button[aria-label*="coming soon"]')];
  return tiles.length > 0 && tiles.every((t) => t.querySelector('img') === null);
});
pass('locked styles show no borrowed art', lockedTilesHaveNoArt);

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
