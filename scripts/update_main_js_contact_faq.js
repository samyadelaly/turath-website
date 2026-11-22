import fs from 'fs';

let mainJs = fs.readFileSync('src/main.js', 'utf8');

// 1. Update FAQ Video scrubbing
const oldFaqVideo = `  // Mobile & Tablet Hardware-Accelerated Video Background (turath_left.mp4 in Arabic / turath_right.mp4 in English)
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

const newFaqVideo = `  // Mobile & Tablet Hardware-Accelerated Video Background (turath_left.mp4 in Arabic / turath_right.mp4 in English)
  // Ping-Pong Scroll Scrubbing: 0 -> 0.5 moves forward (0 -> duration), 0.5 -> 1.0 moves backward (duration -> 0)
  const faqVideo = document.getElementById("faq-bg-video");
  if (faqVideo) {
    faqVideo.pause();
    let targetTime = 0;
    let lastAppliedTime = -1;

    const updateVideoProgress = (progress) => {
      const clamped = Math.max(0, Math.min(1, progress));
      let normalized = 0;
      if (clamped <= 0.5) {
        normalized = clamped * 2;
      } else {
        normalized = (1 - clamped) * 2;
      }
      const dur = faqVideo.duration || 8.04;
      targetTime = normalized * dur;
    };

    ScrollTrigger.create({
      trigger: faqSection,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        updateVideoProgress(self.progress);
      }
    });

    const onScrollFaqVideo = () => {
      if (window.innerWidth >= 1025) return;
      const rect = faqSection.getBoundingClientRect();
      const scrollDistance = faqSection.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      updateVideoProgress(progress);
    };
    window.addEventListener("scroll", onScrollFaqVideo, { passive: true });

    let rafId;
    const scrubLoop = () => {
      if (window.innerWidth < 1025 && faqVideo && !faqVideo.seeking) {
        if (Math.abs(targetTime - lastAppliedTime) > 0.03) {
          lastAppliedTime = targetTime;
          if ('fastSeek' in faqVideo) {
            faqVideo.fastSeek(targetTime);
          } else {
            faqVideo.currentTime = targetTime;
          }
        }
      }
      rafId = requestAnimationFrame(scrubLoop);
    };
    rafId = requestAnimationFrame(scrubLoop);
  }`;

// 2. Update Contact Section
const oldContactSection = `// 11. SECTION 08: CONTACT TURATH (ARCHITECTURAL 2-STEP GEOMETRIC SCROLLING MORPHING ASCENDING OVER FAQ)
function initContactSection() {
  const contact = document.querySelector("#contact");
  const faqSection = document.querySelector("#faq");
  if (!contact) return;

  // Clear any residual border radius
  contact.style.borderTopLeftRadius = '0px';
  contact.style.borderTopRightRadius = '0px';

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

  // Signature Architectural Geometric 2-step Staircase Reveal matching Scenes 05 & 06
  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const startPoly = isRTL
    ? "polygon(0% 100%, 0% 0%, 33% 0%, 33% 33%, 66% 33%, 66% 66%, 100% 66%, 100% 100%)"
    : "polygon(0% 100%, 0% 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0%, 100% 0%, 100% 100%)";

  const endPoly = "polygon(0% 100%, 0% 0%, 33% 0%, 33% 0%, 66% 0%, 66% 0%, 100% 0%, 100% 100%)";

  gsap.set(contact, { 
    clipPath: startPoly,
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px'
  });

  gsap.to(contact, {
    clipPath: endPoly,
    ease: "none",
    scrollTrigger: {
      trigger: contact,
      start: "top bottom",
      end: "top top",
      scrub: 1.2,
      invalidateOnRefresh: true
    }
  });`;

const newContactSection = `// 11. SECTION 08: CONTACT TURATH (ARCHITECTURAL 2-STEP GEOMETRIC SCROLLING MORPHING ASCENDING OVER FAQ)
function initContactSection() {
  const contact = document.querySelector("#contact");
  const faqSection = document.querySelector("#faq");
  if (!contact) return;

  // Clear any residual border radius
  contact.style.borderTopLeftRadius = '0px';
  contact.style.borderTopRightRadius = '0px';

  const isMobile = window.innerWidth < 1024;

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

  // Signature Architectural Geometric 2-step Staircase Reveal matching Scenes 05 & 06
  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const startPoly = isRTL
    ? "polygon(0% 100%, 0% 0%, 33% 0%, 33% 33%, 66% 33%, 66% 66%, 100% 66%, 100% 100%)"
    : "polygon(0% 100%, 0% 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0%, 100% 0%, 100% 100%)";

  const endPoly = "polygon(0% 100%, 0% 0%, 33% 0%, 33% 0%, 66% 0%, 66% 0%, 100% 0%, 100% 100%)";

  gsap.set(contact, { 
    clipPath: startPoly,
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px'
  });

  gsap.to(contact, {
    clipPath: endPoly,
    ease: "none",
    scrollTrigger: {
      trigger: contact,
      start: "top bottom",
      end: isMobile ? "top 35%" : "top top", // Completes reveal early on mobile/tablet so it reaches 100% without getting stuck
      scrub: 1.2,
      invalidateOnRefresh: true,
      onLeave: () => {
        contact.style.clipPath = 'none';
      }
    }
  });`;

// Execute replacements
if (mainJs.includes(oldFaqVideo)) {
  mainJs = mainJs.replace(oldFaqVideo, newFaqVideo);
  console.log('Replaced oldFaqVideo in src/main.js');
} else {
  console.error('oldFaqVideo not found in src/main.js');
}

if (mainJs.includes(oldContactSection)) {
  mainJs = mainJs.replace(oldContactSection, newContactSection);
  console.log('Replaced oldContactSection in src/main.js');
} else {
  console.error('oldContactSection not found in src/main.js');
}

fs.writeFileSync('src/main.js', mainJs, 'utf8');
console.log('Updated src/main.js successfully');
