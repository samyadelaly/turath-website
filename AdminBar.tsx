import React from 'react';
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
  KeyRound
} from 'lucide-react';

interface AdminBarProps {
  onOpenSiteContentEditor: () => void;
  onOpenCategoryManager: () => void;
  onOpenAddCategory?: () => void;
  onOpenEditCategoryCovers: () => void;
  onOpenProductEditor: () => void;
  onOpenChangeLogo: () => void;
  onOpenChangeAboutPhoto?: () => void;
  onOpenDownloadZip?: () => void;
  onOpenChangePassword?: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onOpenSiteContentEditor,
  onOpenCategoryManager,
  onOpenAddCategory,
  onOpenEditCategoryCovers,
  onOpenProductEditor,
  onOpenChangeLogo,
  onOpenChangeAboutPhoto,
  onOpenDownloadZip,
  onOpenChangePassword,
  onLogout,
}) => {
  return (
    <div className="bg-[#0f0e0a] border-b border-[#d4c59d] px-3 sm:px-6 py-2 text-xs text-[#f5f0e6] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold text-[#d4c59d]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">وضع المدير مفعّل</span>
            <span className="sm:hidden">إدارة</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
              Live Editor
            </span>
          </div>

          {/* Cloud Sync Status */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#9e9174] border-l border-[#d4c59d]/30 pl-2 ml-1 font-arabic">
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span>مزامنة سحابية</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap font-arabic">
          {/* Add New Product Button */}
          <button
            onClick={onOpenProductEditor}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            title="إضافة قطعة نحاسية جديدة"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة منتج</span>
          </button>

          {/* Manage Categories */}
          <button
            onClick={onOpenCategoryManager}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
            title="إدارة وإضافة وتعديل أقسام الكتالوج"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">إدارة الأقسام</span>
          </button>

          {/* Quick Add Category */}
          <button
            onClick={onOpenAddCategory || onOpenCategoryManager}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
            title="إضافة قسم جديد للمنتجات"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ قسم جديد</span>
          </button>

          {/* Edit Category Covers */}
          <button
            onClick={onOpenEditCategoryCovers}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
            title="تعديل صور أغلفة الأقسام الرئيسية"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">أغلفة الأقسام</span>
          </button>

          {/* Edit Site Texts & Story */}
          <button
            onClick={onOpenSiteContentEditor}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
            title="تعديل نصوص الموقع، قصة تراث، وبيانات التواصل"
          >
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">نصوص الموقع</span>
          </button>

          {/* Change Logo Button */}
          <button
            onClick={onOpenChangeLogo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
            title="تحديث شعار تراث (Logo)"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">شعار الموقع</span>
          </button>

          {/* Change About Section Photo */}
          {onOpenChangeAboutPhoto && (
            <button
              onClick={onOpenChangeAboutPhoto}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
              title="تغيير صورة قسم قصة تراث (1080 × 1920)"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>صورة قصة تراث</span>
            </button>
          )}

          {/* Change Admin Password */}
          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#2a261c] text-[#d4c59d] border border-[#d4c59d]/40 text-xs transition-colors cursor-pointer"
              title="تغيير كلمة مرور الإدارة"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">تغيير الباسورد</span>
            </button>
          )}

          {/* Download Website ZIP */}
          <button
            onClick={onOpenDownloadZip}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/50 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            title="Download full website files as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">تحميل ZIP</span>
          </button>

          {/* Logout / Switch to Visitor View */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-500/40 text-[11px] font-bold transition-colors ml-1"
            title="Switch back to regular visitor mode (hide all edit buttons)"
          >
            <Eye className="w-3 h-3" />
            <span>خروج</span>
            <LogOut className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
