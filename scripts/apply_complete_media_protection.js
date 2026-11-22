import fs from 'fs';

// 1. Update src/style.css
let css = fs.readFileSync('src/style.css', 'utf8');

const oldCssProtection = `/* Surgical Media Protection: Prevents drag, ghost saving & touch callouts */
img, video, [data-protected-media], .collection-card-img, .slat-video {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -webkit-touch-callout: none !important;
  user-select: none;
  -webkit-user-select: none;
}`;

const newCssProtection = `/* ==========================================================================
   GLOBAL HARDENED MEDIA & ASSET DOWNLOAD/SAVE PROTECTION
   ========================================================================== */
img, 
video, 
canvas, 
picture, 
[data-protected-media], 
.collection-card,
.collection-card-img, 
.slat-video,
.slider-card,
#slider-image,
#masterpiece-img,
#slider-video,
.video-stream,
.art-display,
.founder-image,
.founder-media,
.hero-bg-media,
.craftsmanship-media {
  -webkit-user-drag: none !important;
  -khtml-user-drag: none !important;
  -moz-user-drag: none !important;
  -o-user-drag: none !important;
  user-drag: none !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  -khtml-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

video.bg-video,
video[autoplay],
.slat-video,
#scene04-video,
#founder-bg-video {
  pointer-events: none !important;
}`;

if (css.includes(oldCssProtection)) {
  css = css.replace(oldCssProtection, newCssProtection);
  fs.writeFileSync('src/style.css', css, 'utf8');
  console.log('Updated src/style.css with hardened media protection.');
} else {
  console.log('Old CSS protection block not found, appending to top of style.css');
  css = newCssProtection + '\n' + css;
  fs.writeFileSync('src/style.css', css, 'utf8');
}

// 2. Update src/main.js initMediaProtection
let mainJs = fs.readFileSync('src/main.js', 'utf8');

const oldMainJsProtection = `// 17. SURGICAL MEDIA PROTECTION (IMAGES & VIDEOS)
function initMediaProtection() {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('img, video, [data-protected-media], .collection-card-img, .slat-video')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('img, video, [data-protected-media], .collection-card-img, .slat-video')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });
}`;

const newMainJsProtection = `// 17. GLOBAL HARDENED MEDIA & ASSET DOWNLOAD/SAVE PROTECTION
function initMediaProtection() {
  const isProtectedTarget = (target) => {
    if (!target) return false;
    if (
      target.closest('img, video, canvas, picture, [data-protected-media], .collection-card-img, .slat-video, .slider-card, #slider-image, #masterpiece-img, #slider-video, .video-stream') ||
      target.tagName === 'IMG' ||
      target.tagName === 'VIDEO' ||
      target.tagName === 'CANVAS' ||
      target.tagName === 'PICTURE'
    ) {
      return true;
    }
    return false;
  };

  const preventMediaContext = (e) => {
    if (isProtectedTarget(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  window.addEventListener('contextmenu', preventMediaContext, { capture: true });
  document.addEventListener('contextmenu', preventMediaContext, { capture: true });

  const preventMediaDrag = (e) => {
    if (isProtectedTarget(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  window.addEventListener('dragstart', preventMediaDrag, { capture: true });
  document.addEventListener('dragstart', preventMediaDrag, { capture: true });

  // Prevent browser save shortcuts (Ctrl+S / Cmd+S)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // Secure all video elements against native download & PIP
  const secureVideos = () => {
    document.querySelectorAll('video').forEach(v => {
      v.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
      v.setAttribute('disablePictureInPicture', 'true');
      v.setAttribute('disableRemotePlayback', 'true');
      v.setAttribute('oncontextmenu', 'return false;');
    });
  };
  secureVideos();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', secureVideos);
  }
}`;

if (mainJs.includes(oldMainJsProtection)) {
  mainJs = mainJs.replace(oldMainJsProtection, newMainJsProtection);
  fs.writeFileSync('src/main.js', mainJs, 'utf8');
  console.log('Updated src/main.js initMediaProtection successfully.');
} else {
  console.log('Old main.js protection not found by exact string, checking regex');
  const mainRegex = /\/\/ 17\. SURGICAL MEDIA PROTECTION[\s\S]*?function initMediaProtection\(\) \{[\s\S]*?\}\n\}/;
  if (mainRegex.test(mainJs)) {
    mainJs = mainJs.replace(mainRegex, newMainJsProtection);
    fs.writeFileSync('src/main.js', mainJs, 'utf8');
    console.log('Updated src/main.js via regex.');
  }
}

