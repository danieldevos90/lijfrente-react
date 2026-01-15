/**
 * Bootstrap function to seed sector pages
 * This creates sector pages programmatically on Strapi startup
 */

import type { Core } from '@strapi/strapi';

const SITE_ID = 'geldgeregeld';

interface SectorInfo {
  name: string;
  description: string;
  keywords: string[];
}

const SECTORS: Record<string, SectorInfo> = {
  horeca: {
    name: 'Horeca',
    description: 'Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafés en hotels.',
    keywords: ['horeca financiering', 'restaurant lening', 'café financiering', 'hotel financiering'],
  },
  retail: {
    name: 'Retail',
    description: 'Financiering voor retailbedrijven. Van webshops tot fysieke winkels.',
    keywords: ['retail financiering', 'winkel financiering', 'webshop lening', 'retail lening'],
  },
  transport: {
    name: 'Transport & Logistiek',
    description: 'Zakelijke lening voor transport- en logistiekbedrijven.',
    keywords: ['transport financiering', 'logistiek lening', 'vrachtwagen financiering'],
  },
  bouw: {
    name: 'Bouw & Installatie',
    description: 'Financiering voor bouwbedrijven en installateurs.',
    keywords: ['bouw financiering', 'installatie lening', 'bouwbedrijf financiering'],
  },
  ecommerce: {
    name: 'E-commerce',
    description: 'Zakelijke financiering voor online ondernemers en webshops.',
    keywords: ['e-commerce financiering', 'webshop lening', 'online ondernemer financiering'],
  },
  zorg: {
    name: 'Zorg & Welzijn',
    description: 'Financiering voor zorginstellingen en welzijnsorganisaties.',
    keywords: ['zorg financiering', 'welzijn lening', 'zorginstelling financiering'],
  },
  consultants: {
    name: 'Advies & Consultancy',
    description: 'Financiering voor adviesbureaus en consultants.',
    keywords: ['consultancy financiering', 'adviesbureau lening', 'consultant financiering'],
  },
  schoonmaak: {
    name: 'Schoonmaak',
    description: 'Zakelijke financiering voor schoonmaakbedrijven.',
    keywords: ['schoonmaak financiering', 'schoonmaakbedrijf lening'],
  },
  automotive: {
    name: 'Automotive',
    description: 'Financiering voor automotive bedrijven en garages.',
    keywords: ['automotive financiering', 'garage lening', 'autobedrijf financiering'],
  },
  productie: {
    name: 'Productie & Industrie',
    description: 'Zakelijke lening voor productiebedrijven en industriële ondernemingen.',
    keywords: ['productie financiering', 'industrie lening', 'productiebedrijf financiering'],
  },
};

function generateQuote(sectorSlug: string, sectorName: string): string {
  return `Financiering die meegroeit met je ${sectorName.toLowerCase()}bedrijf. Of je nu investeert, groeit, of uitdagingen moet overbruggen – wij begrijpen de unieke behoeften van de ${sectorName.toLowerCase()}sector en bieden flexibele oplossingen die passen bij jouw bedrijf.`;
}

function generateEasyLendingContent(sectorName: string): string {
  return `Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon eenvoudig online aanvragen en snel een antwoord krijgen.

Ons proces is speciaal ontwikkeld voor ${sectorName.toLowerCase()}-ondernemers die snel willen handelen. We begrijpen dat timing cruciaal is - daarom zorgen we voor snelle beslissingen.

Geen uitgebreide jaarrekeningen nodig. We kijken naar je recente omzetcijfers en begrijpen de unieke uitdagingen van de ${sectorName.toLowerCase()}sector.`;
}

