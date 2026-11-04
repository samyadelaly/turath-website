/**
 * TURATH (تراث) — Master Engine
 * - Luxury Navigation & Menu Overlay Interactions
 * - GSAP ScrollTrigger Synchronized Gold Sheet Rise & Fade-Out
 * - TURATH Wordmark Docking to Top Navbar on the LEFT next to Menu Icon
 * - Day / Night Hero Crossfade
 */

// Capture requested deep link hash immediately before any ScrollTrigger can overwrite it
const initialHashRaw = (window.location.hash || '').replace(/^[#/]+/, '').trim().toLowerCase();
let isInitialJumpPending = Boolean(initialHashRaw);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Prevent initial native jump while page and GSAP layouts are preparing
if (initialHashRaw) {
  window.scrollTo(0, 0);
}
if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.clearScrollMemory) {
  ScrollTrigger.clearScrollMemory();
}

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { initTurathScrambleAnimation } from './artwork.js';
import { setupFormHandler } from './formHandler.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });
if (ScrollTrigger.clearScrollMemory) {
  ScrollTrigger.clearScrollMemory();
}
ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
window.ScrollTrigger = ScrollTrigger;
window.gsap = gsap;

// Prevent GSAP from refreshing and blurring inputs on mobile keyboard popup
let originalHeight = window.innerHeight;
window.addEventListener("resize", () => {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
  const isInputFocused = activeTag === "input" || activeTag === "textarea";
  
  // Only block if it's a vertical resize (like a keyboard) AND user is typing
  if (isInputFocused && window.innerWidth === document.documentElement.clientWidth) {
    return; 
  }
});

// Preserve horizontal track scroll positions across GSAP recalculations & unpin cycles
let savedCollectionsScrollLeft = 0;
let savedSlatsScrollLeft = 0;

// To be bulletproof with GSAP ScrollTrigger:
ScrollTrigger.addEventListener("refreshInit", (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
  if (activeTag === "input" || activeTag === "textarea") {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault(); // Stop refresh
    }
  }

  const collectionsTrack = document.querySelector('.collections-track');
  if (collectionsTrack && collectionsTrack.scrollLeft > 0) {
    savedCollectionsScrollLeft = collectionsTrack.scrollLeft;
  }
  const slatsTrack = document.getElementById("video-slats-track");
  if (slatsTrack && slatsTrack.scrollLeft > 0) {
    savedSlatsScrollLeft = slatsTrack.scrollLeft;
  }
});

ScrollTrigger.addEventListener("refresh", () => {
  const collectionsTrack = document.querySelector('.collections-track');
  if (collectionsTrack && savedCollectionsScrollLeft > 0) {
    collectionsTrack.scrollLeft = savedCollectionsScrollLeft;
  }
  const slatsTrack = document.getElementById("video-slats-track");
  if (slatsTrack && savedSlatsScrollLeft > 0) {
    slatsTrack.scrollLeft = savedSlatsScrollLeft;
  }
});

// Bulletproof protection: prevent direct ScrollTrigger.refresh() calls while typing
const originalRefresh = ScrollTrigger.refresh.bind(ScrollTrigger);
ScrollTrigger.refresh = function(safe) {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
  if (activeTag === "input" || activeTag === "textarea") {
    return;
  }
  return originalRefresh(safe);
};

