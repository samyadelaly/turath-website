import puppeteer from 'puppeteer-core';

async function testFaqDesktop() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
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

  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/test_faq_ar_1366.png' });

  // Inspect #faq and its children
  const info = await page.evaluate(() => {
    const faq = document.querySelector('#faq');
    const media = document.querySelector('#faq-bg-media');
    const img = document.querySelector('#faq-bg-media img');
    const video = document.querySelector('#faq-bg-video');
    return {
      windowScrollY: window.scrollY,
      faqRect: faq ? faq.getBoundingClientRect() : null,
      mediaRect: media ? media.getBoundingClientRect() : null,
      imgRect: img ? img.getBoundingClientRect() : null,
      imgSrc: img ? img.currentSrc : null,
      imgDisplay: img ? window.getComputedStyle(img).display : null,
      videoDisplay: video ? window.getComputedStyle(video).display : null,
    };
  });
  console.log('FAQ info on desktop:', JSON.stringify(info, null, 2));

  await browser.close();
}
testFaqDesktop().catch(console.error);
