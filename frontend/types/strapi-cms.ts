/**
 * Strapi CMS Type Definitions
 * Auto-generated types for all Strapi components and sections
 * 
 * @see /cms/STRAPI_CMS_GUIDE.md for complete documentation
 */

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

export interface StrapiButton {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
}

export interface StrapiImage {
  url: string;
  alternativeText: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface StrapiServiceItem {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

export interface StrapiTrustBadge {
  icon: string;
  text: string;
  description?: string;
  color?: string;
  textColor?: string;
}

export interface StrapiBenefitItem {
  iconPath: string;
  title: string;
  description: string;
  color?: string;
  textColor?: string;
}

export interface StrapiTestimonialItem {
  name: string;
  role: string;
  text: string;
  image: string;
}

export interface StrapiProcessStep {
  number: string;
  title: string;
  description: string;
  details?: string[];
  imagePath?: string;
}

export interface StrapiBentoItem {
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  iconPath: string;
  gridArea: string;
}

export interface StrapiFaqItem {
  question: string;
  answer: string;
}

export interface StrapiFeatureCard {
  icon?: string;
  title: string;
  description?: string;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

export interface StrapiHeroSection {
  __component: 'sections.hero-section';
  badge?: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  variant?: 'default' | 'gradient' | 'image';
  iconPath?: string;
  icons?: string[];
  primaryCta?: StrapiButton;
  secondaryCta?: StrapiButton;
}

export interface StrapiBenefitsCarousel {
  __component: 'sections.benefits-carousel';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  benefits: StrapiBenefitItem[];
}

export interface StrapiFeatureSection {
  __component: 'sections.feature-section';
  title: string;
  description: string;
  buttonText?: string;
  imagePath: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
}

export interface StrapiTestimonialsCarousel {
  __component: 'sections.testimonials-carousel';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  testimonials: StrapiTestimonialItem[];
}

export interface StrapiHowItWorksBento {
  __component: 'sections.how-it-works-bento';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  bentoItems: StrapiBentoItem[];
}

export interface StrapiProcessSteps {
  __component: 'sections.process-steps';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  steps: StrapiProcessStep[];
}

export interface StrapiWhyChooseSection {
  __component: 'sections.why-choose-section';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  benefits: StrapiBenefitItem[];
}

export interface StrapiContentSection {
  __component: 'sections.content-section';
  title: string;
  content: string;
  layout?: 'image-left' | 'image-right';
  variant?: 'default' | 'bordered' | 'shadow';
  background?: 'white' | 'gray' | 'blue' | 'dark';
  ctaLabel?: string;
  ctaHref?: string;
}

export interface StrapiServicesSection {
  __component: 'sections.services-section';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  services: StrapiServiceItem[];
}

export interface StrapiTrustSection {
  __component: 'sections.trust-section';
  title?: string;
  variant?: 'default' | 'centered' | 'compact';
  backgroundColor?: string;
  badges: StrapiTrustBadge[];
}

export interface StrapiCtaSection {
  __component: 'sections.cta-section';
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  background?: 'white' | 'gray' | 'blue' | 'dark';
}

export interface StrapiFaqSection {
  __component: 'sections.faq-section';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  faqItems: StrapiFaqItem[];
}

export interface StrapiFeatureShowcase {
  __component: 'sections.feature-showcase';
  title?: string;
  subtitle?: string;
  features: StrapiFeatureCard[];
}

export interface StrapiTwoColumnSupport {
  __component: 'sections.two-column-support';
  title: string;
  content: string;
}

export interface StrapiAnimatedStats {
  __component: 'sections.animated-stats';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  stats: Array<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
  }>;
}

// ============================================================================
// SECTION UNION TYPE
// ============================================================================

export type StrapiSection =
  | StrapiHeroSection
  | StrapiBenefitsCarousel
  | StrapiFeatureSection
  | StrapiTestimonialsCarousel
  | StrapiHowItWorksBento
  | StrapiProcessSteps
  | StrapiWhyChooseSection
  | StrapiContentSection
  | StrapiServicesSection
  | StrapiTrustSection
  | StrapiCtaSection
  | StrapiFaqSection
  | StrapiFeatureShowcase
  | StrapiTwoColumnSupport
  | StrapiAnimatedStats;

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface StrapiPage {
  id: number;
  attributes: {
    siteId: string;
    slug: string;
    title: string;
    metaDescription?: string;
    metaKeywords?: string;
    sections?: StrapiSection[];
    body?: string; // Legacy field
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export interface StrapiSite {
  id: number;
  attributes: {
    siteId: string;
    name: string;
    domain: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiNavigationItem {
  id: number;
  attributes: {
    siteId: string;
    label: string;
    href: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiTestimonial {
  id: number;
  attributes: {
    siteId: string;
    name: string;
    role: string;
    text: string;
    image: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export interface StrapiTokenSet {
  id: number;
  attributes: {
    siteId: string;
    colors: Record<string, string>;
    typography: Record<string, any>;
    components: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiLead {
  id: number;
  attributes: {
    // Add lead fields based on your schema
    [key: string]: any;
    createdAt: string;
    updatedAt: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type StrapiComponentType = StrapiSection['__component'];

/**
 * Type guard to check section component type
 */
export function isSectionType<T extends StrapiSection>(
  section: StrapiSection,
  componentType: T['__component']
): section is T {
  return section.__component === componentType;
}

/**
 * Extract section by component type
 */
export function getSectionByType<T extends StrapiSection>(
  sections: StrapiSection[],
  componentType: T['__component']
): T | undefined {
  return sections.find((s) => s.__component === componentType) as T | undefined;
}

/**
 * Get all sections of a specific type
 */
export function getAllSectionsByType<T extends StrapiSection>(
  sections: StrapiSection[],
  componentType: T['__component']
): T[] {
  return sections.filter((s) => s.__component === componentType) as T[];
}

