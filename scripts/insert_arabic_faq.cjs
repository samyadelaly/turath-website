const fs = require('fs');

let arHtml = fs.readFileSync('ar.html', 'utf8');
const faqSectionHtml = fs.readFileSync('scratch/arabic_faq_section.html', 'utf8');

// 1. Insert FAQ nav link into desktop nav
const desktopFounderLink = '<a href="#founder" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase whitespace-nowrap">المؤسس</a>';
const desktopFaqLink = '\r\n      <a href="#faq" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase whitespace-nowrap">أسئلة شائعة</a>';

if (arHtml.includes(desktopFounderLink) && !arHtml.includes('href="#faq" class="desktop-nav-link')) {
  arHtml = arHtml.replace(desktopFounderLink, desktopFounderLink + desktopFaqLink);
  console.log('Added FAQ link to desktop nav menu');
}

// 2. Insert FAQ nav link into drawer nav
const drawerFounderLink = '<li class="nav-menu-item text-right p-0 m-0"><a href="#founder" class="nav-menu-link text-right p-0 m-0 transition-all duration-300">المؤسس | سامي عادل</a></li>';
const drawerFaqLink = '\r\n              <li class="nav-menu-item text-right p-0 m-0"><a href="#faq" class="nav-menu-link text-right p-0 m-0 transition-all duration-300">أسئلة شائعة</a></li>';

if (arHtml.includes(drawerFounderLink) && !arHtml.includes('href="#faq" class="nav-menu-link')) {
  arHtml = arHtml.replace(drawerFounderLink, drawerFounderLink + drawerFaqLink);
  console.log('Added FAQ link to drawer nav menu');
}

// 3. Insert FAQ section before contact section
const contactComment = '<!-- ========================================================================\r\n       08 — CONTACT TURATH (DYNAMIC CORNER MORPHING & GLASSMORPHISM)\r\n       ======================================================================== -->';

if (arHtml.includes(contactComment) && !arHtml.includes('id="faq"')) {
  arHtml = arHtml.replace(contactComment, faqSectionHtml + '\r\n\r\n  ' + contactComment);
  console.log('Inserted Arabic FAQ section before contact section in ar.html');
}

fs.writeFileSync('ar.html', arHtml, 'utf8');
console.log('ar.html updated successfully!');
