import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';
import fs from 'fs';

async function checkMobile() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge_mob_check_'));
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
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

  // 1. Mobile viewport (iPhone 14 / standard 390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // A. Check Founder section on mobile
  await page.evaluate(() => {
    const founder = document.getElementById('scene-07');
    if (founder) founder.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const founderMobileData = await page.evaluate(() => {
    const nav = document.querySelector('header') || document.querySelector('nav');
    const founderSection = document.getElementById('scene-07');
    const founderTitle = document.querySelector('.founder-name');
    const editorialCard = document.querySelector('.founder-editorial-card');
    
    return {
      navHeight: nav ? nav.offsetHeight : 0,
      navBottom: nav ? nav.getBoundingClientRect().bottom : 0,
      founderSectionTop: founderSection ? founderSection.getBoundingClientRect().top : 0,
      founderTitleTop: founderTitle ? founderTitle.getBoundingClientRect().top : 0,
      founderTitleBottom: founderTitle ? founderTitle.getBoundingClientRect().bottom : 0,
      cardPaddingTop: editorialCard ? window.getComputedStyle(editorialCard).paddingTop : 0,
      sectionPaddingTop: founderSection ? window.getComputedStyle(founderSection).paddingTop : 0
    };
  });
  console.log('Mobile Founder Data:', JSON.stringify(founderMobileData, null, 2));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/debug_mobile_founder.png' });

  // B. Check FAQ Video on mobile
  const faqVideoData = await page.evaluate(() => {
    const video = document.getElementById('faq-bg-video');
    const canvas = document.getElementById('faq-bg-canvas');
    return {
      videoExists: !!video,
      videoAutoplay: video ? video.hasAttribute('autoplay') : false,
      videoLoop: video ? video.hasAttribute('loop') : false,
      canvasExists: !!canvas,
      videoSrc: video ? video.querySelector('source')?.src || video.src : null
    };
  });
  console.log('Mobile FAQ Video Data:', JSON.stringify(faqVideoData, null, 2));

  // C. Check Contact section manual scrolling on mobile
  // Try scrolling to max scroll
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const contactMobileData = await page.evaluate(() => {
    const contact = document.getElementById('contact');
    const faq = document.getElementById('faq');
    const cRect = contact ? contact.getBoundingClientRect() : null;
    const fRect = faq ? faq.getBoundingClientRect() : null;
    return {
      scrollHeight: document.documentElement.scrollHeight,
      windowHeight: window.innerHeight,
      scrollY: window.scrollY,
      maxScrollY: document.documentElement.scrollHeight - window.innerHeight,
      contactOffsetTop: contact ? contact.offsetTop : null,
      contactHeight: contact ? contact.offsetHeight : null,
      contactRect: cRect,
      contactClipPath: contact ? window.getComputedStyle(contact).clipPath : null,
      isFullyVisible: cRect ? (cRect.bottom <= window.innerHeight + 10) : false
    };
  });
  console.log('Mobile Contact Scroll Data:', JSON.stringify(contactMobileData, null, 2));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/debug_mobile_contact_end.png' });

  await browser.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e) {}
}

checkMobile().catch(console.error);
