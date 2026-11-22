import fs from 'fs';

// 1. Update ar.html FAQ background media
let arHtml = fs.readFileSync('ar.html', 'utf8');

const arFaqVideo = `      <!-- Mobile & Tablet Video: turath_left.mp4 in Arabic -->
      <video
        id="faq-bg-video"
        class="block lg:hidden w-full h-full object-cover object-center"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        poster="/assets/images/turath_left_1376x768.jpg"
      >
        <source src="/video/turath_left.mp4" type="video/mp4">
      </video>`;

arHtml = arHtml.replace(/<canvas[\s\S]*?id="faq-scroll-canvas"[\s\S]*?<\/canvas>/, arFaqVideo);
fs.writeFileSync('ar.html', arHtml, 'utf8');
console.log('Updated ar.html mobile FAQ to turath_left.mp4');

// 2. Update index.html FAQ background media
let enHtml = fs.readFileSync('index.html', 'utf8');

const enFaqVideo = `      <!-- Mobile & Tablet Video: turath_right.mp4 in English -->
      <video
        id="faq-bg-video"
        class="block lg:hidden w-full h-full object-cover object-center"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        poster="/assets/images/turath_right_1376x768.jpg"
      >
        <source src="/video/turath_right.mp4" type="video/mp4">
      </video>`;

enHtml = enHtml.replace(/<canvas[\s\S]*?id="faq-scroll-canvas"[\s\S]*?<\/canvas>/, enFaqVideo);
fs.writeFileSync('index.html', enHtml, 'utf8');
console.log('Updated index.html mobile FAQ to turath_right.mp4');
