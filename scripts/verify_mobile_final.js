import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

  // 1. Mobile Arabic FAQ
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
  });
  await new Promise(r => setTimeout(r, 2000));

  const arFaqTop = await page.evaluate(() => {
    const faq = document.querySelector('#faq');
    const contact = document.querySelector('#contact');
    return {
      faqTop: faq.offsetTop,
      contactTop: contact.offsetTop,
      gap: contact.offsetTop - (faq.offsetTop + faq.offsetHeight)
    };
  });
  console.log('Mobile Arabic Layout:', arFaqTop);

  // Take screenshot at contact entry on mobile
  await page.evaluate((pos) => window.scrollTo(0, pos - 300), arFaqTop.contactTop);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/mobile_ar_contact_no_gap.png' });

  await browser.close();
})();
