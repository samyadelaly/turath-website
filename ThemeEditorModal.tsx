import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Layers, 
  Type, 
  Sliders, 
  Eye, 
  MousePointerClick,
  Image as ImageIcon,
  Box,
  LayoutGrid,
  Package,
  Globe,
  Compass
} from 'lucide-react';
import { 
  ThemeSettings, 
  DEFAULT_THEME_SETTINGS, 
  applyThemeCssVariables, 
  hexToRgba,
  GradientDirection,
  PATTERN_PRESETS,
  getPatternMask
} from './themeSettings';

const DIRECTION_OPTIONS: { id: GradientDirection; labelAr: string; labelEn: string; icon: string }[] = [
  { id: 'to bottom', labelAr: 'من أعلى لأسفل', labelEn: 'Top to Bottom', icon: '↓' },
  { id: 'to top', labelAr: 'من أسفل لأعلى', labelEn: 'Bottom to Top', icon: '↑' },
  { id: 'to right', labelAr: 'من اليسار لليمين', labelEn: 'Left to Right', icon: '→' },
  { id: 'to left', labelAr: 'من اليمين لليسار', labelEn: 'Right to Left', icon: '←' },
  { id: '135deg', labelAr: 'مائل قطري 135°', labelEn: 'Diagonal 135°', icon: '↘' },
  { id: '45deg', labelAr: 'مائل صاعد 45°', labelEn: 'Ascending 45°', icon: '↗' },
  { id: 'radial', labelAr: 'شعاعي من المركز', labelEn: 'Radial Center', icon: '◎' },
];

interface PatternGradientPickerProps {
  title: string;
  description: string;
  badge?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  patternUrl: string;
  onPatternUrlChange: (url: string) => void;
  opacity: number; // 0 to 100
  onOpacityChange: (opacity: number) => void;
  direction: GradientDirection;
  onDirectionChange: (dir: GradientDirection) => void;
  allowFixed?: boolean;
  isFixed?: boolean;
  onFixedChange?: (fixed: boolean) => void;
  previewBg?: string;
  recommendedText?: string;
}

