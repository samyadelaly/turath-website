const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ARTIFACTS_DIR = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff';

async function runDiagnostic() {
  console.log('=== TURATH SITE HEALTH DIAGNOSTIC ===');
  console.log('Launching headless browser...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Initial Load Check
  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log(`[DIAGNOSTIC] Initial window.scrollY on load: ${initialScrollY}px`);
  if (initialScrollY === 0) {
    console.log('[STATUS] PASS: Starts cleanly at Hero (0px).');
  } else {
    console.log(`[STATUS] WARNING: Jump detected! Scroll position loaded at ${initialScrollY}px.`);
  }

  // 2. Section DOM Order, Position, and Z-Index Analysis
  console.log('\n--- SECTION DOM ORDER & LAYERING ANALYSIS ---');
  const sectionReport = await page.evaluate(() => {
    const scenes = ['scene-01', 'scene-02', 'scene-03', 'scene-04', 'scene-05', 'scene-06', 'scene-07'];
    const results = [];
    scenes.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        results.push({
          id,
          exists: true,
          tagName: el.tagName,
          domIndex: Array.from(document.body.children).indexOf(el) !== -1 
            ? Array.from(document.body.children).indexOf(el)
            : Array.from(el.parentElement.children).indexOf(el),
          parentElement: el.parentElement.tagName + (el.parentElement.id ? '#' + el.parentElement.id : ''),
          position: computed.position,
          zIndex: computed.zIndex,
          top: rect.top + window.scrollY,
          height: rect.height
        });
      } else {
        results.push({ id, exists: false });
      }
    });
    return results;
  });

  console.table(sectionReport);

  // 3. Simulated Slow Scroll Test for Jitter / Sudden Jumps
  console.log('\n--- SIMULATED SLOW SCROLL TEST ---');
  const scrollSteps = 25;
  const stepDistance = 400; // total 10,000px
  let scrollAnomalies = 0;
  let previousScroll = initialScrollY;

  for (let i = 1; i <= scrollSteps; i++) {
    const expectedTarget = previousScroll + stepDistance;
    await page.evaluate((dist) => {
      window.scrollBy({ top: dist, behavior: 'instant' });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    }, stepDistance);

    await new Promise(r => setTimeout(r, 120));

    const actualScroll = await page.evaluate(() => window.scrollY);
    const diff = actualScroll - expectedTarget;

    // A significant delta difference indicates pinning, clamping, or a sudden jump
    if (Math.abs(diff) > 50) {
      const activeSection = await page.evaluate(() => {
        const scenes = ['scene-01', 'scene-02', 'scene-03', 'scene-04', 'scene-05', 'scene-06', 'scene-07'];
        for (const s of scenes) {
          const el = document.getElementById(s);
          if (el) {
            const r = el.getBoundingClientRect();
            if (r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2) return s;
          }
        }
        return 'unknown';
      });
      console.log(`[STEP ${i}] Scroll delta shift at ${actualScroll}px (delta: ${diff}px) -> Active viewport: ${activeSection}`);
      scrollAnomalies++;
    }
    previousScroll = actualScroll;
  }

  console.log(`Total scroll anomalies/pinning transitions detected: ${scrollAnomalies}`);

  await browser.close();
  console.log('\n=== DIAGNOSTIC COMPLETE ===');
}

runDiagnostic().catch(console.error);