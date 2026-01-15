/**
 * Sector-specific testimonials in Dutch
 * These testimonials are SEO-optimized and tailored to each sector
 */

export interface SectorTestimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  sector: string;
}

// Default placeholder image for testimonials
const DEFAULT_IMAGE = '/images/pexels-ketut-subiyanto-4559683.jpg';

export const SECTOR_TESTIMONIALS: Record<string, SectorTestimonial[]> = {
  horeca: [
    {
      name: 'Sarah van der Berg',
      role: 'Eigenaar',
      company: 'Café de Hoek',
      text: 'Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte. Perfect voor de horeca!',
      rating: 5,
      sector: 'horeca'
    },
    {
      name: 'Pieter Bakker',
      role: 'Restaurant Manager',
      company: 'Restaurant De Gouden Leeuw',
      text: 'We hebben onze keukenapparatuur kunnen upgraden zonder grote voorinvestering. De flexibele aflossing past perfect bij onze seizoensgebonden inkomsten. Alleen de communicatie kon wat sneller.',
      rating: 4,
      sector: 'horeca'
    },
    {
      name: 'Marieke de Vries',
      role: 'Eigenaar',
      company: 'Hotel Amstelzicht',
      text: 'Voor onze hotelrenovatie hadden we snel financiering nodig. GeldGeregeld begrijpt de horecasector en bood een oplossing op maat. Zeer tevreden!',
      rating: 5,
      sector: 'horeca'
    }
  ],
  retail: [
    {
      name: 'Jan Smit',
      role: 'Eigenaar',
      company: 'Modezaak De Stijl',
      text: 'Onze nieuwe voorraad kon ik direct financieren zonder zorgen. De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn retailbedrijf.',
      rating: 5,
      sector: 'retail'
    },
    {
      name: 'Lisa Vermeulen',
      role: 'Oprichter',
      company: 'Webshop Groen',
      text: 'Als webshop eigenaar had ik flexibele financiering nodig voor groei. Het proces was redelijk snel, maar ik had wat meer informatie verwacht over de voorwaarden.',
      rating: 4,
      sector: 'retail'
    },
    {
      name: 'Tom de Wit',
      role: 'Directeur',
      company: 'Retail Group BV',
      text: 'Voor de uitbreiding van onze winkelketen was financiering essentieel. GeldGeregeld begrijpt retail en bood een oplossing die perfect aansloot bij onze behoeften.',
      rating: 5,
      sector: 'retail'
    }
  ],
  transport: [
    {
      name: 'Mark Jansen',
      role: 'Directeur',
      company: 'Transport BV',
      text: 'Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als transportbedrijf nodig hebben voor onze nieuwe vrachtwagen.',
      rating: 5,
      sector: 'transport'
    },
    {
      name: 'Henk van Dijk',
      role: 'Eigenaar',
      company: 'Van Dijk Logistiek',
      text: 'Voor onze vlootuitbreiding hadden we snel financiering nodig. Het aanbod kwam binnen 24 uur, maar de rente was iets hoger dan verwacht. Al met al tevreden.',
      rating: 4,
      sector: 'transport'
    },
    {
      name: 'Rob Peters',
      role: 'Operations Manager',
      company: 'Peters Transport & Logistiek',
      text: 'De flexibele aflossing past perfect bij onze wisselende inkomsten. GeldGeregeld begrijpt de uitdagingen van transportbedrijven.',
      rating: 5,
      sector: 'transport'
    }
  ],
  bouw: [
    {
      name: 'Johan Peters',
      role: 'CEO',
      company: 'Bouwbedrijf Solid',
      text: 'Voor onze nieuwe bouwprojecten hadden we betrouwbare financiering nodig. GeldGeregeld bood een oplossing die perfect aansloot bij onze cashflow.',
      rating: 5,
      sector: 'bouw'
    },
    {
      name: 'Dirk van der Berg',
      role: 'Eigenaar',
      company: 'Van der Berg Installaties',
      text: 'Als installateur heb ik regelmatig financiering nodig voor nieuwe apparatuur. Het proces was redelijk, maar ik had wat meer flexibiliteit verwacht in de voorwaarden.',
      rating: 3,
      sector: 'bouw'
    },
    {
      name: 'Frank de Boer',
      role: 'Directeur',
      company: 'De Boer Bouw & Renovatie',
      text: 'Voor onze verbouwingsprojecten is flexibele financiering cruciaal. GeldGeregeld biedt precies wat we nodig hebben: snel, transparant en betrouwbaar.',
      rating: 5,
      sector: 'bouw'
    }
  ],
  ecommerce: [
    {
      name: 'Emma van den Berg',
      role: 'Oprichter',
      company: 'E-commerce Store NL',
      text: 'Voor de groei van mijn webshop had ik snel financiering nodig. GeldGeregeld begrijpt e-commerce en bood een oplossing die perfect aansloot bij mijn behoeften.',
      rating: 5,
      sector: 'ecommerce'
    },
    {
      name: 'Lucas Meijer',
      role: 'CEO',
      company: 'Online Retail Solutions',
      text: 'De snelle goedkeuring en flexibele voorwaarden maakten het verschil voor mijn online onderneming. GeldGeregeld is echt gespecialiseerd in e-commerce.',
      rating: 5,
      sector: 'ecommerce'
    },
    {
      name: 'Sophie de Vries',
      role: 'Eigenaar',
      company: 'Webshop Fashion Forward',
      text: 'Voor mijn webshop had ik financiering nodig voor voorraad en marketing. Het proces was redelijk, maar ik had wat meer flexibiliteit verwacht in de looptijd.',
      rating: 4,
      sector: 'ecommerce'
    }
  ],
  zorg: [
    {
      name: 'Dr. Anna van der Meer',
      role: 'Directeur',
      company: 'Zorginstelling De Zorgvlied',
      text: 'Voor onze zorginstelling was betrouwbare financiering essentieel. GeldGeregeld begrijpt de zorgsector en bood een oplossing op maat.',
      rating: 5,
      sector: 'zorg'
    },
    {
      name: 'Peter van Houten',
      role: 'Manager',
      company: 'Welzijnsorganisatie Thuiszorg Plus',
      text: 'De flexibele aflossing past perfect bij onze budgetcyclus. Het proces verliep goed, maar de communicatie kon wat sneller.',
      rating: 4,
      sector: 'zorg'
    },
    {
      name: 'Maria Jansen',
      role: 'Eigenaar',
      company: 'Fysiotherapie Praktijk Jansen',
      text: 'Voor de uitbreiding van mijn praktijk had ik snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor zorgondernemers!',
      rating: 5,
      sector: 'zorg'
    }
  ],
  consultants: [
    {
      name: 'Robert de Wit',
      role: 'Partner',
      company: 'Adviesbureau De Wit & Partners',
      text: 'Als consultancy hebben we regelmatig financiering nodig voor projecten. GeldGeregeld biedt flexibele oplossingen die perfect aansluiten bij onze behoeften.',
      rating: 5,
      sector: 'consultants'
    },
    {
      name: 'Laura Bakker',
      role: 'Eigenaar',
      company: 'Bakker Consultancy',
      text: 'Voor mijn adviesbureau had ik financiering nodig voor groei. Het proces verliep goed, maar de documentatie kon wat duidelijker zijn.',
      rating: 4,
      sector: 'consultants'
    },
    {
      name: 'Martijn Smit',
      role: 'Directeur',
      company: 'Smit Strategisch Advies',
      text: 'De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn adviesbureau. GeldGeregeld is echt gespecialiseerd in consultancy.',
      rating: 5,
      sector: 'consultants'
    }
  ],
  schoonmaak: [
    {
      name: 'Karin van der Berg',
      role: 'Eigenaar',
      company: 'Schoonmaakbedrijf Sparkle',
      text: 'Voor nieuwe schoonmaakapparatuur had ik snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor schoonmaakbedrijven!',
      rating: 5,
      sector: 'schoonmaak'
    },
    {
      name: 'Hans de Vries',
      role: 'Directeur',
      company: 'De Vries Schoonmaak Services',
      text: 'De flexibele aflossing past perfect bij onze wisselende inkomsten. GeldGeregeld begrijpt de schoonmaaksector en bood een oplossing op maat.',
      rating: 5,
      sector: 'schoonmaak'
    },
    {
      name: 'Ingrid Meijer',
      role: 'Manager',
      company: 'Meijer Schoonmaak & Onderhoud',
      text: 'Voor de uitbreiding van mijn schoonmaakbedrijf was financiering essentieel. Het proces was redelijk, maar ik had wat meer persoonlijk contact verwacht.',
      rating: 4,
      sector: 'schoonmaak'
    }
  ],
  automotive: [
    {
      name: 'Willem van Dijk',
      role: 'Eigenaar',
      company: 'Garage Van Dijk',
      text: 'Voor nieuwe garageapparatuur had ik snel financiering nodig. GeldGeregeld begrijpt automotive en bood een oplossing die perfect aansloot bij mijn behoeften.',
      rating: 5,
      sector: 'automotive'
    },
    {
      name: 'Ronald Peters',
      role: 'Directeur',
      company: 'Peters Auto Service',
      text: 'De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn autobedrijf. GeldGeregeld is echt gespecialiseerd in automotive.',
      rating: 5,
      sector: 'automotive'
    },
    {
      name: 'Erik de Boer',
      role: 'Eigenaar',
      company: 'De Boer Car Service',
      text: 'Voor de uitbreiding van mijn garage had ik financiering nodig. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
      rating: 5,
      sector: 'automotive'
    }
  ],
  productie: [
    {
      name: 'Jan van der Meer',
      role: 'CEO',
      company: 'Productiebedrijf Van der Meer',
      text: 'Voor nieuwe productiemachines had ik snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor productiebedrijven!',
      rating: 5,
      sector: 'productie'
    },
    {
      name: 'Paul Jansen',
      role: 'Directeur',
      company: 'Jansen Industriële Productie',
      text: 'De flexibele aflossing past perfect bij onze productiecyclus. GeldGeregeld begrijpt de industrie en bood een oplossing op maat.',
      rating: 5,
      sector: 'productie'
    },
    {
      name: 'Gerard Smit',
      role: 'Operations Manager',
      company: 'Smit Manufacturing BV',
      text: 'Voor onze productieuitbreiding was financiering essentieel. Het proces was redelijk, maar de voorwaarden waren wat strikter dan verwacht.',
      rating: 4,
      sector: 'productie'
    }
  ],
  zzp: [
    {
      name: 'Daan van der Laan',
      role: 'ZZP\'er',
      company: 'Van der Laan Marketing',
      text: 'Als ZZP\'er had ik flexibele financiering nodig voor mijn nieuwe laptop en kantoorinrichting. GeldGeregeld begrijpt de behoeften van zelfstandigen zonder personeel.',
      rating: 5,
      sector: 'zzp'
    },
    {
      name: 'Femke de Jong',
      role: 'Freelance Consultant',
      company: 'De Jong Advies',
      text: 'Voor mijn ZZP-bedrijf was snel financiering belangrijk. GeldGeregeld bood een oplossing zonder ingewikkelde voorwaarden. Perfect voor zelfstandigen!',
      rating: 5,
      sector: 'zzp'
    },
    {
      name: 'Bas Smit',
      role: 'Zelfstandig Professional',
      company: 'Smit IT Services',
      text: 'De flexibele aflossing past perfect bij mijn wisselende inkomsten als ZZP\'er. GeldGeregeld maakt financiering toegankelijk voor zelfstandigen.',
      rating: 5,
      sector: 'zzp'
    }
  ],
  starters: [
    {
      name: 'Thijs Bakker',
      role: 'Oprichter',
      company: 'Bakker Startups',
      text: 'Als startende ondernemer had ik financiering nodig zonder jarenlange historie. GeldGeregeld bood precies wat ik zocht: snel en zonder gedoe.',
      rating: 5,
      sector: 'starters'
    },
    {
      name: 'Lotte van den Berg',
      role: 'Startup Founder',
      company: 'Van den Berg Innovations',
      text: 'Voor mijn startup was betrouwbare financiering essentieel. GeldGeregeld begrijpt starters en bood een oplossing die perfect aansloot bij mijn situatie.',
      rating: 5,
      sector: 'starters'
    },
    {
      name: 'Ruben de Vries',
      role: 'Oprichter',
      company: 'De Vries Tech Solutions',
      text: 'De snelle goedkeuring maakte het verschil voor mijn nieuwe onderneming. GeldGeregeld is echt gespecialiseerd in startersfinanciering.',
      rating: 5,
      sector: 'starters'
    }
  ],
  franchise: [
    {
      name: 'Miranda Jansen',
      role: 'Franchisenemer',
      company: 'Jansen Franchise Group',
      text: 'Voor mijn franchise had ik snel financiering nodig. GeldGeregeld begrijpt franchising en bood een oplossing die perfect aansloot bij mijn behoeften.',
      rating: 5,
      sector: 'franchise'
    },
    {
      name: 'Kevin Peters',
      role: 'Franchise Eigenaar',
      company: 'Peters Franchise BV',
      text: 'De flexibele voorwaarden maakten het verschil voor mijn franchise-onderneming. GeldGeregeld is echt gespecialiseerd in franchise financiering.',
      rating: 5,
      sector: 'franchise'
    },
    {
      name: 'Nina van Dijk',
      role: 'Franchisenemer',
      company: 'Van Dijk Franchise Services',
      text: 'Voor de uitbreiding van mijn franchise had ik financiering nodig. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
      rating: 5,
      sector: 'franchise'
    }
  ],
  medisch: [
    {
      name: 'Dr. Thomas van der Meer',
      role: 'Huisarts',
      company: 'Huisartsenpraktijk Van der Meer',
      text: 'Voor nieuwe medische apparatuur had ik snel financiering nodig. GeldGeregeld begrijpt medische praktijken en bood een oplossing op maat.',
      rating: 5,
      sector: 'medisch'
    },
    {
      name: 'Dr. Eva Bakker',
      role: 'Specialist',
      company: 'Medisch Centrum Bakker',
      text: 'De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn praktijk. GeldGeregeld is echt gespecialiseerd in medische financiering.',
      rating: 5,
      sector: 'medisch'
    },
    {
      name: 'Dr. Maarten Smit',
      role: 'Arts',
      company: 'Smit Medische Praktijk',
      text: 'Voor de uitbreiding van mijn praktijk had ik financiering nodig. GeldGeregeld bood precies wat ik zocht: snel, transparant en betrouwbaar.',
      rating: 5,
      sector: 'medisch'
    }
  ],
  tandarts: [
    {
      name: 'Dr. Lisa van der Berg',
      role: 'Tandarts',
      company: 'Tandartspraktijk Van der Berg',
      text: 'Voor nieuwe tandheelkundige apparatuur had ik snel financiering nodig. GeldGeregeld begrijpt tandartspraktijken en bood een oplossing die perfect aansloot.',
      rating: 5,
      sector: 'tandarts'
    },
    {
      name: 'Dr. Jeroen de Vries',
      role: 'Tandarts',
      company: 'De Vries Tandheelkunde',
      text: 'De flexibele aflossing past perfect bij onze praktijk. GeldGeregeld maakte het financieringsproces eenvoudig en snel voor tandartsen.',
      rating: 5,
      sector: 'tandarts'
    },
    {
      name: 'Dr. Sanne Meijer',
      role: 'Tandarts',
      company: 'Meijer Tandartspraktijk',
      text: 'Voor de verbouwing van mijn praktijk was financiering essentieel. GeldGeregeld bood een oplossing die perfect aansloot bij mijn behoeften.',
      rating: 5,
      sector: 'tandarts'
    }
  ],
  groothandel: [
    {
      name: 'Martijn van Houten',
      role: 'Directeur',
      company: 'Van Houten Groothandel BV',
      text: 'Voor onze voorraadfinanciering hadden we snel kapitaal nodig. GeldGeregeld begrijpt groothandel en bood een oplossing die perfect aansloot bij onze behoeften.',
      rating: 5,
      sector: 'groothandel'
    },
    {
      name: 'Saskia de Wit',
      role: 'Eigenaar',
      company: 'De Wit Distributie',
      text: 'De snelle goedkeuring maakte het verschil voor onze groothandel. GeldGeregeld is echt gespecialiseerd in wholesale financiering.',
      rating: 5,
      sector: 'groothandel'
    },
    {
      name: 'Rick Jansen',
      role: 'Operations Manager',
      company: 'Jansen Groothandel & Distributie',
      text: 'Voor onze distributie-uitbreiding was financiering essentieel. Het proces verliep goed, maar de communicatie kon wat duidelijker zijn.',
      rating: 4,
      sector: 'groothandel'
    }
  ],
  schoonheid: [
    {
      name: 'Sanne van der Laan',
      role: 'Eigenaar',
      company: 'Schoonheidssalon Van der Laan',
      text: 'Voor nieuwe schoonheidsapparatuur had ik snel financiering nodig. GeldGeregeld begrijpt de schoonheidsindustrie en bood een oplossing op maat.',
      rating: 5,
      sector: 'schoonheid'
    },
    {
      name: 'Fleur Bakker',
      role: 'Kapper',
      company: 'Kapperszaak Bakker',
      text: 'De flexibele aflossing past perfect bij mijn kapperszaak. GeldGeregeld maakte het financieringsproces eenvoudig en snel.',
      rating: 5,
      sector: 'schoonheid'
    },
    {
      name: 'Iris de Jong',
      role: 'Eigenaar',
      company: 'De Jong Wellness & Beauty',
      text: 'Voor de uitbreiding van mijn schoonheidssalon was financiering essentieel. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
      rating: 5,
      sector: 'schoonheid'
    }
  ],
  kasstroom: [
    {
      name: 'Dennis van der Berg',
      role: 'CFO',
      company: 'Van der Berg Bedrijven',
      text: 'Voor ons werkkapitaal hadden we snel financiering nodig. GeldGeregeld begrijpt cashflow management en bood een oplossing die perfect aansloot.',
      rating: 5,
      sector: 'kasstroom'
    },
    {
      name: 'Marco Smit',
      role: 'Financieel Manager',
      company: 'Smit Business Solutions',
      text: 'De snelle goedkeuring maakte het verschil voor onze liquiditeitsfinanciering. GeldGeregeld is echt gespecialiseerd in werkkapitaal.',
      rating: 5,
      sector: 'kasstroom'
    },
    {
      name: 'Patricia de Vries',
      role: 'Directeur',
      company: 'De Vries Finance BV',
      text: 'Voor het overbruggen van betalingsachterstanden was financiering essentieel. GeldGeregeld bood precies wat we nodig hadden: snel, flexibel en betrouwbaar.',
      rating: 5,
      sector: 'kasstroom'
    }
  ]
};

/**
 * Get testimonials for a specific sector
 * Falls back to general testimonials if sector-specific ones are not available
 */
export function getSectorTestimonials(sector: string): SectorTestimonial[] {
  return SECTOR_TESTIMONIALS[sector] || SECTOR_TESTIMONIALS.horeca; // Fallback to horeca
}

/**
 * Convert company name to generic role description
 * Maps specific names to their correct generic roles based on company type
 */
function makeRoleGeneric(role: string, company: string): string {
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
}

/**
 * Convert sector testimonials to TestimonialsCarousel format
 * Removes company names and makes roles generic
 */
export function convertToCarouselFormat(testimonials: SectorTestimonial[]): Array<{
  name: string;
  role: string;
  text: string;
  image: string;
  company?: string;
  rating?: number;
}> {
  return testimonials.map(t => ({
    name: t.name,
    role: makeRoleGeneric(t.role, t.company),
    text: t.text,
    image: DEFAULT_IMAGE,
    // Don't include company name - keep it generic
    company: undefined,
    rating: t.rating
  }));
}
