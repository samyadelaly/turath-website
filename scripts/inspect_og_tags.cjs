const fs = require('fs');

const content = fs.readFileSync('lighting-ar.html', 'utf8');
const ogs = content.match(/<meta[^>]+property=[\"']og:[^\"']+[\"'][^>]*>/gi) || [];
console.log('OG tags in lighting-ar.html:');
ogs.forEach(o => console.log(' ', o));
