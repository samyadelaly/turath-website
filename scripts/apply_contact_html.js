import fs from 'fs';

// 1. Update ar.html contact background
let arHtml = fs.readFileSync('ar.html', 'utf8');

const arTarget = `<div class="absolute inset-0 w-full h-[115%] min-h-[115%] pointer-events-none overflow-hidden z-0" id="contact-bg-media">
      <img src="/assets/images/contact-bg.jpg?v=4" alt="Handcrafted Solid Brass Bespoke Texture - Turath Egypt Atelier" class="w-full h-full object-cover object-center scale-110 bg-cover bg-center" loading="lazy" decoding="async" />
    </div>`;

const arReplacement = `<div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0" id="contact-bg-media">
      <picture class="w-full h-full block">
        <source media="(min-width: 1024px)" srcset="/assets/images/contact-bg-desktop-ar.jpg">
        <img src="/assets/images/contact-bg.jpg" alt="تواصل مع ورشة تراث مصر لتصنيع النحاس" class="w-full h-full object-cover object-center bg-cover bg-center" loading="lazy" decoding="async" />
      </picture>
    </div>`;

if (arHtml.includes(arTarget)) {
  arHtml = arHtml.replace(arTarget, arReplacement);
  fs.writeFileSync('ar.html', arHtml, 'utf8');
  console.log('Successfully updated ar.html contact background!');
} else {
  // Try regex replace
  const reg = /<div class="[^"]*" id="contact-bg-media">[\s\S]*?<\/div>/;
  if (reg.test(arHtml)) {
    arHtml = arHtml.replace(reg, arReplacement);
    fs.writeFileSync('ar.html', arHtml, 'utf8');
    console.log('Successfully updated ar.html contact background via regex!');
  } else {
    console.log('Could not find contact-bg-media in ar.html');
  }
}

// 2. Update index.html contact background
let enHtml = fs.readFileSync('index.html', 'utf8');

const enReplacement = `<div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0" id="contact-bg-media">
      <picture class="w-full h-full block">
        <source media="(min-width: 1024px)" srcset="/assets/images/contact-bg-desktop.jpg">
        <img src="/assets/images/contact-bg.jpg" alt="Handcrafted Solid Brass Bespoke Texture - Turath Egypt Atelier" class="w-full h-full object-cover object-center bg-cover bg-center" loading="lazy" decoding="async" />
      </picture>
    </div>`;

const enReg = /<div class="[^"]*" id="contact-bg-media">[\s\S]*?<\/div>/;
if (enReg.test(enHtml)) {
  enHtml = enHtml.replace(enReg, enReplacement);
  fs.writeFileSync('index.html', enHtml, 'utf8');
  console.log('Successfully updated index.html contact background via regex!');
} else {
  console.log('Could not find contact-bg-media in index.html');
}
