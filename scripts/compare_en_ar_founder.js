import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. Test index.html #founder
  console.log('--- Testing index.html #founder ---');
  await page.goto('http://127.0.0.1:5173/index.html#founder', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 2000));
  const enFounderInfo = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    return {
      scrollY: window.scrollY,
      s07R: s07 ? s07.getBoundingClientRect() : null,
      faqR: faq ? faq.getBoundingClientRect() : null
    };
  });
  console.log('EN #founder on load:', enFounderInfo);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/test_en_founder_load.png' });

  // 2. Test ar.html #founder
  console.log('--- Testing ar.html #founder ---');
  await page.goto('http://127.0.0.1:5173/ar.html#founder', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 2000));
  const arFounderInfo = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    return {
      scrollY: window.scrollY,
      s07R: s07 ? s07.getBoundingClientRect() : null,
      faqR: faq ? faq.getBoundingClientRect() : null
    };
  });
  console.log('AR #founder on load:', arFounderInfo);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/test_ar_founder_load.png' });

  await browser.close();
})();
