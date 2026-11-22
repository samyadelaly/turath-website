import fs from 'fs';

// 1. ar.html
let ar = fs.readFileSync('ar.html', 'utf8');
ar = ar.replace(
  'pt-6 sm:pt-8 md:pt-10 pb-[60vh] lg:pb-[85vh] flex flex-col gap-6 box-border text-right" dir="rtl">',
  'pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-[60vh] lg:pb-[85vh] flex flex-col gap-6 box-border text-right" dir="rtl">'
);
fs.writeFileSync('ar.html', ar, 'utf8');

// 2. index.html
let en = fs.readFileSync('index.html', 'utf8');
en = en.replace(
  'pt-6 sm:pt-8 md:pt-10 pb-[60vh] lg:pb-[85vh] flex flex-col gap-6 box-border">',
  'pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-[60vh] lg:pb-[85vh] flex flex-col gap-6 box-border">'
);
fs.writeFileSync('index.html', en, 'utf8');

console.log('Updated faq-scroll-list padding classes in both files!');
