import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));

// Click on the Collections / المجموعات link in nav
const clicked = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a'));
  const galleryLink = links.find(a => (a.getAttribute('href') || '').includes('gallery') || (a.getAttribute('href') || '').includes('collections') || a.textContent.includes('المجموعات'));
  if (galleryLink) {
    galleryLink.click();
    return true;
  }
  return false;
});

console.log('Clicked gallery link:', clicked);
// Wait for scroll animation to finish
await new Promise(r => setTimeout(r, 2000));

const status = await page.evaluate(() => {
  const bespoke = document.getElementById('bespoke');
  const s3 = document.getElementById('scene-03');
  const cards = document.querySelectorAll('.collection-card');
  return {
    scrollY: window.scrollY,
    s3Top: s3 ? s3.getBoundingClientRect().top : null,
    bespokeTop: bespoke ? bespoke.getBoundingClientRect().top : null,
    card0Rect: cards[0] ? cards[0].getBoundingClientRect() : null
  };
});

console.log('After clicking nav link:', status);
await page.screenshot({ path: 'test_click_gallery_result.png' });

await browser.close();
