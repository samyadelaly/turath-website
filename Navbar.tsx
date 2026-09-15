import React, { useState } from 'react';
import { TurathLogo } from './TurathLogo';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
  PlusCircle, 
  MessageCircle,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  LogOut,
  Lock,
  Download
} from 'lucide-react';
import { ProductCategoryInfo } from './types';
import { getStoredCategories } from './categoryStorage';
import { SiteContent, getStoredSiteContent } from './siteContentStorage';

interface NavbarProps {
  currentView: string;
  selectedCategory: string | null;
  onNavigate: (view: string, categoryId?: string | null) => void;
  onOpenProductEditor: (categoryId?: string) => void;
  onOpenChangeLogo?: () => void;
  onOpenEditCategoryCovers?: () => void;
  onOpenDownloadZip?: () => void;
  categories?: ProductCategoryInfo[];
  content?: SiteContent;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedCategory,
  onNavigate,
  onOpenProductEditor,
  onOpenChangeLogo,
  onOpenEditCategoryCovers,
  onOpenDownloadZip,
  categories,
  content,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const activeCategories = categories || getStoredCategories();
  const activeContent = content || getStoredSiteContent();
  const contact = activeContent.contact;

  const handleNavClick = (view: string, categoryId?: string | null) => {
    onNavigate(view, categoryId);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000] border-b border-[#d4c59d]/30 shadow-2xl">
      {/* Top contact bar */}
      <div className="bg-[#000000] border-b border-[#d4c59d]/20 text-xs text-[#d4c59d] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <a 
              href={`tel:${contact.phone.replace(/\s+/g, '')}`} 
              className="flex items-center gap-1.5 text-[#d4c59d] hover:text-[#f5f0e6] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4c59d]" />
              <span className="tracking-wider">{contact.phone}</span>
            </a>
            <a 
              href={`mailto:${contact.email}`} 
              className="flex items-center gap-1.5 text-[#d4c59d] hover:text-[#f5f0e6] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#d4c59d]" />
              <span>{contact.email}</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-[#9e9174]">
              <MapPin className="w-3.5 h-3.5 text-[#d4c59d]" />
              <span>{contact.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* WhatsApp Link strictly solid color with no border frame */}
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Turath%20Egypt%2C%20I%20am%20interested%20in%20your%20handcrafted%20brass%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] px-3.5 py-1 rounded-full bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors font-bold uppercase tracking-wider"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
            <span className="text-[#5c533e] hidden sm:inline">|</span>
            <span className="text-[11px] tracking-widest text-[#d4c59d] uppercase hidden sm:inline font-semibold">
              Worldwide Shipping
            </span>

            {/* Download ZIP button (Admin only) */}
            {isAdmin && onOpenDownloadZip && (
              <>
                <span className="text-[#5c533e] hidden sm:inline">|</span>
                <button
                  onClick={onOpenDownloadZip}
                  className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors font-medium cursor-pointer"
                  title="تحميل كافة ملفات الموقع ZIP"
                >
                  <Download className="w-3 h-3 text-[#d4c59d]" />
                  <span>تحميل الموقع ZIP</span>
                </button>
              </>
            )}

            {onOpenAdminLogin && !isAdmin && (
              <>
                <span className="text-[#5c533e] hidden sm:inline">|</span>
                <button
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1 text-[11px] text-[#9e9174] hover:text-[#d4c59d] transition-colors font-arabic cursor-pointer"
                  title="تسجيل دخول الإدارة (Admin Login)"
                >
                  <Lock className="w-3 h-3" />
                  <span className="hidden md:inline">دخول الإدارة</span>
                </button>
              </>
            )}

            {isAdmin && onAdminLogout && (
              <>
                <span className="text-[#5c533e] hidden sm:inline">|</span>
                <button
                  onClick={onAdminLogout}
                  className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors font-arabic cursor-pointer"
                  title="تسجيل خروج من وضع الإدارة"
                >
                  <LogOut className="w-3 h-3" />
                  <span>خروج</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleNavClick('home')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavClick('home');
                }
              }}
              className="flex items-center text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4c59d] rounded-md transition-transform hover:scale-[1.02]"
              aria-label="Turath Home"
            >
              <TurathLogo 
                size="md" 
                allowHoverChange={isAdmin} 
                onOpenChangeLogo={isAdmin ? onOpenChangeLogo : undefined}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors rounded-md ${
                currentView === 'home' && !selectedCategory
                  ? 'text-[#000000] bg-[#d4c59d]'
                  : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#141414]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors rounded-md ${
                currentView === 'about'
                  ? 'text-[#000000] bg-[#d4c59d]'
                  : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#141414]'
              }`}
            >
              About Us
            </button>

            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors rounded-md inline-flex items-center gap-1.5 ${
                  currentView === 'products' || selectedCategory
                    ? 'text-[#000000] bg-[#d4c59d]'
                    : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#141414]'
                }`}
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {productsDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-[540px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-[#000000] border border-[#d4c59d] rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.95)] p-5">
                    <div className="flex items-center justify-between border-b border-[#d4c59d]/20 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#d4c59d]" />
                        <span className="font-serif-luxury text-xs font-bold uppercase tracking-widest text-[#d4c59d]">
                          {activeCategories.length} Handcrafted Collections
                        </span>
                      </div>
                      <button
                        onClick={() => handleNavClick('products')}
                        className="px-3 py-1 rounded text-xs bg-[#d4c59d] text-[#000000] font-bold uppercase"
                      >
                        View All Collections
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                      {activeCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick('category', cat.id)}
                          className={`text-left p-2.5 rounded-lg transition-all flex items-start justify-between group ${
                            selectedCategory === cat.id
                              ? 'bg-[#d4c59d] text-[#000000]'
                              : 'bg-[#141414] hover:bg-[#222222] text-[#f5f0e6]'
                          }`}
                        >
                          <div>
                            <div className={`text-xs font-bold ${selectedCategory === cat.id ? 'text-[#000000]' : 'text-[#f5f0e6] group-hover:text-[#d4c59d]'}`}>
                              {cat.name}
                            </div>
                            <div className={`text-[10px] mt-0.5 line-clamp-1 ${selectedCategory === cat.id ? 'text-[#000000]/80' : 'text-[#9e9174]'}`}>
                              {cat.shortDesc}
                            </div>
                          </div>
                          <span className={`text-[11px] font-arabic ml-2 flex-shrink-0 ${selectedCategory === cat.id ? 'text-[#000000]' : 'text-[#d4c59d]'}`}>
                            {cat.nameArabic}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('custom')}
              className={`px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors rounded-md ${
                currentView === 'custom'
                  ? 'text-[#000000] bg-[#d4c59d]'
                  : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#141414]'
              }`}
            >
              Custom Fabrication
            </button>

            <button
              onClick={() => handleNavClick('why-us')}
              className={`px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors rounded-md ${
                currentView === 'why-us'
                  ? 'text-[#000000] bg-[#d4c59d]'
                  : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#141414]'
              }`}
            >
              Why Turath
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors rounded-md ${
                currentView === 'contact'
                  ? 'text-[#000000] bg-[#d4c59d]'
                  : 'text-[#d4c59d] hover:text-[#f5f0e6] hover:bg-[#141414]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Action CTAs in exact solid colors with NO border frames */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {/* Admin-only editing buttons */}
            {isAdmin && (
              <>
                {/* Direct Edit Category Covers Button */}
                {onOpenEditCategoryCovers && (
                  <button
                    onClick={onOpenEditCategoryCovers}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#161616] border border-[#d4c59d]/80 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-all"
                    title="Edit cover photos of the 11 handcrafted categories"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Edit Covers</span>
                  </button>
                )}

                {/* Direct Change/Replace Logo Button */}
                {onOpenChangeLogo && (
                  <button
                    onClick={onOpenChangeLogo}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
                    title="Replace website logo with your original file"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Replace Logo</span>
                  </button>
                )}

                {/* Direct Add/Edit Product Photos & Videos Button */}
                <button
                  onClick={() => onOpenProductEditor(selectedCategory || undefined)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all"
                  title="Add or edit product photos, videos, and specifications"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add / Edit Products</span>
                </button>
              </>
            )}

            {/* Solid Logo Gold Request Quote button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] active:scale-95 transition-all shadow"
            >
              Request Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {isAdmin && (
              <button
                onClick={() => onOpenProductEditor(selectedCategory || undefined)}
                className="p-2 text-xs font-bold bg-[#d4c59d] text-[#000000] rounded-md"
                title="Add or edit products"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#d4c59d] hover:text-[#f5f0e6] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#d4c59d]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d4c59d]/30 bg-[#000000] px-4 py-6 space-y-4 shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold tracking-wider uppercase ${
              currentView === 'home' && !selectedCategory ? 'bg-[#d4c59d] text-[#000000]' : 'text-[#d4c59d]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold tracking-wider uppercase ${
              currentView === 'about' ? 'bg-[#d4c59d] text-[#000000]' : 'text-[#d4c59d]'
            }`}
          >
            About Us
          </button>

          {/* Mobile Categories Accordion */}
          <div className="space-y-2 pl-2 border-l-2 border-[#d4c59d]/40">
            <div className="flex items-center justify-between text-xs font-bold text-[#d4c59d] uppercase tracking-wider px-2 py-1">
              <span>Our Collections</span>
              <button
                onClick={() => handleNavClick('products')}
                className="px-2 py-0.5 rounded text-[11px] bg-[#d4c59d] text-[#000000] font-bold"
              >
                Browse All
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick('category', cat.id)}
                  className={`text-left px-2.5 py-1.5 text-xs rounded flex items-center justify-between ${
                    selectedCategory === cat.id ? 'bg-[#d4c59d] text-[#000000] font-bold' : 'text-[#f5f0e6] hover:bg-[#141414]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-arabic ${selectedCategory === cat.id ? 'text-[#000000]' : 'text-[#d4c59d]'}`}>{cat.nameArabic}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNavClick('custom')}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold tracking-wider uppercase ${
              currentView === 'custom' ? 'bg-[#d4c59d] text-[#000000]' : 'text-[#d4c59d]'
            }`}
          >
            Custom Manufacturing
          </button>
          <button
            onClick={() => handleNavClick('why-us')}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold tracking-wider uppercase ${
              currentView === 'why-us' ? 'bg-[#d4c59d] text-[#000000]' : 'text-[#d4c59d]'
            }`}
          >
            Why Turath
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-bold tracking-wider uppercase ${
              currentView === 'contact' ? 'bg-[#d4c59d] text-[#000000]' : 'text-[#d4c59d]'
            }`}
          >
            Contact Us
          </button>

          <div className="pt-3 border-t border-[#d4c59d]/20 flex flex-col gap-2">
            {isAdmin && (
              <>
                {onOpenEditCategoryCovers && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenEditCategoryCovers();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#161616] border border-[#d4c59d] text-[#d4c59d]"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>تعديل صور الأقسام (Edit Covers)</span>
                  </button>
                )}
                {onOpenChangeLogo && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenChangeLogo();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000]"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Replace Website Logo</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProductEditor(selectedCategory || undefined);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add / Edit My Products</span>
                </button>
              </>
            )}
            {isAdmin && onOpenDownloadZip && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDownloadZip();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#161616] border border-[#d4c59d] text-[#d4c59d]"
              >
                <Download className="w-4 h-4" />
                <span>تحميل ملفات الموقع (ZIP)</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#d4c59d] text-[#000000]"
            >
              Request a Project Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
