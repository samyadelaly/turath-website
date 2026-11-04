import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Minimal static file server for dist/
function startServer(port = 4173) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.xml': 'application/xml',
    '.ico': 'image/x-icon'
  };

  const distDir = path.resolve('dist');

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Preview server listening at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function verify() {
  const server = await startServer(4173);
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. DESKTOP VERIFICATION (1440x900)
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Hero
  await page.screenshot({ path: path.join(brainDir, 'desktop_new_01_hero.png') });
  console.log('Captured desktop_new_01_hero.png');

  // Screenshot 2: About
  await page.evaluate(() => {
    document.getElementById('scene-02')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_new_02_about.png') });
  console.log('Captured desktop_new_02_about.png');

  // Screenshot 3: Collections (Scene 03)
  await page.evaluate(() => {
    document.getElementById('scene-03')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_new_03_collections.png') });
  console.log('Captured desktop_new_03_collections.png');

  // Screenshot 4: Bespoke (Scene 04)
  await page.evaluate(() => {
    document.getElementById('bespoke')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_new_04_bespoke.png') });
  console.log('Captured desktop_new_04_bespoke.png');

  // Screenshot 5: Masterpieces (Scene 05)
  await page.evaluate(() => {
    document.getElementById('scene-05')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_new_05_masterpieces.png') });
  console.log('Captured desktop_new_05_masterpieces.png');

  // Screenshot 6: Videos (Scene 06)
  await page.evaluate(() => {
    document.getElementById('scene-06')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(brainDir, 'desktop_new_06_videos.png') });
  console.log('Captured desktop_new_06_videos.png');

  // 2. MOBILE REGRESSION CHECK (390x844)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:4173/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_regression_01_hero.png') });

  await mobilePage.evaluate(() => {
    document.getElementById('scene-03')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_regression_03_collections.png') });

  await browser.close();
  server.close();
  console.log('All verification screenshots captured successfully!');
}

verify().catch(console.error);
