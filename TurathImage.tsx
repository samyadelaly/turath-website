import React from 'react';
import { 
  TurathMedia,
  TurathMediaProps 
} from './TurathMedia';
import { 
  ComputedImageRatio, 
  ImageRatioConfig,
  ImageRatioPreset,
  ImageObjectFit,
  ImageObjectPosition
} from "./imageRatioUtils";

export interface TurathImageProps {
  src?: string | null;
  alt: string;
  ratio?: ImageRatioPreset | string;
  customWidth?: number | string;
  customHeight?: number | string;
  fit?: ImageObjectFit | string;
  position?: ImageObjectPosition | string;
  ratioConfig?: ImageRatioConfig;
  computedRatio?: ComputedImageRatio;
  defaultType?: 'product' | 'product_main' | 'category' | 'hero' | 'gallery' | 'general';
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  decoding?: 'async' | 'auto' | 'sync';
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
}

/**
 * TURATH Global Image Component (<TurathImage />)
 * Delegates to centralized <TurathMedia type="image" />
 */
export const TurathImage: React.FC<TurathImageProps> = ({
  imageClassName,
  imageStyle,
  ...props
}) => {
  return (
    <TurathMedia
      type="image"
      mediaClassName={imageClassName}
      mediaStyle={imageStyle}
      {...(props as TurathMediaProps)}
    />
  );
};

export default TurathImage;
