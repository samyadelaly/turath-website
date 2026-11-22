import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

const testResults = await page.evaluate(() => {
  const track = document.querySelector('.collections-track');
  const res = [];
  
  res.push('initial: ' + track.scrollLeft);
  
  track.scrollLeft = -100;
  res.push('after setting -100: ' + track.scrollLeft);

  track.scrollLeft = 100;
  res.push('after setting 100: ' + track.scrollLeft);

  track.scrollBy({ left: 100, behavior: 'instant' });
  res.push('after scrollBy +100: ' + track.scrollLeft);

  track.scrollBy({ left: -100, behavior: 'instant' });
  res.push('after scrollBy -100: ' + track.scrollLeft);

  return res;
});

console.log(testResults);
await browser.close();
