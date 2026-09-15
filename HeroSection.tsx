import React from 'react';
import { motion } from 'motion/react';
import { TurathLogo } from './TurathLogo';
import { AmbientGoldParticles } from './AmbientGoldParticles';
import { SiteContent, getStoredSiteContent } from './siteContentStorage';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Hammer, 
  Building2, 
  PhoneCall 
} from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onCustomQuote: () => void;
  onOpenVideoModal?: () => void;
  onOpenChangeLogo?: () => void;
  isAdmin?: boolean;
  content?: SiteContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onCustomQuote,
  onOpenChangeLogo,
  isAdmin = false,
  content,
}) => {
  const activeContent = content || getStoredSiteContent();
  const hero = activeContent.hero;
  return (
    <section className="relative overflow-hidden bg-[#000000] border-b border-[#d4c59d]/30 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Ambient Drifting Gold Particles */}
      <AmbientGoldParticles />

      {/* Subtle radial ambient glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d4c59d]/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Outer container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo Showcase strictly in solid black and gold */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative inline-flex items-center justify-center">
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
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#d4c59d] text-[11px] font-bold uppercase tracking-wider text-[#000000] hover:bg-[#e6d8b5] transition-colors"
              >
                <span>Click to change or replace logo</span>
              </button>
            )}
          </motion.div>

          {/* Subtitle Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4c59d] text-xs sm:text-sm font-bold tracking-widest uppercase text-[#000000] shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hero.badge}</span>
          </motion.div>

          {/* Main Headline in solid logo gold and light ivory */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4 max-w-4xl"
          >
            <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#f5f0e6] tracking-tight leading-[1.15]">
              {hero.headlinePart1} <br className="hidden sm:inline" />
              <span className="text-[#d4c59d]">
                {hero.headlineGold}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#d4c59d] font-normal leading-relaxed max-w-3xl mx-auto">
              {hero.description}
            </p>

            <p className="text-xs sm:text-sm text-[#9e9174] leading-relaxed max-w-2xl mx-auto italic">
              {hero.subDescription}
            </p>
          </motion.div>

          {/* Action CTAs in solid colors with shimmer hover effects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreProducts}
              className="gold-shimmer-hover w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Handcrafted Collections</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCustomQuote}
              className="gold-shimmer-hover w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Hammer className="w-4 h-4" />
              <span>Custom Manufacturing</span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${hero.phone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{hero.phone}</span>
            </motion.a>
          </motion.div>

          {/* Heritage Metrics in solid black and solid gold with hover lift */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 w-full max-w-5xl border-t border-[#d4c59d]/20 text-left"
          >
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-colors shadow"
            >
              <div className="flex items-center gap-2 text-[#d4c59d] mb-1">
                <Hammer className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Gamaliya Heritage</span>
              </div>
              <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#f5f0e6]">
                Master Artisans
              </div>
              <p className="text-[11px] text-[#9e9174] mt-0.5">Generations of Egyptian metalworking lineages</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-colors shadow"
            >
              <div className="flex items-center gap-2 text-[#d4c59d] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">100% Solid Brass</span>
              </div>
              <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#f5f0e6]">
                Pure Purity
              </div>
              <p className="text-[11px] text-[#9e9174] mt-0.5">Heavy gauge metal with archival patina treatments</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-colors shadow"
            >
              <div className="flex items-center gap-2 text-[#d4c59d] mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Turnkey Projects</span>
              </div>
              <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#f5f0e6]">
                Palaces & Hotels
              </div>
              <p className="text-[11px] text-[#9e9174] mt-0.5">Villas, restaurants, and monumental architecture</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-colors shadow"
            >
              <div className="flex items-center gap-2 text-[#d4c59d] mb-1">
                <Globe2 className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Global Reach</span>
              </div>
              <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#f5f0e6]">
                Worldwide
              </div>
              <p className="text-[11px] text-[#9e9174] mt-0.5">Secure international crating & insured shipping</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

