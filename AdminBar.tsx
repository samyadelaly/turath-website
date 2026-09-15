import React from 'react';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  PlusCircle, 
  Camera, 
  LogOut, 
  Eye, 
  Download, 
  Cloud,
  Type,
  Layers
} from 'lucide-react';

interface AdminBarProps {
  onOpenSiteContentEditor: () => void;
  onOpenCategoryManager: () => void;
  onOpenEditCategoryCovers: () => void;
  onOpenProductEditor: () => void;
  onOpenChangeLogo: () => void;
  onOpenDownloadZip?: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onOpenSiteContentEditor,
  onOpenCategoryManager,
  onOpenEditCategoryCovers,
  onOpenProductEditor,
  onOpenChangeLogo,
  onOpenDownloadZip,
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
            <ShieldCheck className="w-4 h-4 text-[#d4c59d]" />
            <span className="font-serif-luxury tracking-wider uppercase text-[11px]">
              لوحة تحكم الأدمن (Admin Panel)
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
            <Cloud className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">سحابي متصل (Cloud Synced)</span>
            <span className="sm:hidden">سحابي</span>
          </span>
        </div>

        {/* Right: Quick Action Buttons & View As Visitor / Logout */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit All Site Texts & Headlines */}
          <button
            onClick={onOpenSiteContentEditor}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] text-[11px] font-bold uppercase tracking-wider transition-all shadow"
            title="تعديل كافة العناوين، النصوص، النبذة، وأرقام التواصل"
          >
            <Type className="w-3.5 h-3.5" />
            <span>تعديل نصوص الموقع</span>
          </button>

          {/* Manage and Add Categories */}
          <button
            onClick={onOpenCategoryManager}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/50 text-[11px] font-bold uppercase tracking-wider transition-all"
            title="إضافة أقسام جديدة أو تعديل أسمائها وصورها 1080×1080"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>إدارة وتزويد الأقسام</span>
          </button>

          {/* Quick Edit Category Covers */}
          <button
            onClick={onOpenEditCategoryCovers}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/50 text-[11px] font-bold uppercase tracking-wider transition-all"
            title="تعديل صور الأغلفة للأقسام"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">صور الأغلفة</span>
          </button>

          {/* Quick Product Editor */}
          <button
            onClick={onOpenProductEditor}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/50 text-[11px] font-bold uppercase tracking-wider transition-all"
            title="Add or edit product catalog items"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>المنتجات (1080×1080)</span>
          </button>

          {/* Quick Change Logo */}
          <button
            onClick={onOpenChangeLogo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/50 text-[11px] font-bold uppercase tracking-wider transition-all"
            title="Change website logo image"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">الشعار</span>
          </button>

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
