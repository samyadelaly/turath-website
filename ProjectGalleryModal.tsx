import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Download } from 'lucide-react';

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  projectTitle?: string;
}

export const ProjectGalleryModal: React.FC<ProjectGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  projectTitle = 'TURATH Project Gallery',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentImage = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#d4c59d]/20 text-[#f5f0e6]">
        <div>
          <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#d4c59d]">
            {projectTitle}
          </h4>
          <p className="text-xs text-[#9e9174] font-mono mt-0.5">
            Image {currentIndex + 1} of {images.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentImage && (
            <a
              href={currentImage}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#141414] hover:bg-[#d4c59d] hover:text-black text-[#d4c59d] transition-colors border border-[#d4c59d]/30"
              title="Open full resolution in new tab"
            >
              <Maximize2 className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#141414] hover:bg-red-950/80 text-[#f5f0e6] hover:text-red-400 transition-colors border border-[#d4c59d]/30 cursor-pointer"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-grow flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/70 hover:bg-[#d4c59d] hover:text-black text-[#d4c59d] border border-[#d4c59d]/40 transition-all cursor-pointer backdrop-blur-md shadow-xl"
            title="Previous (Left arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Current Image */}
        <div className="max-w-5xl max-h-[75vh] flex items-center justify-center">
          <img
            src={currentImage}
            alt={`${projectTitle} - view ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-[#d4c59d]/20 transition-all duration-300"
          />
        </div>

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/70 hover:bg-[#d4c59d] hover:text-black text-[#d4c59d] border border-[#d4c59d]/40 transition-all cursor-pointer backdrop-blur-md shadow-xl"
            title="Next (Right arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-3 bg-[#0a0a0a] border-t border-[#d4c59d]/20 overflow-x-auto flex items-center justify-center gap-2 custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'border-[#d4c59d] scale-105 shadow-md shadow-[#d4c59d]/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
