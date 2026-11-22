import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function testGallery() {
  const tmpDir = path.join(os.tmpdir(), `edge_pup_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--user-data-dir=${tmpDir}`
    ]
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
  await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/test_gallery_current.png' });
  console.log('Screenshot saved.');

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
        top: window.getComputedStyle(contact).top
      } : null,
      faq: faq ? faq.getBoundingClientRect() : null
    };
  });
  console.log('Positions:', JSON.stringify(positions, null, 2));

  await browser.close();
}
testGallery().catch(console.error);
