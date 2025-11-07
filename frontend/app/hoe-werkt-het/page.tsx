import { getPageBySlug } from '@/lib/strapi-cms';
import { StrapiSection } from '@/types/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import HeroSection from '../../components/sections/HeroSection';
import BenefitsCarousel from '../../components/BenefitsCarousel';
import FeatureSectionWrapper from '../FeatureSectionWrapper';
import TestimonialsCarousel from '../../components/TestimonialsCarousel';
import HowItWorksBento from '../../components/HowItWorksBento';
import CTASection from '../../components/sections/CTASection';
import ProcessSteps from '../../components/ProcessSteps';
import WhyChooseSection from '../../components/WhyChooseSection';
import ContentSection from '../../components/sections/ContentSection';
import ServicesSection from '../../components/sections/ServicesSection';
import TrustSection from '../../components/sections/TrustSection';
import FAQSection from '../../components/FAQSection';
import FeatureShowcase from '../../components/sections/FeatureShowcase';
import TwoColumnSupport from '../../components/TwoColumnSupport';
import SubpageHero from '../../components/SubpageHero';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

function renderSection(section: StrapiSection, index: number) {
  switch (section.__component) {
    case 'sections.hero-section':
      return (
        <HeroSection
          key={index}
          badge={section.badge}
          title={section.title}
          subtitle={section.subtitle}
          backgroundImage={section.backgroundImage}
          variant={section.variant}
          iconPath={section.iconPath}
          icons={section.icons}
          ctaLabel={section.primaryCta?.label}
          ctaHref={section.primaryCta?.href}
        />
      );
    
    case 'sections.benefits-carousel':
      return (
        <BenefitsCarousel
          key={index}
          benefits={section.benefits?.map(b => ({
            iconPath: b.iconPath,
            title: b.title,
            desc: b.description,
            color: b.color || '#fff2b2',
            textColor: b.textColor || '#5e5515'
          })) || []}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );
    
    case 'sections.feature-section':
      return (
        <FeatureSectionWrapper
          key={index}
          title={section.title}
          description={section.description}
          buttonText={section.buttonText}
          imagePath={section.imagePath}
          imagePosition={section.imagePosition}
          backgroundColor={section.backgroundColor}
        />
      );
    
    case 'sections.testimonials-carousel':
      return (
        <TestimonialsCarousel
          key={index}
          testimonials={section.testimonials?.map(t => ({
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
          steps={section.steps?.map(s => ({
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
          benefits={section.benefits?.map(b => ({
            title: b.title,
            description: b.description,
            iconPath: b.iconPath,
            color: b.color || '#fff2b2',
            textColor: b.textColor || '#5e5515'
          })) || []}
          title={section.title}
          subtitle={section.subtitle}
        />
      );
    
    case 'sections.content-section':
      return (
        <ContentSection
          key={index}
          title={section.title}
          content={section.content}
          layout={section.layout}
          variant={section.variant}
          background={section.background}
          ctaLabel={section.ctaLabel}
          ctaHref={section.ctaHref}
        />
      );
    
    case 'sections.services-section':
      return (
        <ServicesSection
          key={index}
          title={section.title}
          subtitle={section.subtitle}
          services={section.services || []}
        />
      );
    
    case 'sections.trust-section':
      return (
        <TrustSection
          key={index}
          badges={section.badges || []}
          variant={section.variant}
        />
      );
    
    case 'sections.cta-section':
      return (
        <CTASection
          key={index}
          title={section.title}
          subtitle={section.subtitle}
          ctaLabel={section.ctaLabel}
          ctaHref={section.ctaHref}
          background={section.background}
        />
      );
    
    case 'sections.faq-section':
      return (
        <FAQSection
          key={index}
          title={section.title}
          subtitle={section.subtitle}
          faqItems={section.faqItems?.map((item, idx) => ({
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
          title={section.title}
          featureCards={section.features?.map((f, idx) => ({
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
          leftTitle={section.title}
          leftDescription={section.content}
        />
      );
    
    default:
      console.warn('Unknown section type:', section.__component);
      return null;
  }
}

export default async function HoeWerktHetPage() {
  let page = null;
  
  try {
    page = await getPageBySlug('hoe-werkt-het', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for hoe-werkt-het page');
  }
  
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;

  if (!page || !sections || !Array.isArray(sections)) {
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Hoe werkt het?"
            subtitle="Laden..."
            backgroundColor="#f9f9f8"
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderWithWidget />
      <main>
        {sections.map((section: any, index: number) => {
          try {
            return renderSection(section, index);
          } catch (e) {
            console.error(`Error rendering section ${index}:`, e);
            return null;
          }
        })}
      </main>
      <Footer />
    </>
  );
}
