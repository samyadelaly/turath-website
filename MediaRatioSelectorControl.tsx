import React from 'react';
import {
  MediaType,
  MediaRatioPreset,
  MediaObjectFit,
  MediaObjectPosition,
  MEDIA_TYPE_OPTIONS,
  MEDIA_RATIO_OPTIONS,
  MEDIA_FIT_OPTIONS,
  MEDIA_POSITION_OPTIONS,
} from "./imageRatioUtils";
import { Ratio, Film, Image as ImageIcon } from 'lucide-react';

export interface MediaRatioSelectorControlProps {
  mediaType?: MediaType;
  onChangeMediaType?: (type: MediaType) => void;
  showMediaTypeSelector?: boolean;

  ratio?: MediaRatioPreset | string;
  onChangeRatio: (ratio: MediaRatioPreset) => void;

  customWidth?: number | string;
  onChangeCustomWidth?: (val: string) => void;
  customHeight?: number | string;
  onChangeCustomHeight?: (val: string) => void;

  fit?: MediaObjectFit | string;
  onChangeFit?: (fit: MediaObjectFit) => void;

  position?: MediaObjectPosition | string;
  onChangePosition?: (pos: MediaObjectPosition) => void;

  title?: string;
  titleAR?: string;
  description?: string;
  compact?: boolean;
}

/**
 * TURATH Global Media Ratio & Framing Controls
 * Provides unified controls for BOTH Images and Videos in the Admin Panel.
 */
