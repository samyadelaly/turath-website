import React from 'react';
import { 
  MediaRatioSelectorControl, 
  MediaRatioSelectorControlProps 
} from './MediaRatioSelectorControl';
import { 
  ImageRatioPreset, 
  ImageObjectFit, 
  ImageObjectPosition 
} from "./imageRatioUtils";

export interface ImageRatioSelectorControlProps extends Partial<MediaRatioSelectorControlProps> {
  ratio?: ImageRatioPreset | string;
  onChangeRatio: (ratio: ImageRatioPreset) => void;
  customWidth?: number | string;
  onChangeCustomWidth?: (val: string) => void;
  customHeight?: number | string;
  onChangeCustomHeight?: (val: string) => void;
  fit?: ImageObjectFit | string;
  onChangeFit?: (fit: ImageObjectFit) => void;
  position?: ImageObjectPosition | string;
  onChangePosition?: (pos: ImageObjectPosition) => void;
  compact?: boolean;
  title?: string;
  titleAR?: string;
  description?: string;
}

/**
 * ImageRatioSelectorControl delegates to unified MediaRatioSelectorControl
 */
export const ImageRatioSelectorControl: React.FC<ImageRatioSelectorControlProps> = (props) => {
  return (
    <MediaRatioSelectorControl
      mediaType="image"
      showMediaTypeSelector={false}
      {...props}
    />
  );
};

export default ImageRatioSelectorControl;