// 1. Navigation Menu Overlay Interactions
function initNavDrawer() {
  const menuTrigger = document.getElementById('menu-trigger');
  const navDrawer = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('nav-close-btn');
  const navLinks = document.querySelectorAll('.nav-menu-link');

  if (navDrawer) {
    gsap.set(navDrawer, { yPercent: 100, y: 0, visibility: 'hidden', pointerEvents: 'none' });
  }

  let menuTl = null;

  function openMenu() {
    document.body.classList.add('menu-open');
    if (menuTrigger) menuTrigger.setAttribute('aria-expanded', 'true');
    if (navDrawer) navDrawer.setAttribute('aria-hidden', 'false');

    if (menuTl) menuTl.kill();
    menuTl = gsap.timeline();

    gsap.set(navDrawer, { visibility: 'visible', pointerEvents: 'auto' });
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.normalizeScroll) {
      ScrollTrigger.normalizeScroll(false);
    }
    menuTl.fromTo(navDrawer, {
      yPercent: 100,
      y: 0
    }, {
      yPercent: 0,
      y: 0,
      duration: 0.75,
      ease: 'power4.out'
    });

    menuTl.fromTo(navLinks, {
      y: 24,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.05,
      ease: 'power3.out'
    }, '-=0.4');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuTrigger) menuTrigger.setAttribute('aria-expanded', 'false');
    if (navDrawer) navDrawer.setAttribute('aria-hidden', 'true');

    if (menuTl) menuTl.kill();
    menuTl = gsap.timeline({
      onComplete: () => {
        gsap.set(navDrawer, { visibility: 'hidden', pointerEvents: 'none' });
        if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.normalizeScroll) {
          ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
        }
      }
    });

    menuTl.to(navDrawer, {
      yPercent: 100,
      y: 0,
      duration: 0.5,
      ease: 'power4.in'
    });
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

    const idToSemantic = {
    'scene-01': 'home',
    'scene-02': 'about',
    'scene-03': 'gallery',
    'bespoke': 'bespoke',
    'scene-05': 'masterpieces',
    'scene-06': 'craftsmanship',
    'scene-07': 'founder',
    'contact': 'contact'
  };

  const semanticToId = {
    'home': 'scene-01',
    'about': 'scene-02',
    'gallery': 'scene-03',
    'bespoke': 'bespoke',
    'masterpieces': 'scene-05',
    'craftsmanship': 'scene-06',
    'founder': 'scene-07',
    'contact': 'contact',
    'scene-01': 'scene-01',
    'scene-02': 'scene-02',
    'scene-03': 'scene-03',
    'scene-05': 'scene-05',
    'scene-06': 'scene-06',
    'scene-07': 'scene-07',
    'hero': 'scene-01'
  };

  function smoothScrollToSemanticHash(semanticHash) {
    if (!semanticHash) return;
    const cleanHash = semanticHash.replace(/^#/, '');
    const realId = semanticToId[cleanHash] || cleanHash;

    if (realId === 'scene-01') {
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: false },
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', '#home');
          }
        }
      });
      return;
    }

    if (realId === 'contact') {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const triggers = ScrollTrigger.getAll().filter(t => t.trigger === contactEl);
        const contactST = triggers.find(t => t.vars && t.vars.end === 'top top') || triggers[0];
        const targetY = contactST && typeof contactST.end === 'number'
          ? contactST.end
          : (contactEl.getBoundingClientRect().top + window.scrollY);
        gsap.to(window, {
          scrollTo: { y: targetY, autoKill: false },
          duration: 1.2,
          ease: 'power2.inOut',
          onComplete: () => {
            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, '', '#contact');
            }
          }
        });
        return;
      }
    }

    if (realId === 'scene-07' || realId === 'founder') {
      const founderEl = document.getElementById('scene-07');
      if (founderEl) {
        const triggers = ScrollTrigger.getAll().filter(t => t.trigger === founderEl);
        const st = triggers.find(t => t.pin) || triggers[0];
        // Target 65% of the pinned illumination crossfade where the founder & lamp are 100% lit
        const targetY = st && typeof st.start === 'number'
          ? (st.start + (st.end - st.start) * 0.65)
          : (founderEl.getBoundingClientRect().top + window.scrollY);
        gsap.to(window, {
          scrollTo: { y: targetY, autoKill: false },
          duration: 1.2,
          ease: 'power2.inOut',
          onComplete: () => {
            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, '', '#founder');
            }
          }
        });
        return;
      }
    }

    const target = document.getElementById(realId);
    if (!target) return;

    const allMatching = ScrollTrigger.getAll().filter(t => {
      if (!t.trigger) return false;
      const triggerEl = typeof t.trigger === 'string' ? document.querySelector(t.trigger) : t.trigger;
      return triggerEl === target || (t.pin && triggerEl && triggerEl.contains && triggerEl.contains(target));
    });
    const st = allMatching.find(t => t.pin || (t.vars && t.vars.start === 'top top')) || allMatching[0];
    const targetY = st && typeof st.start === 'number' ? st.start : (target.getBoundingClientRect().top + window.scrollY);

    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        const semanticName = idToSemantic[realId] || realId;
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + semanticName);
        }
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        smoothScrollToSemanticHash(href);
      } else {
        closeMenu();
      }
    });
  });

  // Desktop navbar links smooth scroll integration
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-menu a[href^="#"]');
  desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollToSemanticHash(href);
      }
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
  const hero = document.getElementById('scene-01') || document.getElementById('hero');
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
      color: '#FFFFFF'
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
      trigger: hero || '#scene-01',
      start: 'top top',
      end: 'bottom top',
      pin: true,
      pinSpacing: false,
      scrub: 1,
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

  // 4. Text Fade-out: headlines, eyebrow & bottom content translate up and fade out
  heroTl.to('.hero-eyebrow, .hero-headline-1, .hero-headline-2, .hero-bottom-content', {
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
    gsap.set(scrollBtn, { pointerEvents: 'auto', cursor: 'pointer' });
    heroTl.to(scrollBtn, {
      autoAlpha: 0,
      scale: 0.7,
      ease: 'power1.out',
      duration: 0.35
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
    trigger: '#scene-02',
    start: 'top 60px',
    onEnter: () => siteHeader && siteHeader.classList.add('is-scrolled'),
    onLeaveBack: () => siteHeader && siteHeader.classList.remove('is-scrolled'),
    onRefresh: (self) => {
      if (self.progress > 0 && siteHeader) {
        siteHeader.classList.add('is-scrolled');
      }
    }
  });

  // Recalculate docking targets on resize (safely ignoring mobile keyboard popups)
  window.addEventListener('resize', () => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    const isInputFocused = activeTag === "input" || activeTag === "textarea";
    if (isInputFocused && window.innerWidth === document.documentElement.clientWidth) {
      return; 
    }
    ScrollTrigger.refresh();
  });
}

