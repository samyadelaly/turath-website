const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const audit = files.map(file => {
  const content = fs.readFileSync(file, 'utf8');
  const jsonLdBlocks = [];
  const matches = content.match(/<script[^>]+type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  matches.forEach(m => {
    try {
      const inner = m.replace(/<script[^>]*>|<\/script>/gi, '');
      const parsed = JSON.parse(inner);
      if (parsed['@graph']) {
        jsonLdBlocks.push('@graph: [' + parsed['@graph'].map(g => g['@type']).join(', ') + ']');
      } else {
        jsonLdBlocks.push(parsed['@type']);
      }
    } catch(e) {
      jsonLdBlocks.push('INVALID_JSON');
    }
  });

  return {
    file,
    gtag: content.includes('G-PDYBS5D7CZ'),
    pixel: content.includes('148068092481360'),
    canonical: /<link[^>]+rel=[\"']canonical[\"']/i.test(content),
    hreflang: /<link[^>]+rel=[\"']alternate[\"'][^>]+hreflang/i.test(content),
    ogImage: /<meta[^>]+property=[\"']og:image[\"']/i.test(content),
    twitterCard: /<meta[^>]+name=[\"']twitter:card[\"']/i.test(content),
    googleVerify: /google-site-verification/i.test(content),
    bingVerify: /msvalidate\.01/i.test(content),
    yandexVerify: /yandex-verification/i.test(content),
    jsonLdBlocks
  };
});

console.log(JSON.stringify(audit, null, 2));
