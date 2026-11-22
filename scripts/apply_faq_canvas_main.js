import fs from 'fs';

let mainJs = fs.readFileSync('src/main.js', 'utf8');

const oldVideoSectionStart = '  // Mobile & Tablet Hardware-Accelerated Video Background (turath_left.mp4 in Arabic / turath_right.mp4 in English)';
const oldVideoSectionEnd = '    rafId = requestAnimationFrame(scrubLoop);\n  }\n}';

const idxStart = mainJs.indexOf(oldVideoSectionStart);
if (idxStart === -1) {
  console.error('Could not find oldVideoSectionStart in src/main.js');
  process.exit(1);
}

const idxEnd = mainJs.indexOf('}\n\n// 11. SECTION 08: CONTACT TURATH', idxStart);
if (idxEnd === -1) {
  console.error('Could not find end of initFaqSection in src/main.js');
  process.exit(1);
}

const newCanvasBlock = `  // 60fps/120fps Canvas Ping-Pong Video Scrubbing on Mobile & Tablet (Zero Stutter, Zero Dropped Frames)
  const faqCanvas = document.getElementById("faq-scroll-canvas");
  if (faqCanvas) {
    const ctx = faqCanvas.getContext("2d");
    const totalFrames = 60;
    const frames = [];
    let currentFrameIdx = 0;
    let targetFrameIdx = 0;
    let framesLoaded = 0;

    const isArabic = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
    const framesFolder = isArabic ? '/frames/faq-ar' : '/frames/faq-en';

    const drawFrame = (frameNum) => {
      const idx = Math.max(0, Math.min(totalFrames - 1, Math.round(frameNum)));
      const img = frames[idx];
      if (!img || !img.complete || !img.naturalWidth || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = faqCanvas.clientWidth || window.innerWidth;
      const h = faqCanvas.clientHeight || window.innerHeight;

      if (faqCanvas.width !== Math.round(w * dpr) || faqCanvas.height !== Math.round(h * dpr)) {
        faqCanvas.width = Math.round(w * dpr);
        faqCanvas.height = Math.round(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Cover scaling
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW, drawH, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    };

    // Preload frames progressively
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = \`\${framesFolder}/frame_\${num}.webp\`;
      img.onload = () => {
        framesLoaded++;
        if (framesLoaded === 1) {
          drawFrame(0);
        }
      };
      frames.push(img);
    }

    // Ping-Pong calculation: 0 to 0.5 moves forward (0 -> 59), 0.5 to 1.0 moves backward (59 -> 0)
    const updateTargetFromProgress = (progress) => {
      const clamped = Math.max(0, Math.min(1, progress));
      let normalized = 0;
      if (clamped <= 0.5) {
        normalized = clamped * 2;
      } else {
        normalized = (1 - clamped) * 2;
      }
      targetFrameIdx = normalized * (totalFrames - 1);
    };

    // ScrollTrigger integration
    ScrollTrigger.create({
      trigger: faqSection,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        updateTargetFromProgress(self.progress);
      }
    });

    // Native scroll fallback / touch listener
    const onScrollFaq = () => {
      if (window.innerWidth >= 1025) return;
      const rect = faqSection.getBoundingClientRect();
      const scrollDistance = faqSection.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      updateTargetFromProgress(progress);
    };
    window.addEventListener("scroll", onScrollFaq, { passive: true });

    // Smooth Lerp loop for instantaneous hardware-accelerated 60fps/120fps playback
    const smoothCanvasScrubLoop = () => {
      if (window.innerWidth < 1025) {
        const diff = targetFrameIdx - currentFrameIdx;
        if (Math.abs(diff) > 0.02) {
          currentFrameIdx += diff * 0.18;
          drawFrame(currentFrameIdx);
        }
      }
      requestAnimationFrame(smoothCanvasScrubLoop);
    };
    requestAnimationFrame(smoothCanvasScrubLoop);

    // Resize handler
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1025) {
        drawFrame(currentFrameIdx);
      }
    }, { passive: true });
  }`;

mainJs = mainJs.substring(0, idxStart) + newCanvasBlock + '\n' + mainJs.substring(idxEnd);
fs.writeFileSync('src/main.js', mainJs, 'utf8');
console.log('Successfully applied Canvas Ping-Pong Video Scrubbing to src/main.js!');
