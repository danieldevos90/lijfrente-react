import { StrapiSection } from '@/types/strapi-cms';
import HeroSection from '../components/sections/HeroSection';
import SubpageHero from '../components/SubpageHero';
import BenefitsCarousel from '../components/BenefitsCarousel';
import FeatureSectionWrapper from '../app/FeatureSectionWrapper';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import HowItWorksBento from '../components/HowItWorksBento';
import CTASection from '../components/sections/CTASection';
import ProcessSteps from '../components/ProcessSteps';
import WhyChooseSection from '../components/WhyChooseSection';
import ContentSection from '../components/sections/ContentSection';
import ServicesSection from '../components/sections/ServicesSection';
import TrustSection from '../components/sections/TrustSection';
import FAQSection from '../components/FAQSection';
import FeatureShowcase from '../components/sections/FeatureShowcase';
import TwoColumnSupport from '../components/TwoColumnSupport';

export function renderSection(section: StrapiSection, index: number) {
  // Handle Strapi v4 nested attributes structure if needed
  const sectionData = (section as any).attributes || section;
  
  switch (sectionData.__component) {
    case 'sections.hero-section':
      // Use SubpageHero for subpage heroes (gradient variant without backgroundImage)
      const isSubpageHero = sectionData.variant === 'gradient' && !sectionData.backgroundImage;
      
      if (isSubpageHero) {
        // Use first icon from icons array or iconPath for SubpageHero
        const iconPath = sectionData.icons && sectionData.icons.length > 0 
          ? sectionData.icons[0] 
          : sectionData.iconPath;
        
        // Debug logging
        console.log('SubpageHero section data:', {
          variant: sectionData.variant,
          backgroundImage: sectionData.backgroundImage,
          iconPath: sectionData.iconPath,
          icons: sectionData.icons,
          resolvedIconPath: iconPath,
          fullSection: sectionData
        });
        
        return (
          <SubpageHero
            key={index}
            title={sectionData.title || ''}
            subtitle={sectionData.subtitle}
            backgroundColor="#f9f9f8"
            iconPath={iconPath || undefined}
          />
        );
      }
      
      // Use HeroSection for homepage/full-screen heroes
      return (
        <HeroSection
          key={index}
          badge={sectionData.badge}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          backgroundImage={sectionData.backgroundImage}
          variant={sectionData.variant}
          iconPath={sectionData.iconPath}
          icons={sectionData.icons}
          ctaLabel={sectionData.primaryCta?.label}
          ctaHref={sectionData.primaryCta?.href}
        />
      );
    
    case 'sections.benefits-carousel':
      return (
        <BenefitsCarousel
          key={index}
          benefits={sectionData.benefits?.map(b => ({
            iconPath: b.iconPath,
            title: b.title,
            desc: b.description,
            color: b.color || '#fff2b2',
            textColor: b.textColor || '#5e5515'
          })) || []}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          backgroundColor={sectionData.backgroundColor}
        />
      );
    
    case 'sections.feature-section':
      return (
        <FeatureSectionWrapper
          key={index}
          title={sectionData.title}
          description={sectionData.description}
          buttonText={sectionData.buttonText}
          imagePath={sectionData.imagePath}
          imagePosition={sectionData.imagePosition}
          backgroundColor={sectionData.backgroundColor}
        />
      );
    
    case 'sections.testimonials-carousel':
      return (
        <TestimonialsCarousel
          key={index}
          testimonials={sectionData.testimonials?.map(t => ({
            name: t.name,
            role: t.role,
            text: t.text,
            image: t.image
          })) || []}
        />
      );
    
    case 'sections.how-it-works-bento':
      return (
        <HowItWorksBento key={index} />
      );
    
    case 'sections.process-steps':
      return (
        <ProcessSteps
          key={index}
          steps={sectionData.steps?.map(s => ({
            number: s.number,
            title: s.title,
            description: s.description,
            details: s.details || [],
            imagePath: s.imagePath
          })) || []}
        />
      );
    
    case 'sections.why-choose-section':
      return (
        <WhyChooseSection
          key={index}
          benefits={sectionData.benefits?.map(b => ({
            title: b.title,
            description: b.description,
            iconPath: b.iconPath,
            color: b.color || '#fff2b2',
            textColor: b.textColor || '#5e5515'
          })) || []}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
        />
      );
    
    case 'sections.content-section':
      return (
        <ContentSection
          key={index}
          title={sectionData.title}
          content={sectionData.content}
          layout={sectionData.layout}
          variant={sectionData.variant}
          background={sectionData.background}
          ctaLabel={sectionData.ctaLabel}
          ctaHref={sectionData.ctaHref}
        />
      );
    
    case 'sections.services-section':
      return (
        <ServicesSection
          key={index}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          services={sectionData.services || []}
        />
      );
    
    case 'sections.trust-section':
      return (
        <TrustSection
          key={index}
          badges={sectionData.badges || []}
          variant={sectionData.variant}
        />
      );
    
    case 'sections.cta-section':
      return (
        <CTASection
          key={index}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          ctaLabel={sectionData.ctaLabel}
          ctaHref={sectionData.ctaHref}
          background={sectionData.background}
        />
      );
    
    case 'sections.faq-section':
      return (
        <FAQSection
          key={index}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          faqItems={sectionData.faqItems?.map((item, idx) => ({
            id: `faq-${idx}`,
            question: item.question,
            answer: item.answer
          })) || []}
        />
      );
    
    case 'sections.feature-showcase':
      return (
        <FeatureShowcase
          key={index}
          title={sectionData.title}
          featureCards={sectionData.features?.map((f, idx) => ({
            id: idx,
            backgroundImage: { url: '/images/placeholder.jpg' },
            badgeText: f.title || '',
            badgeColor: '#457fff'
          })) || []}
        />
      );
    
    case 'sections.two-column-support':
      return (
        <TwoColumnSupport
          key={index}
          leftTitle={sectionData.title}
          leftDescription={sectionData.content}
        />
      );
    
    default:
      console.warn('Unknown section type:', sectionData.__component);
      return null;
  }
}

