const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent('<div id="test" style="width: 300px; height: 300px; background: red;"></div>');

  const result = await page.evaluate(() => {
    const el = document.getElementById('test');
    el.style.clipPath = 'polygon(0% 100%, 0% 66vh, 33% 66vh, 33% 33vh, 66% 33vh, 66% 0vh, 100% 0vh, 100% 100%)';
    const computed = window.getComputedStyle(el).clipPath;

    // Test GSAP interpolation
    return {
      cssSupports: CSS.supports('clip-path', 'polygon(0% 100%, 0% 66vh, 33% 66vh, 33% 33vh, 66% 33vh, 66% 0vh, 100% 0vh, 100% 100%)'),
      computed
    };
  });
  console.log('Result for vh in clip-path:', result);
  await browser.close();
})();
