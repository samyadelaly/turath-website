import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Using 1536 x 864 or 1920 x 1080 (in user's screenshot taskbar shows standard Windows scaling, ~1536x864 or 1920x1080)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://127.0.0.1:5173/#founder', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 1000));

  const directLoadInfo = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    const s07R = s07 ? s07.getBoundingClientRect() : null;
    const faqR = faq ? faq.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      s07Rect: s07R ? { top: s07R.top, bottom: s07R.bottom } : null,
      faqRect: faqR ? { top: faqR.top, bottom: faqR.bottom } : null,
      faqVisible: faqR ? (faqR.top < window.innerHeight && faqR.bottom > 0) : false
    };
  });
  console.log('Direct load #founder:', directLoadInfo);

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/direct_load_founder.png' });

  // Now click nav link for founder
  await page.evaluate(() => {
    const link = document.querySelector('a[href="#founder"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  const afterClickInfo = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    const s07R = s07 ? s07.getBoundingClientRect() : null;
    const faqR = faq ? faq.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      s07Rect: s07R ? { top: s07R.top, bottom: s07R.bottom } : null,
      faqRect: faqR ? { top: faqR.top, bottom: faqR.bottom } : null,
      faqVisible: faqR ? (faqR.top < window.innerHeight && faqR.bottom > 0) : false
    };
  });
  console.log('After nav click #founder:', afterClickInfo);

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/after_click_founder.png' });

  // Also test Arabic /ar.html#founder
  await page.goto('http://127.0.0.1:5173/ar.html#founder', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/ar_founder.png' });

  await browser.close();
})();
