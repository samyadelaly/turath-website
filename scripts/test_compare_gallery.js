import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

console.log('Testing EN index.html#gallery...');
await page.goto('http://127.0.0.1:5173/index.html#gallery', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));
const enScrollY = await page.evaluate(() => window.scrollY);
console.log('EN scrollY at #gallery:', enScrollY);
await page.screenshot({ path: 'test_en_gallery.png' });

console.log('Testing AR ar.html#gallery...');
await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));
const arScrollY = await page.evaluate(() => window.scrollY);
console.log('AR scrollY at #gallery:', arScrollY);
await page.screenshot({ path: 'test_ar_gallery.png' });

await browser.close();
