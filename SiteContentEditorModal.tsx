import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Cloud, 
  Loader2, 
  Type, 
  Sparkles, 
  Phone, 
  Info, 
  ShieldCheck, 
  RotateCcw,
  LayoutTemplate,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { SiteContent, DEFAULT_SITE_CONTENT, DEFAULT_ABOUT_IMAGE } from './siteContentStorage';
import { compressPortraitImage1080x1920 } from './imageCompressor';

interface SiteContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: SiteContent;
  onSaveContent: (content: SiteContent) => Promise<void>;
  onResetContent: () => Promise<void>;
}

export const SiteContentEditorModal: React.FC<SiteContentEditorModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onSaveContent,
  onResetContent,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'cards' | 'about' | 'why' | 'contact'>('hero');
  const [formData, setFormData] = useState<SiteContent>(currentContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData(currentContent);
  }, [currentContent, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof SiteContent, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('جاري الحفظ والمزامنة السحابية...');
    try {
      await onSaveContent(formData);
      setStatusMessage('تم حفظ جميع النصوص سحابياً بنجاح! تظهر الآن لجميع الزوار.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage('حدث خطأ أثناء الحفظ، يرجى المحاولة ثانية.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('هل أنت متأكد من استعادة كافة النصوص الأصلية للموقع؟')) return;
    setIsSaving(true);
    try {
      await onResetContent();
      setFormData(DEFAULT_SITE_CONTENT);
      setStatusMessage('تمت استعادة كافة النصوص الأصلية بنجاح.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0e0e13] border-2 border-[#d4c59d]/50 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>تعديل نصوص وعناوين الموقع (Edit Site Texts)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Cloud Live
                </span>
              </h2>
              <p className="text-xs text-[#9e9174]">
                عدّل أي عنوان، وصف، قصة، أو أرقام تواصل، وتُحفظ سحابياً فوراً لجميع الزوار
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

        {/* Tabs Bar */}
        <div className="flex border-b border-[#d4c59d]/20 bg-[#0a0a0f] px-4 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'hero'
                ? 'border-[#d4c59d] text-[#d4c59d] bg-[#d4c59d]/10'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الواجهة الرئيسية (Hero)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'border-[#d4c59d] text-[#d4c59d] bg-[#d4c59d]/10'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>البطاقات الأربعة (Highlights)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-[#d4c59d] text-[#d4c59d] bg-[#d4c59d]/10'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>من نحن (About Section)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('why')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'why'
                ? 'border-[#d4c59d] text-[#d4c59d] bg-[#d4c59d]/10'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لماذا تراث (Why Us)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#d4c59d] text-[#d4c59d] bg-[#d4c59d]/10'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>بيانات التواصل والاتصال</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                الواجهة الرئيسية والعناوين الكبرى
              </h3>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  شارة الشريط العلوي (Hero Badge)
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    العنوان الرئيسي (السطر الأول)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleLine1}
                    onChange={(e) => handleChange('heroTitleLine1', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    الكلمة المميزة باللون الذهبي (Highlight)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleHighlight}
                    onChange={(e) => handleChange('heroTitleHighlight', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none font-bold text-[#d4c59d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الوصف الرئيسي أسفل العنوان
                </label>
                <textarea
                  rows={3}
                  value={formData.heroDescription}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الملاحظة الحرفية الثانوية (Sub-description)
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubDescription}
                  onChange={(e) => handleChange('heroSubDescription', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    نص زر التصفح (Explore Button)
                  </label>
                  <input
                    type="text"
                    value={formData.heroExploreButtonText}
                    onChange={(e) => handleChange('heroExploreButtonText', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    نص زر التصنيع الخاص (Custom Button)
                  </label>
                  <input
                    type="text"
                    value={formData.heroCustomButtonText}
                    onChange={(e) => handleChange('heroCustomButtonText', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 4 CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                بطاقات التميز الأربعة أسفل الواجهة
              </h3>

              {/* Card 1 */}
              <div className="p-3.5 bg-[#14141c] rounded-xl border border-[#d4c59d]/25 space-y-2">
                <span className="text-[11px] font-bold text-[#d4c59d]">البطاقة الأولى</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="العنوان العلوي (Header)"
                    value={formData.metric1Title}
                    onChange={(e) => handleChange('metric1Title', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="العنوان الرئيسي (Title)"
                    value={formData.metric1Subtitle}
                    onChange={(e) => handleChange('metric1Subtitle', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                  />
                </div>
                <input
                  type="text"
                  placeholder="الوصف المختصر"
                  value={formData.metric1Desc}
                  onChange={(e) => handleChange('metric1Desc', e.target.value)}
                  className="w-full bg-[#0e0e13] text-[#9e9174] border border-white/10 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {/* Card 2 */}
              <div className="p-3.5 bg-[#14141c] rounded-xl border border-[#d4c59d]/25 space-y-2">
                <span className="text-[11px] font-bold text-[#d4c59d]">البطاقة الثانية</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.metric2Title}
                    onChange={(e) => handleChange('metric2Title', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.metric2Subtitle}
                    onChange={(e) => handleChange('metric2Subtitle', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                  />
                </div>
                <input
                  type="text"
                  value={formData.metric2Desc}
                  onChange={(e) => handleChange('metric2Desc', e.target.value)}
                  className="w-full bg-[#0e0e13] text-[#9e9174] border border-white/10 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {/* Card 3 */}
              <div className="p-3.5 bg-[#14141c] rounded-xl border border-[#d4c59d]/25 space-y-2">
                <span className="text-[11px] font-bold text-[#d4c59d]">البطاقة الثالثة</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.metric3Title}
                    onChange={(e) => handleChange('metric3Title', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.metric3Subtitle}
                    onChange={(e) => handleChange('metric3Subtitle', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                  />
                </div>
                <input
                  type="text"
                  value={formData.metric3Desc}
                  onChange={(e) => handleChange('metric3Desc', e.target.value)}
                  className="w-full bg-[#0e0e13] text-[#9e9174] border border-white/10 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {/* Card 4 */}
              <div className="p-3.5 bg-[#14141c] rounded-xl border border-[#d4c59d]/25 space-y-2">
                <span className="text-[11px] font-bold text-[#d4c59d]">البطاقة الرابعة</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.metric4Title}
                    onChange={(e) => handleChange('metric4Title', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.metric4Subtitle}
                    onChange={(e) => handleChange('metric4Subtitle', e.target.value)}
                    className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                  />
                </div>
                <input
                  type="text"
                  value={formData.metric4Desc}
                  onChange={(e) => handleChange('metric4Desc', e.target.value)}
                  className="w-full bg-[#0e0e13] text-[#9e9174] border border-white/10 rounded px-3 py-1.5 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                قسم قصة تراث (About Section)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    الشارة العلوية (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.aboutBadge}
                    onChange={(e) => handleChange('aboutBadge', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    العنوان الرئيسي للقسم
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle}
                    onChange={(e) => handleChange('aboutTitle', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الفقرة الأولى (عن الجمالية والتاريخ)
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutParagraph1}
                  onChange={(e) => handleChange('aboutParagraph1', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الفقرة الثانية (عن النحاس النقي والنقش اليدوي)
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutParagraph2}
                  onChange={(e) => handleChange('aboutParagraph2', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الفقرة الثالثة (عن المشاريع والفنادق حول العالم)
                </label>
                <textarea
                  rows={2}
                  value={formData.aboutParagraph3}
                  onChange={(e) => handleChange('aboutParagraph3', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  اقتباس الحرفيين (Artisan Quote)
                </label>
                <input
                  type="text"
                  value={formData.aboutQuote}
                  onChange={(e) => handleChange('aboutQuote', e.target.value)}
                  className="w-full bg-[#14141c] text-[#d4c59d] italic border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs focus:border-[#d4c59d] outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: WHY US */}
          {activeTab === 'why' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                قسم لماذا تختار تراث؟
              </h3>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  شارة القسم (Badge)
                </label>
                <input
                  type="text"
                  value={formData.whyUsBadge}
                  onChange={(e) => handleChange('whyUsBadge', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  العنوان الرئيسي
                </label>
                <input
                  type="text"
                  value={formData.whyUsTitle}
                  onChange={(e) => handleChange('whyUsTitle', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الوصف التمهيدي للقسم
                </label>
                <textarea
                  rows={2}
                  value={formData.whyUsSubtitle}
                  onChange={(e) => handleChange('whyUsSubtitle', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                بيانات التواصل والشريط الإعلاني
              </h3>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  إعلان الشريط العلوي بالموقع (Top Announcement Bar)
                </label>
                <input
                  type="text"
                  value={formData.topAnnouncement}
                  onChange={(e) => handleChange('topAnnouncement', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    رقم الهاتف للاتصال المباشر (Phone)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => {
                      handleChange('contactPhone', e.target.value);
                      handleChange('topPhone', e.target.value);
                    }}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    رقم الواتساب (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={formData.contactWhatsApp}
                    onChange={(e) => {
                      handleChange('contactWhatsApp', e.target.value);
                      handleChange('topWhatsApp', e.target.value);
                    }}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    البريد الإلكتروني الرسمي (Email)
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9e9174] mb-1">
                    العنوان ومقر الورشة (Address)
                  </label>
                  <input
                    type="text"
                    value={formData.contactAddress}
                    onChange={(e) => handleChange('contactAddress', e.target.value)}
                    className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  مواعيد العمل (Working Hours)
                </label>
                <input
                  type="text"
                  value={formData.contactHours}
                  onChange={(e) => handleChange('contactHours', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  عنوان قسم التواصل الرئيسي
                </label>
                <input
                  type="text"
                  value={formData.contactTitle}
                  onChange={(e) => handleChange('contactTitle', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9e9174] mb-1">
                  الوصف التمهيدي للتواصل
                </label>
                <textarea
                  rows={2}
                  value={formData.contactSubtitle}
                  onChange={(e) => handleChange('contactSubtitle', e.target.value)}
                  className="w-full bg-[#14141c] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#d4c59d]/20 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-3.5 py-2 text-xs text-[#9e9174] hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة النصوص الأصلية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-[#f5f0e6] hover:bg-white/10 rounded-lg transition-colors"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>حفظ النصوص سحابياً (Cloud Save)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
