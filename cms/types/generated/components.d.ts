import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAnimatedStats extends Struct.ComponentSchema {
  collectionName: 'components_sections_animated_stats';
  info: {
    description: 'Animated statistics cards';
    displayName: 'Animated Stats';
    icon: 'chart';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'white'>;
    stats: Schema.Attribute.JSON;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsBenefitsCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_benefits_carousels';
  info: {
    description: 'Horizontal scrolling carousel with benefit cards';
    displayName: 'Benefits Carousel';
    icon: 'star';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'var(--color-bg)'>;
    benefits: Schema.Attribute.Component<'shared.benefit-item', true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Eenvoudig online aanvragen. Geen opstartkosten. Boetevrij aflossen.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Zakelijke lening zonder gedoe'>;
  };
}

export interface SectionsContentSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_content_sections';
  info: {
    description: 'Image and text block with optional CTA';
    displayName: 'Content Section';
    icon: 'file';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['white', 'gray', 'blue', 'dark']
    > &
      Schema.Attribute.DefaultTo<'gray'>;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<['image-left', 'image-right']> &
      Schema.Attribute.DefaultTo<'image-right'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['default', 'bordered', 'shadow']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SectionsCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_sections';
  info: {
    description: 'Call-to-action section with title, subtitle and button';
    displayName: 'CTA Section';
    icon: 'cursor';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['white', 'gray', 'blue', 'dark']
    > &
      Schema.Attribute.DefaultTo<'dark'>;
    ctaHref: Schema.Attribute.String & Schema.Attribute.Required;
    ctaLabel: Schema.Attribute.String & Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_section';
  info: {
    description: 'A FAQ section with accordion items';
    displayName: 'FAQ Section';
  };
  attributes: {
    faqItems: Schema.Attribute.Component<'shared.faq-item', true> &
      Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Vind antwoorden op de meest gestelde vragen'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Veelgestelde vragen'>;
  };
}

export interface SectionsFeatureSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_sections';
  info: {
    description: 'Two-column section with image and content';
    displayName: 'Feature Section';
    icon: 'grid';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'white'>;
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    imagePath: Schema.Attribute.String & Schema.Attribute.Required;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeatureShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_showcase';
  info: {
    description: 'A section displaying feature cards with images and overlays';
    displayName: 'Feature Showcase';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#ffffff'>;
    description: Schema.Attribute.Text;
    featureCards: Schema.Attribute.Component<'shared.feature-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    layout: Schema.Attribute.Enumeration<
      ['grid-2', 'grid-3', 'grid-4', 'slider']
    > &
      Schema.Attribute.DefaultTo<'grid-2'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_sections';
  info: {
    description: 'Full-screen hero section with title, subtitle and CTAs';
    displayName: 'Hero Section';
    icon: 'landscape';
  };
  attributes: {
    backgroundImage: Schema.Attribute.String;
    badge: Schema.Attribute.String;
    iconPath: Schema.Attribute.String;
    icons: Schema.Attribute.JSON;
    primaryCta: Schema.Attribute.Component<'shared.button', false>;
    secondaryCta: Schema.Attribute.Component<'shared.button', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['default', 'gradient', 'image']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SectionsHowItWorksBento extends Struct.ComponentSchema {
  collectionName: 'components_sections_how_it_works_bentos';
  info: {
    description: 'Bento grid layout for process steps';
    displayName: 'How It Works Bento';
    icon: 'apps';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'var(--color-bg)'>;
    bentoItems: Schema.Attribute.Component<'shared.bento-item', true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'In 4 eenvoudige stappen naar uw zakelijke financiering'>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Zo werkt het'>;
  };
}

export interface SectionsProcessSteps extends Struct.ComponentSchema {
  collectionName: 'components_sections_process_steps';
  info: {
    description: 'Stacking cards showing process steps';
    displayName: 'Process Steps';
    icon: 'layer';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'var(--color-bg)'>;
    steps: Schema.Attribute.Component<'shared.process-step', true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Simpel, transparant en snel'>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Het proces'>;
  };
}

export interface SectionsServicesSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_services_sections';
  info: {
    description: 'Grid of service cards with icons';
    displayName: 'Services Section';
    icon: 'briefcase';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'white'>;
    services: Schema.Attribute.Component<'shared.service-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTeamMembersSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_members_sections';
  info: {
    description: 'Display team member profiles in a grid layout';
    displayName: 'Team Members Section';
    icon: 'users';
  };
  attributes: {
    backgroundColor: Schema.Attribute.Enumeration<
      ['white', 'gray', 'blue', 'dark']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    subtitle: Schema.Attribute.Text;
    teamMemberIds: Schema.Attribute.JSON;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTestimonialsCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials_carousels';
  info: {
    description: 'Carousel of customer testimonials';
    displayName: 'Testimonials Carousel';
    icon: 'quote';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'white'>;
    subtitle: Schema.Attribute.Text;
    testimonials: Schema.Attribute.Component<'shared.testimonial-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Wat onze klanten zeggen'>;
  };
}

export interface SectionsTrustSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_trust_sections';
  info: {
    description: 'Trust badges section to build credibility';
    displayName: 'Trust Section';
    icon: 'shield';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'white'>;
    badges: Schema.Attribute.Component<'shared.trust-badge', true>;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['default', 'centered', 'compact']> &
      Schema.Attribute.DefaultTo<'centered'>;
  };
}

export interface SectionsTwoBlocksSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_two_blocks_sections';
  info: {
    description: 'Two blocks side-by-side with image and description';
    displayName: 'Two Blocks Section';
    icon: 'layout-grid';
  };
  attributes: {
    backgroundColor: Schema.Attribute.Enumeration<
      ['white', 'gray', 'blue', 'dark']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    blocks: Schema.Attribute.Component<'shared.block-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTwoColumnSupport extends Struct.ComponentSchema {
  collectionName: 'components_sections_two_column_support';
  info: {
    description: 'A two-column section with support info and testimonial';
    displayName: 'Two Column Support';
  };
  attributes: {
    leftBackgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#bfdbfe'>;
    leftButtonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Contact Us'>;
    leftButtonUrl: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    leftDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    leftTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Reliable assistance'>;
    showCarousel: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    testimonialImage: Schema.Attribute.Media<'images'>;
    testimonialName: Schema.Attribute.String & Schema.Attribute.Required;
    testimonialRole: Schema.Attribute.String & Schema.Attribute.Required;
    testimonialText: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsWhyChooseSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_why_choose_sections';
  info: {
    description: 'Grid of reasons why customers should choose your service';
    displayName: 'Why Choose Section';
    icon: 'star';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'var(--color-bg)'>;
    benefits: Schema.Attribute.Component<'shared.benefit-item', true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Wij maken het verschil met persoonlijke service en jarenlange ervaring'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Waarom GeldGeregeld?'>;
  };
}

export interface SectorsBenefit extends Struct.ComponentSchema {
  collectionName: 'components_sectors_benefits';
  info: {
    description: 'A benefit specific to this sector';
    displayName: 'Sector Benefit';
    icon: 'star';
    name: 'benefit';
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#fff2b2'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    iconPath: Schema.Attribute.String;
    textColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#1e2021'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectorsUseCase extends Struct.ComponentSchema {
  collectionName: 'components_sectors_use_cases';
  info: {
    description: 'A use case or purpose for financing in a sector';
    displayName: 'Use Case';
    icon: 'star';
    name: 'use-case';
  };
  attributes: {
    buttonHref: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/lead'>;
    buttonLabel: Schema.Attribute.String;
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#fff2b2'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    iconPath: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    textColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#1e2021'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_benefit_items';
  info: {
    description: 'Benefit card with icon, title, description and colors';
    displayName: 'Benefit Item';
    icon: 'star';
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#fff2b2'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    iconPath: Schema.Attribute.String & Schema.Attribute.Required;
    textColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#1e2021'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedBentoItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_bento_items';
  info: {
    description: 'Bento grid item for How It Works section';
    displayName: 'Bento Item';
    icon: 'apps';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    gridArea: Schema.Attribute.String & Schema.Attribute.Required;
    iconPath: Schema.Attribute.String & Schema.Attribute.Required;
    textColor: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedBlockItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_block_items';
  info: {
    description: 'Block with image, title, description and optional button';
    displayName: 'Block Item';
    icon: 'file-image';
  };
  attributes: {
    buttonHref: Schema.Attribute.String;
    buttonLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Reusable button component';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'text']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_item';
  info: {
    description: 'A single FAQ question and answer';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_card';
  info: {
    description: 'A card with image, icon badge, and text overlay';
    displayName: 'Feature Card';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    badgeColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#e9d5ff'>;
    badgePosition: Schema.Attribute.Enumeration<
      [
        'top-left',
        'top-center',
        'top-right',
        'center',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]
    > &
      Schema.Attribute.DefaultTo<'top-left'>;
    badgeText: Schema.Attribute.String & Schema.Attribute.Required;
    iconEmoji: Schema.Attribute.String;
    iconImage: Schema.Attribute.Media<'images'>;
    overlayColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#d1fae5'>;
    overlayIcon: Schema.Attribute.String;
    overlayText: Schema.Attribute.Text;
  };
}

export interface SharedImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_images';
  info: {
    description: 'Reusable image component';
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alternativeText: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    height: Schema.Attribute.Integer;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface SharedProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_process_steps';
  info: {
    description: 'Single process step with number, title, description and details';
    displayName: 'Process Step';
    icon: 'layer';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    details: Schema.Attribute.JSON;
    imagePath: Schema.Attribute.String;
    number: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_items';
  info: {
    description: 'Service card with icon, title and description';
    displayName: 'Service Item';
    icon: 'briefcase';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonial_items';
  info: {
    description: 'Single testimonial with name, role, text and image';
    displayName: 'Testimonial Item';
    icon: 'quote';
  };
  attributes: {
    image: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedTrustBadge extends Struct.ComponentSchema {
  collectionName: 'components_shared_trust_badges';
  info: {
    description: 'Trust badge with icon and text';
    displayName: 'Trust Badge';
    icon: 'shield';
  };
  attributes: {
    color: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    textColor: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.animated-stats': SectionsAnimatedStats;
      'sections.benefits-carousel': SectionsBenefitsCarousel;
      'sections.content-section': SectionsContentSection;
      'sections.cta-section': SectionsCtaSection;
      'sections.faq-section': SectionsFaqSection;
      'sections.feature-section': SectionsFeatureSection;
      'sections.feature-showcase': SectionsFeatureShowcase;
      'sections.hero-section': SectionsHeroSection;
      'sections.how-it-works-bento': SectionsHowItWorksBento;
      'sections.process-steps': SectionsProcessSteps;
      'sections.services-section': SectionsServicesSection;
      'sections.team-members-section': SectionsTeamMembersSection;
      'sections.testimonials-carousel': SectionsTestimonialsCarousel;
      'sections.trust-section': SectionsTrustSection;
      'sections.two-blocks-section': SectionsTwoBlocksSection;
      'sections.two-column-support': SectionsTwoColumnSupport;
      'sections.why-choose-section': SectionsWhyChooseSection;
      'sectors.benefit': SectorsBenefit;
      'sectors.use-case': SectorsUseCase;
      'shared.benefit-item': SharedBenefitItem;
      'shared.bento-item': SharedBentoItem;
      'shared.block-item': SharedBlockItem;
      'shared.button': SharedButton;
      'shared.faq-item': SharedFaqItem;
      'shared.feature-card': SharedFeatureCard;
      'shared.image': SharedImage;
      'shared.process-step': SharedProcessStep;
      'shared.service-item': SharedServiceItem;
      'shared.testimonial-item': SharedTestimonialItem;
      'shared.trust-badge': SharedTrustBadge;
    }
  }
}
