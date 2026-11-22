import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Match standard desktop 1920x1080 (or 1440x900)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://127.0.0.1:5173/#founder', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 1000));

  // Let's scroll in steps of 200px from scrollY = 8000 to 11000 and check when the FAQ image shows up!
  const results = [];
  for (let y = 8000; y <= 11000; y += 200) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await new Promise(r => setTimeout(r, 150));
    const step = await page.evaluate(() => {
      const s07 = document.querySelector('#scene-07');
      const faq = document.querySelector('#faq');
      const s07R = s07 ? s07.getBoundingClientRect() : null;
      const faqR = faq ? faq.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        s07Top: s07R ? s07R.top : null,
        faqTop: faqR ? faqR.top : null,
        faqClip: faq ? window.getComputedStyle(faq).clipPath : null
      };
    });
    results.push(step);
    if (step.faqTop < 1080 && step.faqTop > -500) {
      await page.screenshot({ path: `C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/step_${y}.png` });
    }
  }
  console.log('Scroll steps summary:', JSON.stringify(results, null, 2));
  await browser.close();
})();
