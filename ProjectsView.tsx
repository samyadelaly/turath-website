import React, { useState, useMemo } from 'react';
import { ProjectItem, ProjectType } from './types';
import { ProjectCard } from "./ProjectCard";
import { 
  Building2, 
  MapPin, 
  Filter, 
  Search, 
  X, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  PhoneCall
} from 'lucide-react';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  isAdmin?: boolean;
  onOpenAddProject?: () => void;
  onEditProject?: (project: ProjectItem) => void;
  onDeleteProject?: (projectId: string) => void;
  onTogglePublish?: (project: ProjectItem) => void;
  onNavigateToCustomFabrication?: () => void;
}

const PRESET_PROJECT_TYPES: ProjectType[] = [
  'Hotel',
  'Restaurant',
  'Villa',
  'Palace',
  'Residential',
  'Commercial',
  'Retail',
  'Architectural',
  'Custom Project',
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  isAdmin = false,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  onTogglePublish,
  onNavigateToCustomFabrication,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique locations from existing projects
  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>();
    projects.forEach((p) => {
      if (p.location && p.location.trim()) {
        locSet.add(p.location.trim());
      }
    });
    return Array.from(locSet).sort();
  }, [projects]);

  // Filter projects (admins see drafts, regular visitors only see published)
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Visibility check
      if (!isAdmin && !p.published) return false;

      // Type check
      if (selectedType !== 'all') {
        if (p.projectType.toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      // Location check
      if (selectedLocation !== 'all') {
        if (!p.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q) || (p.titleAR && p.titleAR.toLowerCase().includes(q));
        const matchLocation = p.location.toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q) || (p.shortDescription || '').toLowerCase().includes(q);
        const matchMat = (p.materials || '').toLowerCase().includes(q);
        const matchWork = Array.isArray(p.workDelivered) && p.workDelivered.some(w => w.toLowerCase().includes(q));

        if (!matchTitle && !matchLocation && !matchDesc && !matchMat && !matchWork) {
          return false;
        }
      }

      return true;
    });
  }, [projects, isAdmin, selectedType, selectedLocation, searchQuery]);

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedLocation('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedLocation !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#070705] text-[#f5f0e6] pt-8 pb-20">
      {/* Hero Header */}
      <div className="relative border-b border-[#d4c59d]/20 bg-gradient-to-b from-[#12100b] to-[#070705] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#f5f0e6] tracking-tight leading-tight">
            TURATH <span className="text-[#d4c59d]">PORTFOLIO</span>
          </h1>

          <p className="font-arabic text-lg sm:text-xl text-[#d4c59d]/90 mt-2" dir="rtl">
            تحف نحاسية معمارية وهندسية فاخرة صُنعت خصيصاً لأرقى الفنادق والقصور والمشاريع الكبرى
          </p>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#9e9174] mt-5 leading-relaxed font-sans">
            Explore our curated portfolio of bespoke monumental chandeliers, hand-hammered wall panels, 
            sculptural mirrors, and architectural metal fixtures created for luxury hospitality, royal palaces, 
            and private estates across Egypt and the Middle East.
          </p>

          {/* Admin Add Project Button */}
          {isAdmin && onOpenAddProject && (
            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenAddProject}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Project</span>
                <span className="font-arabic text-xs font-semibold">(إضافة مشروع جديد)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="sticky top-14 z-30 bg-[#0c0b08]/95 backdrop-blur-md border-b border-[#d4c59d]/20 py-4 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Project Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar flex-nowrap">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-[#d4c59d] text-black shadow-sm'
                  : 'bg-[#141414] text-[#d4c59d] hover:bg-[#201e18] border border-[#d4c59d]/30'
              }`}
            >
              All Types ({projects.filter(p => isAdmin || p.published).length})
            </button>

            {PRESET_PROJECT_TYPES.map((type) => {
              const count = projects.filter(p => (isAdmin || p.published) && p.projectType.toLowerCase() === type.toLowerCase()).length;
              if (count === 0 && !isAdmin) return null;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 cursor-pointer ${
                    selectedType.toLowerCase() === type.toLowerCase()
                      ? 'bg-[#d4c59d] text-black shadow-sm'
                      : 'bg-[#141414] text-[#d4c59d] hover:bg-[#201e18] border border-[#d4c59d]/30'
                  }`}
                >
                  {type} {count > 0 && <span className="opacity-75 font-mono">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Right: Search & Location Filter */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Location Select Dropdown */}
            {uniqueLocations.length > 0 && (
              <div className="relative flex-shrink-0">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3 py-1.5 text-xs text-[#d4c59d] focus:outline-none focus:border-[#d4c59d] cursor-pointer"
                >
                  <option value="all">All Locations (جميع المواقع)</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9e9174] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, materials..."
                className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-2.5 py-1.5 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1"
                title="Reset all filters"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-[#0e0d0a] border border-[#d4c59d]/20 rounded-2xl p-8 max-w-xl mx-auto">
            <Building2 className="w-12 h-12 text-[#d4c59d]/60 mx-auto mb-4" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#f5f0e6]">
              No Projects Found
            </h3>
            <p className="text-sm text-[#9e9174] mt-2 font-sans">
              No architectural or custom installations match your current filter criteria.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              {isAdmin && onOpenAddProject && (
                <button
                  type="button"
                  onClick={onOpenAddProject}
                  className="px-4 py-2 rounded-lg bg-[#181818] border border-[#d4c59d]/50 text-[#d4c59d] font-bold text-xs uppercase tracking-wider hover:bg-[#d4c59d] hover:text-black transition-colors cursor-pointer"
                >
                  + Add Project
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onSelectProject}
                isAdmin={isAdmin}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
                onTogglePublish={onTogglePublish}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Custom Manufacturing & Architectural Inquiry Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#17140e] via-[#201c13] to-[#17140e] border border-[#d4c59d]/40 rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#f5f0e6]">
              Commission a Custom Architectural Brass Piece
            </h2>

            <p className="font-arabic text-base sm:text-lg text-[#d4c59d] mt-1.5" dir="rtl">
              هل لديك مشروع فندقي، قصر، أو فيلا خاصة وتبحث عن تصنيع يدوي فاخر بمواصفات معمارية دقيقة؟
            </p>

            <p className="text-sm text-[#b3a480] mt-4 leading-relaxed font-sans">
              From monumental double-height entrance chandeliers to custom curved brass handrails and engraved cladding, 
              our master artisans collaborate directly with architects, interior consultants, and luxury contractors to realize bespoke concepts.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/201016771010?text=Hello%20TURATH%2C%20I%20am%20an%20architect%2Fdesigner%20inquiring%20about%20a%20custom%20architectural%20project."
                target="_blank"
                rel="noreferrer"
                className="gold-shimmer-hover inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-[#000000] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Project on WhatsApp</span>
              </a>

              {onNavigateToCustomFabrication && (
                <button
                  type="button"
                  onClick={onNavigateToCustomFabrication}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#141414] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-black border border-[#d4c59d]/50 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Custom Fabrication Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
