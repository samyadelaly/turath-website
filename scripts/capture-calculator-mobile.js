import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\a8530eea-fe2d-4172-a255-b5a64a7dbdfa';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  const filePath = 'file:///' + path.join(rootDir, 'calculator.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Add 2 items and scroll down to assembly drawer
  await page.evaluate(() => {
    addToAssembly();
    const shapeSelect = document.getElementById('shapeType');
    if (shapeSelect) {
      shapeSelect.value = 'rect-tube';
      shapeSelect.dispatchEvent(new Event('change'));
      addToAssembly();
    }
    const drawer = document.getElementById('assemblyDrawer');
    if (drawer) {
      drawer.classList.remove('hidden');
      drawer.scrollIntoView();
    }
  });

  await new Promise(r => setTimeout(r, 600));

  const preview3 = path.join(brainDir, 'mobile_preview_drawer.png');
  await page.screenshot({ path: preview3, fullPage: false });
  fs.copyFileSync(preview3, path.join(rootDir, 'mobile_preview_drawer.png'));

  await browser.close();
  console.log('Finished capturing drawer preview.');
}

capture().catch(console.error);
