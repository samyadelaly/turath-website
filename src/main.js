/**
 * TURATH (تراث) — Minimal Clean Master Engine
 * Step 4: GSAP & ScrollTrigger Initialization
 * - Scrub crossfade for Day/Night Hero Images
 * - Smooth scroll button to Section 02
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Day / Night Crossfade on Hero Scroll
const heroNight = document.getElementById('hero-night');
if (heroNight) {
  gsap.to(heroNight, {
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.2
    }
  });
}

// 2. Interactive Scroll Button
const scrollBtn = document.getElementById('hero-scroll-btn');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
