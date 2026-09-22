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
  AlertTriangle,
  Video,
  Volume2,
  VolumeX,
  Eye,
  Flame,
  Crown,
  Wine,
  Gem,
  Compass,
  Shield,
  Heart,
  Key,
  Star,
  Feather,
  ExternalLink
} from 'lucide-react';
import { ProductCategoryInfo, ProductItem } from './types';
import { compressSquareImage1080, preserveOriginalUploadedImage } from './imageCompressor';
import { TurathMedia } from "./TurathMedia";
import { ImageRatioSelectorControl } from "./ImageRatioSelectorControl";
import { MediaRatioSelectorControl } from "./MediaRatioSelectorControl";
import { 
  ImageRatioPreset, 
  ImageObjectFit, 
  ImageObjectPosition, 
  MediaType, 
  MediaRatioPreset,
  MediaObjectFit,
  MediaObjectPosition
} from './imageRatioUtils';
import { saveLocalCategoryVideo } from './mediaStorage';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategoryInfo[];
  products?: ProductItem[];
  initialSelectedId?: string | null;
  onSaveCategory: (category: ProductCategoryInfo) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onNavigateToCategory?: (categoryId: string) => void;
}

const LUXURY_ICONS = [
  { name: 'Sparkles', labelAr: 'نجف وإضاءة', labelEn: 'Chandeliers & Lighting', icon: Sparkles },
  { name: 'Flame', labelAr: 'مباخر ومعدن', labelEn: 'Incense & Firecraft', icon: Flame },
  { name: 'Layers', labelAr: 'مرايا وديكور', labelEn: 'Mirrors & Decor', icon: Layers },
  { name: 'Crown', labelAr: 'تحف ملكية', labelEn: 'Royal Masterpieces', icon: Crown },
  { name: 'Wine', labelAr: 'طاولات وكونسول', labelEn: 'Tables & Consoles', icon: Wine },
  { name: 'Gem', labelAr: 'أنتيك ونقش يدوي', labelEn: 'Antique & Engraving', icon: Gem },
  { name: 'Compass', labelAr: 'معمار ومشربيات', labelEn: 'Architecture & Screens', icon: Compass },
  { name: 'Shield', labelAr: 'درابزين وأبواب', labelEn: 'Balustrades & Gates', icon: Shield },
  { name: 'Key', labelAr: 'مقابض وإكسسوارات', labelEn: 'Handles & Hardware', icon: Key },
  { name: 'Heart', labelAr: 'حرفيات وهدايا', labelEn: 'Artisan Gifts', icon: Heart },
  { name: 'Feather', labelAr: 'زخرفة عربية', labelEn: 'Arabesque Details', icon: Feather },
  { name: 'Star', labelAr: 'مجموعات حصرية', labelEn: 'Exclusive Line', icon: Star },
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  products = [],
  initialSelectedId,
  onSaveCategory,
  onDeleteCategory,
  onNavigateToCategory,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(() => initialSelectedId || 'new');
  const [name, setName] = useState<string>('');
  const [nameArabic, setNameArabic] = useState<string>('');
  const [shortDesc, setShortDesc] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [iconName, setIconName] = useState<string>('Sparkles');

  // Media Type: Image or Video
  const [coverMediaType, setCoverMediaType] = useState<MediaType>('image');

  // Cover Image States
  const [coverImage, setCoverImage] = useState<string>('');
  const [coverImageRatio, setCoverImageRatio] = useState<ImageRatioPreset>('16:7');
  const [customRatioWidth, setCustomRatioWidth] = useState<string>('16');
  const [customRatioHeight, setCustomRatioHeight] = useState<string>('7');
  const [coverImageFit, setCoverImageFit] = useState<ImageObjectFit>('cover');
  const [coverImagePosition, setCoverImagePosition] = useState<ImageObjectPosition>('center');

  // Cover Video States
  const [coverVideoUrl, setCoverVideoUrl] = useState<string>('');
  const [coverVideoRatio, setCoverVideoRatio] = useState<MediaRatioPreset>('16:7');
  const [videoCustomRatioWidth, setVideoCustomRatioWidth] = useState<string>('16');
  const [videoCustomRatioHeight, setVideoCustomRatioHeight] = useState<string>('7');
  const [coverVideoFit, setCoverVideoFit] = useState<MediaObjectFit>('cover');
  const [coverVideoPosition, setCoverVideoPosition] = useState<MediaObjectPosition>('center');
  const [coverVideoMuted, setCoverVideoMuted] = useState<boolean>(false);

  // Status & Loaders
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // In-modal confirmation state for deletion
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<ProductCategoryInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: ProductCategoryInfo) => {
    setSelectedCatId(cat.id);
    setName(cat.name);
    setNameArabic(cat.nameArabic || '');
    setShortDesc(cat.shortDesc);
    setDescription(cat.description);
    setIconName(cat.iconName || 'Sparkles');

    // Media type
    setCoverMediaType(cat.coverMediaType || 'image');

    // Image options
    setCoverImage(cat.coverImage || '');
    setCoverImageRatio((cat.coverImageRatio as ImageRatioPreset) || '16:7');
    setCustomRatioWidth(cat.customRatioWidth ? String(cat.customRatioWidth) : '16');
    setCustomRatioHeight(cat.customRatioHeight ? String(cat.customRatioHeight) : '7');
    setCoverImageFit(cat.coverImageFit || 'cover');
    setCoverImagePosition(cat.coverImagePosition || 'center');

    // Video options
    setCoverVideoUrl(cat.coverVideoUrl || '');
    setCoverVideoRatio((cat.coverVideoRatio as MediaRatioPreset) || '16:7');
    setVideoCustomRatioWidth(cat.videoCustomRatioWidth ? String(cat.videoCustomRatioWidth) : '16');
    setVideoCustomRatioHeight(cat.videoCustomRatioHeight ? String(cat.videoCustomRatioHeight) : '7');
    setCoverVideoFit((cat.coverVideoFit as MediaObjectFit) || 'cover');
    setCoverVideoPosition((cat.coverVideoPosition as MediaObjectPosition) || 'center');
    setCoverVideoMuted(cat.coverVideoMuted !== undefined ? cat.coverVideoMuted : false);

    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleCreateNew = () => {
    setSelectedCatId('new');
    setName('');
    setNameArabic('');
    setShortDesc('');
    setDescription('');
    setIconName('Sparkles');

    setCoverMediaType('image');
    setCoverImage('');
    setCoverImageRatio('16:7');
    setCustomRatioWidth('16');
    setCustomRatioHeight('7');
    setCoverImageFit('cover');
    setCoverImagePosition('center');

    setCoverVideoUrl('');
    setCoverVideoRatio('16:7');
    setVideoCustomRatioWidth('16');
    setVideoCustomRatioHeight('7');
    setCoverVideoFit('cover');
    setCoverVideoPosition('center');
    setCoverVideoMuted(false);

    setStatusMessage(null);
    setErrorMessage(null);
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      setStatusMessage('جاري تهيئة وضبط جودة الصورة دون اقتصاص...');
      const uploadedImage = await preserveOriginalUploadedImage(file, 1600, 0.88);
      setCoverImage(uploadedImage);
      setCoverMediaType('image');
      setStatusMessage('تم رفع صورة الغلاف بنجاح!');
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('تعذر معالجة الصورة، يرجى تجربة صورة أخرى.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Video upload handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMessage('يرجى اختيار ملف فيديو صالح بصيغة MP4 أو WebM أو MOV.');
      return;
    }

    if (file.size > 45 * 1024 * 1024) {
      setErrorMessage('حجم الفيديو أكبر من 45 ميجابايت. يرجى اختيار ملف أصغر أو استخدام رابط خارجي مباشر.');
      return;
    }

    setIsUploadingVideo(true);
    setStatusMessage('جاري قراءة وتجهيز الفيديو...');
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      if (result) {
        setCoverVideoUrl(result);
        setCoverMediaType('video');
        setStatusMessage('تم تجهيز الفيديو بنجاح! سيتم حفظه تلقائياً.');
      }
      setIsUploadingVideo(false);
    };
    reader.onerror = () => {
      console.error('Failed to read video file');
      setErrorMessage('تعذر قراءة ملف الفيديو، يرجى تجربة ملف آخر.');
      setIsUploadingVideo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال اسم القسم بالإنجليزية.');
      return;
    }

    setIsSaving(true);
    setStatusMessage('جاري حفظ وتحديث بيانات القسم سحابياً...');
    setErrorMessage(null);

    const categoryId =
      selectedCatId === 'new'
        ? `cat-${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`
        : selectedCatId;

    const existing = categories.find((c) => c.id === categoryId);

    // Save large base64 video in indexedDB immediately for local performance
    if (coverMediaType === 'video' && coverVideoUrl && coverVideoUrl.startsWith('data:video/')) {
      try {
        await saveLocalCategoryVideo(categoryId, coverVideoUrl);
      } catch (idbErr) {
        console.warn('Could not cache video locally in IDB:', idbErr);
      }
    }

    const newCategory: ProductCategoryInfo = {
      ...(existing || {}),
      id: categoryId,
      name: name.trim(),
      nameArabic: nameArabic.trim() || name.trim(),
      shortDesc: shortDesc.trim() || 'Handcrafted Egyptian Brass Collection',
      description: description.trim() || 'Masterfully crafted in Gamaliya, Cairo, Egypt.',
      iconName: iconName || 'Sparkles',

      // Media choices
      coverMediaType: coverMediaType,
      coverImage:
        coverImage.trim() ||
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      coverImageRatio: coverImageRatio || '16:7',
      customRatioWidth: Number(customRatioWidth) || 16,
      customRatioHeight: Number(customRatioHeight) || 7,
      coverImageFit: coverImageFit || 'cover',
      coverImagePosition: coverImagePosition || 'center',

      // Video choices
      coverVideoUrl: coverVideoUrl.trim() || undefined,
      coverVideoRatio: coverVideoRatio || '16:7',
      videoCustomRatioWidth: Number(videoCustomRatioWidth) || 16,
      videoCustomRatioHeight: Number(videoCustomRatioHeight) || 7,
      coverVideoFit: coverVideoFit || 'cover',
      coverVideoPosition: coverVideoPosition || 'center',
      coverVideoMuted: coverVideoMuted,
    };

    try {
      await onSaveCategory(newCategory);
      setStatusMessage('تم حفظ القسم بنجاح! يظهر الآن في القائمة والصفحات.');
      handleSelectCategory(newCategory);
      setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء الحفظ السحابي، يرجى المحاولة ثانية.');
    } finally {
      setIsSaving(false);
    }
  };

  const promptDelete = (cat: ProductCategoryInfo) => {
    setCategoryPendingDelete(cat);
  };

  const confirmDelete = async () => {
    if (!categoryPendingDelete) return;
    const targetId = categoryPendingDelete.id;
    setIsDeleting(true);

    try {
      await onDeleteCategory(targetId);
      if (selectedCatId === targetId) {
        handleCreateNew();
      }
      setStatusMessage(`تم حذف القسم "${categoryPendingDelete.name}" بنجاح دون التأثير على باقي الأقسام.`);
      setCategoryPendingDelete(null);
      setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to delete category:', err);
      setErrorMessage('حدث خطأ أثناء حذف القسم، يرجى المحاولة ثانية.');
    } finally {
      setIsDeleting(false);
    }
  };

  const currentSelectedCategory = categories.find((c) => c.id === selectedCatId);
  const productsCountForSelected = products.filter((p) => p.categoryId === selectedCatId).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0e0e13] border-2 border-[#d4c59d]/50 rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40 shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>إدارة وإضافة وتعديل أقسام المنتجات (Category Management)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                  Cloud Live
                </span>
              </h2>
              <p className="text-xs text-[#9e9174] font-arabic mt-0.5">
                إضافة قسم جديد بكامل خياراته (صور، فيديوهات، نسب عرض، تأطير، صوت) مع توفيره فوراً في القائمة وصفحات الموقع
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/10 transition-colors"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left Column: Categories List */}
          <div className="lg:col-span-4 border-r border-[#d4c59d]/20 bg-[#0a0a0f] p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between sticky top-0 bg-[#0a0a0f] pb-2 z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                الأقسام الحالية ({categories.length})
              </span>
              <button
                type="button"
                onClick={handleCreateNew}
                className="px-3 py-1.5 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e6d8b5] transition-all shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ قسم جديد</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#9e9174] border border-dashed border-white/10 rounded-xl">
                  لا توجد أقسام حالياً. اضغط على زر &quot;إضافة قسم جديد&quot; أعلاه.
                </div>
              ) : (
                categories.map((cat) => {
                  const productCount = products.filter((p) => p.categoryId === cat.id).length;
                  const isCatVideo = cat.coverMediaType === 'video' && !!cat.coverVideoUrl;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedCatId === cat.id
                          ? 'bg-[#1e1c24] border-[#d4c59d] shadow-md ring-1 ring-[#d4c59d]/30'
                          : 'bg-[#121218] border-white/5 hover:border-[#d4c59d]/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg border border-[#d4c59d]/30 overflow-hidden bg-black flex-shrink-0 relative">
                        {isCatVideo ? (
                          <div className="w-full h-full flex items-center justify-center bg-black/60 text-[#d4c59d]">
                            <Video className="w-5 h-5" />
                            <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono bg-black/90 px-1 rounded text-amber-300">
                              VID
                            </span>
                          </div>
                        ) : (
                          <img
                            src={cat.coverImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-bold text-xs text-[#f5f0e6] truncate">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-[#d4c59d] font-arabic truncate">
                          {cat.nameArabic || ''}
                        </div>
                        <div className="text-[10px] text-[#9e9174] truncate flex items-center gap-1.5 mt-0.5">
                          <span>{productCount} منتجات</span>
                          <span>•</span>
                          <span className="uppercase text-[9px] text-[#d4c59d]/70">
                            {cat.coverMediaType === 'video' ? 'فيديو' : (cat.coverImageRatio || '16:7')}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button for each category */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          promptDelete(cat);
                        }}
                        className="p-2 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/70 border border-transparent hover:border-rose-700/50 transition-colors flex-shrink-0"
                        title={`حذف قسم ${cat.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Full Category Editor Form */}
          <form
            onSubmit={handleSave}
            className="lg:col-span-8 p-5 sm:p-6 overflow-y-auto space-y-6 bg-[#0e0e13]"
          >
            {/* Status Notifications */}
            {statusMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Top Editor Bar with Mode Indicator & Direct Page Navigation */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#d4c59d]/20 pb-3 gap-2">
              <div className="flex items-center gap-2">
                {selectedCatId === 'new' ? (
                  <>
                    <div className="p-1.5 rounded-md bg-[#d4c59d] text-black">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#f5f0e6]">
                        إضافة قسم جديد للمنتجات (Create New Category)
                      </h3>
                      <p className="text-[11px] text-[#9e9174]">
                        سيتم إنشاء صفحة كاملة له وإدراجه في المنيو وشاشات الموقع
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-1.5 rounded-md bg-[#1e1c24] text-[#d4c59d] border border-[#d4c59d]/40">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#f5f0e6]">
                        تعديل القسم: {name || selectedCatId}
                      </h3>
                      <p className="text-[11px] text-[#9e9174]">
                        المعرف: <code className="text-[#d4c59d] font-mono">{selectedCatId}</code>
                        {productsCountForSelected > 0 && ` • (${productsCountForSelected} منتج)`}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons for Existing Category */}
              {selectedCatId !== 'new' && currentSelectedCategory && (
                <div className="flex items-center gap-2">
                  {onNavigateToCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToCategory(selectedCatId);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg text-[#d4c59d] bg-[#1a1820] border border-[#d4c59d]/50 hover:bg-[#d4c59d] hover:text-[#000000] transition-all flex items-center gap-1.5 cursor-pointer shadow"
                      title="الانتقال إلى صفحة هذا القسم مباشرة في الموقع"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>فتح صفحة القسم</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => promptDelete(currentSelectedCategory)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-300 bg-rose-950/40 border border-rose-700/40 hover:bg-rose-900/60 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>حذف القسم</span>
                  </button>
                </div>
              )}
            </div>

            {/* Names (English & Arabic) */}
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
                  className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d4c59d] focus:ring-1 focus:ring-[#d4c59d] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5 font-arabic">
                  اسم القسم بالعربية (Arabic Title) *
                </label>
                <input
                  type="text"
                  value={nameArabic}
                  onChange={(e) => setNameArabic(e.target.value)}
                  placeholder="مثال: نجف وإضاءة نحاسية فاخرة"
                  dir="rtl"
                  className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d4c59d] focus:ring-1 focus:ring-[#d4c59d] outline-none transition-all font-arabic"
                />
              </div>
            </div>

            {/* Tagline & Story */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5">
                  وصف موجز (Short Tagline)
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="e.g., Dramatic pierced lighting fixtures casting arabesque shadows"
                  className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5 font-arabic">
                  أيقونة القسم الملكية (Luxury Icon)
                </label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d4c59d] outline-none cursor-pointer"
                >
                  {LUXURY_ICONS.map((ico) => (
                    <option key={ico.name} value={ico.name} className="bg-[#121218] text-white">
                      {ico.labelAr} ({ico.labelEn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#d4c59d] mb-1.5 font-arabic">
                الوصف الكامل وقصة الحرفية للقسم (Detailed Story & Craftsmanship)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب نبذة عن الحرفية العريقة، تفاصيل التخريم اليدوي، والنحاس الخالص المستخدم في هذه المجموعة..."
                className="w-full bg-[#161620] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d4c59d] outline-none leading-relaxed font-arabic"
              />
            </div>

            {/* MEDIA TYPE SWITCHER: Image vs Video */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#14141c] border border-[#d4c59d]/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-2">
                    <span>نوع وسائط غلاف القسم (Cover Media Type)</span>
                  </span>
                  <p className="text-[11px] text-[#9e9174] font-arabic mt-0.5">
                    اختر ما إذا كان غلاف هذا القسم صورة فائقة الدقة أو مقطع فيديو حي
                  </p>
                </div>

                {/* Switcher Buttons */}
                <div className="inline-flex rounded-xl p-1 bg-[#0a0a0f] border border-[#d4c59d]/30">
                  <button
                    type="button"
                    onClick={() => setCoverMediaType('image')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      coverMediaType === 'image'
                        ? 'bg-[#d4c59d] text-[#000000] shadow'
                        : 'text-[#d4c59d] hover:text-[#f5f0e6]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>صورة (Image)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCoverMediaType('video')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      coverMediaType === 'video'
                        ? 'bg-[#d4c59d] text-[#000000] shadow'
                        : 'text-[#d4c59d] hover:text-[#f5f0e6]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>فيديو (Video)</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: IMAGE CONTROLS */}
              {coverMediaType === 'image' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg font-arabic">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4c59d]" />
                      <span>المقاس الموصى به: <strong>16:7 أو 1080 × 1920 (Portrait)</strong> — مع الحفاظ على أصل الصورة كاملاً</span>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة من الجهاز</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="أو الصق رابط صورة خارجي مباشر (https://...)"
                      className="w-full bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded-lg px-3.5 py-2 text-xs focus:border-[#d4c59d] outline-none"
                    />
                  </div>

                  {/* Unified Image Ratio & Framing Control */}
                  <ImageRatioSelectorControl
                    ratio={coverImageRatio}
                    onChangeRatio={(r) => setCoverImageRatio(r)}
                    customWidth={customRatioWidth}
                    onChangeCustomWidth={(w) => setCustomRatioWidth(w)}
                    customHeight={customRatioHeight}
                    onChangeCustomHeight={(h) => setCustomRatioHeight(h)}
                    fit={coverImageFit}
                    onChangeFit={(f) => setCoverImageFit(f)}
                    position={coverImagePosition}
                    onChangePosition={(p) => setCoverImagePosition(p)}
                    title="Category Cover Image Framing & Ratio"
                    titleAR="نسبة عرض وتأطير صورة غلاف القسم"
                    description="النسبة الافتراضية لأغلفة الأقسام هي 16:7 العريضة، مع إمكانية التخصيص الكامل بدون اقتصاص الصورة الأصلية."
                  />
                </div>
              )}

              {/* TAB 2: VIDEO CONTROLS */}
              {coverMediaType === 'video' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg font-arabic">
                      <Video className="w-3.5 h-3.5 text-[#d4c59d]" />
                      <span>يدعم ملفات <strong>MP4, WebM</strong> المباشرة، أو روابط يوتيوب وفيميو وروابط السحابة</span>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع فيديو من الجهاز</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={coverVideoUrl}
                      onChange={(e) => setCoverVideoUrl(e.target.value)}
                      placeholder="أو الصق رابط فيديو مباشر (https://...mp4) أو رابط YouTube / Vimeo"
                      className="w-full bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded-lg px-3.5 py-2 text-xs focus:border-[#d4c59d] outline-none"
                    />
                  </div>

                  {/* Audio Controls for Video */}
                  <div className="p-3.5 rounded-xl bg-[#0e0e13] border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {coverVideoMuted ? (
                        <VolumeX className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#f5f0e6]">
                          صوت الفيديو لزوار الموقع (Sound Track)
                        </div>
                        <div className="text-[10px] text-[#9e9174] font-arabic">
                          {coverVideoMuted
                            ? 'الفيديو صامت افتراضياً عند تحميل الصفحة'
                            : 'الصوت مفعّل مع إمكانية كتمه أو تشغيله بزر تفاعلي مع سياسة صوت واحد في كل مرة'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCoverVideoMuted((prev) => !prev)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        !coverVideoMuted
                          ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                          : 'bg-white/5 border-white/15 text-neutral-300'
                      }`}
                    >
                      {!coverVideoMuted ? 'الصوت مفعّل' : 'مكتوم افتراضياً'}
                    </button>
                  </div>

                  {/* Unified Video Ratio & Framing Control */}
                  <MediaRatioSelectorControl
                    mediaType="video"
                    showMediaTypeSelector={false}
                    ratio={coverVideoRatio}
                    onChangeRatio={(r) => setCoverVideoRatio(r)}
                    customWidth={videoCustomRatioWidth}
                    onChangeCustomWidth={(w) => setVideoCustomRatioWidth(w)}
                    customHeight={videoCustomRatioHeight}
                    onChangeCustomHeight={(h) => setVideoCustomRatioHeight(h)}
                    fit={coverVideoFit}
                    onChangeFit={(f) => setCoverVideoFit(f)}
                    position={coverVideoPosition}
                    onChangePosition={(p) => setCoverVideoPosition(p)}
                    title="Category Cover Video Framing & Ratio"
                    titleAR="نسبة عرض وتأطير فيديو غلاف القسم"
                    description="التحكم الكامل في أبعاد الفيديو وملاءمته ونقطة تركيزه داخل البطاقة والصفحة الرئيسية."
                  />
                </div>
              )}

              {/* LIVE INTERACTIVE PREVIEW */}
              <div className="mt-4 pt-4 border-t border-[#d4c59d]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>المعاينة الحية للغلاف (Live Preview)</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#9e9174]">
                    {coverMediaType === 'video' ? `Video (${coverVideoRatio})` : `Image (${coverImageRatio})`}
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border-2 border-[#d4c59d]/40 bg-black max-h-[360px] relative shadow-2xl">
                  <TurathMedia
                    type={coverMediaType}
                    src={coverImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'}
                    videoUrl={coverVideoUrl}
                    ratio={coverMediaType === 'video' ? coverVideoRatio : coverImageRatio}
                    customWidth={coverMediaType === 'video' ? videoCustomRatioWidth : customRatioWidth}
                    customHeight={coverMediaType === 'video' ? videoCustomRatioHeight : customRatioHeight}
                    fit={coverMediaType === 'video' ? coverVideoFit : coverImageFit}
                    position={coverMediaType === 'video' ? coverVideoPosition : coverImagePosition}
                    containerClassName="w-full bg-black max-h-[340px]"
                    autoPlay={true}
                    muted={coverVideoMuted}
                    loop={true}
                    playsInline={true}
                    controls={false}
                    showSoundToggle={coverMediaType === 'video'}
                    showVideoBadge={coverMediaType === 'video'}
                  >
                    <span className="absolute top-2.5 right-2.5 text-[11px] font-arabic font-bold bg-[#d4c59d] text-[#000000] px-2.5 py-0.5 rounded shadow z-10 pointer-events-none">
                      {nameArabic || name || 'عنوان القسم'}
                    </span>

                    <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold bg-black/80 text-[#d4c59d] border border-[#d4c59d]/40 px-1.5 py-0.5 rounded shadow z-10 pointer-events-none">
                      {coverMediaType === 'video' ? coverVideoRatio : coverImageRatio}
                    </span>
                  </TurathMedia>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-4 border-t border-[#d4c59d]/20 flex items-center justify-between gap-3">
              {selectedCatId !== 'new' && currentSelectedCategory ? (
                <button
                  type="button"
                  onClick={() => promptDelete(currentSelectedCategory)}
                  className="px-4 py-2 text-xs font-bold rounded-lg text-rose-300 bg-rose-950/40 border border-rose-700/50 hover:bg-rose-900/60 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>حذف هذا القسم</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-[#f5f0e6] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  إغلاق
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isProcessingImage || isUploadingVideo}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
            </div>
          </form>
        </div>
      </div>

      {/* Safe In-Modal Deletion Confirmation Modal */}
      {categoryPendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#16141c] border-2 border-rose-500/60 rounded-2xl shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1 font-arabic">
                تأكيد حذف القسم (Confirm Deletion)
              </h3>
              <p className="text-xs text-[#d4c59d] font-semibold">
                {categoryPendingDelete.name}
                {categoryPendingDelete.nameArabic ? ` — ${categoryPendingDelete.nameArabic}` : ''}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-lg border border-white/20 overflow-hidden bg-black flex-shrink-0">
                <img
                  src={categoryPendingDelete.coverImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'}
                  alt={categoryPendingDelete.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-[#f5f0e6] flex-1 min-w-0">
                <div className="font-semibold truncate">{categoryPendingDelete.name}</div>
                <div className="text-[11px] text-rose-300 font-arabic">
                  {products.filter((p) => p.categoryId === categoryPendingDelete.id).length > 0
                    ? `يحتوي على ${products.filter((p) => p.categoryId === categoryPendingDelete.id).length} منتج (سيتم نقلها بأمان دون حذف أي منتج)`
                    : 'لا توجد منتجات مسجلة في هذا القسم'}
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-arabic">
              هل أنت متأكد من رغبتك في حذف هذا القسم؟ سيتم حذفه من قائمة الأقسام والمنيو والسحابة فوراً مع الحفاظ التام على باقي أقسام ومنتجات الموقع بأمان.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCategoryPendingDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
              >
                إلغاء (Cancel)
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>نعم، احذف القسم الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
