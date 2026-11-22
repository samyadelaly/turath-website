const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');

const bespokeIdx = html.indexOf('id="bespoke"');
const bespokeEnd = html.indexOf('</section>', bespokeIdx);
console.log('--- BESPOKE SECTION TEXT ---');
console.log(html.substring(bespokeIdx, bespokeEnd).match(/<label[^>]*>.*?<\/label>/g));

const contactIdx = html.indexOf('id="contact"');
const contactEnd = html.indexOf('</section>', contactIdx);
console.log('--- CONTACT SECTION TEXT ---');
console.log(html.substring(contactIdx, contactEnd).match(/<label[^>]*>.*?<\/label>/g));
