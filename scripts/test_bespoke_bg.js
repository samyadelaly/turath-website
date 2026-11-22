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

const bespokeStyles = await page.evaluate(() => {
  const b = document.getElementById('bespoke');
  return {
    bg: window.getComputedStyle(b).backgroundColor,
    zIndex: window.getComputedStyle(b).zIndex,
    pointerEvents: window.getComputedStyle(b).pointerEvents
  };
});
console.log('Bespoke styles:', bespokeStyles);

await browser.close();
