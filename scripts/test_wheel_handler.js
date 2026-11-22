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

// Add the wheel handler in browser context to test
await page.evaluate(() => {
  const section = document.getElementById('scene-03');
  const track = document.querySelector('.collections-track');
  
  section.addEventListener('wheel', (e) => {
    if (window.innerWidth < 1024) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar' || window.getComputedStyle(track).direction === 'rtl';
      const maxScroll = track.scrollWidth - track.clientWidth;
      const currentScroll = Math.abs(track.scrollLeft);
      const scrollingForward = e.deltaY > 0;
      
      const canScrollForward = currentScroll < (maxScroll - 10);
      const canScrollBackward = currentScroll > 10;
      const canScrollTrack = scrollingForward ? canScrollForward : canScrollBackward;

      if (canScrollTrack) {
        e.preventDefault();
        const dirMultiplier = isRTL ? -1 : 1;
        track.scrollBy({
          left: e.deltaY * dirMultiplier,
          behavior: 'auto'
        });
      }
    }
  }, { passive: false });
});

// Now simulate mouse wheel over #scene-03
await page.mouse.move(960, 540); // Center of screen, over cards
console.log('Dispatching wheel event 100px...');
await page.mouse.wheel({ deltaY: 200 });
await new Promise(r => setTimeout(r, 300));

let state1 = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  return {
    scrollY: window.scrollY,
    scrollLeft: track.scrollLeft
  };
});
console.log('After first wheel event:', state1);

console.log('Dispatching more wheel events...');
await page.mouse.wheel({ deltaY: 400 });
await new Promise(r => setTimeout(r, 300));
await page.mouse.wheel({ deltaY: 400 });
await new Promise(r => setTimeout(r, 300));

let state2 = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  return {
    scrollY: window.scrollY,
    scrollLeft: track.scrollLeft
  };
});
console.log('After multiple wheel events:', state2);

await page.screenshot({ path: 'test_wheel_scroll_cards.png' });
await browser.close();
