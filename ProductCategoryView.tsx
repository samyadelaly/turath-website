import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProductCategoryInfo, ProductItem } from './types';
import { getStoredCategories } from './categoryStorage';
import { TiltCard } from './TiltCard';
import { 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  Eye, 
  Video, 
  SlidersHorizontal,
  Layers,
  MessageCircle,
  Camera
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
  isAdmin = false,
}) => {
  const allCategoriesList = categories || getStoredCategories();
  const [selectedFinishFilter, setSelectedFinishFilter] = useState<string>('all');
  const [onlyWithVideo, setOnlyWithVideo] = useState<boolean>(false);

  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  // Unique finishes in this category
  const allFinishes = Array.from(
    new Set(categoryProducts.flatMap((p) => p.finishOptions))
  );

  const filteredProducts = categoryProducts
    .filter((p) => selectedFinishFilter === 'all' || p.finishOptions.includes(selectedFinishFilter))
    .filter((p) => (!onlyWithVideo ? true : Boolean(p.videoUrl)));

  return (
    <div className="min-h-screen pb-20 bg-[#000000]">
      {/* Category Hero Banner in solid black and gold */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-[#d4c59d]/30 bg-[#000000]">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#9e9174] mb-4">
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

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4c59d] text-xs font-bold uppercase text-[#000000]">
                <Sparkles className="w-3 h-3" />
                <span className="font-arabic">{category.nameArabic}</span>
                <span>• Egyptian Brass Collection</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] tracking-wide">
                {category.name}
              </h1>

              <p className="text-sm sm:text-base text-[#d4c59d] leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Direct Add Product Photo/Video CTA & Edit Cover Button - Admin Only */}
            {isAdmin && (
              <div className="flex-shrink-0 flex items-center gap-3">
                {onOpenEditCover && (
                  <button
                    onClick={() => onOpenEditCover(category.id)}
                    className="inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-md bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow"
                    title="Change cover photo of this category"
                  >
                    <Camera className="w-4 h-4" />
                    <span>تعديل غلاف القسم</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenAddProduct(category.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product to {category.name}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Category Switcher Tabs without border frames */}
          <div className="mt-8 pt-6 border-t border-[#d4c59d]/20 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#d4c59d]/20">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#d4c59d]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#d4c59d]">
              Finish Filter:
            </span>
            <div className="flex flex-wrap gap-1.5 ml-2">
              <button
                onClick={() => setSelectedFinishFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                  selectedFinishFilter === 'all'
                    ? 'bg-[#d4c59d] text-[#000000]'
                    : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
                }`}
              >
                All Finishes ({categoryProducts.length})
              </button>
              {allFinishes.map((finish) => (
                <button
                  key={finish}
                  onClick={() => setSelectedFinishFilter(finish)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    selectedFinishFilter === finish
                      ? 'bg-[#d4c59d] text-[#000000]'
                      : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000]'
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
            {/* Video Only Filter Toggle */}
            <button
              onClick={() => setOnlyWithVideo(!onlyWithVideo)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                onlyWithVideo
                  ? 'bg-[#d4c59d] text-[#000000]'
                  : 'bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#252525]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Embedded Videos Only</span>
            </button>
          </div>

          <div className="text-xs text-[#9e9174]">
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
            {filteredProducts.map((prod) => (
              <TiltCard
                key={prod.id}
                className="group bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Hover Actions */}
                <div 
                  onClick={() => onSelectProduct(prod, false)}
                  className="relative aspect-[4/3] overflow-hidden bg-[#000000] cursor-pointer"
                >
                  <img
                    src={(prod.images && prod.images.find((img) => typeof img === 'string' && img.trim().length > 0)) || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                    {prod.featured && (
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-[#d4c59d] text-[#000000] px-2 py-0.5 rounded shadow">
                        Masterwork
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
                </div>

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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