function generateUseCases(sectorSlug: string): Array<{
  title: string;
  description: string;
  color?: string;
  textColor?: string;
  buttonLabel?: string;
  buttonHref?: string;
}> {
  const useCasesMap: Record<string, Array<{ title: string; description: string }>> = {
    horeca: [
      {
        title: 'Keukenapparatuur',
        description: 'Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.',
      },
      {
        title: 'Renovatie & Verbouwing',
        description: 'Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.',
      },
      {
        title: 'Terras & Uitbreiding',
        description: 'Breid je terras uit of investeer in nieuwe buitenmeubels. Maak optimaal gebruik van het seizoen met flexibele financiering.',
      },
      {
        title: 'Werkkapitaal',
        description: 'Financier je dagelijkse operaties, voorraad of seizoensgebonden pieken in je omzet. Flexibel en snel geregeld.',
      },
    ],
    retail: [
      {
        title: 'Winkelverbouwing',
        description: 'Financier verbouwingen en modernisering van je winkel. Maak je retailzaak aantrekkelijker voor klanten.',
      },
      {
        title: 'Voorraad & Inventaris',
        description: 'Investeer in voorraad zonder grote voorinvestering. Houd je schappen gevuld met flexibele financiering.',
      },
      {
        title: 'Nieuwe locatie',
        description: 'Financier een nieuwe winkel of uitbreiding naar meerdere locaties. Groei je retailbedrijf met vertrouwen.',
      },
      {
        title: 'Online uitbreiding',
        description: 'Investeer in je webshop, logistiek of online marketing. Breid je retailactiviteiten uit naar online.',
      },
    ],
    transport: [
      {
        title: 'Nieuwe voertuigen',
        description: 'Financier nieuwe vrachtwagens, bestelauto\'s of andere voertuigen voor je transportbedrijf.',
      },
      {
        title: 'Onderhoud & Reparatie',
        description: 'Financier onderhoud, reparaties of upgrades aan je vloot. Houd je voertuigen in topconditie.',
      },
      {
        title: 'Logistiek & Magazijn',
        description: 'Investeer in magazijnruimte, laad- en losinstallaties of logistieke systemen.',
      },
      {
        title: 'Groei & Uitbreiding',
        description: 'Financier uitbreiding van je transportcapaciteit of nieuwe routes. Groei je transportbedrijf.',
      },
    ],
    bouw: [
      {
        title: 'Materiaal & Materieel',
        description: 'Financier bouwmaterialen, gereedschappen en materieel voor je bouwprojecten.',
      },
      {
        title: 'Voertuigen & Machines',
        description: 'Investeer in bouwmachines, graafmachines of transportvoertuigen voor je bouwbedrijf.',
      },
      {
        title: 'Kantoor & Werkplaats',
        description: 'Financier een nieuwe werkplaats, kantoor of opslagruimte voor je bouwbedrijf.',
      },
      {
        title: 'Werkkapitaal',
        description: 'Financier je dagelijkse operaties en overbrug wachttijden tussen facturen en betalingen.',
      },
    ],
    ecommerce: [
      {
        title: 'Online marketing',
        description: 'Investeer in advertenties, SEO of social media marketing om je webshop te laten groeien.',
      },
      {
        title: 'Voorraad & Logistiek',
        description: 'Financier voorraad, magazijnruimte of logistieke uitbreiding voor je webshop.',
      },
      {
        title: 'Website & Platform',
        description: 'Investeer in verbetering van je webshop, nieuwe features of migratie naar een beter platform.',
      },
      {
        title: 'Internationale uitbreiding',
        description: 'Financier uitbreiding naar nieuwe markten of landen. Groei je e-commerce bedrijf internationaal.',
      },
    ],
    zorg: [
      {
        title: 'Medische apparatuur',
        description: 'Financier medische apparatuur, hulpmiddelen of technologie voor je zorginstelling.',
      },
      {
        title: 'Praktijkverbouwing',
        description: 'Financier verbouwingen, renovatie of uitbreiding van je zorginstelling of praktijk.',
      },
      {
        title: 'Personeel & Opleiding',
        description: 'Investeer in personeel, opleidingen of training om de kwaliteit van zorg te verbeteren.',
      },
      {
        title: 'Digitalisering',
        description: 'Financier digitale systemen, software of automatisering voor je zorgorganisatie.',
      },
    ],
    consultants: [
      {
        title: 'Kantoor & Uitrusting',
        description: 'Financier kantoorruimte, meubilair of professionele uitrusting voor je adviesbureau.',
      },
      {
        title: 'Software & Tools',
        description: 'Investeer in software, tools of systemen om je consultancy efficiënter te maken.',
      },
      {
        title: 'Marketing & Netwerken',
        description: 'Financier marketing, netwerkevenementen of business development voor je adviesbureau.',
      },
      {
        title: 'Opleiding & Certificering',
        description: 'Investeer in opleidingen, certificeringen of bijscholing om je expertise uit te breiden.',
      },
    ],
    schoonmaak: [
      {
        title: 'Schoonmaakapparatuur',
        description: 'Financier professionele schoonmaakapparatuur, machines en materialen voor je schoonmaakbedrijf.',
      },
      {
        title: 'Voertuigen',
        description: 'Investeer in bedrijfsvoertuigen voor transport van apparatuur en personeel naar klanten.',
      },
      {
        title: 'Werkkapitaal',
        description: 'Financier je dagelijkse operaties en overbrug wachttijden tussen facturen en betalingen.',
      },
      {
        title: 'Uitbreiding & Groei',
        description: 'Financier uitbreiding naar nieuwe klanten, locaties of groei van je schoonmaakbedrijf.',
      },
    ],
    automotive: [
      {
        title: 'Werkplaatsapparatuur',
        description: 'Financier professionele gereedschappen, liften of diagnostische apparatuur voor je garage.',
      },
      {
        title: 'Voorraad & Onderdelen',
        description: 'Investeer in voorraad van onderdelen, banden of accessoires voor je automotive bedrijf.',
      },
      {
        title: 'Uitbreiding werkplaats',
        description: 'Financier uitbreiding van je werkplaats, nieuwe behandelruimten of verbetering van faciliteiten.',
      },
      {
        title: 'Training & Certificering',
        description: 'Investeer in training en certificering voor je team om de nieuwste technologieën te beheersen.',
      },
    ],
    productie: [
      {
        title: 'Productiemachines',
        description: 'Financier nieuwe productiemachines, automatisering of verbetering van bestaande productielijnen.',
      },
      {
        title: 'Kwaliteitscontrole',
        description: 'Investeer in kwaliteitscontrolesystemen, meetapparatuur of testfaciliteiten.',
      },
      {
        title: 'Magazijn & Logistiek',
        description: 'Financier magazijnuitbreiding, logistieke systemen of verbetering van je supply chain.',
      },
      {
        title: 'Duurzaamheid & Efficiëntie',
        description: 'Investeer in duurzame technologieën, energiebesparing of verbetering van productie-efficiëntie.',
      },
    ],
  };

  const baseUseCases = useCasesMap[sectorSlug] || [];
  const colors = ['#fff2b2', '#e4f2ff', '#fff2b2', '#e4f2ff'];
  const textColors = ['#1e2021', '#1e2021', '#1e2021', '#1e2021'];

  return baseUseCases.map((useCase, index) => ({
    ...useCase,
    color: colors[index % colors.length],
    textColor: textColors[index % textColors.length],
    buttonLabel: 'Vraag offerte aan',
    buttonHref: '/lead',
  }));
}

