import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  
  // Navigate to live local preview or production
  await page.goto('https://turath-egypt.vercel.app/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';
  
  // 1. Hero
  await page.screenshot({ path: path.join(brainDir, 'desktop_current_01_hero.png') });
  console.log('Saved desktop_current_01_hero.png');

  // 2. About (Scene 02)
  await page.evaluate(() => {
    document.getElementById('scene-02')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_current_02_about.png') });
  console.log('Saved desktop_current_02_about.png');

  // 3. Collections (Scene 03)
  await page.evaluate(() => {
    document.getElementById('scene-03')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_current_03_collections.png') });
  console.log('Saved desktop_current_03_collections.png');

  // 4. Bespoke (Scene 04)
  await page.evaluate(() => {
    document.getElementById('bespoke')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_current_04_bespoke.png') });
  console.log('Saved desktop_current_04_bespoke.png');

  // 5. Masterpieces (Scene 05)
  await page.evaluate(() => {
    document.getElementById('scene-05')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_current_05_masterpieces.png') });
  console.log('Saved desktop_current_05_masterpieces.png');

  // 6. Videos / Craftsmanship (Scene 06)
  await page.evaluate(() => {
    document.getElementById('scene-06')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_current_06_videos.png') });
  console.log('Saved desktop_current_06_videos.png');

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(console.error);
