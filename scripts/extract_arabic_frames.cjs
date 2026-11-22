const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function extractArabicFrames() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve('public/frames/faq-ar');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Launching browser to extract Arabic video frames from turath_left.mp4...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 960 });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });

  const frameCount = 60;
  console.log(`Extracting ${frameCount} frames from turath_left.mp4...`);

  const results = await page.evaluate(async (total) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = '/video/turath_left.mp4';
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const timeout = setTimeout(() => {
        reject(new Error('Video loading timed out'));
      }, 30000);

      video.addEventListener('loadedmetadata', async () => {
        clearTimeout(timeout);
        canvas.width = Math.min(540, video.videoWidth || 540);
        canvas.height = Math.min(960, video.videoHeight || 960);

        const duration = video.duration;
        const frames = [];

        for (let i = 0; i < total; i++) {
          const targetT = (i / (total - 1)) * (duration - 0.05);
          video.currentTime = targetT;
          await new Promise(r => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              r();
            };
            video.addEventListener('seeked', onSeeked);
          });

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/webp', 0.75);
          frames.push(dataUrl);
        }

        resolve(frames);
      });

      video.addEventListener('error', (e) => {
        clearTimeout(timeout);
        reject(new Error('Video error: ' + (video.error ? video.error.message : 'unknown')));
      });

      video.load();
    });
  }, frameCount);

  console.log(`Extracted ${results.length} frames. Saving to disk at public/frames/faq-ar/...`);
  results.forEach((dataUrl, idx) => {
    const base64Data = dataUrl.replace(/^data:image\/webp;base64,/, '');
    const filename = `frame_${String(idx + 1).padStart(3, '0')}.webp`;
    fs.writeFileSync(path.join(outDir, filename), Buffer.from(base64Data, 'base64'));
  });

  const firstFile = path.join(outDir, 'frame_001.webp');
  const size = fs.statSync(firstFile).size;
  console.log(`Extraction complete! Saved ${results.length} frames for Arabic FAQ. Sample frame size: ${Math.round(size/1024)} KB.`);
  await browser.close();
}

extractArabicFrames().catch(console.error);
