import React from 'react';
import { TurathLogo } from './TurathLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  MessageCircle, 
  ArrowUp,
  Lock,
  LogOut,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  Download,
  Layers,
  FileText,
  Facebook,
  Instagram
} from 'lucide-react';
import { ProductCategoryInfo } from './types';
import { getStoredCategories } from './categoryStorage';
import { SiteContent, getStoredSiteContent, ensureSiteContentSections, DEFAULT_SITE_CONTENT, sanitizeFacebookUrl, sanitizeInstagramUrl } from './siteContentStorage';

interface FooterProps {
  onNavigate: (view: string, categoryId?: string | null) => void;
  onOpenProductEditor: () => void;
  onOpenChangeLogo?: () => void;
  onOpenEditCategoryCovers?: () => void;
  onOpenDownloadZip?: () => void;
  onOpenSiteContentEditor?: () => void;
  onOpenCategoryManager?: () => void;
  categories?: ProductCategoryInfo[];
  content?: SiteContent;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenProductEditor,
  onOpenChangeLogo,
  onOpenEditCategoryCovers,
  onOpenDownloadZip,
  onOpenSiteContentEditor,
  onOpenCategoryManager,
  categories,
  content,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  const activeCategories = categories || getStoredCategories();
  const activeContent = content ? ensureSiteContentSections(content) : getStoredSiteContent();
  const contact = activeContent.contact || DEFAULT_SITE_CONTENT.contact!;
  const whatsappDigits = (contact.whatsapp || activeContent.contactWhatsApp || '201016771010').replace(/[^0-9]/g, '');
  const phoneDigits = (contact.phone || activeContent.contactPhone || '00201016771010').replace(/\s+/g, '');
  const emailAddress = contact.email || activeContent.contactEmail || 'turath.egypt@gmail.com';
  const displayAddress = contact.address || activeContent.contactAddress || 'Gamaliya Street, Historic Cairo, Egypt';
  const displayPhone = contact.phone || activeContent.contactPhone || '002 01016771010';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] border-t border-[#d4c59d]/30 text-[#d4c59d] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <TurathLogo size="lg" />
            <p className="text-xs sm:text-sm text-[#9e9174] leading-relaxed">
              Egyptian manufacturer specializing in premium handcrafted brass, copper, and decorative metal products. Combining ancestral Gamaliya craftsmanship with modern luxury design for palaces, hotels, and prestigious residences worldwide.
            </p>
            {/* Social / contact buttons with NO border frames */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={sanitizeFacebookUrl(contact.facebook || activeContent.contactFacebook)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                title="Facebook - Turath"
                aria-label="Facebook Turath"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={sanitizeInstagramUrl(contact.instagram || activeContent.contactInstagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                title="Instagram - Turath"
                aria-label="Instagram Turath"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappDigits}?text=Hello%20Turath%20Egypt`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${emailAddress}`}
                className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phoneDigits}`}
                className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Collections */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-[#f5f0e6]">
              Handcrafted Product Categories
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#9e9174]">
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('category', cat.id)}
                  className="text-left hover:text-[#d4c59d] transition-colors py-0.5 truncate flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Contacts & Location */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-[#f5f0e6]">
              Contact Details
            </h4>
            <div className="space-y-3 text-xs text-[#9e9174]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                <span>{displayAddress}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                <a href={`tel:${phoneDigits}`} className="text-[#f5f0e6] hover:text-[#d4c59d]">
                  {displayPhone}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                <a href={`mailto:${emailAddress}`} className="text-[#f5f0e6] hover:text-[#d4c59d]">
                  {emailAddress}
                </a>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {isAdmin ? (
                <>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#d4c59d] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4c59d]" />
                    <span>Admin Controls (لوحة المسؤول)</span>
                  </div>

                  {onOpenSiteContentEditor && (
                    <button
                      onClick={onOpenSiteContentEditor}
                      className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center gap-1.5 font-arabic"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>تعديل نصوص وعناوين الموقع (Edit Texts)</span>
                    </button>
                  )}

                  {onOpenCategoryManager && (
                    <button
                      onClick={onOpenCategoryManager}
                      className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors flex items-center gap-1.5 font-arabic"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>إدارة أقسام المنتجات (Manage Categories)</span>
                    </button>
                  )}

                  {onOpenEditCategoryCovers && (
                    <button
                      onClick={onOpenEditCategoryCovers}
                      className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>تعديل صور الأقسام (Edit Covers)</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenProductEditor}
                    className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Product Catalog Editor</span>
                  </button>

                  {onOpenChangeLogo && (
                    <button
                      onClick={onOpenChangeLogo}
                      className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Website Logo</span>
                    </button>
                  )}

                  {onAdminLogout && (
                    <button
                      onClick={onAdminLogout}
                      className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-red-950/70 border border-red-500/40 text-red-300 hover:bg-red-900 transition-colors flex items-center justify-center gap-1.5 font-arabic"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل خروج من الإدارة</span>
                    </button>
                  )}

                  {onOpenDownloadZip && (
                    <button
                      onClick={onOpenDownloadZip}
                      className="w-full px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل الموقع ZIP (Download Files)</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  {onOpenAdminLogin && (
                    <button
                      onClick={onOpenAdminLogin}
                      className="inline-flex items-center gap-1.5 text-xs text-[#9e9174] hover:text-[#d4c59d] transition-colors py-1 cursor-pointer font-arabic"
                      title="Admin login"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#9e9174]" />
                      <span>دخول المسؤول (Admin Login)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[#d4c59d]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9e9174]">
          <div>
            © {new Date().getFullYear()} <strong className="text-[#d4c59d]">TURATH</strong>. All Rights Reserved. Crafted in Egypt.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#d4c59d] font-arabic">تراث • فخامة النحاس المصري</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
