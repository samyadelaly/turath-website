const fs = require('fs');

const ar = fs.readFileSync('ar.html', 'utf8');
const match = ar.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
if (match) {
  const json = JSON.parse(match[1]);
  console.log('Keys in LocalBusiness:');
  console.log(Object.keys(json));
  if (json.address) console.log('Address:', json.address);
  if (json.geo) console.log('Geo:', json.geo);
  if (json.hasMap) console.log('hasMap:', json.hasMap);
  if (json.openingHoursSpecification) console.log('Hours:', json.openingHoursSpecification);
  if (json.contactPoint) console.log('ContactPoint:', json.contactPoint);
}
