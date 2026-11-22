const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');

const navMenuIdx = html.indexOf('class="desktop-nav-menu');
console.log('--- DESKTOP NAV MENU AR ---');
console.log(html.substring(navMenuIdx, navMenuIdx + 1200));

const mobileMenuIdx = html.indexOf('id="nav-drawer"');
console.log('--- MOBILE NAV DRAWER AR ---');
console.log(html.substring(mobileMenuIdx, mobileMenuIdx + 1200));