// 3. Interactive Scroll Button
function initScrollBtn() {
  const scrollBtn = document.getElementById('hero-scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const scene02 = document.getElementById('scene-02');
      if (scene02) {
        scene02.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// 4. Scene 02 — Full-Screen About Turath (3-Slice Stagger Entrance & 3-Slice Morphing)
function initAboutPinnedTimeline() {
  const aboutSection = document.getElementById('scene-02');
  if (!aboutSection) return;

  const text1 = document.getElementById('about-text-1');
  const text2 = document.getElementById('about-text-2');
  const text3 = document.getElementById('about-text-3');

  const slices1 = document.querySelectorAll('#about-layer-1 .about-vertical-slice');
  const slices2 = document.querySelectorAll('#about-layer-2 .about-vertical-slice');
  const slices3 = document.querySelectorAll('#about-layer-3 .about-vertical-slice');
  const floatingText = document.getElementById('about-floating-text');
  const aboutDashes = document.querySelectorAll('#scene-02 .dash-indicator');
  const pagination = document.querySelector('.about-pagination');

  if (!text1 || !text2 || !text3) return;

  // Set initial states
  gsap.set(text1, { opacity: 1, y: 0, pointerEvents: 'auto' });
  gsap.set([text2, text3], { opacity: 0, y: 25, pointerEvents: 'none' });
  gsap.set([slices1, slices2, slices3], { clipPath: 'inset(100% 0% 0% 0%)' });

  // 1. Scene 02 Entrance: 3 Vertical Slices Staggering Upwards Over Hero
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-02',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      invalidateOnRefresh: true,
    }
  });

  // Layer 1's 3 vertical slices enter from the bottom staggering upwards
  entranceTl.to(slices1, {
    clipPath: 'inset(0% 0% 0% 0%)',
    stagger: 0.15,
    ease: 'power2.inOut',
    duration: 0.85
  }, 0);

  // Floating text & Pagination dash bar rise and fade in
  if (floatingText) {
    entranceTl.fromTo([floatingText, pagination].filter(Boolean), {
      opacity: 0,
      y: 35
    }, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.4
    }, 0.45);
  }

  // 2. 3-Vertical-Slice Morphing Sequence scrubbed over #about-spacer
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about-spacer',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!aboutDashes.length) return;
        const activeIndex = Math.min(2, Math.floor(self.progress * 3));
        aboutDashes.forEach((dash, i) => {
          dash.classList.toggle('active', i === activeIndex);
        });
      }
    }
  });

  // Dash click navigation for Scene 02
  aboutDashes.forEach((dash, i) => {
    dash.addEventListener('click', () => {
      const st = aboutTl.scrollTrigger;
      if (st) {
        const scrollPos = st.start + ((st.end - st.start) * (i / 2));
        gsap.to(window, {
          scrollTo: { y: scrollPos, autoKill: false },
          duration: 1,
          ease: 'power2.inOut'
        });
      }
    });
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
    }, 'trans1');

  aboutTl.to({}, { duration: 0.2 }); // Hold reading pause

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
    }, 'trans2');

  aboutTl.to({}, { duration: 0.2 }); // Final hold
  aboutTl.to({}, { duration: 0.25 }); // Seamless handoff to Scene 03
}

