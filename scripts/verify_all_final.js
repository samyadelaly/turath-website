import puppeteer from 'puppeteer-core';
import path from 'path';
import os from 'os';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

async function safeEval(page, fn, ...args) {
  for (let i = 0; i < 8; i++) {
    try {
      return await page.evaluate(fn, ...args);
    } catch (e) {
      if (i === 7) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function verifyAll() {
  const profileDir = path.join(os.tmpdir(), 'puppeteer_test_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Verify Founder & Bespoke on Desktop (1440x900)
  console.log('--- 1. Testing Founder on Desktop ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900 });
  await desktopPage.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss loader completely
  await safeEval(desktopPage, () => {
    const style = document.createElement('style');
    style.innerHTML = '#loader, .loader-wrapper, .preloader { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }';
    document.head.appendChild(style);
    document.body.classList.remove('loading-lock');
    const l = document.getElementById('loader');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Check Bespoke Title Color in English
  const bespokeEnColor = await safeEval(desktopPage, () => {
    const h2 = document.querySelector('#bespoke-content h2');
    return h2 ? {
      text: h2.textContent.trim(),
      color: window.getComputedStyle(h2).color
    } : null;
  });
  console.log('Bespoke Title English:', JSON.stringify(bespokeEnColor, null, 2));

  // Scroll to scene-07 / founder
  console.log('Navigating to #founder...');
  await safeEval(desktopPage, () => {
    const s7 = document.getElementById('scene-07');
    if (s7) {
      // Scroll to founder where lamp is illuminated
      window.scrollTo(0, s7.offsetTop + 300);
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  // Check state at founder
  const founderState = await safeEval(desktopPage, () => {
    const s7 = document.getElementById('scene-07');
    const faq = document.getElementById('faq');
    const founderTitle = document.querySelector('.founder-name');
    const litPlate = document.getElementById('founder-plate-lit');
    const faqRect = faq ? faq.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      s7Top: s7 ? s7.getBoundingClientRect().top : null,
      faqTopInViewport: faqRect ? faqRect.top : null,
      isFaqCompletelyOffscreen: faqRect ? faqRect.top >= window.innerHeight : true,
      founderTitleColor: founderTitle ? window.getComputedStyle(founderTitle).color : null,
      litPlateOpacity: litPlate ? window.getComputedStyle(litPlate).opacity : null
    };
  });
  console.log('Founder Landing State:', JSON.stringify(founderState, null, 2));
  await desktopPage.screenshot({ path: path.join(brainDir, 'verified_founder_clean.png') });

  // 2. Test FAQ Ascent over Founder
  console.log('--- 2. Testing FAQ Ascent ---');
  await safeEval(desktopPage, () => {
    const faq = document.getElementById('faq');
    if (faq) {
      window.scrollTo(0, faq.offsetTop - 450);
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  const faqAscentState = await safeEval(desktopPage, () => {
    const faq = document.getElementById('faq');
    const title = faq ? faq.querySelector('.faq-sticky-header h2') : null;
    return {
      scrollY: window.scrollY,
      faqTop: faq ? faq.getBoundingClientRect().top : null,
      faqClipPath: faq ? window.getComputedStyle(faq).clipPath : null,
      titleOpacity: title ? window.getComputedStyle(title).opacity : null
    };
  });
  console.log('FAQ Ascent State:', JSON.stringify(faqAscentState, null, 2));
  await desktopPage.screenshot({ path: path.join(brainDir, 'verified_faq_ascent.png') });

  await browser.close();
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
  console.log('=== DESKTOP VERIFICATIONS COMPLETED SUCCESSFULLY ===');
}

verifyAll().catch(console.error);
