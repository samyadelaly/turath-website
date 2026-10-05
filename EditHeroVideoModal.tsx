import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Check, 
  Video as VideoIcon, 
  Loader2, 
  RotateCcw,
  Sparkles,
  Sliders,
  Maximize2,
  Minimize2,
  AlertCircle
} from 'lucide-react';
import { uploadToSupabaseStorage, deleteFromSupabaseStorage } from './supabaseStorage';

export interface HeroVideoOptions {
  fit: 'cover' | 'contain';
  ratio: 'Auto' | '16:9' | '4:3' | '3:4' | '1:1' | 'Custom' | string;
  customRatio?: string;
  opacity: number;
}

interface EditHeroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideoUrl?: string;
  initialFit?: 'cover' | 'contain';
  initialRatio?: string;
  initialCustomRatio?: string;
  initialOpacity?: number;
  onSaveVideo: (newVideoUrl: string, options: HeroVideoOptions) => Promise<void>;
  onResetVideo?: () => Promise<void>;
}

export const EditHeroVideoModal: React.FC<EditHeroVideoModalProps> = ({
  isOpen,
  onClose,
  currentVideoUrl = '',
  initialFit = 'cover',
  initialRatio = 'Auto',
  initialCustomRatio = '',
  initialOpacity = 85,
  onSaveVideo,
  onResetVideo,
}) => {
  const [videoUrl, setVideoUrl] = useState<string>(currentVideoUrl);
  const [fit, setFit] = useState<'cover' | 'contain'>(initialFit);
  const [ratio, setRatio] = useState<string>(initialRatio);
  const [customRatio, setCustomRatio] = useState<string>(initialCustomRatio);
  const [opacity, setOpacity] = useState<number>(initialOpacity);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVideoUrl(currentVideoUrl);
      setFit(initialFit);
      setRatio(initialRatio);
      setCustomRatio(initialCustomRatio);
      setOpacity(initialOpacity);
      setStatusMessage(null);
    }
  }, [isOpen, currentVideoUrl, initialFit, initialRatio, initialCustomRatio, initialOpacity]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video file
    if (!file.type.startsWith('video/')) {
      setStatusMessage({ text: 'يرجى اختيار ملف فيديو صالح بصيغة MP4 أو صيغة فيديو متوافقة مع الويب.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setStatusMessage({ text: 'جاري رفع الفيديو إلى مخزن Supabase Storage...', type: 'info' });

    try {
      const cleanFileName = `hero/video_${Date.now()}`;
      // Upload to Supabase Storage 'product-videos' bucket
      const publicUrl = await uploadToSupabaseStorage('product-videos', cleanFileName, file);
      
      setVideoUrl(publicUrl);
      setStatusMessage({ text: 'تم رفع الفيديو إلى مخزن Supabase بنجاح! يمكنك الآن معاينته وضبط خيارات العرض ثم الحفظ.', type: 'success' });
    } catch (err: any) {
      console.error('[Hero Video Upload Error]:', err);
      // Fallback try site-media bucket
      try {
        const fallbackPath = `hero/video_${Date.now()}`;
        const fallbackUrl = await uploadToSupabaseStorage('site-media', fallbackPath, file);
        setVideoUrl(fallbackUrl);
        setStatusMessage({ text: 'تم رفع الفيديو إلى مخزن Supabase بنجاح!', type: 'success' });
      } catch (fbErr: any) {
        setStatusMessage({
          text: `فشل رفع الفيديو: ${err?.message || 'تأكد من الاتصال بـ Supabase'}. يرجى المحاولة مرة أخرى.`,
          type: 'error',
        });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    setStatusMessage({ text: 'تمت إزالة الفيديو من المعاينة الحية. اضغط على زر الحفظ بالأسفل لتطبيق الإزالة على الموقع.', type: 'info' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage({ text: 'جاري حفظ الإعدادات سحابياً...', type: 'info' });

    try {
      await onSaveVideo(videoUrl.trim(), {
        fit,
        ratio,
        customRatio: ratio === 'Custom' ? customRatio : undefined,
        opacity,
      });

      setStatusMessage({ text: 'تم حفظ فيديو الهيرو وخيارات العرض سحابياً بنجاح!', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      console.error('[Save Hero Video Error]:', err);
      setStatusMessage({ text: `فشل الحفظ: ${err?.message || 'حدث خطأ'}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('هل تريد استعادة الفيديو الأصلي المعتمد لـ TURATH؟')) return;
    if (onResetVideo) {
      await onResetVideo();
    }
    setVideoUrl('https://rpyzvhetoviqpjvncqfy.supabase.co/storage/v1/object/public/product-videos/categories/cat-brass-and-copper-wall-art-1539/video_1790641313966.mp4');
    setFit('cover');
    setRatio('Auto');
    setOpacity(85);
    setStatusMessage({ text: 'تمت استعادة الفيديو الأصلي.', type: 'info' });
  };

  // Compute aspect ratio style for the preview container
  let previewAspectStyle: React.CSSProperties = {};
  if (ratio === '16:9') previewAspectStyle = { aspectRatio: '16/9' };
  else if (ratio === '4:3') previewAspectStyle = { aspectRatio: '4/3' };
  else if (ratio === '3:4') previewAspectStyle = { aspectRatio: '3/4' };
  else if (ratio === '1:1') previewAspectStyle = { aspectRatio: '1/1' };
  else if (ratio === 'Custom' && customRatio) previewAspectStyle = { aspectRatio: customRatio };

  const ratioOptions: { id: string; label: string; desc: string }[] = [
    { id: 'Auto', label: 'تلقائي (Auto)', desc: 'يملأ كامل ارتفاع وعرض شاشة الهيرو' },
    { id: '16:9', label: '16:9', desc: 'شاشة عريضة سينمائية قياسية' },
    { id: '4:3', label: '4:3', desc: 'نسبة قياسية كلاسيكية' },
    { id: '3:4', label: '3:4', desc: 'بورتريه رأسي عمودي' },
    { id: '1:1', label: '1:1', desc: 'مربع متساوي الأبعاد' },
    { id: 'Custom', label: 'مخصص (Custom)', desc: 'تحديد النسبة يدوياً' },
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      data-modal="hero-video-editor"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#0c0c0f] border-2 border-[#d4c59d]/50 rounded-2xl shadow-[0_16px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#f5f0e6]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#141318] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
              <VideoIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>إدارة فيديو الواجهة الرئيسية (Hero Video)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Supabase Storage
                </span>
              </h2>
              <p className="text-xs text-[#9e9174]">
                رفع واستبدال وحذف فيديو الهيرو، والتحكم في نسبة العرض (Ratio) والملء (Fit) ونسبة الشفافية (Opacity)
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
                : statusMessage.type === 'error'
                ? 'bg-red-950/80 border-red-500/50 text-red-300'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* 1. LIVE VIDEO PREVIEW CANVAS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono tracking-wider uppercase text-[#d4c59d] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>المعاينة الحية لفيديو الهيرو (Live Hero Preview)</span>
              </label>
              <span className="text-[11px] text-[#9e9174] font-mono">
                {fit === 'cover' ? 'Cover / Full' : 'Contain / Fit'} • Ratio: {ratio} • Opacity: {opacity}%
              </span>
            </div>

            <div className="relative w-full h-64 sm:h-80 bg-[#050507] border-2 border-dashed border-[#d4c59d]/30 rounded-xl overflow-hidden flex items-center justify-center">
              {videoUrl ? (
                <div 
                  className="w-full h-full flex items-center justify-center transition-all duration-300"
                  style={previewAspectStyle}
                >
                  <video
                    ref={previewVideoRef}
                    src={videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                    style={{
                      objectFit: fit,
                      opacity: opacity / 100,
                    }}
                    className="w-full h-full filter brightness-[0.98] contrast-[1.05]"
                  />
                  {/* Subtle Text Readability Vignette in Preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
                  
                  {/* Watermark in preview */}
                  <div className="absolute bottom-3 left-3 text-[10px] font-mono tracking-widest text-[#d4c59d] uppercase bg-black/70 px-2 py-0.5 rounded border border-[#d4c59d]/40">
                    Live Looped Hero Video
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#14141c] border border-[#d4c59d]/30 flex items-center justify-center text-[#d4c59d]">
                    <VideoIcon className="w-6 h-6" />
                  </div>
                  <div className="font-serif-luxury text-sm font-bold text-[#f5f0e6]">
                    لا يوجد فيديو مفعل حالياً (No Hero Video)
                  </div>
                  <p className="text-xs text-[#9e9174] max-w-sm">
                    عند إزالة الفيديو، تعرض الواجهة الرئيسية تلقائياً الخلفية التراثية الداكنة الأنيقة لـ TURATH دون تشغيل أي وسائط تجريبية أو وهمية.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. UPLOAD & ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploading || isSaving}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#d4c59d] hover:bg-[#e6d8b5] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري رفع الفيديو إلى Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{videoUrl ? 'استبدال الفيديو (Upload / Replace MP4)' : 'رفع فيديو جديد (Upload MP4)'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!videoUrl || isUploading || isSaving}
              onClick={handleRemoveVideo}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>إزالة الفيديو نهائياً (Remove Video)</span>
            </button>
          </div>

          {/* Video URL Input Field (Optional Manual URL) */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/20 space-y-2">
            <label className="block text-xs font-mono text-[#d4c59d]">
              رابط الفيديو في مخزن Supabase Storage (Direct Video URL):
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://rpyzvhetoviqpjvncqfy.supabase.co/storage/v1/object/public/..."
              className="w-full bg-[#0a0a0d] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs font-mono focus:border-[#d4c59d] outline-none"
            />
            <p className="text-[11px] text-[#9e9174]">
              يتم ملء هذا الحقل تلقائياً عند رفع ملف MP4 من جهازك، أو يمكنك لصق رابط فيديو مباشر مستضاف على Supabase Storage.
            </p>
          </div>

          {/* 3. VIDEO DISPLAY MODE: COVER VS CONTAIN */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#f5f0e6] flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>نمط ملء وعرض الفيديو (Video Display Mode)</span>
              </label>
              <span className="text-[10px] font-mono uppercase text-[#d4c59d]">
                {fit === 'cover' ? 'object-fit: cover' : 'object-fit: contain'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFit('cover')}
                className={`p-3 rounded-lg border text-right transition-all cursor-pointer flex items-start gap-3 ${
                  fit === 'cover'
                    ? 'border-[#d4c59d] bg-[#d4c59d]/15 text-[#f5f0e6]'
                    : 'border-[#d4c59d]/20 bg-[#0a0a0d] text-[#9e9174] hover:border-[#d4c59d]/40'
                }`}
              >
                <Maximize2 className={`w-4 h-4 mt-0.5 shrink-0 ${fit === 'cover' ? 'text-[#d4c59d]' : 'text-[#9e9174]'}`} />
                <div>
                  <div className="text-xs font-bold text-[#f5f0e6]">تغطية كاملة (Cover / Full)</div>
                  <div className="text-[11px] text-[#9e9174] mt-0.5 leading-relaxed">
                    يملأ الفيديو كامل مساحة واجهة الهيرو تلقائياً ليعطي انطباعاً سينمائياً فخماً، مع الحفاظ على النسبة والتناسب دون مط الفيديو.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFit('contain')}
                className={`p-3 rounded-lg border text-right transition-all cursor-pointer flex items-start gap-3 ${
                  fit === 'contain'
                    ? 'border-[#d4c59d] bg-[#d4c59d]/15 text-[#f5f0e6]'
                    : 'border-[#d4c59d]/20 bg-[#0a0a0d] text-[#9e9174] hover:border-[#d4c59d]/40'
                }`}
              >
                <Minimize2 className={`w-4 h-4 mt-0.5 shrink-0 ${fit === 'contain' ? 'text-[#d4c59d]' : 'text-[#9e9174]'}`} />
                <div>
                  <div className="text-xs font-bold text-[#f5f0e6]">احتواء كامل (Contain / Fit)</div>
                  <div className="text-[11px] text-[#9e9174] mt-0.5 leading-relaxed">
                    يظهر كامل إطار الفيديو بالكامل دون أي اقتصاص من حواف العمل، مع بقاء المساحات الجانبية بلون الخلفية الأسود الملكي.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. VIDEO RATIO CONTROL */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#f5f0e6] flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>نسبة أبعاد عرض الهيرو (Hero Video Ratio)</span>
              </label>
              <span className="text-[10px] font-mono text-[#d4c59d]">
                النسبة الحالية: {ratio}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ratioOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRatio(opt.id)}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    ratio === opt.id
                      ? 'border-[#d4c59d] bg-[#d4c59d]/20 text-[#d4c59d] font-bold'
                      : 'border-[#d4c59d]/20 bg-[#0a0a0d] text-[#9e9174] hover:border-[#d4c59d]/50 hover:text-[#f5f0e6]'
                  }`}
                  title={opt.desc}
                >
                  <div className="text-xs">{opt.label}</div>
                </button>
              ))}
            </div>

            {ratio === 'Custom' && (
              <div className="pt-2 flex items-center gap-3">
                <label className="text-xs text-[#9e9174] font-mono whitespace-nowrap">
                  النسبة المخصصة (Custom Aspect Ratio e.g. 21/9, 16/10):
                </label>
                <input
                  type="text"
                  value={customRatio}
                  onChange={(e) => setCustomRatio(e.target.value)}
                  placeholder="21/9"
                  className="bg-[#0a0a0d] text-[#f5f0e6] border border-[#d4c59d]/40 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-[#d4c59d]"
                />
              </div>
            )}
          </div>

          {/* 5. VIDEO OPACITY CONTROL */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#f5f0e6] flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#d4c59d]" />
                <span>درجة وضوح الفيديو (Hero Video Opacity)</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#d4c59d] bg-[#0a0a0d] px-2 py-0.5 rounded border border-[#d4c59d]/30">
                  {opacity}%
                </span>
                <span className="text-[11px] text-[#9e9174]">
                  ({(opacity / 100).toFixed(2)})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-[#d4c59d] bg-[#0a0a0d] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9e9174] font-mono">
                <span>0% (مخفي تماماً)</span>
                <span>50% (متوسط)</span>
                <span>85% (المثالي المعتمد لـ TURATH)</span>
                <span>100% (أقصى وضوح)</span>
              </div>
            </div>
            <p className="text-[11px] text-[#9e9174]">
              تتيح لك موازنة وضوح الفيديو خلف نصوص وعناوين الهيرو لضمان قراءة نصوص وشعار الموقع بفخامة.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#141318] border-t border-[#d4c59d]/30 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving || isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d]/10 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الفيديو الأصلي (Reset)</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-xs text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
            >
              إلغاء (Cancel)
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ سحابياً...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>حفظ إعدادات الفيديو سحابياً (Save Video)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
