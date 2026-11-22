import puppeteer from 'puppeteer-core';
import path from 'path';

async function safeEval(page, fn, ...args) {
  for (let i = 0; i < 5; i++) {
    try {
      return await page.evaluate(fn, ...args);
    } catch (e) {
      if (i === 4) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function testFounderView() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to index.html...');
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));

  // Dismiss loader completely
  await safeEval(page, () => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click #founder link
  console.log('Navigating to #founder...');
  await safeEval(page, () => {
    const link = document.querySelector('a[href="#founder"]');
    if (link) link.click();
    else window.location.hash = '#founder';
  });

  await new Promise(r => setTimeout(r, 2500));

  const state1 = await safeEval(page, () => ({
    scrollY: window.scrollY,
    s7Rect: document.getElementById('scene-07')?.getBoundingClientRect(),
    faqRect: document.getElementById('faq')?.getBoundingClientRect(),
    faqClip: window.getComputedStyle(document.getElementById('faq')).clipPath
  }));
  console.log('State at founder landing:', JSON.stringify(state1, null, 2));

  await page.screenshot({ path: path.join(brainDir, 'debug_founder_landing.png') });

  // Scroll down by 200px
  console.log('Scrolling +200px...');
  await safeEval(page, () => window.scrollBy(0, 200));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'debug_founder_plus_200.png') });

  // Scroll down by 400px more
  console.log('Scrolling +400px more...');
  await safeEval(page, () => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'debug_founder_plus_600.png') });

  await browser.close();
}

testFounderView().catch(console.error);