// 5. Scene 03: Our Collections Horizontal Scroll Gallery
function initCollectionsHorizontalScroll() {
  const collectionsSection = document.getElementById('scene-03');
  const collectionsTrack = document.querySelector('.collections-track');
  const collectionsWrapper = document.querySelector('.collections-wrapper');
  const dashes = document.querySelectorAll('#scene-03 .dash-indicator');

  if (collectionsTrack && collectionsSection) {
    // Architectural Layered Scrolling (Scene 03 slides OVER Scene 02 smoothly without jumping)
    ScrollTrigger.create({
      trigger: "#scene-02",
      start: "top top",
      endTrigger: "#scene-03",
      end: "top top",
      pin: true,
      pinSpacing: false
    });
    gsap.to("#scene-02", {
      scale: 0.95,
      opacity: 0.3,
      scrollTrigger: {
        trigger: "#scene-03",
        start: "top bottom",
        end: "top top",
        scrub: true
      }
    });

    /*
     * GSAP ScrollTrigger code for scene-03 that pinned and scrubbed the collections horizontally
     * has been removed to restore standard vertical page scrolling.
     * The collections gallery now operates as a native horizontal scroller with CSS snap-points.
     */

    // Minimalist Arrow Buttons navigation (David Thulstrup style)
    const prevArrow = document.getElementById('collections-prev-arrow');
    const nextArrow = document.getElementById('collections-next-arrow');
    const trackPrevBtn = document.getElementById('track-prev-btn');
    const trackNextBtn = document.getElementById('track-next-btn');

    // Restore saved collections scroll position if available
    try {
      const savedPos = sessionStorage.getItem('turath_collections_scroll');
      if (savedPos && collectionsTrack) {
        const parsed = parseFloat(savedPos);
        if (!isNaN(parsed) && parsed > 0) {
          requestAnimationFrame(() => {
            collectionsTrack.scrollLeft = parsed;
          });
        }
      }
    } catch (e) {}

    let scrollSaveTimer = null;
    collectionsTrack.addEventListener('scroll', () => {
      clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(() => {
        try {
          if (collectionsTrack.scrollLeft > 0) {
            sessionStorage.setItem('turath_collections_scroll', collectionsTrack.scrollLeft.toString());
          }
        } catch (e) {}
      }, 150);
    }, { passive: true });

    function scrollCollections(direction) {
      const card = collectionsTrack.querySelector('.collection-card');
      const scrollStep = card ? (card.offsetWidth + 16) : (collectionsTrack.clientWidth * 0.8);
      collectionsTrack.scrollBy({
        left: direction * scrollStep,
        behavior: 'smooth'
      });
    }

    if (prevArrow) prevArrow.addEventListener('click', () => scrollCollections(-1));
    if (nextArrow) nextArrow.addEventListener('click', () => scrollCollections(1));
    if (trackPrevBtn) trackPrevBtn.addEventListener('click', () => scrollCollections(-1));
    if (trackNextBtn) trackNextBtn.addEventListener('click', () => scrollCollections(1));

    // Native scroll update for dashes
    collectionsTrack.addEventListener('scroll', () => {
      if (!dashes.length) return;
      const cards = collectionsTrack.querySelectorAll('.collection-card');
      const trackCenter = collectionsTrack.scrollLeft + collectionsTrack.clientWidth / 2;
      let activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(trackCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = idx;
        }
      });

      dashes.forEach((dash, i) => {
        dash.classList.toggle('active', i === activeIndex);
      });
    }, { passive: true });

    // Dash click navigation for Scene 03 (9 cards)
    dashes.forEach((dash, i) => {
      dash.addEventListener('click', () => {
        const cards = collectionsTrack.querySelectorAll('.collection-card');
        if (cards[i]) {
          cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    // Collections sequential fade in only
    gsap.fromTo(".collections-text-anim", 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.2, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".collections-text-anim", // triggers when the text reaches viewport
          start: "top 85%",
          once: true // Fades in only once and stays permanently visible
        }
      }
    );
  }
}

// 6. Scene 03 -> Scene 04: Pin Scene 03 (No Fade), 3-Slice Entrance
function initBespokeTransition() {
  const bespokeSection = document.getElementById('bespoke');
  const bespokeSlices = document.querySelectorAll('#bespoke .b-slice');
  const bespokeContent = document.getElementById('bespoke-content');
  const bespokeForm = document.getElementById('bespoke-form');

  if (!bespokeSection) return;

  // Pin Scene 03 safely with anticipatePin, staying fully visible as Bespoke covers it
  ScrollTrigger.create({
    trigger: "#scene-03",
    start: () => window.innerWidth >= 1024 ? "bottom bottom" : "top top",
    endTrigger: "#bespoke",
    end: "top top",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1 // Prevents jitter on pin entry
  });

  // 3 Vertical Slices Entrance: Staggering Upwards
  if (bespokeSlices.length) {
    gsap.set(bespokeSlices, { clipPath: 'inset(100% 0% 0% 0%)' });
    if (bespokeForm) {
      gsap.set(bespokeForm, { opacity: 0, y: 35 });
    }

    const bespokeEntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#bespoke',
        start: 'top bottom',
        end: 'top top',
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });

    // 1. 3 vertical slices enter with staggered clipPath inset (fully level before text starts)
    bespokeEntranceTl.to(bespokeSlices, {
      clipPath: 'inset(0% 0% 0% 0%)',
      stagger: 0.12,
      ease: 'power2.inOut',
      duration: 0.70
    }, 0);

    // 2. Bespoke form rises and fades in smoothly as slices enter
    if (bespokeForm) {
      bespokeEntranceTl.to(bespokeForm, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 0.45
      }, 0.5);
    }
  }

  // Balanced & elegant fade in for Bespoke texts - starts after slices are fully risen and level
  gsap.fromTo(".bespoke-text-anim", 
    { opacity: 0, y: 25 },
    { 
      opacity: 1, 
      y: 0, 
      stagger: 0.5, // 0.5s delay before subtitle begins
      duration: 2.0,  // 2.0s smooth & elegant fade
      ease: "power2.out", // Smooth luxury deceleration
      scrollTrigger: {
        trigger: "#bespoke", 
        start: "top 25px", // Starts ONLY after all 3 slices have completely risen and reached the exact same level
        toggleActions: "play none none reverse" // Plays fully once triggered, reverses gracefully if scrolled all the way back up
      }
    }
  );
}

// 7. Bespoke Manufacturing Inquiry Form (Secure Serverless Fetch)
function initBespokeForm() {
  const form = document.getElementById('bespoke-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  if (form) {
    setupFormHandler(form, {
      successElement: successMsg,
      errorElement: errorMsg,
      submitButton: form.querySelector('button[type="submit"]')
    });
  }
}


// 8. SECTION 05: FEATURED PRODUCTS (Historical Scene 04 Architecture)

/**
 * Lazy loads video media and manages playback via IntersectionObserver
 * so heavy background videos never block initial page load or waste mobile resources.
 */
