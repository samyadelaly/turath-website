const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');

const s7Idx = html.indexOf('id="scene-07"');
const contactIdx = html.indexOf('id="contact"');
console.log('s7Idx:', s7Idx, 'contactIdx:', contactIdx);

if (s7Idx !== -1 && contactIdx !== -1) {
  console.log('Between s7 and contact:');
  console.log(JSON.stringify(html.substring(contactIdx - 200, contactIdx)));
}
