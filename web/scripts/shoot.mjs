// Screenshot edited pages with a real Chrome (puppeteer-core). Scrolls to trigger
// reveal-on-scroll + lazy images, then captures. Cinematic course scenes are captured
// per-element after scrolling them into view.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/Users/TANG/Desktop/EECWebPage/web/.shots';
const BASE = 'http://localhost:3000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = 400;
      const t = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight + 1000) { clearInterval(t); resolve(); }
      }, 80);
    });
  });
  await sleep(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

// Full-page captures (standard pages)
for (const [name, path] of [['home', '/'], ['tuition', '/tuition'], ['personnel', '/personnel'], ['portfolio', '/portfolio']]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
  await autoScroll(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`shot ${name}`);
  await page.close();
}

// Cinematic course page — capture specific scenes into the viewport
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE + '/courses/yon', { waitUntil: 'networkidle2', timeout: 60000 });
  for (const [label, sel] of [['course-video', '.cd-video'], ['course-gallery', '.cd-gallery']]) {
    const el = await page.$(sel);
    if (!el) { console.log(`no ${sel}`); continue; }
    await el.evaluate((n) => n.scrollIntoView({ block: 'center' }));
    await sleep(900);
    await page.screenshot({ path: `${OUT}/${label}.png` });
    console.log(`shot ${label}`);
  }
  // open the lightbox on first gallery image
  const item = await page.$('.cd-gallery-item');
  if (item) { await item.click(); await sleep(700); await page.screenshot({ path: `${OUT}/course-lightbox.png` }); console.log('shot course-lightbox'); }
  await page.close();
}

// Mobile nav (the bug we fixed) — narrow viewport, open drawer
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(500);
  await page.screenshot({ path: `${OUT}/mobile-home.png` });
  console.log('shot mobile-home');
  await page.close();
}

await browser.close();
console.log('done');
