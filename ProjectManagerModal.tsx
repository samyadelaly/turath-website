import React, { useState } from 'react';
import { ProjectItem } from './types';
import { 
  X, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Building2, 
  MapPin, 
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  onOpenAddProject: () => void;
  onOpenEditProject: (project: ProjectItem) => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onTogglePublish: (project: ProjectItem) => Promise<void>;
  onReorderProjects: (orderedProjects: ProjectItem[]) => Promise<void>;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  onOpenAddProject,
  onOpenEditProject,
  onDeleteProject,
  onTogglePublish,
  onReorderProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const sortedProjects = [...projects].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const filtered = sortedProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.projectType.toLowerCase().includes(q)
    );
  });

  const handleMoveUp = async (index: number) => {
    if (index <= 0 || isProcessing) return;
    setIsProcessing(true);
    const updated = [...sortedProjects];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    await onReorderProjects(updated);
    setIsProcessing(false);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= sortedProjects.length - 1 || isProcessing) return;
    setIsProcessing(true);
    const updated = [...sortedProjects];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    await onReorderProjects(updated);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0e0d0a] border border-[#d4c59d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/25 bg-[#141310] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#d4c59d]" />
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#f5f0e6]">
                Projects Management (إدارة المشاريع المنفذة)
              </h3>
              <p className="text-xs text-[#9e9174]">
                Total {projects.length} architectural & bespoke installations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddProject();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Project</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#201e18] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="p-4 border-b border-[#d4c59d]/20 bg-[#0a0a08] flex-shrink-0">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#9e9174] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, type..."
              className="w-full bg-[#141414] border border-[#d4c59d]/30 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="p-6 overflow-y-auto flex-grow space-y-3 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#9e9174] text-xs">
              No projects found. Click "+ Add Project" to create one.
            </div>
          ) : (
            filtered.map((proj, idx) => (
              <div
                key={proj.id}
                className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-all ${
                  proj.published
                    ? 'bg-[#141310] border-[#d4c59d]/25 hover:border-[#d4c59d]/60'
                    : 'bg-[#1a140d] border-amber-500/40'
                }`}
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-[#d4c59d]/30">
                    {proj.coverImage ? (
                      <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9e9174]">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#f5f0e6] truncate">
                        {proj.title}
                      </h4>
                      {!proj.published && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono flex-shrink-0">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9e9174] flex items-center gap-2 mt-0.5 truncate">
                      <span className="text-[#d4c59d] font-medium">{proj.projectType}</span>
                      <span>•</span>
                      <span>{proj.location}</span>
                      {proj.year && (
                        <>
                          <span>•</span>
                          <span>{proj.year}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5 border-r border-[#d4c59d]/20 pr-2 mr-1">
                    <button
                      type="button"
                      disabled={idx === 0 || isProcessing}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1.5 rounded hover:bg-[#201d14] text-[#d4c59d] disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sortedProjects.length - 1 || isProcessing}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1.5 rounded hover:bg-[#201d14] text-[#d4c59d] disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Publish */}
                  <button
                    type="button"
                    onClick={() => onTogglePublish(proj)}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      proj.published
                        ? 'text-emerald-400 hover:bg-emerald-950/60'
                        : 'text-amber-400 hover:bg-amber-950/60'
                    }`}
                    title={proj.published ? 'Published (click to unpublish)' : 'Draft (click to publish)'}
                  >
                    {proj.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenEditProject(proj);
                    }}
                    className="p-1.5 rounded hover:bg-[#d4c59d] hover:text-black text-[#d4c59d] transition-colors cursor-pointer"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  {confirmDeleteId === proj.id ? (
                    <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500/50 p-1 rounded-lg text-xs animate-in fade-in">
                      <span className="text-red-200 text-[10px] font-semibold font-arabic">حذف نهائي؟</span>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={async () => {
                          setIsProcessing(true);
                          await onDeleteProject(proj.id);
                          setIsProcessing(false);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer"
                      >
                        نعم
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-1.5 py-0.5 rounded bg-[#201d14] text-[#d4c59d] hover:text-white text-[10px] cursor-pointer"
                      >
                        لا
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(proj.id)}
                      className="p-1.5 rounded hover:bg-red-950/80 text-red-400 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
