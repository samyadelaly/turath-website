import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

// Capture console messages and network errors
const failedRequests = [];
page.on('requestfailed', req => {
  failedRequests.push({ url: req.url(), failure: req.failure() });
});

page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

console.log('Navigating to http://127.0.0.1:5173/ar.html#faq ...');
try {
  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'load', timeout: 15000 });
} catch(e) {
  console.log('Navigation notice:', e.message);
}
await new Promise(r => setTimeout(r, 2000));

const faqDebug = await page.evaluate(() => {
  const faq = document.getElementById('faq');
  const media = document.getElementById('faq-bg-media');
  const canvas = document.getElementById('faq-scroll-canvas');
  const picture = media ? media.querySelector('picture') : null;
  const img = media ? media.querySelector('img') : null;
  const source = media ? media.querySelector('source') : null;
  const overlay = media ? media.querySelector('.faq-bg-overlay') : null;

  return {
    windowWidth: window.innerWidth,
    mediaStyles: media ? {
      display: window.getComputedStyle(media).display,
      position: window.getComputedStyle(media).position,
      top: window.getComputedStyle(media).top,
      width: window.getComputedStyle(media).width,
      height: window.getComputedStyle(media).height,
      opacity: window.getComputedStyle(media).opacity,
      visibility: window.getComputedStyle(media).visibility,
      transform: window.getComputedStyle(media).transform,
      zIndex: window.getComputedStyle(media).zIndex
    } : null,
    canvasStyles: canvas ? {
      display: window.getComputedStyle(canvas).display,
      visibility: window.getComputedStyle(canvas).visibility
    } : null,
    pictureStyles: picture ? {
      display: window.getComputedStyle(picture).display,
      visibility: window.getComputedStyle(picture).visibility,
      width: window.getComputedStyle(picture).width,
      height: window.getComputedStyle(picture).height
    } : null,
    imgStyles: img ? {
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      display: window.getComputedStyle(img).display,
      visibility: window.getComputedStyle(img).visibility,
      opacity: window.getComputedStyle(img).opacity,
      width: window.getComputedStyle(img).width,
      height: window.getComputedStyle(img).height
    } : null,
    sourceStyles: source ? {
      srcset: source.getAttribute('srcset'),
      media: source.getAttribute('media')
    } : null,
    overlayStyles: overlay ? {
      display: window.getComputedStyle(overlay).display,
      bg: window.getComputedStyle(overlay).backgroundColor
    } : null,
    faqStyles: faq ? {
      bg: window.getComputedStyle(faq).backgroundColor,
      zIndex: window.getComputedStyle(faq).zIndex
    } : null
  };
});

console.log('FAQ Debug Info:', JSON.stringify(faqDebug, null, 2));
console.log('Failed Requests:', failedRequests);

await page.screenshot({ path: 'debug_ar_faq_screen.png' });
await browser.close();
