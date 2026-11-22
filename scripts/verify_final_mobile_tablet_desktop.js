import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function runVerification() {
  const tmpDir = path.join(os.tmpdir(), `edge_pup_verify_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', `--user-data-dir=${tmpDir}`]
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('facebook.net') || url.includes('google-analytics') || url.includes('googletagmanager')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log('--- TEST 1: Mobile Arabic Founder & Contact (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/ar.html#founder', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Check founder title position relative to navbar (50px height)
  const founderMetrics = await page.evaluate(() => {
    const title = document.querySelector('#scene-07 h2, #scene-07 .founder-title, #scene-07 .founder-name');
    const header = document.querySelector('.header-main, .unified-header');
    const s7 = document.getElementById('scene-07');
    return {
      titleRect: title ? title.getBoundingClientRect() : null,
      headerRect: header ? header.getBoundingClientRect() : null,
      s7Rect: s7 ? s7.getBoundingClientRect() : null,
      paddingTop: s7 ? window.getComputedStyle(s7).paddingTop : null
    };
  });
  console.log('Mobile Founder Metrics:', founderMetrics);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_mobile_ar_founder.png' });

  console.log('--- TEST 2: Mobile Arabic FAQ Video Scrubbing ---');
  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const faqData = await page.evaluate(async () => {
    const faq = document.getElementById('faq');
    const video = document.getElementById('faq-bg-video');
    if (!faq || !video) return { error: 'FAQ or video not found' };

    const top = faq.offsetTop;
    const height = faq.offsetHeight;

    // Scroll to 25% of FAQ
    window.scrollTo(0, top + height * 0.25);
    await new Promise(r => setTimeout(r, 400));
    const time25 = video.currentTime;

    // Scroll to 50% of FAQ
    window.scrollTo(0, top + height * 0.50);
    await new Promise(r => setTimeout(r, 400));
    const time50 = video.currentTime;

    // Scroll to 75% of FAQ (should reverse)
    window.scrollTo(0, top + height * 0.75);
    await new Promise(r => setTimeout(r, 400));
    const time75 = video.currentTime;

    return {
      duration: video.duration,
      time25,
      time50,
      time75,
      paused: video.paused
    };
  });
  console.log('Mobile FAQ Video Scrubbing Results:', faqData);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_mobile_ar_faq.png' });

  console.log('--- TEST 3: Mobile Arabic Contact Section Scrolling ---');
  await page.evaluate(() => {
    const contact = document.getElementById('contact');
    if (contact) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const contactMobileData = await page.evaluate(() => {
    const contact = document.getElementById('contact');
    const form = document.getElementById('contact-form') || (contact ? contact.querySelector('form') : null);
    const bottomText = contact ? contact.querySelector('.copyright, p:last-of-type') : null;
    return {
      clipPath: contact ? window.getComputedStyle(contact).clipPath : null,
      contactRect: contact ? contact.getBoundingClientRect() : null,
      formVisible: form ? form.getBoundingClientRect().top < window.innerHeight : false,
      scrollY: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight
    };
  });
  console.log('Mobile Contact Scroll End Data:', contactMobileData);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_mobile_ar_contact_end.png' });

  console.log('--- TEST 4: Tablet English Contact & Founder (768x1024) ---');
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/index.html#contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_tablet_en_contact.png' });

  console.log('--- TEST 5: Subpage Share Toast & WhatsApp Link ---');
  await page.setViewport({ width: 1366, height: 768, isMobile: false });
  await page.goto('http://127.0.0.1:5173/lighting-ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const subpageData = await page.evaluate(async () => {
    const shareBtn = document.getElementById('share-btn');
    const waBtn = document.getElementById('product-wa-btn');
    if (shareBtn) {
      shareBtn.click();
    }
    await new Promise(r => setTimeout(r, 300));
    const toast = document.getElementById('turath-share-toast');
    return {
      waHref: waBtn ? waBtn.href : null,
      toastExists: !!toast,
      toastText: toast ? toast.innerText : null,
      toastOpacity: toast ? window.getComputedStyle(toast).opacity : null
    };
  });
  console.log('Lighting Subpage Share & WA Test:', subpageData);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_subpage_share_toast.png' });

  console.log('--- TEST 6: Video Subpage Share & WhatsApp Link ---');
  await page.goto('http://127.0.0.1:5173/action-ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const videoSubpageData = await page.evaluate(async () => {
    const shareBtn = document.getElementById('share-btn');
    const waBtn = document.getElementById('product-wa-btn');
    if (shareBtn) {
      shareBtn.click();
    }
    await new Promise(r => setTimeout(r, 300));
    const toast = document.getElementById('turath-share-toast');
    return {
      waHref: waBtn ? waBtn.href : null,
      toastExists: !!toast,
      toastText: toast ? toast.innerText : null,
      toastOpacity: toast ? window.getComputedStyle(toast).opacity : null
    };
  });
  console.log('Action Video Subpage Share & WA Test:', videoSubpageData);

  console.log('--- TEST 7: Desktop Full View (1920x1080) Integrity Check ---');
  await page.setViewport({ width: 1920, height: 1080, isMobile: false });
  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_desktop_ar_faq.png' });

  await page.goto('http://127.0.0.1:5173/ar.html#contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_desktop_ar_contact.png' });

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

runVerification().catch(console.error);
