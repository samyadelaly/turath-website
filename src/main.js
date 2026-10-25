/**
 * TURATH (تراث) — Master Engine
 * - Luxury Navigation & Menu Overlay Interactions
 * - GSAP ScrollTrigger Synchronized Gold Sheet Rise & Fade-Out
 * - TURATH Wordmark Docking to Top Navbar on the LEFT next to Menu Icon
 * - Day / Night Hero Crossfade
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTurathScrambleAnimation } from './artwork.js';

gsap.registerPlugin(ScrollTrigger);

// 1. Navigation Menu Overlay Interactions
function initNavDrawer() {
  const menuTrigger = document.getElementById('menu-trigger');
  const navDrawer = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('nav-close-btn');
  const navLinks = document.querySelectorAll('.nav-menu-link');

  function openMenu() {
    document.body.classList.add('menu-open');
    if (menuTrigger) menuTrigger.setAttribute('aria-expanded', 'true');
    if (navDrawer) navDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuTrigger) menuTrigger.setAttribute('aria-expanded', 'false');
    if (navDrawer) navDrawer.setAttribute('aria-hidden', 'true');
  }

  if (menuTrigger) {
    menuTrigger.addEventListener('click', () => {
      if (document.body.classList.contains('menu-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });
}

// 2. GSAP ScrollTrigger Synchronized Animations
function initHeroAnimations() {
  const hero = document.getElementById('hero');
  const heroSheet = document.getElementById('hero-sheet');
  const heroNight = document.getElementById('hero-night');
  const wordmarkWrap = document.getElementById('hero-wordmark-wrap');
  const wordmark = document.querySelector('.hero-wordmark');
  const floatingLogo = document.querySelector('.hero-floating-logo');
  const scrollBtn = document.getElementById('hero-scroll-btn');
  const siteHeader = document.getElementById('site-header');
  const dockSlot = document.getElementById('navbar-dock-slot');
  const placeholder = document.getElementById('hero-wordmark-placeholder');

  if (!hero) return;

  // Set initial transform origin for clean, jitter-free scaling
  if (wordmarkWrap) {
    gsap.set(wordmarkWrap, { transformOrigin: 'left center' });
  }

  // Calculate dynamic docking deltas from hero placeholder to navbar dock slot
  function getDockingDeltas() {
    if (!placeholder || !dockSlot || !wordmarkWrap) {
      return { startX: 0, startY: 0, startScale: 1, dockedScale: 0.55 };
    }

    const prevTransform = wordmarkWrap.style.transform;
    wordmarkWrap.style.transform = 'none';

    const pRect = placeholder.getBoundingClientRect();
    const sRect = dockSlot.getBoundingClientRect();

    wordmarkWrap.style.transform = prevTransform;

    const startX = pRect.left - sRect.left;
    const startY = (pRect.top + pRect.height / 2) - (sRect.top + sRect.height / 2);
    const dockedScale = 0.55;

    return { startX, startY, startScale: 1, dockedScale };
  }

  const initialDeltas = getDockingDeltas();
  const scrambleEngine = initTurathScrambleAnimation();

  // Set resting position at scroll 0 so wordmark sits in the hero shelf
  if (wordmarkWrap) {
    gsap.set(wordmarkWrap, {
      x: initialDeltas.startX,
      y: initialDeltas.startY,
      scale: initialDeltas.startScale,
      color: '#0A0A0A'
    });

    if (scrambleEngine) {
      wordmarkWrap.addEventListener('mouseenter', () => {
        const curScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (curScroll < 50) {
          scrambleEngine.triggerScramble();
        }
      });
    }
  }

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (scrambleEngine) {
          scrambleEngine.onScrollProgress(self.progress, window.pageYOffset || document.documentElement.scrollTop);
        }
      }
    }
  });

  // 1. Fast Day / Night Crossfade on Hero Scroll (Completes within first 25% of scroll)
  if (heroNight) {
    heroTl.to(heroNight, {
      opacity: 1,
      ease: 'power1.inOut',
      duration: 0.25
    }, 0);
  }

  // 2. Synchronized Gold Sheet Rise (1:1 with wordmark ascension)
  if (heroSheet) {
    heroTl.to(heroSheet, {
      y: () => -getDockingDeltas().startY,
      ease: 'power2.inOut',
      duration: 0.85
    }, 0);

    // 3. Smooth Fade-Out at the very end of Hero scroll range so it dissolves under navbar
    heroTl.to(heroSheet, {
      opacity: 0,
      ease: 'power2.inOut',
      duration: 0.35
    }, 0.65);
  }

  // 4. Text Fade-out: headlines & eyebrow translate up and fade out
  heroTl.to('.hero-eyebrow, .hero-headline-1, .hero-headline-2', {
    opacity: 0,
    y: -40,
    ease: 'power1.out',
    stagger: 0.03,
    duration: 0.4
  }, 0);

  // 5. Floating logo in top-right fades out early as scroll begins
  if (floatingLogo) {
    heroTl.to(floatingLogo, {
      opacity: 0,
      ease: 'power1.out',
      duration: 0.25
    }, 0);
  }

  // 6. The TURATH Wordmark Docking to the LEFT (next to menu icon)
  if (wordmarkWrap) {
    heroTl.fromTo(wordmarkWrap, {
      x: () => getDockingDeltas().startX,
      y: () => getDockingDeltas().startY,
      scale: () => getDockingDeltas().startScale
    }, {
      x: 0,
      y: 0,
      scale: () => getDockingDeltas().dockedScale,
      ease: 'power2.inOut',
      duration: 0.85
    }, 0);
  }

  // Fade out the scroll button/arrow smoothly as docking begins, leaving ONLY "TURATH" text to dock
  if (scrollBtn) {
    heroTl.to(scrollBtn, {
      opacity: 0,
      scale: 0.7,
      ease: 'power1.out',
      duration: 0.35,
      pointerEvents: 'none'
    }, 0);
  }

  // Wordmark color transitions to Turath Gold (#D7C797) as it docks into navbar
  if (wordmark) {
    heroTl.to(wordmark, {
      color: '#D7C797',
      ease: 'power1.inOut',
      duration: 0.5
    }, 0.35);
  }

  // Menu trigger lines transition to Turath Gold (#D7C797)
  heroTl.to('.menu-line', {
    backgroundColor: '#D7C797',
    ease: 'power1.inOut',
    duration: 0.4
  }, 0.35);

  // 7. Scrolled Dynamic Glass Navbar: triggers once user scrolls past the Hero section (Scene 02 begins)
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 60px',
    onEnter: () => siteHeader && siteHeader.classList.add('is-scrolled'),
    onLeaveBack: () => siteHeader && siteHeader.classList.remove('is-scrolled'),
  });

  // Recalculate docking targets on resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
}

// 3. Interactive Scroll Button
function initScrollBtn() {
  const scrollBtn = document.getElementById('hero-scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) {
        about.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// 4. Scene 02 — Full-Screen About Turath (2-Step Geometric Entrance & 3-Slice Morphing)
function initAboutPinnedTimeline() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const text1 = document.getElementById('about-text-1');
  const text2 = document.getElementById('about-text-2');
  const text3 = document.getElementById('about-text-3');

  const slices2 = document.querySelectorAll('#about-layer-2 .about-vertical-slice');
  const slices3 = document.querySelectorAll('#about-layer-3 .about-vertical-slice');

  if (!text1 || !text2 || !text3) return;

  // Set initial states
  gsap.set(text1, { opacity: 1, y: 0, pointerEvents: 'auto' });
  gsap.set([text2, text3], { opacity: 0, y: 25, pointerEvents: 'none' });
  gsap.set([slices2, slices3], { clipPath: 'inset(100% 0% 0% 0%)' });

  // 1. 2-Step Geometric Entrance Animation (Stair Morph over Hero)
  gsap.set(aboutSection, {
    clipPath: 'polygon(0% 100%, 50% 100%, 50% 100%, 100% 100%, 100% 100%, 0% 100%)'
  });

  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      invalidateOnRefresh: true,
    }
  });

  // Step 1 (The Stair Step): Morph from flat bottom to 50% stair
  entranceTl.to(aboutSection, {
    clipPath: 'polygon(0% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%)',
    ease: 'none',
    duration: 0.5
  });

  // Step 2 (Full Reveal): Morph from stair to full rectangle
  entranceTl.to(aboutSection, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)',
    ease: 'none',
    duration: 0.5
  });

  // 2. Pinned 3-Vertical-Slice Morphing Sequence
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => '+=' + (window.innerHeight * 2.5),
      invalidateOnRefresh: true,
    }
  });

  // --- TRANSITION 1 (Part 01 -> Part 02) ---
  // Reveal Layer 2 slices (clip-path: inset(0% 0 0 0)) with stagger 0.15 (bottom to top)
  aboutTl
    .to(text1, {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => { gsap.set(text1, { pointerEvents: 'none' }); }
    }, 'trans1')
    .to(text2, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      onStart: () => { gsap.set(text2, { pointerEvents: 'auto' }); }
    }, 'trans1+=0.15')
    .to(slices2, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.75,
      stagger: 0.15,
      ease: 'power2.inOut'
    }, 'trans1')
    .to({}, { duration: 0.4 }); // Hold reading pause

  // --- TRANSITION 2 (Part 02 -> Part 03) ---
  // Reveal Layer 3 slices (clip-path: inset(0% 0 0 0)) with stagger 0.15 (bottom to top)
  aboutTl
    .to(text2, {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => { gsap.set(text2, { pointerEvents: 'none' }); }
    }, 'trans2')
    .to(text3, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      onStart: () => { gsap.set(text3, { pointerEvents: 'auto' }); }
    }, 'trans2+=0.15')
    .to(slices3, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.75,
      stagger: 0.15,
      ease: 'power2.inOut'
    }, 'trans2')
    .to({}, { duration: 0.4 }); // Final hold
}

// Initialize on DOM ready
initNavDrawer();
initHeroAnimations();
initScrollBtn();
initAboutPinnedTimeline();
