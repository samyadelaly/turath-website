import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

const scrollStats = await page.evaluate(() => {
  const docHeight = document.documentElement.scrollHeight;
  const vh = window.innerHeight;
  const maxScroll = docHeight - vh;
  const s3 = document.getElementById('scene-03');
  const bespoke = document.getElementById('bespoke');
  const founder = document.getElementById('scene-07');
  const faq = document.getElementById('faq');
  const contact = document.getElementById('contact');

  return {
    docHeight,
    maxScroll,
    scene03Top: s3 ? s3.offsetTop : null,
    bespokeTop: bespoke ? bespoke.offsetTop : null,
    founderTop: founder ? founder.offsetTop : null,
    faqTop: faq ? faq.offsetTop : null,
    contactTop: contact ? contact.offsetTop : null,
  };
});

console.log('Scroll stats:', scrollStats);
console.log('Percentage of 3456 in maxScroll:', (3456 / scrollStats.maxScroll) * 100 + '%');
console.log('Percentage of 3800 in maxScroll:', (3800 / scrollStats.maxScroll) * 100 + '%');

await browser.close();
