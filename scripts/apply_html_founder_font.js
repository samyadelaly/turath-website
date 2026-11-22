import fs from 'fs';

// 1. Update ar.html
let arHtml = fs.readFileSync('ar.html', 'utf8');
arHtml = arHtml.replace(
  /font-size:\s*clamp\(1\.4rem,\s*3\.6vw,\s*2\.0rem\)\s*!important;\s*font-weight:\s*700\s*!important;/,
  'font-size: clamp(1.15rem, 1.8vw, 1.5rem) !important;\r\n      font-weight: 600 !important;'
);
fs.writeFileSync('ar.html', arHtml, 'utf8');

// 2. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  /font-size:\s*clamp\(1\.5rem,\s*2\.5vw,\s*2\.1rem\)\s*!important;/,
  'font-size: clamp(1.15rem, 1.8vw, 1.5rem) !important;'
);
fs.writeFileSync('index.html', indexHtml, 'utf8');

console.log('Updated founder font size in ar.html and index.html!');
