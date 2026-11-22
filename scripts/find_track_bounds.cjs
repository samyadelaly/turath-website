const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');
const card1Idx = html.indexOf('<!-- Card 1:');
const trackEndIdx = html.indexOf('</div>\r\n      </div>', card1Idx);
console.log('card1Idx:', card1Idx, 'trackEndIdx:', trackEndIdx);
console.log(JSON.stringify(html.substring(trackEndIdx - 50, trackEndIdx + 100)));
