import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

console.log('Testing index.html...');
try {
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch (e) {
  console.log('goto note:', e.message);
}
await new Promise(r => setTimeout(r, 2000));

const enImg = await page.evaluate(() => {
  const picImg = document.querySelector('#faq-bg-media picture img');
  const source = document.querySelector('#faq-bg-media picture source');
  return {
    sourceSrcset: source ? source.getAttribute('srcset') : null,
    imgSrc: picImg ? picImg.currentSrc || picImg.src : null,
    isComplete: picImg ? picImg.complete : false
  };
});
console.log('EN image check:', enImg);

console.log('Testing ar.html...');
try {
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch (e) {
  console.log('goto note:', e.message);
}
await new Promise(r => setTimeout(r, 2000));

const arImg = await page.evaluate(() => {
  const picImg = document.querySelector('#faq-bg-media picture img');
  const source = document.querySelector('#faq-bg-media picture source');
  return {
    sourceSrcset: source ? source.getAttribute('srcset') : null,
    imgSrc: picImg ? picImg.currentSrc || picImg.src : null,
    isComplete: picImg ? picImg.complete : false
  };
});
console.log('AR image check:', arImg);

await browser.close();
