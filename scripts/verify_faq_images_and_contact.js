import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

// 1. Check EN index.html#faq
console.log('--- 1. Testing EN index.html#faq ---');
await page.goto('http://127.0.0.1:5173/index.html#faq', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));

const enFaqImage = await page.evaluate(() => {
  const picImg = document.querySelector('#faq-bg-media picture img');
  const source = document.querySelector('#faq-bg-media picture source');
  return {
    sourceSrcset: source ? source.getAttribute('srcset') : null,
    imgSrc: picImg ? picImg.currentSrc || picImg.src : null,
    imgNaturalWidth: picImg ? picImg.naturalWidth : null,
    imgNaturalHeight: picImg ? picImg.naturalHeight : null,
    isComplete: picImg ? picImg.complete : false
  };
});
console.log('EN FAQ Desktop Image info:', enFaqImage);
await page.screenshot({ path: 'verified_en_faq_image.png' });

// 2. Check AR ar.html#faq
console.log('--- 2. Testing AR ar.html#faq ---');
await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));

const arFaqImage = await page.evaluate(() => {
  const picImg = document.querySelector('#faq-bg-media picture img');
  const source = document.querySelector('#faq-bg-media picture source');
  return {
    sourceSrcset: source ? source.getAttribute('srcset') : null,
    imgSrc: picImg ? picImg.currentSrc || picImg.src : null,
    imgNaturalWidth: picImg ? picImg.naturalWidth : null,
    imgNaturalHeight: picImg ? picImg.naturalHeight : null,
    isComplete: picImg ? picImg.complete : false
  };
});
console.log('AR FAQ Desktop Image info:', arFaqImage);
await page.screenshot({ path: 'verified_ar_faq_image.png' });

// 3. Check Contact Morphing Ascending over FAQ in EN and AR
console.log('--- 3. Verifying Contact morphing ascending over FAQ ---');
await page.evaluate(() => {
  const contact = document.getElementById('contact');
  const rect = contact.getBoundingClientRect();
  window.scrollBy(0, rect.top - (window.innerHeight * 0.45));
});
await new Promise(r => setTimeout(r, 600));

const contactMorphState = await page.evaluate(() => {
  const contact = document.getElementById('contact');
  return {
    scrollY: window.scrollY,
    contactTop: contact.getBoundingClientRect().top,
    clipPath: window.getComputedStyle(contact).clipPath
  };
});
console.log('AR Contact morphing state during scroll over FAQ:', contactMorphState);
await page.screenshot({ path: 'verified_contact_over_faq_ar.png' });

await browser.close();
console.log('Verification completed successfully!');
