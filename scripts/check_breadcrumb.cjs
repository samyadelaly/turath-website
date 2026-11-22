const fs = require('fs');

const content = fs.readFileSync('lighting-ar.html', 'utf8');
const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
if (match) {
  const json = JSON.parse(match[1]);
  const breadcrumb = json['@graph'].find(i => i['@type'] === 'BreadcrumbList');
  console.log('Breadcrumb in lighting-ar.html:', JSON.stringify(breadcrumb, null, 2));
}
