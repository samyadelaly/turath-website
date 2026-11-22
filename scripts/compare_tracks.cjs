const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const arHtml = fs.readFileSync('ar.html', 'utf8');

const getTrack = (html) => {
  const start = html.indexOf('collections-track');
  if (start === -1) return null;
  const tagStart = html.lastIndexOf('<div', start);
  const end = html.indexOf('</section>', start);
  return html.substring(tagStart, end);
};

console.log('--- INDEX TRACK FIRST 1000 CHARS ---');
console.log(getTrack(indexHtml)?.slice(0, 1000));

console.log('--- AR TRACK FIRST 1000 CHARS ---');
console.log(getTrack(arHtml)?.slice(0, 1000));
