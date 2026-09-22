import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Hammer, Flame, ShieldCheck } from 'lucide-react';
import { EmbeddedVideoPlayer } from "./EmbeddedVideoPlayer";

interface TurathCraftVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export const TurathCraftVideoModal: React.FC<TurathCraftVideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://www.youtube-nocookie.com/embed/n51TrE7f17I',
  title = 'فيديو الصنعة والحرفية المصرية • ورش تراث',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
        onContextMenu={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#0d0d0d] border border-[#d4c59d]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d4c59d]/20 bg-[#121212]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d4c59d]/10 border border-[#d4c59d]/40 flex items-center justify-center text-[#d4c59d]">
                <Hammer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-serif-luxury font-bold text-[#f5f0e6]">
                  {title}
                </h3>
                <p className="text-[11px] text-[#9e9174] font-arabic">
                  توثيق حي لفنون النحاس المصري الأصيل في قلب القاهرة التاريخية
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#1a1a1a] transition-colors"
              title="إغلاق النافذة (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative bg-black flex-1 min-h-[260px] sm:min-h-[420px] max-h-[65vh]">
            <EmbeddedVideoPlayer
              videoUrl={videoUrl}
              title={title}
              autoPlay={true}
              className="w-full h-full aspect-video"
            />
          </div>

          {/* Footer Craftsmanship Badges */}
          <div className="px-5 py-3 bg-[#111111] border-t border-[#d4c59d]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#9e9174]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] border border-[#d4c59d]/20 text-[#d4c59d]">
                <Sparkles className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>النقش والطرْق اليدوي (Repoussé)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] border border-[#d4c59d]/20 text-[#d4c59d]">
                <Flame className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>تفريغ الأرابيسك (Pierced Filigree)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] border border-[#d4c59d]/20 text-[#d4c59d]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>نحاس مصري أصيل عالي النقاوة</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors font-arabic"
            >
              إغلاق (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
