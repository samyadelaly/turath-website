import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Layers, 
  QrCode, 
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Compass,
  Sliders,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { ProductItem, ProductCategoryInfo } from './types';

export interface ProductSocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductItem | null;
  category?: ProductCategoryInfo | null;
  isCatalogue?: boolean;
  activeImage?: string;
}

type CardRatio = '1:1' | '9:16' | '1.91:1';
type CardTheme = 'obsidian-gold' | 'antique-brass' | 'atelier-dark';

export const ProductSocialCardModal: React.FC<ProductSocialCardModalProps> = ({
  isOpen,
  onClose,
  product,
  category,
  isCatalogue = false,
  activeImage,
}) => {
  const [ratio, setRatio] = useState<CardRatio>('1:1');
  const [theme, setTheme] = useState<CardTheme>('obsidian-gold');
  const [includeArabic, setIncludeArabic] = useState<boolean>(true);
  const [includeSpecs, setIncludeSpecs] = useState<boolean>(true);
  const [includeHeritageBadge, setIncludeHeritageBadge] = useState<boolean>(true);
  const [includeQrCode, setIncludeQrCode] = useState<boolean>(true);

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copyImageSuccess, setCopyImageSuccess] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string>('');

  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;
  if (!product && !category && !isCatalogue) return null;

  const isCatMode = Boolean(isCatalogue || (!product && category));
  const rawImage = (activeImage && activeImage.trim()) || (product
    ? ((product.images && product.images.find(img => typeof img === 'string' && img.trim().length > 0)) || product.mainImage || '')
    : (category?.coverImage || '/turath_craftsmanship_relief.jpg'));
  const cleanImage = rawImage.trim() || 'https://turath-egypt.vercel.app/turath_logo.jpg';
  const siteUrl = 'https://turath-egypt.vercel.app';
  const categorySlug = product?.categoryId || (category ? category.id : 'products');
  const productSlug = product ? (product.seoSlug || product.id) : '';
  const directProductUrl = product 
    ? `${siteUrl}/products/${categorySlug}/${productSlug}`
    : category
      ? `${siteUrl}/products/${category.id}`
      : `${siteUrl}/products`;
  const shareCardUrl = product ? `${siteUrl}/share/${productSlug}` : directProductUrl;

  const displayNameEN = product
    ? (product.nameEN || product.name || 'TURATH Handcrafted Brass')
    : category
      ? `${category.name} Collection`
      : 'Handcrafted Egyptian Brass Catalogue';
  const displayNameAR = product
    ? (product.nameAR || product.name || 'تحفة نحاسية يدوية')
    : category
      ? `مجموعة ${category.nameArabic || category.name}`
      : 'كتالوج المشغولات والتحف النحاسية المصرية';
  const displaySku = product
    ? (product.sku || product.id || 'TR-EGY')
    : category
      ? `COLLECTION • ${category.id.toUpperCase()}`
      : 'CATALOGUE 2026';
  const categoryName = product
    ? (category?.name || product.categoryId || 'Luxury Brass Collection')
    : category
      ? category.name
      : 'ARCHITECTURAL MASTERWORKS';

  // Handle URL Copy
  const handleCopyLink = () => {
    const urlToCopy = shareCardUrl || directProductUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Render and export High-Res Canvas
  const renderCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let width = 1080;
    let height = 1080;
    if (ratio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (ratio === '1.91:1') {
      width = 1200;
      height = 630;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (theme === 'obsidian-gold') {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.8);
      grad.addColorStop(0, '#141416');
      grad.addColorStop(1, '#050505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'antique-brass') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1c170f');
      grad.addColorStop(0.5, '#0a0907');
      grad.addColorStop(1, '#18140d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#0a0a0d';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Elegant Border & Gold Corners
    ctx.strokeStyle = '#d4c59d';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = 'rgba(212, 197, 157, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, width - 92, height - 92);

    // Corner decorative diamond marks
    const drawDiamond = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.fillStyle = '#d4c59d';
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    drawDiamond(36, 36, 10);
    drawDiamond(width - 36, 36, 10);
    drawDiamond(36, height - 36, 10);
    drawDiamond(width - 36, height - 36, 10);

    // 3. Header Branding: TURATH Egypt
    ctx.fillStyle = '#d4c59d';
    ctx.font = 'bold 34px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('TURATH EGYPT', width / 2, 100);

    ctx.fillStyle = '#9e9174';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isCatMode ? 'OFFICIAL ARCHITECTURAL CATALOGUE • CAIRO' : 'HISTORIC CAIRO HANDCRAFTED BRASS & COPPER', width / 2, 128);

    // Load Product Image
    try {
      const img = new Image();
      if (cleanImage.startsWith('http://') || cleanImage.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if cors fails
        img.src = cleanImage;
      });

      if (img.complete && img.naturalWidth > 0) {
        // Draw photo area based on aspect ratio
        let photoX = 80;
        let photoY = 160;
        let photoW = width - 160;
        let photoH = ratio === '9:16' ? 1000 : ratio === '1.91:1' ? 320 : 540;

        // Photo container background & border
        ctx.fillStyle = '#000000';
        ctx.fillRect(photoX, photoY, photoW, photoH);

        // Aspect fit / cover
        const hRatio = photoW / img.width;
        const vRatio = photoH / img.height;
        const coverRatio = Math.max(hRatio, vRatio);
        const centerShiftX = (photoW - img.width * coverRatio) / 2;
        const centerShiftY = (photoH - img.height * coverRatio) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoW, photoH);
        ctx.clip();
        try {
          ctx.drawImage(img, 0, 0, img.width, img.height, photoX + centerShiftX, photoY + centerShiftY, img.width * coverRatio, img.height * coverRatio);
        } catch (drawErr) {
          console.warn('Canvas draw image warning:', drawErr);
        }
        ctx.restore();

        ctx.strokeStyle = '#d4c59d';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, photoY, photoW, photoH);
      }
    } catch (e) {
      console.warn('Canvas image render notice:', e);
    }

    // 4. Product Details Text
    const contentYStart = ratio === '9:16' ? 1220 : ratio === '1.91:1' ? 510 : 750;

    // Category / Collection Tag
    ctx.fillStyle = '#d4c59d';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(categoryName.toUpperCase(), width / 2, contentYStart);

    // Product Title English
    ctx.fillStyle = '#f5f0e6';
    ctx.font = 'bold 42px "Cinzel", Georgia, serif';
    ctx.fillText(displayNameEN, width / 2, contentYStart + 50);

    // Product Title Arabic
    let nextOffset = contentYStart + 105;
    if (includeArabic && displayNameAR) {
      ctx.fillStyle = '#e6d8b5';
      ctx.font = 'bold 32px "Amiri", "Noto Naskh Arabic", serif';
      ctx.fillText(displayNameAR, width / 2, nextOffset);
      nextOffset += 55;
    }

    // Product SKU / Model Code
    ctx.fillStyle = '#d4c59d';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText(isCatMode ? displaySku : `PRODUCT ID: ${displaySku}`, width / 2, nextOffset);
    nextOffset += 45;

    // Specs Line (Dimensions & Finish or Catalogue Overview)
    if (includeSpecs) {
      ctx.fillStyle = '#9e9174';
      ctx.font = '18px "Plus Jakarta Sans", sans-serif';
      if (product && product.dimensions) {
        const finishText = product.finishOptions && product.finishOptions[0] ? ` • Finish: ${product.finishOptions[0]}` : '';
        ctx.fillText(`Dimensions: ${product.dimensions}${finishText}`, width / 2, nextOffset);
        nextOffset += 45;
      } else {
        const infoText = category?.description || 'Authentic Solid Egyptian Yellow Brass & Red Copper Masterworks';
        const displayInfo = infoText.length > 65 ? infoText.substring(0, 62) + '...' : infoText;
        ctx.fillText(displayInfo, width / 2, nextOffset);
        nextOffset += 45;
      }
    }

    // Heritage Guarantee Badge
    if (includeHeritageBadge) {
      ctx.fillStyle = '#d4c59d';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('★ 100% SOLID BRASS & COPPER • HAND-ENGRAVED IN HISTORIC CAIRO, EGYPT ★', width / 2, height - 90);
    }

    // Footer Website & WhatsApp
    ctx.fillStyle = '#7a705b';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Official Catalog: turath-egypt.vercel.app  •  WhatsApp: +20 101 677 1010', width / 2, height - 60);

    return canvas;
  };

  // Download Image Action
  const handleDownloadCard = async () => {
    try {
      setIsDownloading(true);
      setShareError('');
      const canvas = await renderCanvas();
      if (!canvas) throw new Error('Could not generate card canvas');

      const dataUrl = canvas.toDataURL('image/png', 0.95);
      const link = document.createElement('a');
      link.download = `TURATH_${displaySku}_social_card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Download error:', err);
      setShareError('Failed to generate high-resolution image file.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy Image to Clipboard Action
  const handleCopyCardImage = async () => {
    try {
      setShareError('');
      const canvas = await renderCanvas();
      if (!canvas) throw new Error('Could not generate card canvas');

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Canvas blob conversion failed');
        try {
          if (navigator.clipboard && (window as any).ClipboardItem) {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': blob })
            ]);
            setCopyImageSuccess(true);
            setTimeout(() => setCopyImageSuccess(false), 2500);
          } else {
            handleCopyLink();
          }
        } catch {
          handleCopyLink();
        }
      }, 'image/png');
    } catch (err) {
      handleCopyLink();
    }
  };

  // Web Share API Action (Mobile/Tablet Native Share Sheet)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const canvas = await renderCanvas();
        if (canvas) {
          canvas.toBlob(async (blob) => {
            if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'turath-product.png', { type: 'image/png' })] })) {
              const file = new File([blob], `TURATH-${displaySku}.png`, { type: 'image/png' });
              await navigator.share({
                title: `${displayNameEN} | TURATH Egypt`,
                text: `${displayNameEN} (${displayNameAR}) - Handcrafted in Historic Cairo, Egypt.\nProduct ID: ${displaySku}`,
                url: shareCardUrl || directProductUrl,
                files: [file]
              });
              return;
            }
            // Fallback text share
            await navigator.share({
              title: `${displayNameEN} | TURATH Egypt`,
              text: `${displayNameEN} - Handcrafted Egyptian Brass`,
              url: shareCardUrl || directProductUrl,
            });
          });
        }
      } catch (e) {
        // User cancelled or share dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#08080a] border-2 border-[#d4c59d] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#0d0d12] border-b border-[#d4c59d]/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#d4c59d]/15 border border-[#d4c59d] flex items-center justify-center text-[#d4c59d]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#f5f0e6] flex items-center gap-2">
                  <span>{isCatMode ? 'Social Media Catalogue Card' : 'Social Media Product Card'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#d4c59d]/20 text-[#d4c59d] font-sans font-semibold">
                    {isCatMode ? 'بطاقة الكتالوج' : 'بطاقة مشاركة'}
                  </span>
                </h3>
                <p className="text-xs text-[#9e9174]">
                  {isCatMode ? 'Generate and share a luxury branded card for the Turath catalogue and collections' : 'Generate and share a luxury branded card for Instagram, Facebook, WhatsApp, or Twitter'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#16161a] border border-[#d4c59d]/30 text-[#9e9174] hover:text-[#d4c59d] hover:border-[#d4c59d] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
            {/* Left Preview Column */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#000000] p-4 sm:p-6 rounded-xl border border-[#d4c59d]/20">
              {/* The Live Visual Card */}
              <div 
                ref={cardPreviewRef}
                className={`relative w-full max-w-[420px] transition-all duration-300 rounded-xl overflow-hidden border-2 border-[#d4c59d] p-5 shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between ${
                  theme === 'obsidian-gold' 
                    ? 'bg-gradient-to-b from-[#141416] via-[#08080a] to-[#040405]' 
                    : theme === 'antique-brass'
                    ? 'bg-gradient-to-br from-[#1c170f] via-[#0d0c09] to-[#14110b]'
                    : 'bg-[#0d0d12]'
                } ${
                  ratio === '1:1' ? 'aspect-square' : ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-[1.91/1]'
                }`}
              >
                {/* Subtle Inner Filigree Border */}
                <div className="absolute inset-1.5 border border-[#d4c59d]/30 rounded-lg pointer-events-none" />

                {/* Corner Diamonds */}
                <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 bg-[#d4c59d] rotate-45 pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#d4c59d] rotate-45 pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 bg-[#d4c59d] rotate-45 pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 bg-[#d4c59d] rotate-45 pointer-events-none" />

                {/* Header Branding */}
                <div className="text-center z-10 space-y-0.5">
                  <div className="font-serif-luxury text-xs sm:text-sm font-bold tracking-[0.25em] text-[#d4c59d] uppercase">
                    TURATH EGYPT
                  </div>
                  <div className="text-[9px] text-[#9e9174] uppercase tracking-wider font-semibold">
                    Historic Cairo Handcrafted Metals
                  </div>
                </div>

                {/* Product Image Window */}
                <div className="relative my-2 w-full flex-1 rounded-lg overflow-hidden border border-[#d4c59d]/50 bg-black flex items-center justify-center min-h-[140px]">
                  <img
                    src={cleanImage}
                    alt={displayNameEN}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-[#d4c59d]/40 text-[#d4c59d] text-[9px] font-mono font-bold">
                    {displaySku}
                  </div>
                </div>

                {/* Card Content & Typography */}
                <div className="text-center z-10 space-y-1">
                  <div className="text-[10px] text-[#d4c59d] font-bold uppercase tracking-wider">
                    {categoryName}
                  </div>
                  <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#f5f0e6] line-clamp-1">
                    {displayNameEN}
                  </h4>

                  {includeArabic && (
                    <div className="font-arabic text-xs sm:text-sm font-bold text-[#e6d8b5]">
                      {displayNameAR}
                    </div>
                  )}

                  {includeSpecs && (
                    <div className="text-[10px] text-[#9e9174] font-medium">
                      {product?.dimensions 
                        ? `Dimensions: ${product.dimensions}`
                        : category?.description 
                          ? (category.description.length > 55 ? category.description.substring(0, 52) + '...' : category.description)
                          : 'Solid Egyptian Brass & Copper Masterworks'}
                    </div>
                  )}

                  {includeHeritageBadge && (
                    <div className="pt-1 text-[9px] text-[#d4c59d] font-bold tracking-wider uppercase border-t border-[#d4c59d]/20">
                      ★ Hand-Engraved in Historic Cairo, Egypt ★
                    </div>
                  )}

                  <div className="text-[8px] text-[#7a705b] pt-0.5">
                    turath-egypt.vercel.app • +20 101 677 1010
                  </div>
                </div>
              </div>

              {/* Ratio Preview Hint */}
              <div className="mt-3 text-[11px] text-[#9e9174] flex items-center gap-2">
                <span>Active Aspect Ratio:</span>
                <strong className="text-[#d4c59d]">
                  {ratio === '1:1' ? '1:1 Square (Instagram / Feed)' : ratio === '9:16' ? '9:16 Story (Stories / Status)' : '1.91:1 Landscape (Twitter / Link)'}
                </strong>
              </div>
            </div>

            {/* Right Controls & Actions Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              {/* Format / Ratio Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Card Aspect Ratio / حجم البطاقة</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRatio('1:1')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      ratio === '1:1'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d]'
                        : 'bg-[#111014] text-[#d4c59d] border-[#d4c59d]/30 hover:border-[#d4c59d]'
                    }`}
                  >
                    <span>1:1 Square</span>
                    <span className="text-[10px] opacity-75 font-normal">Instagram Feed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRatio('9:16')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      ratio === '9:16'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d]'
                        : 'bg-[#111014] text-[#d4c59d] border-[#d4c59d]/30 hover:border-[#d4c59d]'
                    }`}
                  >
                    <span>9:16 Story</span>
                    <span className="text-[10px] opacity-75 font-normal">Stories / Reels</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRatio('1.91:1')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      ratio === '1.91:1'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d]'
                        : 'bg-[#111014] text-[#d4c59d] border-[#d4c59d]/30 hover:border-[#d4c59d]'
                    }`}
                  >
                    <span>1.91:1 Card</span>
                    <span className="text-[10px] opacity-75 font-normal">X / OpenGraph</span>
                  </button>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Card Aesthetic / ستايل البطاقة</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('obsidian-gold')}
                    className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      theme === 'obsidian-gold'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d]'
                        : 'bg-[#111014] text-[#d4c59d] border-[#d4c59d]/30 hover:border-[#d4c59d]'
                    }`}
                  >
                    Royal Obsidian
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('antique-brass')}
                    className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      theme === 'antique-brass'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d]'
                        : 'bg-[#111014] text-[#d4c59d] border-[#d4c59d]/30 hover:border-[#d4c59d]'
                    }`}
                  >
                    Antique Brass
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('atelier-dark')}
                    className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      theme === 'atelier-dark'
                        ? 'bg-[#d4c59d] text-black border-[#d4c59d]'
                        : 'bg-[#111014] text-[#d4c59d] border-[#d4c59d]/30 hover:border-[#d4c59d]'
                    }`}
                  >
                    Atelier Minimal
                  </button>
                </div>
              </div>

              {/* Content Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#d4c59d]/20 text-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                  Details Included / محتويات البطاقة
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-[#121216] rounded-lg border border-[#d4c59d]/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeArabic}
                      onChange={(e) => setIncludeArabic(e.target.checked)}
                      className="accent-[#d4c59d]"
                    />
                    <span className="text-[#f5f0e6] text-[11px]">الاسم بالعربية</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[#121216] rounded-lg border border-[#d4c59d]/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSpecs}
                      onChange={(e) => setIncludeSpecs(e.target.checked)}
                      className="accent-[#d4c59d]"
                    />
                    <span className="text-[#f5f0e6] text-[11px]">الأبعاد والمواصفات</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[#121216] rounded-lg border border-[#d4c59d]/20 cursor-pointer col-span-2">
                    <input
                      type="checkbox"
                      checked={includeHeritageBadge}
                      onChange={(e) => setIncludeHeritageBadge(e.target.checked)}
                      className="accent-[#d4c59d]"
                    />
                    <span className="text-[#f5f0e6] text-[11px]">شعار النحاس المصري التراثي (Historic Cairo Badge)</span>
                  </label>
                </div>
              </div>

              {/* Primary Actions: Download & Copy Image */}
              <div className="space-y-2.5 pt-2 border-t border-[#d4c59d]/20">
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 rounded-xl bg-[#d4c59d] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6d8b5] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>{isDownloading ? 'Generating High-Res Image...' : 'Download Card Image (تحميل صورة البطاقة)'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCardImage}
                    className="py-2.5 px-3 rounded-lg bg-[#16161c] border border-[#d4c59d]/40 text-[#f5f0e6] hover:bg-[#d4c59d] hover:text-black transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copyImageSuccess ? <Check className="w-4 h-4 text-[#d4c59d]" /> : <Copy className="w-4 h-4 text-[#d4c59d]" />}
                    <span>{copyImageSuccess ? 'Card Copied!' : 'Copy Card Image'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="py-2.5 px-3 rounded-lg bg-[#16161c] border border-[#d4c59d]/40 text-[#f5f0e6] hover:bg-[#d4c59d] hover:text-black transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#d4c59d]" />
                    <span>Native Share (مشاركة)</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Social Media Channels */}
              <div className="space-y-2 pt-2 border-t border-[#d4c59d]/20">
                <span className="text-[11px] font-bold text-[#d4c59d] uppercase tracking-wider block">
                  Quick Share to Social Platforms:
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${displayNameEN} | TURATH Handcrafted Egyptian Brass\n${isCatMode ? displaySku : `Product ID: ${displaySku}`}\n\n${shareCardUrl || directProductUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 rounded-lg bg-[#121216] border border-[#d4c59d]/30 text-[#f5f0e6] hover:bg-[#d4c59d] hover:text-black transition-all text-[11px] font-semibold flex flex-col items-center justify-center gap-1"
                    title="Share to WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-[#d4c59d]" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareCardUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 rounded-lg bg-[#121216] border border-[#d4c59d]/30 text-[#f5f0e6] hover:bg-[#d4c59d] hover:text-black transition-all text-[11px] font-semibold flex flex-col items-center justify-center gap-1"
                    title="Share to Facebook"
                  >
                    <Facebook className="w-4 h-4 text-[#d4c59d]" />
                    <span>Facebook</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${displayNameEN} — Handcrafted Egyptian Brass by TURATH Egypt\n${isCatMode ? displaySku : `Product ID: ${displaySku}`}`)}&url=${encodeURIComponent(shareCardUrl)}&hashtags=TurathEgypt,EgyptianBrass,Handcrafted`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 rounded-lg bg-[#121216] border border-[#d4c59d]/30 text-[#f5f0e6] hover:bg-[#d4c59d] hover:text-black transition-all text-[11px] font-semibold flex flex-col items-center justify-center gap-1"
                    title="Share to X / Twitter"
                  >
                    <Twitter className="w-4 h-4 text-[#d4c59d]" />
                    <span>X / Twitter</span>
                  </a>

                  {/* Copy Direct Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2 px-1 rounded-lg bg-[#121216] border border-[#d4c59d]/30 text-[#f5f0e6] hover:bg-[#d4c59d] hover:text-black transition-all text-[11px] font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer"
                    title="Copy direct share link"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-[#d4c59d]" /> : <Copy className="w-4 h-4 text-[#d4c59d]" />}
                    <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
