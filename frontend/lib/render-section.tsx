import { StrapiSection } from '@/types/strapi-cms';

// Section components
import HeroSection from '../components/sections/HeroSection';
import SubpageHero from '../components/SubpageHero';
import BenefitsCarousel from '../components/BenefitsCarousel';
import FeatureSectionWrapper from '../app/FeatureSectionWrapper';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import HowItWorksBento from '../components/HowItWorksBento';
import ProcessSteps from '../components/ProcessSteps';
import WhyChooseSection from '../components/WhyChooseSection';
import ContentSection from '../components/sections/ContentSection';
import ServicesSection from '../components/sections/ServicesSection';
import TrustSection from '../components/sections/TrustSection';
import CTASection from '../components/sections/CTASection';
import FAQSection from '../components/FAQSection';
import FeatureShowcase from '../components/sections/FeatureShowcase';
import TwoColumnSupport from '../components/TwoColumnSupport';
import TwoBlocksSection from '../components/sections/TwoBlocksSection';

// Contact components
import ContactOptionsSection from '../components/ContactOptionsSection';
import ContactForm from '../components/ContactForm';
import ContactDetailsSection from '../components/sections/ContactDetailsSection';

/**
 * Extract icon path from section data, handling various Strapi data structures
 * Returns a default icon if none is found
 */
function extractIconPath(sectionData: any): string | undefined {
  // Try icons array first (can be JSON string or array)
  if (sectionData?.icons) {
    let iconsArray: string[] | null = null;
    
    if (typeof sectionData.icons === 'string') {
      // Check if it's already a valid path (starts with /)
      if (sectionData.icons.startsWith('/')) {
        return sectionData.icons;
      }
      
      // Try to parse as JSON
      try {
        iconsArray = JSON.parse(sectionData.icons);
      } catch (e) {
        // If parsing fails, treat as single icon path
        return sectionData.icons;
      }
    } else if (Array.isArray(sectionData.icons)) {
      iconsArray = sectionData.icons;
    }
    
    if (iconsArray && iconsArray.length > 0) {
      const firstIcon = iconsArray[0];
      if (typeof firstIcon === 'string' && firstIcon) {
        return firstIcon;
      }
    }
  }
  
  // Fallback to iconPath
  if (sectionData?.iconPath) {
    const iconPath = typeof sectionData.iconPath === 'string' 
      ? sectionData.iconPath 
      : String(sectionData.iconPath);
    
    if (iconPath && iconPath !== 'null' && iconPath !== 'undefined') {
      return iconPath;
    }
  }
  
  // Default icon for subpage heroes (finance-related icon)
  return '/icons/SVG/finance/wallet.svg';
}

