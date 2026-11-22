import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

// Scroll to the closing statement of FAQ
await page.evaluate(() => {
  const closing = document.querySelector('.faq-closing-statement');
  if (closing) {
    closing.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
});
await new Promise(r => setTimeout(r, 500));

await page.screenshot({ path: 'test_current_faq_closing.png' });

const currentCollision = await page.evaluate(() => {
  const closing = document.querySelector('.faq-closing-statement');
  const contact = document.querySelector('#contact');
  const cRect = closing.getBoundingClientRect();
  const cntRect = contact.getBoundingClientRect();
  return {
    closing: { top: cRect.top, bottom: cRect.bottom },
    contact: { top: cntRect.top, bottom: cntRect.bottom },
    isColliding: cntRect.top < cRect.bottom
  };
});
console.log('Current collision state at closing statement:', currentCollision);

// Now apply the fix in DOM: add pb-[80vh] to faq-scroll-list and refresh ScrollTrigger
await page.evaluate(() => {
  const list = document.querySelector('.faq-scroll-list');
  if (list) {
    list.classList.remove('pb-32');
    list.classList.add('pb-[85vh]');
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  
  const closing = document.querySelector('.faq-closing-statement');
  if (closing) {
    closing.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
});
await new Promise(r => setTimeout(r, 500));

await page.screenshot({ path: 'test_fixed_faq_closing.png' });

const fixedCollision = await page.evaluate(() => {
  const closing = document.querySelector('.faq-closing-statement');
  const contact = document.querySelector('#contact');
  const cRect = closing.getBoundingClientRect();
  const cntRect = contact.getBoundingClientRect();
  return {
    closing: { top: cRect.top, bottom: cRect.bottom },
    contact: { top: cntRect.top, bottom: cntRect.bottom },
    isColliding: cntRect.top < cRect.bottom
  };
});
console.log('Fixed collision state at closing statement:', fixedCollision);

await browser.close();
