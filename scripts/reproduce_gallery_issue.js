import puppeteer from 'puppeteer-core';

async function testGallery() {
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

  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Click nav link for gallery / collections
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="gallery"]') || document.querySelector('a[href*="scene-03"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  // Get bounding rects of sections
  const rects = await page.evaluate(() => {
    const sections = ['#scene-03', '#scene-04', '#scene-05', '#scene-06', '#scene-07', '#faq', '#contact'];
    return sections.map(id => {
      const el = document.querySelector(id);
      if (!el) return { id, exists: false };
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return { 
        id, 
        top: Math.round(r.top), 
        bottom: Math.round(r.bottom), 
        height: Math.round(r.height), 
        zIndex: style.zIndex, 
        position: style.position, 
        clipPath: style.clipPath 
      };
    });
  });
  console.log('Section rects when at gallery:', JSON.stringify(rects, null, 2));

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/test_gallery_issue.png' });
  await browser.close();
  console.log('Screenshot saved.');
}
testGallery().catch(console.error);
