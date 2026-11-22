import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

const result = await page.evaluate(() => {
  const target = document.getElementById('scene-03');
  const allMatching = ScrollTrigger.getAll().filter(t => {
    if (!t.trigger) return false;
    const triggerEl = typeof t.trigger === 'string' ? document.querySelector(t.trigger) : t.trigger;
    return triggerEl === target || (t.pin && triggerEl && triggerEl.contains && triggerEl.contains(target));
  });

  return allMatching.map(t => ({
    vars: {
      start: t.vars.start,
      end: t.vars.end,
      pin: !!t.pin,
      pinSpacing: t.vars.pinSpacing
    },
    start: t.start,
    end: t.end
  }));
});

console.log('ScrollTriggers matching #scene-03:', result);

await browser.close();
