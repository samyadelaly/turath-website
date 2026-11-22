import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';

async function verifyAll() {
  const tmpDir = path.join(os.tmpdir(), `edge_verify_${Date.now()}`);
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

  // 1. Desktop Arabic (1920x1080)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // Check Arabic Nav Menu Font Size
  const navFont = await page.evaluate(() => {
    const link = document.querySelector('.desktop-nav-link');
    return link ? window.getComputedStyle(link).fontSize : 'none';
  });
  console.log('Arabic Desktop Nav Link Font Size:', navFont);

  // Navigate to Bespoke & Capture Scroll Transition
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="bespoke"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_bespoke_ar_desktop.png' });
  console.log('Captured verified_bespoke_ar_desktop.png');

  // Navigate to FAQ
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="faq"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_ar_desktop.png' });
  console.log('Captured verified_faq_ar_desktop.png');

  // Scroll to Contact Entrance over FAQ (Ascending Morphing Dome)
  await page.evaluate(() => {
    const faq = document.getElementById('faq');
    const contact = document.getElementById('contact');
    if (contact) {
      // Position where contact is halfway ascending over FAQ
      const rect = contact.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 400;
      window.scrollTo({ top: targetY, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_contact_dome_ar_desktop.png' });
  console.log('Captured verified_contact_dome_ar_desktop.png');

  // Scroll fully to Contact
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="contact"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_contact_full_ar_desktop.png' });
  console.log('Captured verified_contact_full_ar_desktop.png');

  // 2. Desktop English (1920x1080)
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // English FAQ
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="faq"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_en_desktop.png' });
  console.log('Captured verified_faq_en_desktop.png');

  // English Contact Full
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="contact"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_contact_en_desktop.png' });
  console.log('Captured verified_contact_en_desktop.png');

  // 3. Mobile Arabic (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://127.0.0.1:5173/ar.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const arMobileVideoSrc = await page.evaluate(() => {
    const video = document.getElementById('faq-bg-video');
    const source = video ? video.querySelector('source') : null;
    return source ? source.src : null;
  });
  console.log('Arabic Mobile FAQ Video Source:', arMobileVideoSrc);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_ar_mobile.png' });

  // 4. Mobile English (390x844)
  await page.goto('http://127.0.0.1:5173/index.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const enMobileVideoSrc = await page.evaluate(() => {
    const video = document.getElementById('faq-bg-video');
    const source = video ? video.querySelector('source') : null;
    return source ? source.src : null;
  });
  console.log('English Mobile FAQ Video Source:', enMobileVideoSrc);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_en_mobile.png' });

  await browser.close();
  console.log('ALL VERIFICATION COMPLETE!');
}
verifyAll().catch(console.error);
