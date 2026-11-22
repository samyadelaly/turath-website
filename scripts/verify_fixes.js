import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

console.log('--- 1. Testing ar.html#gallery ---');
await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));

const landingY = await page.evaluate(() => window.scrollY);
console.log('Landing scrollY at #gallery:', landingY);

const landingStatus = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const bespoke = document.getElementById('bespoke');
  const cards = document.querySelectorAll('.collection-card');
  return {
    scrollY: window.scrollY,
    s3Top: s3.getBoundingClientRect().top,
    bespokeTop: bespoke.getBoundingClientRect().top,
    card0Rect: cards[0] ? cards[0].getBoundingClientRect() : null
  };
});
console.log('Landing state:', landingStatus);
await page.screenshot({ path: 'verified_gallery_landing.png' });

// Test at scrollY = 3800 (the exact scroll position from Screenshot 1)
console.log('Scrolling to scrollY = 3800...');
await page.evaluate(() => window.scrollTo(0, 3800));
await new Promise(r => setTimeout(r, 800));

const scroll3800Status = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const bespoke = document.getElementById('bespoke');
  const form = document.getElementById('bespoke-form');
  const cards = document.querySelectorAll('.collection-card');
  const c0 = cards[0] ? cards[0].getBoundingClientRect() : null;
  const b = bespoke.getBoundingClientRect();
  return {
    scrollY: window.scrollY,
    s3Top: s3.getBoundingClientRect().top,
    bespokeTop: b.top,
    card0Bottom: c0 ? c0.bottom : null,
    isColliding: b.top < (c0 ? c0.bottom : 0)
  };
});
console.log('Status at scrollY = 3800:', scroll3800Status);
await page.screenshot({ path: 'verified_gallery_3800.png' });

// Test at scrollY = 4200
console.log('Scrolling to scrollY = 4200...');
await page.evaluate(() => window.scrollTo(0, 4200));
await new Promise(r => setTimeout(r, 800));

const scroll4200Status = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const bespoke = document.getElementById('bespoke');
  const cards = document.querySelectorAll('.collection-card');
  const c0 = cards[0] ? cards[0].getBoundingClientRect() : null;
  const b = bespoke.getBoundingClientRect();
  return {
    scrollY: window.scrollY,
    s3Top: s3.getBoundingClientRect().top,
    bespokeTop: b.top,
    card0Bottom: c0 ? c0.bottom : null,
    isColliding: b.top < (c0 ? c0.bottom : 0)
  };
});
console.log('Status at scrollY = 4200:', scroll4200Status);
await page.screenshot({ path: 'verified_gallery_4200.png' });

console.log('--- 2. Testing ar.html#faq ---');
await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));

// Scroll down to closing statement in FAQ
await page.evaluate(() => {
  const closing = document.querySelector('.faq-closing-statement');
  if (closing) {
    closing.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
});
await new Promise(r => setTimeout(r, 800));

const faqClosingStatus = await page.evaluate(() => {
  const closing = document.querySelector('.faq-closing-statement');
  const contact = document.querySelector('#contact');
  const cRect = closing.getBoundingClientRect();
  const cntRect = contact.getBoundingClientRect();
  return {
    scrollY: window.scrollY,
    closingTop: cRect.top,
    closingBottom: cRect.bottom,
    contactTop: cntRect.top,
    isDomeColliding: cntRect.top < cRect.bottom
  };
});
console.log('FAQ closing statement status:', faqClosingStatus);
await page.screenshot({ path: 'verified_faq_closing.png' });

// Test Mobile Viewport (390x844)
console.log('--- 3. Testing Mobile Viewport (390x844) ---');
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'verified_mobile_gallery.png' });

await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));
await page.evaluate(() => {
  const closing = document.querySelector('.faq-closing-statement');
  if (closing) closing.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'verified_mobile_faq.png' });

await browser.close();
console.log('Testing completed successfully!');
