import React from 'react';
import { SiteContent, getStoredSiteContent, DEFAULT_ABOUT_IMAGE, isElementVisible } from './siteContentStorage';
import { computeImageRatio } from './imageRatioUtils';
import { TurathImage } from "./TurathImage";
import { Camera } from 'lucide-react';

interface FounderSectionProps {
  content?: SiteContent;
  isAdmin?: boolean;
  onOpenChangePhoto?: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ 
  content,
  isAdmin = false,
  onOpenChangePhoto,
}) => {
  const activeContent = content || getStoredSiteContent();
  const rawPhoto = activeContent.founderImage || activeContent.aboutImage || DEFAULT_ABOUT_IMAGE;
  // Ensure we use the authentic local founder portrait if unsplash placeholder is active
  const currentPhoto = (!rawPhoto || rawPhoto.includes('unsplash.com')) ? '/founder_photo.jpg' : rawPhoto;

  const ratioConfig = {
    ratio: (activeContent.founderImageRatio && activeContent.founderImageRatio !== 'Original')
      ? activeContent.founderImageRatio
      : '4:5',
    customWidth: activeContent.founderImageCustomWidth || 4,
    customHeight: activeContent.founderImageCustomHeight || 5,
    fit: (activeContent.founderImageFit || 'cover') as 'cover' | 'contain',
    position: activeContent.founderImagePosition || 'center',
  };
  const computedRatio = computeImageRatio(ratioConfig);

  const founderTitle = activeContent.founderTitle && activeContent.founderTitle !== 'From Graphic Design to Metal Craft'
    ? activeContent.founderTitle
    : 'FROM GRAPHIC DESIGN & MARKETING TO BRASS & COPPER CRAFTSMANSHIP';

  const p1 = activeContent.founderParagraph1 && !activeContent.founderParagraph1.includes('Modern Academy')
    ? activeContent.founderParagraph1
    : 'Samy Adel Abdallah, founder of Turath, graduated in Computer Science in 2000 and began his career in marketing.';

  const p2 = activeContent.founderParagraph2 && !activeContent.founderParagraph2.includes('composition, and visual detail')
    ? activeContent.founderParagraph2
    : 'His creative mindset and passion for design shaped his approach to brass and copper, combining craftsmanship with artistic vision.';

  const p3 = activeContent.founderParagraph3 && !activeContent.founderParagraph3.includes('beginning a journey that brings together')
    ? activeContent.founderParagraph3
    : 'In 2016, he founded Turath, turning an idea into a journey of creativity, craftsmanship, and Egyptian design.';

  return (
    <section id="founder-section" className="py-20 sm:py-24 lg:py-32 px-6 sm:px-12 bg-[#050505] border-b border-[#d4c59d]/20 relative overflow-hidden">
      {/* Subtle atmospheric vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,197,157,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text Column */}
          <div className={`${isElementVisible(activeContent, 'founderImage') ? 'lg:col-span-7' : 'lg:col-span-10 max-w-4xl mx-auto'} space-y-6 sm:space-y-8`}>
            <div className="space-y-3">
              {isElementVisible(activeContent, 'founderBadge') && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4c59d]/25 bg-[#0a0a08] text-[#d4c59d] text-[10px] sm:text-xs font-mono tracking-widest uppercase">
                  <span>✧</span>
                  <span>LEADERSHIP & ART DIRECTION • رُؤْيَةٌ قِيَادِيَّةٌ</span>
                </div>
              )}

              {(isElementVisible(activeContent, 'founderName') || isElementVisible(activeContent, 'founderRole')) && (
                <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#f5f0e6] tracking-tight leading-[1.15]">
                  {isElementVisible(activeContent, 'founderName') && (activeContent.founderName || 'Samy Adel Abdallah')}
                  {isElementVisible(activeContent, 'founderRole') && (
                    <span className="block font-sans text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#d4c59d] mt-2 font-medium">
                      {activeContent.founderRole || 'Founder & Creative Director • مُؤَسِّسُ وَمُدِيرُ الْإِبْدَاعِ'}
                    </span>
                  )}
                </h2>
              )}
            </div>

            {isElementVisible(activeContent, 'founderTitle') && (
              <div className="border-l-2 border-[#d4c59d]/40 pl-4 py-1">
                <h3 className="font-serif-luxury text-base sm:text-lg text-[#e6d8b5] font-normal tracking-wide uppercase">
                  {founderTitle}
                </h3>
              </div>
            )}

            {isElementVisible(activeContent, 'founderParagraphs') && (
              <div className="space-y-4 text-sm sm:text-base text-[#9e9174] leading-relaxed font-light">
                <p className="text-[#d4c59d]/90 font-normal leading-relaxed">
                  {p1}
                </p>
                <p>
                  {p2}
                </p>
                <p>
                  {p3}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center gap-6 border-t border-[#d4c59d]/15 text-xs text-[#d4c59d]">
              <div>
                <span className="text-[10px] font-mono text-[#9e9174] uppercase tracking-widest block">DISCIPLINE</span>
                <span className="font-medium text-[#f5f0e6]">Egyptian Metalcraft & Design</span>
              </div>
              <div className="h-6 w-px bg-[#d4c59d]/20" />
              <div>
                <span className="text-[10px] font-mono text-[#9e9174] uppercase tracking-widest block">ATELIER FOUNDED</span>
                <span className="font-medium text-[#f5f0e6]">2016 • Cairo, Egypt</span>
              </div>
            </div>
          </div>

          {/* Portrait Column - Gallery Framed Portrait */}
          {isElementVisible(activeContent, 'founderImage') && (
          <div className="lg:col-span-5 relative">
            <div className="turath-photo-container relative rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] group/founderphoto">
              {/* Subtle top gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4c59d] to-transparent z-10 opacity-70" />

              {/* Admin Direct Edit Button */}
              {isAdmin && onOpenChangePhoto && (
                <button
                  type="button"
                  onClick={onOpenChangePhoto}
                  className="absolute top-4 right-4 z-30 px-3.5 py-1.5 rounded-full bg-[#000000]/85 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d] backdrop-blur-md text-xs font-bold transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
                  title="تعديل وتأطير صورة المؤسس (Image Ratio & Framing)"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>تعديل وتأطير الصورة</span>
                </button>
              )}

              {/* Admin Clickable Hover Overlay */}
              {isAdmin && onOpenChangePhoto && (
                <div
                  onClick={onOpenChangePhoto}
                  className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover/founderphoto:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                >
                  <div className="p-3 rounded-full bg-[#d4c59d] text-black mb-2 shadow-2xl transform scale-90 group-hover/founderphoto:scale-100 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-[#f5f0e6] font-serif-luxury">انقر لتعديل وتأطير صورة المؤسس</span>
                  <span className="text-xs text-[#d4c59d] mt-1 font-mono">
                    Ratio: {ratioConfig.ratio} ({ratioConfig.fit})
                  </span>
                </div>
              )}

              <TurathImage
                src={currentPhoto}
                alt="Samy Adel Abdallah - Founder & Creative Director of Turath"
                computedRatio={computedRatio}
                containerClassName="w-full bg-[#0a0a08] min-h-[440px] sm:min-h-[500px] max-h-[620px]"
                imageClassName="transition-transform duration-700 group-hover/founderphoto:scale-105 filter grayscale contrast-110"
              >
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-lg bg-[#000000]/85 border border-[#d4c59d]/40 backdrop-blur-md z-10">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4c59d] font-semibold">
                    SAMY ADEL ABDALLAH
                  </div>
                  <p className="text-[10px] text-[#9e9174] uppercase tracking-widest mt-0.5">
                    FOUNDER & CREATIVE DIRECTOR • CAIRO
                  </p>
                </div>
              </TurathImage>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};
