import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ProductCategoryInfo, ProductItem } from './types';
import { getStoredCategories } from './categoryStorage';
import { pauseAndMuteAllVideos } from './videoManager';
import { TiltCard } from './TiltCard';
import { 
  computeProductImageRatio, 
  computeCategoryCoverRatio, 
  computeCategoryCoverMediaRatio,
  computeImageRatio 
} from './imageRatioUtils';
import { UnifiedResponsiveImage } from "./UnifiedResponsiveImage";
import { TurathMedia } from "./TurathMedia";
import { TurathImage } from "./TurathImage";
import { 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  Eye, 
  Video, 
  SlidersHorizontal, 
  Layers, 
  MessageCircle, 
  Camera,
  Edit3
} from 'lucide-react';

interface ProductCategoryViewProps {
  category: ProductCategoryInfo;
  products: ProductItem[];
  categories?: ProductCategoryInfo[];
  onSelectProduct: (product: ProductItem, openWithVideo?: boolean) => void;
  onOpenAddProduct: (categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateHome: () => void;
  onOpenEditCover?: (categoryId: string) => void;
  onOpenCategoryManager?: (categoryId?: string) => void;
  isAdmin?: boolean;
}

export const ProductCategoryView: React.FC<ProductCategoryViewProps> = ({
  category,
  products,
  categories,
  onSelectProduct,
  onOpenAddProduct,
  onSelectCategory,
  onNavigateHome,
  onOpenEditCover,
  onOpenCategoryManager,
  isAdmin = false,
}) => {
  const allCategoriesList = (categories || getStoredCategories()).filter((c) => c.id !== 'wall-art');
  const [selectedFinishFilter, setSelectedFinishFilter] = useState<string>('all');
  const [onlyWithVideo, setOnlyWithVideo] = useState<boolean>(false);

  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  // Pause and mute any playing videos on mount, unmount, or when category/filter changes
  useEffect(() => {
    pauseAndMuteAllVideos();
    return () => {
      pauseAndMuteAllVideos();
    };
  }, [category.id, selectedFinishFilter, onlyWithVideo]);

  // Unique finishes in this category
  const allFinishes = Array.from(
    new Set(categoryProducts.flatMap((p) => p.finishOptions))
  );

  const filteredProducts = categoryProducts
    .filter((p) => selectedFinishFilter === 'all' || p.finishOptions.includes(selectedFinishFilter))
    .filter((p) => (!onlyWithVideo ? true : Boolean(p.videoUrl)));

  return (
    <div className="min-h-screen pb-16 sm:pb-20 lg:pb-24 bg-[#000000]">
      {/* Category Hero Banner in solid black and gold */}
      <div className="relative pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#d4c59d]/30 bg-[#000000]">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#9e9174] mb-3 sm:mb-4">
            <button 
              onClick={onNavigateHome}
              className="px-2.5 py-1 rounded bg-[#d4c59d] text-[#000000] font-bold uppercase transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-[#d4c59d] font-semibold">{category.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-3xl">
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] tracking-wide">
                {category.name}
              </h1>

              <p className="text-sm sm:text-base text-[#d4c59d] leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Direct Add Product Photo/Video CTA & Edit Cover Button - Admin Only */}
            {isAdmin && (
              <div className="flex-shrink-0 flex items-center gap-2.5 flex-wrap">
                {onOpenCategoryManager && (
                  <button
                    onClick={() => onOpenCategoryManager(category.id)}
                    className="inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-md bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow font-arabic cursor-pointer"
                    title="تعديل تفاصيل هذا القسم وصوره وفيديوهاته"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>تعديل هذا القسم</span>
                  </button>
                )}

                {onOpenEditCover && (
                  <button
                    onClick={() => onOpenEditCover(category.id)}
                    className="inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-md bg-[#161616] border border-[#d4c59d]/60 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow font-arabic cursor-pointer"
                    title="Change cover photo & framing of this category"
                  >
                    <Camera className="w-4 h-4" />
                    <span>تعديل وتأطير الغلاف</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenAddProduct(category.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product to {category.name}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section Cover Showcase with Preserved Ratio & Framing (Image or Video) */}
          {(category.coverImage || (category.coverMediaType === 'video' && category.coverVideoUrl)) && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-[#d4c59d]/40 shadow-2xl relative group/cover bg-black">
              {(() => {
                const coverRatio = computeCategoryCoverMediaRatio(category);
                const isVideo = category.coverMediaType === 'video' && !!category.coverVideoUrl;

                return (
                  <TurathMedia
                    type={isVideo ? 'video' : 'image'}
                    src={category.coverImage}
                    videoUrl={category.coverVideoUrl}
                    computedRatio={coverRatio}
                    containerClassName="w-full bg-[#0a0a0f] max-h-[500px]"
                    mediaClassName="brightness-95 group-hover/cover:scale-105 transition-transform duration-700"
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    controls={false}
                    showSoundToggle={isVideo}
                    soundTogglePosition="top-right"
                    showVideoBadge={isVideo}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10 flex-wrap gap-2 pointer-events-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-serif-luxury font-bold text-[#f5f0e6] bg-black/80 px-3 py-1 rounded border border-[#d4c59d]/40">
                          {category.name} ({category.nameArabic})
                        </span>
                        {!isVideo && (
                          <span className="text-[10px] font-mono text-[#d4c59d] bg-black/80 px-2 py-0.5 rounded border border-[#d4c59d]/30">
                            {coverRatio.isOriginal ? 'Original Ratio' : coverRatio.aspectRatioCss} • {coverRatio.objectFit}
                          </span>
                        )}
                      </div>

                      {isAdmin && onOpenEditCover && (
                        <button
                          type="button"
                          onClick={() => onOpenEditCover(category.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/70 text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>تعديل نسبة الغلاف</span>
                        </button>
                      )}
                    </div>
                  </TurathMedia>
                );
              })()}
            </div>
          )}

          {/* Quick Category Switcher Tabs without border frames */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#d4c59d]/20 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <span className="text-xs uppercase tracking-wider text-[#d4c59d] font-bold flex-shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              All Categories:
            </span>
            {allCategoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all flex-shrink-0 font-bold uppercase tracking-wider ${
                  cat.id === category.id
                    ? 'bg-[#d4c59d] text-[#000000]'
                    : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Catalog Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 lg:mt-12">
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[#d4c59d]/20">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold text-[#d4c59d] flex items-center gap-1 flex-shrink-0 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Finish Filter:
            </span>

            <button
              onClick={() => setSelectedFinishFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all font-bold uppercase tracking-wider ${
                selectedFinishFilter === 'all'
                  ? 'bg-[#d4c59d] text-[#000000]'
                  : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
              }`}
            >
              ALL FINISHES ({categoryProducts.length})
            </button>
            {allFinishes.map((finish) => (
              <button
                key={finish}
                onClick={() => setSelectedFinishFilter(finish)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all font-bold uppercase tracking-wider ${
                  selectedFinishFilter === finish
                    ? 'bg-[#d4c59d] text-[#000000]'
                    : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
                }`}
              >
                {finish}
              </button>
            ))}

            {/* Video Only Filter Toggle */}
            <button
              onClick={() => setOnlyWithVideo(!onlyWithVideo)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all font-bold uppercase tracking-wider ${
                onlyWithVideo
                  ? 'bg-[#d4c59d] text-[#000000]'
                  : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Embedded Videos Only</span>
            </button>
          </div>

          <div className="text-xs text-[#9e9174] flex-shrink-0">
            Showing <strong className="text-[#f5f0e6]">{filteredProducts.length}</strong> handcrafted item(s)
          </div>
        </div>

        {/* Product Cards Grid in solid black and gold */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#000000] rounded-xl border border-dashed border-[#d4c59d]/40 p-8">
            <Sparkles className="w-12 h-12 text-[#d4c59d] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#f5f0e6]">
              No Products Found for this Filter
            </h3>
            {isAdmin ? (
              <>
                <p className="text-xs text-[#9e9174] mt-1 mb-5">
                  You can add your own custom photos and videos to this category right now!
                </p>
                <button
                  onClick={() => onOpenAddProduct(category.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              </>
            ) : (
              <p className="text-xs text-[#9e9174] mt-1 mb-5">
                New masterworks in this collection are currently being crafted. Contact us for custom commissions.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((prod) => {
              const isProdVideo = Boolean(prod.mediaType === 'video' && prod.videoUrl);
              const prodRatio = computeProductImageRatio(prod);
              const mainImg = (prod.images && prod.images.find((img) => typeof img === 'string' && img.trim().length > 0)) || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80';

              return (
              <TiltCard
                key={prod.id}
                className="group bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Media Container with Dynamic Aspect Ratio & Fit Mode */}
                {isProdVideo ? (
                  <TurathMedia
                    type="video"
                    src={mainImg}
                    videoUrl={prod.videoUrl}
                    poster={prod.videoPoster || mainImg}
                    computedRatio={prodRatio}
                    containerClassName="cursor-pointer bg-[#0a0a0d] max-h-[480px]"
                    mediaClassName="group-hover:scale-105 transition-transform duration-500"
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    controls={false}
                    showVideoBadge={true}
                    showSoundToggle={true}
                    onClick={() => onSelectProduct(prod, false)}
                  >
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20 pointer-events-auto">
                      {prod.featured && (
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-[#d4c59d] text-[#000000] px-2 py-0.5 rounded shadow">
                          Masterwork
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(prod, true);
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] px-2.5 py-1 rounded flex items-center gap-1.5 shadow transition-transform hover:scale-105 cursor-pointer"
                        title="Watch embedded video inside website"
                      >
                        <Video className="w-3.5 h-3.5 text-[#000000]" />
                        <span>▶ Watch Video</span>
                      </button>
                    </div>

                    {/* Photo count indicator */}
                    {prod.images.length > 1 && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-[#d4c59d] text-[#000000] px-2 py-0.5 rounded z-20 pointer-events-none">
                        {prod.images.length} Photos
                      </span>
                    )}
                  </TurathMedia>
                ) : (
                  <TurathImage
                    src={mainImg}
                    alt={prod.name}
                    computedRatio={prodRatio}
                    containerClassName="cursor-pointer bg-[#0a0a0d]"
                    imageClassName="group-hover:scale-105 transition-transform duration-500"
                    onClick={() => onSelectProduct(prod, false)}
                  >
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                      {prod.featured && (
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-[#d4c59d] text-[#000000] px-2 py-0.5 rounded shadow">
                          Masterwork
                        </span>
                      )}
                      {prod.imageRatio && prod.imageRatio !== 'Original' && (
                        <span className="text-[9px] uppercase font-mono font-bold bg-black/75 text-[#d4c59d] border border-[#d4c59d]/40 px-1.5 py-0.5 rounded shadow">
                          {prod.imageRatio === 'Custom' ? `${prod.customRatioWidth || 5}:${prod.customRatioHeight || 7}` : prod.imageRatio}
                        </span>
                      )}
                      {prod.videoUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(prod, true);
                          }}
                          className="text-[10px] font-bold uppercase tracking-wider bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] px-2.5 py-1 rounded flex items-center gap-1.5 shadow transition-transform hover:scale-105"
                          title="Watch embedded video inside website"
                        >
                          <Video className="w-3.5 h-3.5 text-[#000000]" />
                          <span>▶ Watch Video</span>
                        </button>
                      )}
                    </div>

                    {/* Photo count indicator */}
                    {prod.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-[#d4c59d] text-[#000000] px-2 py-0.5 rounded">
                        {prod.images.length} Photos
                      </span>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#000000]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d4c59d] text-xs font-bold uppercase tracking-wider text-[#000000] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-[#000000]" />
                        <span>View Gallery & Details</span>
                      </span>
                      {prod.videoUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(prod, true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1a1a1a] border border-[#d4c59d] text-xs font-bold uppercase tracking-wider text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] shadow-lg transition-all"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>▶ Play Embedded Video</span>
                        </button>
                      )}
                    </div>
                  </TurathImage>
                )}

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => onSelectProduct(prod, false)}
                      className="font-serif-luxury text-lg font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors cursor-pointer"
                    >
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#9e9174] mt-1 line-clamp-2">
                      {prod.tagline || prod.description}
                    </p>
                  </div>

                  {/* Specs Pill info */}
                  <div className="space-y-2 pt-2 border-t border-[#d4c59d]/20 text-xs text-[#9e9174]">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#d4c59d] font-semibold">Dimensions:</span>
                      <span className="text-[#f5f0e6]">{prod.dimensions}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {prod.finishOptions.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#1a1a1a] text-[#d4c59d] font-medium"
                        >
                          {f}
                        </span>
                      ))}
                      {prod.finishOptions.length > 3 && (
                        <span className="text-[10px] px-1 py-0.5 text-[#9e9174]">
                          +{prod.finishOptions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions with solid buttons and NO border frames */}
                  <div className="pt-3 border-t border-[#d4c59d]/20 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(prod, false)}
                      className="gold-shimmer-hover flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {prod.videoUrl && (
                      <button
                        type="button"
                        onClick={() => onSelectProduct(prod, true)}
                        className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors flex items-center gap-1.5"
                        title="Watch Embedded Video Directly"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Video</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/201016771010?text=Hello%20Turath%2C%20I%20am%20interested%20in%20"${encodeURIComponent(prod.name)}"%20(Product%20ID:%20${encodeURIComponent(prod.sku || prod.id)})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gold-shimmer-hover py-2.5 px-3.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center gap-1"
                      title="Direct WhatsApp Inquiry"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Inquire</span>
                    </a>
                  </div>
                </div>
              </TiltCard>
              );
            })}
          </div>
        )}

        {/* Section Interior Gallery & Architectural Showcase (Requirements 18 & 19) */}
        {category.galleryImages && category.galleryImages.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#d4c59d]/20 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6]">
                  {category.name} Architectural Highlights
                </h2>
                <p className="text-xs sm:text-sm text-[#9e9174] mt-1 font-arabic">
                  معرض الصور والتفاصيل الداخلية لقسم {category.nameArabic} بنسب عرض فردية ومستقلة
                </p>
              </div>

              {isAdmin && onOpenEditCover && (
                <button
                  type="button"
                  onClick={() => onOpenEditCover(category.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] text-xs font-bold uppercase tracking-wider transition-all shadow"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>إدارة صور ونسب المعرض</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {category.galleryImages.map((imgUrl, idx) => {
                const imgRatio = category.galleryRatios?.[imgUrl] || 'Original';
                const imgFit = category.galleryFits?.[imgUrl] || 'cover';
                const imgPos = category.galleryPositions?.[imgUrl] || 'center';
                const computed = computeImageRatio({
                  ratio: imgRatio,
                  fit: imgFit,
                  position: imgPos,
                });

                return (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border border-[#d4c59d]/30 hover:border-[#d4c59d] bg-[#000000] transition-all duration-300 shadow-xl group flex flex-col justify-between"
                  >
                    <UnifiedResponsiveImage
                      src={imgUrl}
                      alt={`${category.name} Gallery Showcase ${idx + 1}`}
                      computedRatio={computed}
                      containerClassName="bg-[#0a0a0f] max-h-[500px]"
                      imageClassName="group-hover:scale-105 transition-transform duration-500"
                    >
                      <div className="absolute top-2.5 right-2.5 bg-black/80 border border-[#d4c59d]/40 text-[#d4c59d] px-2 py-0.5 rounded text-[10px] font-mono font-bold z-10">
                        {imgRatio} • {imgFit}
                      </div>
                    </UnifiedResponsiveImage>

                    <div className="p-3 bg-[#0c0c12] border-t border-[#d4c59d]/20 flex items-center justify-between text-xs text-[#9e9174]">
                      <span className="font-serif-luxury text-[#f5f0e6] font-semibold">
                        {category.name} Gallery #{idx + 1}
                      </span>
                      <span className="text-[10px] text-[#d4c59d]">
                        Architectural View
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
