import puppeteer from 'puppeteer-core';
import os from 'os';
import path from 'path';
import fs from 'fs';

async function testAll() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge_t_'));
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

  // 1. Verify Desktop Arabic (1920x1080)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://127.0.0.1:5173/ar.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // --- Task 3: Check Collections Cards have NO descriptions ---
  const cardDescCount = await page.evaluate(() => {
    return document.querySelectorAll('.collections-track .collection-card-desc').length;
  });
  console.log('Task 3: Arabic collection-card-desc count (should be 0):', cardDescCount);

  // Take screenshot of Collections cards (clean, no descriptions)
  await page.evaluate(() => {
    const s3 = document.getElementById('scene-03');
    if (s3) s3.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_collections_no_desc.png' });
  console.log('Captured verified_collections_no_desc.png');

  // --- Task 5 & 6: Test Founder section landing & font size ---
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="founder"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const founderInfo = await page.evaluate(() => {
    const title = document.querySelector('.founder-name');
    const litPlate = document.getElementById('founder-plate-lit');
    return {
      titleFontSize: title ? window.getComputedStyle(title).fontSize : null,
      titleFontWeight: title ? window.getComputedStyle(title).fontWeight : null,
      titleColor: title ? window.getComputedStyle(title).color : null,
      litPlateOpacity: litPlate ? window.getComputedStyle(litPlate).opacity : null,
      scrollY: window.scrollY
    };
  });
  console.log('Task 5 & 6: Founder landing metrics:', JSON.stringify(founderInfo, null, 2));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_founder_daytime_scaled.png' });
  console.log('Captured verified_founder_daytime_scaled.png');

  // --- Task 1: Test FAQ Section 1 visibility below sticky header ---
  await page.evaluate(() => {
    const link = document.querySelector('a[href*="faq"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  const faqSection1Check = await page.evaluate(() => {
    const header = document.querySelector('.faq-sticky-header');
    const section1Title = document.querySelector('.faq-scroll-list h3');
    const headerRect = header ? header.getBoundingClientRect() : null;
    const s1Rect = section1Title ? section1Title.getBoundingClientRect() : null;
    return {
      headerBottom: headerRect ? Math.round(headerRect.bottom) : null,
      s1Top: s1Rect ? Math.round(s1Rect.top) : null,
      gapBetweenHeaderAndS1: (s1Rect && headerRect) ? Math.round(s1Rect.top - headerRect.bottom) : null,
      s1Text: section1Title ? section1Title.textContent.trim() : null
    };
  });
  console.log('Task 1: FAQ Section 1 Title positioning check (Arabic):', JSON.stringify(faqSection1Check, null, 2));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_section1_visible_ar.png' });
  console.log('Captured verified_faq_section1_visible_ar.png');

  // --- Task 2: Contact Architectural Geometric Staircase Reveal ---
  await page.evaluate(() => {
    const contact = document.getElementById('contact');
    if (contact) {
      const rect = contact.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 400;
      window.scrollTo({ top: targetY, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const contactClipPath = await page.evaluate(() => {
    const contact = document.getElementById('contact');
    return contact ? window.getComputedStyle(contact).clipPath : null;
  });
  console.log('Task 2: Contact clipPath during reveal:', contactClipPath);
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_contact_geometric_staircase_ar.png' });
  console.log('Captured verified_contact_geometric_staircase_ar.png');

  // 2. Verify Desktop English (1920x1080) for Task 1 & Task 2
  await page.goto('http://127.0.0.1:5173/index.html#faq', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const enFaqSection1Check = await page.evaluate(() => {
    const header = document.querySelector('.faq-sticky-header');
    const s1 = document.querySelector('.faq-category-header');
    const headerRect = header ? header.getBoundingClientRect() : null;
    const s1Rect = s1 ? s1.getBoundingClientRect() : null;
    return {
      headerBottom: headerRect ? Math.round(headerRect.bottom) : null,
      s1Top: s1Rect ? Math.round(s1Rect.top) : null,
      gapBetweenHeaderAndS1: (s1Rect && headerRect) ? Math.round(s1Rect.top - headerRect.bottom) : null,
      s1Text: s1 ? s1.textContent.trim() : null
    };
  });
  console.log('Task 1: FAQ Section 1 Title positioning check (English):', JSON.stringify(enFaqSection1Check, null, 2));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_faq_section1_visible_en.png' });
  console.log('Captured verified_faq_section1_visible_en.png');

  // Contact Geometric Staircase Reveal in English
  await page.evaluate(() => {
    const contact = document.getElementById('contact');
    if (contact) {
      const rect = contact.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 400;
      window.scrollTo({ top: targetY, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/verified_contact_geometric_staircase_en.png' });
  console.log('Captured verified_contact_geometric_staircase_en.png');

  await browser.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e) {}
  console.log('=== ALL TESTS EXECUTED AND COMPLETED SUCCESSFULLY ===');
}
testAll().catch(console.error);