export const MediaRatioSelectorControl: React.FC<MediaRatioSelectorControlProps> = ({
  mediaType = 'image',
  onChangeMediaType,
  showMediaTypeSelector = true,
  ratio = 'Original',
  onChangeRatio,
  customWidth = '5',
  onChangeCustomWidth,
  customHeight = '7',
  onChangeCustomHeight,
  fit = 'contain',
  onChangeFit,
  position = 'center',
  onChangePosition,
  title = 'Media Display & Ratio Controls',
  titleAR = 'التحكم في وسائط العرض والنسبة والتأطير',
  description = 'Unified presentation controls for images and videos. Original files are preserved.',
}) => {
  const normalizedRatio: MediaRatioPreset = (
    ['Original', '1:1', '4:5', '3:4', '16:9', '4:3', '16:7', 'Custom'].includes(ratio)
      ? ratio
      : 'Original'
  ) as MediaRatioPreset;

  const normalizedFit: MediaObjectFit = fit === 'cover' ? 'cover' : 'contain';
  const normalizedPos: MediaObjectPosition = ['top', 'bottom', 'left', 'right', 'center'].includes(
    String(position).toLowerCase()
  )
    ? (String(position).toLowerCase() as MediaObjectPosition)
    : 'center';

  return (
    <div className="p-4 rounded-xl bg-[#0c0c10] border border-[#d4c59d]/30 space-y-4 text-left shadow-md">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#d4c59d]/20">
        <div>
          <div className="flex items-center gap-2">
            <Ratio className="w-4 h-4 text-[#d4c59d]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f0e6]">
              {title}
            </h4>
            {titleAR && (
              <span className="text-[11px] font-arabic text-[#d4c59d]">
                ({titleAR})
              </span>
            )}
          </div>
          {description && (
            <p className="text-[11px] text-[#9e9174] mt-0.5">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-black/80 border border-[#d4c59d]/40 text-[#d4c59d] text-xs font-mono font-bold shrink-0">
            Type: {mediaType.toUpperCase()} • Ratio:{' '}
            {normalizedRatio === 'Custom' ? `${customWidth}:${customHeight}` : normalizedRatio} • Fit:{' '}
            {normalizedFit} • Pos: {normalizedPos}
          </span>
        </div>
      </div>

      {/* Main 4 Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Media Type Selector */}
        {showMediaTypeSelector && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
              {mediaType === 'video' ? (
                <Film className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Media Type:</span>
            </label>
            <select
              value={mediaType}
              onChange={(e) => onChangeMediaType && onChangeMediaType(e.target.value as MediaType)}
              className="w-full px-3 py-2 rounded-lg bg-black border border-[#d4c59d]/40 text-white font-medium text-xs focus:border-[#d4c59d] outline-none cursor-pointer"
            >
              {MEDIA_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#121218] text-white">
                  {opt.label} ({opt.labelAR})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 2. Media Ratio Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#d4c59d] block">
            Media Ratio:
          </label>
          <select
            value={normalizedRatio}
            onChange={(e) => onChangeRatio(e.target.value as MediaRatioPreset)}
            className="w-full px-3 py-2 rounded-lg bg-black border border-[#d4c59d]/40 text-white font-medium text-xs focus:border-[#d4c59d] outline-none cursor-pointer"
          >
            {MEDIA_RATIO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121218] text-white">
                {opt.label} ({opt.labelAR})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Media Fit Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#d4c59d] block">
            Media Fit:
          </label>
          <select
            value={normalizedFit}
            onChange={(e) => onChangeFit && onChangeFit(e.target.value as MediaObjectFit)}
            className="w-full px-3 py-2 rounded-lg bg-black border border-[#d4c59d]/40 text-white font-medium text-xs focus:border-[#d4c59d] outline-none cursor-pointer"
          >
            {MEDIA_FIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121218] text-white">
                {opt.label} ({opt.labelAR})
              </option>
            ))}
          </select>
        </div>

        {/* 4. Media Position Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#d4c59d] block">
            Media Position:
          </label>
          <select
            value={normalizedPos}
            onChange={(e) => onChangePosition && onChangePosition(e.target.value as MediaObjectPosition)}
            className="w-full px-3 py-2 rounded-lg bg-black border border-[#d4c59d]/40 text-white font-medium text-xs focus:border-[#d4c59d] outline-none cursor-pointer"
          >
            {MEDIA_POSITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121218] text-white">
                {opt.label} ({opt.labelAR})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Preset Buttons for 1-click selection */}
      <div className="pt-2 border-t border-[#d4c59d]/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9e9174]">
            Quick Preset Selection:
          </span>
          <span className="text-[10px] text-[#9e9174]">
            {normalizedRatio === 'Original' ? 'Full Original Size' : normalizedRatio}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
          {MEDIA_RATIO_OPTIONS.map((opt) => {
            const isSelected = normalizedRatio === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangeRatio(opt.value)}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-[#d4c59d] text-black border-[#d4c59d] font-bold shadow-md'
                    : 'bg-black/50 text-[#d4c59d] border-[#222] hover:border-[#d4c59d]/40 hover:bg-black/80'
                }`}
              >
                <span className="text-[11px] font-bold whitespace-nowrap">{opt.label.split('—')[0].trim()}</span>
                <span className={`text-[8px] whitespace-nowrap ${isSelected ? 'text-black/80 font-semibold' : 'text-[#8c826c]'}`}>
                  {opt.labelAR}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Ratio Width & Height Inputs (When 'Custom' is selected) */}
      {normalizedRatio === 'Custom' && (
        <div className="p-3.5 rounded-lg bg-black/70 border border-[#d4c59d]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
              Custom Aspect Dimensions (Width / Height)
            </span>
            <span className="text-xs font-mono text-[#d4c59d] font-bold">
              Ratio: {customWidth} / {customHeight}{' '}
              {Number(customHeight) > 0
                ? `(${(Number(customWidth) / Number(customHeight)).toFixed(2)})`
                : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9174] font-semibold">
                Width Ratio (e.g. 5)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={customWidth}
                onChange={(e) => onChangeCustomWidth && onChangeCustomWidth(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#101018] border border-[#333] text-white focus:border-[#d4c59d] outline-none text-xs font-mono"
                placeholder="5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#9e9174] font-semibold">
                Height Ratio (e.g. 7)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={customHeight}
                onChange={(e) => onChangeCustomHeight && onChangeCustomHeight(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#101018] border border-[#333] text-white focus:border-[#d4c59d] outline-none text-xs font-mono"
                placeholder="7"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaRatioSelectorControl;
