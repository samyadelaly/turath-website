import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ProductCategoryInfo } from './types';
import { preserveOriginalUploadedImage } from './imageCompressor';
import { CategoryCoverOptions } from './categoryStorage';
import { 
  MediaType,
  ImageRatioPreset, 
  MediaRatioPreset,
  ImageObjectFit, 
  MediaObjectFit,
  ImageObjectPosition, 
  MediaObjectPosition,
  computeImageRatio 
} from './imageRatioUtils';
import { ImageRatioSelectorControl } from "./ImageRatioSelectorControl";
import { UnifiedResponsiveImage } from "./UnifiedResponsiveImage";
import { TurathMedia } from "./TurathMedia";
import { TurathImage } from "./TurathImage";
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Image as ImageIcon, 
  Layers, 
  Eye,
  Loader2,
  Plus,
  Trash2,
  FolderOpen,
  Film,
  Video,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';

interface EditCategoryCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategoryInfo[];
  initialCategoryId?: string | null;
  onSaveCover: (categoryId: string, newCoverUrl: string, options?: CategoryCoverOptions) => Promise<void> | void;
  onResetCover: (categoryId: string) => void;
}

// Curated authentic brass craft video presets
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
    initialCategoryId || categories[0]?.id || 'mirrors'
  );
  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  // Active Tab inside modal: 'cover' | 'gallery'
  const [activeTab, setActiveTab] = useState<'cover' | 'gallery'>('cover');

  // Cover media type: 'image' | 'video'
  const [coverMediaType, setCoverMediaType] = useState<MediaType>('image');

  // Cover image states
  const [inputUrl, setInputUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(() => activeCategory?.coverImage || '');
  const [coverRatio, setCoverRatio] = useState<ImageRatioPreset>('Original');
  const [customRatioWidth, setCustomRatioWidth] = useState<string>('5');
  const [customRatioHeight, setCustomRatioHeight] = useState<string>('7');
  const [coverFit, setCoverFit] = useState<ImageObjectFit>('cover');
  const [coverPosition, setCoverPosition] = useState<ImageObjectPosition>('center');

  // Cover video states
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoRatio, setVideoRatio] = useState<MediaRatioPreset>('16:7');
  const [videoCustomRatioWidth, setVideoCustomRatioWidth] = useState<string>('16');
  const [videoCustomRatioHeight, setVideoCustomRatioHeight] = useState<string>('7');
  const [videoFit, setVideoFit] = useState<MediaObjectFit>('cover');
  const [videoPosition, setVideoPosition] = useState<MediaObjectPosition>('center');
  const [videoMuted, setVideoMuted] = useState<boolean>(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Internal Section Gallery images states
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryRatios, setGalleryRatios] = useState<Record<string, string>>({});
  const [galleryFits, setGalleryFits] = useState<Record<string, 'cover' | 'contain'>>({});
  const [galleryPositions, setGalleryPositions] = useState<Record<string, string>>({});
  const [selectedGalleryImgIdx, setSelectedGalleryImgIdx] = useState<number | null>(null);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
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
      setCoverMediaType(activeCategory.coverMediaType || 'image');
      setPreviewUrl(activeCategory.coverImage || '');
      setInputUrl(
        activeCategory.coverImage && !activeCategory.coverImage.startsWith('data:')
          ? activeCategory.coverImage
          : ''
      );
      setCoverRatio((activeCategory.coverImageRatio as ImageRatioPreset) || 'Original');
      setCustomRatioWidth(String(activeCategory.customRatioWidth || '5'));
      setCustomRatioHeight(String(activeCategory.customRatioHeight || '7'));
      setCoverFit(activeCategory.coverImageFit || 'cover');
      setCoverPosition(activeCategory.coverImagePosition || 'center');

      setVideoUrl(activeCategory.coverVideoUrl || '');
      setVideoRatio(
        (activeCategory.coverVideoRatio as MediaRatioPreset) ||
        (activeCategory.coverImageRatio as MediaRatioPreset) ||
        '16:7'
      );
      setVideoCustomRatioWidth(String(activeCategory.customRatioWidth || '16'));
      setVideoCustomRatioHeight(String(activeCategory.customRatioHeight || '7'));
      setVideoFit((activeCategory.coverVideoFit as MediaObjectFit) || 'cover');
      setVideoPosition((activeCategory.coverVideoPosition as MediaObjectPosition) || 'center');
      setVideoMuted(activeCategory.coverVideoMuted === true ? true : false);

      setGalleryImages(Array.isArray(activeCategory.galleryImages) ? activeCategory.galleryImages : []);
      setGalleryRatios(activeCategory.galleryRatios || {});
      setGalleryFits(activeCategory.galleryFits || {});
      setGalleryPositions(activeCategory.galleryPositions || {});
      setSelectedGalleryImgIdx(null);

      setSavedSuccess(false);
      setErrorMessage(null);
    }
  }, [selectedCatId, activeCategory]);

  if (!isOpen || !activeCategory) return null;

  // Handle direct file upload preserving original file non-destructively
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMessage(null);
      // Preserve original uploaded image without permanent cropping or distortion
      const originalDataUrl = await preserveOriginalUploadedImage(file);
      setPreviewUrl(originalDataUrl);
      setInputUrl('');
      setCoverMediaType('image');
      setSavedSuccess(false);
    } catch (err) {
      console.error('Error processing uploaded image:', err);
      setErrorMessage('Failed to read image file. Please try another image.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle direct video upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMessage('يرجى اختيار ملف فيديو صالح (MP4, WebM, MOV).');
      return;
    }

    const maxSize = 80 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('حجم الفيديو يتجاوز 80 ميجابايت. يرجى اختيار ملف أصغر أو وضع رابط مباشر.');
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      return;
    }

    setIsUploadingVideo(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setVideoUrl(result);
        setCoverMediaType('video');
        setSavedSuccess(false);
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

  // Add internal gallery image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsCompressing(true);
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const url = await preserveOriginalUploadedImage(file);
          newUrls.push(url);
        }
      }
      setGalleryImages((prev) => {
        const updated = [...prev, ...newUrls];
        if (selectedGalleryImgIdx === null && updated.length > 0) {
          setSelectedGalleryImgIdx(prev.length);
        }
        return updated;
      });
      setSavedSuccess(false);
    } catch (err) {
      console.error('Error adding gallery images:', err);
      setErrorMessage('Could not load gallery images.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = inputUrl.trim();
    if (trimmed) {
      setPreviewUrl(trimmed);
      setCoverMediaType('image');
      setSavedSuccess(false);
      setErrorMessage(null);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    setInputUrl(url);
    setCoverMediaType('image');
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    let finalUrl = previewUrl;
    if (inputUrl.trim() && inputUrl.trim() !== activeCategory.coverImage) {
      finalUrl = inputUrl.trim();
      setPreviewUrl(finalUrl);
    }

    if (coverMediaType === 'video' && (!videoUrl || videoUrl.trim().length === 0)) {
      setErrorMessage('يرجى تحديد رابط فيديو أو رفع ملف فيديو لغلاف القسم.');
      return;
    }

    if (coverMediaType === 'image' && (!finalUrl || finalUrl.trim().length === 0)) {
      setErrorMessage('يرجى اختيار أو رفع صورة للغلاف أولاً.');
      return;
    }

    try {
      const options: CategoryCoverOptions = {
        coverMediaType,
        coverVideoUrl: videoUrl.trim(),
        coverImageRatio: coverRatio,
        customRatioWidth: Number(customRatioWidth) || 5,
        customRatioHeight: Number(customRatioHeight) || 7,
        coverImageFit: coverFit,
        coverImagePosition: coverPosition,
        coverVideoRatio: videoRatio,
        coverVideoFit: videoFit,
        coverVideoPosition: videoPosition,
        coverVideoMuted: videoMuted,
        galleryImages,
        galleryRatios,
        galleryFits,
        galleryPositions,
      };

      const finalCoverToSave =
        finalUrl && finalUrl.trim().length > 0
          ? finalUrl.trim()
          : (activeCategory.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80');

      setIsSaving(true);
      setErrorMessage(null);
      await onSaveCover(selectedCatId, finalCoverToSave, options);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to save cover:', err);
      setErrorMessage(err?.message || 'حدث خطأ أثناء حفظ الغلاف ومزامنته مع السحابة.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCoverMediaType('image');
    setVideoUrl('');
    onResetCover(selectedCatId);
    setSavedSuccess(true);
    setErrorMessage(null);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const computedPreviewRatio = computeImageRatio({
    ratio: coverRatio,
    customWidth: customRatioWidth,
    customHeight: customRatioHeight,
    fit: coverFit,
    position: coverPosition,
  });

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
        className="relative w-full max-w-4xl bg-[#000000] border border-[#d4c59d] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/30 bg-[#0a0a0a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4c59d]/10 border border-[#d4c59d]/40 flex items-center justify-center text-[#d4c59d]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-[#f5f0e6]">
                Section & Category Image System
              </h2>
              <p className="text-[11px] text-[#d4c59d] font-arabic">
                تعديل وتحديد نسب العرض وتأطير صور الأقسام والمعارض الداخلية (Original, 1:1, 4:5, 3:4, 16:9, 4:3, Custom)
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

        {/* Category Selector Bar & Nav Tabs */}
        <div className="px-6 py-3 bg-[#0a0a0f] border-b border-[#d4c59d]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Layers className="w-4 h-4 text-[#d4c59d] shrink-0" />
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="bg-[#111111] border border-[#d4c59d]/40 rounded-lg px-3 py-1.5 text-xs text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#111111] text-[#f5f0e6]">
                  {cat.name} ({cat.nameArabic})
                </option>
              ))}
            </select>
          </div>

          {/* Sub-tabs: Section Cover vs Section Internal Gallery */}
          <div className="inline-flex rounded-lg border border-[#333] bg-black/60 p-1 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('cover')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeTab === 'cover'
                  ? 'bg-[#d4c59d] text-black font-bold shadow'
                  : 'text-[#9e9174] hover:text-white'
              }`}
            >
              Cover Image / صورة الغلاف
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-[#d4c59d] text-black font-bold shadow'
                  : 'text-[#9e9174] hover:text-white'
              }`}
            >
              <span>Internal Gallery Images</span>
              <span className="text-[10px] px-1.5 rounded-full bg-black/50 text-[#d4c59d]">
                {galleryImages.length}
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'cover' ? (
            <>
              {/* Cover Media Type Selector: Image vs Video */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0c0c10] border border-[#d4c59d]/40">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                    {coverMediaType === 'video' ? <Film className="w-3.5 h-3.5 text-[#d4c59d]" /> : <ImageIcon className="w-3.5 h-3.5 text-[#d4c59d]" />}
                    <span>نوع وسيط غلاف القسم / Cover Media Type</span>
                  </span>
                  <p className="text-[11px] text-[#9e9174] font-arabic">
                    يمكنك استخدام فيديو حي متحرك أو صورة ثابتة بنفس نظام ونسب العرض والتأطير
                  </p>
                </div>
                <div className="inline-flex rounded-lg border border-[#333] bg-black/80 p-1 gap-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCoverMediaType('image')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                      coverMediaType === 'image'
                        ? 'bg-[#d4c59d] text-black shadow'
                        : 'text-[#9e9174] hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>صورة (Image)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverMediaType('video')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                      coverMediaType === 'video'
                        ? 'bg-[#d4c59d] text-black shadow'
                        : 'text-[#9e9174] hover:text-white'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>فيديو (Video)</span>
                  </button>
                </div>
              </div>

              {/* Live Preview of Category Cover with Selected Ratio & Framing */}
              {(() => {
                const isVideo = coverMediaType === 'video';
                const activeRatio = isVideo ? videoRatio : coverRatio;
                const activeCustomW = isVideo ? videoCustomRatioWidth : customRatioWidth;
                const activeCustomH = isVideo ? videoCustomRatioHeight : customRatioHeight;
                const activeFit = isVideo ? videoFit : coverFit;
                const activePos = isVideo ? videoPosition : coverPosition;

                const computedPreviewMediaRatio = computeImageRatio({
                  ratio: activeRatio,
                  customWidth: activeCustomW,
                  customHeight: activeCustomH,
                  fit: activeFit,
                  position: activePos,
                });

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Live Cover Preview ({coverMediaType.toUpperCase()} • {activeRatio === 'Custom' ? `${activeCustomW}:${activeCustomH}` : activeRatio} • {activeFit})
                      </span>
                      <span className="text-[11px] text-[#9e9174]">
                        {activeCategory.name} • {activeCategory.nameArabic}
                      </span>
                    </div>

                    <div className="max-w-[440px] mx-auto rounded-xl overflow-hidden border border-[#d4c59d]/50 bg-[#111111] shadow-2xl relative">
                      <TurathMedia
                        type={coverMediaType}
                        src={previewUrl || activeCategory.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'}
                        videoUrl={videoUrl}
                        computedRatio={computedPreviewMediaRatio}
                        containerClassName="bg-[#0a0a0f] max-h-[460px]"
                        mediaClassName="brightness-95"
                        autoPlay={true}
                        muted={videoMuted}
                        loop={true}
                        playsInline={true}
                        controls={false}
                        showSoundToggle={coverMediaType === 'video'}
                        showVideoBadge={coverMediaType === 'video'}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                        {/* Badge Overlay */}
                        <div className="absolute top-3 right-3 bg-[#d4c59d] text-[#000000] px-3 py-1 rounded shadow text-xs font-arabic font-bold z-10 pointer-events-none">
                          {activeCategory.nameArabic}
                        </div>

                        {/* Ratio Tag Badge - only shown for image, removed from video */}
                        {coverMediaType !== 'video' && (
                          <div className="absolute top-3 left-3 bg-black/80 border border-[#d4c59d]/40 text-[#d4c59d] px-2 py-0.5 rounded text-[10px] font-mono font-bold z-10 pointer-events-none">
                            {coverMediaType.toUpperCase()} • {activeRatio === 'Custom' ? `${activeCustomW}:${activeCustomH}` : activeRatio} • {activeFit}
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 text-white z-10 pointer-events-none">
                          <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#f5f0e6] drop-shadow-md">
                            {activeCategory.name}
                          </h3>
                          <p className="text-xs text-[#d4c59d] line-clamp-1 drop-shadow">
                            {activeCategory.shortDesc}
                          </p>
                        </div>
                      </TurathMedia>
                    </div>
                  </div>
                );
              })()}

              {/* Unified Aspect Ratio & Presentation Framing Control (Governing both Image and Video) */}
              {coverMediaType === 'video' ? (
                <ImageRatioSelectorControl
                  ratio={videoRatio}
                  onChangeRatio={(r) => setVideoRatio(r)}
                  customWidth={videoCustomRatioWidth}
                  onChangeCustomWidth={(w) => setVideoCustomRatioWidth(w)}
                  customHeight={videoCustomRatioHeight}
                  onChangeCustomHeight={(h) => setVideoCustomRatioHeight(h)}
                  fit={videoFit}
                  onChangeFit={(f) => setVideoFit(f)}
                  position={videoPosition}
                  onChangePosition={(p) => setVideoPosition(p)}
                  title="Category Cover Video Ratio & Framing"
                  titleAR="نسبة وتأطير فيديو غلاف القسم"
                  description="Video stream maintains preserved aspect ratio (Original, 1:1, 4:5, 3:4, 16:9, 4:3, 16:7, Custom), fit mode, and focal point without distortion."
                />
              ) : (
                <ImageRatioSelectorControl
                  ratio={coverRatio}
                  onChangeRatio={(r) => setCoverRatio(r)}
                  customWidth={customRatioWidth}
                  onChangeCustomWidth={(w) => setCustomRatioWidth(w)}
                  customHeight={customRatioHeight}
                  onChangeCustomHeight={(h) => setCustomRatioHeight(h)}
                  fit={coverFit}
                  onChangeFit={(f) => setCoverFit(f)}
                  position={coverPosition}
                  onChangePosition={(p) => setCoverPosition(p)}
                  title="Section Cover Image Ratio & Framing"
                  titleAR="نسبة عرض وتأطير غلاف القسم"
                  description="Original image is preserved untouched. Choose display ratio (Original, 1:1, 4:5, 3:4, 16:9, 4:3, 16:7, Custom), fit mode, and focal point position."
                />
              )}

              {/* Video Configuration Section */}
              {coverMediaType === 'video' ? (
                <div className="space-y-4">
                  {/* Option 1: Direct Video Link URL */}
                  <div className="bg-[#0c0c0c] border border-[#d4c59d]/30 rounded-xl p-4 space-y-3">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#d4c59d]" />
                        رابط فيديو مباشر (Direct Video URL)
                      </h4>
                      <p className="text-[11px] text-[#9e9174]">
                        يدعم روابط MP4، WebM، YouTube، Vimeo، Cloudinary أو أي رابط فيديو مباشر
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          setSavedSuccess(false);
                          setErrorMessage(null);
                        }}
                        placeholder="https://...mp4 or https://youtube.com/watch?v=..."
                        className="flex-1 bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3 py-2 text-xs text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
                      />
                      {videoUrl && (
                        <button
                          type="button"
                          onClick={() => setVideoUrl('')}
                          className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-colors text-xs font-bold"
                          title="Clear Video"
                        >
                          حذف الرابط
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Option 2: Upload Video from Device */}
                  <div className="bg-[#0c0c0c] border border-[#d4c59d]/30 rounded-xl p-4 space-y-3">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#d4c59d]" />
                        رفع ملف فيديو من الجهاز (Upload Video File)
                      </h4>
                      <p className="text-[11px] text-[#9e9174] font-arabic">
                        يدعم ملفات MP4 و WebM و MOV حتى 80 ميجابايت بدون أي ضغط مخل بالجودة
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow disabled:opacity-50">
                        {isUploadingVideo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>جاري قراءة الفيديو...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>اختيار ملف فيديو من الجهاز</span>
                          </>
                        )}
                        <input
                          ref={videoFileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                          onChange={handleVideoFileUpload}
                          disabled={isUploadingVideo}
                          className="hidden"
                        />
                      </label>

                      {videoUrl && videoUrl.startsWith('data:') && (
                        <span className="text-xs text-emerald-400 font-arabic">
                          ✓ تم تحميل فيديو محلي بنجاح
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Option 3: Video Audio Track Setting */}
                  <div className="bg-[#0c0c0c] border border-[#d4c59d]/30 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] flex items-center gap-1.5">
                        {!videoMuted ? (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-amber-300" />
                        )}
                        <span>صوت الفيديو (Video Audio Track)</span>
                      </h4>
                      <p className="text-[11px] text-[#9e9174] font-arabic">
                        {!videoMuted
                          ? 'الفيديو يعمل بصوت ومسموع لجميع الزوار مع زر للتحكم (Audio Enabled)'
                          : 'الفيديو مكتوم بدون صوت (Muted)'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVideoMuted(!videoMuted)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        !videoMuted
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60 shadow'
                          : 'bg-[#1a1a1a] text-[#9e9174] border-[#d4c59d]/30 hover:text-white'
                      }`}
                    >
                      {!videoMuted ? (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span>بصوت (مفعّل)</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-4 h-4 text-amber-300" />
                          <span>مكتوم (صامت)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Image Configuration Section */
                <>
                  {/* Option A: Upload from Device */}
                  <div className="bg-[#0c0c0c] border border-[#d4c59d]/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#d4c59d]" />
                          Upload New Image from Your Computer or Phone
                        </h4>
                        <p className="text-[11px] text-[#9e9174] font-arabic">
                          ارفع صورة بجودتها الأصلية بدون أي اقتصاص دائم أو فقدان في الجودة
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow disabled:opacity-50">
                        {isCompressing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading Image...</span>
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
                        {isCompressing ? 'Preserving original quality...' : 'Preserves original dimensions and quality'}
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
                          className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-all ${
                            previewUrl === preset.url
                              ? 'border-[#d4c59d] ring-2 ring-[#d4c59d]'
                              : 'border-[#d4c59d]/20 hover:border-[#d4c59d]'
                          }`}
                          title={preset.title}
                        >
                          <TurathImage
                            src={preset.url}
                            alt={preset.title}
                            ratio="16:9"
                            fit="cover"
                            imageClassName="group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                          <span className="absolute bottom-1 left-1 right-1 text-[9px] text-[#f5f0e6] font-medium truncate drop-shadow bg-black/60 px-1 py-0.5 rounded">
                            {preset.titleAr}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            /* Tab 2: Section Internal Gallery Images & Individual Ratios */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#d4c59d]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4" />
                    Section Interior Gallery Images ({activeCategory.name})
                  </h3>
                  <span className="text-xs text-[#9e9174]">
                    Requirement 18 & 19: Per-image ratio control
                  </span>
                </div>
                <p className="text-xs text-[#9e9174]">
                  Add gallery photos to this section. Each individual image can have its own customized aspect ratio (e.g. Image 01: 16:9, Image 02: 1:1, Image 03: Original), framing, and position.
                </p>
              </div>

              {/* Gallery Images List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6]">
                    Gallery Photos ({galleryImages.length})
                  </span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#d4c59d] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5]">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-[#0e0e14] border border-[#333] space-y-3">
                    <ImageIcon className="w-8 h-8 text-[#d4c59d]/40 mx-auto" />
                    <p className="text-xs text-[#9e9174]">
                      No internal gallery images added to this section yet.
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#d4c59d] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload First Gallery Photo</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((imgUrl, idx) => {
                      const imgRatio = galleryRatios[imgUrl] || 'Original';
                      const isSelected = selectedGalleryImgIdx === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedGalleryImgIdx(idx)}
                          className={`relative group rounded-xl overflow-hidden border p-1 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#d4c59d] ring-2 ring-[#d4c59d] bg-[#1a1a24]'
                              : 'border-[#333] hover:border-[#d4c59d]/60 bg-[#0c0c12]'
                          }`}
                        >
                          <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center">
                            <TurathImage
                              src={imgUrl}
                              alt={`Gallery item ${idx + 1}`}
                              ratio="1:1"
                              fit="cover"
                              containerClassName="w-full"
                            />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#d4c59d] font-bold">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
                                if (selectedGalleryImgIdx === idx) setSelectedGalleryImgIdx(null);
                              }}
                              className="absolute top-1 right-1 p-1 rounded bg-red-950/80 hover:bg-red-700 text-red-300 hover:text-white transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="p-1 text-center">
                            <span className="text-[10px] font-mono font-bold text-[#d4c59d] block truncate">
                              Ratio: {imgRatio}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Gallery Image Ratio Control */}
              {selectedGalleryImgIdx !== null && galleryImages[selectedGalleryImgIdx] && (
                <div className="p-4 rounded-xl bg-[#0f0f18] border border-[#d4c59d]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                      Gallery Image #{selectedGalleryImgIdx + 1} Ratio & Framing
                    </h4>
                    <span className="text-[11px] text-[#9e9174]">
                      Configure individual image ratio
                    </span>
                  </div>

                  {(() => {
                    const currentImgUrl = galleryImages[selectedGalleryImgIdx];
                    const activeRatio = galleryRatios[currentImgUrl] || 'Original';
                    const activeFit = galleryFits[currentImgUrl] || 'cover';
                    const activePos = galleryPositions[currentImgUrl] || 'center';

                    return (
                      <>
                        <div className="max-w-[320px] mx-auto rounded-lg overflow-hidden border border-[#d4c59d]/40 bg-black">
                          <UnifiedResponsiveImage
                            src={currentImgUrl}
                            alt={`Gallery image ${selectedGalleryImgIdx + 1}`}
                            ratioConfig={{
                              ratio: activeRatio,
                              fit: activeFit,
                              position: activePos,
                            }}
                          />
                        </div>

                        <ImageRatioSelectorControl
                          ratio={activeRatio}
                          onChangeRatio={(newRatio) => {
                            setGalleryRatios((prev) => ({
                              ...prev,
                              [currentImgUrl]: newRatio,
                            }));
                          }}
                          fit={activeFit}
                          onChangeFit={(newFit) => {
                            setGalleryFits((prev) => ({
                              ...prev,
                              [currentImgUrl]: newFit,
                            }));
                          }}
                          position={activePos}
                          onChangePosition={(newPos) => {
                            setGalleryPositions((prev) => ({
                              ...prev,
                              [currentImgUrl]: newPos,
                            }));
                          }}
                          title={`Framing for Gallery Image #${selectedGalleryImgIdx + 1}`}
                          titleAR="تأطير صورة المعرض المحددة"
                          description="Set unique aspect ratio and focal point position for this specific gallery image."
                        />
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
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
                <span>Saved successfully!</span>
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
              disabled={isSaving || isCompressing || isUploadingVideo}
              className="gold-shimmer-hover flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#000000]" />
                  <span>Saving to Cloud...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Cover & Framing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
