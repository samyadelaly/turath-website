import React, { useState } from 'react';
import {
  MediaRatioPreset,
  MediaObjectFit,
  MediaObjectPosition,
  MEDIA_RATIO_OPTIONS,
} from "./imageRatioUtils";
import {
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Ratio,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Save,
  Scan,
  ShieldCheck
} from 'lucide-react';

export type MediaPlaceSizePreset = 'compact' | 'standard' | 'large' | 'full';

export interface MediaPlaceResizeControlProps {
  // Current ratio and fit
  currentRatio: MediaRatioPreset | string;
  onChangeRatio: (ratio: MediaRatioPreset) => void;
  currentFit: MediaObjectFit;
  onChangeFit: (fit: MediaObjectFit) => void;

  // Custom ratio values
  customWidth?: number | string;
  onChangeCustomWidth?: (w: string) => void;
  customHeight?: number | string;
  onChangeCustomHeight?: (h: string) => void;

  // Current place sizing
  sizePreset: MediaPlaceSizePreset;
  onChangeSizePreset: (size: MediaPlaceSizePreset) => void;
  pixelWidth?: number; // Optional fine-tuning pixel slider (e.g. 380 - 900)
  onChangePixelWidth?: (px: number) => void;

  // Position
  currentPosition?: MediaObjectPosition;
  onChangePosition?: (pos: MediaObjectPosition) => void;

