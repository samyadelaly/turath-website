import fs from 'fs';

let mainJs = fs.readFileSync('src/main.js', 'utf8');

// 1. Replace initFaqSection video handling
const oldFaqCanvasBlock = `  // 60fps/120fps Canvas Ping-Pong Video Scrubbing on Mobile & Tablet (Zero Stutter)
  const faqCanvas = document.getElementById("faq-scroll-canvas");
  if (faqCanvas) {
    const ctx = faqCanvas.getContext("2d");
    const totalFrames = 60;
    const frames = [];
    let currentFrameIdx = 0;
    let targetFrameIdx = 0;
    let framesLoaded = 0;

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

    // Preload frames
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = \`/frames/faq-en/frame_\${num}.webp\`;
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

const newFaqVideoBlock = `  // Mobile & Tablet Hardware-Accelerated Video Background (turath_left.mp4 in Arabic / turath_right.mp4 in English)
  const faqVideo = document.getElementById("faq-bg-video");
  if (faqVideo) {
    const playSafe = () => {
      const p = faqVideo.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    playSafe();

    ScrollTrigger.create({
      trigger: faqSection,
      start: "top bottom",
      end: "bottom top",
      onEnter: playSafe,
      onEnterBack: playSafe,
      onLeave: () => faqVideo.pause(),
      onLeaveBack: () => faqVideo.pause()
    });
  }`;

if (mainJs.includes(oldFaqCanvasBlock)) {
  mainJs = mainJs.replace(oldFaqCanvasBlock, newFaqVideoBlock);
  console.log('Replaced old canvas with new FAQ video handler!');
} else {
  console.log('Canvas block not found by exact string, checking regex');
}

// 2. Replace initContactSection
const oldContactRegex = /\/\/ 11\. SECTION 08: CONTACT TURATH[\s\S]*?function initContactSection\(\) \{[\s\S]*?\}\n\}/;

const newContactSection = `// 11. SECTION 08: CONTACT TURATH (SCROLLING MORPHING DOME ASCENDING OVER PREVIOUS SECTION)
function initContactSection() {
  const contact = document.querySelector("#contact");
  const faqSection = document.querySelector("#faq");
  if (!contact) return;

  // Clear any residual clipPath so border-radius renders perfectly
  contact.style.clipPath = 'none';

  // Curtain overlap: Pin FAQ when its bottom reaches bottom of viewport,
  // allowing Contact to climb directly OVER it as the user scrolls
  if (faqSection) {
    ScrollTrigger.create({
      trigger: faqSection,
      start: "bottom bottom",
      endTrigger: contact,
      end: "top top",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1
    });
  }

  // Scrolling Morphing Animation:
  // Starts as an extreme circular dome (50vw radius) rising up over the previous section,
  // smoothly morphing to 0px (sharp full-width container) as it docks at the top.
  gsap.fromTo(contact,
    {
      borderTopLeftRadius: "50vw",
      borderTopRightRadius: "50vw",
      y: 60
    },
    {
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px",
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: contact,
        start: "top bottom",
        end: "top top",
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    }
  );

  // Parallax subtle float on contact background media
  const contactMedia = document.getElementById("contact-bg-media");
  if (contactMedia) {
    gsap.fromTo(contactMedia,
      { y: -25 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: contact,
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2
        }
      }
    );
  }
}`;

if (oldContactRegex.test(mainJs)) {
  mainJs = mainJs.replace(oldContactRegex, newContactSection);
  console.log('Replaced initContactSection successfully!');
} else {
  console.log('Contact section regex did not match');
}

fs.writeFileSync('src/main.js', mainJs, 'utf8');
