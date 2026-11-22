import fs from 'fs';

let ar = fs.readFileSync('ar.html', 'utf8');

// 1. Add spacer between scene-03 and bespoke
const target1 = '</section>\r\n\r\n  <!-- SCENE 04: التصنيع حسب الطلب -->';
const target1LF = '</section>\n\n  <!-- SCENE 04: التصنيع حسب الطلب -->';

const replacement1 = '</section>\r\n\r\n  <!-- SCENE 03 to 04 TRANSITION SPACER (DWELL BUFFER PREVENTING EARLY BESPOKE COLLISION) -->\r\n  <div id="scene-03-spacer" style="height: 100vh; pointer-events: none;" aria-hidden="true"></div>\r\n\r\n  <!-- SCENE 04: التصنيع حسب الطلب -->';

if (ar.includes(target1)) {
  ar = ar.replace(target1, replacement1);
  console.log('Successfully added scene-03-spacer (CRLF)');
} else if (ar.includes(target1LF)) {
  ar = ar.replace(target1LF, replacement1.replace(/\r\n/g, '\n'));
  console.log('Successfully added scene-03-spacer (LF)');
} else {
  console.error('Could not find target1');
}

// 2. Increase bottom padding on faq-scroll-list in ar.html from pb-32 to pb-[60vh] lg:pb-[85vh]
const target2 = 'class="faq-scroll-list relative z-20 w-[62%] max-w-[62%] lg:w-[66.66%] lg:max-w-[66.66%] mr-0 ml-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-32 flex flex-col gap-6 box-border text-right"';
const replacement2 = 'class="faq-scroll-list relative z-20 w-[62%] max-w-[62%] lg:w-[66.66%] lg:max-w-[66.66%] mr-0 ml-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-[60vh] lg:pb-[85vh] flex flex-col gap-6 box-border text-right"';

if (ar.includes(target2)) {
  ar = ar.replace(target2, replacement2);
  console.log('Successfully updated faq-scroll-list padding');
} else {
  console.error('Could not find target2');
}

fs.writeFileSync('ar.html', ar, 'utf8');
console.log('Updated ar.html');
