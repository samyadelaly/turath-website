import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

const elInfo = await page.evaluate(() => {
  const el = document.elementFromPoint(960, 540);
  return {
    tagName: el ? el.tagName : null,
    id: el ? el.id : null,
    className: el ? el.className : null,
    closestSection: el && el.closest ? (el.closest('section') ? el.closest('section').id : null) : null
  };
});

console.log('Element at 960, 540:', elInfo);
await browser.close();
