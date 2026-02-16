export type SectorInfo = {
  name: string;
  description: string;
  keywords: string[];
};

// Central registry for programmatic SEO and internal linking.
// Keep this in sync with the sector listing + sitemap.
export const SECTOR_INFO: Record<string, SectorInfo> = {
  horeca: {
    name: "Horeca",
    description: "Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafes en hotels.",
    keywords: [
      "horeca financiering",
      "restaurant lening",
      "cafe financiering",
      "hotel financiering",
      "horeca krediet",
      "horeca ondernemer financiering",
      "horeca lening zonder bkr",
    ],
  },
  retail: {
    name: "Retail",
    description: "Financiering voor retailbedrijven. Van webshops tot fysieke winkels.",
    keywords: [
      "retail financiering",
      "winkel financiering",
      "webshop lening",
      "retail lening",
      "retail krediet",
      "winkelier financiering",
      "retail ondernemer lening",
    ],
  },
  transport: {
    name: "Transport & Logistiek",
    description: "Zakelijke lening voor transport- en logistiekbedrijven.",
    keywords: [
      "transport financiering",
      "logistiek lening",
      "vrachtwagen financiering",
      "transportbedrijf lening",
      "transport krediet",
      "logistiek krediet",
      "vrachtwagen lening",
    ],
  },
  bouw: {
    name: "Bouw & Installatie",
    description: "Financiering voor bouwbedrijven en installateurs.",
    keywords: [
      "bouw financiering",
      "installatie lening",
      "bouwbedrijf financiering",
      "aannemer lening",
      "bouw krediet",
      "installateur financiering",
      "bouwondernemer lening",
    ],
  },
  ecommerce: {
    name: "E-commerce",
    description: "Zakelijke financiering voor online ondernemers en webshops.",
    keywords: [
      "e-commerce financiering",
      "webshop lening",
      "online ondernemer financiering",
      "e-commerce lening",
      "webshop krediet",
      "online winkel financiering",
      "e-commerce krediet",
    ],
  },
  zorg: {
    name: "Zorg & Welzijn",
    description: "Financiering voor zorginstellingen en welzijnsorganisaties.",
    keywords: [
      "zorg financiering",
      "welzijn lening",
      "zorginstelling financiering",
      "zorgondernemer lening",
      "zorg krediet",
      "welzijnsorganisatie financiering",
      "zorgondernemer krediet",
    ],
  },
  consultants: {
    name: "Advies & Consultancy",
    description: "Financiering voor adviesbureaus en consultants.",
    keywords: [
      "consultancy financiering",
      "adviesbureau lening",
      "consultant financiering",
      "advies lening",
      "consultancy krediet",
      "adviesbureau krediet",
      "consultant krediet",
    ],
  },
  schoonmaak: {
    name: "Schoonmaak",
    description: "Zakelijke financiering voor schoonmaakbedrijven.",
    keywords: [
      "schoonmaak financiering",
      "schoonmaakbedrijf lening",
      "schoonmaak lening",
      "schoonmaak krediet",
      "schoonmaakbedrijf krediet",
      "reinigingsbedrijf financiering",
    ],
  },
  automotive: {
    name: "Automotive",
    description: "Financiering voor automotive bedrijven en garages.",
    keywords: [
      "automotive financiering",
      "garage lening",
      "autobedrijf financiering",
      "automotive lening",
      "garage krediet",
      "autobedrijf krediet",
      "autowerkplaats financiering",
    ],
  },
  productie: {
    name: "Productie & Industrie",
    description: "Zakelijke lening voor productiebedrijven en industriele ondernemingen.",
    keywords: [
      "productie financiering",
      "industrie lening",
      "productiebedrijf financiering",
      "industrieel lening",
      "productie krediet",
      "industrie krediet",
      "maakindustrie financiering",
    ],
  },
  zzp: {
    name: "ZZP",
    description: "Zakelijke financiering voor zelfstandigen zonder personeel. Flexibele lening voor ZZP'ers.",
    keywords: [
      "zzp lening",
      "zzp financiering",
      "zzp krediet",
      "zelfstandige lening",
      "zzp ondernemer financiering",
      "zzp lening zonder bkr",
    ],
  },
  starters: {
    name: "Starters & Startups",
    description: "Financiering voor startende ondernemers en startups. Snel geregeld zonder jarenlange historie.",
    keywords: [
      "starterslening",
      "startup financiering",
      "startende ondernemer lening",
      "nieuwe onderneming financiering",
      "starters krediet",
    ],
  },
  franchise: {
    name: "Franchise",
    description: "Zakelijke financiering voor franchisenemers. Investeer in je franchise zonder gedoe.",
    keywords: [
      "franchise lening",
      "franchise financiering",
      "franchisenemer lening",
      "franchise krediet",
      "franchise ondernemer financiering",
    ],
  },
  medisch: {
    name: "Medische Praktijken",
    description: "Financiering voor medische praktijken en artsen. Speciaal voor de zorgsector.",
    keywords: [
      "medische praktijk lening",
      "arts financiering",
      "praktijk financiering",
      "medisch centrum lening",
      "huisarts financiering",
    ],
  },
  tandarts: {
    name: "Tandartspraktijken",
    description: "Zakelijke financiering voor tandartspraktijken. Investeer in apparatuur en verbouwingen.",
    keywords: [
      "tandartspraktijk lening",
      "tandarts financiering",
      "tandarts krediet",
      "tandartspraktijk krediet",
      "tandheelkunde financiering",
    ],
  },
  groothandel: {
    name: "Groothandel",
    description: "Financiering voor groothandels en distributiebedrijven. Werkkapitaal voor voorraad en groei.",
    keywords: [
      "groothandel financiering",
      "groothandel lening",
      "wholesale financiering",
      "distributie financiering",
      "groothandel krediet",
    ],
  },
  schoonheid: {
    name: "Schoonheidsindustrie",
    description: "Zakelijke financiering voor kappers, schoonheidssalons en wellnesscentra.",
    keywords: [
      "kapper lening",
      "schoonheidssalon financiering",
      "schoonheidsindustrie lening",
      "kapperszaak financiering",
      "beauty salon lening",
    ],
  },
  kasstroom: {
    name: "Kasstroom & Werkkapitaal",
    description: "Werkkapitaalfinanciering voor bedrijven. Overbrug betalingsachterstanden en investeer in groei.",
    keywords: [
      "kasstroom lening",
      "werkkapitaal financiering",
      "liquiditeitsfinanciering",
      "werkkapitaal krediet",
      "cashflow financiering",
    ],
  },
};

export const SECTOR_SLUGS = Object.keys(SECTOR_INFO);

