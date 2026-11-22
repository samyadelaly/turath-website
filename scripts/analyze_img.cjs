const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5173/assets/images/faq-bg-desktop.jpg');
  const info = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Sample points at left (10%), center (50%), right (80%)
    const sample = (xRatio, yRatio) => {
      const pixel = ctx.getImageData(Math.floor(canvas.width * xRatio), Math.floor(canvas.height * yRatio), 1, 1).data;
      return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    };

    return {
      width: canvas.width,
      height: canvas.height,
      left_top: sample(0.1, 0.2),
      left_mid: sample(0.1, 0.5),
      left_bot: sample(0.1, 0.8),
      center_mid: sample(0.5, 0.5),
      right_mid: sample(0.8, 0.5),
      right_bot: sample(0.8, 0.8)
    };
  });
  console.log('Image pixel analysis:', info);
  await browser.close();
})();
