import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { preserveOriginalUploadedImage } from './imageCompressor';
import { DEFAULT_ABOUT_IMAGE } from './siteContentStorage';
import { 
  ImageRatioPreset, 
  ImageObjectFit, 
  ImageObjectPosition, 
  computeImageRatio 
} from './imageRatioUtils';
import { ImageRatioSelectorControl } from "./ImageRatioSelectorControl";
import { TurathImage } from "./TurathImage";

export interface AboutPhotoOptions {
  aboutImageRatio?: string;
  aboutImageCustomWidth?: number | string;
  aboutImageCustomHeight?: number | string;
  aboutImageFit?: 'cover' | 'contain';
  aboutImagePosition?: string;
}

interface EditAboutPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  initialRatio?: string;
  initialCustomWidth?: number | string;
  initialCustomHeight?: number | string;
  initialFit?: 'cover' | 'contain';
  initialPosition?: string;
  title?: string;
  titleAR?: string;
  subtitle?: string;
  onSavePhoto: (newPhotoUrl: string, options?: AboutPhotoOptions) => Promise<void>;
  onResetPhoto: () => Promise<void>;
}

export const EditAboutPhotoModal: React.FC<EditAboutPhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  initialRatio = 'Original',
  initialCustomWidth = '5',
  initialCustomHeight = '7',
  initialFit = 'cover',
  initialPosition = 'center',
  title = 'About Section Image & Framing System',
  titleAR = 'نسبة وتأطير صورة قصة تراث',
  subtitle = 'About Turath craftsmanship and heritage section photo',
  onSavePhoto,
  onResetPhoto,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhotoUrl || DEFAULT_ABOUT_IMAGE);
  const [urlInput, setUrlInput] = useState<string>('');
  const [ratio, setRatio] = useState<ImageRatioPreset>(
    (initialRatio as ImageRatioPreset) || 'Original'
  );
  const [customWidth, setCustomWidth] = useState<string>(String(initialCustomWidth || '5'));
  const [customHeight, setCustomHeight] = useState<string>(String(initialCustomHeight || '7'));
  const [fit, setFit] = useState<ImageObjectFit>(initialFit || 'cover');
  const [position, setPosition] = useState<ImageObjectPosition>(initialPosition || 'center');

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentPhotoUrl || DEFAULT_ABOUT_IMAGE);
      setRatio((initialRatio as ImageRatioPreset) || 'Original');
      setCustomWidth(String(initialCustomWidth || '5'));
      setCustomHeight(String(initialCustomHeight || '7'));
      setFit(initialFit || 'cover');
      setPosition(initialPosition || 'center');
      setStatusMessage(null);
    }
  }, [isOpen, currentPhotoUrl, initialRatio, initialCustomWidth, initialCustomHeight, initialFit, initialPosition]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please select a valid image file (JPG, PNG, WebP).');
      setStatusType('error');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage('Preserving original image without quality loss...');
      setStatusType('info');

      // Preserve original uploaded image non-destructively
      const originalDataUrl = await preserveOriginalUploadedImage(file);
      setPreviewUrl(originalDataUrl);
      setStatusMessage('Original image loaded! Select aspect ratio and framing, then save.');
      setStatusType('success');
    } catch (err) {
      console.error(err);
      setStatusMessage('Could not load image. Please try another file or enter a direct URL.');
      setStatusType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setStatusMessage('Image link applied to preview! Adjust ratio and save.');
    setStatusType('success');
  };

  const handleSave = async () => {
    if (!previewUrl) return;
    setIsSaving(true);
    setStatusMessage('Saving and syncing with cloud...');
    setStatusType('info');

    try {
      const options: AboutPhotoOptions = {
        aboutImageRatio: ratio,
        aboutImageCustomWidth: Number(customWidth) || 5,
        aboutImageCustomHeight: Number(customHeight) || 7,
        aboutImageFit: fit,
        aboutImagePosition: position,
      };

      await onSavePhoto(previewUrl, options);
      setStatusMessage('Photo & framing saved successfully! Visible across all devices.');
      setStatusType('success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error syncing with cloud. Please try again.');
      setStatusType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset to original default photo?')) return;
    setIsSaving(true);
    try {
      await onResetPhoto();
      setPreviewUrl(DEFAULT_ABOUT_IMAGE);
      setRatio('Original');
      setFit('cover');
      setPosition('center');
      setStatusMessage('Default photo restored.');
      setStatusType('success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error resetting image.');
      setStatusType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const computedPreview = computeImageRatio({
    ratio,
    customWidth,
    customHeight,
    fit,
    position,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0e0e13] border-2 border-[#d4c59d] rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.95)] overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Cloud Synced
                </span>
              </h2>
              <p className="text-xs text-[#9e9174]">
                {subtitle}
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                statusType === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : statusType === 'error'
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                  : 'bg-[#181824] border-[#d4c59d]/30 text-[#d4c59d]'
              }`}
            >
              {statusType === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {statusType === 'success' && <Check className="w-4 h-4 shrink-0" />}
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                Live Presentation Preview
              </span>
              <span className="text-xs text-[#9e9174] font-mono">
                {ratio === 'Custom' ? `${customWidth}:${customHeight}` : ratio} ({fit}, {position})
              </span>
            </div>

            <div className="max-w-[340px] mx-auto rounded-xl overflow-hidden border-2 border-[#d4c59d]/50 bg-black shadow-2xl relative">
              <TurathImage
                src={previewUrl}
                alt={title}
                computedRatio={computedPreview}
                containerClassName="bg-[#0c0c10] max-h-[460px]"
              />
            </div>
          </div>

          {/* Ratio & Framing Control */}
          <ImageRatioSelectorControl
            ratio={ratio}
            onChangeRatio={(r) => setRatio(r)}
            customWidth={customWidth}
            onChangeCustomWidth={(w) => setCustomWidth(w)}
            customHeight={customHeight}
            onChangeCustomHeight={(h) => setCustomHeight(h)}
            fit={fit}
            onChangeFit={(f) => setFit(f)}
            position={position}
            onChangePosition={(p) => setPosition(p)}
            title={title}
            titleAR={titleAR}
            description="Original image file remains preserved. Select how it is presented across devices."
          />

          {/* Upload Method 1: Device File */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#d4c59d]" />
              <span>Upload New Photo from Computer or Mobile</span>
            </h3>

            <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d4c59d] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading Photo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-[#9e9174]">
              Uploads preserve the original file resolution and aspect ratio without destructive downscaling.
            </p>
          </div>

          {/* Upload Method 2: Direct Image URL */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6]">
              Or Paste an Image URL
            </h3>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-[#0e0e13] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#d4c59d] outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 bg-[#d4c59d]/20 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#14141c] border-t border-[#d4c59d]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 text-xs text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-[#1a1a24] border border-[#333] text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isProcessing}
              className="gold-shimmer-hover flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Photo & Ratio</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
