const fs = require('fs');
const arHtml = fs.readFileSync('ar.html', 'utf8');
const enHtml = fs.readFileSync('index.html', 'utf8');

const arContactStart = arHtml.indexOf('id="contact"');
const enContactStart = enHtml.indexOf('id="contact"');

console.log('ar.html contact:', arHtml.slice(arContactStart - 500, arContactStart + 300));
console.log('en.html contact:', enHtml.slice(enContactStart - 500, enContactStart + 300));
