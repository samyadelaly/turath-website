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
      return { startX: 0, startY: 0, startScale: 1, dockedScale: 0.5 };
    }

    const prevTransform = wordmarkWrap.style.transform;
    wordmarkWrap.style.transform = 'none';

    const pRect = placeholder.getBoundingClientRect();
    const sRect = dockSlot.getBoundingClientRect();

    wordmarkWrap.style.transform = prevTransform;

    const startX = pRect.left - sRect.left;
    const startY = (pRect.top + pRect.height / 2) - (sRect.top + sRect.height / 2);
    const dockedScale = 0.5;

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
      scrub: 0.25,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (siteHeader) {
          if (self.progress >= 0.7) {
            siteHeader.classList.add('is-scrolled');
          } else {
            siteHeader.classList.remove('is-scrolled');
          }
        }
        if (scrambleEngine) {
          scrambleEngine.onScrollProgress(self.progress, window.pageYOffset || document.documentElement.scrollTop);
        }
      }
    }
  });

  // 1. Day / Night Crossfade on Hero Scroll
  if (heroNight) {
    heroTl.to(heroNight, {
      opacity: 1,
      ease: 'none',
      duration: 1
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

  // Wordmark color transitions to light luxury white as it docks into dark navbar
  if (wordmark) {
    heroTl.to(wordmark, {
      color: '#F3F1ED',
      ease: 'power1.inOut',
      duration: 0.5
    }, 0.35);
  }

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

// Initialize on DOM ready
initNavDrawer();
initHeroAnimations();
initScrollBtn();
