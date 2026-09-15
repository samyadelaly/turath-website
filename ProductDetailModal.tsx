import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem } from './types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Ruler, 
  ShieldCheck, 
  Clock, 
  Edit3, 
  Video, 
  Sparkles,
  MessageCircle,
  Image as ImageIcon
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from './initialCatalog';
import { EmbeddedVideoPlayer } from './EmbeddedVideoPlayer';

interface ProductDetailModalProps {
  product: ProductItem | null;
  initialShowVideo?: boolean;
  onClose: () => void;
  onSelectForInquiry: (product: ProductItem) => void;
  onEditProduct: (product: ProductItem) => void;
  onOpenFullPage?: (product: ProductItem) => void;
  isAdmin?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialShowVideo = false,
  onClose,
  onSelectForInquiry,
  onEditProduct,
  onOpenFullPage,
  isAdmin = false,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [showVideo, setShowVideo] = useState<boolean>(initialShowVideo && Boolean(product?.videoUrl));
  const [selectedFinish, setSelectedFinish] = useState<string>(
    product?.finishOptions[0] || 'Natural Antique Patina'
  );

  if (!product) return null;

  const validImages = (product.images || []).filter(
    (img): img is string => typeof img === 'string' && img.trim().length > 0
  );
  const mainImageSrc =
    validImages[activeMediaIndex] ||
    validImages[0] ||
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80';

  const category = PRODUCT_CATEGORIES.find((c) => c.id === product.categoryId);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-[#000000] border-2 border-[#d4c59d] rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Bar */}
        <div className="px-6 py-3.5 bg-[#000000] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#d4c59d] uppercase tracking-wider font-semibold">
              {category?.name || 'Handcrafted Brass'}
            </span>
            <span className="text-[#9e9174]">/</span>
            <span className="text-[#d4c59d] font-arabic">{category?.nameArabic}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onEditProduct(product);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#000000] bg-[#d4c59d] hover:bg-[#e6d8b5] font-bold uppercase tracking-wider rounded transition-colors"
                title="Edit photos, videos, or text of this piece"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Piece</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#000000] bg-[#d4c59d] hover:bg-[#e6d8b5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 custom-scrollbar bg-[#000000]">
          {/* LEFT: Media Showcase (Photos & Video) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Media Mode Tabs */}
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#d4c59d]/20">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideo(false)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                    !showVideo
                      ? 'bg-[#d4c59d] text-[#000000]'
                      : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#252525]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photos ({validImages.length})</span>
                </button>

                {product.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                      showVideo
                        ? 'bg-[#d4c59d] text-[#000000]'
                        : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#252525]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Embedded Video</span>
                  </button>
                )}
              </div>

              <span className="text-[10px] text-[#9e9174] uppercase tracking-wider hidden sm:inline font-medium">
                {showVideo ? 'مشاهدة الفيديو المدمج' : 'تصفح الصور بدقة عالية'}
              </span>
            </div>

            {/* Primary Display */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#000000] border border-[#d4c59d]/40 flex items-center justify-center">
              {showVideo && product.videoUrl ? (
                <EmbeddedVideoPlayer
                  videoUrl={product.videoUrl}
                  title={product.name}
                  posterImage={mainImageSrc}
                  autoPlay={true}
                  className="w-full h-full"
                />
              ) : (
                <img
                  src={mainImageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Navigation Arrows for Photos with NO border frames */}
              {!showVideo && validImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowVideo(false);
                    setActiveMediaIndex(idx);
                  }}
                  className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                    !showVideo && activeMediaIndex === idx
                      ? 'ring-2 ring-[#d4c59d] scale-95 shadow'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Video Thumbnail Button if Video Available */}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all bg-[#1a1a1a] flex flex-col items-center justify-center gap-1 ${
                    showVideo
                      ? 'ring-2 ring-[#d4c59d] bg-[#d4c59d] text-[#000000]'
                      : 'text-[#d4c59d] hover:bg-[#222222]'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="text-[9px] uppercase font-bold">Watch Video</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Product Specs & Inquiry */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6] leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#d4c59d] mt-1 font-medium italic">
                  "{product.tagline}"
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#9e9174] leading-relaxed">
                {product.description}
              </p>

              {/* Finish Selector with solid buttons and NO border frames */}
              {product.finishOptions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#d4c59d]/20">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#d4c59d]">
                    Selected Brass Finish:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.finishOptions.map((finish) => (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                          selectedFinish === finish
                            ? 'bg-[#d4c59d] text-[#000000]'
                            : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid in solid black and gold */}
              <div className="bg-[#000000] p-4 rounded-xl border border-[#d4c59d]/40 space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <Ruler className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">Dimensions:</span>
                    <span className="text-[#f5f0e6]">{product.dimensions}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">Material Purity:</span>
                    <span className="text-[#f5f0e6]">{product.materials || product.material || 'Solid Egyptian Brass'}</span>
                  </div>
                </div>

                {product.weight && (
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">Piece Weight:</span>
                      <span className="text-[#f5f0e6]">{product.weight}</span>
                    </div>
                  </div>
                )}

                {product.leadTime && (
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">Estimated Crafting Time:</span>
                      <span className="text-[#f5f0e6]">{product.leadTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons in solid colors with NO border frames */}
            <div className="space-y-2.5 pt-4 border-t border-[#d4c59d]/20">
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    onOpenFullPage(product);
                    onClose();
                  }}
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-md bg-[#1c1c28] border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Dedicated Product Page (Unique URL)</span>
                </button>
              )}

              <button
                onClick={() => {
                  onSelectForInquiry(product);
                  onClose();
                }}
                className="gold-shimmer-hover w-full py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] active:scale-[0.99] transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request Quotation for this Piece</span>
              </button>

              <a
                href={`https://wa.me/201016771010?text=Hello%20Turath%2C%20I%20am%20interested%20in%20"${encodeURIComponent(product.name)}"%20(Product%20ID:%20${encodeURIComponent(product.sku || product.id)},%20Finish:%20${encodeURIComponent(selectedFinish)})`}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-shimmer-hover w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp (+20 01016771010)</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
