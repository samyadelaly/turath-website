import React, { useState } from 'react';
import { ClientPartnerItem, ProjectItem, ClientPartnerType } from './types';
import { uploadToSupabaseStorage } from './supabaseStorage';
import { 
  X, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Handshake, 
  MapPin, 
  Globe, 
  Upload, 
  Check, 
  AlertCircle,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';

interface ClientsPartnersManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ClientPartnerItem[];
  projects?: ProjectItem[];
  onSaveItem: (item: ClientPartnerItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onReorderItems: (items: ClientPartnerItem[]) => Promise<void>;
}

export const ClientsPartnersManagerModal: React.FC<ClientsPartnersManagerModalProps> = ({
  isOpen,
  onClose,
  items,
  projects = [],
  onSaveItem,
  onDeleteItem,
  onReorderItems,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<ClientPartnerItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'client' | 'partner'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<{
    name: string;
    nameAR: string;
    type: ClientPartnerType;
    logo: string;
    industry: string;
    websiteUrl: string;
    location: string;
    description: string;
    descriptionAR: string;
    projectId: string;
    published: boolean;
  }>({
    name: '',
    nameAR: '',
    type: 'client',
    logo: '',
    industry: '',
    websiteUrl: '',
    location: '',
    description: '',
    descriptionAR: '',
    projectId: '',
    published: true,
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);

  if (!isOpen) return null;

  const sortedItems = [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const filtered = sortedItems.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.nameAR && item.nameAR.toLowerCase().includes(q)) ||
      (item.industry && item.industry.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      nameAR: '',
      type: 'client',
      logo: '',
      industry: '',
      websiteUrl: '',
      location: '',
      description: '',
      descriptionAR: '',
      projectId: '',
      published: true,
    });
    setStatusMessage(null);
    setViewMode('form');
  };

  const openEditForm = (item: ClientPartnerItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      nameAR: item.nameAR || '',
      type: item.type || 'client',
      logo: item.logo || '',
      industry: item.industry || '',
      websiteUrl: item.websiteUrl || '',
      location: item.location || '',
      description: item.description || '',
      descriptionAR: item.descriptionAR || '',
      projectId: item.projectId || '',
      published: item.published !== false,
    });
    setStatusMessage(null);
    setViewMode('form');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setStatusMessage({ text: 'Uploading logo to Supabase Storage...', type: 'info' });

    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `clients-partners/logo_${Date.now()}_${cleanName}`;
      const publicUrl = await uploadToSupabaseStorage('site-media', storagePath, file);
      setFormData((prev) => ({ ...prev, logo: publicUrl }));
      setStatusMessage({ text: 'Logo uploaded successfully!', type: 'success' });
    } catch (err: any) {
      console.error('Logo upload error:', err);
      // Fallback: Read as data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, logo: reader.result as string }));
          setStatusMessage({ text: 'Logo loaded locally.', type: 'info' });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatusMessage({ text: 'Please enter a name for the client or partner.', type: 'error' });
      return;
    }

    if (!formData.logo.trim()) {
      setStatusMessage({ text: 'Please upload or provide a logo image.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ text: 'Saving changes...', type: 'info' });

    try {
      const itemToSave: ClientPartnerItem = {
        id: editingItem?.id || `cp-${Date.now()}`,
        name: formData.name.trim(),
        nameAR: formData.nameAR.trim() || undefined,
        type: formData.type,
        logo: formData.logo.trim(),
        industry: formData.industry.trim() || undefined,
        websiteUrl: formData.websiteUrl.trim() || undefined,
        location: formData.location.trim() || undefined,
        description: formData.description.trim() || undefined,
        descriptionAR: formData.descriptionAR.trim() || undefined,
        projectId: formData.projectId.trim() || undefined,
        published: formData.published,
        sortOrder: editingItem?.sortOrder !== undefined ? editingItem.sortOrder : items.length + 1,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSaveItem(itemToSave);
      setIsSubmitting(false);
      setViewMode('list');
      setStatusMessage(null);
    } catch (err: any) {
      console.error('Failed to save client/partner:', err);
      setIsSubmitting(false);
      setStatusMessage({ text: `Save error: ${err?.message || err}`, type: 'error' });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0 || isSubmitting) return;
    setIsSubmitting(true);
    const newItems = [...sortedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    await onReorderItems(newItems);
    setIsSubmitting(false);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= sortedItems.length - 1 || isSubmitting) return;
    setIsSubmitting(true);
    const newItems = [...sortedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    await onReorderItems(newItems);
    setIsSubmitting(false);
  };

  const handleTogglePublish = async (item: ClientPartnerItem) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onSaveItem({
      ...item,
      published: !item.published,
      updatedAt: new Date().toISOString(),
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0e0d0a] border border-[#d4c59d] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/25 bg-[#141310] flex-shrink-0">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#f5f0e6]">
              Manage Clients & Partners
            </h3>
            <p className="font-arabic text-xs text-[#d4c59d]/80" dir="rtl">
              إدارة شركاء النجاح والجهات المعتمدة
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#201e18] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 text-emerald-300 border-b border-emerald-500/30'
              : statusMessage.type === 'error'
              ? 'bg-red-950/60 text-red-300 border-b border-red-500/30'
              : 'bg-[#1a1820] text-[#d4c59d] border-b border-[#d4c59d]/30'
          }`}>
            {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {viewMode === 'list' ? (
            <div className="space-y-5">
              {/* Controls Bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#9e9174] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, industry, location..."
                      className="bg-[#141414] border border-[#d4c59d]/30 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d] w-64"
                    />
                  </div>

                  <div className="inline-flex rounded-lg p-0.5 bg-[#141414] border border-[#d4c59d]/30 text-xs">
                    <button
                      type="button"
                      onClick={() => setFilterType('all')}
                      className={`px-2.5 py-1 rounded font-bold transition-colors ${filterType === 'all' ? 'bg-[#d4c59d] text-black' : 'text-[#9e9174] hover:text-white'}`}
                    >
                      All ({sortedItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('client')}
                      className={`px-2.5 py-1 rounded font-bold transition-colors ${filterType === 'client' ? 'bg-[#d4c59d] text-black' : 'text-[#9e9174] hover:text-white'}`}
                    >
                      Clients ({sortedItems.filter(i => i.type === 'client').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('partner')}
                      className={`px-2.5 py-1 rounded font-bold transition-colors ${filterType === 'partner' ? 'bg-[#d4c59d] text-black' : 'text-[#9e9174] hover:text-white'}`}
                    >
                      Partners ({sortedItems.filter(i => i.type === 'partner').length})
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors cursor-pointer shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add New Entry</span>
                </button>
              </div>

              {/* Items List */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#d4c59d]/25 rounded-xl p-8">
                  <Handshake className="w-10 h-10 text-[#d4c59d]/50 mx-auto mb-3" />
                  <p className="font-serif-luxury text-lg text-[#f5f0e6]">
                    No Clients or Partners Registered Yet
                  </p>
                  <p className="text-xs text-[#9e9174] mt-1 font-sans">
                    Click "+ Add New Entry" above to add your first client or partner.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filtered.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === filtered.length - 1;
                    const connectedProj = projects.find((p) => p.id === item.projectId);

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          item.published 
                            ? 'bg-[#12110e] border-[#d4c59d]/25 hover:border-[#d4c59d]/50'
                            : 'bg-[#12110e]/50 border-yellow-500/20 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Logo Preview */}
                          <div className="w-16 h-12 rounded-lg bg-[#000000] border border-[#d4c59d]/20 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                            {item.logo ? (
                              <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <span className="text-[10px] text-[#9e9174] font-bold text-center px-1 truncate">{item.name}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                item.type === 'partner'
                                  ? 'bg-[#d4c59d]/20 text-[#d4c59d]'
                                  : 'bg-emerald-950/60 text-emerald-300'
                              }`}>
                                {item.type}
                              </span>

                              <h4 className="font-serif-luxury text-sm font-bold text-[#f5f0e6] truncate">
                                {item.name}
                              </h4>

                              {item.nameAR && (
                                <span className="font-arabic text-xs text-[#d4c59d]/75" dir="rtl">
                                  ({item.nameAR})
                                </span>
                              )}

                              {!item.published && (
                                <span className="text-[9px] font-bold text-yellow-400 bg-yellow-950/40 px-1.5 py-0.5 rounded border border-yellow-500/30">
                                  Hidden
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-[#9e9174] mt-1 flex-wrap">
                              {item.industry && <span>{item.industry}</span>}
                              {item.location && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-[#d4c59d]/60" />
                                  {item.location}
                                </span>
                              )}
                              {item.websiteUrl && (
                                <a
                                  href={item.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#d4c59d] hover:underline flex items-center gap-0.5"
                                >
                                  <Globe className="w-3 h-3" />
                                  Website
                                </a>
                              )}
                              {connectedProj && (
                                <span className="text-[10px] text-[#d4c59d] bg-[#1a1820] px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Layers className="w-2.5 h-2.5" />
                                  Project: {connectedProj.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(item)}
                            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#1a1820] transition-colors cursor-pointer"
                            title={item.published ? 'Hide entry' : 'Publish entry'}
                          >
                            {item.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-yellow-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#d4c59d] hover:bg-[#1a1820] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={isFirst}
                            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#1a1820] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={isLast}
                            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#1a1820] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Delete "${item.name}" permanently?`)) {
                                await onDeleteItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#9e9174] hover:text-red-400 hover:bg-[#1a1820] transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#d4c59d]/20">
                <h4 className="font-serif-luxury text-base font-bold text-[#f5f0e6]">
                  {editingItem ? `Edit: ${editingItem.name}` : 'Add New Client or Partner'}
                </h4>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="text-xs text-[#9e9174] hover:text-[#f5f0e6] underline cursor-pointer"
                >
                  ← Back to list
                </button>
              </div>

              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-2">
                  Category Type *
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'client' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      formData.type === 'client'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d] shadow-md'
                        : 'bg-[#141414] text-[#9e9174] border-[#d4c59d]/30 hover:border-[#d4c59d]/60'
                    }`}
                  >
                    <span>Client (عميل)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'partner' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      formData.type === 'partner'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d] shadow-md'
                        : 'bg-[#141414] text-[#9e9174] border-[#d4c59d]/30 hover:border-[#d4c59d]/60'
                    }`}
                  >
                    <span>Partner (شريك)</span>
                  </button>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5">
                    Official Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Four Seasons Hotels"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5 font-arabic text-right">
                    الاسم باللغة العربية (اختياري)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.nameAR}
                    onChange={(e) => setFormData({ ...formData, nameAR: e.target.value })}
                    placeholder="مثال: فنادق فور سيزونز"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d] font-arabic"
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="bg-[#141310] border border-[#d4c59d]/30 rounded-xl p-4">
                <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-2">
                  Official Logo Image *
                </label>

                <div className="flex items-center gap-4 flex-wrap">
                  {/* Current Logo Preview */}
                  <div className="w-24 h-20 rounded-xl bg-black border border-[#d4c59d]/30 flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#9e9174]/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1e1c18] hover:bg-[#d4c59d] hover:text-black border border-[#d4c59d]/50 text-xs font-bold text-[#d4c59d] transition-all cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingLogo ? 'Uploading to Supabase...' : 'Choose Logo File (PNG / SVG / JPG)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                      />
                    </label>

                    <p className="text-[11px] text-[#9e9174] font-sans">
                      Uploads directly to your Supabase Storage bucket (<code className="text-[#d4c59d]">site-media/clients-partners/</code>). Transparent PNG or vector SVG recommended.
                    </p>
                  </div>
                </div>

                {/* Direct URL Input Fallback */}
                <div className="mt-3">
                  <label className="block text-[11px] text-[#9e9174] mb-1">
                    Or paste direct image URL:
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#100f0d] border border-[#d4c59d]/20 rounded-lg px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#9e9174]/50 focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Hospitality & Resorts"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5">
                    Location / Region
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Cairo, Egypt"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {/* Connected Project Selection */}
              <div>
                <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5">
                  Link to Project (Optional)
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-xs text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
                >
                  <option value="">-- No Connected Project --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} {proj.location ? `(${proj.location})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#9e9174] mt-1 font-sans">
                  If this client or partner commissioned an architectural project, linking it creates a direct badge on their logo card.
                </p>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5">
                    Collaboration Scope / Notes (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the collaboration scope..."
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg p-3 text-xs text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#d4c59d] uppercase tracking-wider mb-1.5 font-arabic text-right">
                    نبذة عن التعاون (بالعربية)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={formData.descriptionAR}
                    onChange={(e) => setFormData({ ...formData, descriptionAR: e.target.value })}
                    placeholder="نبذة موجزة عن طبيعة الشراكة أو التوريد..."
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg p-3 text-xs text-[#f5f0e6] placeholder-[#9e9174]/60 focus:outline-none focus:border-[#d4c59d] resize-none font-arabic"
                  />
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedToggle"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-[#d4c59d]/40 bg-[#141414] text-[#d4c59d] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="publishedToggle" className="text-xs font-bold text-[#f5f0e6] cursor-pointer">
                  Publish publicly on website (نشر في الموقع)
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d4c59d]/20">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#9e9174] hover:text-[#f5f0e6] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || uploadingLogo}
                  className="px-6 py-2 rounded-lg bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
