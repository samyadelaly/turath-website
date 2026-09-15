import React from 'react';
import { SiteContent, getStoredSiteContent } from './siteContentStorage';
import { 
  Sparkles, 
  Check, 
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
  const activeContent = content || getStoredSiteContent();
  const whyUs = activeContent.whyUs;
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
    <section id="why-us-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4c59d] text-xs font-bold uppercase tracking-wider text-[#000000]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Turath Distinction</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6]">
            {whyUs.title}
          </h2>

          <p className="text-sm sm:text-base text-[#d4c59d]">
            {whyUs.subtitle}
          </p>
        </div>

        {/* 8 Distinct Pillars in solid black and gold */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className="p-6 rounded-xl bg-[#000000] border border-[#d4c59d]/30 hover:border-[#d4c59d] transition-all duration-300 shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-[#d4c59d] text-[#000000] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#d4c59d] text-[#000000] flex items-center justify-center text-xs font-bold">
                      <Check className="w-3.5 h-3.5 text-[#000000]" />
                    </span>
                  </div>

                  <h3 className="font-serif-luxury text-base font-bold text-[#f5f0e6] mb-2 group-hover:text-[#d4c59d] transition-colors leading-snug">
                    {pt.title}
                  </h3>

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
