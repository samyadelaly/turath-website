const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const videos = [
  { url: '/video/commute2.mp4', out: 'public/assets/images/action-poster-1.jpg', time: 1.5 },
  { url: '/video/commute3.mp4', out: 'public/assets/images/action-poster-2.jpg', time: 1.5 },
  { url: '/video/commute4.mp4', out: 'public/assets/images/action-poster-3.jpg', time: 1.5 },
  { url: '/video/VN20260909_233157.mp4', out: 'public/assets/images/action-poster-4.jpg', time: 2.0 },
  { url: '/video/betebat.mp4', out: 'public/assets/images/action-poster-5.jpg', time: 1.5 }
];

async function extract() {
  const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, '..', 'public', decodeURIComponent(req.url.split('?')[0]));
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end();
    }
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': filePath.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream',
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(9876, '127.0.0.1', r));
  console.log('Local video server running on port 9876');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  for (const item of videos) {
    const page = await browser.newPage();
    await page.setViewport({ width: 720, height: 1280 });
    const videoUrl = `http://127.0.0.1:9876${item.url}`;

    const html = `
      <!DOCTYPE html>
      <html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;overflow:hidden;">
        <video id="v" src="${videoUrl}" muted playsinline autoplay style="width:100%;height:100%;object-fit:cover;"></video>
      </body></html>
    `;
    await page.setContent(html);

    await page.evaluate(async (targetTime) => {
      const v = document.getElementById('v');
      await new Promise((res) => {
        const onReady = () => {
          v.currentTime = Math.min(targetTime, (v.duration || targetTime) / 2);
        };
        if (v.readyState >= 2) onReady();
        else v.addEventListener('loadeddata', onReady, { once: true });

        v.addEventListener('seeked', () => res(), { once: true });
        setTimeout(res, 5000);
      });
    }, item.time);

    await new Promise(r => setTimeout(r, 800));

    const buffer = await page.screenshot({ type: 'jpeg', quality: 90 });
    fs.writeFileSync(item.out, buffer);
    console.log(`Saved ${item.out} (${buffer.length} bytes)`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Done extracting all video posters!');
}

extract().catch(console.error);
