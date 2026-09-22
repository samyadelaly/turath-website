import React, { useState, useEffect } from 'react';
import { getStoredLogo, DEFAULT_LOGO_URL } from './logoStorage';
import { Camera } from 'lucide-react';

interface TurathLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showText?: boolean;
  onOpenChangeLogo?: () => void;
  allowHoverChange?: boolean;
}

export const TurathLogo: React.FC<TurathLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  onOpenChangeLogo,
  allowHoverChange = false,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(getStoredLogo());

  // Listen for real-time logo updates across the app
  useEffect(() => {
    const handleUpdate = () => {
      setLogoSrc(getStoredLogo());
    };
    window.addEventListener('turath-logo-updated', handleUpdate);
    return () => window.removeEventListener('turath-logo-updated', handleUpdate);
  }, []);

  // Dimensions based on size - maintaining natural 1200:896 rectangular aspect ratio
  const dimensions = {
    sm: 'h-10 sm:h-11 aspect-[1200/896]',
    md: 'h-12 sm:h-14 aspect-[1200/896]',
    lg: 'h-16 sm:h-20 aspect-[1200/896]',
    hero: 'h-32 sm:h-40 md:h-48 aspect-[1200/896] max-w-full',
  };

  return (
    <div className={`relative inline-flex items-center gap-3 select-none group/logo ${className}`}>
      {/* Raster Logo Graphic - True rectangular proportions (1200x896) without frame or border */}
      <div className={`relative flex items-center justify-center transition-all duration-300 ${dimensions[size]}`}>
        <img
          src={logoSrc || DEFAULT_LOGO_URL}
          alt="TURATH - Handcrafted Egyptian Brass, Copper & Decorative Metals Official Logo"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-contain transition-transform duration-300 group-hover/logo:scale-[1.02] select-none"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            if (target.src !== DEFAULT_LOGO_URL) {
              target.src = DEFAULT_LOGO_URL;
            }
          }}
        />

        {/* Optional Quick Change Logo Overlay on Hover */}
        {allowHoverChange && onOpenChangeLogo && (
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onOpenChangeLogo();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                onOpenChangeLogo();
              }
            }}
            className="absolute inset-0 bg-[#000000]/80 opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] text-[#d4c59d] font-semibold cursor-pointer"
            title="Change and replace logo image"
          >
            <Camera className="w-4 h-4 text-[#d4c59d]" />
            <span>Replace Logo</span>
          </div>
        )}
      </div>

      {/* Brand title accompanying text when rendered inline */}
      {showText && size !== 'hero' && (
        <div className="flex flex-col text-left">
          <span className="font-serif-luxury text-lg md:text-xl font-bold tracking-[0.2em] text-[#d4c59d]">
            TURATH
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#d4c59d]/80 font-medium font-arabic">
            فخامة النحاس المصري • Gamaliya
          </span>
        </div>
      )}
    </div>
  );
};
