import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));

  const triggers = await page.evaluate(() => {
    return ScrollTrigger.getAll().map(t => ({
      trigger: t.trigger ? (t.trigger.id || t.trigger.className) : null,
      start: t.start,
      end: t.end,
      pin: !!t.pin,
      pinSpacing: t.pinSpacing
    }));
  });
  console.log('ScrollTriggers:', JSON.stringify(triggers, null, 2));

  await browser.close();
})();
