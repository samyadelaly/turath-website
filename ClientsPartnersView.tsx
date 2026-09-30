import React, { useState } from 'react';
import { ClientPartnerItem, ProjectItem } from './types';
import { 
  Handshake, 
  ExternalLink, 
  MapPin, 
  Globe, 
  Layers, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ClientsPartnersViewProps {
  items: ClientPartnerItem[];
  projects?: ProjectItem[];
  isAdmin?: boolean;
  onOpenAddModal?: () => void;
  onOpenEditModal?: (item: ClientPartnerItem) => void;
  onDelete?: (id: string) => void;
  onTogglePublish?: (item: ClientPartnerItem) => void;
  onNavigateToProject?: (project: ProjectItem) => void;
}

export const ClientsPartnersView: React.FC<ClientsPartnersViewProps> = ({
  items,
  projects = [],
  isAdmin = false,
  onOpenAddModal,
  onOpenEditModal,
  onDelete,
  onTogglePublish,
  onNavigateToProject,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'clients' | 'partners'>('all');

  // Filter published (admins see drafts/hidden as well)
  const visibleItems = items.filter((item) => (isAdmin ? true : item.published));

  const clients = visibleItems.filter((i) => i.type === 'client');
  const partners = visibleItems.filter((i) => i.type === 'partner');

  const displayedItems = activeTab === 'clients' ? clients : activeTab === 'partners' ? partners : visibleItems;

  const getConnectedProject = (projectId?: string): ProjectItem | undefined => {
    if (!projectId) return undefined;
    return projects.find((p) => p.id === projectId);
  };

  const renderLogoCard = (item: ClientPartnerItem) => {
    const connectedProj = getConnectedProject(item.projectId);

    return (
      <div
        key={item.id}
        className={`group relative rounded-2xl bg-[#0e0d0a] border border-[#d4c59d]/20 hover:border-[#d4c59d]/60 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_10px_35px_rgba(0,0,0,0.8)] ${
          !item.published ? 'opacity-65 border-dashed border-yellow-500/40' : ''
        }`}
      >
        {/* Admin Badges & Actions */}
        {isAdmin && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-[#000000]/90 border border-[#d4c59d]/30 rounded-lg p-1">
            {!item.published && (
              <span className="text-[10px] font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-950/40">
                Hidden
              </span>
            )}
            {onTogglePublish && (
              <button
                type="button"
                onClick={() => onTogglePublish(item)}
                className="p-1 rounded text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
                title={item.published ? 'Hide from public' : 'Publish publicly'}
              >
                {item.published ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-yellow-400" />}
              </button>
            )}
            {onOpenEditModal && (
              <button
                type="button"
                onClick={() => onOpenEditModal(item)}
                className="p-1 rounded text-[#9e9174] hover:text-[#d4c59d] transition-colors"
                title="Edit entry"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                    onDelete(item.id);
                  }
                }}
                className="p-1 rounded text-[#9e9174] hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Logo Container with preserved aspect ratio */}
        <div className="w-full h-24 sm:h-28 flex items-center justify-center p-3 rounded-xl bg-[#141310] border border-[#d4c59d]/10 mb-4 overflow-hidden">
          {item.logo ? (
            <img
              src={item.logo}
              alt={item.name}
              className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-xs font-bold block text-[#d4c59d]">{item.name}</span>
              {item.nameAR && (
                <span className="text-[11px] text-[#9e9174] font-arabic mt-1 block" dir="rtl">{item.nameAR}</span>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                item.type === 'partner' 
                  ? 'bg-[#d4c59d]/15 text-[#d4c59d] border border-[#d4c59d]/30'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
              }`}>
                {item.type === 'partner' ? 'Architectural Partner' : 'Distinguished Client'}
              </span>

              {item.industry && (
                <span className="text-[10px] text-[#9e9174] line-clamp-1">
                  {item.industry}
                </span>
              )}
            </div>

            <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#f5f0e6] group-hover:text-[#d4c59d] transition-colors line-clamp-1">
              {item.name}
            </h3>

            {item.nameAR && (
              <div className="font-arabic text-xs text-[#d4c59d]/80 line-clamp-1" dir="rtl">
                {item.nameAR}
              </div>
            )}

            {item.location && (
              <div className="flex items-center gap-1 text-[11px] text-[#9e9174] mt-1.5">
                <MapPin className="w-3 h-3 text-[#d4c59d]/70 flex-shrink-0" />
                <span className="line-clamp-1">{item.location}</span>
              </div>
            )}

            {item.description && (
              <p className="text-xs text-[#b3a480] mt-2 line-clamp-2 leading-relaxed font-sans">
                {item.description}
              </p>
            )}
          </div>

          {/* Links Footer */}
          <div className="mt-4 pt-3 border-t border-[#d4c59d]/15 flex items-center justify-between gap-2 flex-wrap">
            {item.websiteUrl ? (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4c59d] hover:text-[#f5f0e6] transition-colors"
                title="Visit official website"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            ) : (
              <span className="text-[11px] text-[#9e9174]/60">Verified TURATH Partner</span>
            )}

            {/* Connected Project Trigger */}
            {connectedProj && onNavigateToProject && (
              <button
                type="button"
                onClick={() => onNavigateToProject(connectedProj)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f5f0e6] bg-[#1a1820] hover:bg-[#d4c59d] hover:text-black border border-[#d4c59d]/30 px-2 py-1 rounded-md transition-all cursor-pointer"
                title={`View related project: ${connectedProj.title}`}
              >
                <Layers className="w-3 h-3 text-[#d4c59d]" />
                <span className="line-clamp-1 max-w-[110px]">Project Work</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070705] text-[#f5f0e6] pt-8 pb-20">
      {/* Header Section */}
      <div className="relative border-b border-[#d4c59d]/20 bg-gradient-to-b from-[#12100b] to-[#070705] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#f5f0e6] tracking-tight leading-tight">
            OUR CLIENTS <span className="text-[#d4c59d]">& PARTNERS</span>
          </h1>

          <p className="font-arabic text-lg sm:text-xl text-[#d4c59d]/90 mt-2" dir="rtl">
            شركاء النجاح وكبار العملاء الذين يقدّرون الدقة وأصالة الحرفة النحاسية المصرية
          </p>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#9e9174] mt-4 leading-relaxed font-sans">
            Trusted by clients and partners who value Egyptian craftsmanship, precision, and distinctive metalwork.
          </p>

          {/* Admin Add Button */}
          {isAdmin && onOpenAddModal && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-all cursor-pointer shadow-lg hover:shadow-[#d4c59d]/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Client or Partner</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between border-b border-[#d4c59d]/20 pb-4 flex-wrap gap-4">
          <div className="inline-flex rounded-lg p-1 bg-[#12110e] border border-[#d4c59d]/25">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#d4c59d] text-black shadow-sm'
                  : 'text-[#9e9174] hover:text-[#f5f0e6]'
              }`}
            >
              All ({visibleItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-[#d4c59d] text-black shadow-sm'
                  : 'text-[#9e9174] hover:text-[#f5f0e6]'
              }`}
            >
              Clients ({clients.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-[#d4c59d] text-black shadow-sm'
                  : 'text-[#9e9174] hover:text-[#f5f0e6]'
              }`}
            >
              Partners ({partners.length})
            </button>
          </div>

          <div className="text-xs text-[#9e9174] font-sans">
            {activeTab === 'all' && `${visibleItems.length} total entries`}
            {activeTab === 'clients' && `${clients.length} distinguished clients`}
            {activeTab === 'partners' && `${partners.length} architectural partners`}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {displayedItems.length === 0 ? (
          <div className="text-center py-20 bg-[#0e0d0a] border border-[#d4c59d]/20 rounded-2xl p-8 max-w-xl mx-auto">
            <Handshake className="w-12 h-12 text-[#d4c59d]/60 mx-auto mb-4" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#f5f0e6]">
              No {activeTab === 'all' ? 'Clients or Partners' : activeTab === 'clients' ? 'Clients' : 'Partners'} Listed Yet
            </h3>
            <p className="font-arabic text-sm text-[#d4c59d]/80 mt-1" dir="rtl">
              لا توجد جهات مضافة حالياً في هذا القسم
            </p>
            <p className="text-sm text-[#9e9174] mt-2 font-sans">
              Verified clients and architectural design partners will appear here once registered and published in the Admin panel.
            </p>
            {isAdmin && onOpenAddModal && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="px-4 py-2 rounded-lg bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors cursor-pointer"
                >
                  + Add Entry
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'all' ? (
          <div className="space-y-16">
            {/* GROUP 1: CLIENTS */}
            {clients.length > 0 && (
              <section>
                <div className="mb-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#f5f0e6]">
                      Distinguished Clients
                    </h2>
                    <p className="font-arabic text-xs text-[#d4c59d]/80 mt-0.5" dir="rtl">
                      نخبة الفنادق والقصور والجهات الحكومية والخاصة
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {clients.map(renderLogoCard)}
                </div>
              </section>
            )}

            {/* GROUP 2: PARTNERS */}
            {partners.length > 0 && (
              <section>
                <div className="mb-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#f5f0e6]">
                      Architectural & Design Partners
                    </h2>
                    <p className="font-arabic text-xs text-[#d4c59d]/80 mt-0.5" dir="rtl">
                      شركاء التصميم المعماري والاستشارات الهندسية
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {partners.map(renderLogoCard)}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedItems.map(renderLogoCard)}
          </div>
        )}
      </div>
    </div>
  );
};
