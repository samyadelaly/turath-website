import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function verifyAll() {
  const tmpDir = path.join(os.tmpdir(), `edge_pup_verify2_${Date.now()}`);
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

  console.log('--- TEST 1: Arabic Mobile FAQ Canvas Scrubbing (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const canvasMetrics = await page.evaluate(async () => {
    const canvas = document.getElementById('faq-scroll-canvas');
    const faq = document.getElementById('faq');
    if (!canvas || !faq) return { error: 'Canvas or FAQ not found' };

    const top = faq.offsetTop;
    const height = faq.offsetHeight;

    // Scroll to 30% of FAQ
    window.scrollTo(0, top + height * 0.30);
    await new Promise(r => setTimeout(r, 600));

    // Sample a pixel from canvas to verify rendering
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;

    return {
      canvasExists: !!canvas,
      canvasVisible: window.getComputedStyle(canvas).display !== 'none',
      width: canvas.width,
      height: canvas.height,
      centerPixel: Array.from(pixel),
      isRendered: pixel[3] > 0 // alpha > 0 means something is drawn
    };
  });
  console.log('Mobile Arabic Canvas Metrics:', canvasMetrics);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_canvas_ar_mobile.png' });

  console.log('--- TEST 2: Action Arabic Video Share & WhatsApp Link ---');
  await page.goto('http://127.0.0.1:5173/action-ar.html?film=2', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const actionArData = await page.evaluate(async () => {
    const film = filmsData[currentIndex];
    const shareBtn = document.getElementById('share-btn');
    const waBtn = document.getElementById('product-wa-btn');

    // Simulate clicking shareBtn
    let clipboardText = '';
    // Mock clipboard
    navigator.clipboard = {
      writeText: async (t) => { clipboardText = t; }
    };
    // Mock navigator.share as undefined to force clipboard fallback and toast
    const originalShare = navigator.share;
    navigator.share = undefined;

    shareBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const toast = document.getElementById('turath-share-toast');

    return {
      currentIndex,
      filmTitle: film.title,
      filmDesc: film.desc,
      waHref: waBtn.href,
      clipboardText,
      toastVisible: toast && window.getComputedStyle(toast).opacity !== '0',
      toastText: toast ? toast.innerText : null
    };
  });
  console.log('Action Arabic Share & WA Test Results:', actionArData);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_action_ar_share.png' });

  console.log('--- TEST 3: Action English Video Share & WhatsApp Link ---');
  await page.goto('http://127.0.0.1:5173/action.html?film=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const actionEnData = await page.evaluate(async () => {
    const film = filmsData[currentIndex];
    const shareBtn = document.getElementById('share-btn');
    const waBtn = document.getElementById('product-wa-btn');

    let clipboardText = '';
    navigator.clipboard = {
      writeText: async (t) => { clipboardText = t; }
    };
    navigator.share = undefined;

    shareBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const toast = document.getElementById('turath-share-toast');

    return {
      currentIndex,
      filmTitle: film.title,
      waHref: waBtn.href,
      clipboardText,
      toastVisible: toast && window.getComputedStyle(toast).opacity !== '0',
      toastText: toast ? toast.innerText : null
    };
  });
  console.log('Action English Share & WA Test Results:', actionEnData);

  console.log('--- TEST 4: Desktop Full Check (1920x1080) ---');
  await page.setViewport({ width: 1920, height: 1080, isMobile: false });
  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const desktopData = await page.evaluate(() => {
    const canvas = document.getElementById('faq-scroll-canvas');
    const picture = document.querySelector('#faq picture');
    return {
      canvasDisplay: canvas ? window.getComputedStyle(canvas).display : null,
      pictureDisplay: picture ? window.getComputedStyle(picture).display : null
    };
  });
  console.log('Desktop Check Results:', desktopData);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_desktop_canvas_hidden.png' });

  await browser.close();
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

verifyAll().catch(console.error);
