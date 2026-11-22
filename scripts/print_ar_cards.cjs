const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');
const trackStart = html.indexOf('class="collections-track');
const trackEnd = html.indexOf('</div>', html.lastIndexOf('collection-card'));
const trackContent = html.substring(trackStart, trackEnd + 6);
console.log(trackContent);