function initLazyVideo(video) {
  if (!video) return;

  const loadMedia = () => {
    let needsLoad = false;
    if (video.dataset.src && !video.getAttribute('src')) {
      video.src = video.dataset.src;
      needsLoad = true;
    }
    const sources = video.querySelectorAll('source[data-src]');
    sources.forEach(srcEl => {
      if (!srcEl.getAttribute('src') && srcEl.dataset.src) {
        srcEl.src = srcEl.dataset.src;
        needsLoad = true;
      }
    });
    if (needsLoad) {
      video.load();
    }
  };

  const playMedia = () => {
    loadMedia();
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  };

  const pauseMedia = () => {
    if (!video.paused) {
      video.pause();
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playMedia();
        } else {
          pauseMedia();
        }
      });
    }, {
      rootMargin: '250px 0px',
      threshold: 0.05
    });
    observer.observe(video);
  } else {
    playMedia();
  }
}

function initFeaturedProducts() {
  const scene05 = document.querySelector("#scene-05");
  const s04Video = document.getElementById('scene04-video');
  const card = document.getElementById('scene05-content-card') || document.querySelector('.scene05-warm-glass-card');
  const ctaBtn = document.querySelector('.scene05-single-cta');

  if (!scene05) return;

  // Pin Scene 04 (Bespoke) so Scene 05 slides over it strictly as a curtain
  const bespokeSection = document.querySelector("#bespoke") || document.querySelector("#scene-04");
  if (bespokeSection) {
    ScrollTrigger.create({
      trigger: bespokeSection,
      start: "top top",
      endTrigger: scene05 || undefined,
      end: scene05 ? "top top" : "+=100%",
      pin: true,
      pinSpacing: false, // Strict curtain reveal: stays pinned until covered by Scene 05
      anticipatePin: 1
    });
  }

  // Geometric 2-step morphing reveal for Scene 05
  // Initial state: A 2-step geometric staircase starting from bottom
  gsap.set(scene05, { 
    clipPath: "polygon(0% 100%, 0% 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0%, 100% 0%, 100% 100%)" 
  });

  // Morph to a full rectangle as it scrolls over Section 4
  gsap.to(scene05, {
    clipPath: "polygon(0% 100%, 0% 0%, 33% 0%, 33% 0%, 66% 0%, 66% 0%, 100% 0%, 100% 100%)",
    ease: "none",
    scrollTrigger: {
      trigger: scene05,
      start: "top bottom", // Starts when top of scene 5 hits bottom of viewport
      end: "top top",      // Ends when top of scene 5 hits top of viewport
      scrub: 1             // Smooth tied-to-scroll animation
    }
  });

  // Deferred Video Lazy Loading & Parallax Zoom
  if (s04Video) {
    initLazyVideo(s04Video);

    // Video parallax zoom
    gsap.fromTo(s04Video,
      { scale: 1.08 },
      {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: scene05,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  // Warm Glass Content Card Entrance Animation
  if (card) {
    gsap.fromTo(card,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: scene05,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Pin Scene 05 when it settles at the top, allowing Scene 06 to climb strictly over it
  const scene06 = document.querySelector("#scene-06");
  if (scene06) {
    ScrollTrigger.create({
      trigger: scene05,
      start: "top top",
      endTrigger: scene06,
      end: "top top",
      pin: true,
      pinSpacing: false, // Strict curtain reveal: stays pinned until covered by Scene 06
      anticipatePin: 1
    });
  }
}

// 9. SECTION 06: TURATH IN ACTION / CRAFT IN MOTION (Vertical Slats & Workshop Films)
function initScene06() {
  const scene06 = document.querySelector("#scene-06");
  if (!scene06) return;

  // Geometric 2-step morphing reveal for Scene 06 as it ascends over Scene 05
  gsap.set(scene06, { 
    clipPath: "polygon(0% 100%, 0% 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0%, 100% 0%, 100% 100%)" 
  });

  gsap.to(scene06, {
    clipPath: "polygon(0% 100%, 0% 0%, 33% 0%, 33% 0%, 66% 0%, 66% 0%, 100% 0%, 100% 100%)",
    ease: "none",
    scrollTrigger: {
      trigger: scene06,
      start: "top bottom",
      end: "top top",
      scrub: 1.5           // Smooth tied-to-scroll animation with inertia
    }
  });

  // Staggered vertical rise and fade-in for the 5 video slats
  const slats = document.querySelectorAll(".video-slat-item");
  if (slats.length > 0) {
    gsap.fromTo(slats,
      { y: 70, opacity: 0.15 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: scene06,
          start: "top 75%",
          end: "top 20%",
          scrub: 1.5
        }
      }
    );

    // Lazy-load and play video slats strictly on viewport intersection
    const slatVideos = document.querySelectorAll(".slat-video");
    slatVideos.forEach(vid => {
      initLazyVideo(vid);
    });
  }

  // Arrow navigation buttons for Section 6 video slats (identical interaction to Collections)
  const slatsTrack = document.getElementById("video-slats-track");
  const slatsPrevBtn = document.getElementById("slats-prev-btn");
  const slatsNextBtn = document.getElementById("slats-next-btn");

  function scrollSlats(direction) {
    if (!slatsTrack) return;
    const card = slatsTrack.querySelector(".video-slat-item");
    const step = card ? (card.offsetWidth + 20) : (slatsTrack.clientWidth * 0.7);
    slatsTrack.scrollBy({
      left: direction * step,
      behavior: "smooth"
    });
  }

  if (slatsPrevBtn) {
    slatsPrevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      scrollSlats(-1);
    });
  }
  if (slatsNextBtn) {
    slatsNextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      scrollSlats(1);
    });
  }

  // Pin Scene 06 strictly so Scene 07 climbs over it as a curtain
  const scene07 = document.querySelector("#scene-07");
  ScrollTrigger.create({
    trigger: scene06,
    start: "top top",
    endTrigger: scene07 || undefined,
    end: scene07 ? "top top" : "+=100%",
    pin: true,
    pinSpacing: false, // Strict curtain reveal: stays pinned until covered by Scene 07
    anticipatePin: 1
  });
}

