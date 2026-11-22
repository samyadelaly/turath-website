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

// Check scrollLeft behavior in RTL
const rtlInfo = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  const initialScrollLeft = track.scrollLeft;
  const scrollWidth = track.scrollWidth;
  const clientWidth = track.clientWidth;
  
  // Try scrolling by -200 (which is forward in RTL)
  track.scrollBy({ left: -200, behavior: 'instant' });
  const afterForward = track.scrollLeft;

  // Try scrolling back by +200
  track.scrollBy({ left: 200, behavior: 'instant' });
  const afterBack = track.scrollLeft;

  return {
    initialScrollLeft,
    scrollWidth,
    clientWidth,
    maxScroll: scrollWidth - clientWidth,
    afterForward,
    afterBack
  };
});

console.log('RTL Track info:', rtlInfo);

await browser.close();
