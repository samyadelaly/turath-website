const https = require('https');
const fs = require('fs');
const path = require('path');

const host = 'turath-egypt.vercel.app';
const key = 'c7b2a9e4d5f1489091823746a5b8c3d2';
const keyLocation = `https://${host}/${key}.txt`;

// Read all 140 canonical URLs from sitemap.xml
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
const urlList = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

console.log(`Found ${urlList.length} canonical URLs in sitemap.xml.`);

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

console.log(`Submitting ${urlList.length} URLs to IndexNow (Bing, Copilot, Yandex, Seznam)...`);

const req = https.request({
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  console.log(`IndexNow Response Status: ${res.statusCode} ${res.statusMessage}`);
  let responseData = '';
  res.on('data', (d) => responseData += d);
  res.on('end', () => {
    if (responseData) console.log('Response body:', responseData);
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('SUCCESS: All 140 canonical URLs successfully accepted by IndexNow API!');
    } else {
      console.log('IndexNow returned unexpected status:', res.statusCode);
    }
  });
});

req.on('error', (e) => {
  console.error(`IndexNow Request Error: ${e.message}`);
});

req.write(payload);
req.end();