// 3. Update all 22 Subpages
const subpages = [
  'action-ar.html', 'action.html',
  'decor-ar.html', 'decor.html',
  'handles-ar.html', 'handles.html',
  'handrails-ar.html', 'handrails.html',
  'lighting-ar.html', 'lighting.html',
  'masterpieces-ar.html', 'masterpieces.html',
  'mirrors-ar.html', 'mirrors.html',
  'partitions-ar.html', 'partitions.html',
  'tables-ar.html', 'tables.html',
  'tableware-ar.html', 'tableware.html',
  'wall-art-ar.html', 'wall-art.html'
];

const subpageProtectionBlock = `// Hardened Global Media & Asset Protection (Images & Videos)
    const isProtectedTarget = (target) => {
      if (!target) return false;
      return !!(
        target.closest('img, video, canvas, picture, [data-protected-media], #slider-image, #masterpiece-img, #slider-video, .video-stream, .slider-card') ||
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.tagName === 'CANVAS' ||
        target.tagName === 'PICTURE'
      );
    };

    const preventMediaContext = (e) => {
      if (isProtectedTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    window.addEventListener('contextmenu', preventMediaContext, { capture: true });
    document.addEventListener('contextmenu', preventMediaContext, { capture: true });

    const preventMediaDrag = (e) => {
      if (isProtectedTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    window.addEventListener('dragstart', preventMediaDrag, { capture: true });
    document.addEventListener('dragstart', preventMediaDrag, { capture: true });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
    }, { capture: true });

    const securePageVideos = () => {
      document.querySelectorAll('video').forEach(v => {
        v.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
        v.setAttribute('disablePictureInPicture', 'true');
        v.setAttribute('disableRemotePlayback', 'true');
        v.setAttribute('oncontextmenu', 'return false;');
      });
    };
    securePageVideos();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', securePageVideos);
    }`;

subpages.forEach(fileName => {
  let html = fs.readFileSync(fileName, 'utf8');
  const startIdx = html.indexOf('// Surgical Image & Media Protection');
  if (startIdx !== -1) {
    // Find the end of the existing contextmenu / dragstart block before updateLoaderText or other code
    const endIdx = html.indexOf('function updateLoaderText', startIdx);
    if (endIdx !== -1) {
      html = html.substring(0, startIdx) + subpageProtectionBlock + '\n\n    ' + html.substring(endIdx);
      fs.writeFileSync(fileName, html, 'utf8');
      console.log(`Updated protection in ${fileName}`);
    } else {
      console.log(`Could not find updateLoaderText in ${fileName}`);
    }
  } else {
    console.log(`Surgical Image & Media Protection block not found in ${fileName}`);
  }
});

// 4. Update calculator.html
let calcHtml = fs.readFileSync('calculator.html', 'utf8');
if (!calcHtml.includes('preventMediaContext')) {
  const calcStyleInsert = `
        /* Media & Profile SVG Download/Save Protection */
        img, svg, canvas {
            -webkit-user-drag: none !important;
            user-drag: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
        }
    </style>`;
  calcHtml = calcHtml.replace('</style>', calcStyleInsert);

  const calcScriptInsert = `
        // Media Protection (Disable right click on visuals, drag & save shortcuts)
        const preventMediaContext = (e) => {
            if (e.target && (e.target.closest('img, svg, canvas') || e.target.tagName === 'IMG' || e.target.tagName === 'SVG' || e.target.tagName === 'CANVAS')) {
                e.preventDefault();
                return false;
            }
        };
        window.addEventListener('contextmenu', preventMediaContext, { capture: true });
        document.addEventListener('contextmenu', preventMediaContext, { capture: true });
        window.addEventListener('dragstart', preventMediaContext, { capture: true });
        document.addEventListener('dragstart', preventMediaContext, { capture: true });
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                return false;
            }
        }, { capture: true });

        // Launch
        initApp();`;
  calcHtml = calcHtml.replace('// Launch\n        initApp();', calcScriptInsert);
  fs.writeFileSync('calculator.html', calcHtml, 'utf8');
  console.log('Updated calculator.html with media protection.');
}

// 5. Update ar.html & index.html video tags with security attributes
['ar.html', 'index.html'].forEach(fileName => {
  let html = fs.readFileSync(fileName, 'utf8');
  // Add security attributes to all video tags if not present
  html = html.replace(/<video\b(?![^>]*controlsList)([^>]*)>/g, '<video controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture disableRemotePlayback oncontextmenu="return false;"$1>');
  fs.writeFileSync(fileName, html, 'utf8');
  console.log(`Secured all video tags in ${fileName}`);
});

console.log('ALL MEDIA PROTECTION APPLIED SUCCESSFULLY SITE-WIDE!');
