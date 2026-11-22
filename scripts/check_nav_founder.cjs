const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  // Dismiss loader
  await page.evaluate(() => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click #founder link in navbar
  console.log('Clicking FOUNDER nav link...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const founderLink = links.find(a => a.getAttribute('href') === '#founder' || a.textContent.includes('FOUNDER'));
    if (founderLink) founderLink.click();
    else window.location.hash = '#founder';
  });

  await new Promise(r => setTimeout(r, 3000));

  const info = await page.evaluate(() => {
    const faq = document.getElementById('faq');
    const s7 = document.getElementById('scene-07');
    const faqRect = faq ? faq.getBoundingClientRect() : null;
    const s7Rect = s7 ? s7.getBoundingClientRect() : null;
    return {
      windowHeight: window.innerHeight,
      scrollY: window.scrollY,
      hash: window.location.hash,
      s7Rect: s7Rect ? { top: s7Rect.top, bottom: s7Rect.bottom, height: s7Rect.height } : null,
      faqRect: faqRect ? { top: faqRect.top, bottom: faqRect.bottom, height: faqRect.height } : null,
      faqComputed: faq ? {
        clipPath: window.getComputedStyle(faq).clipPath,
        transform: window.getComputedStyle(faq).transform,
        zIndex: window.getComputedStyle(faq).zIndex,
        visibility: window.getComputedStyle(faq).visibility,
        opacity: window.getComputedStyle(faq).opacity
      } : null
    };
  });

  console.log('Result at #founder:', JSON.stringify(info, null, 2));

  await page.screenshot({ path: 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff\\actual_founder_click.png' });

  await browser.close();
})();
