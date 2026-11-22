import fs from 'fs';

// 1. Update index.html
let en = fs.readFileSync('index.html', 'utf8');
const enTarget = `<source media="(min-width: 1025px)" srcset="/assets/images/faq-bg-desktop.jpg">
        <img src="/assets/images/faq-bg-desktop.jpg" alt="Turath FAQ – Custom Brass &amp; Copper Manufacturing" class="w-full h-full object-cover object-center" fetchpriority="high" />`;

const enReplacement = `<source media="(min-width: 1025px)" srcset="/assets/images/turath_right_1376x768.jpg">
        <img src="/assets/images/turath_right_1376x768.jpg" alt="Turath FAQ – Custom Brass &amp; Copper Manufacturing" class="w-full h-full object-cover object-center" fetchpriority="high" />`;

if (en.includes(enTarget)) {
  en = en.replace(enTarget, enReplacement);
  fs.writeFileSync('index.html', en, 'utf8');
  console.log('Successfully updated index.html with turath_right_1376x768.jpg');
} else {
  console.error('enTarget not found in index.html');
}

// 2. Update ar.html
let ar = fs.readFileSync('ar.html', 'utf8');
const arTarget = `<source media="(min-width: 1025px)" srcset="/assets/images/faq-bg-desktop.jpg">
        <img src="/assets/images/faq-bg-desktop.jpg" alt="الأسئلة الشائعة حول تصنيع النحاس المخصص | ورشة تراث مصر" class="w-full h-full object-cover object-center" fetchpriority="high" />`;

const arReplacement = `<source media="(min-width: 1025px)" srcset="/assets/images/turath_left_1376x768.jpg">
        <img src="/assets/images/turath_left_1376x768.jpg" alt="الأسئلة الشائعة حول تصنيع النحاس المخصص | ورشة تراث مصر" class="w-full h-full object-cover object-center" fetchpriority="high" />`;

if (ar.includes(arTarget)) {
  ar = ar.replace(arTarget, arReplacement);
  fs.writeFileSync('ar.html', ar, 'utf8');
  console.log('Successfully updated ar.html with turath_left_1376x768.jpg');
} else {
  console.error('arTarget not found in ar.html');
}

// 3. Update src/main.js
let js = fs.readFileSync('src/main.js', 'utf8');
const jsTarget = `      { scaleX: isRTL ? -1.08 : 1.08, scaleY: 1.08 },
      {
        scaleX: isRTL ? -1.0 : 1.0,
        scaleY: 1.0,`;

const jsReplacement = `      { scale: 1.08 },
      {
        scale: 1.0,`;

if (js.includes(jsTarget)) {
  js = js.replace(jsTarget, jsReplacement);
  fs.writeFileSync('src/main.js', js, 'utf8');
  console.log('Successfully updated src/main.js parallax zoom for FAQ media');
} else {
  console.error('jsTarget not found in src/main.js');
}
