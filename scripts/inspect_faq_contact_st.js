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

const info = await page.evaluate(() => {
  const faq = document.getElementById('faq');
  const contact = document.getElementById('contact');
  const faqRect = faq.getBoundingClientRect();
  const contactRect = contact.getBoundingClientRect();
  const scrollY = window.scrollY;

  const stList = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getAll().map(st => ({
    trigger: st.trigger?.id || st.trigger?.tagName,
    start: st.start,
    end: st.end,
    pin: !!st.pin
  })) : [];

  return {
    faq: {
      offsetTop: faq.offsetTop,
      offsetHeight: faq.offsetHeight,
      clientTop: faqRect.top + scrollY,
      height: faqRect.height
    },
    contact: {
      offsetTop: contact.offsetTop,
      offsetHeight: contact.offsetHeight,
      clientTop: contactRect.top + scrollY,
      height: contactRect.height
    },
    triggers: stList
  };
});

console.log('FAQ & Contact Layout Info:', JSON.stringify(info, null, 2));
await browser.close();
