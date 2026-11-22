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

console.log('Navigating to http://127.0.0.1:5173/ar.html ...');
await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));

await page.evaluate(() => {
  const contact = document.getElementById('contact');
  if (contact) contact.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 1000));

const variants = [
  { name: 'current', style: '' },
  { name: 'center_center', style: 'object-position: center center !important; transform: none !important;' },
  { name: 'right_center', style: 'object-position: right center !important; transform: none !important;' },
  { name: 'right_45', style: 'object-position: right 45% !important; transform: none !important;' },
  { name: 'right_35', style: 'object-position: right 35% !important; transform: none !important;' },
  { name: 'center_35', style: 'object-position: center 35% !important; transform: none !important;' }
];

for (const v of variants) {
  if (v.style) {
    await page.evaluate((css) => {
      const img = document.querySelector('#contact-bg-media img');
      if (img) img.style.cssText = css;
    }, v.style);
  }
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `contact_bg_test_${v.name}.png` });
  console.log(`Captured contact_bg_test_${v.name}.png`);
}

await browser.close();
console.log('Done testing contact bg variants');
