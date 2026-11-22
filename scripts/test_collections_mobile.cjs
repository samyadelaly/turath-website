const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile viewport: iPhone 14 Pro
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

  console.log('--- TESTING AR.HTML COLLECTIONS ON MOBILE ---');
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to scene-03
  await page.evaluate(() => {
    const s3 = document.getElementById('scene-03');
    if (s3) s3.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));

  const trackInfo = await page.evaluate(() => {
    const track = document.querySelector('#scene-03 .collections-track');
    const cards = Array.from(track ? track.querySelectorAll('.collection-card') : []);
    return {
      trackDir: track ? window.getComputedStyle(track).direction : null,
      trackScrollLeft: track ? track.scrollLeft : null,
      trackScrollWidth: track ? track.scrollWidth : null,
      trackClientWidth: track ? track.clientWidth : null,
      snapType: track ? window.getComputedStyle(track).scrollSnapType : null,
      cards: cards.map((c, i) => {
        const rect = c.getBoundingClientRect();
        return {
          index: i,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          snapAlign: window.getComputedStyle(c).scrollSnapAlign
        };
      })
    };
  });
  console.log('Initial mobile track state in AR:', JSON.stringify(trackInfo, null, 2));

  // Let's test scrolling horizontally by 150px
  console.log('Scrolling track by -150px (RTL next)...');
  await page.evaluate(() => {
    const track = document.querySelector('#scene-03 .collections-track');
    if (track) track.scrollBy({ left: -150, behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const scrolledState = await page.evaluate(() => {
    const track = document.querySelector('#scene-03 .collections-track');
    const cards = Array.from(track ? track.querySelectorAll('.collection-card') : []);
    return {
      scrollLeft: track ? track.scrollLeft : null,
      cards: cards.slice(0, 3).map((c, i) => ({
        index: i,
        left: c.getBoundingClientRect().left,
        width: c.getBoundingClientRect().width
      }))
    };
  });
  console.log('Scrolled track state in AR:', JSON.stringify(scrolledState, null, 2));

  // Now let's compare with index.html on mobile!
  console.log('\n--- TESTING INDEX.HTML COLLECTIONS ON MOBILE ---');
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const s3 = document.getElementById('scene-03');
    if (s3) s3.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));

  const indexTrackInfo = await page.evaluate(() => {
    const track = document.querySelector('#scene-03 .collections-track');
    const cards = Array.from(track ? track.querySelectorAll('.collection-card') : []);
    return {
      trackDir: track ? window.getComputedStyle(track).direction : null,
      trackScrollLeft: track ? track.scrollLeft : null,
      trackScrollWidth: track ? track.scrollWidth : null,
      trackClientWidth: track ? track.clientWidth : null,
      snapType: track ? window.getComputedStyle(track).scrollSnapType : null,
      cards: cards.slice(0, 3).map((c, i) => {
        const rect = c.getBoundingClientRect();
        return {
          index: i,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          snapAlign: window.getComputedStyle(c).scrollSnapAlign
        };
      })
    };
  });
  console.log('Initial mobile track state in EN:', JSON.stringify(indexTrackInfo, null, 2));

  await browser.close();
})();
