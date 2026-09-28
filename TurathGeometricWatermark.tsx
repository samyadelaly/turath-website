import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type WatermarkPosition = 
  | 'hero-top-right'
  | 'about-left'
  | 'projects-right'
  | 'projects-detail-top'
  | 'custom-story-left'
  | 'asymmetric-corner';

interface TurathGeometricWatermarkProps {
  position?: WatermarkPosition;
  opacity?: number; // 0.03 to 0.06 (default ~0.045)
  size?: number | string;
  className?: string;
  enableParallax?: boolean;
}

/**
 * TurathGeometricWatermark
 * 
 * An understated, architectural background watermark using exclusively the 
 * authentic Islamic geometric medallion pattern extracted from the official Turath logo.
 * 
 * - Oversized & asymmetrically cropped by viewport edges
 * - Very low opacity (3% - 6%)
 * - Smooth radial & linear fade into solid black
 * - Zero interference with text, buttons, or product media (pointer-events: none)
 * - Ultra-subtle ambient motion that respects prefers-reduced-motion
 */
export const TurathGeometricWatermark: React.FC<TurathGeometricWatermarkProps> = ({
  position = 'hero-top-right',
  opacity = 0.045,
  size,
  className = '',
  enableParallax = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Position presets: intentional, asymmetric architectural crops
  const positionStyles: Record<WatermarkPosition, {
    container: string;
    imageTransform: string;
    gradientMask: string;
  }> = {
    'hero-top-right': {
      container: 'top-[-10%] right-[-15%] sm:top-[-15%] sm:right-[-10%] lg:top-[-20%] lg:right-[-6%] w-[380px] h-[380px] sm:w-[580px] sm:h-[580px] lg:w-[820px] lg:h-[820px] xl:w-[960px] xl:h-[960px]',
      imageTransform: 'rotate(12deg)',
      gradientMask: 'radial-gradient(circle at 45% 45%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 80%)',
    },
    'about-left': {
      container: 'top-[5%] left-[-20%] sm:top-[0%] sm:left-[-15%] lg:top-[-5%] lg:left-[-10%] w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] lg:w-[760px] lg:h-[760px] xl:w-[900px] xl:h-[900px]',
      imageTransform: 'rotate(-15deg)',
      gradientMask: 'radial-gradient(circle at 55% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0) 78%)',
    },
    'projects-right': {
      container: 'top-[0%] right-[-18%] sm:top-[-5%] sm:right-[-12%] lg:top-[-10%] lg:right-[-8%] w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] lg:w-[800px] lg:h-[800px] xl:w-[940px] xl:h-[940px]',
      imageTransform: 'rotate(24deg)',
      gradientMask: 'radial-gradient(circle at 40% 50%, rgba(0,0,0,1) 22%, rgba(0,0,0,0.5) 52%, rgba(0,0,0,0) 76%)',
    },
    'projects-detail-top': {
      container: 'top-[-12%] right-[-10%] sm:top-[-18%] sm:right-[-5%] w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] lg:w-[720px] lg:h-[720px]',
      imageTransform: 'rotate(45deg)',
      gradientMask: 'radial-gradient(circle at 45% 45%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 75%)',
    },
    'custom-story-left': {
      container: 'bottom-[-10%] left-[-15%] sm:bottom-[-15%] sm:left-[-10%] w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] lg:w-[780px] lg:h-[780px]',
      imageTransform: 'rotate(-30deg)',
      gradientMask: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 52%, rgba(0,0,0,0) 75%)',
    },
    'asymmetric-corner': {
      container: 'top-[-15%] right-[-10%] w-[380px] h-[380px] sm:w-[600px] sm:h-[600px] lg:w-[850px] lg:h-[850px]',
      imageTransform: 'rotate(8deg)',
      gradientMask: 'radial-gradient(circle at 45% 45%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 80%)',
    },
  };

  const preset = positionStyles[position] || positionStyles['hero-top-right'];

  return (
    <div 
      aria-hidden="true"
      className={`absolute pointer-events-none select-none z-0 overflow-hidden ${preset.container} ${className}`}
      style={{
        opacity: Math.max(0.02, Math.min(0.07, opacity)),
      }}
    >
      <motion.div
        animate={
          enableParallax && !shouldReduceMotion
            ? {
                y: [-4, 5, -4],
                x: [-3, 3, -3],
                rotate: [-0.6, 0.6, -0.6],
              }
            : undefined
        }
        transition={
          enableParallax && !shouldReduceMotion
            ? {
                duration: 32,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
        className="w-full h-full relative flex items-center justify-center"
        style={{
          transform: preset.imageTransform,
          WebkitMaskImage: preset.gradientMask,
          maskImage: preset.gradientMask,
        }}
      >
        <img
          src="/turath_pattern_watermark.png"
          alt=""
          role="presentation"
          draggable={false}
          className="w-full h-full object-contain filter contrast-[1.1] brightness-[1.05]"
          style={{
            maxWidth: 'none',
          }}
        />
      </motion.div>
    </div>
  );
};
