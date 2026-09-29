/**
 * TURATH — Phase 1 Motion Presets
 * ----------------------------------------------------------------
 * Shared, restrained scroll-reveal and stagger presets for the
 * public-site sections (About, Founder, Custom Manufacturing,
 * Why Choose Us, Footer, Home category grid).
 *
 * Built entirely on the existing "motion/react" dependency plus the
 * native browser matchMedia API — no new dependency is introduced.
 *
 * Motion direction: premium, architectural, editorial, quiet.
 * Only "opacity" and "transform" (translateY) are ever animated.
 * "prefers-reduced-motion" is respected globally via
 * usePrefersReducedMotion(): when active, all transforms/opacity
 * deltas collapse to 0 and content renders immediately visible.
 */
import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Shared easing curve already established in HeroSection.tsx */
export const TURATH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Tracks the user's OS-level "prefers-reduced-motion" setting.
 * Dependency-free (native matchMedia), SSR-safe, live-updates if the
 * setting changes while the page is open.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = () => setReduced(mql.matches);
    handleChange();

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange);
      return () => mql.removeEventListener('change', handleChange);
    }
    // Safari < 14 fallback
    const legacyMql = mql as unknown as {
      addListener?: (cb: () => void) => void;
      removeListener?: (cb: () => void) => void;
    };
    legacyMql.addListener?.(handleChange);
    return () => legacyMql.removeListener?.(handleChange);
  }, []);

  return reduced;
}

/**
 * Single-block scroll reveal for a whole section block (About /
 * Founder / Custom Manufacturing intro / Why Us header / Footer).
 * Fades up a subtle distance once, the first time it scrolls into
 * view. Spread directly onto a <motion.div>/<motion.section>.
 *
 * distance: translateY starting offset in px (~15-30px range)
 * duration: seconds (~0.5-0.7s range)
 */
export function useSectionReveal(distance = 24, duration = 0.6) {
  const reduced = usePrefersReducedMotion();
  return {
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const, amount: 0.2 },
    transition: { duration: reduced ? 0 : duration, ease: TURATH_EASE },
  };
}

/**
 * Stagger container for the three approved grids (home category
 * grid, Custom Manufacturing 4-step grid, Why Choose Us 8-card
 * grid). Spread directly onto the <motion.div> that wraps the grid
 * (the element with the `grid` className).
 *
 * stagger: seconds between each child's start (~0.06-0.09s range)
 */
export function useStaggerContainer(stagger = 0.08) {
  const reduced = usePrefersReducedMotion();
  return {
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: { once: true as const, amount: 0.15 },
    variants: {
      hidden: {},
      visible: {
        transition: reduced
          ? { staggerChildren: 0, delayChildren: 0 }
          : { staggerChildren: stagger, delayChildren: 0.05 },
      },
    },
  };
}

/**
 * Stagger item variants — pair with a parent using
 * useStaggerContainer(). Each child needs only
 * `variants={useStaggerItem()}`; the hidden/visible state propagates
 * automatically from the parent container, so children do NOT also
 * need their own initial/whileInView/viewport props.
 *
 * distance: translateY starting offset in px (~15-30px range)
 * duration: seconds (~0.35-0.5s range)
 */
export function useStaggerItem(distance = 18, duration = 0.4) {
  const reduced = usePrefersReducedMotion();
  return {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : duration, ease: TURATH_EASE },
    },
  };
}
