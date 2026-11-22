import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function captureFaqMobile() {
  const tmpDir = path.join(os.tmpdir(), `edge_pup_faq_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', `--user-data-dir=${tmpDir}`]
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('facebook.net') || url.includes('google-analytics') || url.includes('googletagmanager')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const faq = document.getElementById('faq');
    if (faq) {
      faq.scrollIntoView({ behavior: 'instant' });
      window.scrollBy(0, 300);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_mobile_view.png' });
  await browser.close();
  console.log('Saved verified_faq_mobile_view.png');
}

captureFaqMobile().catch(console.error);
