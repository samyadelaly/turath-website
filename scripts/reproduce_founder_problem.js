import puppeteer from 'puppeteer-core';
import path from 'path';

async function testFounder() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));

  // Remove preloader
  await page.evaluate(() => {
    const p = document.getElementById('luxury-preloader');
    if (p) p.remove();
  }).catch(() => {});

  await new Promise(r => setTimeout(r, 1000));

  // Click nav link for founder
  console.log('Navigating to #founder...');
  await page.evaluate(() => {
    const link = document.querySelector('a[href="#founder"]');
    if (link) link.click();
    else window.location.hash = '#founder';
  });

  await new Promise(r => setTimeout(r, 3000));

  const state1 = await page.evaluate(() => {
    const s7 = document.getElementById('scene-07');
    const faq = document.getElementById('faq');
    const media = document.getElementById('faq-bg-media');
    return {
      scrollY: window.scrollY,
      s7Rect: s7 ? { top: s7.getBoundingClientRect().top, bottom: s7.getBoundingClientRect().bottom } : null,
      faqRect: faq ? { top: faq.getBoundingClientRect().top, bottom: faq.getBoundingClientRect().bottom } : null,
      faqClip: faq ? window.getComputedStyle(faq).clipPath : null,
      mediaRect: media ? { top: media.getBoundingClientRect().top, position: window.getComputedStyle(media).position } : null
    };
  });
  console.log('State at #founder:', JSON.stringify(state1, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'reproduce_founder_1.png') });

  // Scroll +200px
  await page.evaluate(() => window.scrollBy(0, 200));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'reproduce_founder_2.png') });

  // Scroll +400px
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'reproduce_founder_3.png') });

  await browser.close();
}

testFounder().catch(console.error);
