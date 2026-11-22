const fs = require('fs');

const ar = fs.readFileSync('ar.html', 'utf8');
const match = ar.match(/<script type=\"speculationrules\">([\s\S]*?)<\/script>/);
if (match) {
  console.log('Speculation rules in ar.html:');
  console.log(match[1]);
} else {
  console.log('No speculationrules in ar.html');
}
