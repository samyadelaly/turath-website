import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function testContact() {
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
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('facebook.net') || url.includes('google-analytics') || url.includes('googletagmanager')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto('http://127.0.0.1:5173/ar.html#contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/contact_ar_1920.png' });

  await page.goto('http://127.0.0.1:5173/index.html#contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/contact_en_1920.png' });

  await browser.close();
  console.log('Saved contact screenshots!');
}
testContact().catch(console.error);
