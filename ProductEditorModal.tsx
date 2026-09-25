import React, { useState, useEffect, useRef } from 'react';
import { ProductItem, ProductCategoryInfo, CategorySpecificFields } from './types';
import { PRODUCT_CATEGORIES } from './initialCatalog';
import { getStoredCategories } from './categoryStorage';
import { compressPortraitImage1080x1920, compressSquareImage1080, estimateObjectByteSize, preserveOriginalUploadedImage } from './imageCompressor';
import { EmbeddedVideoPlayer } from './EmbeddedVideoPlayer';
import { 
  IMAGE_RATIO_OPTIONS, 
  ProductImageRatioPreset, 
  computeProductImageRatio,
  MediaType,
  MediaRatioPreset,
  MediaObjectFit,
  MediaObjectPosition,
  computeProductVideoRatio,
  MEDIA_TYPE_OPTIONS,
  MEDIA_RATIO_OPTIONS,
  MEDIA_FIT_OPTIONS,
  MEDIA_POSITION_OPTIONS
} from './imageRatioUtils';
import { TurathImage } from "./TurathImage";
import { TurathMedia } from "./TurathMedia";
import { MediaRatioSelectorControl } from "./MediaRatioSelectorControl";
import { 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Check, 
  Sparkles, 
  Download, 
  ExternalLink,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Star,
  Layers,
  Palette,
  Ruler,
  Hammer,
  HelpCircle,
  MessageCircle,
  FileText
} from 'lucide-react';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  categories?: ProductCategoryInfo[];
  onSaveProduct: (product: ProductItem) => void | Promise<void>;
  onDeleteProduct: (productId: string) => void | Promise<void>;
  onResetCatalog: () => void;
  initialCategoryId?: string;
  editProduct?: ProductItem | null;
}

