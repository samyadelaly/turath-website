const fs = require('fs');

['ar.html', 'index.html'].forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  
  const videoRegex = /<!-- Mobile & Tablet Video:[\s\S]*?<video[\s\S]*?id="faq-bg-video"[\s\S]*?<\/video>/;
  const canvasHtml = `<!-- Mobile & Tablet Canvas: 60fps / 120fps Instant Frame-Sequence Scrubbing (Zero Stutter) -->
      <canvas
        id="faq-scroll-canvas"
        class="block lg:hidden w-full h-full object-cover object-center"
        style="will-change: transform; transform: translateZ(0); -webkit-transform: translateZ(0);"
      ></canvas>`;

  if (videoRegex.test(html)) {
    html = html.replace(videoRegex, canvasHtml);
    fs.writeFileSync(f, html, 'utf8');
    console.log(`Updated ${f} with canvas!`);
  } else {
    console.log(`Video block not found in ${f}`);
  }
});
