const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');

const navMenuIdx = html.indexOf('class="desktop-nav-menu');
const founderLinkIdx = html.indexOf('href="#founder"', navMenuIdx);
console.log('Desktop nav around founder:');
console.log(html.substring(founderLinkIdx - 50, founderLinkIdx + 300));

const drawerFounderIdx = html.indexOf('href="#founder"', html.indexOf('id="nav-drawer"'));
console.log('Drawer nav around founder:');
console.log(html.substring(drawerFounderIdx - 50, drawerFounderIdx + 300));