// 10. SECTION 07: FOUNDER (SAMY ADEL ABDALLAH / SCROLL-DRIVEN ILLUMINATION CROSSFADE)
function initScene07() {
  const scene07 = document.querySelector("#scene-07");
  const litPlate = document.getElementById("founder-plate-lit");
  const card = document.querySelector(".founder-editorial-card");

  if (!scene07) return;

  // Staggered fade in as section 07 scrolls into view over section 06
  gsap.fromTo(scene07,
    { opacity: 0.8 },
    {
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: scene07,
        start: "top bottom",
        end: "top 30%",
        scrub: 1.5
      }
    }
  );

  // Pinned Dwell Phase: Section 07 pins at top throughout the 150vh scroll gap before Contact arrives
  const contact = document.querySelector("#contact");
  const founderTL = gsap.timeline({
    scrollTrigger: {
      trigger: scene07,
      start: "top top",
      endTrigger: contact || undefined,
      end: contact ? "top top" : "+=200vh", // Extended end matching the 150vh gap (e.g. +=200vh+)
      pin: true,
      pinSpacing: false, // Strict curtain reveal: stays pinned until covered by Contact
      scrub: 1.5,
      anticipatePin: 1
    }
  });

  // Day/Night Lamp illumination: fades slowly as the user scrolls through the 150vh gap
  if (litPlate) {
    founderTL.fromTo(litPlate,
      { opacity: 0 },
      { opacity: 1, ease: "power1.inOut", duration: 1.5 }
    );
    // Hold lit plate fully illuminated while Contact ascends over it
    founderTL.to({}, { duration: 1.0 });
  }

  // Editorial card subtle upward float
  if (card) {
    gsap.fromTo(card,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: scene07,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
}

// 11. SECTION 08: CONTACT TURATH (DYNAMIC CORNER MORPHING & OVERLAP SCROLL)
function initContactSection() {
  const contact = document.querySelector("#contact");
  if (!contact) return;

  // Initial corner styling: extreme circular dome radius 50vw 50vw 0 0
  gsap.set(contact, {
    borderTopLeftRadius: "50vw",
    borderTopRightRadius: "50vw"
  });

  // Extreme Circular Dome Morphing Animation:
  // Starts as a massive circular dome (50vw radius) rising up from bottom of viewport,
  // morphing down to 0px (sharp full-width rectangular container) when docked at top.
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
        start: "top bottom", // Starts as top of Contact enters bottom of viewport
        end: "top top",      // Ends when Contact reaches top of viewport
        scrub: 1.2           // Smooth inertia scrub
      }
    }
  );
}

// 12. PHONE DROPDOWN (CALL & WHATSAPP)
function initPhoneDropdown() {
  const trigger = document.getElementById("phone-trigger");
  const options = document.getElementById("phone-options");
  const chevron = document.getElementById("phone-chevron");

  if (!trigger || !options) return;

  function toggleDropdown(show) {
    const isHidden = options.classList.contains("opacity-0");
    const shouldOpen = typeof show === "boolean" ? show : isHidden;

    if (shouldOpen) {
      options.classList.remove("opacity-0", "invisible", "scale-95");
      options.classList.add("opacity-100", "scale-100");
      trigger.setAttribute("aria-expanded", "true");
      if (chevron) chevron.classList.add("rotate-180");
    } else {
      options.classList.add("opacity-0", "invisible", "scale-95");
      options.classList.remove("opacity-100", "scale-100");
      trigger.setAttribute("aria-expanded", "false");
      if (chevron) chevron.classList.remove("rotate-180");
    }
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  document.addEventListener("click", (e) => {
    if (!trigger.contains(e.target) && !options.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleDropdown(false);
    }
  });
}


// 13. SEMANTIC URL HASH MAPPING & ACTIVE NAV TRACKER
function initSemanticHashTracking() {
  const sections = [
    { id: 'scene-01', hash: 'home' },
    { id: 'scene-02', hash: 'about' },
    { id: 'scene-03', hash: 'gallery' },
    { id: 'bespoke',  hash: 'bespoke' },
    { id: 'scene-05', hash: 'masterpieces' },
    { id: 'scene-06', hash: 'craftsmanship' },
    { id: 'scene-07', hash: 'founder' },
    { id: 'contact',  hash: 'contact' }
  ];

  let currentSemanticHash = '';

  function setSemanticHash(semanticName) {
    if (isInitialJumpPending) return;
    if (currentSemanticHash === semanticName) return;
    currentSemanticHash = semanticName;
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + semanticName);
    }
    document.querySelectorAll('.nav-menu-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + semanticName) {
        link.classList.add('active');
      } else if (href && href.startsWith('#')) {
        link.classList.remove('active');
      }
    });
  }

  sections.forEach(({ id, hash }) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setSemanticHash(hash),
      onEnterBack: () => setSemanticHash(hash)
    });
  });
}


