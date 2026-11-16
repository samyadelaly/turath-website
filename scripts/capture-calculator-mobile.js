import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\a8530eea-fe2d-4172-a255-b5a64a7dbdfa';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tempDir = path.join(os.tmpdir(), 'pup-edge-' + Date.now());
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  const url = 'http://127.0.0.1:5173/calculator.html';
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Main Screen (13 Shapes Grid View with Top Metal Selector)
  const gridPath = path.join(brainDir, 'mobile_preview_grid.png');
  await page.screenshot({ path: gridPath });
  fs.copyFileSync(gridPath, path.join(rootDir, 'mobile_preview_grid.png'));
  console.log('Grid screenshot captured.');

  // 2. Open Calculator for Round Tube
  await page.evaluate(() => {
    openShape('round-tube');
  });
  await new Promise(r => setTimeout(r, 600));

  const calcPath = path.join(brainDir, 'mobile_preview_calculator.png');
  await page.screenshot({ path: calcPath });
  fs.copyFileSync(calcPath, path.join(rootDir, 'mobile_preview_calculator.png'));
  console.log('Calc screenshot captured.');

  // 3. Add to assembly and capture drawer
  await page.evaluate(() => {
    addToBom();
    scrollToBom();
  });
  await new Promise(r => setTimeout(r, 600));

  const asmPath = path.join(brainDir, 'mobile_preview_assembly.png');
  await page.screenshot({ path: asmPath });
  fs.copyFileSync(asmPath, path.join(rootDir, 'mobile_preview_assembly.png'));
  console.log('Assembly screenshot captured.');

  await browser.close();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  console.log('All previews saved successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
