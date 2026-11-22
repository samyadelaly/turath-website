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
  await page.goto('file:///C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/faq_step_20_8000.png');

  const check = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const out = [];
    // Check points at Y = 800 (bottom area)
    for (let x = 100; x < 1440; x += 150) {
      const p = ctx.getImageData(x, 800, 1, 1).data;
      out.push({ x, r: p[0], g: p[1], b: p[2] });
    }
    return out;
  });
  console.log('Pixels at Y=800 in faq_step_20_8000.png:', check);
  await browser.close();
})();
