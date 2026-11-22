import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

const styles = await page.evaluate(() => {
  const bespoke = document.getElementById('bespoke');
  const slicesContainer = bespoke ? bespoke.querySelector('div.absolute.inset-0.z-0') : null;
  const slices = bespoke ? bespoke.querySelectorAll('.b-slice') : [];
  
  return {
    bespokeBg: bespoke ? window.getComputedStyle(bespoke).backgroundColor : null,
    containerBg: slicesContainer ? window.getComputedStyle(slicesContainer).backgroundColor : null,
    slices: Array.from(slices).map(s => ({
      bgImg: window.getComputedStyle(s).backgroundImage,
      bgColor: window.getComputedStyle(s).backgroundColor,
      clipPath: window.getComputedStyle(s).clipPath
    }))
  };
});

console.log('EN Bespoke Computed Styles on Desktop:', styles);
await browser.close();
