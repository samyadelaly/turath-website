import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem, ProductCategoryInfo } from './types';
import { EmbeddedVideoPlayer } from './EmbeddedVideoPlayer';
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  MessageCircle, 
  Ruler, 
  ShieldCheck, 
  Clock, 
  Edit3, 
  Video, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  Share2,
  Maximize2,
  Tag,
  Hammer,
  Palette,
  Compass,
  Layers
} from 'lucide-react';

interface ProductDetailPageProps {
  product: ProductItem;
  category?: ProductCategoryInfo;
  allProducts: ProductItem[];
  categories: ProductCategoryInfo[];
  onBack: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectCategory?: (categoryId: string) => void;
  onSelectForInquiry: (product: ProductItem, selectedFinish?: string) => void;
  onEditProduct?: (product: ProductItem) => void;
  isAdmin?: boolean;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  category,
  allProducts,
  categories,
  onBack,
  onSelectProduct,
  onSelectCategory,
  onSelectForInquiry,
  onEditProduct,
  isAdmin = false,
}) => {
  const currentCategory =
    category ||
    categories.find((c) => c.id === product.categoryId) || {
      id: product.categoryId,
      name: 'Handcrafted Piece',
      nameArabic: 'قطعة حرفية',
      shortDesc: 'Egyptian Handcrafted Metalwork',
      description: '',
      coverImage: product.mainImage,
      iconName: 'Sparkles',
    };

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [selectedFinish, setSelectedFinish] = useState<string>(
    product.finish || product.finishOptions[0] || 'Natural Antique Patina'
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  // Valid images list: ensures mainImage is first and no empty strings
  const validImages: string[] = React.useMemo(() => {
    const list: string[] = [];
    if (product.mainImage && product.mainImage.trim()) {
      list.push(product.mainImage.trim());
    }
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'];
  }, [product]);

  const activeImage = validImages[activeImageIndex] || validImages[0];

  // Related products from the same category
  const relatedProducts = React.useMemo(() => {
    return allProducts
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 3);
  }, [allProducts, product]);

  // Update dynamic SEO meta tags and page title
  useEffect(() => {
    const originalTitle = document.title;
    const titleText = product.seoTitle || `${product.nameEN || product.name} | TURATH Egypt Luxury Metalwork`;
    document.title = titleText;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', product.metaDescription || product.shortDescEN || product.description);

    // Update Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const pageUrl = window.location.href;
    canonical.setAttribute('href', pageUrl);

    // Schema.org JSON-LD for rich product snippet
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'product-jsonld';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.nameEN || product.name,
      image: validImages,
      description: product.fullDescriptionEN || product.description,
      sku: product.sku || product.id,
      mpn: product.sku || product.id,
      brand: {
        '@type': 'Brand',
        name: 'TURATH Egypt',
      },
      material: product.material || product.materials,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.price || '0',
        availability: product.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
        seller: {
          '@type': 'Organization',
          name: 'TURATH Egypt',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = originalTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
      const existingSchema = document.getElementById('product-jsonld');
      if (existingSchema) existingSchema.remove();
    };
  }, [product, validImages]);

  // Product-specific WhatsApp message
  const whatsappUrl = React.useMemo(() => {
    if (product.whatsappMessage && product.whatsappMessage.trim()) {
      return `https://wa.me/201016771010?text=${encodeURIComponent(product.whatsappMessage.trim())}`;
    }
    const message = `Hello TURATH,\nI am interested in:\n${product.nameEN || product.name}\nProduct ID / SKU: ${product.sku || product.id}\nCategory: ${category.name}\nSelected Finish: ${selectedFinish}\n\nPlease provide technical specifications and pricing.`;
    return `https://wa.me/201016771010?text=${encodeURIComponent(message)}`;
  }, [product, category, selectedFinish]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#000000] text-[#f5f0e6]">
      {/* Breadcrumbs & Navigation Bar */}
      <div className="border-b border-[#d4c59d]/30 bg-[#0a0a0c] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#9e9174] flex-wrap">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#d4c59d] text-[#000000] font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[#9e9174]">/</span>
            <button
              onClick={() => onSelectCategory(category.id)}
              className="text-[#d4c59d] hover:underline font-medium"
            >
              {category.name}
            </button>
            <span className="text-[#9e9174]">/</span>
            <span className="text-[#f5f0e6] font-semibold truncate max-w-[200px] sm:max-w-xs">
              {product.nameEN || product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d]/10 transition-colors"
              title="Copy link to this product"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied' : 'Share'}</span>
            </button>

            {isAdmin && onEditProduct && (
              <button
                onClick={() => onEditProduct(product)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-[#000000] bg-[#d4c59d] hover:bg-[#e6d8b5] font-bold uppercase tracking-wider transition-colors shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Piece</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: Dynamic Image Showcase & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* View Mode Switcher: Photos vs Embedded Video */}
            <div className="flex items-center justify-between pb-2 border-b border-[#d4c59d]/20">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideo(false)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                    !showVideo
                      ? 'bg-[#d4c59d] text-[#000000]'
                      : 'bg-[#141418] text-[#d4c59d] hover:bg-[#1f1f26]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Product Photos ({validImages.length})</span>
                </button>

                {product.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                      showVideo
                        ? 'bg-[#d4c59d] text-[#000000]'
                        : 'bg-[#141418] text-[#d4c59d] hover:bg-[#1f1f26]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Craft Video</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9e9174]">
                <span className="font-mono text-[#d4c59d] bg-[#141418] px-2 py-0.5 rounded border border-[#d4c59d]/30">
                  ID: {product.sku || product.id}
                </span>
              </div>
            </div>

            {/* Main Stage Display */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0c0c0f] border border-[#d4c59d]/40 flex items-center justify-center group shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              {showVideo && product.videoUrl ? (
                <EmbeddedVideoPlayer
                  videoUrl={product.videoUrl}
                  title={product.nameEN || product.name}
                  posterImage={activeImage}
                  autoPlay={true}
                  className="w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={activeImage}
                    alt={product.imageAltEN || product.nameEN || product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    onClick={() => setIsZoomOpen(true)}
                  />

                  {/* Expand Zoom Button */}
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 text-[#d4c59d] hover:bg-black hover:text-[#f5f0e6] transition-colors backdrop-blur-sm"
                    title="Fullscreen View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Navigation Arrows for Photos */}
                  {validImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors shadow-lg"
                        aria-label="Previous Image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors shadow-lg"
                        aria-label="Next Image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Gallery Thumbnails List with Set as Main visual clarity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#9e9174] uppercase tracking-wider">
                <span>Product Gallery Thumbnails</span>
                <span>{activeImageIndex + 1} of {validImages.length}</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setShowVideo(false);
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all border ${
                      !showVideo && activeImageIndex === idx
                        ? 'border-[#d4c59d] ring-2 ring-[#d4c59d] scale-95 shadow-md'
                        : 'border-[#333] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] uppercase tracking-wider text-[#d4c59d] font-bold">
                        Main
                      </span>
                    )}
                  </button>
                ))}

                {product.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all border flex flex-col items-center justify-center gap-1 ${
                      showVideo
                        ? 'border-[#d4c59d] ring-2 ring-[#d4c59d] bg-[#d4c59d] text-[#000000]'
                        : 'border-[#333] bg-[#141418] text-[#d4c59d] hover:bg-[#1f1f26]'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-[9px] uppercase font-bold">Video</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information, Specs, Finishes & Inquiries */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & Taglines (Bilingual Support) */}
            <div className="space-y-3 pb-4 border-b border-[#d4c59d]/20">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] text-xs font-bold uppercase tracking-wider border border-[#d4c59d]/30">
                  {category.name}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141418] text-[#d4c59d] text-xs font-mono border border-[#d4c59d]/20">
                  {product.sku || product.id}
                </span>
                {product.availability && (
                  <span className="px-2.5 py-1 rounded bg-green-950/60 text-green-300 text-xs font-semibold uppercase tracking-wider border border-green-800/40">
                    {product.availability === 'in_stock' ? 'In Stock' : product.availability === 'custom_only' ? 'Custom Fabrication' : 'Made to Order'}
                  </span>
                )}
              </div>

              {/* English Name */}
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f0e6] tracking-wide leading-tight">
                {product.nameEN || product.name}
              </h1>

              {/* Arabic Name */}
              {product.nameAR && (
                <h2 className="font-arabic text-xl sm:text-2xl text-[#d4c59d] font-bold leading-normal">
                  {product.nameAR}
                </h2>
              )}

              {/* Tagline */}
              {(product.shortDescEN || product.tagline) && (
                <p className="text-sm text-[#d4c59d] font-serif italic">
                  "{product.shortDescEN || product.tagline}"
                </p>
              )}

              {/* Arabic Short Description */}
              {product.shortDescAR && (
                <p className="text-xs sm:text-sm text-[#b8b2a3] font-arabic leading-relaxed">
                  {product.shortDescAR}
                </p>
              )}
            </div>

            {/* Finish Options Selector */}
            {product.finishOptions && product.finishOptions.length > 0 && (
              <div className="space-y-2.5 pb-4 border-b border-[#d4c59d]/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#d4c59d] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Select Artisan Finish:</span>
                  </span>
                  <span className="text-xs text-[#f5f0e6] font-semibold">{selectedFinish}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.finishOptions.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                        selectedFinish === finish
                          ? 'bg-[#d4c59d] text-[#000000] ring-1 ring-[#e6d8b5] shadow-sm'
                          : 'bg-[#141418] text-[#d4c59d] border border-[#d4c59d]/30 hover:bg-[#d4c59d] hover:text-[#000000]'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Technical Specs Grid */}
            <div className="bg-[#0c0c10] p-4 rounded-xl border border-[#d4c59d]/40 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Ruler className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">
                    Dimensions:
                  </span>
                  <span className="text-[#f5f0e6] font-medium">{product.dimensions || 'Custom sizing available'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">
                    Material / Metallurgy:
                  </span>
                  <span className="text-[#f5f0e6] font-medium">
                    {product.material || product.materials || 'Solid Egyptian Yellow Brass'}
                  </span>
                </div>
              </div>

              {product.craftTechnique && (
                <div className="flex items-start gap-3">
                  <Hammer className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">
                      Crafting Technique:
                    </span>
                    <span className="text-[#f5f0e6] font-medium">{product.craftTechnique}</span>
                  </div>
                </div>
              )}

              {product.leadTime && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9e9174] block text-[11px] uppercase tracking-wider font-bold">
                      Crafting / Lead Time:
                    </span>
                    <span className="text-[#f5f0e6] font-medium">{product.leadTime}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onSelectForInquiry(product, selectedFinish)}
                className="gold-shimmer-hover w-full py-4 px-6 text-sm font-bold uppercase tracking-wider rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request a Quote for this Piece</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-shimmer-hover w-full py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg bg-[#141418] border border-[#d4c59d]/50 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>Inquire on WhatsApp (+20 01016771010)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Tabs / Comprehensive Specs Breakdown */}
        <div className="mt-16 pt-10 border-t border-[#d4c59d]/30 space-y-12">
          {/* Full Descriptions (EN & AR) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 bg-[#0a0a0c] p-6 rounded-xl border border-[#d4c59d]/30">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d4c59d] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Masterwork Description (English)</span>
              </div>
              <p className="text-sm text-[#f5f0e6]/90 leading-relaxed font-sans whitespace-pre-line">
                {product.fullDescriptionEN || product.description}
              </p>
            </div>

            {product.fullDescriptionAR && (
              <div className="space-y-3 bg-[#0a0a0c] p-6 rounded-xl border border-[#d4c59d]/30" dir="rtl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d4c59d] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-arabic">الوصف المعماري والتراثي (عربي)</span>
                </div>
                <p className="text-sm text-[#f5f0e6]/90 leading-relaxed font-arabic whitespace-pre-line">
                  {product.fullDescriptionAR}
                </p>
              </div>
            )}
          </div>

          {/* Historical Story & Artisan Lineage */}
          {product.story && (
            <div className="bg-[#12110e] border border-[#d4c59d]/50 p-6 sm:p-8 rounded-xl relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#d4c59d] font-bold">
                  Artisan Lineage & Heritage
                </span>
                <p className="text-base sm:text-lg text-[#f5ebd7] font-serif italic leading-relaxed">
                  "{product.story}"
                </p>
                <span className="text-xs text-[#9e9174] block">
                  — Handcrafted in Gamaliya District, Historic Cairo, Egypt
                </span>
              </div>
            </div>
          )}

          {/* Technical Specifications Table & Category-Specific Attributes */}
          <div className="bg-[#0c0c10] rounded-xl border border-[#d4c59d]/40 p-6 sm:p-8 space-y-6">
            <h3 className="font-serif-luxury text-xl font-bold text-[#f5f0e6] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#d4c59d]" />
              <span>Full Technical & Manufacturing Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              {/* Product SKU/ID */}
              <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                  Product ID / SKU
                </span>
                <span className="text-[#f5f0e6] font-mono font-bold text-sm">
                  {product.sku || product.id}
                </span>
              </div>

              {/* Primary Material */}
              <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                  Primary Material
                </span>
                <span className="text-[#f5f0e6] font-bold">
                  {product.material || product.materials || 'Solid Egyptian Yellow Brass'}
                </span>
              </div>

              {/* Material Details */}
              {product.materialDetails && (
                <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                  <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                    Material Composition Details
                  </span>
                  <span className="text-[#f5f0e6]">{product.materialDetails}</span>
                </div>
              )}

              {/* Finish Details */}
              {product.finishDetails && (
                <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                  <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                    Patina & Surface Sealing
                  </span>
                  <span className="text-[#f5f0e6]">{product.finishDetails}</span>
                </div>
              )}

              {/* Technique Details */}
              {product.techniqueDetails && (
                <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                  <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                    Technique Details
                  </span>
                  <span className="text-[#f5f0e6]">{product.techniqueDetails}</span>
                </div>
              )}

              {/* Height / Width / Depth / Diameter */}
              {(product.height || product.width || product.depth || product.diameter) && (
                <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                  <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                    Dimensions Breakdown
                  </span>
                  <div className="space-y-0.5 text-[#f5f0e6]">
                    {product.height && <div>Height: {product.height}</div>}
                    {product.width && <div>Width: {product.width}</div>}
                    {product.depth && <div>Depth: {product.depth}</div>}
                    {product.diameter && <div>Diameter: {product.diameter}</div>}
                  </div>
                </div>
              )}

              {/* Weight */}
              {product.weight && (
                <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                  <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                    Total Weight
                  </span>
                  <span className="text-[#f5f0e6] font-bold">{product.weight}</span>
                </div>
              )}

              {/* Custom Dimensions Capability */}
              {product.customDimensions && (
                <div className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                  <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                    Custom Dimensions Capability
                  </span>
                  <span className="text-[#f5f0e6]">{product.customDimensions}</span>
                </div>
              )}

              {/* Category-Specific Fields if available */}
              {product.categoryFields && Object.keys(product.categoryFields).length > 0 && (
                Object.entries(product.categoryFields).map(([key, value]) => {
                  if (!value) return null;
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                  return (
                    <div key={key} className="p-3.5 rounded-lg bg-[#141418] border border-[#333]">
                      <span className="text-[#9e9174] uppercase tracking-wider block font-semibold mb-1">
                        {label}
                      </span>
                      <span className="text-[#f5f0e6]">
                        {typeof value === 'boolean' ? (value ? 'Included / Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Customization Details Block */}
            <div className="p-4 rounded-lg bg-[#101015] border border-[#d4c59d]/20 space-y-2 text-xs">
              <span className="text-[#d4c59d] uppercase tracking-wider font-bold block">
                Bespoke Architectural Customization Options
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#b8b2a3]">
                <div>
                  <span className="text-[#f5f0e6] font-semibold block mb-0.5">Custom Sizing:</span>
                  <span>{product.customSize || 'Custom diameters and profiles available upon request'}</span>
                </div>
                <div>
                  <span className="text-[#f5f0e6] font-semibold block mb-0.5">Custom Design:</span>
                  <span>{product.customDesign || 'Motif and geometric pattern custom tailored to architectural CAD'}</span>
                </div>
                <div>
                  <span className="text-[#f5f0e6] font-semibold block mb-0.5">Custom Finish:</span>
                  <span>{product.customFinish || 'Available in polished gold, antique patina, black bronze or verdigris'}</span>
                </div>
              </div>
            </div>

            {/* Suitable Applications Badges */}
            {product.applications && product.applications.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#9e9174] block">
                  Recommended Project Applications:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app) => (
                    <span
                      key={app}
                      className="px-3 py-1 rounded-full bg-[#16161c] text-[#d4c59d] text-xs border border-[#d4c59d]/30 font-medium"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#f5f0e6]">
                    More from {category.name}
                  </h3>
                  <p className="text-xs text-[#9e9174]">
                    Handcrafted Egyptian pieces that harmonize with this design
                  </p>
                </div>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className="text-xs font-bold uppercase text-[#d4c59d] hover:underline"
                >
                  View All in Category →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="group bg-[#0c0c10] border border-[#d4c59d]/30 hover:border-[#d4c59d] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-black relative">
                      <img
                        src={rel.mainImage || rel.images[0]}
                        alt={rel.nameEN || rel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#d4c59d]">
                        {rel.sku || rel.id}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-serif-luxury text-base font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors line-clamp-1">
                        {rel.nameEN || rel.name}
                      </h4>
                      <p className="text-xs text-[#9e9174] line-clamp-2">
                        {rel.shortDescEN || rel.tagline || rel.description}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs text-[#d4c59d] font-bold uppercase">
                        <span>View Piece</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#d4c59d] text-black hover:bg-[#e6d8b5] transition-colors"
            >
              ✕
            </button>
            <img
              src={activeImage}
              alt={product.nameEN || product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-[#d4c59d]/40"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
