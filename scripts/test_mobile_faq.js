import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

// Block tracking
await page.setRequestInterception(true);
page.on('request', req => {
  const url = req.url();
  if (url.includes('facebook.net') || url.includes('google-analytics') || url.includes('googletagmanager')) {
    req.abort();
  } else {
    req.continue();
  }
});

console.log('Testing Mobile Arabic FAQ...');
await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

await page.evaluate(() => {
  const faq = document.getElementById('faq');
  if (faq) faq.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 1500));

await page.screenshot({ path: 'final_ar_mobile_faq.png' });
console.log('Saved final_ar_mobile_faq.png');

console.log('Testing Mobile English FAQ...');
await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

await page.evaluate(() => {
  const faq = document.getElementById('faq');
  if (faq) faq.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 1500));

await page.screenshot({ path: 'final_en_mobile_faq.png' });
console.log('Saved final_en_mobile_faq.png');

await browser.close();
console.log('Mobile tests done!');
