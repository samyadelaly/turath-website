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

  await page.evaluate(() => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Find scroll positions where Founder is active and FAQ starts ascending
  const positions = await page.evaluate(() => {
    const s7 = document.getElementById('scene-07');
    const faq = document.getElementById('faq');
    return {
      s7OffsetTop: s7 ? s7.offsetTop : null,
      faqOffsetTop: faq ? faq.offsetTop : null
    };
  });
  console.log('Offsets:', positions);

  // Let's capture screenshots from s7OffsetTop to faqOffsetTop in steps of 300px
  const startY = positions.s7OffsetTop;
  const endY = positions.faqOffsetTop;
  let idx = 0;
  for (let y = startY; y <= endY + 900; y += 400) {
    await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await new Promise(r => setTimeout(r, 600));

    const state = await page.evaluate(() => {
      const faq = document.getElementById('faq');
      const faqRect = faq.getBoundingClientRect();
      const s7 = document.getElementById('scene-07');
      const s7Rect = s7.getBoundingClientRect();
      const style = window.getComputedStyle(faq);
      return {
        scrollY: window.scrollY,
        faqTop: faqRect.top,
        faqClip: style.clipPath,
        s7Top: s7Rect.top
      };
    });
    console.log(`Step ${idx} (scrollY=${y}):`, state);

    await page.screenshot({
      path: `C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff\\faq_step_${idx}_${y}.png`
    });
    idx++;
  }

  await browser.close();
})();