// 14. Dynamic Share Button for Active Product
function initDynamicShareButton() {
  const shareBtns = document.querySelectorAll('#share-btn, .share-btn');
  shareBtns.forEach(shareBtn => {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Identify active product in viewport
      const items = Array.from(document.querySelectorAll('[id*="-item-"], .product-container, .swiper-slide-active, .product-slide'));
      let activeItem = null;
      let minDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeItem = item;
        }
      });

      if (activeItem && activeItem.id) {
        const shareUrl = `${window.location.origin}/products/${activeItem.id}/`;
        if (navigator.share) {
          navigator.share({ title: 'Turath Egypt', url: shareUrl }).catch(console.error);
        } else {
          navigator.clipboard.writeText(shareUrl);
        }
      }
    });
  });
}

initNavDrawer();
initHeroAnimations();
initScrollBtn();
initAboutPinnedTimeline();
initCollectionsHorizontalScroll();
initBespokeTransition();
initBespokeForm();
initFeaturedProducts();
initScene06();
initScene07();
initContactSection();
initPhoneDropdown();
initSemanticHashTracking();
initDynamicShareButton();
initTouchDragThreshold();
initAnalyticsTracking();
initMediaProtection();

// Function to handle initial deep link hash navigation
function handleInitialDeepLink() {
  const hashToResolve = initialHashRaw || (window.location.hash || '').replace(/^[#/]+/, '').trim().toLowerCase();
  if (!hashToResolve) return;

  const semanticToId = {
    'home': 'scene-01',
    'about': 'scene-02',
    'gallery': 'scene-03',
    'bespoke': 'bespoke',
    'masterpieces': 'scene-05',
    'craftsmanship': 'scene-06',
    'founder': 'scene-07',
    'contact': 'contact',
    'scene-01': 'scene-01',
    'scene-02': 'scene-02',
    'scene-03': 'scene-03',
    'scene-05': 'scene-05',
    'scene-06': 'scene-06',
    'scene-07': 'scene-07',
    'hero': 'scene-01'
  };

  const realId = semanticToId[hashToResolve] || hashToResolve;
  const target = document.getElementById(realId);
  if (!target) return;

  let targetY = 0;
  if (realId === 'scene-01' || realId === 'home') {
    targetY = 0;
  } else if (realId === 'contact') {
    const triggers = ScrollTrigger.getAll().filter(t => t.trigger === target);
    const contactST = triggers.find(t => t.vars && t.vars.end === 'top top') || triggers[0];
    targetY = contactST && typeof contactST.end === 'number'
      ? contactST.end
      : (target.getBoundingClientRect().top + window.scrollY);
  } else if (realId === 'scene-07' || realId === 'founder') {
    const triggers = ScrollTrigger.getAll().filter(t => t.trigger === target);
    const st = triggers.find(t => t.pin) || triggers[0];
    targetY = st && typeof st.start === 'number'
      ? (st.start + (st.end - st.start) * 0.65)
      : (target.getBoundingClientRect().top + window.scrollY);
  } else {
    const allMatching = ScrollTrigger.getAll().filter(t => {
      if (!t.trigger) return false;
      const triggerEl = typeof t.trigger === 'string' ? document.querySelector(t.trigger) : t.trigger;
      return triggerEl === target || (t.pin && triggerEl && triggerEl.contains && triggerEl.contains(target));
    });

    const st = allMatching.find(t => t.pin || (t.vars && t.vars.start === 'top top')) || allMatching[0];
    targetY = st && typeof st.start === 'number' ? st.start : (target.getBoundingClientRect().top + window.scrollY);
  }

  // Instant jump with GSAP (duration: 0) to prevent visible scrolling
  gsap.to(window, {
    scrollTo: { y: targetY, autoKill: false },
    duration: 0,
    overwrite: 'all'
  });
  window.scrollTo(0, targetY);

  const idToSemantic = {
    'scene-01': 'home',
    'scene-02': 'about',
    'scene-03': 'gallery',
    'bespoke': 'bespoke',
    'scene-05': 'masterpieces',
    'scene-06': 'craftsmanship',
    'scene-07': 'founder',
    'contact': 'contact'
  };
  const semanticName = idToSemantic[realId] || hashToResolve;
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', '#' + semanticName);
  }

  document.querySelectorAll('.nav-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + semanticName) {
      link.classList.add('active');
    } else if (href && href.startsWith('#')) {
      link.classList.remove('active');
    }
  });

  setTimeout(() => {
    isInitialJumpPending = false;
  }, 100);
}

