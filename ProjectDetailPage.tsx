import React, { useState, useEffect } from 'react';
import { ProjectItem, ProductItem } from './types';
import { TurathMedia } from "./TurathMedia";
import { ProjectGalleryModal } from "./ProjectGalleryModal";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  Play, 
  Layers, 
  Hammer, 
  Wrench, 
  Share2, 
  MessageCircle, 
  Edit3, 
  Maximize2,
  ExternalLink,
  Camera
} from 'lucide-react';

interface ProjectDetailPageProps {
  project: ProjectItem;
  products?: ProductItem[];
  onNavigateBack: () => void;
  onNavigateToProduct?: (product: ProductItem) => void;
  isAdmin?: boolean;
  onEditProject?: (project: ProjectItem) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  products = [],
  onNavigateBack,
  onNavigateToProduct,
  isAdmin = false,
  onEditProject,
}) => {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);

  // Dynamic SEO Page Title & Meta tags
  useEffect(() => {
    const originalTitle = document.title;
    document.title = project.seoTitle || `${project.title} | TURATH Architectural Projects`;

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalMetaDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', project.metaDescription || project.shortDescription || project.description.slice(0, 160));
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalMetaDesc) {
        metaDesc.setAttribute('content', originalMetaDesc);
      }
    };
  }, [project]);

  // Find related products referenced by ID
  const linkedProducts = (project.relatedProductIds || [])
    .map((id) => products.find((p) => p.id === id || p.sku === id || p.seoSlug === id))
    .filter((p): p is ProductItem => Boolean(p));

  const openGalleryAt = (index: number) => {
    setSelectedGalleryIndex(index);
    setIsGalleryModalOpen(true);
  };

  const allPhotos = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(Array.isArray(project.gallery) ? project.gallery.filter((g) => g !== project.coverImage) : []),
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello TURATH, I am inquiring about custom craftsmanship and architectural manufacturing similar to: "${project.title}" (${project.location}). Please provide technical consultation and portfolio details.`
  );

  return (
    <div className="min-h-screen bg-[#070705] text-[#f5f0e6] pt-6 pb-24">
      {/* Breadcrumb Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-[#9e9174]">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onNavigateBack}
              className="inline-flex items-center gap-1.5 text-[#d4c59d] hover:text-[#f5f0e6] transition-colors cursor-pointer font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#9e9174]/40" />
            <span className="text-[#9e9174] uppercase tracking-wider">{project.projectType}</span>
            <ChevronRight className="w-3 h-3 text-[#9e9174]/40" />
            <span className="text-[#f5f0e6] font-medium truncate max-w-[200px] sm:max-w-xs">{project.title}</span>
          </div>

          {isAdmin && onEditProject && (
            <button
              type="button"
              onClick={() => onEditProject(project)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#d4c59d] hover:bg-[#e6d8b5] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Project (تعديل المشروع)</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border-b border-[#d4c59d]/20 pb-8">
          {/* Metadata badges */}
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16140e] border border-[#d4c59d]/40 text-[#d4c59d] text-xs font-bold uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5" />
              {project.projectType}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16140e] border border-[#d4c59d]/40 text-[#f5f0e6] text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#d4c59d]" />
              {project.location}
            </span>

            {project.year && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16140e] border border-[#d4c59d]/40 text-[#f5f0e6] text-xs font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#d4c59d]" />
                Completed {project.year}
              </span>
            )}
          </div>

          {/* Main Title */}
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#f5f0e6] leading-tight tracking-tight">
            {project.title}
          </h1>

          {/* Arabic Title if available */}
          {project.titleAR && (
            <div className="font-arabic text-xl sm:text-2xl text-[#d4c59d] mt-2" dir="rtl">
              {project.titleAR}
            </div>
          )}

          {/* Short Lead Summary */}
          {project.shortDescription && (
            <p className="text-base sm:text-lg text-[#b3a480] mt-4 max-w-4xl leading-relaxed font-sans">
              {project.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Main Cover Showcase Media */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="relative rounded-2xl overflow-hidden bg-black border border-[#d4c59d]/30 shadow-2xl">
          <TurathMedia
            type={project.mediaType === 'video' ? 'video' : 'image'}
            src={project.coverImage}
            videoUrl={project.videoUrl}
            poster={project.videoPoster || project.coverImage}
            ratio={project.coverRatio || 'Original'}
            customWidth={project.coverCustomRatioWidth}
            customHeight={project.coverCustomRatioHeight}
            fit={project.coverFit || 'cover'}
            position={project.coverPosition || 'center'}
            alt={project.title}
            containerClassName="w-full max-h-[75vh]"
          />

          {/* Cover Lightbox Trigger Overlay */}
          {project.coverImage && (
            <button
              type="button"
              onClick={() => openGalleryAt(0)}
              className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black/80 hover:bg-[#d4c59d] text-[#d4c59d] hover:text-black border border-[#d4c59d]/40 text-xs font-bold transition-all backdrop-blur-md cursor-pointer shadow-lg"
              title="View full resolution"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen View</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Case Study Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (8 cols): The Project Story, The Craft, Custom Manufacturing */}
        <div className="lg:col-span-8 space-y-12">
          {/* SECTION 1: THE PROJECT */}
          <section className="bg-[#0e0d0a] border border-[#d4c59d]/25 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-[#d4c59d] text-xs font-bold uppercase tracking-widest mb-3">
              <Building2 className="w-4 h-4" />
              <span>The Project / نظرة عامة على المشروع</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6] mb-4">
              Project Overview & Architectural Scope
            </h2>
            <div className="text-sm sm:text-base text-[#d8cfbe] leading-relaxed font-sans whitespace-pre-line space-y-4">
              {project.description}
            </div>
          </section>

          {/* SECTION 2: THE CRAFT & PROCESS */}
          {project.craftStory && (
            <section className="bg-[#0e0d0a] border border-[#d4c59d]/25 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#d4c59d] text-xs font-bold uppercase tracking-widest mb-3">
                <Hammer className="w-4 h-4" />
                <span>The Craft / الحرفية والتقنيات اليدوية</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6] mb-4">
                Artisanal Egyptian Craftsmanship
              </h2>
              <div className="text-sm sm:text-base text-[#d8cfbe] leading-relaxed font-sans whitespace-pre-line">
                {project.craftStory}
              </div>
            </section>
          )}

          {/* SECTION 3: THE WORK DELIVERED */}
          {Array.isArray(project.workDelivered) && project.workDelivered.length > 0 && (
            <section className="bg-[#0e0d0a] border border-[#d4c59d]/25 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#d4c59d] text-xs font-bold uppercase tracking-widest mb-3">
                <Layers className="w-4 h-4" />
                <span>Work Delivered / الأعمال والقطع المصنعة</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6] mb-5">
                Manufactured & Installed Elements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {project.workDelivered.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141310] border border-[#d4c59d]/20"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#d4c59d] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#f5f0e6] font-medium leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: CUSTOM MANUFACTURING NOTES */}
          {project.customManufacturing && (
            <section className="bg-[#0e0d0a] border border-[#d4c59d]/25 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#d4c59d] text-xs font-bold uppercase tracking-widest mb-3">
                <Wrench className="w-4 h-4" />
                <span>Custom Engineering / المواصفات الهندسية</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6] mb-4">
                Bespoke Engineering & Structural Fitting
              </h2>
              <div className="text-sm sm:text-base text-[#d8cfbe] leading-relaxed font-sans whitespace-pre-line">
                {project.customManufacturing}
              </div>
            </section>
          )}

          {/* SECTION 5: PROJECT VIDEO EMBED */}
          {project.videoUrl && (
            <section className="bg-[#0e0d0a] border border-[#d4c59d]/25 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#d4c59d] text-xs font-bold uppercase tracking-widest mb-3">
                <Play className="w-4 h-4" />
                <span>Project Video / فيديو التوثيق والتركيب</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6] mb-5">
                Fabrication & Installation Showcase
              </h2>

              <div className="relative rounded-xl overflow-hidden bg-black border border-[#d4c59d]/30">
                <TurathMedia
                  type="video"
                  videoUrl={project.videoUrl}
                  poster={project.videoPoster || project.coverImage}
                  ratio={project.videoRatio || '16:9'}
                  customWidth={project.videoCustomRatioWidth}
                  customHeight={project.videoCustomRatioHeight}
                  fit={project.videoFit || 'cover'}
                  containerClassName="w-full"
                />
              </div>
            </section>
          )}

          {/* SECTION 6: PROJECT IMAGE GALLERY */}
          {allPhotos.length > 0 && (
            <section className="bg-[#0e0d0a] border border-[#d4c59d]/25 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2.5 text-[#d4c59d] text-xs font-bold uppercase tracking-widest mb-1">
                    <Camera className="w-4 h-4" />
                    <span>Project Photography / معرض صور المشروع</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f5f0e6]">
                    High-Resolution Gallery ({allPhotos.length})
                  </h2>
                </div>

                <span className="text-xs text-[#9e9174] font-sans">
                  Click any image to expand
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allPhotos.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => openGalleryAt(idx)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-[#d4c59d]/30 cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`${project.title} gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-black/80 text-[#d4c59d] border border-[#d4c59d]/50">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Specs, Materials, Connected Products, WhatsApp Inquiry */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Specifications Card */}
          <div className="bg-[#0e0d0a] border border-[#d4c59d]/30 rounded-2xl p-6 sticky top-20 shadow-xl space-y-6">
            <h3 className="font-serif-luxury text-lg font-bold text-[#d4c59d] uppercase tracking-wider pb-3 border-b border-[#d4c59d]/20">
              Project Specifications
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#9e9174] uppercase tracking-wider block text-[10px]">Location</span>
                <span className="text-[#f5f0e6] font-semibold text-sm mt-0.5 block">{project.location}</span>
              </div>

              <div>
                <span className="text-[#9e9174] uppercase tracking-wider block text-[10px]">Project Classification</span>
                <span className="text-[#f5f0e6] font-semibold text-sm mt-0.5 block">{project.projectType}</span>
              </div>

              {project.year && (
                <div>
                  <span className="text-[#9e9174] uppercase tracking-wider block text-[10px]">Completion Year</span>
                  <span className="text-[#f5f0e6] font-semibold text-sm mt-0.5 block">{project.year}</span>
                </div>
              )}

              <div>
                <span className="text-[#9e9174] uppercase tracking-wider block text-[10px]">Materials</span>
                <span className="text-[#f5f0e6] font-medium leading-relaxed block mt-0.5">{project.materials}</span>
              </div>

              {project.finish && (
                <div>
                  <span className="text-[#9e9174] uppercase tracking-wider block text-[10px]">Metal Finish & Patina</span>
                  <span className="text-[#f5f0e6] font-medium leading-relaxed block mt-0.5">{project.finish}</span>
                </div>
              )}
            </div>

            {/* Direct Inquiry CTA Button */}
            <div className="pt-4 border-t border-[#d4c59d]/20 space-y-2.5">
              <a
                href={`https://wa.me/201016771010?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="gold-shimmer-hover w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Inquire About Similar Project</span>
              </a>

              <a
                href="tel:00201016771010"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#16140e] hover:bg-[#201d14] text-[#d4c59d] border border-[#d4c59d]/40 text-xs font-bold transition-all"
              >
                <span>Call TURATH Concierge</span>
              </a>
            </div>

            {/* Connected Catalog Products (Featured in this project) */}
            {linkedProducts.length > 0 && (
              <div className="pt-5 border-t border-[#d4c59d]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d]" />
                  <span>Featured Catalog Pieces</span>
                </div>

                <div className="space-y-2.5">
                  {linkedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onNavigateToProduct && onNavigateToProduct(prod)}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[#141310] hover:bg-[#201d14] border border-[#d4c59d]/20 hover:border-[#d4c59d]/50 transition-all cursor-pointer group"
                    >
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0 border border-[#d4c59d]/30"
                      />
                      <div className="min-w-0 flex-grow">
                        <div className="text-xs font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] truncate transition-colors">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-[#9e9174] truncate">
                          {prod.dimensions || prod.material}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9e9174] group-hover:text-[#d4c59d] flex-shrink-0 mr-1 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Gallery Modal */}
      <ProjectGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        images={allPhotos}
        initialIndex={selectedGalleryIndex}
        projectTitle={project.title}
      />
    </div>
  );
};
