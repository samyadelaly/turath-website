import React, { useState, useEffect } from 'react';
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
  Palette,
  Video,
  Eye,
  EyeOff,
  Layers,
  Home,
  Package,
  FolderKanban,
  UserCheck,
  Building,
  Hammer,
  Quote,
  MessageSquare,
  Users,
  Compass,
  FileText,
  Camera,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  SiteContent, 
  DEFAULT_SITE_CONTENT, 
  DEFAULT_CONTENT_VISIBILITY, 
  DEFAULT_ABOUT_IMAGE, 
  sanitizeFacebookUrl, 
  sanitizeInstagramUrl,
  isSectionVisible,
  isElementVisible
} from './siteContentStorage';
import { DEFAULT_THEME_SETTINGS, applyThemeCssVariables } from './themeSettings';

interface SiteContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: SiteContent;
  onSaveContent: (content: SiteContent) => Promise<void>;
  onResetContent: () => Promise<void>;
  onOpenThemeEditor?: () => void;
  onOpenHeroVideoModal?: () => void;
  onOpenAboutPhotoModal?: (target: 'about' | 'founder') => void;
}

type PageKey = 'home' | 'products' | 'projects' | 'about' | 'founder' | 'contact';

type HomeSectionKey = 
  | 'hero' 
  | 'craftStory' 
  | 'materialStory' 
  | 'products' 
  | 'projects' 
  | 'clientsPartners' 
  | 'highlights' 
  | 'about' 
  | 'founder' 
  | 'customFabrication' 
  | 'whyUs' 
  | 'contact' 
  | 'finalBrandStatement';

