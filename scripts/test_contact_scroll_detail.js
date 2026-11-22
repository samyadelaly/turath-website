import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

// Scroll to the end of FAQ where Contact begins
const contactPos = await page.evaluate(() => {
  const contact = document.getElementById('contact');
  return {
    top: contact.offsetTop,
    height: contact.offsetHeight
  };
});
console.log('Contact pos:', contactPos);

// Take screenshots around contact transition:
// 1. 1000px before contact docks (top of contact at bottom of viewport: y = contactPos.top - 1080)
// 2. 750px before
// 3. 500px before
// 4. 250px before
// 5. 0px (contact docked at top: y = contactPos.top)

const yStarts = [
  contactPos.top - 1080,
  contactPos.top - 750,
  contactPos.top - 500,
  contactPos.top - 250,
  contactPos.top
];

for (let i = 0; i < yStarts.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), yStarts[i]);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `test_contact_transition_${i}.png` });
  console.log(`Captured test_contact_transition_${i}.png at y=${yStarts[i]}`);
}

await browser.close();
