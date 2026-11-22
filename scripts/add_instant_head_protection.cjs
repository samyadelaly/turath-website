const fs = require('fs');

const protectionHeadScript = `  <script>
    // Instant Media & Asset Protection
    (function() {
      function isMediaTarget(el) {
        if (!el) return false;
        return !!(el.closest('img, video, canvas, picture, svg, [data-protected-media], .collection-card-img, .slat-video, .slider-card, #slider-image, #masterpiece-img, #slider-video, .video-stream') || el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'CANVAS');
      }
      window.addEventListener('contextmenu', function(e) { if (isMediaTarget(e.target)) { e.preventDefault(); e.stopPropagation(); return false; } }, { capture: true });
      document.addEventListener('contextmenu', function(e) { if (isMediaTarget(e.target)) { e.preventDefault(); e.stopPropagation(); return false; } }, { capture: true });
      window.addEventListener('dragstart', function(e) { if (isMediaTarget(e.target)) { e.preventDefault(); e.stopPropagation(); return false; } }, { capture: true });
      document.addEventListener('dragstart', function(e) { if (isMediaTarget(e.target)) { e.preventDefault(); e.stopPropagation(); return false; } }, { capture: true });
      window.addEventListener('keydown', function(e) { if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); return false; } }, { capture: true });
    })();
  </script>
</head>`;

['ar.html', 'index.html'].forEach(fileName => {
  let html = fs.readFileSync(fileName, 'utf8');
  if (!html.includes('Instant Media & Asset Protection')) {
    html = html.replace('</head>', protectionHeadScript);
    fs.writeFileSync(fileName, html, 'utf8');
    console.log(`Added instant protection script to ${fileName}`);
  }
});
