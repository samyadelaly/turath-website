import puppeteer from 'puppeteer-core';
import path from 'path';

async function testScrollProgression() {
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

  await page.evaluate(() => {
    const p = document.getElementById('luxury-preloader');
    if (p) p.remove();
  }).catch(() => {});

  const s7Top = await page.evaluate(() => document.getElementById('scene-07')?.offsetTop || 5432);

  // We want to test scrolls: s7Top, s7Top + 400, s7Top + 800, s7Top + 1200, s7Top + 1600
  const offsets = [0, 400, 800, 1200, 1400, 1600, 1800, 2200];
  for (let i = 0; i < offsets.length; i++) {
    const y = s7Top + offsets[i];
    await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await new Promise(r => setTimeout(r, 600));

    const info = await page.evaluate(() => {
      const faq = document.getElementById('faq');
      const faqRect = faq ? faq.getBoundingClientRect() : null;
      const clip = faq ? window.getComputedStyle(faq).clipPath : 'none';
      return {
        scrollY: window.scrollY,
        faqTopInViewport: faqRect ? faqRect.top : null,
        faqBottomInViewport: faqRect ? faqRect.bottom : null,
        faqClip: clip
      };
    });
    console.log(`Scroll +${offsets[i]} (y=${y}):`, JSON.stringify(info));
    await page.screenshot({ path: path.join(brainDir, `founder_scroll_${offsets[i]}.png`) });
  }

  await browser.close();
}

testScrollProgression().catch(console.error);
