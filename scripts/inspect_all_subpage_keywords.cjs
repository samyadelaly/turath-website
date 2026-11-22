const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const results = files.map(file => {
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const descMatch = content.match(/<meta[^>]+name=[\"\']description[\"\'][^>]*content=[\"\']([^\"\']*)[\"\']/i)
    || content.match(/<meta[^>]+content=[\"\']([^\"\']*)[\"\'][^>]*name=[\"\']description[\"\']/i);
  const kwMatch = content.match(/<meta[^>]+name=[\"\']keywords[\"\'][^>]*content=[\"\']([^\"\']*)[\"\']/i)
    || content.match(/<meta[^>]+content=[\"\']([^\"\']*)[\"\'][^>]*name=[\"\']keywords[\"\']/i);

  // also find json-ld keywords
  const jsonLdKw = [];
  const matches = content.match(/<script[^>]+type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  matches.forEach(m => {
    try {
      const json = JSON.parse(m.replace(/<script[^>]*>|<\/script>/gi, ''));
      if (json.keywords) jsonLdKw.push(json.keywords);
      if (json['@graph']) {
        json['@graph'].forEach(g => {
          if (g.keywords) jsonLdKw.push(g.keywords);
        });
      }
    } catch(e) {}
  });

  return {
    file,
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descMatch ? descMatch[1].slice(0, 100) + '...' : null,
    keywordsCount: kwMatch ? kwMatch[1].split(/[،,]/).length : 0,
    keywordsPreview: kwMatch ? kwMatch[1].slice(0, 150) + '...' : null,
    jsonLdKeywords: jsonLdKw
  };
});

console.log(JSON.stringify(results, null, 2));
