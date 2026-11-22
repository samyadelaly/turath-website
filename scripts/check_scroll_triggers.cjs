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

  const info = await page.evaluate(() => {
    const s7 = document.getElementById('scene-07');
    const faq = document.getElementById('faq');
    const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(t => ({
      triggerId: t.trigger ? t.trigger.id : null,
      pin: !!t.pin,
      start: t.start,
      end: t.end,
      varsStart: t.vars ? t.vars.start : null,
      varsEnd: t.vars ? t.vars.end : null
    })) : [];

    return {
      windowHeight: window.innerHeight,
      s7OffsetTop: s7 ? s7.offsetTop : null,
      s7Height: s7 ? s7.offsetHeight : null,
      faqOffsetTop: faq ? faq.offsetTop : null,
      faqHeight: faq ? faq.offsetHeight : null,
      faqMarginTop: faq ? window.getComputedStyle(faq).marginTop : null,
      triggers: triggers.filter(t => t.triggerId === 'scene-07' || t.triggerId === 'faq')
    };
  });

  console.log('ScrollTrigger & Layout Info:', JSON.stringify(info, null, 2));
  await browser.close();
})();
