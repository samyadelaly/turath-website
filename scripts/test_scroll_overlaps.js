import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function testScrollPositions() {
  const tmpDir = path.join(os.tmpdir(), `edge_pup_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', `--user-data-dir=${tmpDir}`]
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
  await new Promise(r => setTimeout(r, 2000));

  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('Total document height:', totalHeight);

  // Check contact rect at different scroll positions
  const overlaps = [];
  for (let y = 0; y < totalHeight; y += 400) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await new Promise(r => setTimeout(r, 100));

    const data = await page.evaluate(() => {
      const contact = document.getElementById('contact');
      const s3 = document.getElementById('scene-03');
      const bespoke = document.getElementById('bespoke');
      const s5 = document.getElementById('scene-05');
      const s6 = document.getElementById('scene-06');
      const s7 = document.getElementById('scene-07');
      const faq = document.getElementById('faq');

      const cRect = contact ? contact.getBoundingClientRect() : null;
      const s3Rect = s3 ? s3.getBoundingClientRect() : null;

      // Check if contact is visible in viewport
      const isContactInViewport = cRect && (cRect.top < window.innerHeight && cRect.bottom > 0);
      const isS3InViewport = s3Rect && (s3Rect.top < window.innerHeight && s3Rect.bottom > 0);

      return {
        scrollY: window.scrollY,
        isContactInViewport,
        isS3InViewport,
        contactTop: cRect ? cRect.top : 0,
        s3Top: s3Rect ? s3Rect.top : 0,
        contactStyles: contact ? {
          position: window.getComputedStyle(contact).position,
          top: window.getComputedStyle(contact).top,
          transform: window.getComputedStyle(contact).transform
        } : null
      };
    });

    if (data.isContactInViewport && data.isS3InViewport) {
      overlaps.push(data);
      console.log(`OVERLAP DETECTED at scrollY = ${y}:`, data);
      await page.screenshot({ path: `C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/overlap_at_${y}.png` });
    }
  }

  console.log(`Scan complete. Found ${overlaps.length} overlap points.`);
  await browser.close();
}
testScrollPositions().catch(console.error);
