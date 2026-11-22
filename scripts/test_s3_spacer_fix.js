import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

// Test before fix: scroll to 3800 (the exact scroll position from Screenshot 1)
await page.evaluate(() => window.scrollTo(0, 3800));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'test_before_fix_3800.png' });

const before3800 = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const b = document.getElementById('bespoke');
  const form = document.getElementById('bespoke-form');
  return {
    scrollY: window.scrollY,
    s3Top: s3.getBoundingClientRect().top,
    bespokeTop: b.getBoundingClientRect().top,
    formTop: form ? form.getBoundingClientRect().top : null
  };
});
console.log('Before fix at scrollY 3800:', before3800);

// Now apply spacer fix in DOM
await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const spacer = document.createElement('div');
  spacer.id = 'scene-03-spacer';
  spacer.className = 'w-full h-[100vh] pointer-events-none';
  s3.parentNode.insertBefore(spacer, s3.nextSibling);

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
await new Promise(r => setTimeout(r, 500));

// Check at landing scrollY (which is st.start of scene-03)
const afterLanding = await page.evaluate(() => {
  const triggers = ScrollTrigger.getAll().filter(t => t.trigger === document.getElementById('scene-03'));
  const st = triggers.find(t => t.pin);
  window.scrollTo(0, st.start);
  return {
    start: st.start,
    end: st.end,
    bespokeTop: document.getElementById('bespoke').getBoundingClientRect().top
  };
});
console.log('After spacer - landing state:', afterLanding);

// Now scroll by 344px (landing + 344 = exactly what was scrollY 3800)
await page.evaluate((landingY) => window.scrollTo(0, landingY + 344), afterLanding.start);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'test_after_fix_scrolled.png' });

const afterScrolled = await page.evaluate(() => {
  const s3 = document.getElementById('scene-03');
  const b = document.getElementById('bespoke');
  return {
    scrollY: window.scrollY,
    s3Top: s3.getBoundingClientRect().top,
    bespokeTop: b.getBoundingClientRect().top
  };
});
console.log('After spacer - scrolled state:', afterScrolled);

await browser.close();
