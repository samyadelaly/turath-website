import fs from 'fs';

let en = fs.readFileSync('index.html', 'utf8');
let ar = fs.readFileSync('ar.html', 'utf8');

// --- 1. index.html ---
// Bespoke bg-transparent
en = en.replace(
  'id="bespoke" class="custom-order-section relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 py-12 lg:py-6 lg:px-16 lg:h-[100dvh] lg:min-h-[100dvh] z-40 pointer-events-auto select-auto overflow-hidden"',
  'id="bespoke" class="custom-order-section relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 py-12 lg:py-6 lg:px-16 lg:h-[100dvh] lg:min-h-[100dvh] z-40 pointer-events-auto select-auto overflow-hidden bg-transparent"'
);

// Contact without dome
const enContactOld = '<section id="contact" class="contact-section relative w-full min-h-[100dvh] h-auto lg:h-[100dvh] z-80 bg-black overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pt-28 sm:pt-32 md:pt-36 pb-24 sm:pb-32 rounded-t-[50vw]" style="border-top-left-radius: 50vw; border-top-right-radius: 50vw; box-shadow: 0 -35px 80px rgba(0, 0, 0, 0.95);" data-theme="dark">';
const enContactNew = '<section id="contact" class="contact-section relative w-full min-h-[100dvh] h-auto lg:h-[100dvh] z-80 bg-black overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-24 pb-24 sm:pb-32" data-theme="dark">';

if (en.includes(enContactOld)) {
  en = en.replace(enContactOld, enContactNew);
  console.log('Updated index.html contact section');
} else {
  console.log('enContactOld not found directly');
}

// Faq scroll list pb in index.html
const enFaqListOld = 'class="faq-scroll-list relative z-20 w-[62%] max-w-[62%] lg:w-[66.66%] lg:max-w-[66.66%] ml-0 mr-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-32 flex flex-col gap-6 box-border"';
const enFaqListNew = 'class="faq-scroll-list relative z-20 w-[62%] max-w-[62%] lg:w-[66.66%] lg:max-w-[66.66%] ml-0 mr-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-[60vh] lg:pb-[85vh] flex flex-col gap-6 box-border"';

if (en.includes(enFaqListOld)) {
  en = en.replace(enFaqListOld, enFaqListNew);
  console.log('Updated index.html faq scroll list padding');
} else {
  console.log('enFaqListOld not found directly');
}

fs.writeFileSync('index.html', en, 'utf8');
console.log('Saved index.html');

// --- 2. ar.html ---
// Bespoke bg-transparent
ar = ar.replace(
  'id="bespoke" class="custom-order-section relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 py-12 lg:py-6 lg:px-16 lg:h-[100dvh] lg:min-h-[100dvh] z-40 pointer-events-auto select-auto overflow-hidden"',
  'id="bespoke" class="custom-order-section relative w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 py-12 lg:py-6 lg:px-16 lg:h-[100dvh] lg:min-h-[100dvh] z-40 pointer-events-auto select-auto overflow-hidden bg-transparent"'
);

// Contact without dome
const arContactOld = '<section id="contact" class="contact-section relative w-full min-h-[100dvh] h-auto lg:h-[100dvh] z-80 bg-black overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pt-28 sm:pt-32 md:pt-36 pb-24 sm:pb-32 rounded-t-[50vw]" style="border-top-left-radius: 50vw; border-top-right-radius: 50vw; box-shadow: 0 -35px 80px rgba(0, 0, 0, 0.95);" data-theme="dark">';
const arContactNew = '<section id="contact" class="contact-section relative w-full min-h-[100dvh] h-auto lg:h-[100dvh] z-80 bg-black overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-24 pb-24 sm:pb-32" data-theme="dark">';

if (ar.includes(arContactOld)) {
  ar = ar.replace(arContactOld, arContactNew);
  console.log('Updated ar.html contact section');
} else {
  console.log('arContactOld not found directly');
}

fs.writeFileSync('ar.html', ar, 'utf8');
console.log('Saved ar.html');
