const https = require('https');

const host = 'turath-egypt.vercel.app';
const key = 'c7b2a9e4d5f1489091823746a5b8c3d2';
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/ar.html`,
  `https://${host}/lighting.html`,
  `https://${host}/lighting-ar.html`,
  `https://${host}/mirrors.html`,
  `https://${host}/mirrors-ar.html`,
  `https://${host}/tables.html`,
  `https://${host}/tables-ar.html`,
  `https://${host}/handles.html`,
  `https://${host}/handles-ar.html`,
  `https://${host}/handrails.html`,
  `https://${host}/handrails-ar.html`,
  `https://${host}/decor.html`,
  `https://${host}/decor-ar.html`,
  `https://${host}/wall-art.html`,
  `https://${host}/wall-art-ar.html`,
  `https://${host}/partitions.html`,
  `https://${host}/partitions-ar.html`,
  `https://${host}/tableware.html`,
  `https://${host}/tableware-ar.html`,
  `https://${host}/masterpieces.html`,
  `https://${host}/masterpieces-ar.html`,
  `https://${host}/action.html`,
  `https://${host}/action-ar.html`,
  `https://${host}/calculator.html`
];

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

console.log(`Submitting ${urlList.length} URLs to IndexNow (Bing & Copilot)...`);

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
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => {
  console.error(`IndexNow Request Error: ${e.message}`);
});

req.write(payload);
req.end();
