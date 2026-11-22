import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

const s3EnIdx = en.indexOf('id="scene-03"');
const s3EnEnd = en.indexOf('</section>', s3EnIdx);
const bEnIdx = en.indexOf('id="bespoke"');
console.log('EN between scene-03 and bespoke:', JSON.stringify(en.substring(s3EnEnd + 10, bEnIdx)));

const s3ArIdx = ar.indexOf('id="scene-03"');
const s3ArEnd = ar.indexOf('</section>', s3ArIdx);
const bArIdx = ar.indexOf('id="bespoke"');
console.log('AR between scene-03 and bespoke:', JSON.stringify(ar.substring(s3ArEnd + 10, bArIdx)));

const faqEnIdx = en.indexOf('id="faq"');
const faqEnEnd = en.indexOf('</section>', faqEnIdx);
const cEnIdx = en.indexOf('id="contact"');
console.log('EN between faq and contact:', JSON.stringify(en.substring(faqEnEnd + 10, cEnIdx)));

const faqArIdx = ar.indexOf('id="faq"');
const faqArEnd = ar.indexOf('</section>', faqArIdx);
const cArIdx = ar.indexOf('id="contact"');
console.log('AR between faq and contact:', JSON.stringify(ar.substring(faqArEnd + 10, cArIdx)));
