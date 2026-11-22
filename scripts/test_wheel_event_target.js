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

await page.evaluate(() => {
  window.__wheelLogs = [];
  window.addEventListener('wheel', (e) => {
    window.__wheelLogs.push({
      target: e.target ? (e.target.tagName + '.' + e.target.className) : null,
      deltaY: e.deltaY,
      defaultPrevented: e.defaultPrevented
    });
  }, { passive: false });
});

await page.mouse.move(960, 540);
await page.mouse.wheel({ deltaY: 100 });
await new Promise(r => setTimeout(r, 200));

const logs = await page.evaluate(() => window.__wheelLogs);
console.log('Wheel logs on window:', logs);

await browser.close();
