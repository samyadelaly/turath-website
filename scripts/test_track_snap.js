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

const snapInfo = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  const card = track.querySelector('.collection-card');
  const cardWidth = card ? card.offsetWidth + 16 : 300;
  
  // Try scrolling by -cardWidth
  track.scrollBy({ left: -cardWidth, behavior: 'instant' });
  const afterCard1 = track.scrollLeft;

  // Try again
  track.scrollBy({ left: -cardWidth, behavior: 'instant' });
  const afterCard2 = track.scrollLeft;

  return {
    cardWidth,
    afterCard1,
    afterCard2,
    maxScroll: track.scrollWidth - track.clientWidth
  };
});

console.log('Snap info:', snapInfo);

await browser.close();