const ALL_APPLICATION_OPTIONS = [
  'Homes',
  'Villas',
  'Palaces',
  'Hotels',
  'Restaurants',
  'Offices',
  'Commercial Projects',
  'Hospitality',
  'Interior Projects',
  'Architectural Projects'
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onResetCatalog,
  initialCategoryId,
  editProduct,
}) => {
  const activeCategories = categories && categories.length > 0 ? categories : getStoredCategories();

  // Selected mode: 'add' or editing existing
  const [selectedProductId, setSelectedProductId] = useState<string>(editProduct?.id || 'new');

  // Active section tab for clean navigation
  const [activeTab, setActiveTab] = useState<
    'info' | 'images' | 'materials' | 'dimensions' | 'customization' | 'category' | 'seo'
  >('info');

  // Product Basic Information
  const [sku, setSku] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(
    editProduct?.categoryId || initialCategoryId || 'mirrors'
  );
  const [nameEN, setNameEN] = useState<string>('');
  const [nameAR, setNameAR] = useState<string>('');
  const [shortDescEN, setShortDescEN] = useState<string>('');
  const [shortDescAR, setShortDescAR] = useState<string>('');
  const [fullDescEN, setFullDescEN] = useState<string>('');
  const [fullDescAR, setFullDescAR] = useState<string>('');
  const [story, setStory] = useState<string>('');

  // Images State (strictly independent per product)
  const [mainImage, setMainImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [imageAltEN, setImageAltEN] = useState<string>('');
  const [imageAltAR, setImageAltAR] = useState<string>('');
  const [imageCaption, setImageCaption] = useState<string>('');
  const [isProcessingPhotos, setIsProcessingPhotos] = useState<boolean>(false);

  // Media Type Selection ('image' | 'video')
  const [mediaType, setMediaType] = useState<MediaType>('image');

  // Dynamic Image Ratio & Fit Controls (Preserves original master files)
  const [imageRatio, setImageRatio] = useState<MediaRatioPreset>('4:5');
  const [customRatioWidth, setCustomRatioWidth] = useState<number | string>(5);
  const [customRatioHeight, setCustomRatioHeight] = useState<number | string>(7);
  const [imageFit, setImageFit] = useState<MediaObjectFit>('contain');
  const [imagePosition, setImagePosition] = useState<MediaObjectPosition>('center');
  const [imageRatios, setImageRatios] = useState<Record<string, string>>({});
  const [imageFits, setImageFits] = useState<Record<string, 'cover' | 'contain'>>({});
  const [imagePositions, setImagePositions] = useState<Record<string, string>>({});

  // Dynamic Video Ratio & Fit Controls
  const [videoRatio, setVideoRatio] = useState<MediaRatioPreset>('4:5');
  const [videoCustomRatioWidth, setVideoCustomRatioWidth] = useState<number | string>(16);
  const [videoCustomRatioHeight, setVideoCustomRatioHeight] = useState<number | string>(9);
  const [videoFit, setVideoFit] = useState<MediaObjectFit>('contain');
  const [videoPosition, setVideoPosition] = useState<MediaObjectPosition>('center');
  const [videoPoster, setVideoPoster] = useState<string>('');

  // Material & Finishes
  const [material, setMaterial] = useState<string>('Solid Egyptian Yellow Brass');
  const [materialDetails, setMaterialDetails] = useState<string>('');
  const [finish, setFinish] = useState<string>('Antique Patina Brass');
  const [finishDetails, setFinishDetails] = useState<string>('');
  const [finishOptionsInput, setFinishOptionsInput] = useState<string>(
    'Antique Brass, Polished Gold Brass, Aged Dark Patina'
  );

  // Craftsmanship
  const [craftTechnique, setCraftTechnique] = useState<string>('Hand-Pierced Openwork & Fine Patina');
  const [techniqueDetails, setTechniqueDetails] = useState<string>('');

  // Dimensions
  const [dimensionsSummary, setDimensionsSummary] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [diameter, setDiameter] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [customDimensions, setCustomDimensions] = useState<string>('Custom sizing and tailoring available upon request.');

  // Customization
  const [customSize, setCustomSize] = useState<string>('Available in custom dimensions');
  const [customDesign, setCustomDesign] = useState<string>('Bespoke arabesque or modern motifs supported');
  const [customFinish, setCustomFinish] = useState<string>('Available in custom patinas or 24K gold accents');
  const [customDetails, setCustomDetails] = useState<string>('');

  // Availability & Lead Time
  const [availability, setAvailability] = useState<string>('made_to_order');
  const [leadTime, setLeadTime] = useState<string>('10-14 business days');

  // Video
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Applications
  const [applications, setApplications] = useState<string[]>([
    'Villas',
    'Palaces',
    'Hotels',
    'Interior Projects'
  ]);

  // Pricing
  const [price, setPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<'quote' | 'fixed' | 'starting_from'>('quote');

  // Featured & Visibility
  const [featured, setFeatured] = useState<boolean>(true);
  const [visibility, setVisibility] = useState<'published' | 'draft' | 'hidden'>('published');

  // SEO
  const [seoSlug, setSeoSlug] = useState<string>('');
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');

  // Inquiry / WhatsApp
  const [whatsappMessage, setWhatsappMessage] = useState<string>('');

  // Related Products
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);

  // Category Specific Attributes
  const [categoryFields, setCategoryFields] = useState<CategorySpecificFields>({});

  // UI status and confirm delete
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  // Hidden file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);

  // Helper to load product into form
  const loadProductIntoForm = (prod: ProductItem | null) => {
    if (!prod) {
      // New product default
      const prefix = categoryId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'TR';
      const newSku = `TR-${prefix}-${Math.floor(100 + Math.random() * 900)}`;
      setSku(newSku);
      setNameEN('');
      setNameAR('');
      setShortDescEN('');
      setShortDescAR('');
      setFullDescEN('');
      setFullDescAR('');
      setStory('');
      setMainImage('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80');
      setGalleryImages([]);
      setImageAltEN('');
      setImageAltAR('');
      setImageCaption('');
      setMaterial('Solid Egyptian Yellow Brass');
      setMaterialDetails('');
      setFinish('Antique Patina Brass');
      setFinishDetails('');
      setFinishOptionsInput('Antique Brass, Polished Gold Brass, Aged Dark Patina');
      setCraftTechnique('Hand-Pierced Openwork & Fine Patina');
      setTechniqueDetails('');
      setDimensionsSummary('Custom dimensions available');
      setHeight('');
      setWidth('');
      setDepth('');
      setDiameter('');
      setWeight('');
      setCustomDimensions('Custom sizing available upon request.');
      setCustomSize('Available in custom dimensions');
      setCustomDesign('Bespoke custom patterns supported');
      setCustomFinish('Available in custom patinas');
      setCustomDetails('');
      setAvailability('made_to_order');
      setLeadTime('10-14 business days');
      setVideoUrl('');
      setApplications(['Villas', 'Palaces', 'Hotels', 'Interior Projects']);
      setPrice('');
      setPriceType('quote');
      setFeatured(true);
      setVisibility('published');
      setSeoSlug('');
      setSeoTitle('');
      setMetaDescription('');
      setSeoKeywords('');
      setWhatsappMessage('');
      setRelatedProductIds([]);
      setCategoryFields({});
      setMediaType('image');
      setImageRatio('4:5');
      setCustomRatioWidth(5);
      setCustomRatioHeight(7);
      setImageFit('contain');
      setImagePosition('center');
      setImageRatios({});
      setImageFits({});
      setImagePositions({});
      setVideoRatio('4:5');
      setVideoCustomRatioWidth(16);
      setVideoCustomRatioHeight(9);
      setVideoFit('contain');
      setVideoPosition('center');
      setVideoPoster('');
      return;
    }

    setSku(prod.sku || prod.id);
    setCategoryId(prod.categoryId);
    setNameEN(prod.nameEN || prod.name || '');
    setNameAR(prod.nameAR || '');
    setShortDescEN(prod.shortDescEN || prod.tagline || '');
    setShortDescAR(prod.shortDescAR || '');
    setFullDescEN(prod.fullDescriptionEN || prod.description || '');
    setFullDescAR(prod.fullDescriptionAR || '');
    setStory(prod.story || '');

    const imagesList = Array.isArray(prod.images) && prod.images.length > 0 ? [...prod.images] : [];
    const primary = prod.mainImage || imagesList[0] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80';
    setMainImage(primary);
    setGalleryImages(imagesList.filter((img) => img !== primary));

    setMediaType(prod.mediaType || (prod.videoUrl ? 'image' : 'image'));
    setImageRatio((prod.imageRatio as MediaRatioPreset) || '4:5');
    setCustomRatioWidth(prod.customRatioWidth ?? 5);
    setCustomRatioHeight(prod.customRatioHeight ?? 7);
    setImageFit((prod.imageFit as MediaObjectFit) || 'contain');
    setImagePosition((prod.imagePosition as MediaObjectPosition) || 'center');
    setImageRatios(prod.imageRatios ? { ...prod.imageRatios } : {});
    setImageFits(prod.imageFits ? { ...prod.imageFits } : {});
    setImagePositions(prod.imagePositions ? { ...prod.imagePositions } : {});

    setVideoRatio((prod.videoRatio as MediaRatioPreset) || '4:5');
    setVideoCustomRatioWidth(prod.videoCustomRatioWidth ?? 16);
    setVideoCustomRatioHeight(prod.videoCustomRatioHeight ?? 9);
    setVideoFit((prod.videoFit as MediaObjectFit) || 'contain');
    setVideoPosition((prod.videoPosition as MediaObjectPosition) || 'center');
    setVideoPoster(prod.videoPoster || '');

    setImageAltEN(prod.imageAltEN || '');
    setImageAltAR(prod.imageAltAR || '');
    setImageCaption(prod.imageCaption || '');
    setMaterial(prod.material || prod.materials || 'Solid Egyptian Yellow Brass');
    setMaterialDetails(prod.materialDetails || '');
    setFinish(prod.finish || prod.finishOptions?.[0] || 'Antique Patina Brass');
    setFinishDetails(prod.finishDetails || '');
    setFinishOptionsInput(prod.finishOptions?.join(', ') || 'Antique Brass, Polished Gold Brass');
    setCraftTechnique(prod.craftTechnique || '');
    setTechniqueDetails(prod.techniqueDetails || '');
    setDimensionsSummary(prod.dimensions || '');
    setHeight(prod.height || '');
    setWidth(prod.width || '');
    setDepth(prod.depth || '');
    setDiameter(prod.diameter || '');
    setWeight(prod.weight || '');
    setCustomDimensions(prod.customDimensions || '');
    setCustomSize(prod.customSize || '');
    setCustomDesign(prod.customDesign || '');
    setCustomFinish(prod.customFinish || '');
    setCustomDetails(prod.customDetails || '');
    setAvailability(prod.availability || 'made_to_order');
    setLeadTime(prod.leadTime || '10-14 business days');
    setVideoUrl(prod.videoUrl || '');
    setApplications(prod.applications && prod.applications.length > 0 ? [...prod.applications] : ['Villas', 'Palaces', 'Hotels']);
    setPrice(prod.price || '');
    setPriceType(prod.priceType || 'quote');
    setFeatured(prod.featured ?? true);
    setVisibility(prod.visibility || 'published');
    setSeoSlug(prod.seoSlug || '');
    setSeoTitle(prod.seoTitle || '');
    setMetaDescription(prod.metaDescription || '');
    setSeoKeywords(prod.seoKeywords || '');
    setWhatsappMessage(prod.whatsappMessage || '');
    setRelatedProductIds(prod.relatedProductIds ? [...prod.relatedProductIds] : []);
    setCategoryFields(prod.categoryFields ? { ...prod.categoryFields } : {});
  };

  // Sync state with editProduct
  useEffect(() => {
    if (editProduct) {
      setSelectedProductId(editProduct.id);
      loadProductIntoForm(editProduct);
    } else {
      setSelectedProductId('new');
      loadProductIntoForm(null);
    }
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  // Handle dropdown selection
  const handleSelectProductToEdit = (id: string) => {
    setSelectedProductId(id);
    if (id === 'new') {
      loadProductIntoForm(null);
    } else {
      const found = products.find((p) => p.id === id);
      if (found) {
        loadProductIntoForm(found);
      }
    }
  };

  // Auto-generate slug from nameEN
  const handleGenerateSlug = () => {
    const slug = (nameEN || 'piece')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSeoSlug(slug);
    if (!seoTitle) {
      setSeoTitle(`${nameEN || 'Handcrafted Brass Piece'} | TURATH Egypt`);
    }
    if (!metaDescription) {
      setMetaDescription(shortDescEN || fullDescEN.slice(0, 155));
    }
  };

  // Auto-generate WhatsApp message
  const handleGenerateWhatsAppMessage = () => {
    const generated = `Hello TURATH,\nI am interested in:\n${nameEN || 'Artisanal Piece'}\nProduct ID: ${sku || selectedProductId}\nSelected Finish: ${finish}\n\nPlease provide technical specifications and pricing.`;
    setWhatsappMessage(generated);
  };

  // Upload multiple images from device (compresses to 1080x1080)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    setStatusMessage({
      type: 'success',
      text: `Optimizing and processing ${files.length} photo(s)...`,
    });

    try {
      const processed: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const preservedImage = await preserveOriginalUploadedImage(file);
        processed.push(preservedImage);
      }

      if (processed.length > 0) {
        if (!mainImage || mainImage.includes('unsplash.com')) {
          setMainImage(processed[0]);
          setGalleryImages((prev) => [...prev, ...processed.slice(1)]);
        } else {
          setGalleryImages((prev) => [...prev, ...processed]);
        }
        setStatusMessage({
          type: 'success',
          text: `Added ${processed.length} image(s) to this piece.`,
        });
      }
    } catch (err) {
      console.error('Error processing photos:', err);
      setStatusMessage({
        type: 'error',
        text: 'Error processing photos. Please try another image.',
      });
    } finally {
      setIsProcessingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Replace a specific image
  const handleTriggerReplace = (index: number) => {
    replaceIndexRef.current = index;
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndexRef.current === null) return;

    try {
      const preservedImage = await preserveOriginalUploadedImage(file);
      const targetIndex = replaceIndexRef.current;
      if (targetIndex === -1) {
        // Replace main image
        setMainImage(preservedImage);
      } else {
        setGalleryImages((prev) => {
          const next = [...prev];
          next[targetIndex] = preservedImage;
          return next;
        });
      }
      setStatusMessage({ type: 'success', text: 'Image replaced successfully!' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to replace image.' });
    } finally {
      replaceIndexRef.current = null;
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Add Image URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    if (!mainImage) {
      setMainImage(newImageUrl.trim());
    } else {
      setGalleryImages((prev) => [...prev, newImageUrl.trim()]);
    }
    setNewImageUrl('');
    setStatusMessage({ type: 'success', text: 'Image URL added!' });
  };

  // Set any gallery image as Main
  const handleSetAsMain = (index: number) => {
    const selected = galleryImages[index];
    if (!selected) return;
    const oldMain = mainImage;
    const nextGallery = galleryImages.filter((_, i) => i !== index);
    if (oldMain) {
      nextGallery.unshift(oldMain);
    }
    setMainImage(selected);
    setGalleryImages(nextGallery);
    setStatusMessage({ type: 'success', text: 'Set as primary main image!' });
  };

  // Move gallery image order
  const handleMoveGallery = (index: number, direction: 'left' | 'right') => {
    setGalleryImages((prev) => {
      const next = [...prev];
      const target = direction === 'left' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  // Remove Image
  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Video File Upload Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g. 100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatusMessage({
        type: 'error',
        text: 'Video file size exceeds 100MB limit. Please select a smaller video.',
      });
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      return;
    }

    setIsUploadingVideo(true);
    setStatusMessage({ type: 'info', text: 'Processing product video...' });

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setVideoUrl(result);
        setStatusMessage({
          type: 'success',
          text: `Product video "${file.name}" uploaded successfully!`,
        });
      }
      setIsUploadingVideo(false);
    };

    reader.onerror = () => {
      console.error('Failed to read video file');
      setStatusMessage({
        type: 'error',
        text: 'Failed to read video file. Please try another video format (MP4/WebM).',
      });
      setIsUploadingVideo(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
    setStatusMessage({ type: 'info', text: 'Product video removed.' });
  };

  // Category specific field change helper
  const handleCategoryFieldChange = (key: string, value: any) => {
    setCategoryFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEN.trim() && !nameAR.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide at least an English or Arabic product name.' });
      return;
    }

    const finishOptions = finishOptionsInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    // Combine mainImage and gallery images
    const allImages: string[] = [];
    if (mainImage.trim()) allImages.push(mainImage.trim());
    galleryImages.forEach((img) => {
      if (img.trim() && !allImages.includes(img.trim())) {
        allImages.push(img.trim());
      }
    });

    if (allImages.length === 0) {
      allImages.push('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80');
    }

    const finalId = selectedProductId === 'new' ? (sku.trim() || `TR-ITEM-${Date.now()}`) : selectedProductId;
    const finalSlug = seoSlug.trim() || (nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || finalId;

    const productData: ProductItem = {
      id: finalId,
      sku: sku.trim() || finalId,
      categoryId,
      name: nameEN.trim() || nameAR.trim(),
      nameEN: nameEN.trim() || 'Untitled Piece',
      nameAR: nameAR.trim() || undefined,
      tagline: shortDescEN.trim() || 'Handcrafted Egyptian Brass Piece',
      shortDescEN: shortDescEN.trim() || undefined,
      shortDescAR: shortDescAR.trim() || undefined,
      description: fullDescEN.trim() || 'Masterfully handcrafted in Gamaliya, Cairo using traditional Egyptian techniques.',
      fullDescriptionEN: fullDescEN.trim() || undefined,
      fullDescriptionAR: fullDescAR.trim() || undefined,
      story: story.trim() || undefined,
      mediaType,
      mainImage: allImages[0],
      images: allImages,
      galleryImages: allImages.slice(1),
      imageRatio,
      customRatioWidth: Number(customRatioWidth) || 5,
      customRatioHeight: Number(customRatioHeight) || 7,
      imageFit,
      imagePosition,
      imageRatios,
      imageFits,
      imagePositions,
      videoRatio,
      videoCustomRatioWidth: Number(videoCustomRatioWidth) || 16,
      videoCustomRatioHeight: Number(videoCustomRatioHeight) || 9,
      videoFit,
      videoPosition,
      videoPoster: videoPoster.trim() || undefined,
      imageAltEN: imageAltEN.trim() || nameEN.trim(),
      imageAltAR: imageAltAR.trim() || nameAR.trim(),
      imageCaption: imageCaption.trim() || undefined,
      material: material.trim(),
      materials: material.trim(),
      materialDetails: materialDetails.trim() || undefined,
      finish: finish.trim(),
      finishDetails: finishDetails.trim() || undefined,
      finishOptions: finishOptions.length > 0 ? finishOptions : ['Antique Brass', 'Polished Gold Brass'],
      craftTechnique: craftTechnique.trim(),
      techniqueDetails: techniqueDetails.trim() || undefined,
      dimensions: dimensionsSummary.trim() || 'Custom sizing available',
      height: height.trim() || undefined,
      width: width.trim() || undefined,
      depth: depth.trim() || undefined,
      diameter: diameter.trim() || undefined,
      weight: weight.trim() || undefined,
      customDimensions: customDimensions.trim() || undefined,
      customSize: customSize.trim() || undefined,
      customDesign: customDesign.trim() || undefined,
      customFinish: customFinish.trim() || undefined,
      customDetails: customDetails.trim() || undefined,
      availability,
      leadTime: leadTime.trim() || '10-14 business days',
      videoUrl: videoUrl.trim() || undefined,
      applications: applications.length > 0 ? applications : undefined,
      price: price.trim() || undefined,
      priceType,
      featured,
      visibility,
      seoSlug: finalSlug,
      seoTitle: seoTitle.trim() || `${nameEN} | TURATH Egypt`,
      metaDescription: metaDescription.trim() || shortDescEN.trim(),
      seoKeywords: seoKeywords.trim() || undefined,
      whatsappMessage: whatsappMessage.trim() || undefined,
      relatedProductIds,
      categoryFields,
      updatedAt: new Date().toISOString(),
    };

    setStatusMessage({ type: 'info', text: 'Saving product and syncing to cloud database...' });

    try {
      await onSaveProduct(productData);
      setStatusMessage({ type: 'success', text: 'Product saved and synchronized to Cloud across all browsers & devices!' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Save product error:', err);
      setStatusMessage({ type: 'error', text: 'Error saving to cloud database: ' + (err as Error).message });
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `turath-brass-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0e0e13] border border-[#d4c59d]/40 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#d4c59d]/10 text-[#d4c59d] border border-[#d4c59d]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#f5ebd7] tracking-wider">
                TURATH Product & Catalog Manager
              </h2>
              <p className="text-xs text-[#b8b2a3]">
                Edit independent product details, high-res photos, bilingual descriptions & specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 rounded text-xs text-[#d4c59d] border border-[#d4c59d]/30 hover:bg-[#d4c59d]/10 transition-colors flex items-center gap-1.5"
              title="Backup Catalog as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#b8b2a3] hover:text-[#f5ebd7] hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Selector Dropdown Bar */}
        <div className="px-6 py-3 bg-[#0a0a0e] border-b border-[#d4c59d]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#9e9174] uppercase tracking-wider font-bold">Select Product:</span>
            <select
              value={selectedProductId}
              onChange={(e) => handleSelectProductToEdit(e.target.value)}
              className="px-3 py-1.5 rounded-md bg-[#161620] border border-[#d4c59d]/40 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
            >
              <option value="new">+ ADD NEW PIECE / PRODUCT</option>
              {activeCategories.map((cat) => {
                const catProds = products.filter((p) => p.categoryId === cat.id);
                if (catProds.length === 0) return null;
                return (
                  <optgroup key={cat.id} label={`${cat.name} (${catProds.length})`}>
                    {catProds.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku ? `[${p.sku}] ` : ''}{p.nameEN || p.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9e9174]">
              {selectedProductId === 'new' ? 'Creating New Independent Product' : `Editing ID: ${selectedProductId}`}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-[#0e0e13] border-b border-[#d4c59d]/20 overflow-x-auto text-xs">
          {[
            { id: 'info', label: '1. Basic Info & Names' },
            { id: 'images', label: '2. Media (Images & Videos)' },
            { id: 'materials', label: '3. Materials & Craft' },
            { id: 'dimensions', label: '4. Dimensions' },
            { id: 'customization', label: '5. Custom & Specs' },
            { id: 'category', label: '6. Category Specifics' },
            { id: 'seo', label: '7. SEO & WhatsApp' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#d4c59d] text-[#d4c59d] bg-[#1a1a24]/50'
                  : 'border-transparent text-[#9e9174] hover:text-[#f5ebd7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
                : statusMessage.type === 'info'
                ? 'bg-amber-950/80 text-amber-300 border-b border-amber-800'
                : 'bg-rose-950/80 text-rose-300 border-b border-rose-800'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-white/60 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar text-xs">
          {/* TAB 1: BASIC INFO & NAMES */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Product ID / SKU *
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. TR-MIR-001"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] font-mono focus:outline-none focus:border-[#d4c59d]"
                    required
                  />
                  <p className="text-[10px] text-[#9e9174] mt-1">Unique key preventing any image collision.</p>
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                  >
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.nameArabic ? `(${c.nameArabic})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Catalog Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                  >
                    <option value="published">Published (Visible)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Bilingual Product Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    value={nameEN}
                    onChange={(e) => setNameEN(e.target.value)}
                    placeholder="e.g. Gamaliya Sunburst Brass Mirror"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    اسم القطعة (بالعربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameAR}
                    onChange={(e) => setNameAR(e.target.value)}
                    placeholder="مثال: مرآة شمس الجمالية النحاسية الملكية"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] font-arabic focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {/* Bilingual Short Taglines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Short Description / Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={shortDescEN}
                    onChange={(e) => setShortDescEN(e.target.value)}
                    placeholder="e.g. Hand-pierced radiant sunburst frame in solid Cairo brass"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    الوصف المختصر (بالعربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={shortDescAR}
                    onChange={(e) => setShortDescAR(e.target.value)}
                    placeholder="مثال: إطار شعاعي مخرم يدوياً من النحاس المصري الخالص"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] font-arabic focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {/* Bilingual Full Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Full Description (English)
                  </label>
                  <textarea
                    rows={4}
                    value={fullDescEN}
                    onChange={(e) => setFullDescEN(e.target.value)}
                    placeholder="Full craftsmanship story, technique, historical motifs, and interior styling advice..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] leading-relaxed focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    الوصف التفصيلي (بالعربية)
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={fullDescAR}
                    onChange={(e) => setFullDescAR(e.target.value)}
                    placeholder="تفاصيل الحفر والتشكيل اليدوي، أصالة النقوش الفاطمية أو المملوكية وجودة التشطيب..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] font-arabic leading-relaxed focus:outline-none focus:border-[#d4c59d]"
                  />
                </div>
              </div>

              {/* Heritage Story */}
              <div>
                <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                  Artisan Lineage & Heritage Story
                </label>
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Optional heritage background: Crafted using 14th-century Mamluk repoussé lineage passed through three generations..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d4c59d] text-[#d4c59d] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured-check" className="text-[#f5ebd7] font-semibold cursor-pointer">
                  Feature this piece prominently on the Homepage and Collection Banners
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOS & GALLERY */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* GLOBAL MEDIA RATIO & FRAMING CONTROLS (IMAGES & VIDEOS) */}
              <MediaRatioSelectorControl
                mediaType={mediaType}
                onChangeMediaType={(t) => setMediaType(t)}
                showMediaTypeSelector={true}
                ratio={mediaType === 'video' ? videoRatio : imageRatio}
                onChangeRatio={(r) => {
                  if (mediaType === 'video') setVideoRatio(r);
                  else setImageRatio(r);
                }}
                customWidth={mediaType === 'video' ? videoCustomRatioWidth : customRatioWidth}
                onChangeCustomWidth={(w) => {
                  if (mediaType === 'video') setVideoCustomRatioWidth(w);
                  else setCustomRatioWidth(w);
                }}
                customHeight={mediaType === 'video' ? videoCustomRatioHeight : customRatioHeight}
                onChangeCustomHeight={(h) => {
                  if (mediaType === 'video') setVideoCustomRatioHeight(h);
                  else setCustomRatioHeight(h);
                }}
                fit={mediaType === 'video' ? videoFit : imageFit}
                onChangeFit={(f) => {
                  if (mediaType === 'video') setVideoFit(f);
                  else setImageFit(f);
                }}
                position={mediaType === 'video' ? videoPosition : imagePosition}
                onChangePosition={(p) => {
                  if (mediaType === 'video') setVideoPosition(p);
                  else setImagePosition(p);
                }}
                title="Global Media Ratio & Framing Controls"
                titleAR="نظام التحكم الموحد في وسائط العرض (صور وفيديوهات)"
                description="Centralized aspect-ratio, framing fit, and position system for both images and videos. Original files are permanently untouched."
              />

              {/* Main Image Spotlight */}
              <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-[#f5ebd7] uppercase tracking-wider">
                      Primary Main Image
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9e9174]">
                    Live Display: {imageRatio === 'Custom' ? `${customRatioWidth}:${customRatioHeight}` : imageRatio} ({imageFit})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {(() => {
                    const currentRatio = computeProductImageRatio({
                      id: selectedProductId,
                      imageRatio,
                      customRatioWidth: Number(customRatioWidth) || 5,
                      customRatioHeight: Number(customRatioHeight) || 7,
                      imageFit,
                    } as any, mainImage);

                    return (
                      <TurathImage
                        src={mainImage}
                        alt="Main"
                        computedRatio={currentRatio}
                        containerClassName="w-36 max-w-full rounded-lg overflow-hidden border-2 border-[#d4c59d] bg-black flex-shrink-0 group flex items-center justify-center"
                      >
                        <button
                          type="button"
                          onClick={() => handleTriggerReplace(-1)}
                          className="absolute inset-0 bg-black/70 text-[#d4c59d] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-[11px] font-bold z-10"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Replace Photo</span>
                        </button>
                      </TurathImage>
                    );
                  })()}

                  <div className="flex-1 space-y-2 text-xs">
                    <p className="text-[#f5ebd7]">
                      This image is uniquely bound to Product ID <span className="font-mono text-[#d4c59d] font-bold">{sku || selectedProductId}</span>.
                    </p>
                    <p className="text-[#9e9174]">
                      Framed dynamically in <strong className="text-[#d4c59d]">{imageRatio}</strong> ratio with <strong className="text-[#d4c59d]">{imageFit}</strong> mode. Changing this image will <strong className="text-white">never</strong> alter the category cover or any other product.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleTriggerReplace(-1)}
                        className="px-3 py-1.5 rounded bg-[#d4c59d] text-black font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors"
                      >
                        Upload / Replace Main Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Images List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#f5ebd7] uppercase tracking-wider">
                      Additional Gallery Photos ({galleryImages.length})
                    </h3>
                    <p className="text-[11px] text-[#9e9174]">
                      Add alternative angles, artisan close-ups, in-situ palace photos, and patina details (1080 × 1920 Portrait)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhotos}
                    className="px-3 py-1.5 rounded bg-[#d4c59d] text-[#000000] font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors flex items-center gap-1.5"
                  >
                    {isProcessingPhotos ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Upload Photos</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                {galleryImages.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-[#d4c59d]/30 text-center space-y-2 bg-[#101018]">
                    <ImageIcon className="w-8 h-8 text-[#d4c59d]/50 mx-auto" />
                    <p className="text-[#f5ebd7] font-semibold">No additional gallery photos yet</p>
                    <p className="text-[11px] text-[#9e9174]">
                      Upload close-up photos from your computer or phone to provide a comprehensive gallery for clients.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {galleryImages.map((img, idx) => {
                      const specificRatio = imageRatios[img] || imageRatio;
                      const computed = computeProductImageRatio({
                        id: selectedProductId,
                        imageRatio: specificRatio as any,
                        customRatioWidth: Number(customRatioWidth) || 5,
                        customRatioHeight: Number(customRatioHeight) || 7,
                        imageFit,
                        imageRatios,
                      } as any, img);

                      const specificFit = imageFits[img] || imageFit;
                      const specificPos = imagePositions[img] || 'center';

                      return (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden border border-[#d4c59d]/30 bg-black group flex flex-col justify-between"
                      >
                        <TurathImage
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          computedRatio={computed}
                          containerClassName="w-full bg-[#0c0c10]"
                        >
                          <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#d4c59d] z-10">
                            {specificRatio}
                          </span>
                        </TurathImage>

                        {/* Ratio & Fit selector & Card Controls */}
                        <div className="p-1.5 bg-[#14141c] flex flex-col gap-1.5 border-t border-[#333]">
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <div className="flex items-center gap-1">
                              <span className="text-[#9e9174]">Ratio:</span>
                              <select
                                value={imageRatios[img] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setImageRatios((prev) => {
                                    const next = { ...prev };
                                    if (!val) {
                                      delete next[img];
                                    } else {
                                      next[img] = val;
                                    }
                                    return next;
                                  });
                                }}
                                className="w-full bg-[#101018] text-[#d4c59d] border border-[#333] rounded px-1 py-0.5 text-[10px] outline-none"
                              >
                                <option value="">Default ({imageRatio})</option>
                                {IMAGE_RATIO_OPTIONS.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[#9e9174]">Fit:</span>
                              <select
                                value={imageFits[img] || ''}
                                onChange={(e) => {
                                  const val = e.target.value as 'cover' | 'contain';
                                  setImageFits((prev) => {
                                    const next = { ...prev };
                                    if (!val) {
                                      delete next[img];
                                    } else {
                                      next[img] = val;
                                    }
                                    return next;
                                  });
                                }}
                                className="w-full bg-[#101018] text-[#d4c59d] border border-[#333] rounded px-1 py-0.5 text-[10px] outline-none"
                              >
                                <option value="">Default ({imageFit})</option>
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => handleSetAsMain(idx)}
                              className="px-1.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-black transition-colors text-[10px] font-bold uppercase"
                              title="Promote to Primary Main Image"
                            >
                              Set Main
                            </button>

                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveGallery(idx, 'left')}
                                  className="p-1 rounded text-[#9e9174] hover:text-white"
                                  title="Move Earlier"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              {idx < galleryImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveGallery(idx, 'right')}
                                  className="p-1 rounded text-[#9e9174] hover:text-white"
                                  title="Move Later"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleTriggerReplace(idx)}
                                className="p-1 rounded text-[#d4c59d] hover:text-white"
                                title="Replace Photo"
                              >
                                <Upload className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="p-1 rounded text-rose-400 hover:text-rose-200"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Image by URL fallback */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-lg bg-[#1c1c28] border border-[#d4c59d]/40 text-[#d4c59d] font-bold hover:bg-[#d4c59d] hover:text-black transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Hidden file upload inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                onChange={handleReplaceUpload}
                className="hidden"
              />
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                onChange={handleVideoFileUpload}
                className="hidden"
              />

              {/* Image SEO Alt & Caption */}
              <div className="pt-4 border-t border-[#d4c59d]/20 space-y-3">
                <span className="font-bold text-[#d4c59d] uppercase tracking-wider block">
                  Image SEO & Accessibility
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Image Alt Text (English)</label>
                    <input
                      type="text"
                      value={imageAltEN}
                      onChange={(e) => setImageAltEN(e.target.value)}
                      placeholder="e.g. Handcrafted solid Egyptian brass sunburst mirror"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">النص البديل للصورة (عربي)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={imageAltAR}
                      onChange={(e) => setImageAltAR(e.target.value)}
                      placeholder="مثال: مرآة نحاس مصري محفورة يدوياً في الجمالية"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7] font-arabic"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Product Video Section */}
              <div className="pt-4 border-t border-[#d4c59d]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#d4c59d] uppercase tracking-wider flex items-center gap-1.5 text-xs sm:text-sm">
                    <Video className="w-4 h-4 text-[#d4c59d]" />
                    <span>Upload Product Video (فيديو القطعة)</span>
                  </span>
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Video</span>
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4c59d]/30 space-y-4">
                  {/* Video URL Web Link */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#d4c59d]">
                      Video URL (YouTube, Vimeo, Cloudinary, or Direct MP4 Link)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={videoUrl && !videoUrl.startsWith('data:') ? videoUrl : ''}
                        onChange={(e) => setVideoUrl(e.target.value.trim())}
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://example.com/craft.mp4"
                        className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0e0e13] border border-[#d4c59d]/30 text-[#f5ebd7] text-xs focus:outline-none focus:border-[#d4c59d]"
                      />
                      {videoUrl && !videoUrl.startsWith('data:') && (
                        <button
                          type="button"
                          onClick={() => setVideoUrl('')}
                          className="px-3 py-2 rounded-lg bg-[#222] text-xs text-rose-400 hover:bg-[#333] transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-[#9e9174] block">
                      Recommended: Web links stream instantly to all visitors worldwide with 0KB cloud document size.
                    </span>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[#333]"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-[#9e9174] uppercase tracking-wider">Or Upload from Device</span>
                    <div className="flex-grow border-t border-[#333]"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      disabled={isUploadingVideo}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#d4c59d] text-black font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50 text-xs"
                    >
                      {isUploadingVideo ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading Video...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload Video File</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-[#9e9174] text-center sm:text-left">
                      Supported: MP4, WebM, MOV.
                    </span>
                  </div>

                  {/* Video Preview */}
                  {videoUrl ? (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#d4c59d]">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {videoUrl.startsWith('data:') ? 'Local Device Video Attached' : 'Web Video Link Connected'}
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-[#d4c59d]">
                          Ratio: {videoRatio === 'Custom' ? `${videoCustomRatioWidth}:${videoCustomRatioHeight}` : videoRatio} • Fit: {videoFit} • Pos: {videoPosition}
                        </span>
                      </div>
                      <div className="w-full max-w-[380px] mx-auto rounded-xl overflow-hidden border-2 border-[#d4c59d]/40 shadow-2xl bg-black">
                        <TurathMedia
                          type="video"
                          videoUrl={videoUrl}
                          ratio={videoRatio}
                          customWidth={videoCustomRatioWidth}
                          customHeight={videoCustomRatioHeight}
                          fit={videoFit}
                          position={videoPosition}
                          title="Product Video Showcase"
                          autoPlay={true}
                          muted={true}
                          loop={true}
                          playsInline={true}
                          controls={false}
                          showSoundToggle={true}
                          showVideoBadge={true}
                        />
                      </div>
                      <div className="flex justify-center pt-1">
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="px-4 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/80 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                          title="Remove product video"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Remove Product Video / حذف فيديو القطعة</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-lg border border-dashed border-[#d4c59d]/20 text-center text-xs text-[#9e9174] bg-[#0d0d12]">
                      <Video className="w-8 h-8 mx-auto text-[#d4c59d]/40 mb-2" />
                      <p className="text-[#f5ebd7] font-medium">No video attached for this piece yet</p>
                      <p className="text-[11px] text-[#9e9174] mt-0.5">Paste a video link or upload a file above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATERIALS & CRAFTSMANSHIP */}
          {activeTab === 'materials' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Primary Material *
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. Solid Egyptian Yellow Brass, Red Copper, or Brass & Copper"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                    required
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Yellow Brass', 'Red Copper', 'Brass + Copper', 'Solid Cast Brass'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMaterial(m)}
                        className="px-2 py-0.5 rounded bg-[#1c1c28] border border-[#333] text-[#d4c59d] text-[10px] hover:border-[#d4c59d]"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Primary Finish *
                  </label>
                  <input
                    type="text"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    placeholder="e.g. Antique Patina Brass, Polished Gold"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                  Available Finish Options (Comma Separated)
                </label>
                <input
                  type="text"
                  value={finishOptionsInput}
                  onChange={(e) => setFinishOptionsInput(e.target.value)}
                  placeholder="Antique Brass, Polished Gold Brass, Aged Patina, Brushed Satin"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Material Details & Metallurgy
                  </label>
                  <textarea
                    rows={3}
                    value={materialDetails}
                    onChange={(e) => setMaterialDetails(e.target.value)}
                    placeholder="e.g. CuZn37 Egyptian standard high-durability alloy, minimum 1.5mm thick spun plate..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Patina & Finish Details
                  </label>
                  <textarea
                    rows={3}
                    value={finishDetails}
                    onChange={(e) => setFinishDetails(e.target.value)}
                    placeholder="e.g. Natural chemical aging sealed with museum-grade microcrystalline renaissance wax..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>
              </div>

              {/* Craft Technique */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Craft / Manufacturing Technique
                  </label>
                  <input
                    type="text"
                    value={craftTechnique}
                    onChange={(e) => setCraftTechnique(e.target.value)}
                    placeholder="e.g. Hand-Pierced Arabesque Openwork & Chasing"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Technique Details
                  </label>
                  <input
                    type="text"
                    value={techniqueDetails}
                    onChange={(e) => setTechniqueDetails(e.target.value)}
                    placeholder="e.g. Chiseled by hand with fine steel burins by Gamaliya master smiths"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIMENSIONS */}
          {activeTab === 'dimensions' && (
            <div className="space-y-5">
              <div>
                <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                  Dimensions Display Summary *
                </label>
                <input
                  type="text"
                  value={dimensionsSummary}
                  onChange={(e) => setDimensionsSummary(e.target.value)}
                  placeholder="e.g. Diameter: 90 cm (35.4 in) | Depth: 4.5 cm"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  required
                />
                <p className="text-[10px] text-[#9e9174] mt-1">
                  Shown directly on product cards and quick specification highlights.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[#9e9174] font-semibold mb-1">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 110 cm"
                    className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#9e9174] font-semibold mb-1">Width</label>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g. 80 cm"
                    className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#9e9174] font-semibold mb-1">Depth</label>
                  <input
                    type="text"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    placeholder="e.g. 5 cm"
                    className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#9e9174] font-semibold mb-1">Diameter</label>
                  <input
                    type="text"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    placeholder="e.g. 90 cm"
                    className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#9e9174] font-semibold mb-1">Total Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 14.5 kg"
                    className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                  Custom Dimensions Capability Note
                </label>
                <input
                  type="text"
                  value={customDimensions}
                  onChange={(e) => setCustomDimensions(e.target.value)}
                  placeholder="e.g. Custom heights up to 250 cm and tailor-made profiles available upon request."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMIZATION & APPLICATIONS */}
          {activeTab === 'customization' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Custom Sizing Options
                  </label>
                  <input
                    type="text"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="e.g. Any custom diameter from 50cm to 300cm"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Custom Design Patterns
                  </label>
                  <input
                    type="text"
                    value={customDesign}
                    onChange={(e) => setCustomDesign(e.target.value)}
                    placeholder="e.g. Bespoke motifs from client CAD drawings"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Custom Finish Options
                  </label>
                  <input
                    type="text"
                    value={customFinish}
                    onChange={(e) => setCustomFinish(e.target.value)}
                    placeholder="e.g. Verdigris green, antique nickel, 24K gold"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>
              </div>

              {/* Availability & Lead Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Availability / Production Status
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  >
                    <option value="made_to_order">Made to Order (Bespoke Handcrafted)</option>
                    <option value="in_stock">In Stock (Immediate Dispatch)</option>
                    <option value="custom_only">Architectural Custom Fabrication Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Production / Lead Time
                  </label>
                  <input
                    type="text"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    placeholder="e.g. 10-14 business days"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Price Type
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  >
                    <option value="quote">Request a Quote (Default Luxury)</option>
                    <option value="starting_from">Starting From</option>
                    <option value="fixed">Fixed Price</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-1.5">
                    Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. $1,450 or 45,000 EGP"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                  />
                </div>
              </div>

              {/* Applications Multi-Select */}
              <div>
                <label className="block text-[#d4c59d] uppercase tracking-wider font-bold mb-2">
                  Suitable Project Applications:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_APPLICATION_OPTIONS.map((app) => {
                    const isSelected = applications.includes(app);
                    return (
                      <button
                        key={app}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setApplications(applications.filter((a) => a !== app));
                          } else {
                            setApplications([...applications, app]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#d4c59d] text-black ring-1 ring-[#e6d8b5]'
                            : 'bg-[#14141c] text-[#9e9174] border border-[#333] hover:border-[#d4c59d]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{app}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CATEGORY SPECIFIC FIELDS */}
          {activeTab === 'category' && (
            <div className="space-y-5">
              <div className="p-3 bg-[#14141c] rounded-lg border border-[#d4c59d]/30 text-xs text-[#b8b2a3]">
                Fields tailored specifically to <strong className="text-[#d4c59d]">{categoryId}</strong>. Only filled fields appear on the final detail page.
              </div>

              {/* MIRRORS */}
              {(categoryId === 'mirrors' || categoryId.includes('mirror')) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Mirror Type</label>
                    <input
                      type="text"
                      value={categoryFields.mirrorType || ''}
                      onChange={(e) => handleCategoryFieldChange('mirrorType', e.target.value)}
                      placeholder="e.g. Wall Mirror, Vanity, Floor Standing"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Mirror Shape</label>
                    <input
                      type="text"
                      value={categoryFields.mirrorShape || ''}
                      onChange={(e) => handleCategoryFieldChange('mirrorShape', e.target.value)}
                      placeholder="e.g. Circular, Sunburst, Arch, Octagonal"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Glass Type & Thickness</label>
                    <input
                      type="text"
                      value={categoryFields.glassType || ''}
                      onChange={(e) => handleCategoryFieldChange('glassType', e.target.value)}
                      placeholder="e.g. 6mm Beveled Crystal Silvered Glass"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Mounting Hardware</label>
                    <input
                      type="text"
                      value={categoryFields.mounting || ''}
                      onChange={(e) => handleCategoryFieldChange('mounting', e.target.value)}
                      placeholder="e.g. Heavy Duty Concealed French Cleat"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Orientation</label>
                    <input
                      type="text"
                      value={categoryFields.orientation || ''}
                      onChange={(e) => handleCategoryFieldChange('orientation', e.target.value)}
                      placeholder="e.g. Vertical, Horizontal or Multi-Directional"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                </div>
              )}

              {/* LIGHTING & CHANDELIERS */}
              {(categoryId === 'lighting' || categoryId.includes('chandelier') || categoryId.includes('lamp') || categoryId.includes('lantern')) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Number of Lights / Sockets</label>
                    <input
                      type="text"
                      value={categoryFields.numberOfLights || ''}
                      onChange={(e) => handleCategoryFieldChange('numberOfLights', e.target.value)}
                      placeholder="e.g. 12 or 24 Arms"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Bulb Type & Socket</label>
                    <input
                      type="text"
                      value={categoryFields.bulbType || ''}
                      onChange={(e) => handleCategoryFieldChange('bulbType', e.target.value)}
                      placeholder="e.g. E14 Candelabra LED / E27 Warm"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Voltage / Rating</label>
                    <input
                      type="text"
                      value={categoryFields.voltage || ''}
                      onChange={(e) => handleCategoryFieldChange('voltage', e.target.value)}
                      placeholder="e.g. 110V - 240V Universal"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Suspension / Mounting</label>
                    <input
                      type="text"
                      value={categoryFields.suspensionType || categoryFields.mounting || ''}
                      onChange={(e) => handleCategoryFieldChange('suspensionType', e.target.value)}
                      placeholder="e.g. Cast Brass Chain with Ceiling Canopy"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Suspension Length</label>
                    <input
                      type="text"
                      value={categoryFields.suspensionLength || ''}
                      onChange={(e) => handleCategoryFieldChange('suspensionLength', e.target.value)}
                      placeholder="e.g. 150 cm (Adjustable on site)"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                </div>
              )}

              {/* WALL LIGHTS */}
              {(categoryId.includes('wall') || categoryId.includes('applique')) && categoryId !== 'wall-art' && categoryId !== 'wall-cladding' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Light Type</label>
                    <input
                      type="text"
                      value={categoryFields.lightType || ''}
                      onChange={(e) => handleCategoryFieldChange('lightType', e.target.value)}
                      placeholder="e.g. Flush Sconce, Torch Applique"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Wall Projection</label>
                    <input
                      type="text"
                      value={categoryFields.projection || ''}
                      onChange={(e) => handleCategoryFieldChange('projection', e.target.value)}
                      placeholder="e.g. 18 cm from wall"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Lighting Effect</label>
                    <input
                      type="text"
                      value={categoryFields.lightingEffect || ''}
                      onChange={(e) => handleCategoryFieldChange('lightingEffect', e.target.value)}
                      placeholder="e.g. Pierced shadow-casting Arabesque patterns"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                </div>
              )}

              {/* TABLES & CONSOLES */}
              {(categoryId === 'tables' || categoryId === 'consoles' || categoryId.includes('table') || categoryId.includes('console')) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Table Type</label>
                    <input
                      type="text"
                      value={categoryFields.tableType || ''}
                      onChange={(e) => handleCategoryFieldChange('tableType', e.target.value)}
                      placeholder="e.g. Coffee Table, Dining Table, Console"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Top Material</label>
                    <input
                      type="text"
                      value={categoryFields.topMaterial || ''}
                      onChange={(e) => handleCategoryFieldChange('topMaterial', e.target.value)}
                      placeholder="e.g. Hand-Engraved Brass / Egyptian Alabaster / Marble"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Base & Leg Structure</label>
                    <input
                      type="text"
                      value={categoryFields.baseMaterial || ''}
                      onChange={(e) => handleCategoryFieldChange('baseMaterial', e.target.value)}
                      placeholder="e.g. Solid Cast Brass Fluted Pedestal"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                </div>
              )}

              {/* DOOR HANDLES */}
              {categoryId.includes('handle') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Handle Type</label>
                    <input
                      type="text"
                      value={categoryFields.handleType || ''}
                      onChange={(e) => handleCategoryFieldChange('handleType', e.target.value)}
                      placeholder="e.g. Main Entrance Pull Handle, Lever Pair"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Door Compatibility</label>
                    <input
                      type="text"
                      value={categoryFields.doorType || ''}
                      onChange={(e) => handleCategoryFieldChange('doorType', e.target.value)}
                      placeholder="e.g. Solid Wood, Glass Doors, Metal Gates"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Mounting Type</label>
                    <input
                      type="text"
                      value={categoryFields.mountingType || ''}
                      onChange={(e) => handleCategoryFieldChange('mountingType', e.target.value)}
                      placeholder="e.g. Through-Bolt or Back-to-Back Pairs"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                </div>
              )}

              {/* LANTERNS */}
              {categoryId.includes('lantern') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e9174] mb-1">Perforation Style</label>
                    <input
                      type="text"
                      value={categoryFields.perforationStyle || ''}
                      onChange={(e) => handleCategoryFieldChange('perforationStyle', e.target.value)}
                      placeholder="e.g. Khayamiya Geometric & Floral Piercing"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e9174] mb-1">Indoor / Outdoor Rating</label>
                    <input
                      type="text"
                      value={categoryFields.indoorOutdoor || ''}
                      onChange={(e) => handleCategoryFieldChange('indoorOutdoor', e.target.value)}
                      placeholder="e.g. Indoor or Weather-Sealed Covered Outdoor"
                      className="w-full px-3 py-2 rounded-lg bg-[#14141c] border border-[#333] text-[#f5ebd7]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SEO & WHATSAPP */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#d4c59d] uppercase tracking-wider block">
                    Product Page SEO & Friendly URL
                  </span>
                  <p className="text-[11px] text-[#9e9174]">
                    Used for dedicated product detail URLs (e.g. /products/{categoryId}/<strong>{seoSlug || 'slug'}</strong>)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="px-3 py-1.5 rounded bg-[#1c1c28] border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-black font-bold uppercase tracking-wider text-[11px]"
                >
                  Auto-Generate Slug
                </button>
              </div>

              <div>
                <label className="block text-[#9e9174] mb-1">SEO URL Slug *</label>
                <input
                  type="text"
                  value={seoSlug}
                  onChange={(e) => setSeoSlug(e.target.value)}
                  placeholder="e.g. gamaliya-sunburst-brass-mirror"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9e9174] mb-1">Meta Title Tag</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Gamaliya Sunburst Brass Mirror | TURATH Egypt"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                />
              </div>

              <div>
                <label className="block text-[#9e9174] mb-1">Meta Description (150-160 chars)</label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Handcrafted in Gamaliya, Cairo using solid Egyptian yellow brass..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                />
              </div>

              {/* WhatsApp Message Template */}
              <div className="pt-4 border-t border-[#d4c59d]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#d4c59d] uppercase tracking-wider block flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span>Product-Specific WhatsApp Inquiry Message</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateWhatsAppMessage}
                    className="px-2.5 py-1 rounded bg-[#1c1c28] border border-[#d4c59d]/40 text-[#d4c59d] text-[10px] font-bold uppercase"
                  >
                    Auto-Generate Message
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Pre-filled text when clients click 'Inquire on WhatsApp' on this piece..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 text-[#f5ebd7]"
                />
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-6 border-t border-[#d4c59d]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {selectedProductId !== 'new' && (
                <>
                  {confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-bold text-xs">Confirm delete?</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteProduct(selectedProductId);
                          setStatusMessage({ type: 'success', text: 'Piece deleted successfully.' });
                          setTimeout(() => onClose(), 800);
                        }}
                        className="px-3 py-1.5 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                      >
                        Yes, Delete Piece
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="px-2.5 py-1.5 rounded bg-[#222] text-[#ccc]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="px-3 py-2 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-800/40 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Piece</span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-[#b8b2a3] hover:text-[#f5ebd7] hover:bg-white/10 transition-colors uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gold-shimmer-hover px-6 py-2.5 rounded-lg bg-[#d4c59d] text-black font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Product</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
