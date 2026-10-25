/**
 * TURATH (تراث) — Master Engine
 * Step 2: GSAP & ScrollTrigger Animations
 * - Scrub crossfade for Day/Night Hero Images
 * - Seamless text fade-out & translation (y: -40px)
 * - TURATH wordmark docking animation to top-right navbar slot
 * - Interactive smooth scroll button to Section 02
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initHeroAnimations() {
  const hero = document.getElementById('hero');
  const heroNight = document.getElementById('hero-night');
  const wordmarkWrap = document.querySelector('.hero-wordmark-wrap');
  const floatingLogo = document.querySelector('.hero-floating-logo');
  const scrollBtn = document.getElementById('hero-scroll-btn');

  if (!hero) return;

  // Set initial transform origin for clean, jitter-free scaling
  if (wordmarkWrap) {
    gsap.set(wordmarkWrap, { transformOrigin: 'left center' });
  }

  // Calculate dynamic delta coordinates for docking into the top-right slot
  function getDockingCoords() {
    if (!wordmarkWrap || !floatingLogo) return { deltaX: 0, deltaY: 0, scale: 0.38 };

    // Temporarily clear inline transforms to measure natural DOM layout rects
    const prevTransform = wordmarkWrap.style.transform;
    wordmarkWrap.style.transform = 'none';

    const wmRect = wordmarkWrap.getBoundingClientRect();
    const logoRect = floatingLogo.getBoundingClientRect();

    wordmarkWrap.style.transform = prevTransform;

    const scale = 0.38;
    // Align right edge of the scaled wordmark with the right edge of the logo slot
    const targetX = logoRect.right - (wmRect.width * scale);
    const deltaX = targetX - wmRect.left;

    // Center vertically on the floating logo slot
    const targetCenterY = logoRect.top + logoRect.height / 2;
    const startCenterY = wmRect.top + wmRect.height / 2;
    const deltaY = targetCenterY - startCenterY;

    return { deltaX, deltaY, scale };
  }

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.25,
      invalidateOnRefresh: true
    }
  });

  // 1. Day / Night Crossfade on Hero Scroll
  if (heroNight) {
    heroTl.to(heroNight, {
      opacity: 1,
      ease: 'none'
    }, 0);
  }

  // 2. Text Fade-out: headlines & eyebrow translate up and fade out
  heroTl.to('.hero-eyebrow, .hero-headline-1, .hero-headline-2', {
    opacity: 0,
    y: -40,
    ease: 'power1.out',
    stagger: 0.03,
    duration: 0.4
  }, 0);

  // 3. Scroll button fades out early so only TURATH docks into the slot
  if (scrollBtn) {
    heroTl.to(scrollBtn, {
      opacity: 0,
      scale: 0.6,
      ease: 'power1.out',
      duration: 0.3
    }, 0);
  }

  // 4. Floating Logo fades out as the docked wordmark arrives to replace it
  if (floatingLogo) {
    heroTl.to(floatingLogo, {
      opacity: 0,
      ease: 'power1.inOut',
      duration: 0.4
    }, 0.2);
  }

  // 5. The TURATH Docking Animation: translates (x, y) and scales down to dock in the top-right slot
  if (wordmarkWrap) {
    heroTl.to(wordmarkWrap, {
      x: () => getDockingCoords().deltaX,
      y: () => getDockingCoords().deltaY,
      scale: () => getDockingCoords().scale,
      ease: 'power2.inOut',
      duration: 0.8
    }, 0);
  }

  // Recalculate docking targets on resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
}

initHeroAnimations();

// Interactive Scroll Button
const scrollBtn = document.getElementById('hero-scroll-btn');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
