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
  await page.goto('http://127.0.0.1:5173/assets/images/faq-bg-desktop.jpg');

  // Let's sample 10 points across the image horizontally at Y = 50%
  const samples = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const out = [];
    for (let i = 0; i <= 10; i++) {
      const x = Math.floor(canvas.width * (i / 10));
      const y = Math.floor(canvas.height * 0.5);
      const p = ctx.getImageData(x, y, 1, 1).data;
      out.push({ xPercent: i * 10, r: p[0], g: p[1], b: p[2] });
    }
    return out;
  });
  console.log('Horizontal brightness samples:', samples);
  await browser.close();
})();
