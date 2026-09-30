import React from 'react';
import { SiteContent, getStoredSiteContent, ensureSiteContentSections, DEFAULT_SITE_CONTENT } from './siteContentStorage';
import { 
  Hammer, 
  ShieldCheck, 
  Palette, 
  Sparkle, 
  Globe2, 
  Eye, 
  HeadphonesIcon, 
  Building2 
} from 'lucide-react';

interface WhyChooseUsSectionProps {
  content?: SiteContent;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ content }) => {
  const activeContent = content ? ensureSiteContentSections(content) : getStoredSiteContent();
  const whyUs = activeContent.whyUs || DEFAULT_SITE_CONTENT.whyUs!;
  const points = [
    {
      title: 'Handmade by skilled craftsmen',
      desc: 'Formed, chiseled, and pierced by generational artisans in Gamaliya Street, preserving authentic Egyptian metalworking traditions.',
      icon: Hammer,
    },
    {
      title: 'Premium brass and metal materials',
      desc: 'We utilize exclusively heavy-gauge solid brass, virgin copper alloys, and archival metals without shortcuts.',
      icon: ShieldCheck,
    },
    {
      title: 'Custom design and manufacturing',
      desc: 'Complete bespoke flexibility: submit your sketch, architectural CAD drawing, or photo for customized fabrication.',
      icon: Palette,
    },
    {
      title: 'High-quality finishing',
      desc: 'Multiple luxury finishes including natural antique patina, mirror-polished gold, brushed champagne, and aged bronze.',
      icon: Sparkle,
    },
    {
      title: 'Worldwide shipping',
      desc: 'Export-grade protective wooden crating, insured door-to-door delivery, and comprehensive logistics worldwide.',
      icon: Globe2,
    },
    {
      title: 'Attention to every detail',
      desc: 'Every bevel, pierced star shadow, soldered joint, and mounting fixture undergoes rigorous quality control inspections.',
      icon: Eye,
    },
    {
      title: 'Reliable customer support',
      desc: 'Direct communication with our technical team in Cairo via phone, email, and WhatsApp throughout your project journey.',
      icon: HeadphonesIcon,
    },
    {
      title: 'Suitable for residential and commercial projects',
      desc: 'Proven capability equipping private luxury villas, royal suites, boutique hotels, high-end restaurants, and corporate headquarters.',
      icon: Building2,
    },
  ];

  return (
    <section id="why-us-section" className="pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6]">
            {whyUs.title || 'Why Choose Turath?'}
          </h2>

          <p className="text-sm sm:text-base text-[#d4c59d]">
            {whyUs.subtitle || 'Authentic Egyptian handcrafted brass, copper, and decorative metalwork.'}
          </p>
        </div>

        {/* 8 Distinct Pillars in solid black and gold */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className="p-5 sm:p-6 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-all duration-300 shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="p-1.5 rounded-md bg-[#d4c59d] text-[#000000] flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-serif-luxury text-base font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors leading-snug">
                      {pt.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#9e9174] leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