export const SiteContentEditorModal: React.FC<SiteContentEditorModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onSaveContent,
  onResetContent,
  onOpenThemeEditor,
  onOpenHeroVideoModal,
  onOpenAboutPhotoModal,
}) => {
  const [selectedPage, setSelectedPage] = useState<PageKey>('home');
  const [selectedHomeSection, setSelectedHomeSection] = useState<HomeSectionKey>('hero');
  const [formData, setFormData] = useState<SiteContent>(currentContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      ...currentContent,
      visibility: {
        sections: {
          ...DEFAULT_CONTENT_VISIBILITY.sections,
          ...(currentContent.visibility?.sections || {})
        },
        elements: {
          ...DEFAULT_CONTENT_VISIBILITY.elements,
          ...(currentContent.visibility?.elements || {})
        }
      },
      contactFacebook: sanitizeFacebookUrl(currentContent.contactFacebook || currentContent.contact?.facebook),
      contactInstagram: sanitizeInstagramUrl(currentContent.contactInstagram || currentContent.contact?.instagram),
    });
  }, [currentContent, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof SiteContent, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (sectionKey: string) => {
    setFormData((prev) => {
      const currentVal = isSectionVisible(prev, sectionKey);
      return {
        ...prev,
        visibility: {
          ...prev.visibility,
          sections: {
            ...(prev.visibility?.sections || {}),
            [sectionKey]: !currentVal,
          },
          elements: prev.visibility?.elements || {},
        },
      };
    });
  };

  const toggleElement = (elementKey: string) => {
    setFormData((prev) => {
      const currentVal = isElementVisible(prev, elementKey);
      return {
        ...prev,
        visibility: {
          ...prev.visibility,
          sections: prev.visibility?.sections || {},
          elements: {
            ...(prev.visibility?.elements || {}),
            [elementKey]: !currentVal,
          },
        },
      };
    });
  };

  const resetSection = (sectionKey: HomeSectionKey | PageKey) => {
    if (!window.confirm(`هل أنت متأكد من استعادة الإعدادات والنصوص الافتراضية لهذا القسم؟`)) return;

    setFormData((prev) => {
      const next = { ...prev };
      const defaultVis = DEFAULT_CONTENT_VISIBILITY;
      const defaultContent = DEFAULT_SITE_CONTENT;

      // Section visibility restore
      const secKeyMap: Record<string, string> = {
        hero: 'hero',
        craftStory: 'craftStory',
        materialStory: 'materialStory',
        products: 'products',
        projects: 'projects',
        clientsPartners: 'clientsPartners',
        about: 'about',
        founder: 'founder',
        customFabrication: 'customFabrication',
        whyUs: 'whyUs',
        contact: 'contact',
        finalBrandStatement: 'finalBrandStatement',
      };

      const realSecKey = secKeyMap[sectionKey] || sectionKey;
      const targetSecVis = defaultVis.sections?.[realSecKey] !== false;

      const updatedSections = {
        ...(next.visibility?.sections || {}),
        [realSecKey]: targetSecVis,
      };

      const updatedElements = {
        ...(next.visibility?.elements || {}),
      };

      // Reset specific texts and elements based on section
      switch (sectionKey) {
        case 'hero':
          next.heroBadge = defaultContent.heroBadge;
          next.heroTitleLine1 = defaultContent.heroTitleLine1;
          next.heroTitleHighlight = defaultContent.heroTitleHighlight;
          next.heroDescription = defaultContent.heroDescription;
          next.heroSubDescription = defaultContent.heroSubDescription;
          next.heroExploreButtonText = defaultContent.heroExploreButtonText;
          next.heroCustomButtonText = defaultContent.heroCustomButtonText;
          ['heroLogo', 'heroBadge', 'heroAiIcons', 'heroTitle', 'heroDescription', 'heroSubDescription', 'heroExploreBtn', 'heroCustomBtn', 'heroVideo', 'heroRunningHeader', 'heroMetrics'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'craftStory':
          next.craftSectionBadge = defaultContent.craftSectionBadge;
          next.craftSectionTitleLine1 = defaultContent.craftSectionTitleLine1;
          next.craftSectionTitleGold = defaultContent.craftSectionTitleGold;
          next.craftSectionSubtitleAr = defaultContent.craftSectionSubtitleAr;
          next.craftSectionQuote = defaultContent.craftSectionQuote;
          ['craftBadge', 'craftAiIcons', 'craftTitle', 'craftSubtitleAr', 'craftVideo', 'craftCaption', 'craftPillars'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'materialStory':
          next.materialsSectionBadge = defaultContent.materialsSectionBadge;
          next.materialsSectionTitle = defaultContent.materialsSectionTitle;
          next.materialsSectionSubtitle = defaultContent.materialsSectionSubtitle;
          next.materialsSectionSubtitleAr = defaultContent.materialsSectionSubtitleAr;
          ['materialsBadge', 'materialsTitle', 'materialsSubtitle', 'materialsCards'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'products':
          next.productsSectionTitle = defaultContent.productsSectionTitle;
          next.productsSectionSubtitle = defaultContent.productsSectionSubtitle;
          next.productsSectionButtonText = defaultContent.productsSectionButtonText;
          ['productsTitle', 'productsSubtitle', 'productsAllBtn', 'productsGrid'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'projects':
          next.projectsSectionBadge = defaultContent.projectsSectionBadge;
          next.projectsSectionTitle = defaultContent.projectsSectionTitle;
          next.projectsSectionTitleGold = defaultContent.projectsSectionTitleGold;
          next.projectsSectionSubtitleAr = defaultContent.projectsSectionSubtitleAr;
          next.projectsSectionDesc = defaultContent.projectsSectionDesc;
          next.projectsSectionButtonText = defaultContent.projectsSectionButtonText;
          ['projectsBadge', 'projectsAiIcons', 'projectsTitle', 'projectsSubtitleAr', 'projectsDescription', 'projectsAllBtn', 'projectsPoints', 'projectsGrid'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'clientsPartners':
          next.clientsSectionTitle = defaultContent.clientsSectionTitle;
          next.clientsSectionSubtitleAr = defaultContent.clientsSectionSubtitleAr;
          next.clientsSectionSubtitleEn = defaultContent.clientsSectionSubtitleEn;
          next.clientsSectionButtonText = defaultContent.clientsSectionButtonText;
          ['clientsTitle', 'clientsSubtitleAr', 'clientsSubtitleEn', 'clientsAllBtn', 'clientsGrid'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'highlights':
          next.metric1Title = defaultContent.metric1Title;
          next.metric1Subtitle = defaultContent.metric1Subtitle;
          next.metric1Desc = defaultContent.metric1Desc;
          next.metric2Title = defaultContent.metric2Title;
          next.metric2Subtitle = defaultContent.metric2Subtitle;
          next.metric2Desc = defaultContent.metric2Desc;
          next.metric3Title = defaultContent.metric3Title;
          next.metric3Subtitle = defaultContent.metric3Subtitle;
          next.metric3Desc = defaultContent.metric3Desc;
          next.metric4Title = defaultContent.metric4Title;
          next.metric4Subtitle = defaultContent.metric4Subtitle;
          next.metric4Desc = defaultContent.metric4Desc;
          updatedElements['heroMetrics'] = true;
          break;
        case 'about':
          next.aboutBadge = defaultContent.aboutBadge;
          next.aboutTitle = defaultContent.aboutTitle;
          next.aboutTitleHighlight = defaultContent.aboutTitleHighlight;
          next.aboutParagraph1 = defaultContent.aboutParagraph1;
          next.aboutParagraph2 = defaultContent.aboutParagraph2;
          next.aboutParagraph3 = defaultContent.aboutParagraph3;
          next.aboutQuote = defaultContent.aboutQuote;
          ['aboutBadge', 'aboutTitle', 'aboutParagraphs', 'aboutImage'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'founder':
          next.founderBadge = defaultContent.founderBadge;
          next.founderName = defaultContent.founderName;
          next.founderRole = defaultContent.founderRole;
          next.founderTitle = defaultContent.founderTitle;
          next.founderParagraph1 = defaultContent.founderParagraph1;
          next.founderParagraph2 = defaultContent.founderParagraph2;
          next.founderParagraph3 = defaultContent.founderParagraph3;
          ['founderBadge', 'founderName', 'founderRole', 'founderTitle', 'founderParagraphs', 'founderImage'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'customFabrication':
          next.customSectionTitle = defaultContent.customSectionTitle;
          next.customSectionDesc = defaultContent.customSectionDesc;
          next.customSectionButtonText = defaultContent.customSectionButtonText;
          ['customTitle', 'customDescription', 'customButton'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'whyUs':
          next.whyUsBadge = defaultContent.whyUsBadge;
          next.whyUsTitle = defaultContent.whyUsTitle;
          next.whyUsSubtitle = defaultContent.whyUsSubtitle;
          ['whyUsBadge', 'whyUsTitle', 'whyUsSubtitle', 'whyUsCards'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'contact':
          next.contactBadge = defaultContent.contactBadge;
          next.contactTitle = defaultContent.contactTitle;
          next.contactSubtitle = defaultContent.contactSubtitle;
          next.contactPhone = defaultContent.contactPhone;
          next.contactWhatsApp = defaultContent.contactWhatsApp;
          next.contactEmail = defaultContent.contactEmail;
          next.contactAddress = defaultContent.contactAddress;
          next.contactHours = defaultContent.contactHours;
          ['contactBadge', 'contactTitle', 'contactSubtitle', 'contactInfo', 'contactForm'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
        case 'finalBrandStatement':
          next.finalStatementTitle = defaultContent.finalStatementTitle;
          next.finalStatementQuote = defaultContent.finalStatementQuote;
          ['finalStatementTitle', 'finalStatementQuote'].forEach((k) => {
            updatedElements[k] = defaultVis.elements?.[k] !== false;
          });
          break;
      }

      return {
        ...next,
        visibility: {
          sections: updatedSections,
          elements: updatedElements,
        },
      };
    });

    setStatusMessage(`تمت استعادة إعدادات وقيم هذا القسم بنجاح.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('جاري الحفظ والمزامنة السحابية الفورية...');
    try {
      const cleanFb = sanitizeFacebookUrl(formData.contactFacebook);
      const cleanIg = sanitizeInstagramUrl(formData.contactInstagram);
      const sanitized: SiteContent = {
        ...formData,
        contactFacebook: cleanFb,
        contactInstagram: cleanIg,
        contact: {
          title: formData.contact?.title || formData.contactTitle,
          subtitle: formData.contact?.subtitle || formData.contactSubtitle,
          phone: formData.contact?.phone || formData.contactPhone,
          whatsapp: formData.contact?.whatsapp || formData.contactWhatsApp,
          email: formData.contact?.email || formData.contactEmail,
          address: formData.contact?.address || formData.contactAddress,
          hours: formData.contact?.hours || formData.contactHours,
          facebook: cleanFb,
          instagram: cleanIg,
        },
      };
      await onSaveContent(sanitized);
      setStatusMessage('تم حفظ كافة إعدادات المحتوى والظهور سحابياً بنجاح! تم تطبيق التغييرات فوراً.');
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

  const handleGlobalReset = async () => {
    if (!window.confirm('هل أنت متأكد من استعادة كافة النصوص الأصلية وظهور الأقسام الافتراضي للموقع بالكامل؟')) return;
    setIsSaving(true);
    try {
      await onResetContent();
      setFormData(DEFAULT_SITE_CONTENT);
      setStatusMessage('تمت استعادة كافة النصوص والظهور الافتراضي بنجاح.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Reusable Section Master Switch Bar
  const renderSectionMasterBar = (sectionKey: HomeSectionKey | PageKey, titleAr: string, titleEn: string) => {
    const isVisible = isSectionVisible(formData, sectionKey);

    return (
      <div className={`p-4 rounded-xl border transition-all ${
        isVisible 
          ? 'bg-[#121217] border-[#d4c59d]/40 shadow-md' 
          : 'bg-[#181111] border-amber-500/40 shadow-inner'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/60 text-[#d4c59d] border border-[#d4c59d]/30 uppercase">
                {titleEn}
              </span>
              <h3 className="text-base font-bold text-[#f5f0e6] font-serif-luxury">
                {titleAr}
              </h3>
            </div>
            <p className="text-xs text-[#9e9174]">
              {isVisible 
                ? 'القسم ظاهر ونشط حالياً في الموقع للزوار.'
                : 'القسم مخفي بالكامل حالياً (Zero Pixels) ولا يترك أي فراغ في الصفحة.'
              }
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Master Toggle Button */}
            <button
              type="button"
              onClick={() => toggleSection(sectionKey)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow ${
                isVisible
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/50 hover:bg-amber-900'
              }`}
              title={isVisible ? 'إخفاء هذا القسم بالكامل' : 'إظهار هذا القسم'}
            >
              {isVisible ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>القسم مفعل وظاهر</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>القسم معطل ومخفي</span>
                </>
              )}
            </button>

            {/* Reset This Section Button */}
            <button
              type="button"
              onClick={() => resetSection(sectionKey)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-[#9e9174] hover:text-[#d4c59d] hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="استعادة النصوص وإعدادات هذا القسم فقط"
            >
              <RotateCcw className="w-3 h-3" />
              <span>استعادة القسم</span>
            </button>
          </div>
        </div>

        {!isVisible && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-[11px] text-amber-200/90 flex items-center gap-2">
            <span>⚠️</span>
            <span>
              قاعدة الصفر فراغ مفعلة: عند إخفاء هذا القسم يتم إزالته تماماً من الصفحة ويقترب القسم التالي منه مباشرة دون أي فراغ أو مسافة بيضاء.
            </span>
          </div>
        )}
      </div>
    );
  };

  // Reusable Element Toggle Switch & Editor Item
  const renderElementControl = (
    elementKey: string,
    labelAr: string,
    labelEn: string,
    options?: {
      isInput?: boolean;
      inputValue?: string;
      onInputChange?: (val: string) => void;
      placeholder?: string;
      isTextarea?: boolean;
      textareaRows?: number;
      secondaryInput?: {
        label: string;
        value: string;
        onChange: (val: string) => void;
        placeholder?: string;
      };
      extraAction?: React.ReactNode;
      note?: string;
    }
  ) => {
    const isVisible = isElementVisible(formData, elementKey);

    return (
      <div className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
        isVisible
          ? 'bg-[#14141c] border-[#d4c59d]/25'
          : 'bg-[#101014]/60 border-white/10 opacity-70'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleElement(elementKey)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isVisible
                  ? 'bg-[#d4c59d]/20 border-[#d4c59d] text-[#d4c59d]'
                  : 'bg-black/50 border-white/20 text-[#6e6858] hover:text-[#9e9174]'
              }`}
              title={isVisible ? 'إخفاء هذا العنصر' : 'إظهار هذا العنصر'}
            >
              {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#f5f0e6]">{labelAr}</span>
                <span className="text-[10px] font-mono text-[#9e9174] uppercase">({labelEn})</span>
              </div>
              {options?.note && (
                <p className="text-[10px] text-[#9e9174] mt-0.5">{options.note}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isVisible
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-700/40'
            }`}>
              {isVisible ? 'Visible' : 'Hidden'}
            </span>
            {options?.extraAction}
          </div>
        </div>

        {/* Input / Textarea for text editing */}
        {options?.isInput && options.onInputChange && (
          <div className="pt-1">
            {options.isTextarea ? (
              <textarea
                rows={options.textareaRows || 3}
                value={options.inputValue || ''}
                onChange={(e) => options.onInputChange!(e.target.value)}
                placeholder={options.placeholder}
                className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 focus:border-[#d4c59d] rounded-lg px-3 py-2 text-xs outline-none transition-colors"
              />
            ) : (
              <input
                type="text"
                value={options.inputValue || ''}
                onChange={(e) => options.onInputChange!(e.target.value)}
                placeholder={options.placeholder}
                className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 focus:border-[#d4c59d] rounded-lg px-3 py-2 text-xs outline-none transition-colors"
              />
            )}
          </div>
        )}

        {/* Secondary input if needed (e.g. link or second line) */}
        {options?.secondaryInput && (
          <div className="pt-1">
            <label className="block text-[10px] text-[#9e9174] mb-1">
              {options.secondaryInput.label}
            </label>
            <input
              type="text"
              value={options.secondaryInput.value}
              onChange={(e) => options.secondaryInput!.onChange(e.target.value)}
              placeholder={options.secondaryInput.placeholder}
              className="w-full bg-[#0a0a0f] text-[#d4c59d] border border-[#d4c59d]/30 focus:border-[#d4c59d] rounded-lg px-3 py-2 text-xs outline-none font-medium"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0b0f] border-2 border-[#d4c59d]/50 rounded-2xl shadow-[0_10px_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#121218] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>نظام التحكم في المحتوى والظهور (Content Visibility & Text CMS)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                  Cloud Live
                </span>
              </h2>
              <p className="text-[11px] text-[#9e9174]">
                تحكم كامل في إظهار وإخفاء وتعديل أي عنوان، وصف، زر، صورة، أو قسم مع تطبيق قاعدة (Zero Space / لا فراغات)
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

        {/* Level 1 Navigation: Pages Bar */}
        <div className="flex flex-wrap border-b border-[#d4c59d]/20 bg-[#07070a] px-3 py-2 gap-1.5 text-xs font-semibold items-center">
          <button
            type="button"
            onClick={() => setSelectedPage('home')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedPage === 'home'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية (Home)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('products')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedPage === 'products'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>المنتجات (Products)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('projects')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedPage === 'projects'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>المشاريع والمعارض (Projects)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('about')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedPage === 'about'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>من نحن (About Us)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('founder')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedPage === 'founder'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>المؤسس (Founder)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('contact')}
            className={`py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedPage === 'contact'
                ? 'bg-[#d4c59d] text-black font-bold shadow'
                : 'text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>اتصل بنا (Contact)</span>
          </button>

          {onOpenThemeEditor && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenThemeEditor();
              }}
              className="py-1.5 px-3 rounded-lg bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-black border border-[#d4c59d]/40 whitespace-nowrap transition-colors flex items-center gap-1.5 font-bold sm:mr-auto cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>المظهر والألوان (Theme & Colors) &rarr;</span>
            </button>
          )}
        </div>

        {/* Level 2 Navigation: Sub-Sections Bar (Visible when Page is 'home') */}
        {selectedPage === 'home' && (
          <div className="bg-[#101016] border-b border-[#d4c59d]/15 px-3 py-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#9e9174] font-bold px-1 whitespace-nowrap text-[10px] uppercase font-mono">
              أقسام الرئيسية (13 قسماً):
            </span>

            {[
              { key: 'hero', label: 'الواجهة والفيديو' },
              { key: 'craftStory', label: 'قصة الحرفة' },
              { key: 'materialStory', label: 'قصة النحاس' },
              { key: 'products', label: 'المنتجات الحرفية' },
              { key: 'projects', label: 'المشاريع المعمارية' },
              { key: 'clientsPartners', label: 'العملاء والشركاء' },
              { key: 'highlights', label: 'البطاقات الأربعة' },
              { key: 'about', label: 'نبذة عنا' },
              { key: 'founder', label: 'المؤسس' },
              { key: 'customFabrication', label: 'التصنيع المخصص' },
              { key: 'whyUs', label: 'لماذا تراث' },
              { key: 'contact', label: 'تواصل معنا' },
              { key: 'finalBrandStatement', label: 'البيان الختامي' },
            ].map((sec) => {
              const isSecVis = isSectionVisible(formData, sec.key);
              const isSelected = selectedHomeSection === sec.key;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setSelectedHomeSection(sec.key as HomeSectionKey)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                    isSelected
                      ? 'bg-[#d4c59d] text-black font-bold shadow'
                      : 'bg-black/60 text-[#c4b58d] hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSecVis ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 shadow">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* PAGE: HOME */}
          {selectedPage === 'home' && (
            <div className="space-y-6">
              {/* SECTION: HERO */}
              {selectedHomeSection === 'hero' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('hero', 'الواجهة الرئيسية والفيديو الإعلاني', 'HERO SECTION')}

                  {/* Video Control Card */}
                  <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/40 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#d4c59d]" />
                        <span className="text-xs font-bold text-[#f5f0e6]">فيديو الواجهة الرئيسية (Hero Video)</span>
                      </div>
                      {formData.heroVideoUrl ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          Active Video Enabled
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#9e9174] bg-[#0a0a0d] px-2 py-0.5 rounded border border-white/10">
                          No Video (Clean Background)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#9e9174] leading-relaxed">
                      فيديو حقيقي للورشة المصرية مضبوط على التمرير (Scroll-scrubbing) لتوفير تجربة بصرية سينمائية متكاملة.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      {onOpenHeroVideoModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenHeroVideoModal();
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>إدارة ورفع واستبدال الفيديو &rarr;</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleElement('heroVideo')}
                        className="px-3 py-2 rounded-lg border border-white/15 text-xs text-[#9e9174] hover:text-white cursor-pointer"
                      >
                        {isElementVisible(formData, 'heroVideo') ? 'إخفاء الفيديو مؤقتاً' : 'إظهار الفيديو'}
                      </button>
                    </div>
                  </div>

                  {/* Elements Control List */}
                  <div className="space-y-3">
                    {renderElementControl('heroLogo', 'شعار تراث في الواجهة الرئيسية (Hero Logo)', 'heroLogo', {
                      note: 'إظهار أو إخفاء شعار تراث المميز (TURATH Logo) في منتصف الواجهة الرئيسية (الهيرو) مع تطبيق قاعدة الصفر فراغ.'
                    })}

                    {renderElementControl('heroBadge', 'الشارة العلوية (Badge)', 'heroBadge', {
                      isInput: true,
                      inputValue: formData.heroBadge || '',
                      onInputChange: (val) => handleChange('heroBadge', val),
                      placeholder: 'مثال: CRAFTED IN GAMALIYA • CAIRO, EGYPT',
                      note: 'تم إخفاؤها افتراضياً لمنح العنوان الرئيسي فخامة سينمائية هادئة. يمكنك إظهارها في أي وقت.'
                    })}

                    {renderElementControl('heroAiIcons', 'أيقونة الذكاء الاصطناعي (AI Sparkle Icon)', 'heroAiIcons', {
                      note: 'تم إلغاء تفعيل أيقونات الذكاء الاصطناعي افتراضياً للتركيز على أصالة الحرفة المصرية.'
                    })}

                    {renderElementControl('heroTitle', 'العنوان الرئيسي والسطر الذهبي', 'heroTitle', {
                      isInput: true,
                      inputValue: formData.heroTitleLine1 || '',
                      onInputChange: (val) => handleChange('heroTitleLine1', val),
                      placeholder: 'السطر الأول: Handcrafted Egyptian Brass,',
                      secondaryInput: {
                        label: 'الكلمة المميزة باللون الذهبي (Gold Highlight):',
                        value: formData.heroTitleHighlight || '',
                        onChange: (val) => handleChange('heroTitleHighlight', val),
                        placeholder: 'مثال: Elevated to Architecture.'
                      }
                    })}

                    {renderElementControl('heroDescription', 'الوصف الرئيسي للواجهة', 'heroDescription', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 3,
                      inputValue: formData.heroDescription || '',
                      onInputChange: (val) => handleChange('heroDescription', val),
                    })}

                    {renderElementControl('heroSubDescription', 'الملاحظة الحرفية الثانوية', 'heroSubDescription', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 2,
                      inputValue: formData.heroSubDescription || '',
                      onInputChange: (val) => handleChange('heroSubDescription', val),
                    })}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {renderElementControl('heroExploreBtn', 'زر تصفح الكتالوج (Explore Button)', 'heroExploreBtn', {
                        isInput: true,
                        inputValue: formData.heroExploreButtonText || '',
                        onInputChange: (val) => handleChange('heroExploreButtonText', val),
                        placeholder: 'EXPLORE COLLECTIONS',
                      })}

                      {renderElementControl('heroCustomBtn', 'زر التصنيع الخاص (Custom Button)', 'heroCustomBtn', {
                        isInput: true,
                        inputValue: formData.heroCustomButtonText || '',
                        onInputChange: (val) => handleChange('heroCustomButtonText', val),
                        placeholder: 'COMMISSION BESPOKE WORK',
                      })}
                    </div>

                    {renderElementControl('heroRunningHeader', 'الشريط المتحرك أسفل الهيرو (Running Marquee)', 'heroRunningHeader')}
                    {renderElementControl('heroMetrics', 'شريط الأرقام والبطاقات الأربعة (Metrics Bar)', 'heroMetrics')}
                  </div>
                </div>
              )}

              {/* SECTION: CRAFT STORY */}
              {selectedHomeSection === 'craftStory' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('craftStory', 'قصة الحرفة والورشة المصرية', 'CRAFT STORY')}

                  <div className="space-y-3">
                    {renderElementControl('craftBadge', 'الشارة العلوية للقصة (Craft Badge)', 'craftBadge', {
                      isInput: true,
                      inputValue: formData.craftSectionBadge || '',
                      onInputChange: (val) => handleChange('craftSectionBadge', val),
                      placeholder: 'ATELIER DE GAMALIYA • HISTORIC CAIRO',
                      note: 'مخفية افتراضياً للتركيز على العنوان السينمائي.'
                    })}

                    {renderElementControl('craftAiIcons', 'أيقونة الذكاء الاصطناعي (AI Sparkle)', 'craftAiIcons')}

                    {renderElementControl('craftTitle', 'العنوان الرئيسي لقصة الحرفة', 'craftTitle', {
                      isInput: true,
                      inputValue: formData.craftSectionTitleLine1 || '',
                      onInputChange: (val) => handleChange('craftSectionTitleLine1', val),
                      secondaryInput: {
                        label: 'العنوان الذهبي الثانوي:',
                        value: formData.craftSectionTitleGold || '',
                        onChange: (val) => handleChange('craftSectionTitleGold', val),
                      }
                    })}

                    {renderElementControl('craftSubtitleAr', 'الوصف العربي الأصيل', 'craftSubtitleAr', {
                      isInput: true,
                      isTextarea: true,
                      inputValue: formData.craftSectionSubtitleAr || '',
                      onInputChange: (val) => handleChange('craftSectionSubtitleAr', val),
                    })}

                    {renderElementControl('craftCaption', 'الاقتباس الحرفي (Atelier Quote)', 'craftCaption', {
                      isInput: true,
                      inputValue: formData.craftSectionQuote || '',
                      onInputChange: (val) => handleChange('craftSectionQuote', val),
                    })}

                    {renderElementControl('craftVideo', 'فيديو الحرفة المدمج (Craft Video Element)', 'craftVideo', {
                      isInput: true,
                      inputValue: formData.craftSectionVideoUrl || '',
                      onInputChange: (val) => handleChange('craftSectionVideoUrl', val),
                      placeholder: 'رابط فيديو MP4 مباشر'
                    })}

                    {renderElementControl('craftPillars', 'الأعمدة الحرفية الثلاثة (01 Chasing, 02 Piercing, 03 Patina)', 'craftPillars')}
                  </div>
                </div>
              )}

              {/* SECTION: MATERIAL STORY */}
              {selectedHomeSection === 'materialStory' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('materialStory', 'قصة المعادن والنحاس الخالص', 'MATERIAL STORY')}

                  <div className="space-y-3">
                    {renderElementControl('materialsBadge', 'الشارة العلوية (Materials Badge)', 'materialsBadge', {
                      isInput: true,
                      inputValue: formData.materialsSectionBadge || '',
                      onInputChange: (val) => handleChange('materialsSectionBadge', val),
                    })}

                    {renderElementControl('materialsTitle', 'عنوان قصة المعادن', 'materialsTitle', {
                      isInput: true,
                      inputValue: formData.materialsSectionTitle || '',
                      onInputChange: (val) => handleChange('materialsSectionTitle', val),
                    })}

                    {renderElementControl('materialsSubtitle', 'الوصف التمهيدي للمعادن', 'materialsSubtitle', {
                      isInput: true,
                      inputValue: formData.materialsSectionSubtitle || '',
                      onInputChange: (val) => handleChange('materialsSectionSubtitle', val),
                      secondaryInput: {
                        label: 'الوصف العربي الموثق:',
                        value: formData.materialsSectionSubtitleAr || '',
                        onChange: (val) => handleChange('materialsSectionSubtitleAr', val),
                      }
                    })}

                    {renderElementControl('materialsCards', 'بطاقات المواد الثلاثة (Solid Brass, Pure Copper, Architectural Patina)', 'materialsCards')}
                  </div>
                </div>
              )}

              {/* SECTION: PRODUCTS OVERVIEW */}
              {selectedHomeSection === 'products' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('products', 'نظرة عامة على المنتجات الحرفية (على الرئيسية)', 'HANDCRAFTED PRODUCTS')}

                  <div className="space-y-3">
                    {renderElementControl('productsTitle', 'العنوان الرئيسي للمنتجات', 'productsTitle', {
                      isInput: true,
                      inputValue: formData.productsSectionTitle || '',
                      onInputChange: (val) => handleChange('productsSectionTitle', val),
                    })}

                    {renderElementControl('productsSubtitle', 'الوصف التمهيدي لقسم المنتجات', 'productsSubtitle', {
                      isInput: true,
                      inputValue: formData.productsSectionSubtitle || '',
                      onInputChange: (val) => handleChange('productsSectionSubtitle', val),
                    })}

                    {renderElementControl('productsAllBtn', 'نص زر استعراض كافة المجموعات', 'productsAllBtn', {
                      isInput: true,
                      inputValue: formData.productsSectionButtonText || '',
                      onInputChange: (val) => handleChange('productsSectionButtonText', val),
                    })}

                    {/* Products Section Background Color & Opacity Control */}
                    <div className="p-4 rounded-xl bg-[#121218] border border-[#d4c59d]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          <span>لون وشفافية خلفية قسم المنتجات الحرفية (Background & Opacity)</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#e6d8b5] bg-black/60 px-2 py-0.5 rounded border border-[#d4c59d]/20">
                          {formData.theme?.productsPage?.bgOpacity ?? 100}% Opacity
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-lg border border-white/5">
                          <input
                            type="color"
                            value={formData.theme?.productsPage?.bgColor || '#000000'}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedTheme = {
                                ...formData.theme,
                                productsPage: {
                                  ...(formData.theme?.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                                  bgColor: val,
                                }
                              };
                              handleChange('theme', updatedTheme);
                              applyThemeCssVariables(updatedTheme);
                            }}
                            className="w-8 h-8 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                          />
                          <input
                            type="text"
                            value={formData.theme?.productsPage?.bgColor || '#000000'}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedTheme = {
                                ...formData.theme,
                                productsPage: {
                                  ...(formData.theme?.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                                  bgColor: val,
                                }
                              };
                              handleChange('theme', updatedTheme);
                              applyThemeCssVariables(updatedTheme);
                            }}
                            className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                          />
                          <span className="text-[11px] text-[#9e9174]">لون الخلفية (Color)</span>
                        </div>

                        <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
                          <div className="flex justify-between text-[11px] text-[#9e9174]">
                            <span>درجة الشفافية (Opacity)</span>
                            <span className="font-mono text-[#d4c59d] font-bold">
                              {formData.theme?.productsPage?.bgOpacity ?? 100}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.theme?.productsPage?.bgOpacity ?? 100}
                            onChange={(e) => {
                              const op = Number(e.target.value);
                              const updatedTheme = {
                                ...formData.theme,
                                productsPage: {
                                  ...(formData.theme?.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                                  bgOpacity: op,
                                }
                              };
                              handleChange('theme', updatedTheme);
                              applyThemeCssVariables(updatedTheme);
                            }}
                            className="w-full accent-[#d4c59d] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {renderElementControl('productsGrid', 'شبكة التصنيفات والمنتجات (Categories Grid)', 'productsGrid')}
                  </div>
                </div>
              )}

              {/* SECTION: PROJECTS OVERVIEW */}
              {selectedHomeSection === 'projects' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('projects', 'المشاريع المعمارية والأعمال الكبرى (على الرئيسية)', 'ARCHITECTURAL PROJECTS')}

                  <div className="space-y-3">
                    {renderElementControl('projectsBadge', 'شارة قسم المشاريع', 'projectsBadge', {
                      isInput: true,
                      inputValue: formData.projectsSectionBadge || '',
                      onInputChange: (val) => handleChange('projectsSectionBadge', val),
                    })}

                    {renderElementControl('projectsAiIcons', 'أيقونة الذكاء الاصطناعي (AI Sparkle)', 'projectsAiIcons')}

                    {renderElementControl('projectsTitle', 'العنوان الرئيسي للمشاريع', 'projectsTitle', {
                      isInput: true,
                      inputValue: formData.projectsSectionTitle || '',
                      onInputChange: (val) => handleChange('projectsSectionTitle', val),
                      secondaryInput: {
                        label: 'العنوان الذهبي المميز:',
                        value: formData.projectsSectionTitleGold || '',
                        onChange: (val) => handleChange('projectsSectionTitleGold', val),
                      }
                    })}

                    {renderElementControl('projectsSubtitleAr', 'الوصف العربي للمشاريع الفندقية والقصور', 'projectsSubtitleAr', {
                      isInput: true,
                      inputValue: formData.projectsSectionSubtitleAr || '',
                      onInputChange: (val) => handleChange('projectsSectionSubtitleAr', val),
                    })}

                    {renderElementControl('projectsDescription', 'الوصف التفصيلي الإنجليزي', 'projectsDescription', {
                      isInput: true,
                      isTextarea: true,
                      inputValue: formData.projectsSectionDesc || '',
                      onInputChange: (val) => handleChange('projectsSectionDesc', val),
                    })}

                    {renderElementControl('projectsAllBtn', 'زر عرض كافة المشاريع', 'projectsAllBtn', {
                      isInput: true,
                      inputValue: formData.projectsSectionButtonText || '',
                      onInputChange: (val) => handleChange('projectsSectionButtonText', val),
                    })}

                    {renderElementControl('projectsPoints', 'النقاط الثلاث (Bespoke Scale, Archival Patinas, Worldwide Logistics)', 'projectsPoints')}
                    {renderElementControl('projectsGrid', 'شبكة كروت المشاريع (Projects Cards Grid)', 'projectsGrid')}
                  </div>
                </div>
              )}

              {/* SECTION: CLIENTS & PARTNERS */}
              {selectedHomeSection === 'clientsPartners' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('clientsPartners', 'العملاء والشركاء المعماريين (على الرئيسية)', 'CLIENTS & PARTNERS')}

                  <div className="space-y-3">
                    {renderElementControl('clientsTitle', 'العنوان الرئيسي للشركاء', 'clientsTitle', {
                      isInput: true,
                      inputValue: formData.clientsSectionTitle || '',
                      onInputChange: (val) => handleChange('clientsSectionTitle', val),
                    })}

                    {renderElementControl('clientsSubtitleAr', 'الوصف العربي للشركاء', 'clientsSubtitleAr', {
                      isInput: true,
                      inputValue: formData.clientsSectionSubtitleAr || '',
                      onInputChange: (val) => handleChange('clientsSectionSubtitleAr', val),
                    })}

                    {renderElementControl('clientsSubtitleEn', 'الوصف الإنجليزي للشركاء', 'clientsSubtitleEn', {
                      isInput: true,
                      inputValue: formData.clientsSectionSubtitleEn || '',
                      onInputChange: (val) => handleChange('clientsSectionSubtitleEn', val),
                    })}

                    {renderElementControl('clientsAllBtn', 'زر عرض جميع العملاء والشركاء', 'clientsAllBtn', {
                      isInput: true,
                      inputValue: formData.clientsSectionButtonText || '',
                      onInputChange: (val) => handleChange('clientsSectionButtonText', val),
                    })}

                    {renderElementControl('clientsGrid', 'شبكة شعارات العملاء والشركاء (Logos Grid)', 'clientsGrid')}
                  </div>
                </div>
              )}

              {/* SECTION: HIGHLIGHTS (4 CARDS) */}
              {selectedHomeSection === 'highlights' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('highlights', 'بطاقات التميز الأربعة أسفل الواجهة', 'FOUR HIGHLIGHTS')}

                  <div className="space-y-3">
                    {/* Card 1 */}
                    <div className="p-3.5 bg-[#14141c] rounded-xl border border-[#d4c59d]/25 space-y-2">
                      <span className="text-[11px] font-bold text-[#d4c59d]">البطاقة الأولى</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="العنوان العلوي (Header)"
                          value={formData.metric1Title || ''}
                          onChange={(e) => handleChange('metric1Title', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="العنوان الرئيسي (Title)"
                          value={formData.metric1Subtitle || ''}
                          onChange={(e) => handleChange('metric1Subtitle', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="الوصف المختصر"
                        value={formData.metric1Desc || ''}
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
                          value={formData.metric2Title || ''}
                          onChange={(e) => handleChange('metric2Title', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          value={formData.metric2Subtitle || ''}
                          onChange={(e) => handleChange('metric2Subtitle', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.metric2Desc || ''}
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
                          value={formData.metric3Title || ''}
                          onChange={(e) => handleChange('metric3Title', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          value={formData.metric3Subtitle || ''}
                          onChange={(e) => handleChange('metric3Subtitle', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.metric3Desc || ''}
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
                          value={formData.metric4Title || ''}
                          onChange={(e) => handleChange('metric4Title', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          value={formData.metric4Subtitle || ''}
                          onChange={(e) => handleChange('metric4Subtitle', e.target.value)}
                          className="bg-[#0e0e13] text-[#f5f0e6] border border-white/10 rounded px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.metric4Desc || ''}
                        onChange={(e) => handleChange('metric4Desc', e.target.value)}
                        className="w-full bg-[#0e0e13] text-[#9e9174] border border-white/10 rounded px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: ABOUT PREVIEW */}
              {selectedHomeSection === 'about' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('about', 'قسم قصة تراث وأصالة الجمالية (About Section)', 'ABOUT TURATH')}

                  <div className="space-y-3">
                    {renderElementControl('aboutBadge', 'شارة من نحن (About Badge)', 'aboutBadge', {
                      isInput: true,
                      inputValue: formData.aboutBadge || '',
                      onInputChange: (val) => handleChange('aboutBadge', val),
                    })}

                    {renderElementControl('aboutTitle', 'العنوان الرئيسي للقسم', 'aboutTitle', {
                      isInput: true,
                      inputValue: formData.aboutTitle || '',
                      onInputChange: (val) => handleChange('aboutTitle', val),
                    })}

                    {renderElementControl('aboutParagraphs', 'الفقرات التعريفية للقصة (Paragraphs 1-3)', 'aboutParagraphs', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 3,
                      inputValue: formData.aboutParagraph1 || '',
                      onInputChange: (val) => handleChange('aboutParagraph1', val),
                      secondaryInput: {
                        label: 'الفقرة الثانية (عن النحاس النقي والنقش اليدوي):',
                        value: formData.aboutParagraph2 || '',
                        onChange: (val) => handleChange('aboutParagraph2', val),
                      }
                    })}

                    {renderElementControl('aboutImage', 'صورة وتأطير قسم قصة تراث', 'aboutImage', {
                      extraAction: onOpenAboutPhotoModal && (
                        <button
                          type="button"
                          onClick={() => onOpenAboutPhotoModal('about')}
                          className="px-2.5 py-1 rounded bg-[#d4c59d] text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>تأطير ونسبة الصورة</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: FOUNDER PREVIEW */}
              {selectedHomeSection === 'founder' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('founder', 'قسم المؤسس والرؤية الفنية (Founder Section)', 'FOUNDER & ART DIRECTION')}

                  <div className="space-y-3">
                    {renderElementControl('founderBadge', 'شارة القيادة والرؤية (Badge)', 'founderBadge', {
                      isInput: true,
                      inputValue: formData.founderBadge || '',
                      onInputChange: (val) => handleChange('founderBadge', val),
                    })}

                    {renderElementControl('founderName', 'اسم المؤسس والمنصب', 'founderName', {
                      isInput: true,
                      inputValue: formData.founderName || 'Samy Adel Abdallah',
                      onInputChange: (val) => handleChange('founderName', val),
                      secondaryInput: {
                        label: 'الصفة والمنصب (Creative Director):',
                        value: formData.founderRole || 'Founder & Creative Director • مُؤَسِّسُ وَمُدِيرُ الْإِبْدَاعِ',
                        onChange: (val) => handleChange('founderRole', val),
                      }
                    })}

                    {renderElementControl('founderTitle', 'العنوان الفرعي لمسيرة المؤسس', 'founderTitle', {
                      isInput: true,
                      inputValue: formData.founderTitle || '',
                      onInputChange: (val) => handleChange('founderTitle', val),
                    })}

                    {renderElementControl('founderParagraphs', 'الفقرات التوثيقية لمسيرة المؤسس', 'founderParagraphs', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 3,
                      inputValue: formData.founderParagraph1 || '',
                      onInputChange: (val) => handleChange('founderParagraph1', val),
                      secondaryInput: {
                        label: 'الفقرة الثانية (عن الفلسفة الفنية):',
                        value: formData.founderParagraph2 || '',
                        onChange: (val) => handleChange('founderParagraph2', val),
                      }
                    })}

                    {renderElementControl('founderImage', 'صورة المؤسس الرسمية وإعدادات التأطير', 'founderImage', {
                      extraAction: onOpenAboutPhotoModal && (
                        <button
                          type="button"
                          onClick={() => onOpenAboutPhotoModal('founder')}
                          className="px-2.5 py-1 rounded bg-[#d4c59d] text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>تأطير ونسبة الصورة</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: CUSTOM FABRICATION */}
              {selectedHomeSection === 'customFabrication' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('customFabrication', 'قسم التصنيع المخصص والمشاريع الخاصة', 'CUSTOM MANUFACTURING')}

                  <div className="space-y-3">
                    {renderElementControl('customTitle', 'العنوان الرئيسي للتصنيع الخاص', 'customTitle', {
                      isInput: true,
                      inputValue: formData.customSectionTitle || '',
                      onInputChange: (val) => handleChange('customSectionTitle', val),
                    })}

                    {renderElementControl('customDescription', 'الوصف التفصيلي لإمكانيات التفصيل', 'customDescription', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 3,
                      inputValue: formData.customSectionDesc || '',
                      onInputChange: (val) => handleChange('customSectionDesc', val),
                    })}

                    {renderElementControl('customButton', 'نص زر مناقشة المشروع الخاص', 'customButton', {
                      isInput: true,
                      inputValue: formData.customSectionButtonText || '',
                      onInputChange: (val) => handleChange('customSectionButtonText', val),
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: WHY US */}
              {selectedHomeSection === 'whyUs' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('whyUs', 'قسم لماذا تختار تراث؟ (معايير التميز)', 'WHY CHOOSE US')}

                  <div className="space-y-3">
                    {renderElementControl('whyUsBadge', 'شارة القسم (Why Us Badge)', 'whyUsBadge', {
                      isInput: true,
                      inputValue: formData.whyUsBadge || '',
                      onInputChange: (val) => handleChange('whyUsBadge', val),
                    })}

                    {renderElementControl('whyUsTitle', 'العنوان الرئيسي', 'whyUsTitle', {
                      isInput: true,
                      inputValue: formData.whyUsTitle || '',
                      onInputChange: (val) => handleChange('whyUsTitle', val),
                    })}

                    {renderElementControl('whyUsSubtitle', 'الوصف التمهيدي للقسم', 'whyUsSubtitle', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 2,
                      inputValue: formData.whyUsSubtitle || '',
                      onInputChange: (val) => handleChange('whyUsSubtitle', val),
                    })}

                    {renderElementControl('whyUsCards', 'بطاقات الأسباب الثمانية (8 Pillars)', 'whyUsCards')}
                  </div>
                </div>
              )}

              {/* SECTION: CONTACT PREVIEW */}
              {selectedHomeSection === 'contact' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('contact', 'قسم التواصل والكونسيرج (Contact Section)', 'CONTACT & CONCIERGE')}

                  <div className="space-y-3">
                    {renderElementControl('contactBadge', 'شارة التواصل (Contact Badge)', 'contactBadge', {
                      isInput: true,
                      inputValue: formData.contactBadge || '',
                      onInputChange: (val) => handleChange('contactBadge', val),
                    })}

                    {renderElementControl('contactTitle', 'العنوان الرئيسي للتواصل', 'contactTitle', {
                      isInput: true,
                      inputValue: formData.contactTitle || '',
                      onInputChange: (val) => handleChange('contactTitle', val),
                    })}

                    {renderElementControl('contactSubtitle', 'الوصف التمهيدي للتواصل', 'contactSubtitle', {
                      isInput: true,
                      inputValue: formData.contactSubtitle || '',
                      onInputChange: (val) => handleChange('contactSubtitle', val),
                    })}

                    {renderElementControl('contactInfo', 'عمود بيانات الاتصال والورشة (Direct Info Card)', 'contactInfo')}
                    {renderElementControl('contactForm', 'عمود نموذج إرسال الرسالة (Inquiry Form)', 'contactForm')}
                  </div>
                </div>
              )}

              {/* SECTION: FINAL BRAND STATEMENT */}
              {selectedHomeSection === 'finalBrandStatement' && (
                <div className="space-y-4">
                  {renderSectionMasterBar('finalBrandStatement', 'البيان الختامي لشعار تراث والمانيفستو', 'FINAL BRAND STATEMENT')}

                  <div className="space-y-3">
                    {renderElementControl('finalStatementTitle', 'العنوان الختامي الكبير', 'finalStatementTitle', {
                      isInput: true,
                      inputValue: formData.finalStatementTitle || '',
                      onInputChange: (val) => handleChange('finalStatementTitle', val),
                    })}

                    {renderElementControl('finalStatementQuote', 'اقتباس مانيفستو تراث (Brand Manifesto)', 'finalStatementQuote', {
                      isInput: true,
                      isTextarea: true,
                      textareaRows: 3,
                      inputValue: formData.finalStatementQuote || '',
                      onInputChange: (val) => handleChange('finalStatementQuote', val),
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PAGE: PRODUCTS */}
          {selectedPage === 'products' && (
            <div className="space-y-4">
              {renderSectionMasterBar('products', 'صفحة المنتجات والتصنيفات الكاملة', 'PRODUCTS PAGE')}

              <div className="space-y-3">
                {renderElementControl('productsTitle', 'عنوان صفحة المنتجات الرئيسي', 'productsTitle', {
                  isInput: true,
                  inputValue: formData.productsSectionTitle || '',
                  onInputChange: (val) => handleChange('productsSectionTitle', val),
                })}

                {renderElementControl('productsSubtitle', 'الوصف التمهيدي لصفحة المنتجات', 'productsSubtitle', {
                  isInput: true,
                  inputValue: formData.productsSectionSubtitle || '',
                  onInputChange: (val) => handleChange('productsSectionSubtitle', val),
                })}

                {renderElementControl('productsAllBtn', 'نص زر عرض الكتالوج', 'productsAllBtn', {
                  isInput: true,
                  inputValue: formData.productsSectionButtonText || '',
                  onInputChange: (val) => handleChange('productsSectionButtonText', val),
                })}

                {/* Products Page Background Color & Opacity Control */}
                <div className="p-4 rounded-xl bg-[#121218] border border-[#d4c59d]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d4c59d] font-serif-luxury uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>لون وشفافية خلفية صفحة وقسم المنتجات (Background & Opacity)</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#e6d8b5] bg-black/60 px-2 py-0.5 rounded border border-[#d4c59d]/20">
                      {formData.theme?.productsPage?.bgOpacity ?? 100}% Opacity
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-lg border border-white/5">
                      <input
                        type="color"
                        value={formData.theme?.productsPage?.bgColor || '#000000'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updatedTheme = {
                            ...formData.theme,
                            productsPage: {
                              ...(formData.theme?.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                              bgColor: val,
                            }
                          };
                          handleChange('theme', updatedTheme);
                          applyThemeCssVariables(updatedTheme);
                        }}
                        className="w-8 h-8 rounded cursor-pointer border border-[#d4c59d]/40 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.theme?.productsPage?.bgColor || '#000000'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updatedTheme = {
                            ...formData.theme,
                            productsPage: {
                              ...(formData.theme?.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                              bgColor: val,
                            }
                          };
                          handleChange('theme', updatedTheme);
                          applyThemeCssVariables(updatedTheme);
                        }}
                        className="w-24 px-2 py-1 bg-[#1a1a20] border border-white/10 rounded text-xs font-mono text-center uppercase"
                      />
                      <span className="text-[11px] text-[#9e9174]">لون الخلفية (Color)</span>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
                      <div className="flex justify-between text-[11px] text-[#9e9174]">
                        <span>درجة الشفافية (Opacity)</span>
                        <span className="font-mono text-[#d4c59d] font-bold">
                          {formData.theme?.productsPage?.bgOpacity ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.theme?.productsPage?.bgOpacity ?? 100}
                        onChange={(e) => {
                          const op = Number(e.target.value);
                          const updatedTheme = {
                            ...formData.theme,
                            productsPage: {
                              ...(formData.theme?.productsPage || DEFAULT_THEME_SETTINGS.productsPage!),
                              bgOpacity: op,
                            }
                          };
                          handleChange('theme', updatedTheme);
                          applyThemeCssVariables(updatedTheme);
                        }}
                        className="w-full accent-[#d4c59d] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {renderElementControl('productsGrid', 'شبكة التصنيفات والمنتجات الحرفية (Products Grid)', 'productsGrid')}
              </div>
            </div>
          )}

          {/* PAGE: PROJECTS */}
          {selectedPage === 'projects' && (
            <div className="space-y-4">
              {renderSectionMasterBar('projects', 'صفحة المشاريع والأعمال المعمارية الكاملة', 'PROJECTS PAGE')}

              <div className="space-y-3">
                {renderElementControl('projectsBadge', 'شارة صفحة المشاريع', 'projectsBadge', {
                  isInput: true,
                  inputValue: formData.projectsSectionBadge || '',
                  onInputChange: (val) => handleChange('projectsSectionBadge', val),
                })}

                {renderElementControl('projectsAiIcons', 'أيقونة الذكاء الاصطناعي (AI Sparkle)', 'projectsAiIcons')}

                {renderElementControl('projectsTitle', 'عنوان صفحة المشاريع', 'projectsTitle', {
                  isInput: true,
                  inputValue: formData.projectsSectionTitle || '',
                  onInputChange: (val) => handleChange('projectsSectionTitle', val),
                  secondaryInput: {
                    label: 'السطر الذهبي الثانوي:',
                    value: formData.projectsSectionTitleGold || '',
                    onChange: (val) => handleChange('projectsSectionTitleGold', val),
                  }
                })}

                {renderElementControl('projectsSubtitleAr', 'الوصف العربي للمشاريع الفندقية والقصور', 'projectsSubtitleAr', {
                  isInput: true,
                  inputValue: formData.projectsSectionSubtitleAr || '',
                  onInputChange: (val) => handleChange('projectsSectionSubtitleAr', val),
                })}

                {renderElementControl('projectsDescription', 'الوصف التوثيقي الإنجليزي', 'projectsDescription', {
                  isInput: true,
                  isTextarea: true,
                  inputValue: formData.projectsSectionDesc || '',
                  onInputChange: (val) => handleChange('projectsSectionDesc', val),
                })}

                {renderElementControl('projectsPoints', 'النقاط الثلاث (Bespoke Scale, Patina, Logistics)', 'projectsPoints')}
                {renderElementControl('projectsGrid', 'شبكة ملفات المشاريع Dossiers', 'projectsGrid')}
              </div>
            </div>
          )}

          {/* PAGE: ABOUT */}
          {selectedPage === 'about' && (
            <div className="space-y-4">
              {renderSectionMasterBar('about', 'صفحة قصة تراث (About Page)', 'ABOUT PAGE')}

              <div className="space-y-3">
                {renderElementControl('aboutBadge', 'شارة من نحن', 'aboutBadge', {
                  isInput: true,
                  inputValue: formData.aboutBadge || '',
                  onInputChange: (val) => handleChange('aboutBadge', val),
                })}

                {renderElementControl('aboutTitle', 'العنوان الرئيسي', 'aboutTitle', {
                  isInput: true,
                  inputValue: formData.aboutTitle || '',
                  onInputChange: (val) => handleChange('aboutTitle', val),
                })}

                {renderElementControl('aboutParagraphs', 'الفقرات التوثيقية الثلاث للقصة', 'aboutParagraphs', {
                  isInput: true,
                  isTextarea: true,
                  textareaRows: 3,
                  inputValue: formData.aboutParagraph1 || '',
                  onInputChange: (val) => handleChange('aboutParagraph1', val),
                  secondaryInput: {
                    label: 'الفقرة الثانية:',
                    value: formData.aboutParagraph2 || '',
                    onChange: (val) => handleChange('aboutParagraph2', val),
                  }
                })}

                {renderElementControl('aboutQuote', 'اقتباس الحرفيين (Artisan Quote)', 'aboutQuote', {
                  isInput: true,
                  inputValue: formData.aboutQuote || '',
                  onInputChange: (val) => handleChange('aboutQuote', val),
                })}

                {renderElementControl('aboutImage', 'صورة وتأطير قسم قصة تراث', 'aboutImage', {
                  extraAction: onOpenAboutPhotoModal && (
                    <button
                      type="button"
                      onClick={() => onOpenAboutPhotoModal('about')}
                      className="px-2.5 py-1 rounded bg-[#d4c59d] text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>تأطير ونسبة الصورة</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* PAGE: FOUNDER */}
          {selectedPage === 'founder' && (
            <div className="space-y-4">
              {renderSectionMasterBar('founder', 'صفحة المؤسس والرؤية الفنية (Founder Page)', 'FOUNDER PAGE')}

              <div className="space-y-3">
                {renderElementControl('founderBadge', 'شارة القيادة والرؤية', 'founderBadge', {
                  isInput: true,
                  inputValue: formData.founderBadge || '',
                  onInputChange: (val) => handleChange('founderBadge', val),
                })}

                {renderElementControl('founderName', 'اسم المؤسس والمنصب', 'founderName', {
                  isInput: true,
                  inputValue: formData.founderName || 'Samy Adel Abdallah',
                  onInputChange: (val) => handleChange('founderName', val),
                  secondaryInput: {
                    label: 'الصفة والمنصب:',
                    value: formData.founderRole || 'Founder & Creative Director • مُؤَسِّسُ وَمُدِيرُ الْإِبْدَاعِ',
                    onChange: (val) => handleChange('founderRole', val),
                  }
                })}

                {renderElementControl('founderTitle', 'العنوان الفرعي للمسيرة المهنية', 'founderTitle', {
                  isInput: true,
                  inputValue: formData.founderTitle || '',
                  onInputChange: (val) => handleChange('founderTitle', val),
                })}

                {renderElementControl('founderParagraphs', 'الفقرات التوثيقية لمسيرة المؤسس', 'founderParagraphs', {
                  isInput: true,
                  isTextarea: true,
                  textareaRows: 3,
                  inputValue: formData.founderParagraph1 || '',
                  onInputChange: (val) => handleChange('founderParagraph1', val),
                  secondaryInput: {
                    label: 'الفقرة الثانية:',
                    value: formData.founderParagraph2 || '',
                    onChange: (val) => handleChange('founderParagraph2', val),
                  }
                })}

                {renderElementControl('founderImage', 'صورة المؤسس الرسمية وإعدادات التأطير', 'founderImage', {
                  extraAction: onOpenAboutPhotoModal && (
                    <button
                      type="button"
                      onClick={() => onOpenAboutPhotoModal('founder')}
                      className="px-2.5 py-1 rounded bg-[#d4c59d] text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>تأطير ونسبة الصورة</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* PAGE: CONTACT */}
          {selectedPage === 'contact' && (
            <div className="space-y-4">
              {renderSectionMasterBar('contact', 'صفحة التواصل وبيانات الاتصال والورشة (Contact Page)', 'CONTACT PAGE')}

              <div className="space-y-3">
                {renderElementControl('contactBadge', 'شارة التواصل', 'contactBadge', {
                  isInput: true,
                  inputValue: formData.contactBadge || '',
                  onInputChange: (val) => handleChange('contactBadge', val),
                })}

                {renderElementControl('contactTitle', 'العنوان الرئيسي لصفحة التواصل', 'contactTitle', {
                  isInput: true,
                  inputValue: formData.contactTitle || '',
                  onInputChange: (val) => handleChange('contactTitle', val),
                })}

                {renderElementControl('contactSubtitle', 'الوصف التمهيدي للتواصل', 'contactSubtitle', {
                  isInput: true,
                  inputValue: formData.contactSubtitle || '',
                  onInputChange: (val) => handleChange('contactSubtitle', val),
                })}

                {/* Direct Contact Numbers & Social Links */}
                <div className="p-4 bg-[#14141c] rounded-xl border border-[#d4c59d]/30 space-y-4">
                  <h4 className="text-xs font-bold text-[#d4c59d] uppercase tracking-wider">
                    أرقام الهواتف وبيانات الورشة الرسمية
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#9e9174] mb-1">
                        رقم الهاتف للاتصال المباشر (Phone)
                      </label>
                      <input
                        type="text"
                        value={formData.contactPhone || ''}
                        onChange={(e) => {
                          handleChange('contactPhone', e.target.value);
                          handleChange('topPhone', e.target.value);
                        }}
                        className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#9e9174] mb-1">
                        رقم الواتساب (WhatsApp)
                      </label>
                      <input
                        type="text"
                        value={formData.contactWhatsApp || ''}
                        onChange={(e) => {
                          handleChange('contactWhatsApp', e.target.value);
                          handleChange('topWhatsApp', e.target.value);
                        }}
                        className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs font-bold outline-none"
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
                        value={formData.contactEmail || ''}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#9e9174] mb-1">
                        العنوان ومقر الورشة (Address)
                      </label>
                      <input
                        type="text"
                        value={formData.contactAddress || ''}
                        onChange={(e) => handleChange('contactAddress', e.target.value)}
                        className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#9e9174] mb-1">
                        رابط صفحة فيسبوك (Facebook URL)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.facebook.com/Egyptian.Turath"
                        value={formData.contactFacebook || ''}
                        onChange={(e) => handleChange('contactFacebook', e.target.value)}
                        className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#9e9174] mb-1">
                        رابط حساب انستغرام (Instagram URL)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.instagram.com/turath_egypt"
                        value={formData.contactInstagram || ''}
                        onChange={(e) => handleChange('contactInstagram', e.target.value)}
                        className="w-full bg-[#0a0a0f] text-[#f5f0e6] border border-[#d4c59d]/30 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {renderElementControl('contactInfo', 'عمود بيانات الاتصال والورشة (Direct Info Card)', 'contactInfo')}
                {renderElementControl('contactForm', 'عمود نموذج إرسال الرسالة (Inquiry Form)', 'contactForm')}
              </div>
            </div>
          )}

          {/* Bottom Footer Controls */}
          <div className="pt-4 border-t border-[#d4c59d]/20 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGlobalReset}
              disabled={isSaving}
              className="px-3.5 py-2 text-xs text-[#9e9174] hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة كافة نصوص وإعدادات الموقع الأصلية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-[#f5f0e6] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحفظ سحابياً...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>حفظ كافة التغييرات سحابياً (Save All Changes)</span>
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
