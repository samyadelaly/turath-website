import React from 'react';
import { TurathImage, TurathImageProps } from './TurathImage';
import { ComputedImageRatio, ImageRatioConfig } from "./imageRatioUtils";

export interface UnifiedResponsiveImageProps extends TurathImageProps {
  ratioConfig?: ImageRatioConfig;
  computedRatio?: ComputedImageRatio;
}

/**
 * UnifiedResponsiveImage - Global image wrapper delegating to TurathImage
 */
export const UnifiedResponsiveImage: React.FC<UnifiedResponsiveImageProps> = (props) => {
  return <TurathImage {...props} />;
};

export default UnifiedResponsiveImage;
