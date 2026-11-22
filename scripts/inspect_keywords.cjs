const fs = require('fs');

const ar = fs.readFileSync('ar.html', 'utf8');
const en = fs.readFileSync('index.html', 'utf8');

const getMeta = (html, name) => {
  const match = html.match(new RegExp('<meta[^>]+name=[\"\']' + name + '[\"\'][^>]*content=[\"\']([^\"\']*)[\"\']', 'i'))
    || html.match(new RegExp('<meta[^>]+content=[\"\']([^\"\']*)[\"\'][^>]*name=[\"\']' + name + '[\"\']', 'i'));
  return match ? match[1] : null;
};

const getTitle = (html) => {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
};

console.log('=== AR Homepage ===');
console.log('Title:', getTitle(ar));
console.log('Description:', getMeta(ar, 'description'));
console.log('Keywords:', getMeta(ar, 'keywords'));

console.log('\n=== EN Homepage ===');
console.log('Title:', getTitle(en));
console.log('Description:', getMeta(en, 'description'));
console.log('Keywords:', getMeta(en, 'keywords'));

// Also check JSON-LD keywords in ar.html and index.html
const getJsonLdKeywords = (html) => {
  const matches = html.match(/<script[^>]+type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const found = [];
  matches.forEach(m => {
    try {
      const json = JSON.parse(m.replace(/<script[^>]*>|<\/script>/gi, ''));
      if (json.keywords) found.push(json.keywords);
      if (json['@graph']) {
        json['@graph'].forEach(g => {
          if (g.keywords) found.push(g.keywords);
        });
      }
    } catch(e) {}
  });
  return found;
};

console.log('\nAR JSON-LD keywords:', getJsonLdKeywords(ar));
console.log('EN JSON-LD keywords:', getJsonLdKeywords(en));
