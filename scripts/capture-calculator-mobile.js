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
  const tempDir = path.join(os.tmpdir(), 'pup-edge-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8));
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: tempDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-features=Translate,OptimizationHints',
      '--remote-debugging-port=0'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  const fileUrl = 'file:///' + path.resolve(rootDir, 'calculator.html').replace(/\\/g, '/');
  console.log('Navigating to file URL:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));

  // 1. Capture Simplified Home View (13 Shapes Grid)
  const homePath = path.join(brainDir, 'mobile_preview_grid.png');
  await page.screenshot({ path: homePath });
  fs.copyFileSync(homePath, path.join(rootDir, 'mobile_preview_grid.png'));
  console.log('Home grid screenshot captured.');

  // 2. Open Calculator for Round Tube, select Copper (#c86d44), set 5% scrap, test integrated units
  await page.evaluate(() => {
    showCalcView('round-tube');
    setMetalById('copper');
    // Set scrap to 5%
    setScrap(5);
    // Enter dimensions with integrated units:
    // D in mm (50.8), T in mm (2.0), L in m (1 m)
    document.getElementById('dim_D').value = '50.8';
    document.getElementById('dim_T').value = '2.0';
    setFieldUnit('L', 'm');
    document.getElementById('dim_L').value = '1';
    document.getElementById('inputQty').value = '4';
    calculate();
  });
  await new Promise(r => setTimeout(r, 600));

  const calcPath = path.join(brainDir, 'mobile_preview_calculator.png');
  await page.screenshot({ path: calcPath });
  fs.copyFileSync(calcPath, path.join(rootDir, 'mobile_preview_calculator.png'));
  console.log('Calculator screenshot captured.');

  // 3. Add to Product "ترابيزة سفرة نحاس", add another part, and open Projects View
  await page.evaluate(() => {
    openAddToProductModal();
    document.getElementById('modalProductNameInput').value = 'ترابيزة سفرة نحاس';
    document.getElementById('modalProductQtyInput').value = 2;
    confirmAddPartToProduct();

    // Add another part: Brass Sheet
    showCalcView('sheet');
    setMetalById('brass');
    setScrap(10);
    setFieldUnit('L', 'm');
    document.getElementById('dim_L').value = '2';
    setFieldUnit('W', 'm');
    document.getElementById('dim_W').value = '1';
    document.getElementById('dim_T').value = '3';
    document.getElementById('inputQty').value = '1';
    calculate();

    openAddToProductModal();
    document.getElementById('modalProductNameInput').value = 'ترابيزة سفرة نحاس';
    document.getElementById('modalProductQtyInput').value = 2;
    confirmAddPartToProduct();

    // Add another product: Carbon Steel Base
    showCalcView('rect-tube');
    setMetalById('steel');
    setScrap(0);
    document.getElementById('dim_W').value = '80';
    document.getElementById('dim_H').value = '40';
    document.getElementById('dim_T').value = '3';
    setFieldUnit('L', 'm');
    document.getElementById('dim_L').value = '1.5';
    document.getElementById('inputQty').value = '6';
    calculate();

    openAddToProductModal();
    document.getElementById('modalProductNameInput').value = 'شاسيه كونسول';
    document.getElementById('modalProductQtyInput').value = 1;
    confirmAddPartToProduct();

    const toast = document.getElementById('toastNotice');
    if (toast) toast.style.display = 'none';

    showProjectsView();
  });
  await new Promise(r => setTimeout(r, 800));

  const projPath = path.join(brainDir, 'mobile_preview_assembly.png');
  await page.screenshot({ path: projPath });
  fs.copyFileSync(projPath, path.join(rootDir, 'mobile_preview_assembly.png'));
  console.log('Projects BOM screenshot captured.');

  // 4. Capture English Toggle View & Scroll down to Raw Material Procurement Table & WhatsApp Button
  await page.evaluate(() => {
    toggleLanguage();
    document.getElementById('rawMaterialSummaryCard').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  const enPath = path.join(brainDir, 'mobile_preview_drawer.png');
  await page.screenshot({ path: enPath });
  fs.copyFileSync(enPath, path.join(rootDir, 'mobile_preview_drawer.png'));
  console.log('Scrolled BOM Summary screenshot captured.');

  await browser.close();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  console.log('All previews saved successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
