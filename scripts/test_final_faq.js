import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

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

const tests = [
  { url: 'http://127.0.0.1:5173/ar.html', width: 1920, height: 1080, name: 'ar_1920' },
  { url: 'http://127.0.0.1:5173/ar.html', width: 1366, height: 768,  name: 'ar_1366' },
  { url: 'http://127.0.0.1:5173/index.html', width: 1920, height: 1080, name: 'en_1920' },
  { url: 'http://127.0.0.1:5173/index.html', width: 1366, height: 768,  name: 'en_1366' },
];

for (const t of tests) {
  console.log(`Running test for ${t.name} (${t.width}x${t.height})...`);
  await page.setViewport({ width: t.width, height: t.height });
  await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const faq = document.getElementById('faq');
    if (faq) faq.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: `final_${t.name}_faq.png` });
  console.log(`Saved final_${t.name}_faq.png`);
}

await browser.close();
console.log('All tests completed successfully!');
