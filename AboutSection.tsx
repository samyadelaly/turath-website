import React from 'react';
import { SiteContent, getStoredSiteContent } from './siteContentStorage';
import { 
  Sparkles, 
  Target, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  HeartHandshake, 
  Lightbulb, 
  Leaf, 
  Award, 
  Hammer 
} from 'lucide-react';

interface AboutSectionProps {
  content?: SiteContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const activeContent = content || getStoredSiteContent();
  const about = activeContent.about;
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
    <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main About Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4c59d] text-xs font-bold uppercase tracking-wider text-[#000000]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Heritage & Passion</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] leading-tight">
              {about.title}
            </h2>

            <p className="text-base sm:text-lg text-[#d4c59d] leading-relaxed">
              {about.storyPart1}
            </p>

            <p className="text-sm sm:text-base text-[#9e9174] leading-relaxed">
              {about.storyPart2}
            </p>

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

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4c59d] shadow-2xl bg-[#000000]">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
                alt="Turath Handcrafted Brass Egyptian Artistry"
                className="w-full h-96 sm:h-[460px] object-cover"
              />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#000000]/90 border border-[#d4c59d]">
                <div className="text-xs uppercase tracking-widest text-[#d4c59d] font-bold">
                  The Heart of Cairo
                </div>
                <div className="text-sm font-serif-luxury text-[#f5f0e6] font-bold mt-0.5">
                  Gamaliya Street Artisan Workshops
                </div>
                <p className="text-[11px] text-[#9e9174] mt-1">
                  Crafting Timeless Brass & Copper Excellence from Egypt for global architectural destinations.
                </p>
              </div>
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
