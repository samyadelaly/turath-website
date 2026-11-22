import puppeteer from 'puppeteer-core';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Go to index.html without waiting for networkidle
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 2000));

  // Get founder scroll range
  const range = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    const stList = ScrollTrigger.getAll();
    const s07ST = stList.find(t => t.trigger === s07 && t.pin);
    const faqST = stList.find(t => t.trigger === faq);
    return {
      s07ST: s07ST ? { start: s07ST.start, end: s07ST.end } : null,
      faqST: faqST ? { start: faqST.start, end: faqST.end } : null,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight
    };
  });
  console.log('Scroll range info:', JSON.stringify(range, null, 2));

  if (!range.s07ST) {
    console.log('No s07ST found!');
    await browser.close();
    return;
  }

  const start = range.s07ST.start;
  const end = range.s07ST.end;
  console.log(`Testing from start ${start} to end ${end} in 10 steps...`);

  for (let i = 0; i <= 10; i++) {
    const y = Math.round(start + (end - start) * (i / 10));
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await new Promise(r => setTimeout(r, 300));
    const stepInfo = await page.evaluate(() => {
      const s07 = document.querySelector('#scene-07');
      const faq = document.querySelector('#faq');
      const s07R = s07.getBoundingClientRect();
      const faqR = faq.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        s07R: { top: Math.round(s07R.top), bottom: Math.round(s07R.bottom) },
        faqR: { top: Math.round(faqR.top), bottom: Math.round(faqR.bottom) },
        faqClip: window.getComputedStyle(faq).clipPath
      };
    });
    console.log(`Step ${i} (y=${y}):`, stepInfo);
    await page.screenshot({ path: `C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/founder_step_${i}.png` });
  }

  await browser.close();
})();
