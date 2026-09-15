import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ProductCategoryInfo } from './types';
import { compressSquareImage1080, RECOMMENDED_IMAGE_DIMENSIONS } from './imageCompressor';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Image as ImageIcon, 
  Layers, 
  Eye,
  Loader2
} from 'lucide-react';

interface EditCategoryCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategoryInfo[];
  initialCategoryId?: string | null;
  onSaveCover: (categoryId: string, newCoverUrl: string) => void;
  onResetCover: (categoryId: string) => void;
}

// Curated high quality authentic brass presets for inspiration
const BRASS_PRESETS = [
  {
    title: 'Gamaliya Islamic Chandelier',
    titleAr: 'ثريا إسلامية مخرمة',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Khan el-Khalili Brass Lantern',
    titleAr: 'فانوس خان الخليلي العتيق',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Hammered Brass Sunburst Mirror',
    titleAr: 'مرآة شمسية نحاسية مقعرة',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Arabesque Brass Wall Sconce',
    titleAr: 'أبليك حائطي بزخارف إسلامية',
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Royal Brass & Marble Console',
    titleAr: 'كونسول نحاسي ملكي',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Cast Brass Lion Palace Door Knocker',
    titleAr: 'مقبض باب قصر نحاسي سباكة رملية',
    url: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Spiral Architectural Brass Balustrade',
    titleAr: 'درابزين درج نحاسي معماري',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Pierced Brass Mashrabiya Screen',
    titleAr: 'تكسية ومشربية نحاس مفرغة',
    url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Hand-Engraved Brass Serving Trays',
    titleAr: 'صواني وتحف نحاسية منقوشة',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
  },
];