export function renderSection(section: StrapiSection, index: number) {
  // Handle Strapi v4 nested attributes structure if needed
  // Sections can be nested: section.attributes or section.data.attributes
  let sectionData = section as any;
  if (sectionData.attributes) {
    sectionData = sectionData.attributes;
  } else if (sectionData.data?.attributes) {
    sectionData = sectionData.data.attributes;
  }
  
  // Also check if component type is nested
  if (!sectionData.__component && (section as any).__component) {
    sectionData.__component = (section as any).__component;
  }
  
  switch (sectionData.__component) {
    case 'sections.hero-section':
      // Use SubpageHero for subpage heroes (gradient variant without backgroundImage)
      const isSubpageHero = sectionData.variant === 'gradient' && !sectionData.backgroundImage;
      
      if (isSubpageHero) {
        const iconPath = extractIconPath(sectionData);
        
        return (
          <SubpageHero
            key={index}
            title={sectionData.title || ''}
            subtitle={sectionData.subtitle}
            backgroundColor="#f9f9f8"
            iconPath={iconPath}
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
          title={sectionData.title}
          subtitle={sectionData.subtitle}
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
      // Handle benefits - can be array or nested in data
      let benefitsArray: any[] = [];
      if (sectionData.benefits) {
        if (Array.isArray(sectionData.benefits)) {
          benefitsArray = sectionData.benefits;
        } else if (sectionData.benefits.data && Array.isArray(sectionData.benefits.data)) {
          benefitsArray = sectionData.benefits.data;
        }
      }
      
      // Map benefits, handling both flat and nested structures
      const mappedBenefits = benefitsArray.map((b: any) => {
        // Handle Strapi v4 nested attributes structure
        const benefitData = b.attributes || b;
        return {
          title: benefitData.title || '',
          description: benefitData.description || '',
          iconPath: benefitData.iconPath || '',
          color: benefitData.color || '#fff2b2',
          textColor: benefitData.textColor || '#5e5515'
        };
      });
      
      return (
        <WhyChooseSection
          key={index}
          benefits={mappedBenefits}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
        />
      );
    
    case 'sections.content-section':
      // Use ContactDetailsSection for Contactgegevens section
      if (sectionData.title === 'Contactgegevens' || sectionData.title?.toLowerCase().includes('contactgegevens')) {
        return (
          <ContactDetailsSection
            key={index}
            title={sectionData.title}
            content={sectionData.content}
          />
        );
      }
      // Skip Openingstijden section
      if (sectionData.title === 'Openingstijden' || sectionData.title?.toLowerCase().includes('openingstijden')) {
        return null;
      }
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
      // Use ContactOptionsSection for Contactmogelijkheden section
      if (sectionData.title === 'Contactmogelijkheden' || sectionData.title?.toLowerCase().includes('contact')) {
        // Get services, handling both direct array and nested data structure
        let services = sectionData.services || [];
        if (services && typeof services === 'object' && 'data' in services) {
          services = services.data || [];
        }
        
        // Fallback to default contact options if services are empty
        if (!services || services.length === 0) {
          services = [
            {
              icon: "/icons/SVG/interface/phone.svg",
              title: "Bel ons",
              description: "Ma-Vr: 09:00 - 18:00\n085-0480881",
              href: "tel:0850480881"
            },
            {
              icon: "/icons/SVG/interface/mail.svg",
              title: "E-mail ons",
              description: "Reactie binnen 24 uur\ninfo@geldgeregeld.nl",
              href: "mailto:info@geldgeregeld.nl"
            }
          ];
        }
        
        return (
          <ContactOptionsSection
            key={index}
            title={sectionData.title}
            subtitle={sectionData.subtitle}
            options={services.map((service: any, idx: number) => {
              // Pattern: yellow (0), blue (1), white (2), yellow (3), blue (4), white (5)...
              let color = '#ffffff';
              let textColor = 'var(--color-text)';
              
              if (idx % 3 === 0) {
                // Yellow
                color = '#fff2b2';
                textColor = '#5e5515';
              } else if (idx % 3 === 1) {
                // Blue
                color = '#e4f2ff';
                textColor = '#0f1720';
              }
              // else white (default)
              
              return {
                title: service.title,
                description: service.description,
                iconPath: service.icon || service.iconPath,
                color,
                textColor,
                href: service.href
              };
            })}
          />
        );
      }
      // Use regular ServicesSection for other services sections
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
          badges={sectionData.badges?.map(b => {
            // Handle Strapi v4 nested attributes structure
            const badgeData = (b as any).attributes || b;
            return {
              icon: badgeData.icon,
              text: badgeData.text,
              description: badgeData.description,
              color: badgeData.color,
              textColor: badgeData.textColor,
            };
          }) || []}
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
    
    case 'sections.two-blocks-section':
      return (
        <TwoBlocksSection
          key={index}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          blocks={sectionData.blocks || []}
          backgroundColor={sectionData.backgroundColor}
        />
      );
    
    case 'sections.contact-form':
      return (
        <section
          key={index}
          style={{
            background: 'var(--color-bg)',
            padding: '8rem 2rem',
          }}
        >
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            <ContactForm />
          </div>
        </section>
      );
    
    default:
      console.warn('Unknown section type:', sectionData.__component);
      return null;
  }
}

