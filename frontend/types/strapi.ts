// FAQ Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSection {
  id?: number;
  __component?: 'sections.faq-section';
  title: string;
  subtitle?: string;
  faqItems: FAQItem[];
}

// Strapi Response Types
export interface StrapiAttributes<T> {
  attributes: T;
  id: number;
}

export interface StrapiResponse<T> {
  data: StrapiAttributes<T> | StrapiAttributes<T>[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Page Types
export interface PageAttributes {
  siteId: string;
  slug: string;
  title: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  sections?: Array<FAQSection | any>;
  faqSection?: FAQSection;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Page {
  id: number;
  attributes: PageAttributes;
}