function generateBenefits(sectorSlug: string, sectorName: string): Array<{
  title: string;
  description: string;
  iconPath?: string;
  color?: string;
  textColor?: string;
}> {
  // Generic benefits that apply to all sectors
  return [
    {
      title: 'Snel geregeld',
      description: 'Binnen 24 uur inzicht in je financieringsmogelijkheden. Geen weken wachten zoals bij traditionele banken.',
      iconPath: '/icons/SVG/interface/zap.svg',
      color: '#fff2b2',
      textColor: '#1e2021',
    },
    {
      title: 'Flexibel aflossen',
      description: 'Pas je aflossingen aan op basis van je cashflow. Meer aflossen in goede maanden, minder in rustige periodes.',
      iconPath: '/icons/SVG/interface/clock.svg',
      color: '#e4f2ff',
      textColor: '#0f1720',
    },
    {
      title: 'Geen verborgen kosten',
      description: 'Transparante voorwaarden en kosten. Geen verrassingen achteraf. Boetevrij vervroegd aflossen mogelijk.',
      iconPath: '/icons/SVG/interface/shield.svg',
      color: '#fff2b2',
      textColor: '#1e2021',
    },
    {
      title: `Specifiek voor ${sectorName.toLowerCase()}`,
      description: `We begrijpen de uitdagingen van de ${sectorName.toLowerCase()} sector. Ons team heeft ervaring met ${sectorName.toLowerCase()} bedrijven.`,
      iconPath: '/icons/SVG/interface/heart.svg',
      color: '#e4f2ff',
      textColor: '#0f1720',
    },
  ];
}

