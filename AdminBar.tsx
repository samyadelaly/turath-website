import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  PlusCircle, 
  Plus,
  Camera, 
  LogOut, 
  Eye, 
  Download, 
  Cloud,
  Type,
  Layers,
  KeyRound,
  SlidersHorizontal,
  Building2,
  Briefcase,
  Handshake,
  Palette,
  Video,
  LayoutGrid,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface AdminBarProps {
  onOpenSiteContentEditor: () => void;
  onOpenCategoryManager: () => void;
  onOpenAddCategory?: () => void;
  onOpenEditCategoryCovers: () => void;
  onOpenProductEditor: () => void;
  onOpenProjectManager?: () => void;
  onOpenAddProject?: () => void;
  onOpenClientsPartnersManager?: () => void;
  onOpenChangeLogo: () => void;
  onOpenChangeAboutPhoto?: () => void;
  onOpenDownloadZip?: () => void;
  onOpenChangePassword?: () => void;
  onOpenSupabaseMigration?: () => void;
  onOpenMenuSortModal?: () => void;
  onOpenThemeEditor?: () => void;
  onOpenHeroVideoModal?: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onOpenSiteContentEditor,
  onOpenCategoryManager,
  onOpenAddCategory,
  onOpenEditCategoryCovers,
  onOpenProductEditor,
  onOpenProjectManager,
  onOpenAddProject,
  onOpenClientsPartnersManager,
  onOpenChangeLogo,
  onOpenChangeAboutPhoto,
  onOpenDownloadZip,
  onOpenChangePassword,
  onOpenSupabaseMigration,
  onOpenMenuSortModal,
  onOpenThemeEditor,
  onOpenHeroVideoModal,
  onLogout,
}) => {
  const [isAllToolsOpen, setIsAllToolsOpen] = useState(false);

  const openToolAndCloseDrawer = (action: () => void) => {
    setIsAllToolsOpen(false);
    action();
  };

  return (
    <>
      {/* Main Top Admin Bar */}
      <div className="bg-[#0f0e0a]/95 backdrop-blur-md border-b border-[#d4c59d]/50 px-2.5 sm:px-4 py-2 text-xs text-[#f5f0e6] sticky top-0 z-50 shadow-lg font-arabic">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Admin Status & Master All-Tools Trigger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            
            <div className="flex items-center gap-1.5 font-bold text-[#d4c59d]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">لوحة المدير</span>
            </div>

            {/* Master All Tools Drawer Button - Solves any hidden tool issue */}
            <button
              type="button"
              onClick={() => setIsAllToolsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer select-none"
              title="عرض كافة أدوات لوحة التحكم في نافذة واحدة منظمة"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>كافة الأدوات</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full font-mono">16</span>
            </button>
          </div>

          {/* Right: Quick Action Buttons with Zero Hidden Tools & Smooth Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar flex-nowrap sm:flex-wrap py-0.5 max-w-[calc(100vw-180px)] sm:max-w-none">
            {/* Add New Product Button */}
            <button
              onClick={onOpenProductEditor}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="إضافة قطعة نحاسية جديدة"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة منتج</span>
            </button>

            {/* Manage Categories */}
            <button
              onClick={onOpenCategoryManager}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
              title="إدارة وإضافة وتعديل أقسام الكتالوج"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>إدارة الأقسام</span>
            </button>

            {/* Quick Add Category */}
            <button
              onClick={onOpenAddCategory || onOpenCategoryManager}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
              title="إضافة قسم جديد للمنتجات"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ قسم جديد</span>
            </button>

            {/* Edit Site Texts & Story */}
            <button
              onClick={onOpenSiteContentEditor}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
              title="تعديل نصوص الموقع، قصة تراث، وبيانات التواصل وإخفاء/إظهار الأقسام"
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>نصوص ومحتوى الموقع</span>
            </button>

            {/* Theme, Colors, Buttons & Opacity Customizer */}
            {onOpenThemeEditor && (
              <button
                onClick={onOpenThemeEditor}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 text-xs font-bold transition-all cursor-pointer shadow-sm whitespace-nowrap"
                title="تخصيص ألوان ونمط الأزرار، والشفافية، وألوان النصوص وحاويات الصور ومربعات النصوص"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>المظهر والألوان</span>
              </button>
            )}

            {/* Hero Video Management */}
            {onOpenHeroVideoModal && (
              <button
                onClick={onOpenHeroVideoModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 text-xs font-bold transition-all cursor-pointer shadow-sm whitespace-nowrap"
                title="إدارة ورفع وحذف فيديو الهيرو وضبط نسبة العرض والشفافية"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>فيديو الهيرو</span>
              </button>
            )}

            {/* Edit Category Covers */}
            <button
              onClick={onOpenEditCategoryCovers}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
              title="تعديل صور أغلفة الأقسام الرئيسية وتأطيرها"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>أغلفة الأقسام</span>
            </button>

            {/* Sort Navigation Menu */}
            {onOpenMenuSortModal && (
              <button
                onClick={onOpenMenuSortModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 text-xs font-bold transition-all cursor-pointer shadow-sm whitespace-nowrap"
                title="تخصيص وترتيب عناصر القائمة الرئيسية وموقعها"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>ترتيب القائمة</span>
              </button>
            )}

            {/* Change Logo Button */}
            <button
              onClick={onOpenChangeLogo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
              title="تحديث شعار تراث (Logo)"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>شعار الموقع</span>
            </button>

            {/* Change About Section Photo */}
            {onOpenChangeAboutPhoto && (
              <button
                onClick={onOpenChangeAboutPhoto}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
                title="تغيير وتأطير صورة قسم قصة تراث"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>صورة قصة تراث</span>
              </button>
            )}

            {/* Manage Clients & Partners */}
            {onOpenClientsPartnersManager && (
              <button
                onClick={onOpenClientsPartnersManager}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
                title="إدارة شركاء النجاح وكبار العملاء والشعارات"
              >
                <Handshake className="w-3.5 h-3.5 text-amber-400" />
                <span>الشركاء والعملاء</span>
              </button>
            )}

            {/* Supabase Sync & Migrate */}
            {onOpenSupabaseMigration && (
              <button
                onClick={onOpenSupabaseMigration}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0f1f17] hover:bg-[#163524] text-emerald-400 border border-emerald-500/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
                title="مزامنة ونقل الكتالوج والوسائط إلى Supabase Free"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>مزامنة سحابية</span>
              </button>
            )}

            {/* Change Admin Password */}
            {onOpenChangePassword && (
              <button
                onClick={onOpenChangePassword}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer whitespace-nowrap"
                title="تغيير كلمة مرور الإدارة"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>كلمة المرور</span>
              </button>
            )}

            {/* Download Website ZIP */}
            {onOpenDownloadZip && (
              <button
                onClick={onOpenDownloadZip}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/50 text-xs transition-all cursor-pointer whitespace-nowrap"
                title="Download full website files as ZIP"
              >
                <Download className="w-3.5 h-3.5" />
                <span>نسخة ZIP</span>
              </button>
            )}

            {/* Logout / Switch to Visitor View */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-bold transition-colors whitespace-nowrap ml-1 cursor-pointer"
              title="العودة لوضع الزائر العادي وإخفاء أزرار التعديل"
            >
              <Eye className="w-3 h-3" />
              <span>خروج</span>
              <LogOut className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MASTER ALL TOOLS DRAWER MODAL - Categorized & 100% accessible */}
      {isAllToolsOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-4xl bg-[#0c0c10] border-2 border-[#d4c59d]/60 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col font-arabic text-[#f5f0e6]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/40">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#f5f0e6] flex items-center gap-2">
                    <span>كافة أدوات لوحة التحكم (All Admin Panel Tools)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                      Master Directory
                    </span>
                  </h2>
                  <p className="text-xs text-[#9e9174]">
                    جميع أدوات الإدارة مجمعة ومرتبة في مكان واحد لمنع اختفاء أي أداة وتسهيل الوصول الفوري
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAllToolsOpen(false)}
                className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Categorized Tools Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Category 1: Design & Content CMS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#d4c59d]/20 pb-1.5">
                  <Palette className="w-4 h-4 text-[#d4c59d]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#d4c59d] uppercase font-mono tracking-wider">
                    1. تصميم ومحتوى وهوية الموقع (Site Content & Visual Design)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Tool: Site Content Editor */}
                  <div
                    onClick={() => openToolAndCloseDrawer(onOpenSiteContentEditor)}
                    className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                        نصوص ومحتوى الموقع
                      </h4>
                      <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                        تعديل كافة العناوين والقصص وإظهار/إخفاء الأقسام وقاعدة الصفر فراغ.
                      </p>
                    </div>
                  </div>

                  {/* Tool: Theme & Appearance */}
                  {onOpenThemeEditor && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenThemeEditor)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          المظهر والألوان والأزرار
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          ألوان الأزرار، إطارات الصور، مربعات النصوص، وخلفيات الجرادينت الحية.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Hero Video */}
                  {onOpenHeroVideoModal && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenHeroVideoModal)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          فيديو الواجهة الرئيسية
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          رفع وتعديل وضبط تأطير ونسبة عرض فيديو الهيرو السينمائي.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Menu Sort */}
                  {onOpenMenuSortModal && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenMenuSortModal)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          ترتيب القائمة الرئيسية
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          تخصيص ترتيب وظهور روابط النافبار والقائمة الرئيسية.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Change Logo */}
                  <div
                    onClick={() => openToolAndCloseDrawer(onOpenChangeLogo)}
                    className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                        شعار الموقع (Logo)
                      </h4>
                      <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                        رفع وتحديث الشعار الذهبي الرسمي المعماري لتراث.
                      </p>
                    </div>
                  </div>

                  {/* Tool: About Photo */}
                  {onOpenChangeAboutPhoto && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenChangeAboutPhoto)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          صورة قصة تراث
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          تحديث وتأطير صورة ورشة الجمالية بقسم من نحن.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category 2: Catalog & Products */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#d4c59d]/20 pb-1.5">
                  <Layers className="w-4 h-4 text-[#d4c59d]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#d4c59d] uppercase font-mono tracking-wider">
                    2. إدارة الكتالوج والمنتجات (Catalog & Product Management)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Tool: Add Product */}
                  <div
                    onClick={() => openToolAndCloseDrawer(onOpenProductEditor)}
                    className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/40 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-[#d4c59d] text-black group-hover:scale-105 transition-transform flex-shrink-0">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                        إضافة منتج نحاسي جديد
                      </h4>
                      <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                        إدخال الصور عالية الدقة، المقاسات، الأوزان، والفيديوهات.
                      </p>
                    </div>
                  </div>

                  {/* Tool: Category Manager */}
                  <div
                    onClick={() => openToolAndCloseDrawer(onOpenCategoryManager)}
                    className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                        إدارة وتعديل الأقسام
                      </h4>
                      <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                        إدارة المجموعات، الأسماء، الترتيب، وإحصائيات القطع.
                      </p>
                    </div>
                  </div>

                  {/* Tool: Quick Add Category */}
                  {onOpenAddCategory && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenAddCategory)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          + إضافة قسم جديد فوراً
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          إنشاء تصنيف جديد مع غلاف وفيديو ونسب عرض مخصصة.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Category Covers */}
                  <div
                    onClick={() => openToolAndCloseDrawer(onOpenEditCategoryCovers)}
                    className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                        أغلفة وتأطير الأقسام
                      </h4>
                      <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                        تعديل صور الأغلفة ونسب الاقتصاص (Framing & Ratio).
                      </p>
                    </div>
                  </div>

                  {/* Tool: Clients & Partners */}
                  {onOpenClientsPartnersManager && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenClientsPartnersManager)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <Handshake className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          الشركاء وكبار العملاء
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          إدارة شعارات الفنادق والقصور وقائمة شركاء النجاح.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category 3: System & Security */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#d4c59d]/20 pb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4c59d]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#d4c59d] uppercase font-mono tracking-wider">
                    3. النظام والأمان والنسخ الاحتياطي (System & Security)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Tool: Supabase Sync */}
                  {onOpenSupabaseMigration && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenSupabaseMigration)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#163524] border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/40 group-hover:scale-105 transition-transform flex-shrink-0">
                        <Cloud className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-300 transition-colors">
                          مزامنة Supabase السحابية
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          تحديث قاعدة البيانات السحابية وحفظ نسخة الكتالوج.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Change Password */}
                  {onOpenChangePassword && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenChangePassword)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-amber-300 group-hover:scale-105 transition-transform flex-shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          تغيير كلمة مرور الإدارة
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          تحديث وتأمين باسورد لوحة تحكم الموقع بصلاحيات مشفرة.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Download ZIP */}
                  {onOpenDownloadZip && (
                    <div
                      onClick={() => openToolAndCloseDrawer(onOpenDownloadZip)}
                      className="p-3.5 rounded-xl bg-[#14141c] hover:bg-[#1f1f2a] border border-[#d4c59d]/25 hover:border-[#d4c59d] transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-[#d4c59d]/15 text-[#d4c59d] group-hover:scale-105 transition-transform flex-shrink-0">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors">
                          تحميل ملفات الموقع ZIP
                        </h4>
                        <p className="text-[11px] text-[#9e9174] mt-0.5 line-clamp-2">
                          أخذ نسخة احتياطية محلية من كود وصور الموقع بالكامل.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tool: Logout */}
                  <div
                    onClick={() => openToolAndCloseDrawer(onLogout)}
                    className="p-3.5 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-500/40 hover:border-red-400 transition-all cursor-pointer group flex items-start gap-3 shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-red-900/60 text-red-300 group-hover:scale-105 transition-transform flex-shrink-0">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-red-200 transition-colors">
                        الخروج لوضع الزائر (Logout)
                      </h4>
                      <p className="text-[11px] text-red-300/70 mt-0.5 line-clamp-2">
                        إغلاق وضع المدير وتجربة الموقع كزائر عادي.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#14141c] border-t border-[#d4c59d]/30 flex items-center justify-between">
              <span className="text-xs text-[#9e9174]">
                جميع الأدوات نشطة ومربوطة فورياً بالموقع وقاعدة البيانات السحابية
              </span>
              <button
                type="button"
                onClick={() => setIsAllToolsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-black/60 hover:bg-black text-[#d4c59d] border border-[#d4c59d]/30 text-xs font-bold cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminBar;
