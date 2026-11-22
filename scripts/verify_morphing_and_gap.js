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

  // 1. Testing Arabic
  console.log('--- 1. Testing Arabic ---');
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 2000));

  const arInfo = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    const contact = document.querySelector('#contact');
    const s07Top = s07.offsetTop;
    const faqTop = faq.offsetTop;
    const contactTop = contact.offsetTop;
    const faqBottom = faqTop + faq.offsetHeight;
    return {
      s07Top,
      faqTop,
      faqBottom,
      contactTop,
      gapAfterFaq: contactTop - faqBottom
    };
  });
  console.log('Arabic Layout Info:', arInfo);

  // Scroll to halfway through FAQ entry (where morphing staircase is active)
  const faqEnterY = arInfo.faqTop - 1080;
  const morphMidY = faqEnterY + 540;
  await page.evaluate((pos) => window.scrollTo(0, pos), morphMidY);
  await new Promise(r => setTimeout(r, 400));
  const arClip = await page.evaluate(() => window.getComputedStyle(document.querySelector('#faq')).clipPath);
  console.log('Arabic Morph ClipPath midway:', arClip);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/ar_faq_morphing_active.png' });

  // Scroll to bottom of FAQ / top of contact to verify gap is zero
  await page.evaluate((pos) => window.scrollTo(0, pos - 500), arInfo.contactTop);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/ar_faq_bottom_contact.png' });

  // 2. Testing English
  console.log('--- 2. Testing English ---');
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 2000));

  const enInfo = await page.evaluate(() => {
    const s07 = document.querySelector('#scene-07');
    const faq = document.querySelector('#faq');
    const contact = document.querySelector('#contact');
    const s07Top = s07.offsetTop;
    const faqTop = faq.offsetTop;
    const contactTop = contact.offsetTop;
    const faqBottom = faqTop + faq.offsetHeight;
    return {
      s07Top,
      faqTop,
      faqBottom,
      contactTop,
      gapAfterFaq: contactTop - faqBottom
    };
  });
  console.log('English Layout Info:', enInfo);

  const enFaqEnterY = enInfo.faqTop - 1080;
  const enMorphMidY = enFaqEnterY + 540;
  await page.evaluate((pos) => window.scrollTo(0, pos), enMorphMidY);
  await new Promise(r => setTimeout(r, 400));
  const enClip = await page.evaluate(() => window.getComputedStyle(document.querySelector('#faq')).clipPath);
  console.log('English Morph ClipPath midway:', enClip);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/en_faq_morphing_active.png' });

  await browser.close();
})();