export async function seedSectorPages(strapi: Core.Strapi): Promise<void> {
  try {
    strapi.log.info('🌱 Seeding sector pages...');

    for (const [sectorSlug, sectorInfo] of Object.entries(SECTORS)) {
      try {
        // Check if sector page already exists
        const existing = await strapi.entityService.findMany('api::sector-page.sector-page' as any, {
          filters: {
            siteId: SITE_ID,
            sectorSlug,
          },
          limit: 1,
        });

        if (existing && existing.length > 0) {
          strapi.log.info(`  ⏭️  Sector page ${sectorSlug} already exists, skipping`);
          continue;
        }

        // Generate content
        const quote = generateQuote(sectorSlug, sectorInfo.name);
        const easyLendingContent = generateEasyLendingContent(sectorInfo.name);
        const useCases = generateUseCases(sectorSlug);
        const benefits = generateBenefits(sectorSlug, sectorInfo.name);

        // Create sector page
        await strapi.entityService.create('api::sector-page.sector-page' as any, {
          data: {
            siteId: SITE_ID,
            sectorSlug,
            sectorName: sectorInfo.name,
            metaDescription: sectorInfo.description,
            metaKeywords: sectorInfo.keywords.join(', '),
            heroTitle: `Zakelijke financiering voor ${sectorInfo.name.toLowerCase()}`,
            heroSubtitle: sectorInfo.description,
            quote,
            quoteAuthor: null,
            easyLendingTitle: 'Zo eenvoudig is het om financiering te krijgen',
            easyLendingContent,
            easyLendingImagePosition: 'left',
            useCasesTitle: 'Waarvoor kun je de financiering gebruiken?',
            useCasesSubtitle: `Veelzijdige financieringsoplossingen speciaal voor ${sectorInfo.name.toLowerCase()}`,
            useCases,
            benefitsTitle: 'Waarom kiezen voor onze financiering?',
            benefitsSubtitle: `Voordelen speciaal voor ${sectorInfo.name.toLowerCase()}`,
            benefits,
            ctaTitle: 'Klaar om te beginnen?',
            ctaSubtitle: 'Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.',
            ctaLabel: 'Vraag financiering aan',
            ctaHref: '/lead',
            publishedAt: null, // Create as draft
          },
        });

        strapi.log.info(`  ✅ Created sector page: ${sectorSlug}`);
      } catch (error: any) {
        strapi.log.warn(`  ⚠️  Failed to create sector page ${sectorSlug}: ${error.message}`);
      }
    }

    strapi.log.info('✅ Sector pages seeding complete');
  } catch (error: any) {
    strapi.log.warn(`❌ Failed to seed sector pages: ${error.message}`);
  }
}
