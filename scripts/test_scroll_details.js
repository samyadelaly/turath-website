import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1000));

const info = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const bespoke = document.getElementById('bespoke');
  const form = document.getElementById('bespoke-form');
  const track = document.querySelector('.collections-track');
  const cards = document.querySelectorAll('.collection-card');
  const s3Rect = s3.getBoundingClientRect();
  const bRect = bespoke.getBoundingClientRect();
  const fRect = form ? form.getBoundingClientRect() : null;
  const c0Rect = cards[0] ? cards[0].getBoundingClientRect() : null;

  return {
    scrollY: window.scrollY,
    s3: { top: s3Rect.top, bottom: s3Rect.bottom, height: s3Rect.height },
    bespoke: { top: bRect.top, bottom: bRect.bottom, height: bRect.height },
    form: fRect ? { top: fRect.top, bottom: fRect.bottom } : null,
    card0: c0Rect ? { top: c0Rect.top, bottom: c0Rect.bottom } : null
  };
});

console.log('At landing scrollY:', info);

// Now simulate scrolling down 300px
await page.evaluate(() => window.scrollBy(0, 300));
await new Promise(r => setTimeout(r, 500));
const infoScrolled = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const bespoke = document.getElementById('bespoke');
  const form = document.getElementById('bespoke-form');
  const cards = document.querySelectorAll('.collection-card');
  return {
    scrollY: window.scrollY,
    s3Top: s3.getBoundingClientRect().top,
    bespokeTop: bespoke.getBoundingClientRect().top,
    formTop: form ? form.getBoundingClientRect().top : null,
    card0Bottom: cards[0] ? cards[0].getBoundingClientRect().bottom : null
  };
});
console.log('After scrolling 300px:', infoScrolled);
await page.screenshot({ path: 'test_ar_scrolled_300.png' });

await browser.close();
