import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.setRequestInterception(true);
page.on('request', req => {
  const url = req.url();
  if (url.includes('facebook.net') || url.includes('google-analytics') || url.includes('googletagmanager')) {
    req.abort();
  } else {
    req.continue();
  }
});

console.log('Navigating...');
await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log('Loaded, waiting 3s...');
await new Promise(r => setTimeout(r, 3000));

await page.evaluate(() => {
  const contact = document.getElementById('contact');
  if (contact) contact.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 1000));

const tests = [
  {
    name: 'art_on_left_50vw',
    code: () => {
      const media = document.getElementById('contact-bg-media');
      const img = media ? media.querySelector('img') : null;
      if (media) {
        media.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 0; background-color: #12100e;';
      }
      if (img) {
        img.style.cssText = 'position: absolute; left: 0; top: 0; height: 100%; width: auto; max-width: 55vw; object-fit: contain; object-position: left center; transform: none !important;';
      }
    }
  },
  {
    name: 'art_on_left_crop_nice',
    code: () => {
      const media = document.getElementById('contact-bg-media');
      const img = media ? media.querySelector('img') : null;
      if (media) {
        media.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 0; background-color: #12100e;';
      }
      if (img) {
        img.style.cssText = 'position: absolute; left: 0; top: 0; height: 100%; width: 45vw; object-fit: cover; object-position: right center; transform: none !important;';
      }
    }
  },
  {
    name: 'art_cover_anchored_left',
    code: () => {
      const media = document.getElementById('contact-bg-media');
      const img = media ? media.querySelector('img') : null;
      if (media) {
        media.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 0; background-color: #12100e;';
      }
      if (img) {
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; object-position: 85% center; transform: scaleX(-1) !important;';
      }
    }
  }
];

for (const t of tests) {
  await page.evaluate(t.code);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `contact_style_${t.name}.png` });
  console.log(`Saved contact_style_${t.name}.png`);
}

await browser.close();
console.log('All contact art tests done!');