  // Context & capabilities
  mediaType?: 'image' | 'video';
  isAdmin?: boolean;
  onSaveAsDefault?: () => Promise<void> | void;
  onResetDefaults?: () => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const SIZE_PRESET_MAP: Record<MediaPlaceSizePreset, { label: string; labelAR: string; maxWidthCss: string; px: number }> = {
  compact: { label: 'Compact', labelAR: 'مدمج', maxWidthCss: 'max-w-[420px]', px: 420 },
  standard: { label: 'Standard', labelAR: 'قياسي', maxWidthCss: 'max-w-[560px]', px: 560 },
  large: { label: 'Large', labelAR: 'كبير', maxWidthCss: 'max-w-[750px]', px: 750 },
  full: { label: 'Full Width', labelAR: 'كامل العرض', maxWidthCss: 'max-w-full', px: 1000 },
};

export const MediaPlaceResizeControl: React.FC<MediaPlaceResizeControlProps> = ({
  currentRatio,
  onChangeRatio,
  currentFit,
  onChangeFit,
  customWidth = '5',
  onChangeCustomWidth,
  customHeight = '7',
  onChangeCustomHeight,
  sizePreset,
  onChangeSizePreset,
  pixelWidth,
  onChangePixelWidth,
  currentPosition = 'center',
  onChangePosition,
  mediaType = 'image',
  isAdmin = false,
  onSaveAsDefault,
  onResetDefaults,
  className = '',
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Strictly hidden if not admin
  if (!isAdmin) {
    return null;
  }

  const handleSave = async () => {
    if (!onSaveAsDefault) return;
    setIsSaving(true);
    try {
      await onSaveAsDefault();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`w-full rounded-xl bg-[#0a0a0e] border border-[#d4c59d]/30 overflow-hidden shadow-lg transition-all ${className}`}>
      {/* Header bar / Quick Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2.5 bg-[#121218] hover:bg-[#181822] cursor-pointer flex items-center justify-between flex-wrap gap-2 transition-colors select-none"
      >
        <div className="flex items-center gap-2 text-xs">
          <div className="p-1 rounded bg-[#d4c59d]/15 text-[#d4c59d]">
            <Ratio className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[#f5f0e6] tracking-wide">
            {mediaType === 'video' ? 'Video Frame & Ratio' : 'Photo Frame & Ratio'}
          </span>
          <span className="text-[11px] font-arabic text-[#d4c59d] hidden sm:inline">
            (تغيير حجم الإطار ونسبة العرض)
          </span>

          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#d4c59d]" />
            <span>خاص بالمسؤول</span>
          </span>

          {/* Active Badges */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black text-[#d4c59d] border border-[#d4c59d]/40">
              {currentRatio === 'Custom' ? `${customWidth}:${customHeight}` : currentRatio}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1e1c24] text-[#9e9174] border border-white/10 uppercase">
              {SIZE_PRESET_MAP[sizePreset]?.label || sizePreset}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#9e9174] bg-[#1e1c24] border border-white/10">
              {currentFit}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && onSaveAsDefault && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={isSaving}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#d4c59d] text-black hover:bg-[#e6d8b5]'
              }`}
              title="حفظ هذه النسبة وحجم الإطار كافتراضي لهذه القطعة"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>تم الحفظ</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  <span>{isSaving ? '...' : 'حفظ كافتراضي'}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            className="p-1 rounded text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
            aria-label="Toggle resize & ratio controls"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-[#d4c59d]" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls Panel */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 space-y-4 bg-[#0a0a0e] border-t border-[#d4c59d]/20 text-xs">
          {/* 1. ASPECT RATIO PRESETS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[#d4c59d] font-bold">
              <span className="flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5" />
                <span>نسبة أبعاد الصورة / الفيديو (Aspect Ratio):</span>
              </span>
              <span className="text-[11px] text-[#9e9174] font-normal">
                {currentRatio === 'Original' ? 'الأصلية بدون اقتطاع' : `نسبة ${currentRatio}`}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {MEDIA_RATIO_OPTIONS.map((opt) => {
                const isActive = currentRatio === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeRatio(opt.value)}
                    className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isActive
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d] font-bold shadow-md ring-1 ring-[#d4c59d]'
                        : 'bg-[#121218] border-white/10 text-[#f5f0e6] hover:border-[#d4c59d]/50 hover:bg-[#1a1a24]'
                    }`}
                    title={`${opt.label} — ${opt.description}`}
                  >
                    <span className="text-[11px] font-mono font-bold leading-none">{opt.value}</span>
                    <span className={`text-[9px] truncate max-w-full font-arabic leading-none ${isActive ? 'text-black/80' : 'text-[#9e9174]'}`}>
                      {opt.labelAR}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Ratio Inputs (Width / Height) */}
            {currentRatio === 'Custom' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 mt-2">
                <span className="text-[#9e9174] text-[11px]">أبعاد النسبة المخصصة:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#d4c59d] font-mono text-[11px]">W:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={customWidth}
                    onChange={(e) => onChangeCustomWidth?.(e.target.value)}
                    className="w-14 px-2 py-0.5 rounded bg-black border border-[#d4c59d]/40 text-center font-mono text-xs text-[#f5f0e6]"
                  />
                  <span className="text-[#9e9174] font-bold">/</span>
                  <span className="text-[#d4c59d] font-mono text-[11px]">H:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={customHeight}
                    onChange={(e) => onChangeCustomHeight?.(e.target.value)}
                    className="w-14 px-2 py-0.5 rounded bg-black border border-[#d4c59d]/40 text-center font-mono text-xs text-[#f5f0e6]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. PLACE RESIZING (Container Size / Width Options) */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-[#d4c59d] font-bold">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>حجم إطار العرض (Frame / Place Resizing):</span>
              </span>
              <span className="text-[11px] text-[#9e9174] font-normal">
                {SIZE_PRESET_MAP[sizePreset]?.labelAR} ({SIZE_PRESET_MAP[sizePreset]?.maxWidthCss})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SIZE_PRESET_MAP) as MediaPlaceSizePreset[]).map((key) => {
                const item = SIZE_PRESET_MAP[key];
                const isSelected = sizePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChangeSizePreset(key);
                      if (onChangePixelWidth) onChangePixelWidth(item.px);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d] font-bold shadow-md'
                        : 'bg-[#121218] border-white/10 text-[#f5f0e6] hover:border-[#d4c59d]/50 hover:bg-[#1a1a24]'
                    }`}
                  >
                    <span className="text-[11px]">{item.label}</span>
                    <span className={`text-[10px] font-arabic ${isSelected ? 'text-black/80' : 'text-[#9e9174]'}`}>
                      {item.labelAR}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Continuous Pixel Width Slider for fine-grained resizing */}
            {onChangePixelWidth && (
              <div className="flex items-center gap-3 pt-1.5">
                <span className="text-[10px] text-[#9e9174] shrink-0 font-arabic">تكبير / تصغير دقيق:</span>
                <input
                  type="range"
                  min="360"
                  max="920"
                  step="20"
                  value={pixelWidth || SIZE_PRESET_MAP[sizePreset]?.px || 560}
                  onChange={(e) => onChangePixelWidth(Number(e.target.value))}
                  className="w-full accent-[#d4c59d] h-1.5 bg-[#1e1c24] rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-[#d4c59d] shrink-0 min-w-[50px] text-right">
                  {pixelWidth || SIZE_PRESET_MAP[sizePreset]?.px || 560}px
                </span>
              </div>
            )}
          </div>

          {/* 3. FIT & ALIGNMENT OPTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            {/* Fit mode */}
            <div className="flex items-center gap-2">
              <span className="text-[#9e9174] text-[11px] shrink-0">التأطير (Fit):</span>
              <div className="flex items-center gap-1 bg-[#121218] p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => onChangeFit('contain')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    currentFit === 'contain'
                      ? 'bg-[#d4c59d] text-black shadow-sm'
                      : 'text-[#9e9174] hover:text-[#f5f0e6]'
                  }`}
                  title="إظهار كامل القطعة في الإطار دون أي قص"
                >
                  احتواء كامل (Contain)
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFit('cover')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    currentFit === 'cover'
                      ? 'bg-[#d4c59d] text-black shadow-sm'
                      : 'text-[#9e9174] hover:text-[#f5f0e6]'
                  }`}
                  title="ملء الإطار بالكامل (اقتصاص الأطراف الزائدة)"
                >
                  ملء الإطار (Cover)
                </button>
              </div>
            </div>

            {/* Position */}
            {onChangePosition && (
              <div className="flex items-center gap-1.5">
                <span className="text-[#9e9174] text-[11px] shrink-0">المحاذاة:</span>
                <select
                  value={currentPosition}
                  onChange={(e) => onChangePosition(e.target.value as MediaObjectPosition)}
                  className="bg-[#121218] border border-white/10 rounded px-2 py-1 text-[11px] text-[#d4c59d] focus:outline-none focus:border-[#d4c59d]"
                >
                  <option value="center">الوسط (Center)</option>
                  <option value="top">الأعلى (Top)</option>
                  <option value="bottom">الأسفل (Bottom)</option>
                  <option value="left">اليسار (Left)</option>
                  <option value="right">اليمين (Right)</option>
                </select>
              </div>
            )}

            {/* Reset */}
            {onResetDefaults && (
              <button
                type="button"
                onClick={onResetDefaults}
                className="inline-flex items-center gap-1 text-[10px] text-[#9e9174] hover:text-[#d4c59d] transition-colors cursor-pointer self-end sm:self-center"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الافتراضي</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
