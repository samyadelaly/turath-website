import React, { useState } from 'react';
import { ProductCategoryInfo, ProductItem } from './types';
import { TiltCard } from './TiltCard';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  PlusCircle,
  Image as ImageIcon,
  Camera
} from 'lucide-react';

interface AllProductsViewProps {
  products: ProductItem[];
  categories: ProductCategoryInfo[];
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onOpenAddProduct: (categoryId?: string) => void;
  onOpenEditCoverModal?: (categoryId?: string) => void;
  onOpenCategoryManager?: () => void;
  isAdmin?: boolean;
}

export const AllProductsView: React.FC<AllProductsViewProps> = ({
  products,
  categories,
  onSelectCategory,
  onOpenAddProduct,
  onOpenEditCoverModal,
  onOpenCategoryManager,
  isAdmin = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) => {
    const matchCat = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const hasMatchingProduct = products.some(
      (p) => p.categoryId === cat.id && p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return !searchQuery || matchCat || hasMatchingProduct;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#000000]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4c59d] text-xs font-bold uppercase tracking-wider text-[#000000]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Collections from Egypt</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] tracking-wide">
            Our Handcrafted Brass Products
          </h1>

          <p className="text-sm sm:text-base text-[#d4c59d] leading-relaxed">
            Explore our {categories.length} signature masterwork collections. Each item is individually sculpted,
            pierced, or engraved by master artisans in Gamaliya Street, Cairo.
          </p>

          {/* Search & Actions Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#d4c59d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mirrors, chandeliers, lanterns, tables..."
                className="w-full bg-[#000000] border border-[#d4c59d]/50 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] placeholder-[#777]"
              />
            </div>

            {isAdmin && (
              <>
                {onOpenCategoryManager && (
                  <button
                    onClick={onOpenCategoryManager}
                    className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow font-arabic"
                    title="إدارة وإضافة أقسام المنتجات"
                  >
                    <span>إدارة الأقسام</span>
                  </button>
                )}

                {onOpenEditCoverModal && (
                  <button
                    onClick={() => onOpenEditCoverModal()}
                    className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all shadow"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>تعديل صور الأقسام</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenAddProduct()}
                  className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Custom Product</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 11 Product Categories Grid in solid black and gold with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => {
            const count = products.filter((p) => p.categoryId === category.id).length;

            return (
              <TiltCard
                key={category.id}
                className="group relative bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Cover */}
                <div 
                  onClick={() => onSelectCategory(category.id)}
                  className="relative aspect-[16/10] overflow-hidden bg-[#000000] cursor-pointer"
                >
                  <img
                    src={category.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />

                  <span className="absolute top-3 right-3 text-xs font-arabic font-bold bg-[#d4c59d] text-[#000000] px-2.5 py-1 rounded-full shadow">
                    {category.nameArabic}
                  </span>

                  <span className="absolute bottom-3 left-3 text-[11px] font-bold bg-[#d4c59d] text-[#000000] px-2.5 py-0.5 rounded-full shadow">
                    {count} {count === 1 ? 'Product Model' : 'Product Models'}
                  </span>

                  {/* Direct Change Cover Button on Card - Admin Only */}
                  {isAdmin && onOpenEditCoverModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditCoverModal(category.id);
                      }}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/60 text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg z-10"
                      title="Edit this category cover photo"
                    >
                      <Camera className="w-3 h-3" />
                      <span>تعديل الغلاف</span>
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 
                      onClick={() => onSelectCategory(category.id)}
                      className="font-serif-luxury text-xl font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors cursor-pointer"
                    >
                      {category.name}
                    </h2>
                    <p className="text-xs text-[#9e9174] leading-relaxed">
                      {category.shortDesc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#d4c59d]/20 flex items-center justify-between">
                    <button
                      onClick={() => onSelectCategory(category.id)}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4c59d] hover:text-[#e6d8b5] group-hover:translate-x-1 transition-all"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onOpenAddProduct(category.id)}
                        className="px-3 py-1 rounded bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] flex items-center gap-1 transition-colors"
                        title="Add product photo/video"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add item</span>
                      </button>
                    )}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
