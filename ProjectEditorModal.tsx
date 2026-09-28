import React, { useState, useRef, useEffect } from 'react';
import { ProjectItem, ProjectType, ProductItem } from './types';
import { MediaRatioSelectorControl } from "./MediaRatioSelectorControl";
import { MediaRatioPreset, MediaObjectFit, MediaObjectPosition } from './imageRatioUtils';
import { preserveOriginalUploadedImage } from './imageCompressor';
import { 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  Star, 
  Image as ImageIcon, 
  Film, 
  Building2, 
  Sparkles, 
  Check, 
  Layers, 
  Wrench,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectItem;
  products?: ProductItem[];
  onSave: (project: ProjectItem) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
}

const PROJECT_TYPE_OPTIONS: ProjectType[] = [
  'Hotel',
  'Restaurant',
  'Villa',
  'Palace',
  'Residential',
  'Commercial',
  'Retail',
  'Architectural',
  'Custom Project',
  'Other',
];

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  onClose,
  project,
  products = [],
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(project?.id);

  // Core Fields
  const [title, setTitle] = useState('');
  const [titleAR, setTitleAR] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Hotel');
  const [customProjectType, setCustomProjectType] = useState('');
  const [year, setYear] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [craftStory, setCraftStory] = useState('');
  const [materials, setMaterials] = useState('');
  const [finish, setFinish] = useState('');
  const [workDeliveredItems, setWorkDeliveredItems] = useState<string[]>([]);
  const [newWorkItem, setNewWorkItem] = useState('');
  const [customManufacturing, setCustomManufacturing] = useState('');

  // Cover Media
  const [coverImage, setCoverImage] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [coverRatio, setCoverRatio] = useState<MediaRatioPreset>('16:9');
  const [coverCustomWidth, setCoverCustomWidth] = useState<string>('16');
  const [coverCustomHeight, setCoverCustomHeight] = useState<string>('9');
  const [coverFit, setCoverFit] = useState<MediaObjectFit>('cover');
  const [coverPosition, setCoverPosition] = useState<MediaObjectPosition>('center');

  // Gallery
  const [gallery, setGallery] = useState<string[]>([]);

  // Video
  const [videoUrl, setVideoUrl] = useState('');
  const [videoRatio, setVideoRatio] = useState<MediaRatioPreset>('16:9');
  const [videoCustomWidth, setVideoCustomWidth] = useState<string>('16');
  const [videoCustomHeight, setVideoCustomHeight] = useState<string>('9');
  const [videoFit, setVideoFit] = useState<MediaObjectFit>('cover');

  // Related Products
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);

  // Status & Sort
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(0);

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'craft' | 'media' | 'products' | 'seo'>('general');

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when project changes or modal opens
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setTitleAR(project.titleAR || '');
      setSlug(project.slug || '');
      setLocation(project.location || '');
      if (PROJECT_TYPE_OPTIONS.includes(project.projectType)) {
        setProjectType(project.projectType);
        setCustomProjectType('');
      } else {
        setProjectType('Other');
        setCustomProjectType(project.projectType || '');
      }
      setYear(project.year ? String(project.year) : '');
      setShortDescription(project.shortDescription || '');
      setDescription(project.description || '');
      setCraftStory(project.craftStory || '');
      setMaterials(project.materials || '');
      setFinish(project.finish || '');
      setWorkDeliveredItems(Array.isArray(project.workDelivered) ? project.workDelivered : []);
      setCustomManufacturing(project.customManufacturing || '');

      setCoverImage(project.coverImage || '');
      setMediaType(project.mediaType || 'image');
      setCoverRatio((project.coverRatio as MediaRatioPreset) || '16:9');
      setCoverCustomWidth(String(project.coverCustomRatioWidth || '16'));
      setCoverCustomHeight(String(project.coverCustomRatioHeight || '9'));
      setCoverFit((project.coverFit as MediaObjectFit) || 'cover');
      setCoverPosition((project.coverPosition as MediaObjectPosition) || 'center');

      setGallery(Array.isArray(project.gallery) ? project.gallery : []);

      setVideoUrl(project.videoUrl || '');
      setVideoRatio((project.videoRatio as MediaRatioPreset) || '16:9');
      setVideoCustomWidth(String(project.videoCustomRatioWidth || '16'));
      setVideoCustomHeight(String(project.videoCustomRatioHeight || '9'));
      setVideoFit((project.videoFit as MediaObjectFit) || 'cover');

      setRelatedProductIds(Array.isArray(project.relatedProductIds) ? project.relatedProductIds : []);
      setPublished(project.published !== false);
      setSortOrder(project.sortOrder || 0);

      setSeoTitle(project.seoTitle || '');
      setMetaDescription(project.metaDescription || '');
    } else {
      // New project default state
      setTitle('');
      setTitleAR('');
      setSlug('');
      setLocation('Cairo, Egypt');
      setProjectType('Hotel');
      setCustomProjectType('');
      setYear(new Date().getFullYear().toString());
      setShortDescription('');
      setDescription('');
      setCraftStory('');
      setMaterials('Solid Egyptian Yellow Brass');
      setFinish('Antique Hand-Burnished Brass');
      setWorkDeliveredItems([]);
      setCustomManufacturing('');

      setCoverImage('');
      setMediaType('image');
      setCoverRatio('16:9');
      setCoverCustomWidth('16');
      setCoverCustomHeight('9');
      setCoverFit('cover');
      setCoverPosition('center');

      setGallery([]);
      setVideoUrl('');
      setVideoRatio('16:9');
      setVideoCustomWidth('16');
      setVideoCustomHeight('9');
      setVideoFit('cover');

      setRelatedProductIds([]);
      setPublished(true);
      setSortOrder(0);
      setSeoTitle('');
      setMetaDescription('');
    }
    setStatusMessage(null);
  }, [project, isOpen]);

  // Auto-generate slug from English title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleAddWorkItem = () => {
    if (newWorkItem.trim()) {
      setWorkDeliveredItems([...workDeliveredItems, newWorkItem.trim()]);
      setNewWorkItem('');
    }
  };

  const handleRemoveWorkItem = (index: number) => {
    setWorkDeliveredItems(workDeliveredItems.filter((_, i) => i !== index));
  };

  // Image Upload Handlers
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStatusMessage('Optimizing cover image...');
      try {
        const compressed = await preserveOriginalUploadedImage(file, 1600, 0.82);
        setCoverImage(compressed);
        setStatusMessage(null);
      } catch (err) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setCoverImage(reader.result);
          }
          setStatusMessage(null);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setStatusMessage(`Processing ${files.length} gallery photo(s)...`);
    for (const file of files) {
      try {
        const compressed = await preserveOriginalUploadedImage(file, 1600, 0.82);
        setGallery((prev) => [...prev, compressed]);
      } catch (err) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setGallery((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    setStatusMessage(null);
  };

  const handleSetGalleryAsCover = (img: string) => {
    setCoverImage(img);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Video Upload Handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 80 * 1024 * 1024) {
        setStatusMessage('Video file is too large (max 80MB). Please select a compressed MP4 video or paste a YouTube/Vimeo/Cloud link.');
        return;
      }
      setIsSubmitting(true);
      setStatusMessage('Reading and preparing video file...');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setVideoUrl(reader.result);
          setStatusMessage('Video loaded successfully! Click "Save Project" to store.');
        }
        setIsSubmitting(false);
      };
      reader.onerror = () => {
        setStatusMessage('Failed to read video file.');
        setIsSubmitting(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRelatedProduct = (productId: string) => {
    setRelatedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setStatusMessage('Please enter a project title');
      return;
    }

    if (!coverImage.trim() && gallery.length === 0) {
      setStatusMessage('Please upload or provide a project cover image');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Saving project and syncing media...');

    try {
      const finalType = projectType === 'Other' && customProjectType.trim() ? customProjectType.trim() : projectType;
      const finalCover = coverImage || gallery[0] || '';
      const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const finalId = project?.id || `proj-${Date.now()}`;

      const projectData: ProjectItem = {
        id: finalId,
        title: title.trim(),
        titleAR: titleAR.trim() || undefined,
        slug: finalSlug,
        location: location.trim() || 'Cairo, Egypt',
        projectType: finalType,
        year: year.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || title.trim(),
        craftStory: craftStory.trim() || undefined,
        materials: materials.trim() || 'Solid Egyptian Yellow Brass',
        finish: finish.trim() || undefined,
        workDelivered: workDeliveredItems,
        customManufacturing: customManufacturing.trim() || undefined,

        // Cover Media
        coverImage: finalCover,
        mediaType,
        coverRatio,
        coverCustomRatioWidth: Number(coverCustomWidth) || 16,
        coverCustomRatioHeight: Number(coverCustomHeight) || 9,
        coverFit,
        coverPosition,

        // Gallery
        gallery,

        // Video
        videoUrl: videoUrl.trim() || undefined,
        videoRatio,
        videoCustomRatioWidth: Number(videoCustomWidth) || 16,
        videoCustomRatioHeight: Number(videoCustomHeight) || 9,
        videoFit,

        // Related Products
        relatedProductIds,

        // Status & Sort
        published,
        sortOrder: Number(sortOrder) || 0,

        // SEO
        seoTitle: seoTitle.trim() || `${title.trim()} | TURATH Architectural Projects`,
        metaDescription: metaDescription.trim() || shortDescription.trim() || undefined,

        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(projectData);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setIsSubmitting(false);
      setStatusMessage(`Error saving project: ${err?.message || err}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0e0d0a] border border-[#d4c59d] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/25 bg-[#141310] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#d4c59d]" />
            <h3 className="font-serif-luxury text-lg font-bold text-[#f5f0e6]">
              {isEditing ? `Edit Project: ${project?.title}` : 'Add New Architectural Project'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#201e18] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-[#d4c59d]/20 bg-[#0a0a08] overflow-x-auto custom-scrollbar flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex-shrink-0 ${
              activeTab === 'general'
                ? 'border-[#d4c59d] text-[#d4c59d]'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            General & Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('craft')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex-shrink-0 ${
              activeTab === 'craft'
                ? 'border-[#d4c59d] text-[#d4c59d]'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            Craft & Work Delivered
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex-shrink-0 ${
              activeTab === 'media'
                ? 'border-[#d4c59d] text-[#d4c59d]'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            Cover, Gallery & Video
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex-shrink-0 ${
              activeTab === 'products'
                ? 'border-[#d4c59d] text-[#d4c59d]'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            Connected Products ({relatedProductIds.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex-shrink-0 ${
              activeTab === 'seo'
                ? 'border-[#d4c59d] text-[#d4c59d]'
                : 'border-transparent text-[#9e9174] hover:text-[#f5f0e6]'
            }`}
          >
            SEO & Slug
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-6 custom-scrollbar">
          {statusMessage && (
            <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: GENERAL & OVERVIEW */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Project Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Nile Ritz-Carlton Presidential Suites"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1 font-arabic" dir="rtl">
                    اسم المشروع بالعربية
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={titleAR}
                    onChange={(e) => setTitleAR(e.target.value)}
                    placeholder="مثال: أجنحة النيل ريتز-كارلتون الرئاسية"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d] font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cairo, Egypt or Riyadh, KSA"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
                  >
                    {PROJECT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {projectType === 'Other' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Specify Custom Project Type
                  </label>
                  <input
                    type="text"
                    value={customProjectType}
                    onChange={(e) => setCustomProjectType(e.target.value)}
                    placeholder="e.g. Embassy, Museum, Yacht, etc."
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  Short Description (Card Teaser)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A concise 1-2 sentence highlight for project cards..."
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  Full Project Overview (The Project Story) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed architectural scope, client brief, atmosphere, and execution context..."
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 bg-[#141414] rounded-lg border border-[#d4c59d]/30">
                  <input
                    type="checkbox"
                    id="published-toggle"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 accent-[#d4c59d] cursor-pointer"
                  />
                  <label htmlFor="published-toggle" className="text-xs font-bold text-[#f5f0e6] cursor-pointer">
                    Publish Project Live (منشور للزوار)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRAFT & WORK DELIVERED */}
          {activeTab === 'craft' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  The Craft (Craftsmanship & Artisanal Techniques)
                </label>
                <textarea
                  rows={3}
                  value={craftStory}
                  onChange={(e) => setCraftStory(e.target.value)}
                  placeholder="Explain the hand-hammering, repoussé, punch-needle perforation, metal casting, or soldering techniques..."
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Materials Used
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. Solid High-Grade Egyptian Yellow Brass, Red Copper"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                    Metal Finish & Patina
                  </label>
                  <input
                    type="text"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    placeholder="e.g. Antique Hand-Burnished Brass, Champagne Gold Wax"
                    className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {/* Work Delivered List */}
              <div className="bg-[#141310] border border-[#d4c59d]/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Work Delivered / Scope of Manufactured Pieces ({workDeliveredItems.length})</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWorkItem}
                    onChange={(e) => setNewWorkItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddWorkItem();
                      }
                    }}
                    placeholder="e.g. 4x Monumental Sultan Hassan Pierced Chandeliers"
                    className="flex-grow bg-[#0e0d0a] border border-[#d4c59d]/40 rounded-lg px-3 py-1.5 text-xs text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                  <button
                    type="button"
                    onClick={handleAddWorkItem}
                    className="px-3.5 py-1.5 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {workDeliveredItems.length > 0 && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {workDeliveredItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#0e0d0a] border border-[#d4c59d]/20 text-xs text-[#f5f0e6]"
                      >
                        <span className="truncate">• {item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveWorkItem(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  Custom Engineering & On-Site Installation Notes
                </label>
                <textarea
                  rows={2}
                  value={customManufacturing}
                  onChange={(e) => setCustomManufacturing(e.target.value)}
                  placeholder="Structural mounts, seismic considerations, laser 3D curvature fitting, on-site assembly..."
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA (COVER, GALLERY & VIDEO RATIOS) */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Cover Image Section */}
              <div className="bg-[#141310] border border-[#d4c59d]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d4c59d]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                      Project Cover Image *
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      onChange={handleCoverUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#201d14] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-black border border-[#d4c59d]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Cover</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Paste direct HTTPS image URL or upload above..."
                  className="w-full bg-[#0e0d0a] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />

                {coverImage && (
                  <div className="relative rounded-lg overflow-hidden bg-black max-h-56 flex items-center justify-center border border-[#d4c59d]/20">
                    <img src={coverImage} alt="Cover Preview" className="max-h-56 object-contain" />
                  </div>
                )}

                {/* Global Ratio Controls for Cover */}
                <div className="pt-3 border-t border-[#d4c59d]/20">
                  <MediaRatioSelectorControl
                    mediaType={mediaType}
                    onChangeMediaType={setMediaType}
                    showMediaTypeSelector={false}
                    ratio={coverRatio}
                    onChangeRatio={setCoverRatio}
                    customWidth={coverCustomWidth}
                    onChangeCustomWidth={setCoverCustomWidth}
                    customHeight={coverCustomHeight}
                    onChangeCustomHeight={setCoverCustomHeight}
                    fit={coverFit}
                    onChangeFit={setCoverFit}
                    position={coverPosition}
                    onChangePosition={setCoverPosition}
                    title="Project Cover Presentation & Aspect Ratio"
                    titleAR="أبعاد ونسبة عرض غلاف المشروع"
                    compact
                  />
                </div>
              </div>

              {/* Gallery Images Management */}
              <div className="bg-[#141310] border border-[#d4c59d]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4c59d]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                      Project Gallery Images ({gallery.length})
                    </span>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      onChange={handleGalleryUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Gallery Photos</span>
                    </button>
                  </div>
                </div>

                {gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-[#d4c59d]/30"
                      >
                        <img src={img} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetGalleryAsCover(img)}
                            className="p-1.5 rounded bg-[#d4c59d] text-black hover:bg-white"
                            title="Set as Project Cover"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9e9174] italic">
                    No gallery photos added yet. Upload high-res photography of the completed installation.
                  </p>
                )}
              </div>

              {/* Project Video Section */}
              <div className="bg-[#141310] border border-[#d4c59d]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#d4c59d]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                      Project Video (Installation & Craft Documentary)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={handleVideoUpload}
                      accept="video/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#201d14] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-black border border-[#d4c59d]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video File</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter video URL (MP4, YouTube, Vimeo, or upload above)..."
                    className="flex-grow bg-[#0e0d0a] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-xs text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                  />
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-900"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {videoUrl && (
                  <div className="pt-2">
                    <MediaRatioSelectorControl
                      mediaType="video"
                      showMediaTypeSelector={false}
                      ratio={videoRatio}
                      onChangeRatio={setVideoRatio}
                      customWidth={videoCustomWidth}
                      onChangeCustomWidth={setVideoCustomWidth}
                      customHeight={videoCustomHeight}
                      onChangeCustomHeight={setVideoCustomHeight}
                      fit={videoFit}
                      onChangeFit={setVideoFit}
                      title="Project Video Display Ratio"
                      titleAR="نسبة وأبعاد عرض فيديو المشروع"
                      compact
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CONNECTED PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#9e9174] leading-relaxed">
                  Select existing handcrafted pieces from the TURATH catalog that were manufactured and featured in this project. 
                  Visitors will see these pieces on the project details page with direct links to explore specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {products.map((prod) => {
                  const isSelected = relatedProductIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleRelatedProduct(prod.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-[#242017] border-[#d4c59d] text-white shadow-md'
                          : 'bg-[#141414] border-[#d4c59d]/20 text-[#b3a480] hover:border-[#d4c59d]/40'
                      }`}
                    >
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0 border border-[#d4c59d]/30"
                      />
                      <div className="min-w-0 flex-grow">
                        <div className="text-xs font-bold text-[#f5f0e6] truncate">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-[#9e9174] truncate">
                          {prod.categoryId} • {prod.dimensions}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${
                          isSelected ? 'bg-[#d4c59d] border-[#d4c59d] text-black' : 'border-[#d4c59d]/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: SEO & SLUG */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  URL Slug (/projects/...)
                </label>
                <div className="flex items-center bg-[#141414] border border-[#d4c59d]/40 rounded-lg overflow-hidden">
                  <span className="px-3 text-xs text-[#9e9174] bg-[#1c1912] border-r border-[#d4c59d]/30 select-none">
                    /projects/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                    placeholder="project-slug-name"
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#f5f0e6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  Custom Page Title (SEO Meta Title)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. The Nile Ritz-Carlton Presidential Suites | TURATH Architectural Projects"
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4c59d] mb-1">
                  Meta Description (Google & Social Sharing)
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Search engine summary (recommended 140-160 characters)..."
                  className="w-full bg-[#141414] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] placeholder-[#9e9174] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#d4c59d]/20 flex items-center justify-between flex-wrap gap-3">
            <div>
              {isEditing && onDelete && project && (
                showDeleteConfirm ? (
                  <div className="flex items-center gap-2 bg-red-950/90 border border-red-500/50 p-1.5 rounded-lg animate-in fade-in">
                    <span className="text-red-200 text-xs font-semibold font-arabic">تأكيد حذف المشروع نهائياً؟</span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        setIsSubmitting(true);
                        await onDelete(project.id);
                        setIsSubmitting(false);
                        setShowDeleteConfirm(false);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      نعم، حذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-1 rounded bg-[#201d14] text-[#d4c59d] hover:text-white text-xs cursor-pointer transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3.5 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#201d14] text-[#d4c59d] border border-[#d4c59d]/40 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-[#d4c59d] hover:bg-[#e6d8b5] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
