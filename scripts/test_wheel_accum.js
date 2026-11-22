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
  const section = document.getElementById('scene-03');
  const track = document.querySelector('.collections-track');
  
  let accumulatedWheel = 0;
  let wheelTimeout = null;

  function scrollOneCard(direction) {
    const card = track.querySelector('.collection-card');
    const scrollStep = card ? (card.offsetWidth + 16) : 260;
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar' || window.getComputedStyle(track).direction === 'rtl';
    const dirMultiplier = isRTL ? -direction : direction;
    track.scrollBy({
      left: dirMultiplier * scrollStep,
      behavior: 'smooth'
    });
  }

  section.addEventListener('wheel', (e) => {
    if (window.innerWidth < 1024) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const currentScroll = Math.abs(track.scrollLeft);
      const isDown = e.deltaY > 0;

      const canScrollDown = currentScroll < (maxScroll - 20);
      const canScrollUp = currentScroll > 20;
      const canScrollTrack = isDown ? canScrollDown : canScrollUp;

      if (canScrollTrack) {
        e.preventDefault();
        accumulatedWheel += e.deltaY;
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => { accumulatedWheel = 0; }, 200);

        const threshold = 60; // 60px wheel delta triggers one card advance
        if (Math.abs(accumulatedWheel) >= threshold) {
          const dir = accumulatedWheel > 0 ? 1 : -1;
          scrollOneCard(dir);
          accumulatedWheel = 0;
        }
      }
    }
  }, { passive: false });
});

// Now simulate mouse wheel over #scene-03
await page.mouse.move(960, 540);
console.log('Sending wheel delta 100...');
await page.mouse.wheel({ deltaY: 100 });
await new Promise(r => setTimeout(r, 500));

const check1 = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  return { scrollY: window.scrollY, scrollLeft: track.scrollLeft };
});
console.log('Check 1 (after 1 wheel tick):', check1);

console.log('Sending 2 more wheel ticks...');
await page.mouse.wheel({ deltaY: 100 });
await new Promise(r => setTimeout(r, 500));
await page.mouse.wheel({ deltaY: 100 });
await new Promise(r => setTimeout(r, 500));

const check2 = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  return { scrollY: window.scrollY, scrollLeft: track.scrollLeft };
});
console.log('Check 2 (after 3 wheel ticks):', check2);

await browser.close();
