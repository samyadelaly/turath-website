const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('facebook.net') || url.includes('google-analytics') || url.includes('googletagmanager')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log('Navigating to ar.html#gallery...');
  await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/test_gallery_current.png' });
  console.log('Screenshot saved.');

  // Check positions of scene-03, faq, contact
  const positions = await page.evaluate(() => {
    const s3 = document.getElementById('scene-03');
    const contact = document.getElementById('contact');
    const faq = document.getElementById('faq');
    return {
      scrollY: window.scrollY,
      s3: s3 ? s3.getBoundingClientRect() : null,
      contact: contact ? {
        rect: contact.getBoundingClientRect(),
        clipPath: window.getComputedStyle(contact).clipPath,
        zIndex: window.getComputedStyle(contact).zIndex,
        position: window.getComputedStyle(contact).position,
        opacity: window.getComputedStyle(contact).opacity,
        display: window.getComputedStyle(contact).display,
        visibility: window.getComputedStyle(contact).visibility
      } : null,
      faq: faq ? faq.getBoundingClientRect() : null
    };
  });
  console.log('Positions:', JSON.stringify(positions, null, 2));

  await browser.close();
})();
