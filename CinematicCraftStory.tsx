import React from 'react';
import { ProductItem, ProductCategoryInfo } from './types';
import { SiteContent } from './siteContentStorage';

interface CinematicCraftStoryProps {
  products: ProductItem[];
  categories: ProductCategoryInfo[];
  onSelectProduct: (product: ProductItem) => void;
  onSelectCategory: (categoryId: string) => void;
  onExploreAllProducts: () => void;
  onCustomFabrication?: () => void;
  content?: SiteContent;
}

/**
 * CinematicCraftStory: Removed per user request
 * - Born in Historic Cairo (Craft Story with video/photo)
 * - Yellow Brass & Red Copper (Material Story with photos)
 * - Editorial Showcase (Curated products with photos)
 */
export const CinematicCraftStory: React.FC<CinematicCraftStoryProps> = () => {
  return null;
};

export default CinematicCraftStory;
