import React from 'react';
import { SiteContent, getStoredSiteContent, DEFAULT_ABOUT_IMAGE, isElementVisible } from './siteContentStorage';
import { computeImageRatio } from './imageRatioUtils';
import { TurathImage } from "./TurathImage";
import { 
  Target, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  HeartHandshake, 
  Lightbulb, 
  Leaf, 
  Award, 
  Hammer,
  Camera
} from 'lucide-react';

interface AboutSectionProps {
  content?: SiteContent;
  isAdmin?: boolean;
  onOpenChangePhoto?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  content,
  isAdmin = false,
  onOpenChangePhoto,
}) => {
  const activeContent = content || getStoredSiteContent();
  const about = activeContent.about || (activeContent as any);
  const rawPhoto = activeContent.aboutImage || activeContent.about?.image || DEFAULT_ABOUT_IMAGE;
  // Ensure we use the authentic local craft image if unsplash placeholder is active
  const currentPhoto = (!rawPhoto || rawPhoto.includes('unsplash.com')) ? '/turath_craftsmanship_relief.jpg' : rawPhoto;

  const ratioConfig = {
    ratio: activeContent.aboutImageRatio || 'Original',
    customWidth: activeContent.aboutImageCustomWidth,
    customHeight: activeContent.aboutImageCustomHeight,
    fit: (activeContent.aboutImageFit || 'cover') as 'cover' | 'contain',
    position: activeContent.aboutImagePosition || 'center',
  };
  const computedRatio = computeImageRatio(ratioConfig);

  const values = [
    {
      num: '01',
      name: 'Uncompromising Quality',
      desc: 'Solid raw Egyptian brass, pure red copper, heavy-gauge architectural alloys, and enduring hand-sealed patinas.',
      icon: Award,
    },
    {
      num: '02',
      name: 'Generational Craftsmanship',
      desc: 'Ancestral lineages from historic Gamaliya executing manual repoussé, chisel etching, and pierced filigree.',
      icon: Hammer,
    },
    {
      num: '03',
      name: 'Archival Integrity',
      desc: 'Truthful metal specifications, structural engineering, precision timelines, and honest collaboration.',
      icon: ShieldCheck,
    },
    {
      num: '04',
      name: 'Geometric Innovation',
      desc: 'Uniting Fatimid & Mamluk historic geometry with modern architectural ergonomics and contemporary lighting.',
      icon: Lightbulb,
    },
    {
      num: '05',
      name: 'Bespoke Consultation',
      desc: 'Tailored dimensions, custom architectural patinas, dedicated engineering support, and worldwide delivery.',
      icon: HeartHandshake,
    },
    {
      num: '06',
      name: 'Enduring Sustainability',
      desc: '100% recyclable noble metals, non-toxic artisanal wax seals, and heirloom masterworks built for generations.',
      icon: Leaf,
    },
  ];

  return (
    <section id="about-section" className="py-20 sm:py-24 lg:py-32 px-6 sm:px-12 bg-[#020202] border-b border-[#d4c59d]/20 relative overflow-hidden">
      {/* Subtle radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,197,157,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24 relative">
        {/* Main About Story with Museum Framed Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              {isElementVisible(activeContent, 'aboutBadge') && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4c59d]/25 bg-[#0a0a08] text-[#d4c59d] text-[10px] sm:text-xs font-mono tracking-widest uppercase">
                  <span>✧</span>
                  <span>{activeContent.aboutBadge || 'HERITAGE & ATELIER • تَارِيخٌ وَأَصَالَةٌ'}</span>
                </div>
              )}

              {isElementVisible(activeContent, 'aboutTitle') && (
                <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#f5f0e6] tracking-tight leading-[1.15]">
                  {activeContent.aboutTitle || 'About Turath'}
                  <span className="block font-sans text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#d4c59d] mt-2 font-medium">
                    Atelier de Gamaliya • Cairo, Egypt
                  </span>
                </h2>
              )}
            </div>

            {isElementVisible(activeContent, 'aboutParagraphs') && (
              <>
                <p className="text-base sm:text-lg text-[#d4c59d] font-normal leading-relaxed border-l-2 border-[#d4c59d]/40 pl-4 py-1">
                  {activeContent.aboutParagraph1 || 'Turath is an Egyptian craftsmanship brand specializing in handcrafted brass and copper products, where traditional metalworking meets creativity and contemporary design.'}
                </p>

                <div className="space-y-4 text-sm sm:text-base text-[#9e9174] font-light leading-relaxed">
                  <p>
                    {activeContent.aboutParagraph2 || 'Founded in Cairo, Turath creates distinctive pieces for residential, hospitality, commercial, and architectural spaces.'}
                  </p>
                  <p>
                    {activeContent.aboutParagraph3 || 'From lighting and mirrors to furniture, decorative pieces, and custom metalwork, every creation reflects a balance between craftsmanship, artistic vision, and attention to detail.'}
                  </p>
                </div>
              </>
            )}

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-[#d4c59d]">
              <span className="flex items-center gap-2 bg-[#080806] px-3 py-1.5 rounded-full border border-[#d4c59d]/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4c59d]" />
                Historic Gamaliya Workshops
              </span>
              <span className="flex items-center gap-2 bg-[#080806] px-3 py-1.5 rounded-full border border-[#d4c59d]/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4c59d]" />
                Palace & Luxury Hospitality
              </span>
              <span className="flex items-center gap-2 bg-[#080806] px-3 py-1.5 rounded-full border border-[#d4c59d]/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4c59d]" />
                Worldwide Custom Fabrication
              </span>
            </div>
          </div>

          {/* Photo Column - Gallery Framed Photo */}
          {isElementVisible(activeContent, 'aboutImage') && (
            <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-[#d4c59d]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#0a0a08] group/aboutphoto">
              {/* Subtle top gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4c59d] to-transparent z-10 opacity-70" />

              {/* Admin Direct Edit Button */}
              {isAdmin && onOpenChangePhoto && (
                <button
                  type="button"
                  onClick={onOpenChangePhoto}
                  className="absolute top-4 right-4 z-30 px-3.5 py-1.5 rounded-full bg-[#000000]/85 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d] backdrop-blur-md text-xs font-bold transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
                  title="تعديل وتأطير صورة قصة تراث (Image Ratio & Framing)"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>تعديل وتأطير الصورة</span>
                </button>
              )}

              {/* Admin Clickable Hover Overlay */}
              {isAdmin && onOpenChangePhoto && (
                <div
                  onClick={onOpenChangePhoto}
                  className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover/aboutphoto:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                >
                  <div className="p-3 rounded-full bg-[#d4c59d] text-black mb-2 shadow-2xl transform scale-90 group-hover/aboutphoto:scale-100 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-[#f5f0e6] font-serif-luxury">انقر لتعديل وتأطير صورة قصة تراث</span>
                  <span className="text-xs text-[#d4c59d] mt-1 font-mono">
                    Ratio: {ratioConfig.ratio} ({ratioConfig.fit})
                  </span>
                </div>
              )}

              <TurathImage
                src={currentPhoto}
                alt="Turath - Authentic Egyptian Handcrafted Brass & Copper Craftsmanship"
                computedRatio={computedRatio}
                containerClassName="w-full bg-[#0a0a08] max-h-[620px]"
                imageClassName="transition-transform duration-700 group-hover/aboutphoto:scale-105"
              >
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-lg bg-[#000000]/85 border border-[#d4c59d]/40 backdrop-blur-md z-10">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4c59d] font-semibold">
                    HANDCRAFTED IN CAIRO
                  </div>
                  <p className="text-[10px] text-[#9e9174] uppercase tracking-widest mt-0.5">
                    TIMELESS SOLID BRASS & COPPER ARTISANSHIP
                  </p>
                </div>
              </TurathImage>
            </div>
          </div>
          )}
        </div>

        {/* Curatorial Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Mission */}
          <div className="turath-textbox p-6 sm:p-8 rounded-xl border border-[#d4c59d]/20 hover:border-[#d4c59d]/50 transition-colors shadow-lg relative overflow-hidden space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4c59d]/15 border border-[#d4c59d]/40 text-[#d4c59d] flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4c59d]">MANIFESTO</span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f5f0e6]">
                  Our Mission
                </h3>
              </div>
            </div>
            <blockquote className="text-sm sm:text-base text-[#e6d8b5] font-light leading-relaxed italic border-l border-[#d4c59d]/30 pl-3">
              "{about.mission || 'Preserving millennia of Egyptian brass and copper artistry while engineering architectural-grade lighting and bespoke fixtures for distinguished spaces worldwide.'}"
            </blockquote>
          </div>

          {/* Vision */}
          <div className="turath-textbox p-6 sm:p-8 rounded-xl border border-[#d4c59d]/20 hover:border-[#d4c59d]/50 transition-colors shadow-lg relative overflow-hidden space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4c59d]/15 border border-[#d4c59d]/40 text-[#d4c59d] flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4c59d]">ASPIRATION</span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f5f0e6]">
                  Our Vision
                </h3>
              </div>
            </div>
            <blockquote className="text-sm sm:text-base text-[#e6d8b5] font-light leading-relaxed italic border-l border-[#d4c59d]/30 pl-3">
              "{about.vision || 'To be the globally recognized benchmark for luxury Egyptian brass, copper, and decorative metal craftsmanship, elevating traditional Gamaliya artisan lineages onto the international architectural stage.'}"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
