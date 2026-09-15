import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Ruler, 
  Hammer, 
  PackageCheck, 
  ArrowRight, 
  MessageCircle 
} from 'lucide-react';

interface CustomManufacturingSectionProps {
  onStartCustomProject: () => void;
}

export const CustomManufacturingSection: React.FC<CustomManufacturingSectionProps> = ({
  onStartCustomProject,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Share Your Inspiration',
      desc: 'Send us your architectural drawing, sketch, photo reference, or dimensional requirements.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Engineering & Finishes',
      desc: 'Our master craftsmen review structural tolerances and recommend ideal Egyptian brass, copper alloys, and decorative metal finishes.',
      icon: Ruler,
    },
    {
      step: '03',
      title: 'Artisanal Gamaliya Forging',
      desc: 'Your piece is hand-spun, chased, perforated, and assembled in our historic Cairo workshop with progress updates.',
      icon: Hammer,
    },
    {
      step: '04',
      title: 'Inspection & Global Delivery',
      desc: 'White-glove quality assurance, custom-built wooden export crates, and insured international shipping.',
      icon: PackageCheck,
    },
  ];

  return (
    <section id="custom-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#000000] border-b border-[#d4c59d]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4c59d] text-xs font-bold uppercase tracking-wider text-[#000000]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Architectural Fabrication</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f0e6] leading-tight">
              Custom Manufacturing
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#d4c59d] leading-relaxed">
              <p className="font-serif-luxury text-xl sm:text-2xl text-[#d4c59d] font-semibold">
                Have a unique idea?
              </p>
              <p>
                Turath specializes in custom manufacturing. Simply share your drawing, inspiration, or dimensions, and our craftsmen will transform your vision into a beautiful handcrafted product.
              </p>
              <p className="text-sm text-[#9e9174]">
                From grand palace chandeliers spanning 4 meters to custom brass and copper feature doors, hotel balustrades, and bespoke dining tables, no architectural challenge is beyond our Gamaliya craftsmen.
              </p>
            </div>

            {/* Solid color action buttons with NO border frames */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartCustomProject}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] active:scale-95 transition-all shadow flex items-center justify-center gap-2"
              >
                <span>Discuss Your Custom Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/201016771010?text=Hello%20Turath%2C%20I%20have%20a%20custom%20brass%20and%20copper%20manufacturing%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Drawing Directly</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4c59d] bg-[#000000] shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#d4c59d]/30 pb-4">
                <span className="text-xs uppercase tracking-widest text-[#d4c59d] font-bold">
                  Bespoke Capability
                </span>
                <span className="text-[11px] text-[#9e9174]">Residential • Commercial • Palaces</span>
              </div>

              <div className="space-y-3 text-xs text-[#f5f0e6]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span>Custom Hand-Chiseled Inscriptions & Arabic Calligraphy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span>Monumental Chandeliers & Mosque / Lobby Pendants</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span>Architectural Mashrabiya Partitions & Railings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span>Custom Sizes for Mirrors, Tables, and Door Hardware</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#000000] border border-[#d4c59d]/40 text-xs">
                <span className="text-[#f5f0e6] font-bold block mb-1">Direct Workshop Address:</span>
                <span className="text-[#d4c59d]">Gamaliya Street, Historic Cairo, Egypt</span>
                <span className="text-[#9e9174] block text-[11px] mt-1">Phone: 002 01016771010</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-6 rounded-xl bg-[#000000] border border-[#d4c59d]/30 relative group hover:border-[#d4c59d] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif-luxury text-2xl font-bold text-[#d4c59d]/70 group-hover:text-[#d4c59d] transition-colors">
                    {st.step}
                  </span>
                  <div className="p-2 rounded-md bg-[#d4c59d] text-[#000000]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif-luxury text-base font-bold text-[#f5f0e6] mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-[#9e9174] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
