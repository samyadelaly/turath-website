import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));

// Get the bounds and scroll position of #faq
const faqBounds = await page.evaluate(() => {
  const faq = document.getElementById('faq');
  const rect = faq.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    height: rect.height,
    offsetTop: faq.offsetTop
  };
});
console.log('FAQ bounds:', faqBounds);

// Let's scroll to:
// 1. Just as FAQ enters (top of faq at bottom of viewport)
// 2. FAQ reaches top of viewport
// 3. Middle of FAQ questions
// 4. End of FAQ questions (before contact)
// 5. Contact morphing onto FAQ

const scrollPositions = [
  faqBounds.top - 1080,        // FAQ entering
  faqBounds.top - 540,         // FAQ half-way in morph
  faqBounds.top,               // FAQ at top of screen
  faqBounds.top + 500,         // Scrolled into questions
  faqBounds.top + 1500,        // Scrolled deeper
  faqBounds.top + faqBounds.height - 1080 // End of FAQ
];

for (let i = 0; i < scrollPositions.length; i++) {
  const y = scrollPositions[i];
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `scroll_ar_faq_${i}.png` });
  console.log(`Captured scroll_ar_faq_${i}.png at y=${y}`);
}

await browser.close();
console.log('Done scroll captures!');
