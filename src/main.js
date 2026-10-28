/**
 * TURATH (تراث) — Master Engine
 * - Luxury Navigation & Menu Overlay Interactions
 * - GSAP ScrollTrigger Synchronized Gold Sheet Rise & Fade-Out
 * - TURATH Wordmark Docking to Top Navbar on the LEFT next to Menu Icon
 * - Day / Night Hero Crossfade
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { initTurathScrambleAnimation } from './artwork.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
window.ScrollTrigger = ScrollTrigger;
window.gsap = gsap;

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

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      const href = link.getAttribute('href');
      if (href === '#hero' || href === '#scene-01') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Recalculate docking targets on resize
  window.addEventListener('resize', () => {
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

    // Collections sequential fade in/out
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
          toggleActions: "play reverse play reverse"
        }
      }
    );
  }
}

// 6. Scene 03 -> Scene 04: Pin Scene 03 (No Fade), 3-Slice Entrance & Scroll-Linked Text Fade
function initBespokeTransition() {
  const bespokeSection = document.getElementById('bespoke');
  const bespokeSlices = document.querySelectorAll('#bespoke .b-slice');
  const bespokeContent = document.getElementById('bespoke-content');
  const bespokeTitle = document.querySelector('#bespoke-content h2');
  const bespokeSubtitle = document.querySelector('#bespoke-content p');
  const bespokeForm = document.getElementById('bespoke-form');

  if (!bespokeSection) return;

  // Pin Scene 03 safely with anticipatePin, staying fully visible as Bespoke covers it
  ScrollTrigger.create({
    trigger: "#scene-03",
    start: "top top",
    endTrigger: "#bespoke",
    end: "top top",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1 // Prevents jitter on pin entry
  });

  // Master Bespoke Scroll-Linked Timeline (Scrubbed fade in and out with scrolling)
  if (bespokeSlices.length) {
    gsap.set(bespokeSlices, { clipPath: 'inset(100% 0% 0% 0%)' });
    if (bespokeTitle && bespokeSubtitle) {
      gsap.set([bespokeTitle, bespokeSubtitle], { opacity: 0, y: 25 });
    }
    if (bespokeForm) {
      gsap.set(bespokeForm, { opacity: 0, y: 35 });
    }

    const bespokeEntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#bespoke',
        start: 'top bottom',
        end: 'top top',
        scrub: 2.5, // Significantly smoother, slower response to scroll gestures
        invalidateOnRefresh: true,
      }
    });

    // 1. 3 vertical slices enter with staggered clipPath inset
    bespokeEntranceTl.to(bespokeSlices, {
      clipPath: 'inset(0% 0% 0% 0%)',
      stagger: 0.15,
      ease: 'power2.inOut',
      duration: 0.85
    }, 0);

    // 2. Title ("BESPOKE MANUFACTURING") - Slower, ultra-gradual fade across full scroll runway
    if (bespokeTitle) {
      bespokeEntranceTl.to(bespokeTitle, {
        opacity: 1,
        y: 0,
        ease: 'sine.inOut', // Very gentle, slow gradual curve without abrupt jumps
        duration: 1.05
      }, 0.1);
    }

    // 3. Subtitle ("Tell us about your custom request") - Slower staggered fade across scroll
    if (bespokeSubtitle) {
      bespokeEntranceTl.to(bespokeSubtitle, {
        opacity: 1,
        y: 0,
        ease: 'sine.inOut', // Very gentle, slow gradual curve
        duration: 0.95
      }, 0.25);
    }

    // 4. Bespoke form rises and fades in smoothly as slices settle
    if (bespokeForm) {
      bespokeEntranceTl.to(bespokeForm, {
        opacity: 1,
        y: 0,
        ease: 'power1.inOut',
        duration: 0.65
      }, 0.5);
    }
  }
}

// 7. Bespoke Manufacturing Inquiry Form
function initBespokeForm() {
  const form = document.getElementById('bespoke-form');
  const successMsg = document.getElementById('form-success');
  if (form && successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('hidden');
      form.style.display = 'none';
      successMsg.classList.remove('hidden');
      successMsg.style.display = 'block';
    });
  }
}

// Initialize on DOM ready
initNavDrawer();
initHeroAnimations();
initScrollBtn();
initAboutPinnedTimeline();
initCollectionsHorizontalScroll();
initBespokeTransition();
initBespokeForm();
