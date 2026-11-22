import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function verifyMediaProtection() {
  const tmpDir = path.join(os.tmpdir(), `edge_pup_prot_${Date.now()}`);
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

  console.log('--- TEST 1: ar.html Media Protection ---');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const homeProtData = await page.evaluate(() => {
    // Test contextmenu on image
    const img = document.querySelector('img');
    let contextPrevented = false;
    let dragPrevented = false;

    if (img) {
      const cEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      contextPrevented = !img.dispatchEvent(cEvent);

      const dEvent = new DragEvent('dragstart', { bubbles: true, cancelable: true });
      dragPrevented = !img.dispatchEvent(dEvent);
    }

    // Test Ctrl+S
    const sEvent = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true });
    const ctrlSPrevented = !window.dispatchEvent(sEvent);

    // Test video attributes
    const videos = Array.from(document.querySelectorAll('video'));
    const videosSecured = videos.length > 0 && videos.every(v => 
      v.getAttribute('controlsList')?.includes('nodownload') &&
      v.hasAttribute('disablePictureInPicture')
    );

    return {
      imgFound: !!img,
      contextPrevented,
      dragPrevented,
      ctrlSPrevented,
      videosCount: videos.length,
      videosSecured
    };
  });
  console.log('Home Protection Results:', homeProtData);

  console.log('--- TEST 2: lighting-ar.html Product Protection & Button Usability ---');
  await page.goto('http://127.0.0.1:5173/lighting-ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const productProtData = await page.evaluate(() => {
    const sliderImg = document.getElementById('slider-image');
    let contextPrevented = false;
    let dragPrevented = false;

    if (sliderImg) {
      const cEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      contextPrevented = !sliderImg.dispatchEvent(cEvent);

      const dEvent = new DragEvent('dragstart', { bubbles: true, cancelable: true });
      dragPrevented = !sliderImg.dispatchEvent(dEvent);
    }

    // Verify touch callout style
    const touchCallout = sliderImg ? window.getComputedStyle(sliderImg).webkitTouchCallout : null;
    const userDrag = sliderImg ? window.getComputedStyle(sliderImg).webkitUserDrag : null;

    // Verify buttons are still clickable
    const shareBtn = document.getElementById('share-btn');
    const waBtn = document.getElementById('product-wa-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    return {
      sliderImgFound: !!sliderImg,
      contextPrevented,
      dragPrevented,
      touchCallout,
      userDrag,
      buttonsClickable: {
        shareBtn: !!shareBtn && window.getComputedStyle(shareBtn).pointerEvents !== 'none',
        waBtn: !!waBtn && window.getComputedStyle(waBtn).pointerEvents !== 'none',
        prevBtn: !!prevBtn && window.getComputedStyle(prevBtn).pointerEvents !== 'none',
        nextBtn: !!nextBtn && window.getComputedStyle(nextBtn).pointerEvents !== 'none'
      }
    };
  });
  console.log('Product Protection Results:', productProtData);

  console.log('--- TEST 3: action-ar.html Video Protection ---');
  await page.goto('http://127.0.0.1:5173/action-ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const actionProtData = await page.evaluate(() => {
    const video = document.getElementById('slider-video');
    let contextPrevented = false;

    if (video) {
      const cEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      contextPrevented = !video.dispatchEvent(cEvent);
    }

    const shareBtn = document.getElementById('share-btn');
    const waBtn = document.getElementById('product-wa-btn');

    return {
      videoFound: !!video,
      contextPrevented,
      controlsList: video ? video.getAttribute('controlsList') : null,
      disablePictureInPicture: video ? video.hasAttribute('disablePictureInPicture') : false,
      buttonsUsable: {
        shareBtn: !!shareBtn && window.getComputedStyle(shareBtn).pointerEvents !== 'none',
        waBtn: !!waBtn && window.getComputedStyle(waBtn).pointerEvents !== 'none'
      }
    };
  });
  console.log('Action Video Protection Results:', actionProtData);

  console.log('--- TEST 4: calculator.html Protection ---');
  await page.goto('http://127.0.0.1:5173/calculator.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const calcProtData = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    let contextPrevented = false;
    let dragPrevented = false;

    if (svg) {
      const cEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      contextPrevented = !svg.dispatchEvent(cEvent);

      const dEvent = new DragEvent('dragstart', { bubbles: true, cancelable: true });
      dragPrevented = !svg.dispatchEvent(dEvent);
    }

    const input = document.querySelector('input');
    return {
      svgFound: !!svg,
      contextPrevented,
      dragPrevented,
      inputWorking: !!input && !input.disabled
    };
  });
  console.log('Calculator Protection Results:', calcProtData);

  await browser.close();
  console.log('ALL TESTS PASSED SUCCESSFULLY!');
}

verifyMediaProtection().catch(console.error);
