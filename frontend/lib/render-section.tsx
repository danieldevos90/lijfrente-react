import { StrapiSection } from '@/types/strapi-cms';

// Section components
import HeroSection from '../components/sections/HeroSection';
import SubpageHero from '../components/SubpageHero';
import BenefitsCarousel from '../components/BenefitsCarousel';
import FeatureSectionWrapper from '../app/FeatureSectionWrapper';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import TestimonialsGrid from '../components/TestimonialsGrid';
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
 * Normalize color values - replace deprecated colors with standard tokens
 * Replaces #5e5515 and #114e0b with #1e2021 (charcoal)
 */
function normalizeColor(color: string | undefined | null): string {
  if (!color) return '';
  const normalized = color.trim();
  // Replace deprecated colors with charcoal
  if (normalized === '#5e5515' || normalized === '#114e0b' || normalized.toLowerCase() === '#5e5515' || normalized.toLowerCase() === '#114e0b') {
    return '#1e2021';
  }
  return normalized;
}

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
            backgroundColor="var(--color-bg)"
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
            color: normalizeColor(b.color) || 'var(--color-sun)',
            textColor: normalizeColor(b.textColor) || 'var(--color-warning-dark)'
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
      // Testimonials are hidden site-wide (no verified reviews available yet)
      return null;
      
      const makeRoleGeneric = (role: string, company?: string): string => {
        const roleLower = (role || '').toLowerCase();
        const companyLower = (company || '').toLowerCase();
        const combinedText = `${role} ${company}`.toLowerCase();
        
        // Priority: Check company name first (most reliable indicator)
        // Then check combined text, then role
        
        // Café / Cafe
        if (companyLower.includes('café') || companyLower.includes('cafe') || combinedText.includes('café') || combinedText.includes('cafe')) {
          return 'Café eigenaar';
        }
        
        // Restaurant
        if (companyLower.includes('restaurant') || combinedText.includes('restaurant')) {
          return 'Restaurant eigenaar';
        }
        
        // Hotel
        if (companyLower.includes('hotel') || combinedText.includes('hotel')) {
          return 'Hotel eigenaar';
        }
        
        // Webshop / Web shop
        if (companyLower.includes('webshop') || companyLower.includes('web shop') || combinedText.includes('webshop')) {
          return 'Oprichter Webshop';
        }
        
        // Transport / Logistiek
        if (companyLower.includes('transport') || companyLower.includes('logistiek') || combinedText.includes('transport') || combinedText.includes('logistiek')) {
          return 'Transport ondernemer';
        }
        
        // Winkel / Retail
        if (companyLower.includes('winkel') || companyLower.includes('retail') || companyLower.includes('modezaak') || combinedText.includes('winkel') || combinedText.includes('retail')) {
          return 'Winkelier';
        }
        
        // Bouw / Aannemer
        if (companyLower.includes('bouw') || companyLower.includes('aannemer') || companyLower.includes('installatie') || combinedText.includes('bouw') || combinedText.includes('aannemer')) {
          return 'Bouwondernemer';
        }
        
        // Zorg / Zorginstelling
        if (companyLower.includes('zorg') || companyLower.includes('zorginstelling') || companyLower.includes('welzijn') || combinedText.includes('zorg')) {
          return 'Zorgondernemer';
        }
        
        // Advies / Consultancy
        if (companyLower.includes('advies') || companyLower.includes('consultancy') || companyLower.includes('consultant') || combinedText.includes('advies') || combinedText.includes('consultancy')) {
          return 'Adviseur';
        }
        
        // Schoonmaak
        if (companyLower.includes('schoonmaak') || companyLower.includes('reiniging') || combinedText.includes('schoonmaak')) {
          return 'Schoonmaakondernemer';
        }
        
        // Garage / Automotive
        if (companyLower.includes('garage') || companyLower.includes('automotive') || companyLower.includes('auto') || combinedText.includes('garage') || combinedText.includes('automotive')) {
          return 'Garage eigenaar';
        }
        
        // Productie / Industrie
        if (companyLower.includes('productie') || companyLower.includes('industrie') || companyLower.includes('fabriek') || combinedText.includes('productie') || combinedText.includes('industrie')) {
          return 'Productie ondernemer';
        }
        
        // Groothandel
        if (companyLower.includes('groothandel') || companyLower.includes('wholesale') || combinedText.includes('groothandel')) {
          return 'Groothandelaar';
        }
        
        // Franchise
        if (companyLower.includes('franchise') || combinedText.includes('franchise')) {
          return 'Franchisenemer';
        }
        
        // Default: use role if it's already generic, otherwise make generic
        if (roleLower.includes('eigenaar')) {
          return 'Ondernemer';
        }
        if (roleLower.includes('oprichter')) {
          return 'Oprichter Webshop';
        }
        if (roleLower.includes('directeur')) {
          return 'Ondernemer';
        }
        if (roleLower.includes('manager')) {
          return 'Ondernemer';
        }
        
        return role || 'Ondernemer';
      };
      
      // Rating mapping for homepage testimonials
      const testimonialRatings: Record<string, number> = {
        'Erik van der Berg': 5,
        'Jan Jansen': 4,
        'Lisa Vermeulen': 5
      };
      
      // Handle testimonials - they might be in different structures.
      const testimonialsArray = sectionData.testimonials || [];
      
      if (testimonialsArray.length === 0) {
        throw new Error('[render-section] Testimonials section has no testimonials (no fallback enabled).');
      }
      
      // Debug logging
      console.log('[render-section] Processing testimonials:', {
        testimonialsArrayLength: testimonialsArray.length,
        firstTestimonial: testimonialsArray[0],
        sectionDataKeys: Object.keys(sectionData)
      });
      
      const testimonials = testimonialsArray.map((t: any) => {
        // Handle different testimonial structures
        const testimonial = t.attributes || t;
        return {
          name: testimonial.name || t.name,
          role: makeRoleGeneric(testimonial.role || t.role || '', testimonial.company || t.company || ''),
          text: testimonial.text || t.text,
          image: testimonial.image || t.image,
          // Don't include company name - keep it generic
          company: undefined,
          rating: testimonial.rating || t.rating || testimonialRatings[testimonial.name || t.name] || 5
        };
      });
      
      // Remove duplicates based on name and text (case-insensitive)
      const uniqueTestimonials = testimonials.filter((t, index, self) => 
        index === self.findIndex((tt) => 
          tt.name.toLowerCase() === t.name.toLowerCase() &&
          tt.text.toLowerCase() === t.text.toLowerCase()
        )
      );
      
      // Ensure we have testimonials to display
      if (uniqueTestimonials.length === 0) {
        throw new Error('[render-section] Testimonials section contains no valid testimonials (no fallback enabled).');
      }
      
      // Use unique testimonials only - don't duplicate
      // Show up to 6 unique testimonials (or all if less than 6)
      let displayTestimonials = [...uniqueTestimonials];
      if (displayTestimonials.length > 6) {
        // If more than 6, take first 6
        displayTestimonials = displayTestimonials.slice(0, 6);
      }
      
      return (
        <TestimonialsGrid
          key={index}
          testimonials={displayTestimonials}
          title={sectionData.title}
          subtitle={sectionData.subtitle}
          backgroundColor={sectionData.backgroundColor}
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
          color: normalizeColor(benefitData.color) || 'var(--color-sun)',
          textColor: normalizeColor(benefitData.textColor) || 'var(--color-warning-dark)'
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
              let color = 'var(--color-white)';
              let textColor = 'var(--color-text)';
              
              if (idx % 3 === 0) {
                // Yellow
                color = 'var(--color-sun)';
                textColor = 'var(--color-warning-dark)';
              } else if (idx % 3 === 1) {
                // Blue
                color = 'var(--color-sky500)';
                textColor = 'var(--color-text)';
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
              color: normalizeColor(badgeData.color),
              textColor: normalizeColor(badgeData.textColor),
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
            badgeColor: 'var(--color-primary)'
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

