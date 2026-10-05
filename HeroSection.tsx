import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TurathLogo } from './TurathLogo';
import { SiteContent, getStoredSiteContent, isSectionVisible, isElementVisible } from './siteContentStorage';
import { 
  ArrowRight, 
  PhoneCall, 
  Hammer, 
  Sparkles,
  ChevronDown,
  Video
} from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onCustomQuote: () => void;
  onOpenChangeLogo?: () => void;
  onOpenHeroVideoModal?: () => void;
  isAdmin?: boolean;
  content?: SiteContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onCustomQuote,
  onOpenChangeLogo,
  onOpenHeroVideoModal,
  isAdmin = false,
  content,
}) => {
  const activeContent = content || getStoredSiteContent();
  const hero = activeContent.hero || {
    badge: 'Egyptian Craftsmanship Heritage',
    headlinePart1: 'Handcrafted Brass & Copper Excellence',
    headlineGold: 'from Egypt',
    description: 'Premium handcrafted brass, copper and decorative metal products, made in Cairo, Egypt for luxury homes, hotels, restaurants, palaces and commercial projects worldwide.',
    subDescription: 'صناعة وتصدير أفخر المشغولات النحاسية والديكورية بأيدي أمهر الحرفيين في الجمالية، القاهرة بمواصفات معمارية عالمية.',
    phone: '002 01016771010',
    whatsapp: '+20 101 677 1010'
  };

  // Hero Video settings from admin / cloud content
  const heroVideoUrl = activeContent.heroVideoUrl !== undefined 
    ? activeContent.heroVideoUrl 
    : (activeContent.hero?.videoUrl !== undefined ? activeContent.hero.videoUrl : '');

  const heroVideoFit = activeContent.heroVideoFit || activeContent.hero?.videoFit || 'cover';
  const heroVideoRatio = activeContent.heroVideoRatio || activeContent.hero?.videoRatio || 'Auto';
  const heroVideoCustomRatio = activeContent.heroVideoCustomRatio || activeContent.hero?.videoCustomRatio || '';
  const heroVideoOpacity = activeContent.heroVideoOpacity !== undefined 
    ? activeContent.heroVideoOpacity 
    : (activeContent.hero?.videoOpacity !== undefined ? activeContent.hero.videoOpacity : 85);

  // DOM Refs for scroll-driven cinematic Hero animation
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyCanvasRef = useRef<HTMLDivElement | null>(null);
  const mediaWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentCanvasRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Compute CSS aspect ratio style for the video display area if ratio != 'Auto'
  let aspectRatioStyle: React.CSSProperties = {};
  if (heroVideoRatio === '16:9') aspectRatioStyle = { aspectRatio: '16/9' };
  else if (heroVideoRatio === '4:3') aspectRatioStyle = { aspectRatio: '4/3' };
  else if (heroVideoRatio === '3:4') aspectRatioStyle = { aspectRatio: '3/4' };
  else if (heroVideoRatio === '1:1') aspectRatioStyle = { aspectRatio: '1/1' };
  else if (heroVideoRatio === 'Custom' && heroVideoCustomRatio) aspectRatioStyle = { aspectRatio: heroVideoCustomRatio };

  // Scroll-Driven Cinematic Animation: Media Scale (1.00 -> 0.90) + Content Upward Translation (0 -> -45vh)
  useEffect(() => {
    let rafId: number;
    let isSeeking = false;
    let lastSeekRequestTime = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let scrollDistance = 1;
    let isMounted = true;
    let isOffscreen = false;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const video = videoRef.current;

    // Reset seek lock on decoder completion without cascading new seeks
    const handleSeeked = () => {
      isSeeking = false;
    };

    // Metadata & initial frame preparation
    const handleMetadata = () => {
      if (video) {
        video.pause();
        if (currentProgress === 0 && video.currentTime !== 0) {
          try {
            video.currentTime = 0;
          } catch {}
        }
      }
    };

    if (video) {
      video.pause();
      video.muted = true;
      video.playsInline = true;
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('loadedmetadata', handleMetadata);
      video.addEventListener('loadeddata', handleMetadata);
    }

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    // Cache metrics to eliminate getBoundingClientRect layout reflow in the animation loop
    const updateMetrics = () => {
      if (containerRef.current) {
        const h = containerRef.current.offsetHeight;
        const vh = window.innerHeight;
        scrollDistance = Math.max(1, h - vh);
      }
    };
    updateMetrics();

    // Passive scroll event listener: zero layout thrashing
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetProgress = clamp(scrollY / scrollDistance, 0, 1);
      isOffscreen = scrollY > (scrollDistance + window.innerHeight * 1.05);
    };
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    const handleResize = () => {
      updateMetrics();
      onScroll();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Single requestAnimationFrame loop: coordinates smoothly damped scroll, media scale, content travel, and hardware video scrub
    const tick = () => {
      if (!isMounted) return;

      // 1. Smoothly interpolate normalized progress with tuned cinematic inertia (eliminates micro-jitter)
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.14;
      } else {
        currentProgress = targetProgress;
      }

      const p = currentProgress;

      // 2. Scrub video currentTime safely synchronized with decoder capabilities
      const vid = videoRef.current;
      if (vid && vid.duration && !isNaN(vid.duration) && vid.duration > 0.1 && !isOffscreen) {
        if (!vid.paused) {
          vid.pause();
        }

        const duration = vid.duration;
        const targetTime = clamp(p * duration, 0, duration);
        const timeDelta = Math.abs(vid.currentTime - targetTime);
        const now = performance.now();

        // Safety watchdog: recover if decoder seeked event was lost or took too long
        if (isSeeking && (now - lastSeekRequestTime > 120)) {
          isSeeking = false;
        }

        // Throttle seeks to max ~25 per sec (40ms) with a perceptible delta (> 0.035s)
        if (!isSeeking && !vid.seeking && (now - lastSeekRequestTime >= 40)) {
          if (timeDelta >= 0.035) {
            isSeeking = true;
            lastSeekRequestTime = now;
            try {
              if ('fastSeek' in vid && typeof (vid as any).fastSeek === 'function') {
                (vid as any).fastSeek(targetTime);
              } else {
                vid.currentTime = targetTime;
              }
            } catch {
              isSeeking = false;
            }
          }
        } else if (Math.abs(diff) <= 0.0002 && timeDelta > 0.01 && !isSeeking && !vid.seeking) {
          // Precise lock-in when scrolling stops
          try {
            vid.currentTime = targetTime;
          } catch {}
        }
      }

      // 3. Subtle Media Scaling: 1.00 -> 0.90 in Phase 1 (completes smoothly around p = 0.35)
      if (mediaWrapperRef.current) {
        const scaleP = clamp(p / 0.35, 0, 1);
        const scale = prefersReducedMotion ? 1.0 : (1.0 - (scaleP * 0.10));
        mediaWrapperRef.current.style.transform = `scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
      }

      // 4. Hero Content Upward Movement: translateY(0) -> translateY(-45vh), fades out in Phase 1 (by p = 0.30)
      if (contentCanvasRef.current) {
        const textP = clamp(p / 0.30, 0, 1);
        const yVh = prefersReducedMotion ? 0 : -(textP * 45);
        const opacity = prefersReducedMotion ? 1.0 : Math.max(0, 1 - textP);

        contentCanvasRef.current.style.transform = `translate3d(0, ${yVh.toFixed(2)}vh, 0)`;
        contentCanvasRef.current.style.opacity = `${opacity.toFixed(3)}`;
        contentCanvasRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
      }

      // 5. Scroll indicator fade (by p = 0.10)
      if (scrollIndicatorRef.current) {
        const indOpacity = Math.max(0, 1 - (p / 0.10));
        scrollIndicatorRef.current.style.opacity = `${indOpacity.toFixed(3)}`;
        scrollIndicatorRef.current.style.pointerEvents = indOpacity > 0.1 ? 'auto' : 'none';
      }

      // 6. When fully covered by the next section (p >= 1.0), pause video to conserve GPU
      if (vid && p >= 1.0 && !vid.paused) {
        vid.pause();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      if (video) {
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('loadeddata', handleMetadata);
      }
    };
  }, [heroVideoUrl]);

  const handleScrollToNext = () => {
    if (!containerRef.current) return;
    const targetY = containerRef.current.offsetTop + (containerRef.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  if (!isSectionVisible(activeContent, 'hero')) {
    return null;
  }

  return (
    <section 
      ref={containerRef}
      style={{ backgroundColor: 'var(--hero-bg-color, #000000)' }}
      className="relative w-full h-[250vh] sm:h-[260vh]"
    >
      {/* Sticky Viewport Canvas: Remains pinned at top while next section slides over */}
      <div 
        ref={stickyCanvasRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between select-none z-10"
      >
        
        {/* ============================================================ */}
        {/* 1. VISIBLE REAL TURATH CINEMATIC MEDIA (Scales 1.00 -> 0.90)  */}
        {/* ============================================================ */}
        {isElementVisible(activeContent, 'heroVideo') && (
          <div 
            ref={mediaWrapperRef}
            style={{ backgroundColor: 'var(--hero-bg-color, #000000)' }}
            className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center will-change-transform origin-center"
          >
            {heroVideoUrl ? (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={aspectRatioStyle}
              >
                <video
                  ref={videoRef}
                  src={heroVideoUrl}
                  autoPlay={false}
                  muted
                  loop={false}
                  playsInline
                  controls={false}
                  preload="auto"
                  style={{
                    objectFit: heroVideoFit,
                    opacity: heroVideoOpacity / 100,
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                  }}
                  className="w-full h-full filter brightness-[0.98] contrast-[1.05]"
                />
              </div>
            ) : (
              /* Clean Intended Empty State: No Fake Media */
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
                style={{ backgroundImage: `url('/turath_logo.jpg')` }}
              />
            )}

            {/* Dynamic Configurable Dark Video Overlay for Text Legibility & Theme Editor Control */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
              style={{
                backgroundColor: 'var(--hero-bg-color, #000000)',
                opacity: 'var(--hero-overlay-opacity, 0.70)'
              }}
            />

            {/* Minimal Top & Bottom Edge Vignettes for Text Legibility */}
            <div className="absolute top-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-b from-[#000000]/65 via-[#000000]/25 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-32 sm:h-44 bg-gradient-to-t from-[#000000]/75 via-[#000000]/30 to-transparent z-10 pointer-events-none" />
          </div>
        )}

        {/* Admin Direct Hero Video Control (Clean Pill) */}
        {isAdmin && onOpenHeroVideoModal && (
          <div className="absolute top-4 right-4 z-30">
            <button
              type="button"
              onClick={onOpenHeroVideoModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d4c59d]/60 bg-[#000000]/70 backdrop-blur-sm text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors cursor-pointer text-[10px] tracking-widest uppercase font-bold shadow-lg"
              title="إدارة وتعديل فيديو الهيرو"
            >
              <Video className="w-2.5 h-2.5" />
              <span>فيديو الهيرو</span>
            </button>
          </div>
        )}

        {/* Hero Pattern Gradient Overlay */}
        <div className="turath-hero-pattern-overlay" aria-hidden="true" />

        {/* ============================================================ */}
        {/* 3. HERO CONTENT CANVAS (Translates upward: translateY 0 -> -45vh) */}
        {/* ============================================================ */}
        <div 
          ref={contentCanvasRef}
          className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 w-full text-center will-change-transform space-y-4 sm:space-y-6 py-4"
        >
          {/* Authentic TURATH Logo */}
          {isElementVisible(activeContent, 'heroLogo') && (
            <div className="relative flex flex-col items-center">
              <div className="relative inline-flex items-center justify-center p-1">
                <TurathLogo 
                  size="hero" 
                  showText={false} 
                  allowHoverChange={isAdmin} 
                  onOpenChangeLogo={isAdmin ? onOpenChangeLogo : undefined} 
                />
              </div>

              {isAdmin && onOpenChangeLogo && (
                <button
                  type="button"
                  onClick={onOpenChangeLogo}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4c59d] text-[11px] font-bold uppercase tracking-wider text-[#000000] hover:bg-[#e6d8b5] transition-colors cursor-pointer"
                >
                  <span>Click to change logo</span>
                </button>
              )}
            </div>
          )}

          {/* Editorial Headline & Narrative */}
          <div className="space-y-2.5 sm:space-y-3.5 max-w-4xl p-4 sm:p-6 rounded-2xl bg-[#000000]/40 backdrop-blur-[2px] border border-[#d4c59d]/15 shadow-2xl">
            {isElementVisible(activeContent, 'heroBadge') && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#000000]/70 border border-[#d4c59d]/40 text-[10px] sm:text-xs font-mono tracking-[0.28em] text-[#d4c59d] uppercase">
                {isElementVisible(activeContent, 'heroAiIcons') && <Sparkles className="w-3 h-3 text-[#d4c59d]" />}
                <span>{activeContent.heroBadge || hero.badge || 'EGYPTIAN CRAFTSMANSHIP • EST. CAIRO'}</span>
              </div>
            )}

            {isElementVisible(activeContent, 'heroTitle') && (
              <h1 
                className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.12] drop-shadow-md"
                style={{ color: 'var(--color-hero-heading, #f5f0e6)' }}
              >
                {activeContent.heroTitleLine1 || hero.headlinePart1} <br className="hidden sm:inline" />
                <span 
                  className="italic font-normal ml-2"
                  style={{ color: 'var(--color-hero-accent, #d4c59d)' }}
                >
                  {activeContent.heroTitleHighlight || hero.headlineGold}
                </span>
              </h1>
            )}

            {isElementVisible(activeContent, 'heroDescription') && (
              <p 
                className="text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto tracking-wide drop-shadow-sm"
                style={{ color: 'var(--color-hero-body, #f5f0e6)' }}
              >
                {activeContent.heroDescription || hero.description}
              </p>
            )}

            {isElementVisible(activeContent, 'heroSubDescription') && (
              <p className="text-xs sm:text-sm text-[#d4c59d] font-arabic leading-relaxed max-w-xl mx-auto pt-1">
                {activeContent.heroSubDescription || hero.subDescription}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl pt-1">
            {isElementVisible(activeContent, 'heroExploreBtn') && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreProducts}
                className="gold-shimmer-hover turath-btn-primary w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-md transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border"
              >
                <span>{activeContent.heroExploreButtonText || 'Explore Collections'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            {isElementVisible(activeContent, 'heroCustomBtn') && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCustomQuote}
                className="gold-shimmer-hover turath-btn-secondary w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg border"
              >
                <Hammer className="w-4 h-4" />
                <span>{activeContent.heroCustomButtonText || 'Custom Manufacturing'}</span>
              </motion.button>
            )}

            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${hero.phone.replace(/\s+/g, '')}`}
              className="turath-btn-secondary w-full sm:w-auto px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md border transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <PhoneCall className="w-4 h-4 text-[#d4c59d]" />
              <span>{hero.phone}</span>
            </motion.a>
          </div>

          {/* Heritage Metrics Cards */}
          {isElementVisible(activeContent, 'heroMetrics') && (
            <div className="pointer-events-auto grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-5xl pt-3 border-t border-[#d4c59d]/20 text-left">
              <div className="turath-card p-3 sm:p-4 rounded-xl border hover:border-[#d4c59d] transition-colors shadow">
                <div className="flex items-center gap-1.5 text-[#d4c59d] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">{activeContent.metric1Title || 'Gamaliya Heritage'}</span>
                </div>
                <div className="font-serif-luxury text-sm sm:text-base font-bold text-[#f5f0e6]">
                  {activeContent.metric1Subtitle || 'Master Artisans'}
                </div>
                <p className="text-[10px] text-[#9e9174] mt-0.5 line-clamp-2">{activeContent.metric1Desc || 'Generations of Egyptian metalworking lineages'}</p>
              </div>

              <div className="turath-card p-3 sm:p-4 rounded-xl border hover:border-[#d4c59d] transition-colors shadow">
                <div className="flex items-center gap-1.5 text-[#d4c59d] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">{activeContent.metric2Title || '100% Solid Brass'}</span>
                </div>
                <div className="font-serif-luxury text-sm sm:text-base font-bold text-[#f5f0e6]">
                  {activeContent.metric2Subtitle || 'Pure Purity'}
                </div>
                <p className="text-[10px] text-[#9e9174] mt-0.5 line-clamp-2">{activeContent.metric2Desc || 'Heavy gauge metal with archival patina treatments'}</p>
              </div>

              <div className="turath-card p-3 sm:p-4 rounded-xl border hover:border-[#d4c59d] transition-colors shadow">
                <div className="flex items-center gap-1.5 text-[#d4c59d] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">{activeContent.metric3Title || 'Turnkey Projects'}</span>
                </div>
                <div className="font-serif-luxury text-sm sm:text-base font-bold text-[#f5f0e6]">
                  {activeContent.metric3Subtitle || 'Palaces & Hotels'}
                </div>
                <p className="text-[10px] text-[#9e9174] mt-0.5 line-clamp-2">{activeContent.metric3Desc || 'Villas, restaurants, and monumental architecture'}</p>
              </div>

              <div className="turath-card p-3 sm:p-4 rounded-xl border hover:border-[#d4c59d] transition-colors shadow">
                <div className="flex items-center gap-1.5 text-[#d4c59d] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">{activeContent.metric4Title || 'Global Reach'}</span>
                </div>
                <div className="font-serif-luxury text-sm sm:text-base font-bold text-[#f5f0e6]">
                  {activeContent.metric4Subtitle || 'Worldwide'}
                </div>
                <p className="text-[10px] text-[#9e9174] mt-0.5 line-clamp-2">{activeContent.metric4Desc || 'Secure international crating & insured shipping'}</p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 4. BOTTOM EDITORIAL CUE                                      */}
        {/* ============================================================ */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 flex items-center justify-between bg-gradient-to-t from-[#000000]/70 to-transparent pt-3">
          <div 
            ref={scrollIndicatorRef}
            onClick={handleScrollToNext}
            className="flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] text-[#d4c59d] uppercase transition-opacity duration-200 bg-[#000000]/60 px-3.5 py-1.5 rounded-full border border-[#d4c59d]/20 cursor-pointer hover:border-[#d4c59d]/60"
          >
            <div className="w-3.5 h-5 rounded-full border border-[#d4c59d]/60 flex items-start justify-center p-0.5">
              <div className="w-1 h-1 rounded-full bg-[#d4c59d] animate-bounce" />
            </div>
            <span>SCROLL TO EXPLORE CRAFTSMANSHIP</span>
            <ChevronDown className="w-3 h-3 text-[#d4c59d]" />
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#9e9174] uppercase hidden sm:block">
            AUTHENTIC EGYPTIAN HANDCRAFTED METALWORK
          </div>
        </div>

      </div>
    </section>
  );
};
