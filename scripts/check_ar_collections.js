import puppeteer from 'puppeteer-core';
import path from 'path';

async function checkAr() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile viewport
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
  
  await page.waitForFunction(() => {
    const preloader = document.getElementById('preloader') || document.querySelector('.turath-interpolator');
    if (!preloader) return true;
    const style = window.getComputedStyle(preloader);
    return style.display === 'none' || style.opacity === '0' || style.visibility === 'hidden';
  }, { timeout: 10000 }).catch(() => {});

  await new Promise(r => setTimeout(r, 2000));

  // Scroll to scene-03
  await page.evaluate(() => {
    const s3 = document.getElementById('scene-03');
    if (s3) s3.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 2000));

  const mobileInfo = await page.evaluate(() => {
    const track = document.querySelector('.collections-track');
    const cards = document.querySelectorAll('.collection-card');
    const dashes = document.querySelectorAll('.collections-pagination .dash-indicator');
    return {
      trackScrollLeft: track?.scrollLeft,
      trackScrollWidth: track?.scrollWidth,
      trackClientWidth: track?.clientWidth,
      cardsCount: cards.length,
      firstCardRect: cards[0]?.getBoundingClientRect(),
      activeDash: Array.from(dashes).findIndex(d => d.classList.contains('active')),
      computedTrack: track ? {
        direction: window.getComputedStyle(track).direction,
        display: window.getComputedStyle(track).display,
        scrollSnapType: window.getComputedStyle(track).scrollSnapType
      } : null
    };
  });
  console.log('Mobile Ar Info:', JSON.stringify(mobileInfo, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'ar_collections_mobile_current.png') });

  // Now test swipe / horizontal scroll on mobile track
  console.log('Simulating horizontal scroll...');
  await page.evaluate(() => {
    const track = document.querySelector('.collections-track');
    if (track) {
      track.scrollBy({ left: -300, behavior: 'smooth' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  const afterScroll = await page.evaluate(() => {
    const track = document.querySelector('.collections-track');
    const dashes = document.querySelectorAll('.collections-pagination .dash-indicator');
    return {
      scrollLeft: track?.scrollLeft,
      activeDash: Array.from(dashes).findIndex(d => d.classList.contains('active'))
    };
  });
  console.log('After scroll:', afterScroll);
  await page.screenshot({ path: path.join(brainDir, 'ar_collections_mobile_scrolled.png') });

  await browser.close();
}

checkAr().catch(console.error);
