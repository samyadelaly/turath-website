import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import http from 'http';

// Minimal static server to serve dist/
const distDir = path.resolve('dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';
  let filePath = path.join(distDir, reqUrl);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 8089;
server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

  // --- 1. DESKTOP CAPTURES ---
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await desktopPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Desktop Hero Day
  await desktopPage.screenshot({ path: path.join(brainDir, 'desktop_phase2_01_hero_day.png') });
  console.log('Saved desktop_phase2_01_hero_day.png');

  // Screenshot 2: Desktop Bespoke section
  const bespokeEl = await desktopPage.$('#bespoke');
  if (bespokeEl) {
    await bespokeEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 1500));
    await desktopPage.screenshot({ path: path.join(brainDir, 'desktop_phase2_02_bespoke.png') });
    console.log('Saved desktop_phase2_02_bespoke.png');
  }

  // Screenshot 3: Desktop Founder section
  const founderEl = await desktopPage.$('#scene-07');
  if (founderEl) {
    await founderEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 1500));
    await desktopPage.screenshot({ path: path.join(brainDir, 'desktop_phase2_03_founder.png') });
    console.log('Saved desktop_phase2_03_founder.png');
  }

  // --- 2. MOBILE REGRESSION CHECK ---
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_phase2_01_hero.png') });
  console.log('Saved mobile_phase2_01_hero.png');

  const mobileBespoke = await mobilePage.$('#bespoke');
  if (mobileBespoke) {
    await mobileBespoke.scrollIntoView();
    await new Promise(r => setTimeout(r, 1000));
    await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_phase2_02_bespoke.png') });
    console.log('Saved mobile_phase2_02_bespoke.png');
  }

  const mobileFounder = await mobilePage.$('#scene-07');
  if (mobileFounder) {
    await mobileFounder.scrollIntoView();
    await new Promise(r => setTimeout(r, 1000));
    await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_phase2_03_founder.png') });
    console.log('Saved mobile_phase2_03_founder.png');
  }

  await browser.close();
  server.close();
  console.log('Verification finished successfully.');
  process.exit(0);
});