export const EditCategoryCoverModal: React.FC<EditCategoryCoverModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialCategoryId,
  onSaveCover,
  onResetCover,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategoryId || categories[0]?.id || 'brass-mirrors'
  );
  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const [inputUrl, setInputUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(() => activeCategory?.coverImage || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync when opening or initialCategoryId changes
  useEffect(() => {
    if (initialCategoryId && categories.some((c) => c.id === initialCategoryId)) {
      setSelectedCatId(initialCategoryId);
    } else if (categories[0]) {
      setSelectedCatId(categories[0].id);
    }
  }, [initialCategoryId, isOpen, categories]);

  useEffect(() => {
    if (activeCategory) {
      setPreviewUrl(activeCategory.coverImage || '');
      setInputUrl(activeCategory.coverImage && !activeCategory.coverImage.startsWith('data:') ? activeCategory.coverImage : '');
      setSavedSuccess(false);
      setErrorMessage(null);
    }
  }, [selectedCatId, activeCategory]);

  if (!isOpen || !activeCategory) return null;

  // Handle direct file upload from computer/phone with client-side compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMessage(null);
      // Automatically compress & scale image to standard 1080x1080 square format
      const compressedDataUrl = await compressSquareImage1080(file, 1080, 0.88);
      setPreviewUrl(compressedDataUrl);
      setInputUrl('');
      setSavedSuccess(false);
    } catch (err) {
      console.error('Error processing uploaded image:', err);
      setErrorMessage('تعذر معالجة الصورة، يرجى المحاولة بصورة أخرى.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = inputUrl.trim();
    if (trimmed) {
      setPreviewUrl(trimmed);
      setSavedSuccess(false);
      setErrorMessage(null);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    setInputUrl(url);
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  const handleSave = () => {
    // If user entered an image URL in the input field, make sure it is applied even if they didn't click Apply button
    let finalUrl = previewUrl;
    if (inputUrl.trim() && inputUrl.trim() !== activeCategory.coverImage) {
      finalUrl = inputUrl.trim();
      setPreviewUrl(finalUrl);
    }

    if (finalUrl && finalUrl.trim().length > 0) {
      try {
        onSaveCover(selectedCatId, finalUrl.trim());
        setSavedSuccess(true);
        setErrorMessage(null);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1200);
      } catch (err) {
        console.error('Failed to save cover:', err);
        setErrorMessage('حدث خطأ أثناء حفظ الصورة، يرجى المحاولة مرة أخرى.');
      }
    } else {
      setErrorMessage('يرجى اختيار أو رفع صورة أولاً.');
    }
  };

  const handleReset = () => {
    onResetCover(selectedCatId);
    setSavedSuccess(true);
    setErrorMessage(null);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#000000] border border-[#d4c59d] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/30 bg-[#0a0a0a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4c59d]/10 border border-[#d4c59d]/40 flex items-center justify-center text-[#d4c59d]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-[#f5f0e6]">
                Edit Category Cover Photo
              </h2>
              <p className="text-[11px] text-[#d4c59d] font-arabic">
                تعديل وتغيير صورة الغلاف للأقسام الرئيسية الـ 11
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#141414] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Category Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Select Category to Change Cover
              </span>
              <span className="text-[11px] font-arabic font-normal text-[#9e9174]">
                اختر القسم المراد تعديل صورته
              </span>
            </label>

            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#111111] text-[#f5f0e6]">
                  {cat.name} ({cat.nameArabic})
                </option>
              ))}
            </select>
          </div>

          {/* Current Live Preview Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Cover Preview
              </span>
              <span className="text-[11px] text-[#9e9174]">
                {activeCategory.name} • {activeCategory.nameArabic}
              </span>
            </div>

            <div className="relative aspect-[16/8] sm:aspect-[16/7] rounded-xl overflow-hidden border border-[#d4c59d]/50 bg-[#111111] shadow-inner">
              <img
                src={previewUrl || activeCategory.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'}
                alt={activeCategory.name}
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              
              {/* Badge Overlay */}
              <div className="absolute top-3 right-3 bg-[#d4c59d] text-[#000000] px-3 py-1 rounded shadow text-xs font-arabic font-bold">
                {activeCategory.nameArabic}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#f5f0e6] drop-shadow-md">
                  {activeCategory.name}
                </h3>
                <p className="text-xs text-[#d4c59d] line-clamp-1 drop-shadow">
                  {activeCategory.shortDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Option A: Upload from Device */}
          <div className="bg-[#0c0c0c] border border-[#d4c59d]/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#d4c59d]" />
                  Upload New Image from Your Computer or Phone
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-[#9e9174] font-arabic">
                    ارفع صورة عالية الجودة من جهازك مباشرة (JPG, PNG, WEBP)
                  </p>
                  <span className="text-[10px] font-bold text-[#d4c59d] bg-[#d4c59d]/15 px-2 py-0.5 rounded border border-[#d4c59d]/30 font-mono">
                    1080 × 1080 px
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow disabled:opacity-50">
                {isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Choose Image from Device</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isCompressing}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-[#9e9174]">
                {isCompressing ? 'جاري ضغط ومعالجة الصورة...' : 'Any photo format accepted (auto-optimized)'}
              </span>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Option B: Enter Direct Web Image URL */}
          <div className="bg-[#0c0c0c] border border-[#d4c59d]/30 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6]">
              Or Paste an Image URL Link
            </h4>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or any image link"
                className="flex-1 bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3 py-2 text-xs text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Option C: Quick Brass Heritage Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Egyptian Brass Masterpieces (1-Click Selection)
              </span>
              <span className="text-[11px] text-[#9e9174] font-arabic">
                نماذج نحاس مصرية جاهزة
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {BRASS_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`group relative aspect-[16/10] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    previewUrl === preset.url
                      ? 'border-[#d4c59d] ring-2 ring-[#d4c59d]'
                      : 'border-[#d4c59d]/20 hover:border-[#d4c59d]'
                  }`}
                  title={preset.title}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] text-[#f5f0e6] font-medium truncate drop-shadow bg-black/60 px-1 py-0.5 rounded">
                    {preset.titleAr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#d4c59d]/30 bg-[#0a0a0a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original Default Cover</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold animate-pulse">
                <Check className="w-4 h-4" />
                <span>Cover photo saved!</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#141414] border border-[#d4c59d]/30 text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="gold-shimmer-hover flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Cover Photo</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
