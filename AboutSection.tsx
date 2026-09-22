import React from 'react';
import { SiteContent, getStoredSiteContent, DEFAULT_ABOUT_IMAGE } from './siteContentStorage';
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
  const currentPhoto = activeContent.aboutImage || activeContent.about?.image || DEFAULT_ABOUT_IMAGE;

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
      name: 'Quality',
      desc: 'Uncompromising standard of solid raw Egyptian brass, pure red copper, heavy gauge metals, and enduring architectural finishes.',
      icon: Award,
    },
    {
      name: 'Craftsmanship',
      desc: 'Honoring ancestral techniques from Gamaliya Street with hand-chiseled repoussé and fine openwork filigree.',
      icon: Hammer,
    },
    {
      name: 'Integrity',
      desc: 'Transparent collaboration, truthful specifications, precision timelines, and honest craftsmanship.',
      icon: ShieldCheck,
    },
    {
      name: 'Innovation',
      desc: 'Marrying historic Islamic & Pharaoh-inspired geometry with contemporary architectural lighting and ergonomics.',
      icon: Lightbulb,
    },
    {
      name: 'Customer Satisfaction',
      desc: 'Tailored dimensions, personalized consultations, bespoke finishes, and attentive global support.',
      icon: HeartHandshake,
    },
    {
      name: 'Sustainability',
      desc: '100% recyclable noble metals, non-toxic artisanal wax patinas, and heirloom pieces built to last lifetimes.',
      icon: Leaf,
    },
  ];

  return (
    <section id="about-section" className="pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14 lg:space-y-16">
        {/* Main About Story with Luxury Framed Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] leading-tight">
              About Turath
            </h2>

            <p className="text-base sm:text-lg text-[#d4c59d] leading-relaxed">
              Turath is an Egyptian craftsmanship brand specializing in handcrafted brass and copper products, where traditional metalworking meets creativity and contemporary design.
            </p>

            <p className="text-sm sm:text-base text-[#9e9174] leading-relaxed">
              Founded in Cairo, Turath creates distinctive pieces for residential, hospitality, commercial, and architectural spaces.
            </p>

            <p className="text-sm sm:text-base text-[#9e9174] leading-relaxed">
              From lighting and mirrors to furniture, decorative pieces, and custom metalwork, every creation reflects a balance between craftsmanship, artistic vision, and attention to detail.
            </p>

            <div className="pt-1">
              <p className="font-serif-luxury text-base sm:text-lg font-bold text-[#d4c59d] tracking-wide">
                Handmade in Egypt.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#d4c59d]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4c59d]" />
                Historic Gamaliya Workshops
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4c59d]" />
                Palace & Luxury Hospitality Projects
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4c59d]" />
                Worldwide Custom Fabrication
              </span>
            </div>
          </div>

          {/* Photo Column - Same style, options, framing and edit capability as entire website */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4c59d] shadow-2xl bg-[#000000] group/aboutphoto">
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
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover/aboutphoto:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center cursor-pointer p-4 text-center"
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
                containerClassName="w-full bg-black max-h-[620px]"
                imageClassName="transition-transform duration-700 group-hover/aboutphoto:scale-105"
              >
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#000000]/90 border border-[#d4c59d] z-10">
                  <div className="text-sm font-serif-luxury text-[#f5f0e6] font-bold">
                    HANDCRAFTED IN CAIRO
                  </div>
                  <p className="text-[11px] text-[#9e9174] mt-1">
                    TIMELESS BRASS & COPPER ARTISANSHIP
                  </p>
                </div>
              </TurathImage>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 rounded-2xl bg-[#000000] border border-[#d4c59d] shadow-xl relative overflow-hidden group hover:border-[#d4c59d] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#f5f0e6]">
                Our Mission
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#d4c59d] leading-relaxed">
              "{about.mission}"
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-2xl bg-[#000000] border border-[#d4c59d] shadow-xl relative overflow-hidden group hover:border-[#d4c59d] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000]">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#f5f0e6]">
                Our Vision
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#d4c59d] leading-relaxed">
              "{about.vision}"
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs uppercase tracking-widest text-[#d4c59d] font-bold">
              Guiding Principles
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6]">
              Our Core Values
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9174]">
              The foundations that inspire every hammer stroke, chiseled line, and finished brass piece at Turath.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.name}
                  className="p-6 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-all shadow-md group"
                >
                  <div className="p-2.5 w-fit rounded-lg bg-[#d4c59d] text-[#000000] mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#f5f0e6] mb-2 group-hover:text-[#d4c59d] transition-colors">
                    {val.name}
                  </h4>
                  <p className="text-xs text-[#9e9174] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
