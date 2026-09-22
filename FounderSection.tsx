import React from 'react';
import { SiteContent, getStoredSiteContent, DEFAULT_ABOUT_IMAGE } from './siteContentStorage';
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
  const currentPhoto = activeContent.founderImage || activeContent.aboutImage || DEFAULT_ABOUT_IMAGE;

  const ratioConfig = {
    ratio: activeContent.founderImageRatio || activeContent.aboutImageRatio || 'Original',
    customWidth: activeContent.founderImageCustomWidth || activeContent.aboutImageCustomWidth,
    customHeight: activeContent.founderImageCustomHeight || activeContent.aboutImageCustomHeight,
    fit: (activeContent.founderImageFit || activeContent.aboutImageFit || 'cover') as 'cover' | 'contain',
    position: activeContent.founderImagePosition || activeContent.aboutImagePosition || 'center',
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
    <section id="founder-section" className="pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14 lg:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] leading-tight">
              FOUNDER
            </h2>

            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#d4c59d] font-semibold tracking-wide">
              {founderTitle}
            </h3>

            <p className="text-base sm:text-lg text-[#d4c59d] leading-relaxed">
              {p1}
            </p>

            <p className="text-sm sm:text-base text-[#9e9174] leading-relaxed">
              {p2}
            </p>

            <p className="text-sm sm:text-base text-[#9e9174] leading-relaxed">
              {p3}
            </p>
          </div>

          {/* Photo Column - Preserving existing image and frame design */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4c59d] shadow-2xl bg-[#000000] group/founderphoto">
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
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover/founderphoto:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center cursor-pointer p-4 text-center"
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
                containerClassName="w-full bg-black max-h-[620px]"
                imageClassName="transition-transform duration-700 group-hover/founderphoto:scale-105"
              >
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#000000]/90 border border-[#d4c59d] z-10">
                  <div className="text-sm font-serif-luxury text-[#f5f0e6] font-bold">
                    SAMY ADEL ABDALLAH
                  </div>
                  <p className="text-[11px] text-[#9e9174] mt-1">
                    FOUNDER / CREATIVE DIRECTOR
                  </p>
                </div>
              </TurathImage>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
