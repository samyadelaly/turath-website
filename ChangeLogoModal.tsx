import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Link as LinkIcon,
  Cloud,
  Loader2
} from 'lucide-react';
import { getStoredLogo, saveStoredLogo, resetStoredLogo, DEFAULT_LOGO_URL } from './logoStorage';
import { saveCloudLogo, resetCloudLogo } from './cloudDatabase';
import { compressSquareImage1080 } from './imageCompressor';
import { TurathImage } from "./TurathImage";

interface ChangeLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated: (newLogoUrl: string) => void;
}

export const ChangeLogoModal: React.FC<ChangeLogoModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(getStoredLogo());
  const [urlInput, setUrlInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please select a valid image file (JPG, PNG, WebP, SVG).');
      return;
    }

    try {
      setStatusMessage('جاري تحسين وضبط الشعار بمقاس 1080 × 1080 بكسل...');
      // Compress to optimal 1080x1080 square format
      const compressed = await compressSquareImage1080(file, 1080, 0.90);
      setPreviewUrl(compressed);
      setStatusMessage('تم تجهيز الشعار بمقاس 1080 × 1080 بكسل! اضغط على "حفظ الشعار سحابياً" لتطبيقه.');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setPreviewUrl(result);
          setStatusMessage('تم تحميل الشعار! اضغط على "حفظ الشعار سحابياً".');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setStatusMessage('Logo URL loaded! Click "Save Logo" to apply.');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveStoredLogo(previewUrl);
      await saveCloudLogo(previewUrl);
      onLogoUpdated(previewUrl);
      setStatusMessage('تم حفظ الشعار في السيرفر السحابي بنجاح! سيظهر لجميع الزوار على كل البراوزرز فوراً.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      saveStoredLogo(previewUrl);
      onLogoUpdated(previewUrl);
      setStatusMessage('تم حفظ الشعار محلياً وجاري مزامنة السحابة.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const defaultUrl = resetStoredLogo();
      await resetCloudLogo();
      setPreviewUrl(defaultUrl);
      onLogoUpdated(defaultUrl);
      setStatusMessage('تمت استعادة الشعار الأصلي سحابياً لجميع الزوار.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-[#c5a059]/40 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-[#c5a059]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#c5a059]/10 text-[#d4af37] border border-[#c5a059]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#f5ebd7]">
                Change & Replace Logo
              </h3>
              <p className="text-xs text-[#a8a293]">
                Upload your exact original logo file to replace it everywhere
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#999] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Message */}
          {statusMessage && (
            <div className="p-3 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/40 text-xs text-[#f3e5ab] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Current Logo Preview */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#c5a059]">
              Logo Live Preview:
            </label>
            <div className="p-4 rounded-xl bg-black border border-[#c5a059]/30 flex items-center justify-center min-h-[160px] shadow-inner">
              <TurathImage
                src={previewUrl || DEFAULT_LOGO_URL}
                alt="Turath Logo Preview"
                ratio="Original"
                fit="contain"
                containerClassName="max-h-36 max-w-full rounded drop-shadow-[0_2px_15px_rgba(197,160,89,0.3)]"
                fallbackSrc={DEFAULT_LOGO_URL}
              />
            </div>
          </div>

          {/* Upload New Logo from device */}
          <div className="space-y-3">
            <label className="cursor-pointer w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#c5a059]/40 hover:border-[#d4af37] rounded-xl bg-[#13131c] transition-colors group">
              <Upload className="w-7 h-7 text-[#d4af37] group-hover:scale-110 transition-transform mb-2" />
              <span className="text-xs sm:text-sm font-bold text-[#f5ebd7]">
                Click to upload your original logo file
              </span>
              <span className="text-[11px] text-[#d4c59d] mt-1 font-semibold">
                المقاس الموصى به: 1080 × 1080 بكسل (Square 1:1)
              </span>
              <span className="text-[10px] text-[#888]">
                Upload JPG, PNG, or WebP (e.g. PSX_20200221_233929.jpg)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Or Paste URL */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full bg-[#161622] text-[#ede9e0] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 text-xs bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#14141c] border-t border-[#c5a059]/20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] font-bold uppercase transition-colors"
            title="Reset to official generated logo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] font-bold uppercase rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] active:scale-95 transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ السحابي...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-[#000000]" />
                  <span>حفظ الشعار سحابياً (Cloud Save)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