const PatternGradientPicker: React.FC<PatternGradientPickerProps> = ({
  title,
  description,
  badge,
  enabled,
  onToggle,
  patternUrl,
  onPatternUrlChange,
  opacity,
  onOpacityChange,
  direction,
  onDirectionChange,
  allowFixed = false,
  isFixed = true,
  onFixedChange,
  previewBg = '#0c0b0e',
  recommendedText = 'النسبة الموصى بها: 10% - 25% للمظهر المعماري الفخم الهادئ',
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const activePreset = PATTERN_PRESETS.find((p) => p.url === patternUrl);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-4 shadow-md transition-all">
      {/* Header with Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4c59d]" />
            <h4 className="text-xs sm:text-sm font-bold text-[#d4c59d] uppercase tracking-wider font-serif-luxury">
              {title}
            </h4>
            {badge && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/30 font-mono">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#9e9174] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Toggle Switch */}
        <label className="flex items-center gap-2 cursor-pointer bg-black/60 px-3 py-1.5 rounded-lg border border-[#d4c59d]/30 select-none self-start sm:self-center">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
          />
          <span className={`text-xs font-bold ${enabled ? 'text-[#d4c59d]' : 'text-[#9e9174]'}`}>
            {enabled ? 'النقش مفعّل (Active)' : 'النقش معطّل (Off)'}
          </span>
        </label>
      </div>

      {enabled && (
        <div className="space-y-4 pt-1">
          {/* 1. Presets Catalog */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#f5f0e6]">
              <span>اختر نقش الجرادينت أو ضع رابطاً مخصصاً (Pattern Selection):</span>
              <span className="text-[10px] text-[#d4c59d] font-mono">
                {activePreset ? activePreset.name : 'رابط مخصص'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PATTERN_PRESETS.map((preset) => {
                const isSelected = patternUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onPatternUrlChange(preset.url);
                      setShowCustomInput(false);
                    }}
                    className={`p-2.5 rounded-lg border text-right transition-all flex flex-col justify-between gap-1 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[#d4c59d] bg-[#d4c59d]/15 shadow-sm text-[#f5f0e6]'
                        : 'border-white/10 bg-black/40 hover:border-[#d4c59d]/50 text-[#9e9174] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-arabic">{preset.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#d4c59d]" />}
                    </div>
                    <span className="text-[10px] text-[#9e9174] font-mono">{preset.nameEn}</span>
                  </button>
                );
              })}

              {/* Custom URL Option */}
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className={`p-2.5 rounded-lg border text-right transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                  showCustomInput || !activePreset
                    ? 'border-[#d4c59d] bg-[#d4c59d]/15 text-[#f5f0e6]'
                    : 'border-white/10 bg-black/40 hover:border-[#d4c59d]/50 text-[#9e9174] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-arabic">🔗 رابط مخصص / Custom</span>
                  {(showCustomInput || !activePreset) && <Check className="w-3.5 h-3.5 text-[#d4c59d]" />}
                </div>
                <span className="text-[10px] text-[#9e9174] font-mono">Any URL / SVG</span>
              </button>
            </div>

            {/* Custom URL Text Input */}
            {(showCustomInput || !activePreset) && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://... أو /turath_pattern_watermark.png"
                  value={patternUrl}
                  onChange={(e) => onPatternUrlChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#1a1a20] border border-white/15 rounded text-xs text-[#f5f0e6] font-mono placeholder:text-[#9e9174]/60"
                />
                <button
                  type="button"
                  onClick={() => onPatternUrlChange('/turath_pattern_watermark.png')}
                  className="px-2.5 py-1.5 bg-[#d4c59d]/20 hover:bg-[#d4c59d]/30 text-[#d4c59d] rounded text-xs border border-[#d4c59d]/40 font-mono whitespace-nowrap cursor-pointer"
                >
                  Default Pattern
                </button>
              </div>
            )}
          </div>

          {/* 2. Direction Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#f5f0e6] block">
              اتجاه تدرج الجرادينت (Gradient Fade Direction):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {DIRECTION_OPTIONS.map((dir) => {
                const isSelected = direction === dir.id;
                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => onDirectionChange(dir.id)}
                    className={`px-2 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4c59d] text-black font-bold border-[#d4c59d] shadow'
                        : 'bg-black/50 text-[#9e9174] hover:text-white border-white/10 hover:border-[#d4c59d]/40'
                    }`}
                  >
                    <span className="text-sm font-bold leading-none">{dir.icon}</span>
                    <span className="text-[10px] leading-tight">{dir.labelAr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Opacity Slider & Live Mini Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Slider */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-[#f5f0e6]">
                <span>درجة شفافية النقش والجرادينت (Opacity):</span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/30 font-bold">
                  {opacity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={opacity}
                onChange={(e) => onOpacityChange(Number(e.target.value))}
                className="w-full accent-[#d4c59d] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9e9174]">
                <span>0% (خفي تماماً)</span>
                <span>25%</span>
                <span>50%</span>
                <span>100% (بارز بالكامل)</span>
              </div>
              <p className="text-[10px] text-[#9e9174] leading-relaxed">
                💡 {recommendedText}
              </p>
            </div>

            {/* Live Mini Preview Box */}
            <div className="p-3 bg-black/70 rounded-xl border border-white/10 space-y-1.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#9e9174] font-mono uppercase tracking-wider block">
                معاينة التأثير الحية
              </span>
              <div 
                style={{ backgroundColor: previewBg }}
                className="w-full h-16 rounded-lg border border-[#d4c59d]/30 relative overflow-hidden flex items-center justify-center shadow-inner"
              >
                {/* Pattern Overlay with exact direction mask and opacity */}
                <div 
                  style={{
                    backgroundImage: `url('${patternUrl}')`,
                    opacity: opacity / 100,
                    WebkitMaskImage: getPatternMask(direction),
                    maskImage: getPatternMask(direction),
                  }}
                  className="absolute inset-0 bg-cover bg-center pointer-events-none"
                />
                <span className="relative z-10 text-[11px] font-bold text-[#f5f0e6] drop-shadow-md">
                  {opacity}% • {direction}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Optional Parallax / Fixed Toggle (for Page Background) */}
          {allowFixed && onFixedChange && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-[#f5f0e6] block">
                  تثبيت الباترن أثناء التمرير (Fixed Parallax):
                </label>
                <p className="text-[10px] text-[#9e9174]">
                  عند التفعيل يظل الباترن ثابتاً في مكانه وتتحرك النصوص والصفحات فوقه
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-black/60 px-3 py-1.5 rounded-lg border border-white/15">
                <input
                  type="checkbox"
                  checked={isFixed}
                  onChange={(e) => onFixedChange(e.target.checked)}
                  className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#f5f0e6]">
                  {isFixed ? 'ثابت (Fixed)' : 'متحرك (Scroll)'}
                </span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ThemeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: ThemeSettings;
  onSaveTheme: (theme: ThemeSettings) => Promise<void>;
  onResetTheme?: () => Promise<void>;
}

export const ThemeEditorModal: React.FC<ThemeEditorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSaveTheme,
  onResetTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'gradients' | 'buttons' | 'containers' | 'textBoxes' | 'text' | 'hero' | 'productsPage'>('gradients');
  const [gradientSectionFilter, setGradientSectionFilter] = useState<'all' | 'hero' | 'products' | 'cards' | 'photos' | 'directPhoto' | 'textBoxes' | 'primaryBtn' | 'secondaryBtn' | 'pageBg'>('all');
  const [theme, setTheme] = useState<ThemeSettings>(() => ({
    primaryButton: { ...DEFAULT_THEME_SETTINGS.primaryButton, ...(currentTheme?.primaryButton || {}) },
    secondaryButton: { ...DEFAULT_THEME_SETTINGS.secondaryButton, ...(currentTheme?.secondaryButton || {}) },
    containers: { ...DEFAULT_THEME_SETTINGS.containers!, ...(currentTheme?.containers || {}) },
    textBoxes: { ...DEFAULT_THEME_SETTINGS.textBoxes!, ...(currentTheme?.textBoxes || {}) },
    productsPage: { ...DEFAULT_THEME_SETTINGS.productsPage!, ...(currentTheme?.productsPage || {}) },
    pageBackground: { ...DEFAULT_THEME_SETTINGS.pageBackground!, ...(currentTheme?.pageBackground || {}) },
    text: { ...DEFAULT_THEME_SETTINGS.text, ...(currentTheme?.text || {}) },
    hero: { ...DEFAULT_THEME_SETTINGS.hero, ...(currentTheme?.hero || {}) },
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when currentTheme updates or modal opens
  useEffect(() => {
    if (isOpen) {
      const merged: ThemeSettings = {
        primaryButton: { ...DEFAULT_THEME_SETTINGS.primaryButton, ...(currentTheme?.primaryButton || {}) },
        secondaryButton: { ...DEFAULT_THEME_SETTINGS.secondaryButton, ...(currentTheme?.secondaryButton || {}) },
        containers: { ...DEFAULT_THEME_SETTINGS.containers!, ...(currentTheme?.containers || {}) },
        textBoxes: { ...DEFAULT_THEME_SETTINGS.textBoxes!, ...(currentTheme?.textBoxes || {}) },
        productsPage: { ...DEFAULT_THEME_SETTINGS.productsPage!, ...(currentTheme?.productsPage || {}) },
        pageBackground: { ...DEFAULT_THEME_SETTINGS.pageBackground!, ...(currentTheme?.pageBackground || {}) },
        text: { ...DEFAULT_THEME_SETTINGS.text, ...(currentTheme?.text || {}) },
        hero: { ...DEFAULT_THEME_SETTINGS.hero, ...(currentTheme?.hero || {}) },
      };
      setTheme(merged);
      applyThemeCssVariables(merged);
    }
  }, [isOpen, currentTheme]);

  // Live Preview on any theme change
  const updateTheme = (updater: (prev: ThemeSettings) => ThemeSettings) => {
    setTheme((prev) => {
      const next = updater(prev);
      applyThemeCssVariables(next);
      return next;
    });
  };

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveTheme(theme);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Failed to save theme settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('هل أنت متأكد من استعادة كافة الألوان الافتراضية الأصلية للموقع؟')) return;
    const defaultCopy = JSON.parse(JSON.stringify(DEFAULT_THEME_SETTINGS));
    updateTheme(() => defaultCopy);
    if (onResetTheme) {
      await onResetTheme();
    }
  };

  const handleClose = () => {
    // Re-apply saved current theme on cancel/close
    applyThemeCssVariables(currentTheme || DEFAULT_THEME_SETTINGS);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      data-modal="theme-editor"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#0c0c0f] border-2 border-[#d4c59d]/50 rounded-2xl shadow-[0_16px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#f5f0e6]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#141318] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>تخصيص ألوان ومظهر الموقع (Theme & Appearance)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Live Preview
                </span>
              </h2>
              <p className="text-xs text-[#9e9174]">
                تحكم كامل في ألوان ونمط الأزرار، والشفافية، وألوان الخطوط والنصوص، مع معاينة فورية حية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-[#d4c59d]/20 bg-[#08080a] px-3 py-2 gap-1.5 text-xs font-semibold items-center">
          <button
            type="button"
            onClick={() => setActiveTab('gradients')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gradients'
                ? 'bg-[#d4c59d] text-black font-bold shadow-md'
                : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#d4c59d]/10 border border-[#d4c59d]/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ استوديو الجرادينت والشفافية بالأقسام (Gradient Studio)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buttons')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'buttons'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>أزرار الموقع (Buttons)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('containers')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'containers'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>إطارات وحاويات الصور (Photos & Containers)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('textBoxes')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'textBoxes'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>مربعات النصوص والجرادينت (Text Boxes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>ألوان النصوص (Typography)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نصوص الواجهة (Hero Text)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('productsPage')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'productsPage'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>خلفية الصفحات وقسم المنتجات (Pages & Products Background)</span>
          </button>
        </div>

        {/* Modal Body & Settings Controls */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* ========================================================== */}
          {/* TAB 0: GRADIENTS & OPACITY STUDIO (Separated by Section) */}
          {/* ========================================================== */}
          {activeTab === 'gradients' && (
            <div className="space-y-6">
              {/* Studio Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171520] via-[#101015] to-[#171520] border-2 border-[#d4c59d]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#f5f0e6] font-serif-luxury uppercase tracking-wider flex items-center gap-2">
                        <span>استوديو الجرادينت والشفافية المنفصل بالأقسام</span>
                        <span className="text-[10px] bg-[#d4c59d]/20 text-[#d4c59d] px-2 py-0.5 rounded-full border border-[#d4c59d]/40 font-mono">
                          9 Independent Sections
                        </span>
                      </h3>
                      <p className="text-[11px] text-[#9e9174] mt-0.5 leading-relaxed">
                        تم فصل كل قسم من أقسام الموقع لتتمكن من تخصيص لون الخلفية، الشفافية، ونقش الجرادينت المعماري بشكل مستقل تماماً بدون أي تداخل
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#d4c59d] bg-black/60 px-3 py-1.5 rounded-xl border border-[#d4c59d]/30 self-start md:self-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>انعكاس فوري على جميع أجهزة الزوار</span>
                </div>
              </div>

              {/* Quick Section Filter Bar */}
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#d4c59d]/20 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#9e9174] font-medium">تصفية أو القفز لقسم محدد (Jump to Section):</span>
                  <span className="text-[#d4c59d] font-mono text-[10px]">
                    {gradientSectionFilter === 'all' ? 'يتم عرض جميع الأقسام التسعة' : 'قسم محدد'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: '🌟 عرض جميع الأقسام (9)' },
                    { id: 'hero', label: '1. الهيرو وفيديو البداية' },
                    { id: 'products', label: '2. قسم المنتجات الحرفية' },
                    { id: 'cards', label: '3. كروت وبطاقات المنتجات' },
                    { id: 'photos', label: '4. إطارات وحاويات الصور' },
                    { id: 'directPhoto', label: '5. خلفية وشفافية الصور' },
                    { id: 'textBoxes', label: '6. مربعات ونصوص المحتوى' },
                    { id: 'primaryBtn', label: '7. الأزرار الرئيسية' },
                    { id: 'secondaryBtn', label: '8. الأزرار الثانوية' },
                    { id: 'pageBg', label: '9. خلفية الموقع العامة' },
                  ].map((filterOpt) => (
                    <button
                      key={filterOpt.id}
                      type="button"
                      onClick={() => setGradientSectionFilter(filterOpt.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        gradientSectionFilter === filterOpt.id
                          ? 'bg-[#d4c59d] text-black font-bold shadow'
                          : 'bg-[#14141a] text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#1e1e28] border border-white/5'
                      }`}
                    >
                      {filterOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 1: HERO SECTION & VIDEO OVERLAY */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'hero') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        01
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          واجهة الهيرو وفيديو البداية السينمائي (Hero Section & Video)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          التحكم في خلفية الهيرو، درجة تعتيم الفيديو، ونقش الجرادينت المتراكب فوق شاشة البداية
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-hero-pattern-overlay
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hero Background Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">
                        لون خلفية قسم الهيرو (Hero Background Color)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.hero.bgColor || '#000000'}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            hero: { ...p.hero, bgColor: e.target.value }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.hero.bgColor || '#000000'}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            hero: { ...p.hero, bgColor: e.target.value }
                          }))}
                          className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Hero Video Overlay Opacity (تعتيم الفيديو) */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">تعتيم وشفافية غطاء الفيديو (Video Overlay):</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {theme.hero.overlayOpacity ?? 70}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={theme.hero.overlayOpacity ?? 70}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          hero: { ...p.hero, overlayOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      <div className="flex items-center gap-1 pt-0.5">
                        {[30, 50, 70, 85, 95].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              hero: { ...p.hero, overlayOpacity: val }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              (theme.hero.overlayOpacity ?? 70) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6]'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hero Pattern Gradient Picker */}
                  <PatternGradientPicker
                    title="نقش وتدرج واجهة الهيرو (Hero Pattern Gradient)"
                    description="إضافة زخرفة الأرابيسك أو المشربية أو النجمة فوق فيديو الهيرو مع التحكم في الزاوية والشفافية"
                    badge="Hero Pattern"
                    enabled={theme.hero.enablePattern || false}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      hero: { ...p.hero, enablePattern: val }
                    }))}
                    patternUrl={theme.hero.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      hero: { ...p.hero, patternUrl: url }
                    }))}
                    opacity={theme.hero.patternOpacity ?? 15}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      hero: { ...p.hero, patternOpacity: op }
                    }))}
                    direction={theme.hero.patternDirection || 'to bottom'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      hero: { ...p.hero, patternDirection: dir }
                    }))}
                    previewBg={theme.hero.bgColor || '#000000'}
                    recommendedText="النسبة الموصى بها: 10% - 20% لتظهر النقوش فوق الفيديو دون حجب الرؤية"
                  />

                  {/* Section Mini Live Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-[#d4c59d]/30 h-28 bg-[#000000] flex items-center justify-center text-center p-4">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-40 filter brightness-75"
                      style={{ backgroundImage: `url('/turath_logo.jpg')` }}
                    />
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: `rgba(0,0,0, ${(theme.hero.overlayOpacity ?? 70) / 100})` }}
                    />
                    {theme.hero.enablePattern && (
                      <div 
                        className="absolute inset-0 pointer-events-none bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${theme.hero.patternUrl || '/turath_pattern_watermark.png'}')`,
                          opacity: (theme.hero.patternOpacity ?? 15) / 100,
                          WebkitMaskImage: getPatternMask(theme.hero.patternDirection || 'to bottom'),
                          maskImage: getPatternMask(theme.hero.patternDirection || 'to bottom'),
                        }}
                      />
                    )}
                    <div className="relative z-10 space-y-1">
                      <div className="text-xs font-serif-luxury tracking-widest text-[#d4c59d] uppercase">
                        TURATH ATELIER • CAIRO
                      </div>
                      <div className="text-[11px] text-[#f5f0e6] font-light">
                        معاينة واجهة الهيرو: نقش {theme.hero.enablePattern ? `${theme.hero.patternOpacity ?? 15}%` : 'معطّل'} &bull; تعتيم الفيديو {theme.hero.overlayOpacity ?? 70}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: HANDCRAFTED PRODUCTS SECTION */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'products') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        02
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          قسم وصفحة المنتجات الحرفية (Handcrafted Products Section)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          القسم الذي ينزلق فوق فيديو الهيرو على الصفحة الرئيسية وصفحة التصنيفات
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-products-section
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Background Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون الخلفية (Background Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), bgColor: e.target.value }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), bgColor: e.target.value }
                          }))}
                          className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Background Opacity */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية الخلفية (Section Opacity):</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), bgOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      <div className="flex items-center gap-1 pt-0.5">
                        {[0, 50, 80, 90, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), bgOpacity: val }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              ((theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6]'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border & Blur */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e6] font-semibold">إطار القسم والبلور:</span>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), borderColor: e.target.value }
                          }))}
                          className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), borderOpacity: Number(e.target.value) }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                      <label className="flex items-center justify-between pt-1 cursor-pointer">
                        <span className="text-[10px] text-[#9e9174]">بلور زجاجي (Backdrop Blur):</span>
                        <input
                          type="checkbox"
                          checked={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).backdropBlur}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), backdropBlur: e.target.checked }
                          }))}
                          className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Products Section Pattern Gradient Picker */}
                  <PatternGradientPicker
                    title="نقش وتدرج قسم المنتجات الحرفية (Products Section Pattern)"
                    description="نقش الأرابيسك أو المشربية أو النجمة داخل خلفية قسم المنتجات وصفحات العرض"
                    badge="Products Section"
                    enabled={theme.productsPage?.enablePattern || false}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), enablePattern: val }
                    }))}
                    patternUrl={theme.productsPage?.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), patternUrl: url }
                    }))}
                    opacity={theme.productsPage?.patternOpacity ?? 8}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), patternOpacity: op }
                    }))}
                    direction={theme.productsPage?.patternDirection || 'to bottom'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      productsPage: { ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!), patternDirection: dir }
                    }))}
                    previewBg={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor || '#000000'}
                    recommendedText="النسبة الموصى بها: 5% - 15% لمظهر فخم وهادئ لا يشتت الانتباه عن صور المنتجات"
                  />

                  {/* Mini Preview for Products Section */}
                  <div 
                    style={{
                      backgroundColor: hexToRgba((theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor, (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity),
                      borderColor: hexToRgba((theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderColor, (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderOpacity),
                    }}
                    className="relative rounded-xl overflow-hidden border p-5 flex flex-col items-center justify-center text-center shadow-inner"
                  >
                    {theme.productsPage?.enablePattern && (
                      <div 
                        className="absolute inset-0 pointer-events-none bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${theme.productsPage.patternUrl || '/turath_pattern_watermark.png'}')`,
                          opacity: (theme.productsPage.patternOpacity ?? 8) / 100,
                          WebkitMaskImage: getPatternMask(theme.productsPage.patternDirection || 'to bottom'),
                          maskImage: getPatternMask(theme.productsPage.patternDirection || 'to bottom'),
                        }}
                      />
                    )}
                    <span className="relative z-10 text-[10px] text-[#d4c59d] font-mono uppercase tracking-widest block">
                      OUR HANDCRAFTED COLLECTIONS
                    </span>
                    <h5 className="relative z-10 text-sm font-bold text-[#f5f0e6] font-serif-luxury mt-1">
                      تحف معمارية وهندسية فاخرة صُنعت خصيصاً
                    </h5>
                    <span className="relative z-10 text-[10px] text-[#9e9174] mt-1 font-mono">
                      خلفية: {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity}% &bull; نقش: {theme.productsPage?.enablePattern ? `${theme.productsPage.patternOpacity ?? 8}%` : 'معطّل'}
                    </span>
                  </div>
                </div>
              )}

              {/* SECTION 3: PRODUCT & PROJECT CARDS */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'cards') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        03
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          كروت وبطاقات المنتجات والمشاريع (.turath-card)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          البطاقة الشاملة لكل قطعة تشمل الصورة، العنوان، السعر والتفاصيل (منفصلة تماماً عن إطار الصورة)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-card
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Card Background Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون خلفية الكروت (Card Bg Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBgColor: e.target.value }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBgColor: e.target.value }
                          }))}
                          className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Card Background Opacity Slider */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية خلفية الكروت:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBgOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      <div className="flex items-center gap-1 pt-0.5">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBgOpacity: val }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6]'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card Border & Blur */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e6] font-semibold">إطار الكارت وشفافيته:</span>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBorderColor: e.target.value }
                          }))}
                          className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBorderOpacity: Number(e.target.value) }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                      <label className="flex items-center justify-between pt-1 cursor-pointer">
                        <span className="text-[10px] text-[#9e9174]">بلور زجاجي للكروت (Card Blur):</span>
                        <input
                          type="checkbox"
                          checked={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBackdropBlur !== false}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), cardBackdropBlur: e.target.checked }
                          }))}
                          className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Card Pattern Gradient Picker (Separated from photo container) */}
                  <PatternGradientPicker
                    title="نقش وتدرج بطاقات وكروت المنتجات (Card Specific Pattern)"
                    description="زخرفة مخصصة تظهر فقط على جسم الكارت الخارجي (.turath-card) دون تكرارها داخل إطار الصورة"
                    badge="Card Only Pattern"
                    enabled={(theme.containers?.enableCardPattern ?? theme.containers?.enablePattern) || false}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        enableCardPattern: val,
                        enablePattern: val,
                      }
                    }))}
                    patternUrl={theme.containers?.cardPatternUrl || theme.containers?.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        cardPatternUrl: url,
                        patternUrl: url,
                      }
                    }))}
                    opacity={theme.containers?.cardPatternOpacity ?? theme.containers?.patternOpacity ?? 12}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        cardPatternOpacity: op,
                        patternOpacity: op,
                      }
                    }))}
                    direction={theme.containers?.cardPatternDirection || theme.containers?.patternDirection || 'to bottom'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        cardPatternDirection: dir,
                        patternDirection: dir,
                      }
                    }))}
                    previewBg={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor || '#070706'}
                    recommendedText="النسبة الموصى بها: 8% - 16% لإضفاء نسيج أرابيسك راقٍ على كروت المنتجات"
                  />

                  {/* Simulated Product Card Live Preview */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                    <div 
                      style={{
                        backgroundColor: hexToRgba((theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor, (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100),
                        borderColor: hexToRgba((theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderColor, (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderOpacity),
                      }}
                      className="relative w-full max-w-sm rounded-xl border p-4 shadow-xl overflow-hidden"
                    >
                      {((theme.containers?.enableCardPattern ?? theme.containers?.enablePattern)) && (
                        <div 
                          className="absolute inset-0 pointer-events-none bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${theme.containers?.cardPatternUrl || theme.containers?.patternUrl || '/turath_pattern_watermark.png'}')`,
                            opacity: (theme.containers?.cardPatternOpacity ?? theme.containers?.patternOpacity ?? 12) / 100,
                            WebkitMaskImage: getPatternMask(theme.containers?.cardPatternDirection || 'to bottom'),
                            maskImage: getPatternMask(theme.containers?.cardPatternDirection || 'to bottom'),
                          }}
                        />
                      )}
                      <div className="relative z-10 flex gap-3 items-center">
                        <div className="w-16 h-16 rounded-lg bg-[#14141c] border border-[#d4c59d]/40 flex items-center justify-center text-xl overflow-hidden">
                          🏮
                        </div>
                        <div className="flex-1 space-y-1">
                          <span className="text-[9px] text-[#d4c59d] font-mono tracking-widest">SOLID BRASS</span>
                          <h6 className="text-xs font-bold text-[#f5f0e6]">ثريا نحاسية قاهرية مثقوبة</h6>
                          <div className="flex items-center justify-between text-[10px] text-[#9e9174]">
                            <span className="text-[#d4c59d] font-bold">18,500 EGP</span>
                            <span>شفافية الكارت: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: PHOTO CONTAINERS & FRAMES */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'photos') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        04
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          إطارات وحاويات الصور (.turath-photo-container)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          الصندوق والإطار المحيط بالصورة أو الفيديو الداخلي مباشرة
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-photo-container
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Container Background Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون حاوية الصور (Container Bg)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBg: e.target.value }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBg: e.target.value }
                          }))}
                          className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Container Opacity Slider */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية حاوية الصور:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBgOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      <div className="flex items-center gap-1 pt-0.5">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBgOpacity: val }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6]'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Container Border & Blur */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e6] font-semibold">إطار الحاوية وشفافيته:</span>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorder}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBorder: e.target.value }
                          }))}
                          className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBorderOpacity: Number(e.target.value) }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                      <label className="flex items-center justify-between pt-1 cursor-pointer">
                        <span className="text-[10px] text-[#9e9174]">بلور زجاجي للحاوية (Backdrop):</span>
                        <input
                          type="checkbox"
                          checked={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBackdropBlur !== false}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoContainerBackdropBlur: e.target.checked }
                          }))}
                          className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Photo Container Pattern Gradient Picker (Separated from Card) */}
                  <PatternGradientPicker
                    title="نقش وتدرج إطارات وحاويات الصور (Photo Container Pattern)"
                    description="زخرفة هندسية مخصصة تظهر فقط داخل إطار وحاوية الصورة مباشرة"
                    badge="Photo Frame Pattern"
                    enabled={theme.containers?.enablePhotoPattern || false}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        enablePhotoPattern: val,
                      }
                    }))}
                    patternUrl={theme.containers?.photoPatternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        photoPatternUrl: url,
                      }
                    }))}
                    opacity={theme.containers?.photoPatternOpacity ?? 10}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        photoPatternOpacity: op,
                      }
                    }))}
                    direction={theme.containers?.photoPatternDirection || 'to bottom'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      containers: {
                        ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                        photoPatternDirection: dir,
                      }
                    }))}
                    previewBg={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg || '#0a0a0d'}
                    recommendedText="النسبة الموصى بها: 8% - 14% للمظهر المعماري الهادئ خلف القطع النحاسية"
                  />

                  {/* Mini Preview for Photo Container */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                    <div 
                      style={{
                        backgroundColor: hexToRgba((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg, (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity),
                        borderColor: hexToRgba((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorder, (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity),
                      }}
                      className="relative w-48 h-32 rounded-xl border flex flex-col items-center justify-center overflow-hidden shadow-lg"
                    >
                      {theme.containers?.enablePhotoPattern && (
                        <div 
                          className="absolute inset-0 pointer-events-none bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${theme.containers?.photoPatternUrl || '/turath_pattern_watermark.png'}')`,
                            opacity: (theme.containers?.photoPatternOpacity ?? 10) / 100,
                            WebkitMaskImage: getPatternMask(theme.containers?.photoPatternDirection || 'to bottom'),
                            maskImage: getPatternMask(theme.containers?.photoPatternDirection || 'to bottom'),
                          }}
                        />
                      )}
                      <span className="relative z-10 text-2xl">📸</span>
                      <span className="relative z-10 text-[10px] text-[#d4c59d] font-mono mt-1">
                        شفافية الحاوية: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: DIRECT PHOTO BACKGROUND & OPACITY */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'directPhoto') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        05
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          خلفية وشفافية الصور المباشرة (Direct Photo Background & Artwork Opacity)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          اللون المباشر خلف القطعة داخل الصورة المفرغة، مع التحكم في شفافية الصورة نفسها
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      var(--photo-bg) &bull; var(--photo-opacity)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Direct Photo Background Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">
                        لون خلفية الصورة (Photo Direct Bg)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgColor || (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoBgColor: e.target.value }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgColor || (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoBgColor: e.target.value }
                          }))}
                          className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Direct Photo Background Opacity */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية خلفية الصورة:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoBgOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      <div className="flex items-center gap-1 pt-0.5">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoBgOpacity: val }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6]'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Artwork Opacity */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية الصورة نفسها:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoOpacity ?? 100}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: { ...(p.containers || DEFAULT_THEME_SETTINGS.containers!), photoOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      <p className="text-[10px] text-[#9e9174]">
                        تحديد درجة شفافية الصورة الأصلية ذاتها
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: CONTENT TEXT BOXES */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'textBoxes') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        06
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          مربعات ونصوص المحتوى والبيانات (.turath-textbox)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          المربعات النصية، البيانات الفنية، وبلوكات المواصفات في مختلف أرجاء الموقع
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-textbox
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Box Background */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون خلفية المربع النصي</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), boxBgColor: e.target.value }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), boxBgColor: e.target.value }
                          }))}
                          className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Box Border & Opacity */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e6] font-semibold">إطار المربع النصي:</span>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), boxBorderColor: e.target.value }
                          }))}
                          className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), boxBorderOpacity: Number(e.target.value) }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Box Pattern Gradient Picker */}
                  <PatternGradientPicker
                    title="نقش وتدرج مربعات النصوص (Text Box Pattern & Gradient)"
                    description="إضافة صورة أو نقش جرادينت خفيف خلف النصوص وبطاقات المعلومات مع التحكم في اتجاهه"
                    badge="Text Box Pattern"
                    enabled={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).enableGradientPhoto}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), enableGradientPhoto: val }
                    }))}
                    patternUrl={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), gradientPhotoUrl: url }
                    }))}
                    opacity={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoOpacity}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), gradientPhotoOpacity: op }
                    }))}
                    direction={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientDirection || 'to bottom'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      textBoxes: { ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!), gradientDirection: dir }
                    }))}
                    previewBg={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor}
                    recommendedText="النسبة الموصى بها: 4% - 10% حتى يظل النص فائق الوضوح ومريحاً للعين"
                  />

                  {/* Text Box Mini Live Preview */}
                  <div 
                    style={{
                      backgroundColor: hexToRgba((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor, 95),
                      borderColor: hexToRgba((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderColor, (theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderOpacity),
                    }}
                    className="relative rounded-xl border p-4 shadow-lg overflow-hidden"
                  >
                    {(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).enableGradientPhoto && (
                      <div 
                        className="absolute inset-0 pointer-events-none bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoUrl || '/turath_pattern_watermark.png'}')`,
                          opacity: ((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoOpacity) / 100,
                          WebkitMaskImage: getPatternMask((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientDirection || 'to bottom'),
                          maskImage: getPatternMask((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientDirection || 'to bottom'),
                        }}
                      />
                    )}
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] text-[#d4c59d] font-mono uppercase tracking-wider block">
                        AUTHENTIC HERITAGE SPECIFICATION
                      </span>
                      <p className="text-xs text-[#f5f0e6] leading-relaxed">
                        “نحاس أصلي ثقيل معالج بطبقة حماية تدوم لأجيال، مشكل ومثقوب يدوياً على أيدي أمهر فناني الجمالية.”
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 7: PRIMARY BUTTONS */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'primaryBtn') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        07
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          الأزرار الرئيسية (.turath-btn-primary)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          أزرار الدعوة للإجراء الأساسية (Explore Collections, View All, إلخ)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-btn-primary
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Primary Button Style */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">نمط الزر (Button Style)</label>
                      <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-[#d4c59d]/30">
                        {(['filled', 'outline', 'transparent'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              primaryButton: { ...p.primaryButton, style: st }
                            }))}
                            className={`flex-1 py-1 rounded text-xs capitalize transition-all ${
                              theme.primaryButton.style === st
                                ? 'bg-[#d4c59d] text-black font-bold shadow'
                                : 'text-[#9e9174] hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Primary Button Background & Opacity */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e6] font-semibold">خلفية الزر وشفافيتها:</span>
                        <span className="font-mono text-xs text-[#d4c59d] font-bold">
                          {theme.primaryButton.bgOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.primaryButton.bgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            primaryButton: { ...p.primaryButton, bgColor: e.target.value }
                          }))}
                          className="w-8 h-8 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={theme.primaryButton.bgOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            primaryButton: { ...p.primaryButton, bgOpacity: Number(e.target.value) }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Text & Border Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون النص والإطار</label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#9e9174]">نص:</span>
                          <input
                            type="color"
                            value={theme.primaryButton.textColor}
                            onChange={(e) => updateTheme((p) => ({
                              ...p,
                              primaryButton: { ...p.primaryButton, textColor: e.target.value }
                            }))}
                            className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#9e9174]">إطار:</span>
                          <input
                            type="color"
                            value={theme.primaryButton.borderColor}
                            onChange={(e) => updateTheme((p) => ({
                              ...p,
                              primaryButton: { ...p.primaryButton, borderColor: e.target.value }
                            }))}
                            className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Button Pattern Gradient Picker */}
                  <PatternGradientPicker
                    title="نقش وتدرج الأزرار الرئيسية (Primary Button Pattern)"
                    description="إضفاء نقش مائي فاخر ينساب فوق الأزرار الأساسية لإعطاء طابع يدوي أثري مميز"
                    badge="Button Pattern"
                    enabled={theme.primaryButton.enablePattern || false}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, enablePattern: val }
                    }))}
                    patternUrl={theme.primaryButton.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, patternUrl: url }
                    }))}
                    opacity={theme.primaryButton.patternOpacity ?? 25}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, patternOpacity: op }
                    }))}
                    direction={theme.primaryButton.patternDirection || '135deg'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, patternDirection: dir }
                    }))}
                    previewBg={theme.primaryButton.bgColor}
                    recommendedText="النسبة الموصى بها: 15% - 30% للمظهر الذهبي الفاخر"
                  />

                  {/* Button Live Preview */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      className="turath-btn-primary px-6 py-2.5 rounded-lg font-serif-luxury font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Explore Collections &rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 8: SECONDARY BUTTONS */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'secondaryBtn') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        08
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          الأزرار الثانوية (.turath-btn-secondary)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          أزرار الإجراءات التكميلية (Inquire on WhatsApp, Details, مشاركة، إلخ)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      .turath-btn-secondary
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Secondary Button Style */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">نمط الزر الثانوي</label>
                      <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-[#d4c59d]/30">
                        {(['filled', 'outline', 'transparent'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              secondaryButton: { ...p.secondaryButton, style: st }
                            }))}
                            className={`flex-1 py-1 rounded text-xs capitalize transition-all ${
                              theme.secondaryButton.style === st
                                ? 'bg-[#d4c59d] text-black font-bold shadow'
                                : 'text-[#9e9174] hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Button Background & Opacity */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e6] font-semibold">خلفية الزر وشفافيتها:</span>
                        <span className="font-mono text-xs text-[#d4c59d] font-bold">
                          {theme.secondaryButton.bgOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.secondaryButton.bgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            secondaryButton: { ...p.secondaryButton, bgColor: e.target.value }
                          }))}
                          className="w-8 h-8 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={theme.secondaryButton.bgOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            secondaryButton: { ...p.secondaryButton, bgOpacity: Number(e.target.value) }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Text & Border Color */}
                    <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-2">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون النص والإطار</label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#9e9174]">نص:</span>
                          <input
                            type="color"
                            value={theme.secondaryButton.textColor}
                            onChange={(e) => updateTheme((p) => ({
                              ...p,
                              secondaryButton: { ...p.secondaryButton, textColor: e.target.value }
                            }))}
                            className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#9e9174]">إطار:</span>
                          <input
                            type="color"
                            value={theme.secondaryButton.borderColor}
                            onChange={(e) => updateTheme((p) => ({
                              ...p,
                              secondaryButton: { ...p.secondaryButton, borderColor: e.target.value }
                            }))}
                            className="w-7 h-7 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Button Pattern Gradient Picker */}
                  <PatternGradientPicker
                    title="نقش وتدرج الأزرار الثانوية (Secondary Button Pattern)"
                    description="إضفاء نقش مائي فوق أزرار الإجراءات الثانوية لتعزيز الهوية المعمارية"
                    badge="Button Pattern"
                    enabled={theme.secondaryButton.enablePattern || false}
                    onToggle={(val) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, enablePattern: val }
                    }))}
                    patternUrl={theme.secondaryButton.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, patternUrl: url }
                    }))}
                    opacity={theme.secondaryButton.patternOpacity ?? 20}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, patternOpacity: op }
                    }))}
                    direction={theme.secondaryButton.patternDirection || '135deg'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, patternDirection: dir }
                    }))}
                    previewBg={theme.secondaryButton.bgColor}
                    recommendedText="النسبة الموصى بها: 10% - 25% لإضفاء لمسة فخمة بدون التأثير على قراءة النص"
                  />

                  {/* Button Live Preview */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      className="turath-btn-secondary px-6 py-2 rounded-lg font-serif-luxury text-xs tracking-wider flex items-center gap-2 border shadow"
                    >
                      <span>Inquire via WhatsApp &bull; استفسار</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 9: GLOBAL WEBSITE PAGE BACKGROUND */}
              {(gradientSectionFilter === 'all' || gradientSectionFilter === 'pageBg') && (
                <div className="p-5 rounded-2xl bg-[#111116] border border-[#d4c59d]/40 space-y-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4c59d]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] border border-[#d4c59d]/40 font-mono font-bold text-xs">
                        09
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                          خلفية الموقع العامة لكل الصفحات (Global Website Background)
                        </h4>
                        <p className="text-[11px] text-[#9e9174]">
                          باترن ونقش جرادينت يغطي خلفية الموقع بالكامل خلف كل الأقسام مع إمكانية تثبيته (Fixed Parallax)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4c59d] bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30 font-mono">
                      #turath-page-pattern-overlay
                    </span>
                  </div>

                  <PatternGradientPicker
                    title="نقش وتدرج خلفية صفحات الموقع ككل (Global Website Background Pattern)"
                    description="تطبيق خلفية ونقش جرادينت معماري فاخر يغطي خلفية صفحات الموقع ككل، مع إمكانية تثبيته والتحكم في اتجاهه وشفافيته بدقة"
                    badge="Whole Website"
                    allowFixed={true}
                    isFixed={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternFixed !== false}
                    onFixedChange={(fixed) => updateTheme((p) => ({
                      ...p,
                      pageBackground: {
                        ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                        patternFixed: fixed
                      }
                    }))}
                    enabled={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).enablePattern || false}
                    onToggle={(enabled) => updateTheme((p) => ({
                      ...p,
                      pageBackground: {
                        ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                        enablePattern: enabled
                      }
                    }))}
                    patternUrl={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      pageBackground: {
                        ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                        patternUrl: url
                      }
                    }))}
                    opacity={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternOpacity ?? 5}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      pageBackground: {
                        ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                        patternOpacity: op
                      }
                    }))}
                    direction={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternDirection || 'to bottom'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      pageBackground: {
                        ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                        patternDirection: dir
                      }
                    }))}
                    previewBg="#050507"
                    recommendedText="النسبة الموصى بها: 3% - 8% لمظهر هادئ جداً في الخلفية العامة دون تشتيت"
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 1: BUTTONS (Primary & Secondary) */}
          {/* ========================================================== */}
          {activeTab === 'buttons' && (
            <div className="space-y-8">
              
              {/* PRIMARY BUTTON SETTINGS */}
              <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-5">
                <div className="flex items-center justify-between border-b border-[#d4c59d]/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider">
                      1. الزر الرئيسي (Primary Button)
                    </h3>
                    <p className="text-[11px] text-[#9e9174]">
                      يتحكم في زر "Explore Collections", "View All", وأزرار التفاعل الأساسية
                    </p>
                  </div>

                  {/* Button Style Selector */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-[#d4c59d]/30">
                    <span className="text-[10px] text-[#9e9174] font-mono px-2 uppercase">Style:</span>
                    {(['filled', 'outline', 'transparent'] as const).map((styleOpt) => (
                      <button
                        key={styleOpt}
                        type="button"
                        onClick={() => updateTheme((p) => ({
                          ...p,
                          primaryButton: { 
                            ...p.primaryButton, 
                            style: styleOpt,
                            bgOpacity: styleOpt === 'outline' || styleOpt === 'transparent' ? 0 : (p.primaryButton.bgOpacity === 0 ? 100 : p.primaryButton.bgOpacity),
                            textColor: styleOpt === 'outline' ? (p.primaryButton.borderColor || '#d4c59d') : (styleOpt === 'filled' && p.primaryButton.bgColor === '#d4c59d' ? '#000000' : p.primaryButton.textColor),
                          }
                        }))}
                        className={`px-2.5 py-1 rounded text-xs capitalize transition-all cursor-pointer ${
                          theme.primaryButton.style === styleOpt
                            ? 'bg-[#d4c59d] text-black font-bold shadow'
                            : 'text-[#9e9174] hover:text-white'
                        }`}
                      >
                        {styleOpt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Background Color & Opacity */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون الخلفية (Background)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryButton.bgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, bgColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryButton.bgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, bgColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>

                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#9e9174]">
                        <span>شفافية الخلفية (Opacity)</span>
                        <span className="font-mono text-[#d4c59d]">{theme.primaryButton.bgOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={theme.primaryButton.bgOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, bgOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون النص (Text Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryButton.textColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, textColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryButton.textColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, textColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Border Color & Opacity */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون الإطار (Border Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryButton.borderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, borderColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryButton.borderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, borderColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>

                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#9e9174]">
                        <span>شفافية الإطار (Border Opacity)</span>
                        <span className="font-mono text-[#d4c59d]">{theme.primaryButton.borderOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={theme.primaryButton.borderOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, borderOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Hover Colors */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">خلفية التمرير (Hover Bg)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryButton.hoverBgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, hoverBgColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryButton.hoverBgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, hoverBgColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">نص التمرير (Hover Text)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryButton.hoverTextColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, hoverTextColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryButton.hoverTextColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, hoverTextColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">إطار التمرير (Hover Border)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryButton.hoverBorderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, hoverBorderColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryButton.hoverBorderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          primaryButton: { ...p.primaryButton, hoverBorderColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* PRIMARY BUTTON PATTERN & GRADIENT */}
                <div className="pt-2 border-t border-white/10">
                  <PatternGradientPicker
                    title="نقش وتدرج الزر الرئيسي (Primary Button Pattern & Gradient)"
                    description="إضافة زخرفة الأرابيسك أو المشربية أو أي صورة مخصصة فوق الزر الرئيسي مع التحكم الكامل بالاتجاه والشفافية"
                    badge="Primary Button"
                    enabled={theme.primaryButton.enablePattern || false}
                    onToggle={(enabled) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, enablePattern: enabled }
                    }))}
                    patternUrl={theme.primaryButton.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, patternUrl: url }
                    }))}
                    opacity={theme.primaryButton.patternOpacity ?? 25}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, patternOpacity: op }
                    }))}
                    direction={theme.primaryButton.patternDirection || '135deg'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      primaryButton: { ...p.primaryButton, patternDirection: dir }
                    }))}
                    previewBg={theme.primaryButton.bgColor || '#d4c59d'}
                    recommendedText="النسبة الموصى بها: 15% - 35% لإظهار النقش بشكل فاخر فوق لون الزر"
                  />
                </div>
              </div>

              {/* SECONDARY BUTTON SETTINGS */}
              <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-5">
                <div className="flex items-center justify-between border-b border-[#d4c59d]/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider">
                      2. الزر الثانوي (Secondary Button)
                    </h3>
                    <p className="text-[11px] text-[#9e9174]">
                      يتحكم في زر "Custom Manufacturing", "View Dossier", وأزرار التصفح الثانوية
                    </p>
                  </div>

                  {/* Button Style Selector */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-[#d4c59d]/30">
                    <span className="text-[10px] text-[#9e9174] font-mono px-2 uppercase">Style:</span>
                    {(['filled', 'outline', 'transparent'] as const).map((styleOpt) => (
                      <button
                        key={styleOpt}
                        type="button"
                        onClick={() => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { 
                            ...p.secondaryButton, 
                            style: styleOpt,
                            bgOpacity: styleOpt === 'outline' || styleOpt === 'transparent' ? 0 : (p.secondaryButton.bgOpacity === 0 ? 80 : p.secondaryButton.bgOpacity),
                            textColor: styleOpt === 'outline' ? (p.secondaryButton.borderColor || '#d4c59d') : p.secondaryButton.textColor,
                          }
                        }))}
                        className={`px-2.5 py-1 rounded text-xs capitalize transition-all cursor-pointer ${
                          theme.secondaryButton.style === styleOpt
                            ? 'bg-[#d4c59d] text-black font-bold shadow'
                            : 'text-[#9e9174] hover:text-white'
                        }`}
                      >
                        {styleOpt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Background Color & Opacity */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون الخلفية (Background)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryButton.bgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, bgColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.secondaryButton.bgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, bgColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>

                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#9e9174]">
                        <span>شفافية الخلفية (Opacity)</span>
                        <span className="font-mono text-[#d4c59d]">{theme.secondaryButton.bgOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={theme.secondaryButton.bgOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, bgOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون النص (Text Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryButton.textColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, textColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.secondaryButton.textColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, textColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Border Color & Opacity */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون الإطار (Border Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryButton.borderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, borderColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.secondaryButton.borderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, borderColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>

                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#9e9174]">
                        <span>شفافية الإطار (Border Opacity)</span>
                        <span className="font-mono text-[#d4c59d]">{theme.secondaryButton.borderOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={theme.secondaryButton.borderOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, borderOpacity: Number(e.target.value) }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Hover Colors */}
                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">خلفية التمرير (Hover Bg)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryButton.hoverBgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, hoverBgColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.secondaryButton.hoverBgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, hoverBgColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">نص التمرير (Hover Text)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryButton.hoverTextColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, hoverTextColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.secondaryButton.hoverTextColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, hoverTextColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">إطار التمرير (Hover Border)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryButton.hoverBorderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, hoverBorderColor: e.target.value }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.secondaryButton.hoverBorderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          secondaryButton: { ...p.secondaryButton, hoverBorderColor: e.target.value }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* SECONDARY BUTTON PATTERN & GRADIENT */}
                <div className="pt-2 border-t border-white/10">
                  <PatternGradientPicker
                    title="نقش وتدرج الزر الثانوي (Secondary Button Pattern & Gradient)"
                    description="إضافة زخرفة الأرابيسك أو المشربية أو أي صورة مخصصة فوق الزر الثانوي مع التحكم الكامل بالاتجاه والشفافية"
                    badge="Secondary Button"
                    enabled={theme.secondaryButton.enablePattern || false}
                    onToggle={(enabled) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, enablePattern: enabled }
                    }))}
                    patternUrl={theme.secondaryButton.patternUrl || '/turath_pattern_watermark.png'}
                    onPatternUrlChange={(url) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, patternUrl: url }
                    }))}
                    opacity={theme.secondaryButton.patternOpacity ?? 20}
                    onOpacityChange={(op) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, patternOpacity: op }
                    }))}
                    direction={theme.secondaryButton.patternDirection || '135deg'}
                    onDirectionChange={(dir) => updateTheme((p) => ({
                      ...p,
                      secondaryButton: { ...p.secondaryButton, patternDirection: dir }
                    }))}
                    previewBg={theme.secondaryButton.bgColor || '#000000'}
                    recommendedText="النسبة الموصى بها: 10% - 25% لإضفاء لمسة فخمة بدون التأثير على قراءة النص"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: CONTAINERS & PHOTO FRAMES */}
          {/* ========================================================== */}
          {/* ========================================================== */}
          {/* TAB: CONTAINERS & PHOTO FRAMES */}
          {/* ========================================================== */}
          {activeTab === 'containers' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-4 rounded-xl bg-[#111116] border border-[#d4c59d]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d4c59d]" />
                    <span>التحكم في شفافية خلفية وحاويات الصور (Photo & Container Opacity)</span>
                  </h3>
                  <p className="text-[11px] text-[#9e9174] mt-0.5">
                    تحكم شامل في شفافية خلفية الصور، شفافية صناديق وحاويات الصور، وشفافية كروت وبطاقات المنتجات والأقسام
                  </p>
                </div>
              </div>

              {/* 3 Main Control Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. PHOTO DIRECT BACKGROUND & OPACITY (شفافية خلفية الصور) */}
                <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-4 flex flex-col justify-between shadow-lg">
                  <div className="space-y-4">
                    <div className="border-b border-[#d4c59d]/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#d4c59d]" />
                        <h4 className="text-xs font-bold text-[#f5f0e6] uppercase tracking-wider">
                          1. شفافية خلفية الصور (Photo Background)
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#9e9174] mt-1 leading-relaxed">
                        خلفية الصورة المباشرة خلف القطعة (تظهر في الصور المفرغة أو الهوامش)
                      </p>
                    </div>

                    {/* Color Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون خلفية الصورة (Background Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgColor || (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              photoBgColor: e.target.value
                            }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgColor || (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              photoBgColor: e.target.value
                            }
                          }))}
                          className="w-24 px-2 py-1.5 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Photo Background Opacity Slider */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية خلفية الصور:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: {
                            ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                            photoBgOpacity: Number(e.target.value)
                          }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              containers: {
                                ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                                photoBgOpacity: val
                              }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#252530]'
                            }`}
                          >
                            {val === 0 ? 'شفاف 0%' : val === 100 ? 'صلب 100%' : `${val}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo / Artwork Opacity */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#9e9174]">شفافية الصورة نفسها (Artwork Opacity):</span>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoOpacity ?? 100}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: {
                            ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                            photoOpacity: Number(e.target.value)
                          }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-[#9e9174] bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    💡 عند اختيار <strong>0% شفاف</strong>، ستندمج الصور المفرغة تماماً مع لون الحاوية أو الكارت خلفها بدون أي خلفية صلبة.
                  </p>
                </div>

                {/* 2. PHOTO CONTAINER BOX & FRAME (شفافية حاوية الصور) */}
                <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-4 flex flex-col justify-between shadow-lg">
                  <div className="space-y-4">
                    <div className="border-b border-[#d4c59d]/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#d4c59d]" />
                        <h4 className="text-xs font-bold text-[#f5f0e6] uppercase tracking-wider">
                          2. شفافية حاوية الصور (Photo Container)
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#9e9174] mt-1 leading-relaxed">
                        صندوق وإطار الصورة المحيط بكل صورة أو فيديو (.turath-photo-container)
                      </p>
                    </div>

                    {/* Container Background Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون حاوية الصورة (Container Bg)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              photoContainerBg: e.target.value
                            }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              photoContainerBg: e.target.value
                            }
                          }))}
                          className="w-24 px-2 py-1.5 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Photo Container Opacity Slider */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية حاوية الصور:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: {
                            ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                            photoContainerBgOpacity: Number(e.target.value)
                          }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              containers: {
                                ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                                photoContainerBgOpacity: val
                              }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#252530]'
                            }`}
                          >
                            {val === 0 ? 'شفاف 0%' : val === 100 ? 'صلب 100%' : `${val}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo Container Border & Opacity */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#f5f0e6]">إطار حاوية الصورة (Border):</label>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorder}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              photoContainerBorder: e.target.value
                            }
                          }))}
                          className="w-8 h-8 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5 flex-shrink-0"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              photoContainerBorderOpacity: Number(e.target.value)
                            }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Container Backdrop Blur Toggle */}
                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                      <span className="text-[11px] text-[#f5f0e6]">تأثير الزجاج الضبابي للحاوية (Backdrop Blur)</span>
                      <input
                        type="checkbox"
                        checked={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBackdropBlur !== false}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: {
                            ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                            photoContainerBackdropBlur: e.target.checked
                          }
                        }))}
                        className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] text-[#9e9174] bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    💡 يمنح إطار وحاوية الصورة مظهر زجاجي شفاف فاخر (Frosted Glass) عند تقليل الشفافية وتفعيل الضبابية.
                  </p>
                </div>

                {/* 3. CARD & SHOWCASE WRAPPER (شفافية بطاقات وكروت المنتجات بالكامل) */}
                <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-4 flex flex-col justify-between shadow-lg">
                  <div className="space-y-4">
                    <div className="border-b border-[#d4c59d]/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#d4c59d]" />
                        <h4 className="text-xs font-bold text-[#f5f0e6] uppercase tracking-wider">
                          3. شفافية كروت المنتجات (Card Containers)
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#9e9174] mt-1 leading-relaxed">
                        بطاقة المنتج بالكامل (.turath-card) الحاضنة للصورة والتفاصيل
                      </p>
                    </div>

                    {/* Card Background Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#f5f0e6] block">لون خلفية الكروت (Card Bg Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              cardBgColor: e.target.value
                            }
                          }))}
                          className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              cardBgColor: e.target.value
                            }
                          }))}
                          className="w-24 px-2 py-1.5 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                        />
                      </div>
                    </div>

                    {/* Card Background Opacity Slider */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#f5f0e6]">شفافية خلفية الكروت:</span>
                        <span className="font-mono text-xs font-bold text-[#d4c59d] px-2 py-0.5 rounded bg-black/60 border border-[#d4c59d]/30">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: {
                            ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                            cardBgOpacity: Number(e.target.value)
                          }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateTheme((p) => ({
                              ...p,
                              containers: {
                                ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                                cardBgOpacity: val
                              }
                            }))}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100) === val
                                ? 'bg-[#d4c59d] text-black shadow'
                                : 'bg-[#181820] text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#252530]'
                            }`}
                          >
                            {val === 0 ? 'شفاف 0%' : val === 100 ? 'صلب 100%' : `${val}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card Border & Opacity */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#f5f0e6]">إطار الكروت (Card Border):</label>
                        <span className="font-mono text-xs text-[#d4c59d]">
                          {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderOpacity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderColor}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              cardBorderColor: e.target.value
                            }
                          }))}
                          className="w-8 h-8 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5 flex-shrink-0"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            containers: {
                              ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                              cardBorderOpacity: Number(e.target.value)
                            }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Card Backdrop Blur Toggle */}
                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer">
                      <span className="text-[11px] text-[#f5f0e6]">تأثير الزجاج الضبابي للكروت (Card Blur)</span>
                      <input
                        type="checkbox"
                        checked={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBackdropBlur !== false}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          containers: {
                            ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                            cardBackdropBlur: e.target.checked
                          }
                        }))}
                        className="accent-[#d4c59d] w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] text-[#9e9174] bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    💡 يتيح لك جعل كروت وبطاقات المنتجات شبه شفافة لتظهر خلفية الصفحة المعمارية والسينمائية من خلالها.
                  </p>
                </div>
              </div>

              {/* SEPARATED PATTERN 1: FOR CARDS & WRAPPERS */}
              <PatternGradientPicker
                title="نقش وتدرج كروت وبطاقات المنتجات والمشاريع (Card Specific Pattern)"
                description="إضافة زخرفة الأرابيسك أو المشربية فوق كروت وبطاقات المنتجات (.turath-card) بشكل منفصل تماماً"
                badge="Card Pattern"
                enabled={(theme.containers?.enableCardPattern ?? theme.containers?.enablePattern) || false}
                onToggle={(enabled) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    enableCardPattern: enabled,
                    enablePattern: enabled,
                  }
                }))}
                patternUrl={theme.containers?.cardPatternUrl || theme.containers?.patternUrl || '/turath_pattern_watermark.png'}
                onPatternUrlChange={(url) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    cardPatternUrl: url,
                    patternUrl: url,
                  }
                }))}
                opacity={theme.containers?.cardPatternOpacity ?? theme.containers?.patternOpacity ?? 12}
                onOpacityChange={(op) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    cardPatternOpacity: op,
                    patternOpacity: op,
                  }
                }))}
                direction={theme.containers?.cardPatternDirection || theme.containers?.patternDirection || 'to bottom'}
                onDirectionChange={(dir) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    cardPatternDirection: dir,
                    patternDirection: dir,
                  }
                }))}
                previewBg={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor || '#070706'}
                recommendedText="النسبة الموصى بها: 8% - 16% لإضفاء نسيج معماري هادئ على كروت المنتجات"
              />

              {/* SEPARATED PATTERN 2: FOR PHOTO CONTAINERS & FRAMES */}
              <PatternGradientPicker
                title="نقش وتدرج إطارات وحاويات الصور (Photo Container Specific Pattern)"
                description="إضافة زخرفة الأرابيسك أو المشربية داخل إطار وصندوق الصورة (.turath-photo-container) بشكل منفصل"
                badge="Photo Frame Pattern"
                enabled={theme.containers?.enablePhotoPattern || false}
                onToggle={(enabled) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    enablePhotoPattern: enabled,
                  }
                }))}
                patternUrl={theme.containers?.photoPatternUrl || '/turath_pattern_watermark.png'}
                onPatternUrlChange={(url) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    photoPatternUrl: url,
                  }
                }))}
                opacity={theme.containers?.photoPatternOpacity ?? 10}
                onOpacityChange={(op) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    photoPatternOpacity: op,
                  }
                }))}
                direction={theme.containers?.photoPatternDirection || 'to bottom'}
                onDirectionChange={(dir) => updateTheme((p) => ({
                  ...p,
                  containers: {
                    ...(p.containers || DEFAULT_THEME_SETTINGS.containers!),
                    photoPatternDirection: dir,
                  }
                }))}
                previewBg={(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg || '#0a0a0d'}
                recommendedText="النسبة الموصى بها: 8% - 14% للمظهر المعماري الهادئ داخل إطار الصورة"
              />

              {/* LIVE SIMULATED PREVIEW OF PHOTO & CONTAINER OPACITIES */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14141c] to-[#0a0a0f] border-2 border-[#d4c59d]/40 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#d4c59d]/20 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4c59d]" />
                    <h4 className="text-xs font-bold text-[#f5f0e6] uppercase tracking-wider font-serif-luxury">
                      معاينة حية تفاعلية للشفافية (Interactive Live Opacity Studio)
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#d4c59d] font-mono bg-black/60 px-2.5 py-1 rounded border border-[#d4c59d]/30">
                    خلفية الصور: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}% &bull; الحاوية: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}% &bull; الكارت: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}%
                  </span>
                </div>

                {/* Simulated Web Background with Pattern */}
                <div className="relative p-6 sm:p-8 rounded-xl bg-[#050507] border border-white/10 overflow-hidden">
                  {/* Decorative background grid & gold glow to vividly display transparency */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,197,157,0.22)_0%,transparent_70%)] pointer-events-none" />
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4c59d_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

                  <div className="max-w-sm mx-auto relative z-10">
                    {/* Simulated TiltCard / Product Card */}
                    <div 
                      style={{
                        backgroundColor: hexToRgba(
                          (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgColor,
                          (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100
                        ),
                        borderColor: hexToRgba(
                          (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderColor,
                          (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBorderOpacity
                        ),
                        backdropFilter: ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100) < 100 && (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBackdropBlur !== false ? 'blur(16px)' : 'none',
                        WebkitBackdropFilter: ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100) < 100 && (theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBackdropBlur !== false ? 'blur(16px)' : 'none',
                      }}
                      className="relative rounded-2xl border overflow-hidden shadow-2xl p-4 space-y-4 transition-all duration-300"
                    >
                      {/* Card Pattern Gradient Overlay */}
                      {theme.containers?.enablePattern && (
                        <div 
                          style={{
                            backgroundImage: `url('${theme.containers.patternUrl || '/turath_pattern_watermark.png'}')`,
                            opacity: (theme.containers.patternOpacity ?? 12) / 100,
                            WebkitMaskImage: getPatternMask(theme.containers.patternDirection || 'to bottom'),
                            maskImage: getPatternMask(theme.containers.patternDirection || 'to bottom'),
                          }}
                          className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                        />
                      )}
                      {/* Photo Container Frame */}
                      <div 
                        style={{
                          backgroundColor: hexToRgba(
                            (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg,
                            (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity
                          ),
                          borderColor: hexToRgba(
                            (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorder,
                            (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity
                          ),
                          backdropFilter: (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity < 100 && (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBackdropBlur !== false ? 'blur(12px)' : 'none',
                          WebkitBackdropFilter: (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity < 100 && (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBackdropBlur !== false ? 'blur(12px)' : 'none',
                        }}
                        className="relative w-full aspect-[4/3] rounded-xl border overflow-hidden flex items-center justify-center p-3 transition-all duration-300"
                      >
                        {/* Direct Photo Background & Image */}
                        <div 
                          style={{
                            backgroundColor: hexToRgba(
                              (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgColor || (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg,
                              (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100
                            ),
                          }}
                          className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center relative transition-all duration-300"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                            alt="Sample Architectural Brass"
                            style={{
                              opacity: ((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoOpacity ?? 100) / 100,
                            }}
                            className="w-full h-full object-cover transition-opacity duration-300"
                          />
                          <span className="absolute bottom-2 right-2 text-[9px] font-mono font-bold bg-black/80 border border-[#d4c59d]/40 text-[#d4c59d] px-1.5 py-0.5 rounded shadow">
                            خلفية الصورة: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}%
                          </span>
                        </div>

                        <span className="absolute top-2 left-2 text-[9px] font-mono font-bold bg-[#d4c59d] text-black px-2 py-0.5 rounded shadow">
                          حاوية الصور: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}%
                        </span>
                      </div>

                      {/* Card Details */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-serif-luxury font-bold text-[#f5f0e6]">
                            Arabesque Brass Masterwork
                          </span>
                          <span className="text-[10px] font-mono text-[#d4c59d] px-1.5 py-0.5 rounded bg-black/50 border border-[#d4c59d]/20">
                            شفافية الكارت: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).cardBgOpacity ?? 100}%
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9e9174]">
                          Hand-pierced pure Egyptian brass masterwork crafted in Historic Cairo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB: TEXT BOXES & GRADIENT PHOTO / WATERMARK */}
          {/* ========================================================== */}
          {activeTab === 'textBoxes' && (
            <div className="space-y-6">
              {/* Pattern Gradient Picker for Text Boxes */}
              <PatternGradientPicker
                title="نقش وتدرج مربعات النصوص (Text Boxes Pattern & Gradient)"
                description="إضافة أو إزالة نقش الأرابيسك / الجرادينت داخل مربعات النصوص وحاويات الكتابة مع التحكم بالاتجاه والشفافية بدقة"
                badge="Text Boxes"
                enabled={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).enableGradientPhoto}
                onToggle={(enabled) => updateTheme((p) => ({
                  ...p,
                  textBoxes: {
                    ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                    enableGradientPhoto: enabled
                  }
                }))}
                patternUrl={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoUrl || '/turath_pattern_watermark.png'}
                onPatternUrlChange={(url) => updateTheme((p) => ({
                  ...p,
                  textBoxes: {
                    ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                    gradientPhotoUrl: url
                  }
                }))}
                opacity={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoOpacity ?? 6}
                onOpacityChange={(op) => updateTheme((p) => ({
                  ...p,
                  textBoxes: {
                    ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                    gradientPhotoOpacity: op
                  }
                }))}
                direction={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientDirection || 'to bottom'}
                onDirectionChange={(dir) => updateTheme((p) => ({
                  ...p,
                  textBoxes: {
                    ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                    gradientDirection: dir
                  }
                }))}
                previewBg={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor || '#0c0b0e'}
                recommendedText="النسبة الموصى بها: 4% - 10% لتبقى النصوص مقروءة وواضحة جداً"
              />

              {/* Text Box Background & Border Colors */}
              <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-4 shadow-md">
                <div className="border-b border-[#d4c59d]/20 pb-2.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#d4c59d] uppercase tracking-wider font-serif-luxury">
                    ألوان خلفية وإطار مربعات النصوص (Box Background & Border)
                  </h4>
                  <p className="text-[11px] text-[#9e9174] mt-0.5">
                    التحكم في اللون المصمت للخلفية ولون وشفافية الإطار المحيط بمربعات النصوص
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Text Box Bg Color */}
                  <div className="p-3.5 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">لون خلفية المربع (Box Background)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          textBoxes: {
                            ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                            boxBgColor: e.target.value
                          }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          textBoxes: {
                            ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                            boxBgColor: e.target.value
                          }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Text Box Border Color & Opacity */}
                  <div className="p-3.5 bg-black/50 rounded-lg border border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">إطار مربع النص (Box Border)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          textBoxes: {
                            ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                            boxBorderColor: e.target.value
                          }
                        }))}
                        className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          textBoxes: {
                            ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                            boxBorderColor: e.target.value
                          }
                        }))}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                    </div>

                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#9e9174]">
                        <span>شفافية الإطار</span>
                        <span className="font-mono text-[#d4c59d]">{(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderOpacity}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          textBoxes: {
                            ...(p.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!),
                            boxBorderOpacity: Number(e.target.value)
                          }
                        }))}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: GLOBAL TEXT & TYPOGRAPHY TOKENS */}
          {/* ========================================================== */}
          {activeTab === 'text' && (
            <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-5">
              <div className="border-b border-[#d4c59d]/20 pb-3">
                <h3 className="text-sm font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider">
                  الألوان الدلالية للنصوص (Semantic Typography Colors)
                </h3>
                <p className="text-[11px] text-[#9e9174]">
                  تتحكم في ألوان العناوين، نصوص الفقرات، النصوص الثانوية، وروابط الموقع مع الحفاظ الكامل على نمط ونوع الخط الأصلي
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Heading Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">لون العناوين (Headings)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.text.headingColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, headingColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.text.headingColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, headingColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Body Text Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">نص الفقرات الأساسية (Body Text)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.text.bodyColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, bodyColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.text.bodyColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, bodyColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Secondary Text Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">النصوص الفرعية (Secondary)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.text.secondaryColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, secondaryColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.text.secondaryColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, secondaryColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Muted Text Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">النصوص الخافتة (Muted Text)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.text.mutedColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, mutedColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.text.mutedColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, mutedColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Link Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">لون الروابط (Link Color)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.text.linkColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, linkColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.text.linkColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, linkColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Link Hover Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">تمرير الروابط (Link Hover)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.text.linkHoverColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, linkHoverColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.text.linkHoverColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        text: { ...p.text, linkHoverColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: HERO TEXT */}
          {/* ========================================================== */}
          {activeTab === 'hero' && (
            <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-5">
              <div className="border-b border-[#d4c59d]/20 pb-3">
                <h3 className="text-sm font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider">
                  ألوان نصوص الواجهة الرئيسية (Hero Section Colors)
                </h3>
                <p className="text-[11px] text-[#9e9174]">
                  تخصيص ألوان العنوان الرئيسي، الوصف، والكلمات المميزة في واجهة الفيديو السينمائية
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Hero Heading Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">العنوان الرئيسي (Hero Heading)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.hero.heroHeadingColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        hero: { ...p.hero, heroHeadingColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.hero.heroHeadingColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        hero: { ...p.hero, heroHeadingColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Hero Body Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">وصف الواجهة (Hero Body)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.hero.heroBodyColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        hero: { ...p.hero, heroBodyColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.hero.heroBodyColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        hero: { ...p.hero, heroBodyColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Hero Accent Color */}
                <div className="p-3 bg-black/50 rounded-lg border border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">الكلمة الذهبية المميزة (Hero Accent)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.hero.heroAccentColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        hero: { ...p.hero, heroAccentColor: e.target.value }
                      }))}
                      className="w-9 h-9 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.hero.heroAccentColor}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        hero: { ...p.hero, heroAccentColor: e.target.value }
                      }))}
                      className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 6: OUR HANDCRAFTED PRODUCTS (Page & Section) */}
          {/* ========================================================== */}
          {activeTab === 'productsPage' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#111116] border border-[#d4c59d]/30 space-y-5">
                <div className="border-b border-[#d4c59d]/20 pb-3">
                  <h3 className="text-sm font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#d4c59d]" />
                    <span>قسم وصفحة المنتجات الحرفية (Our Handcrafted Products)</span>
                  </h3>
                  <p className="text-[11px] text-[#9e9174] mt-1">
                    التحكم الكامل في لون الخلفية، درجة الشفافية (Opacity)، وتأثير البلور الزجاجي لقسم المنتجات الذي ينزلق فوق فيديو الهيرو وصفحات المنتجات
                  </p>
                </div>

                {/* Preset Quick Colors */}
                <div className="p-4 bg-black/60 rounded-xl border border-[#d4c59d]/20 space-y-2.5">
                  <label className="text-xs font-semibold text-[#f5f0e6] block">
                    ألوان فاخرة سريعة مقترحة (Curated Luxury Palettes):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Pure Obsidian (أسود حالك)', color: '#000000', opacity: 100 },
                      { name: 'Cinematic Glass (زجاجي سينمائي 85%)', color: '#000000', opacity: 85 },
                      { name: 'Smoky Charcoal (رمادي فحمي)', color: '#0c0c10', opacity: 90 },
                      { name: 'Heritage Deep Bronze (برونز عتيق)', color: '#16120b', opacity: 95 },
                      { name: 'Mamluk Gold Shadow (ظل ذهبي داكن)', color: '#1b170c', opacity: 90 },
                      { name: 'Midnight Nile (ليلي نيلي)', color: '#060a12', opacity: 92 },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => updateTheme((p) => ({
                          ...p,
                          productsPage: {
                            ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                            bgColor: preset.color,
                            bgOpacity: preset.opacity,
                            backdropBlur: preset.opacity < 100,
                          }
                        }))}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4c59d] bg-black/40 text-xs flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="text-[#e6d8b5] text-[11px]">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Background Color & Hex */}
                  <div className="p-4 bg-black/50 rounded-xl border border-white/5 space-y-3">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">
                      لون خلفية قسم وصفحة المنتجات (Background Color)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          productsPage: {
                            ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                            bgColor: e.target.value
                          }
                        }))}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          productsPage: {
                            ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                            bgColor: e.target.value
                          }
                        }))}
                        className="w-28 px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-md text-xs font-mono text-center uppercase text-[#f5f0e6]"
                      />
                      <span className="text-xs text-[#9e9174]">HEX</span>
                    </div>

                    <p className="text-[11px] text-[#9e9174] leading-relaxed">
                      يتحكم في لون خلفية قسم "Our Handcrafted Products" على الصفحة الرئيسية وصفحة التصنيفات والمنتجات.
                    </p>
                  </div>

                  {/* Background Opacity Slider */}
                  <div className="p-4 bg-black/50 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#f5f0e6]">
                        درجة الشفافية (Background Opacity)
                      </label>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/30 font-bold">
                        {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity}
                      onChange={(e) => updateTheme((p) => ({
                        ...p,
                        productsPage: {
                          ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                          bgOpacity: Number(e.target.value)
                        }
                      }))}
                      className="w-full accent-[#d4c59d] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-[#9e9174]">
                      <span>0% (شفاف تماماً - Transparent)</span>
                      <span>50%</span>
                      <span>100% (معتم تماماً - Opaque)</span>
                    </div>

                    <p className="text-[11px] text-[#9e9174] leading-relaxed">
                      💡 نصيحة: تعيين الشفافية بين 80% و 95% يعطي مظهراً فخماً وشفافاً يُظهر فيديو الهيرو من خلف المنتجات أثناء التمرير.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                  {/* Backdrop Blur Toggle */}
                  <div className="p-4 bg-black/50 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-semibold text-[#f5f0e6] block">
                          تأثير البلور الزجاجي (Backdrop Blur)
                        </label>
                        <p className="text-[11px] text-[#9e9174]">
                          تطبيق تأثير الزجاج المغبش الفاخر (Glassmorphism) على العناصر والفيديو خلف القسم
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateTheme((p) => ({
                          ...p,
                          productsPage: {
                            ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                            backdropBlur: !(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).backdropBlur
                          }
                        }))}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).backdropBlur
                            ? 'bg-[#d4c59d]'
                            : 'bg-white/10'
                        }`}
                      >
                        <div 
                          className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                            (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).backdropBlur
                              ? 'right-1'
                              : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Section Border Color & Opacity */}
                  <div className="p-4 bg-black/50 rounded-xl border border-white/5 space-y-3">
                    <label className="text-xs font-semibold text-[#f5f0e6] block">
                      لون وشفافية إطار القسم (Border Accent)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          productsPage: {
                            ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                            borderColor: e.target.value
                          }
                        }))}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderColor}
                        onChange={(e) => updateTheme((p) => ({
                          ...p,
                          productsPage: {
                            ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                            borderColor: e.target.value
                          }
                        }))}
                        className="w-28 px-3 py-2 bg-[#1a1a20] border border-white/10 rounded-md text-xs font-mono text-center uppercase text-[#f5f0e6]"
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderOpacity}
                          onChange={(e) => updateTheme((p) => ({
                            ...p,
                            productsPage: {
                              ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                              borderOpacity: Number(e.target.value)
                            }
                          }))}
                          className="w-full accent-[#d4c59d] cursor-pointer"
                        />
                        <span className="font-mono text-xs text-[#d4c59d] w-10 text-right">
                          {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderOpacity}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* PATTERN & GRADIENT FOR PRODUCTS SECTION */}
              <PatternGradientPicker
                title="نقش وتدرج قسم المنتجات الحرفية (Products Section Pattern & Gradient)"
                description="إضافة زخرفة الأرابيسك أو المشربية أو أي صورة مخصصة في خلفية قسم المنتجات الحرفية الذي ينزلق فوق فيديو الهيرو"
                badge="Products Section"
                enabled={theme.productsPage?.enablePattern || false}
                onToggle={(enabled) => updateTheme((p) => ({
                  ...p,
                  productsPage: {
                    ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                    enablePattern: enabled
                  }
                }))}
                patternUrl={theme.productsPage?.patternUrl || '/turath_pattern_watermark.png'}
                onPatternUrlChange={(url) => updateTheme((p) => ({
                  ...p,
                  productsPage: {
                    ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                    patternUrl: url
                  }
                }))}
                opacity={theme.productsPage?.patternOpacity ?? 8}
                onOpacityChange={(op) => updateTheme((p) => ({
                  ...p,
                  productsPage: {
                    ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                    patternOpacity: op
                  }
                }))}
                direction={theme.productsPage?.patternDirection || 'to bottom'}
                onDirectionChange={(dir) => updateTheme((p) => ({
                  ...p,
                  productsPage: {
                    ...(p.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                    patternDirection: dir
                  }
                }))}
                previewBg={(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor || '#000000'}
                recommendedText="النسبة الموصى بها: 5% - 15% لمظهر فخم وهادئ لا يشتت الانتباه عن صور المنتجات"
              />

              {/* PATTERN & GRADIENT FOR GLOBAL WEBSITE PAGE BACKGROUND */}
              <PatternGradientPicker
                title="نقش وتدرج خلفية صفحات الموقع ككل (Global Website Page Background & Pattern)"
                description="تطبيق خلفية ونقش جرادينت معماري فاخر يغطي خلفية صفحات الموقع ككل، مع إمكانية تثبيته (Fixed Parallax) والتحكم في اتجاهه وشفافيته بدقة"
                badge="Whole Website Background"
                allowFixed={true}
                isFixed={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternFixed !== false}
                onFixedChange={(fixed) => updateTheme((p) => ({
                  ...p,
                  pageBackground: {
                    ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                    patternFixed: fixed
                  }
                }))}
                enabled={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).enablePattern || false}
                onToggle={(enabled) => updateTheme((p) => ({
                  ...p,
                  pageBackground: {
                    ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                    enablePattern: enabled
                  }
                }))}
                patternUrl={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternUrl || '/turath_pattern_watermark.png'}
                onPatternUrlChange={(url) => updateTheme((p) => ({
                  ...p,
                  pageBackground: {
                    ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                    patternUrl: url
                  }
                }))}
                opacity={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternOpacity ?? 5}
                onOpacityChange={(op) => updateTheme((p) => ({
                  ...p,
                  pageBackground: {
                    ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                    patternOpacity: op
                  }
                }))}
                direction={(theme.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!).patternDirection || 'to bottom'}
                onDirectionChange={(dir) => updateTheme((p) => ({
                  ...p,
                  pageBackground: {
                    ...(p.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!),
                    patternDirection: dir
                  }
                }))}
                previewBg="#000000"
                recommendedText="النسبة الموصى بها: 3% - 8% ليمنح الموقع ككل عمقاً سينمائياً خافتاً وفخماً"
              />
            </div>
          )}

          {/* ========================================================== */}
          {/* REAL-TIME PREVIEW PANEL IN MODAL */}
          {/* ========================================================== */}
          <div className="p-5 rounded-xl bg-black/80 border border-[#d4c59d]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#d4c59d] uppercase tracking-wider font-mono">
                <Eye className="w-4 h-4 text-[#d4c59d]" />
                <span>معاينة حية فورية (Live Component Preview)</span>
              </div>
              <span className="text-[10px] text-[#9e9174] font-mono">
                Changes apply instantly across page in background
              </span>
            </div>

            <div className="p-6 rounded-lg bg-[#050505] border border-white/5 space-y-4">
              <h4 
                style={{ color: theme.text.headingColor }} 
                className="font-serif-luxury text-xl sm:text-2xl font-bold"
              >
                Handcrafted Egyptian Excellence &amp; Monumental Brass
              </h4>

              <p 
                style={{ color: theme.text.bodyColor }} 
                className="text-xs sm:text-sm font-light leading-relaxed max-w-2xl"
              >
                Every bespoke piece is hand-hammered and patinated by master artisans in El Gamaliya, Cairo with generational techniques.
              </p>

              <div className="flex items-center gap-4 text-xs">
                <span style={{ color: theme.text.mutedColor }}>Muted Reference Tag</span>
                <span style={{ color: theme.text.secondaryColor }}>• Secondary Highlight</span>
                <a 
                  href="#preview" 
                  onClick={(e) => e.preventDefault()} 
                  style={{ color: theme.text.linkColor }}
                  className="hover:underline font-medium"
                >
                  Interactive Link &rarr;
                </a>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                {/* Primary Button Preview */}
                <button
                  type="button"
                  style={{
                    backgroundColor: theme.primaryButton.style === 'transparent'
                      ? 'transparent'
                      : theme.primaryButton.style === 'outline'
                        ? (theme.primaryButton.bgOpacity > 0 && theme.primaryButton.bgOpacity < 100 ? hexToRgba(theme.primaryButton.bgColor, theme.primaryButton.bgOpacity) : 'transparent')
                        : hexToRgba(theme.primaryButton.bgColor, theme.primaryButton.bgOpacity),
                    color: theme.primaryButton.textColor,
                    borderColor: theme.primaryButton.style === 'transparent' && theme.primaryButton.borderOpacity === 0 ? 'transparent' : hexToRgba(theme.primaryButton.borderColor, theme.primaryButton.borderOpacity),
                  }}
                  className="relative overflow-hidden px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider border shadow-md transition-all cursor-pointer"
                >
                  {theme.primaryButton.enablePattern && (
                    <div 
                      style={{
                        backgroundImage: `url('${theme.primaryButton.patternUrl || '/turath_pattern_watermark.png'}')`,
                        opacity: (theme.primaryButton.patternOpacity ?? 25) / 100,
                        WebkitMaskImage: getPatternMask(theme.primaryButton.patternDirection || '135deg'),
                        maskImage: getPatternMask(theme.primaryButton.patternDirection || '135deg'),
                      }}
                      className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                    />
                  )}
                  <span className="relative z-10">Primary Button (الزر الرئيسي)</span>
                </button>

                {/* Secondary Button Preview */}
                <button
                  type="button"
                  style={{
                    backgroundColor: theme.secondaryButton.style === 'transparent'
                      ? 'transparent'
                      : theme.secondaryButton.style === 'outline'
                        ? (theme.secondaryButton.bgOpacity > 0 && theme.secondaryButton.bgOpacity < 100 ? hexToRgba(theme.secondaryButton.bgColor, theme.secondaryButton.bgOpacity) : 'transparent')
                        : hexToRgba(theme.secondaryButton.bgColor, theme.secondaryButton.bgOpacity),
                    color: theme.secondaryButton.textColor,
                    borderColor: theme.secondaryButton.style === 'transparent' && theme.secondaryButton.borderOpacity === 0 ? 'transparent' : hexToRgba(theme.secondaryButton.borderColor, theme.secondaryButton.borderOpacity),
                  }}
                  className="relative overflow-hidden px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider border shadow-md transition-all cursor-pointer"
                >
                  {theme.secondaryButton.enablePattern && (
                    <div 
                      style={{
                        backgroundImage: `url('${theme.secondaryButton.patternUrl || '/turath_pattern_watermark.png'}')`,
                        opacity: (theme.secondaryButton.patternOpacity ?? 20) / 100,
                        WebkitMaskImage: getPatternMask(theme.secondaryButton.patternDirection || '135deg'),
                        maskImage: getPatternMask(theme.secondaryButton.patternDirection || '135deg'),
                      }}
                      className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                    />
                  )}
                  <span className="relative z-10">Secondary Button (الزر الثانوي)</span>
                </button>
              </div>

              {/* Photo Container & Text Box Previews */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo Container Preview Card */}
                <div 
                  style={{
                    backgroundColor: hexToRgba((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg, (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity),
                    borderColor: hexToRgba((theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorder, (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBorderOpacity),
                    backdropFilter: (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity < 100 && (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBackdropBlur !== false ? 'blur(12px)' : 'none',
                    WebkitBackdropFilter: (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity < 100 && (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBackdropBlur !== false ? 'blur(12px)' : 'none',
                  }}
                  className="relative overflow-hidden p-3.5 rounded-xl border flex items-center gap-3.5 shadow-md"
                >
                  {theme.containers?.enablePattern && (
                    <div 
                      style={{
                        backgroundImage: `url('${theme.containers.patternUrl || '/turath_pattern_watermark.png'}')`,
                        opacity: (theme.containers.patternOpacity ?? 12) / 100,
                        WebkitMaskImage: getPatternMask(theme.containers.patternDirection || 'to bottom'),
                        maskImage: getPatternMask(theme.containers.patternDirection || 'to bottom'),
                      }}
                      className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                    />
                  )}
                  <div 
                    style={{
                      backgroundColor: hexToRgba(
                        (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgColor || (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBg,
                        (theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100
                      ),
                    }}
                    className="w-14 h-14 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0 relative z-10"
                  >
                    <ImageIcon className="w-6 h-6 text-[#d4c59d]" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4c59d] block">
                      خلفية الصورة: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoBgOpacity ?? 100}% &bull; الحاوية: {(theme.containers || DEFAULT_THEME_SETTINGS.containers!).photoContainerBgOpacity}%
                    </span>
                    <p className="text-xs font-medium text-[#f5f0e6]">
                      Photo &amp; Container Opacity Preview
                    </p>
                  </div>
                </div>

                {/* Text Box with Gradient Photo Preview */}
                <div 
                  style={{
                    backgroundColor: hexToRgba((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBgColor, 95),
                    borderColor: hexToRgba((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderColor, (theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).boxBorderOpacity),
                  }}
                  className="relative p-3.5 rounded-xl border overflow-hidden shadow-md"
                >
                  {/* Watermark / Gradient Photo Overlay */}
                  {(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).enableGradientPhoto && (
                    <div 
                      style={{
                        backgroundImage: `url('${(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoUrl || '/turath_pattern_watermark.png'}')`,
                        opacity: ((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientPhotoOpacity || 6) / 100,
                        WebkitMaskImage: getPatternMask((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientDirection || 'to bottom'),
                        maskImage: getPatternMask((theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).gradientDirection || 'to bottom'),
                      }}
                      className="absolute inset-0 bg-cover bg-center pointer-events-none"
                    />
                  )}
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4c59d] block">
                      معاينة مربع النص {(theme.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!).enableGradientPhoto ? 'مع صورة الجرادينت' : 'بدون صورة'}
                    </span>
                    <p className="text-xs text-[#e6d8b5] font-light">
                      Text box styling with optional watermark texture
                    </p>
                  </div>
                </div>

                {/* Handcrafted Products Section & Page Preview */}
                <div 
                  style={{
                    backgroundColor: hexToRgba(
                      (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor, 
                      (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity
                    ),
                    borderColor: hexToRgba(
                      (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderColor, 
                      (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).borderOpacity
                    ),
                    backdropFilter: (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity < 100 && (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).backdropBlur ? 'blur(12px)' : 'none',
                    WebkitBackdropFilter: (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity < 100 && (theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).backdropBlur ? 'blur(12px)' : 'none',
                  }}
                  className="col-span-1 sm:col-span-2 p-4 rounded-xl border shadow-lg space-y-2 relative overflow-hidden transition-all duration-200"
                >
                  {theme.productsPage?.enablePattern && (
                    <div 
                      style={{
                        backgroundImage: `url('${theme.productsPage.patternUrl || '/turath_pattern_watermark.png'}')`,
                        opacity: (theme.productsPage.patternOpacity ?? 8) / 100,
                        WebkitMaskImage: getPatternMask(theme.productsPage.patternDirection || 'to bottom'),
                        maskImage: getPatternMask(theme.productsPage.patternDirection || 'to bottom'),
                      }}
                      className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4c59d] font-bold flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>معاينة قسم وصفحة المنتجات الحرفية (Our Handcrafted Products)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#d4c59d] border border-white/10">
                      {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgColor} • {(theme.productsPage || DEFAULT_THEME_SETTINGS.productsPage!).bgOpacity}% Opacity
                    </span>
                  </div>
                  <h5 className="relative z-10 font-serif-luxury text-base sm:text-lg font-bold text-[#f5f0e6]">
                    Our Handcrafted Products
                  </h5>
                  <p className="relative z-10 text-xs text-[#9e9174] max-w-xl">
                    Select any category below to browse photos, watch crafting videos, and request custom specifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#141318] border-t border-[#d4c59d]/30 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a1711] hover:bg-[#282319] text-[#d4c59d] border border-[#d4c59d]/40 text-xs font-bold transition-colors cursor-pointer"
            title="استعادة ألوان تراث الأصلية الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الألوان الافتراضية (Reset to Default)</span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-black/60 hover:bg-black text-[#9e9174] hover:text-white border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء (Cancel)
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>تم الحفظ بنجاح!</span>
                </>
              ) : isSaving ? (
                <span>جاري الحفظ...</span>
              ) : (
                <span>حفظ الألوان سحابياً (Save Theme)</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThemeEditorModal;
