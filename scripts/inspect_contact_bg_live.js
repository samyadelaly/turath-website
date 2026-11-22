import puppeteer from 'puppeteer-core';

async function inspectContactBg() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.goto('http://127.0.0.1:5173/ar.html#contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const media = document.getElementById('contact-bg-media');
    const pic = media ? media.querySelector('picture') : null;
    const img = media ? media.querySelector('img') : null;
    const source = media ? media.querySelector('source') : null;
    return {
      mediaExists: !!media,
      mediaComputed: media ? {
        display: window.getComputedStyle(media).display,
        visibility: window.getComputedStyle(media).visibility,
        opacity: window.getComputedStyle(media).opacity,
        clipPath: window.getComputedStyle(media).clipPath,
        zIndex: window.getComputedStyle(media).zIndex,
        width: media.offsetWidth,
        height: media.offsetHeight
      } : null,
      sourceSrcset: source ? source.srcset : null,
      sourceMedia: source ? source.media : null,
      imgSrc: img ? img.src : null,
      imgCurrentSrc: img ? img.currentSrc : null,
      imgNaturalWidth: img ? img.naturalWidth : null,
      imgNaturalHeight: img ? img.naturalHeight : null,
      contactClipPath: window.getComputedStyle(document.getElementById('contact')).clipPath
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}
inspectContactBg().catch(console.error);
