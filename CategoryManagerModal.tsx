import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Upload, 
  Cloud, 
  Loader2, 
  Layers, 
  Image as ImageIcon,
  Sparkles,
  Info
} from 'lucide-react';
import { ProductCategoryInfo } from './types';
import { compressSquareImage1080, RECOMMENDED_IMAGE_DIMENSIONS } from './imageCompressor';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategoryInfo[];
  onSaveCategory: (category: ProductCategoryInfo) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('new');
  const [name, setName] = useState<string>('');
  const [nameArabic, setNameArabic] = useState<string>('');
  const [shortDesc, setShortDesc] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [iconName, setIconName] = useState<string>('Sparkles');

  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: ProductCategoryInfo) => {
    setSelectedCatId(cat.id);
    setName(cat.name);
    setNameArabic(cat.nameArabic || '');
    setShortDesc(cat.shortDesc);
    setDescription(cat.description);
    setCoverImage(cat.coverImage);
    setIconName(cat.iconName || 'Sparkles');
    setStatusMessage(null);
  };

  const handleCreateNew = () => {
    setSelectedCatId('new');
    setName('');
    setNameArabic('');
    setShortDesc('');
    setDescription('');
    setCoverImage('');
    setIconName('Sparkles');
    setStatusMessage(null);
  };

  // 1080x1080 image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      setStatusMessage('جاري تهيئة وضبط أبعاد الصورة إلى 1080 × 1080 بكسل...');
      const squared1080 = await compressSquareImage1080(file, 1080, 0.88);
      setCoverImage(squared1080);
      setStatusMessage('تم تجهيز صورة الغلاف بمقاس 1080 × 1080 بكسل بنجاح!');
    } catch (err) {
      console.error(err);
      setStatusMessage('تعذر معالجة الصورة، يرجى تجربة صورة أخرى.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage('يرجى إدخال اسم القسم بالإنجليزية.');
      return;
    }

    setIsSaving(true);
    setStatusMessage('جاري الحفظ في السيرفر السحابي...');

    const categoryId =
      selectedCatId === 'new'
        ? `cat-${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`
        : selectedCatId;

    const newCategory: ProductCategoryInfo = {
      id: categoryId,
      name: name.trim(),
      nameArabic: nameArabic.trim() || name.trim(),
      shortDesc: shortDesc.trim() || 'Handcrafted Egyptian Brass Collection',
      description: description.trim() || 'Masterfully crafted in Cairo, Egypt.',
      coverImage:
        coverImage.trim() ||
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1080&h=1080&q=80',
      iconName: iconName || 'Sparkles',
    };

    try {
      await onSaveCategory(newCategory);
      setStatusMessage('تم حفظ القسم سحابياً بنجاح! سيظهر الآن في الموقع والصفحات.');
      handleSelectCategory(newCategory);
      setTimeout(() => {
        setStatusMessage(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setStatusMessage('حدث خطأ أثناء الحفظ، يرجى المحاولة ثانية.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (catId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    setIsSaving(true);
    try {
      await onDeleteCategory(catId);
      handleCreateNew();
      setStatusMessage('تم حذف القسم بنجاح.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0e0e13] border-2 border-[#d4c59d]/50 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>إدارة وإضافة أقسام المنتجات (Manage Categories)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Cloud Live
                </span>
              </h2>
              <p className="text-xs text-[#9e9174]">
                أضف أقساماً جديدة، عدّل الأسماء والأوصاف، وارفع صور أغلفة مربعة بمقاس 1080 × 1080 بكسل
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: List of Categories */}
          <div className="md:col-span-4 border-r border-[#d4c59d]/20 bg-[#0a0a0f] p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                الأقسام الحالية ({categories.length})
              </span>
              <button
                type="button"
                onClick={handleCreateNew}
                className="px-2.5 py-1 rounded bg-[#d4c59d] text-[#000000] text-xs font-bold flex items-center gap-1 hover:bg-[#e6d8b5]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    selectedCatId === cat.id
                      ? 'bg-[#1a1820] border-[#d4c59d] shadow-md'
                      : 'bg-[#121218] border-white/5 hover:border-[#d4c59d]/40'
                  }`}
                >
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#d4c59d]/30"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-bold text-xs text-[#f5f0e6] truncate">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-[#d4c59d] font-arabic truncate">
                      {cat.nameArabic || ''}
                    </div>
                    <div className="text-[10px] text-[#9e9174] truncate">
                      {cat.shortDesc}
                    </div>
                  </div>
                  {cat.id.startsWith('cat-') && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cat.id);
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                      title="حذف هذا القسم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Edit or Create Category Form */}
          <form
            onSubmit={handleSave}
            className="md:col-span-8 p-6 overflow-y-auto space-y-5 bg-[#0e0e13]"
          >
            {statusMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-[#d4c59d]/20 pb-3">
              <h3 className="text-sm font-bold text-[#f5f0e6] flex items-center gap-2">
                {selectedCatId === 'new' ? (
                  <>
                    <Plus className="w-4 h-4 text-[#d4c59d]" />
                    <span>إضافة قسم جديد للمنتجات</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 text-[#d4c59d]" />
                    <span>تعديل القسم: {name || selectedCatId}</span>
                  </>
                )}
              </h3>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                  اسم القسم بالإنجليزية (English Title) *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Handcrafted Brass Chandeliers"
                  required
                  className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5 font-arabic">
                  اسم القسم بالعربية (Arabic Title)
                </label>
                <input
                  type="text"
                  value={nameArabic}
                  onChange={(e) => setNameArabic(e.target.value)}
                  placeholder="مثال: نجف وإضاءة نحاسية فاخرة"
                  dir="rtl"
                  className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none font-arabic"
                />
              </div>
            </div>

            {/* Short Tagline */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                وصف موجز (Short Tagline)
              </label>
              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="e.g., Dramatic pierced lighting fixtures casting arabesque shadows"
                className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                الوصف الكامل للقسم (Detailed Story)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب نبذة عن الحرفية، المواد النحاسية، والنقش اليدوي لهذا القسم..."
                className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
              />
            </div>

            {/* 1080x1080 Cover Image Section */}
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>صورة غلاف القسم (Category Cover Image)</span>
                  </span>
                  <div className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded mt-1">
                    <Sparkles className="w-3 h-3 text-[#d4c59d]" />
                    <span>المقاس الموصى به والمثالي: <strong>1080 × 1080 بكسل (Square 1:1)</strong></span>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة (1080×1080)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-[#d4c59d]/50 bg-black flex-shrink-0 relative group">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#9e9174] text-[10px] text-center p-2">
                      <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                      <span>لا توجد صورة</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[#d4c59d] text-[9px] px-1 rounded font-mono">
                    1080×1080
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="أو ضع رابط صورة مباشر (https://...)"
                    className="w-full bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                  />
                  <p className="text-[11px] text-[#9e9174] leading-relaxed">
                    يتم تحسين وقص وضبط أي صورة ترفعها تلقائياً إلى 1080×1080 بكسل لتحافظ على أعلى دقة وأسرع تحميل على جميع الشاشات.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-3 border-t border-[#d4c59d]/20 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-[#f5f0e6] hover:bg-white/10 rounded-lg transition-colors"
              >
                إغلاق
              </button>

              <button
                type="submit"
                disabled={isSaving || isProcessingImage}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحفظ السحابي...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>{selectedCatId === 'new' ? 'إضافة القسم سحابياً' : 'تحديث القسم سحابياً'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
