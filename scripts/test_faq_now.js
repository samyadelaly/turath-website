import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

console.log('Navigating to http://127.0.0.1:5173/ar.html ...');
await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log('DOM Content Loaded. Waiting 4s for scripts...');
await new Promise(r => setTimeout(r, 4000));

// Scroll to FAQ
await page.evaluate(() => {
  const faq = document.getElementById('faq');
  if (faq) faq.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 2000));

const arDebug = await page.evaluate(() => {
  const media = document.getElementById('faq-bg-media');
  const img = media ? media.querySelector('img') : null;
  return {
    src: img?.src,
    naturalWidth: img?.naturalWidth,
    naturalHeight: img?.naturalHeight,
    complete: img?.complete,
    width: img?.clientWidth,
    height: img?.clientHeight
  };
});
console.log('Arabic FAQ Image status:', arDebug);
await page.screenshot({ path: 'test_ar_faq_now.png' });

// Check English
console.log('Navigating to http://127.0.0.1:5173/index.html ...');
await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));

await page.evaluate(() => {
  const faq = document.getElementById('faq');
  if (faq) faq.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 2000));

const enDebug = await page.evaluate(() => {
  const media = document.getElementById('faq-bg-media');
  const img = media ? media.querySelector('img') : null;
  return {
    src: img?.src,
    naturalWidth: img?.naturalWidth,
    naturalHeight: img?.naturalHeight,
    complete: img?.complete,
    width: img?.clientWidth,
    height: img?.clientHeight
  };
});
console.log('English FAQ Image status:', enDebug);
await page.screenshot({ path: 'test_en_faq_now.png' });

await browser.close();
console.log('Finished successfully!');
