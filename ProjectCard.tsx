import React from 'react';
import { ProjectItem } from "./types";
import { TurathMedia } from './TurathMedia';
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Building2, 
  Layers
} from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
  isAdmin?: boolean;
  onEdit?: (project: ProjectItem) => void;
  onDelete?: (projectId: string) => void;
  onTogglePublish?: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  isAdmin = false,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  return (
    <div className={`group relative bg-[#0e0d0a] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-[0_12px_40px_rgba(212,197,157,0.15)] ${
      project.published ? 'border-[#d4c59d]/30 hover:border-[#d4c59d]' : 'border-amber-600/40 bg-[#16120c]'
    }`}>
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-in fade-in"
        >
          <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-2">
            <Trash2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#f5f0e6] mb-1 font-arabic">حذف هذا المشروع؟</h4>
          <p className="text-xs text-[#9e9174] mb-4 max-w-xs line-clamp-2">
            "{project.title}"
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-[#201d14] hover:bg-[#302c1f] text-[#d4c59d] text-xs font-semibold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete?.(project.id);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              نعم، حذف
            </button>
          </div>
        </div>
      )}
      {/* Draft watermark badge for admin */}
      {!project.published && (
        <div className="absolute top-3 left-3 z-30 bg-amber-500/90 text-black text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-md">
          <EyeOff className="w-3.5 h-3.5" />
          <span>Draft / مسودة</span>
        </div>
      )}

      {/* Admin Quick Action Floating Buttons */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-[#d4c59d]/50 p-1 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity shadow-lg">
          {onTogglePublish && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePublish(project);
              }}
              className={`p-1.5 rounded transition-colors ${
                project.published
                  ? 'text-emerald-400 hover:bg-emerald-950/60'
                  : 'text-amber-400 hover:bg-amber-950/60'
              }`}
              title={project.published ? 'Unpublish project (make draft)' : 'Publish project'}
            >
              {project.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1.5 rounded text-[#d4c59d] hover:bg-[#d4c59d] hover:text-black transition-colors"
              title="Edit project"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1.5 rounded text-red-400 hover:bg-red-950/80 transition-colors cursor-pointer"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Cover Media Container */}
      <div 
        onClick={() => onSelect(project)}
        className="cursor-pointer relative overflow-hidden bg-black aspect-[16/10] sm:aspect-[16/9]"
      >
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
          containerClassName="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

        {/* Top-Left Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-[#d4c59d]/40 text-[#d4c59d] text-xs font-bold uppercase tracking-widest">
            <Building2 className="w-3 h-3 text-[#d4c59d]" />
            {project.projectType}
          </span>
        </div>

        {/* Bottom Overlay Info on Media */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-[#d4c59d]">
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#d4c59d]/30">
            <MapPin className="w-3.5 h-3.5 text-[#d4c59d]" />
            <span className="text-[#f5f0e6] font-medium">{project.location}</span>
          </div>

          {project.year && (
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-[#d4c59d]/30 text-[#f5f0e6] font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-[#d4c59d]" />
              <span>{project.year}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Project Title */}
          <h3 
            onClick={() => onSelect(project)}
            className="font-serif-luxury text-lg sm:text-xl font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors cursor-pointer leading-snug"
          >
            {project.title}
          </h3>

          {/* Arabic Title if available */}
          {project.titleAR && (
            <div className="font-arabic text-xs text-[#9e9174] mt-0.5" dir="rtl">
              {project.titleAR}
            </div>
          )}

          {/* Short Description */}
          <p className="text-xs text-[#9e9174] line-clamp-2 mt-2.5 leading-relaxed font-sans">
            {project.shortDescription || project.description}
          </p>

          {/* Materials Tag */}
          {project.materials && (
            <div className="mt-3.5 flex items-center gap-2 text-[11px] text-[#b3a480] bg-[#141310] border border-[#d4c59d]/20 px-2.5 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4c59d] flex-shrink-0" />
              <span className="truncate">{project.materials}</span>
            </div>
          )}

          {/* Scope of Work Delivered count */}
          {Array.isArray(project.workDelivered) && project.workDelivered.length > 0 && (
            <div className="mt-2 text-[11px] text-[#9e9174] flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#d4c59d]" />
              <span>{project.workDelivered.length} Custom manufactured elements</span>
            </div>
          )}
        </div>

        {/* Bottom CTA Link */}
        <div className="pt-5 mt-4 border-t border-[#d4c59d]/20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#d4c59d] group-hover:text-[#f5f0e6] transition-colors uppercase tracking-wider cursor-pointer"
          >
            <span>View Case Study</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          {project.gallery && project.gallery.length > 0 && (
            <span className="text-[11px] text-[#9e9174] font-mono">
              {project.gallery.length} photos
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
