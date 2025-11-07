// Type definitions for Feature Showcase components
// Used across the application for type safety with Strapi data

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export type BadgePosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'center' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export type FeatureShowcaseLayout = 
  | 'grid-2' 
  | 'grid-3' 
  | 'grid-4' 
  | 'slider';

export interface FeatureCardStrapi {
  id: number;
  backgroundImage: StrapiMedia;
  iconImage?: StrapiMedia;
  iconEmoji?: string;
  badgeText: string;
  badgeColor?: string;
  badgePosition?: BadgePosition;
  overlayText?: string;
  overlayColor?: string;
  overlayIcon?: string;
}

export interface FeatureShowcaseStrapi {
  id: number;
  __component: 'sections.feature-showcase';
  title?: string;
  description?: string;
  featureCards: FeatureCardStrapi[];
  layout?: FeatureShowcaseLayout;
  backgroundColor?: string;
}

// Simplified props for React components (without full Strapi metadata)
export interface FeatureCardProps {
  backgroundImage: {
    url: string;
    alternativeText?: string;
  };
  iconImage?: {
    url: string;
    alternativeText?: string;
  };
  iconEmoji?: string;
  badgeText: string;
  badgeColor?: string;
  badgePosition?: BadgePosition;
  overlayText?: string;
  overlayColor?: string;
  overlayIcon?: string;
}

export interface FeatureShowcaseProps {
  title?: string;
  description?: string;
  featureCards: (FeatureCardProps & { id: number })[];
  layout?: FeatureShowcaseLayout;
  backgroundColor?: string;
}

// Helper function to transform Strapi data to component props
export function transformFeatureCardFromStrapi(
  strapiCard: FeatureCardStrapi
): FeatureCardProps & { id: number } {
  return {
    id: strapiCard.id,
    backgroundImage: {
      url: strapiCard.backgroundImage.url,
      alternativeText: strapiCard.backgroundImage.alternativeText,
    },
    iconImage: strapiCard.iconImage ? {
      url: strapiCard.iconImage.url,
      alternativeText: strapiCard.iconImage.alternativeText,
    } : undefined,
    iconEmoji: strapiCard.iconEmoji,
    badgeText: strapiCard.badgeText,
    badgeColor: strapiCard.badgeColor,
    badgePosition: strapiCard.badgePosition,
    overlayText: strapiCard.overlayText,
    overlayColor: strapiCard.overlayColor,
    overlayIcon: strapiCard.overlayIcon,
  };
}

export function transformFeatureShowcaseFromStrapi(
  strapiShowcase: FeatureShowcaseStrapi
): FeatureShowcaseProps {
  return {
    title: strapiShowcase.title,
    description: strapiShowcase.description,
    featureCards: strapiShowcase.featureCards.map(transformFeatureCardFromStrapi),
    layout: strapiShowcase.layout,
    backgroundColor: strapiShowcase.backgroundColor,
  };
}

// Default values
export const DEFAULT_BADGE_COLOR = '#e9d5ff';
export const DEFAULT_OVERLAY_COLOR = '#d1fae5';
export const DEFAULT_BACKGROUND_COLOR = '#ffffff';
export const DEFAULT_BADGE_POSITION: BadgePosition = 'top-left';
export const DEFAULT_LAYOUT: FeatureShowcaseLayout = 'grid-2';

// Color presets for easy reference
export const BADGE_COLOR_PRESETS = {
  purple: '#e9d5ff',
  blue: '#bfdbfe',
  green: '#d1fae5',
  pink: '#fbcfe8',
  yellow: '#fef3c7',
  orange: '#fed7aa',
  red: '#fecaca',
  gray: '#f3f4f6',
} as const;

export const OVERLAY_COLOR_PRESETS = {
  success: '#d1fae5',
  info: '#dbeafe',
  warning: '#fef3c7',
  error: '#fee2e2',
  neutral: '#f3f4f6',
} as const;



