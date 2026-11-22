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
  
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'load', timeout: 60000 });
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
  console.log('Arabic Scroll range info:', JSON.stringify(range, null, 2));

  if (!range.s07ST) {
    console.log('No s07ST found in ar.html!');
    await browser.close();
    return;
  }

  const start = range.s07ST.start;
  const end = range.s07ST.end;

  for (let i of [2, 7, 8, 10]) {
    const y = Math.round(start + (end - start) * (i / 10));
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/ar_founder_step_${i}.png` });
  }

  // Also test mobile viewport 393x852 on ar.html
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to founder on mobile
  const mobileRange = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    const stList = ScrollTrigger.getAll();
    const s07ST = stList.find(t => t.trigger === s07 && t.pin);
    return {
      s07ST: s07ST ? { start: s07ST.start, end: s07ST.end } : null,
      s07Top: s07.getBoundingClientRect().top + window.scrollY,
      faqTop: faq.getBoundingClientRect().top + window.scrollY
    };
  });
  console.log('Mobile range info:', mobileRange);

  if (mobileRange.s07ST) {
    await page.evaluate((pos) => window.scrollTo(0, pos), mobileRange.s07ST.start + 100);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/ar_mobile_founder.png` });

    await page.evaluate((pos) => window.scrollTo(0, pos), mobileRange.faqTop + 200);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/ar_mobile_faq.png` });
  }

  await browser.close();
})();