// Stabilize GSAP calculations and safely handle cross-page anchor navigation
// Premium Knockout Preloader hide logic
function hideLuxuryPreloader() {
  const preloader = document.getElementById('luxury-preloader');
  if (!preloader || preloader.dataset.hiding === 'true') return;
  preloader.dataset.hiding = 'true';
  setTimeout(() => {
    preloader.classList.add('opacity-0', 'pointer-events-none');
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => {
      preloader.remove();
    }, 1000);
  }, 1200);
}

// Window load handler: refresh ScrollTrigger strictly after all images & window assets are fully loaded
let isWindowAssetsLoaded = false;

function onWindowAssetsLoaded() {
  if (isWindowAssetsLoaded) return;
  isWindowAssetsLoaded = true;

  // 1. Hide the preloader once all images and window assets are fully loaded
  hideLuxuryPreloader();

  // 2. Reveal body after assets are loaded
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
    document.body.classList.remove('opacity-0');
    document.body.classList.add('page-loaded');
  });

  // 3. Strictly call ScrollTrigger.refresh() AFTER all images and window assets are fully loaded,
  // with a 500ms timeout to ensure complete DOM stability and layout settling
  setTimeout(() => {
    ScrollTrigger.refresh(true);

    // Handle hash navigation instantly using GSAP with accurate section offsets
    if (initialHashRaw || window.location.hash) {
      handleInitialDeepLink();
    }

    // Deep scrolling logic for product query parameters (?product=...)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
      const targetElement = document.getElementById(productId);
      if (targetElement) {
        requestAnimationFrame(() => {
          gsap.to(window, {
            scrollTo: { y: "#" + productId, offsetY: 50 },
            duration: 1,
            ease: "power3.out"
          });
        });
      }
    }
  }, 500);
}

if (document.readyState === 'complete') {
  onWindowAssetsLoaded();
} else {
  window.addEventListener('load', onWindowAssetsLoaded);
}

// Safety fallback: ensure preloader hides, body reveals, and layout settles even if an asset hangs
setTimeout(() => {
  if (!isWindowAssetsLoaded) {
    onWindowAssetsLoaded();
  }
}, 3500);


// ==========================================================================
// 14. ROBUST LAYOUT RECALCULATION ON IMAGE & DOM HEIGHT CHANGES
// ==========================================================================
let refreshDebounceTimer = null;
function debouncedScrollTriggerRefresh(delay = 150) {
  if (refreshDebounceTimer) clearTimeout(refreshDebounceTimer);
  refreshDebounceTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}

// 1. ResizeObserver on document.body: recalculate whenever body height changes
if (typeof ResizeObserver !== 'undefined' && document.body) {
  let lastBodyHeight = 0;
  const bodyResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const currentHeight = entry.contentRect.height;
      if (lastBodyHeight !== 0 && Math.abs(currentHeight - lastBodyHeight) > 2) {
        debouncedScrollTriggerRefresh(150);
      }
      lastBodyHeight = currentHeight;
    }
  });
  bodyResizeObserver.observe(document.body);
}

// 2. Query all <img> elements and attach load listener to handle network latency
document.querySelectorAll('img').forEach((img) => {
  if (img.complete) return;
  img.addEventListener('load', () => {
    debouncedScrollTriggerRefresh(100);
  }, { once: true });
  img.addEventListener('error', () => {
    debouncedScrollTriggerRefresh(100);
  }, { once: true });
});

// 15. DISTINGUISH TOUCH DRAG/SCROLL FROM TAP (COLLECTION & VIDEO CARDS)
function initTouchDragThreshold() {
  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging = false;
  const DRAG_THRESHOLD = 8; // pixels

  window.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = false;
  }, { passive: true, capture: true });

  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      isDragging = true;
    }
  }, { passive: true, capture: true });

  // In capturing phase: cancel click if gesture was a drag or scroll
  window.addEventListener('click', (e) => {
    if (!isDragging) return;
    const targetInteractive = e.target.closest('.collection-card, .video-slat-item, .collections-track a, #video-slats-track a');
    if (targetInteractive) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      isDragging = false;
    }
  }, true);
}

// 16. CONVERSION TRACKING (WHATSAPP, PHONE, CONTACT)
function initAnalyticsTracking() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', { content_name: 'WhatsApp Contact', value: 0, currency: 'EGP' });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'contact', { method: 'WhatsApp' });
      }
    } else if (href.startsWith('tel:')) {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', { content_name: 'Phone Call', value: 0, currency: 'EGP' });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'contact', { method: 'Phone' });
      }
    }
  });

  // PWA App Installation Tracking
  window.addEventListener('appinstalled', () => {
    try {
      localStorage.setItem('turath_pwa_installed', 'true');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'Turath App Installed',
          value: 1
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'PWA_Installed');
      }
    } catch (e) {}
  });

  // PWA Standalone Mode Detection & Session Tracking
  const isPWAStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isPWAStandalone) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('set', 'user_properties', { pwa_user: 'true' });
        window.gtag('event', 'pwa_session_open', {
          event_category: 'PWA',
          event_label: 'App Launch'
        });
      }
    } catch (e) {}
  }
}

// 17. SURGICAL MEDIA PROTECTION (IMAGES & VIDEOS)
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
}
