import puppeteer from 'puppeteer-core';
import path from 'path';
import os from 'os';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

async function captureFounderClean() {
  const profileDir = path.join(os.tmpdir(), 'puppeteer_f_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => {
    const l = document.getElementById('loader');
    if (l) l.remove();
    document.body.classList.remove('loading-lock');
    const style = document.createElement('style');
    style.innerHTML = '#loader, .loader-wrapper, .preloader { display: none !important; opacity: 0 !important; visibility: hidden !important; }';
    document.head.appendChild(style);
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll directly to Founder lit phase (e.g. 6400)
  await page.evaluate(() => {
    const s7 = document.getElementById('scene-07');
    if (s7) {
      window.scrollTo(0, s7.offsetTop + 350);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(brainDir, 'verified_founder_lit_clean.png') });
  console.log('Saved verified_founder_lit_clean.png');

  await browser.close();
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
}

captureFounderClean().catch(console.error);
