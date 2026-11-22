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
  await page.goto('http://127.0.0.1:5173/index.html#founder', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss loader
  await page.evaluate(() => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Find all elements located around x: 1000-1440, y: 500-900 (bottom right)
  const elementsAtBottomRight = await page.evaluate(() => {
    const results = [];
    const points = [
      { x: 1200, y: 750 },
      { x: 1300, y: 800 },
      { x: 1100, y: 850 },
      { x: 1000, y: 700 }
    ];
    for (const pt of points) {
      const el = document.elementFromPoint(pt.x, pt.y);
      if (el) {
        results.push({
          pt,
          tag: el.tagName,
          id: el.id,
          className: el.className,
          rect: el.getBoundingClientRect(),
          src: el.src || (el.querySelector('img, video, canvas')?.src) || null
        });
      }
    }
    return results;
  });

  console.log('Elements at bottom right at index.html#founder:', JSON.stringify(elementsAtBottomRight, null, 2));

  await page.screenshot({ path: 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff\\test_initial_hash_founder.png' });

  await browser.close();
})();
