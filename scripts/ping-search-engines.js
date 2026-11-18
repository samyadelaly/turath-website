import https from 'https';

const SITEMAP_URL = 'https://turath-egypt.vercel.app/sitemap.xml';

async function pingEngine(url, name) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`[Ping] ${name} responded with status code: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.warn(`[Ping Error] Could not ping ${name}:`, err.message);
      resolve(null);
    });
  });
}

async function run() {
  console.log('--- Notifying Search Engines of updated sitemap.xml ---');
  // Google sitemap ping endpoint
  await pingEngine(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, 'Google');
  // Bing sitemap ping endpoint
  await pingEngine(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, 'Bing');
  console.log('--- Search engine notifications dispatched ---');
}

run();
