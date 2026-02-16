export type UseCaseSlug =
  | "werkkapitaal"
  | "voorraad"
  | "machines"
  | "inventaris"
  | "uitbreiding"
  | "overname"
  | "herfinanciering"
  | "factoring";

export type UseCaseConfig = {
  slug: UseCaseSlug;
  label: string;
  // Value used by QuickLeadForm (`purpose`).
  leadPurpose: string;
  // Prefill amount as a sensible default (still editable).
  defaultAmountEUR: number;

  heroTitleTemplate: (sectorName: string) => string;
  heroSubtitleTemplate: (sectorName: string) => string;

  directAnswerTitleTemplate: (sectorName: string) => string;
  directAnswerTemplate: (sectorName: string) => string;

  // Short section bullets that are easy to vary per use-case.
  bullets: Array<{ label: string; value: string }>;

  // Generic FAQ items; we’ll add sector-flavor on top.
  faqs: Array<{ question: string; answer: string }>;
};

export const USE_CASES: Record<UseCaseSlug, UseCaseConfig> = {
  werkkapitaal: {
    slug: "werkkapitaal",
    label: "Werkkapitaal",
    leadPurpose: "werkkapitaal",
    defaultAmountEUR: 50000,
    heroTitleTemplate: (sectorName) => `Werkkapitaal voor ${sectorName}`,
    heroSubtitleTemplate: (sectorName) =>
      `Financier je dagelijkse kosten, groei en piekperiodes als ${sectorName.toLowerCase()} ondernemer.`,
    directAnswerTitleTemplate: (sectorName) => `Werkkapitaal voor ${sectorName}: wanneer is het slim?`,
    directAnswerTemplate: (sectorName) =>
      `Werkkapitaal helpt om lopende kosten te betalen terwijl je wacht op betalingen van klanten. Voor ${sectorName.toLowerCase()} ondernemers is het vaak slim bij groei, seizoenspieken of langere betaaltermijnen.`,
    bullets: [
      { label: "Gebruik", value: "Voorraad, personeel, leveranciers" },
      { label: "Doel", value: "Cashflow overbruggen" },
      { label: "Snelheid", value: "Aanvraag online, snel duidelijkheid" },
    ],
    faqs: [
      {
        question: "Wat is werkkapitaal precies?",
        answer:
          "Werkkapitaal is geld voor je dagelijkse bedrijfsvoering, zoals leveranciers, voorraad en salarissen. Het is bedoeld om je cashflow stabiel te houden.",
      },
      {
        question: "Wanneer heb ik werkkapitaal nodig?",
        answer:
          "Bij groei, seizoenspieken, langere betaaltermijnen of wanneer je kosten eerder komen dan je inkomsten.",
      },
    ],
  },
  voorraad: {
    slug: "voorraad",
    label: "Voorraad financieren",
    leadPurpose: "voorraad",
    defaultAmountEUR: 75000,
    heroTitleTemplate: (sectorName) => `Voorraad financieren in ${sectorName}`,
    heroSubtitleTemplate: (sectorName) =>
      `Koop voorraad in voor piekmomenten en groei, zonder je cashflow te blokkeren.`,
    directAnswerTitleTemplate: (sectorName) => `Voorraad financieren als ${sectorName.toLowerCase()} ondernemer`,
    directAnswerTemplate: (sectorName) =>
      `Voorraadfinanciering helpt je om extra in te kopen (bijvoorbeeld voor piekperiodes) zonder al je liquiditeit vast te zetten. Je spreidt kosten en behoudt ruimte voor je lopende uitgaven.`,
    bullets: [
      { label: "Gebruik", value: "Inkoop, seizoenspieken, assortiment" },
      { label: "Doel", value: "Groei zonder cashflow stress" },
      { label: "Aflossen", value: "Afstemmen op omloopsnelheid" },
    ],
    faqs: [
      {
        question: "Wanneer is voorraad financieren interessant?",
        answer:
          "Wanneer je grotere inkoopdeals wilt pakken, piekperiodes hebt of je assortiment wilt uitbreiden, maar je cashflow niet wilt vastzetten.",
      },
      {
        question: "Is voorraad financieren hetzelfde als werkkapitaal?",
        answer:
          "Voorraad is een veelvoorkomende inzet van werkkapitaal. Het verschil is dat voorraadfinanciering expliciet op inkoop/voorraad is gericht.",
      },
    ],
  },
  machines: {
    slug: "machines",
    label: "Voertuigen & machines",
    leadPurpose: "machines",
    defaultAmountEUR: 120000,
    heroTitleTemplate: (sectorName) => `Voertuigen en machines financieren voor ${sectorName}`,
    heroSubtitleTemplate: () => `Investeer in bedrijfsmiddelen zonder je liquiditeit uit te putten.`,
    directAnswerTitleTemplate: (sectorName) => `Machines financieren voor ${sectorName}: hoe werkt dat?`,
    directAnswerTemplate: (sectorName) =>
      `Met financiering voor machines en voertuigen kun je investeren in capaciteit en kwaliteit, terwijl je de kosten spreidt. Dit is vaak interessant bij groei, vervanging of een grote opdracht.`,
    bullets: [
      { label: "Gebruik", value: "Machines, voertuigen, gereedschap" },
      { label: "Doel", value: "Capaciteit en efficiency" },
      { label: "Looptijd", value: "Afstemmen op levensduur" },
    ],
    faqs: [
      {
        question: "Wat is slim: korte of lange looptijd?",
        answer:
          "Stem de looptijd af op de levensduur van het bedrijfsmiddel. Zo voorkom je dat je nog aflost terwijl de machine al vervangen moet worden.",
      },
      {
        question: "Kan ik ook tweedehands machines financieren?",
        answer:
          "Dat kan vaak, afhankelijk van type machine, staat en je situatie. Je krijgt een voorstel met voorwaarden.",
      },
    ],
  },
  inventaris: {
    slug: "inventaris",
    label: "Inventaris & software",
    leadPurpose: "inventaris",
    defaultAmountEUR: 60000,
    heroTitleTemplate: (sectorName) => `Inventaris en software financieren voor ${sectorName}`,
    heroSubtitleTemplate: () => `Financier apparatuur, IT en inrichting om te professionaliseren en te groeien.`,
    directAnswerTitleTemplate: (sectorName) => `Inventaris financieren als ${sectorName.toLowerCase()} ondernemer`,
    directAnswerTemplate: () =>
      `Inventarisfinanciering helpt je om bedrijfsmiddelen te kopen (zoals IT, inrichting of apparatuur) zonder in een keer een groot bedrag uit je bedrijf te halen.`,
    bullets: [
      { label: "Gebruik", value: "IT, inrichting, apparatuur" },
      { label: "Doel", value: "Professionaliseer sneller" },
      { label: "Kosten", value: "Spreiden over tijd" },
    ],
    faqs: [
      {
        question: "Wat valt onder inventaris?",
        answer:
          "Denk aan inrichting, computers, kassa’s, software, gereedschap en andere middelen die je gebruikt om je werk te doen.",
      },
      {
        question: "Is inventaris financieren hetzelfde als lease?",
        answer:
          "Lease is een vorm van financiering voor bedrijfsmiddelen. Welke optie het beste past, hangt af van je situatie en de asset.",
      },
    ],
  },
  uitbreiding: {
    slug: "uitbreiding",
    label: "Uitbreiding & groei",
    leadPurpose: "uitbreiding",
    defaultAmountEUR: 100000,
    heroTitleTemplate: (sectorName) => `Uitbreiding financieren voor ${sectorName}`,
    heroSubtitleTemplate: () => `Versnel groei: personeel, marketing, nieuwe locaties of extra capaciteit.`,
    directAnswerTitleTemplate: (sectorName) => `Groei financieren in ${sectorName}: wat is een slimme aanpak?`,
    directAnswerTemplate: () =>
      `Uitbreidingsfinanciering helpt om groei-investeringen te doen voordat de extra omzet volledig binnen is. Zorg dat je plan en cashflow realistisch zijn en kies een voorstel dat daarbij past.`,
    bullets: [
      { label: "Gebruik", value: "Personeel, marketing, schaal" },
      { label: "Doel", value: "Groei versnellen" },
      { label: "Risico", value: "Aflossen matchen met groei" },
    ],
    faqs: [
      {
        question: "Waarvoor wordt groei-financiering het meest gebruikt?",
        answer:
          "Vaak voor personeel, marketing, uitbreiding van capaciteit, voorraad en het openen van een (extra) locatie.",
      },
      {
        question: "Hoe voorkom ik dat groei mijn cashflow breekt?",
        answer:
          "Maak een cashflow-planning, reken met realistische betaaltermijnen en zorg voor voldoende buffer. Financiering kan helpen om pieken te overbruggen.",
      },
    ],
  },
  overname: {
    slug: "overname",
    label: "Overnamefinanciering",
    leadPurpose: "overname",
    defaultAmountEUR: 200000,
    heroTitleTemplate: (sectorName) => `Overnamefinanciering voor ${sectorName}`,
    heroSubtitleTemplate: () => `Financier een bedrijfsovername met een heldere, haalbare financieringsmix.`,
    directAnswerTitleTemplate: () => `Bedrijfsovername financieren: wat zijn de opties?`,
    directAnswerTemplate: () =>
      `Overnamefinanciering is vaak een combinatie van eigen middelen, lening en soms verkopersfinanciering. Een duidelijke onderbouwing en realistische cijfers vergroten je kans op een goed voorstel.`,
    bullets: [
      { label: "Gebruik", value: "Bedrijfsovername" },
      { label: "Doel", value: "Groei via acquisitie" },
      { label: "Mix", value: "Eigen middelen + lening" },
    ],
    faqs: [
      {
        question: "Moet ik altijd eigen geld inbrengen bij een overname?",
        answer:
          "Vaak wel, maar het hangt af van de deal en je situatie. Een financieringsmix kan helpen om het haalbaar te maken.",
      },
      {
        question: "Wat is verkopersfinanciering?",
        answer:
          "De verkoper financiert een deel van de koopprijs, waardoor je minder extern hoeft te lenen. Dit komt regelmatig voor bij overnames.",
      },
    ],
  },
  herfinanciering: {
    slug: "herfinanciering",
    label: "Herfinanciering",
    leadPurpose: "herfinanciering",
    defaultAmountEUR: 100000,
    heroTitleTemplate: (sectorName) => `Herfinanciering voor ${sectorName}`,
    heroSubtitleTemplate: () => `Herstructureer je bestaande financiering voor betere cashflow en overzicht.`,
    directAnswerTitleTemplate: () => `Herfinanciering: wanneer loont het?`,
    directAnswerTemplate: () =>
      `Herfinanciering kan interessant zijn als je voorwaarden kunt verbeteren, je maandlasten wilt verlagen of meer overzicht wilt. Je krijgt een voorstel met transparante voorwaarden.`,
    bullets: [
      { label: "Gebruik", value: "Bestaande lening vervangen" },
      { label: "Doel", value: "Betere voorwaarden/overzicht" },
      { label: "Effect", value: "Cashflow verbeteren" },
    ],
    faqs: [
      {
        question: "Wanneer is herfinanciering verstandig?",
        answer:
          "Bij hoge rente, ongunstige voorwaarden, meerdere leningen tegelijk of wanneer je cashflow is veranderd.",
      },
      {
        question: "Kan ik boetevrij herfinancieren?",
        answer:
          "Dat hangt af van je huidige contract. Bekijk altijd de voorwaarden; wij kunnen helpen met de juiste route.",
      },
    ],
  },
  factoring: {
    slug: "factoring",
    label: "Factoring",
    leadPurpose: "factoring",
    defaultAmountEUR: 50000,
    heroTitleTemplate: (sectorName) => `Factoring voor ${sectorName}`,
    heroSubtitleTemplate: () => `Maak sneller geld vrij uit openstaande facturen en verbeter je cashflow.`,
    directAnswerTitleTemplate: () => `Factoring: wanneer past het?`,
    directAnswerTemplate: () =>
      `Factoring helpt om sneller betaald te krijgen door facturen (deels) voor te financieren. Het is vaak interessant bij langere betaaltermijnen of snelle groei.`,
    bullets: [
      { label: "Gebruik", value: "Facturen sneller uitbetaald" },
      { label: "Doel", value: "Cashflow versnellen" },
      { label: "Geschikt", value: "Lange betaaltermijnen" },
    ],
    faqs: [
      {
        question: "Wat is factoring in het kort?",
        answer:
          "Bij factoring krijg je eerder geld voor je facturen, zodat je niet hoeft te wachten tot je klant betaalt.",
      },
      {
        question: "Is factoring alleen voor grotere bedrijven?",
        answer:
          "Nee. Ook mkb en snelgroeiende bedrijven gebruiken factoring, afhankelijk van factuurstroom en klanten.",
      },
    ],
  },
};

export const USE_CASE_SLUGS = Object.keys(USE_CASES) as UseCaseSlug[];

export function isUseCaseSlug(input: string): input is UseCaseSlug {
  return USE_CASE_SLUGS.includes(input as UseCaseSlug);
}

export function getUseCase(useCase: UseCaseSlug): UseCaseConfig {
  return USE_CASES[useCase];
}

export function buildLeadDrawerHref(params: {
  sector: string;
  useCase: UseCaseSlug;
  source?: string;
}): string {
  const cfg = getUseCase(params.useCase);
  const sp = new URLSearchParams();
  sp.set("drawer", "lead");
  sp.set("sector", params.sector);
  sp.set("purpose", cfg.leadPurpose);
  sp.set("amount", String(cfg.defaultAmountEUR));
  sp.set("source", params.source || "usecase_page");
  return `/?${sp.toString()}`;
}

export function buildUseCaseFaqs(params: {
  sectorSlug: string;
  sectorName: string;
  useCase: UseCaseSlug;
}): Array<{ question: string; answer: string }> {
  const cfg = getUseCase(params.useCase);
  const sectorLower = (params.sectorName || params.sectorSlug).toLowerCase();

  // Small sector-flavor additions to reduce templated similarity.
  const extrasByUseCase: Partial<Record<UseCaseSlug, Array<{ question: string; answer: string }>>> = {
    werkkapitaal: [
      {
        question: `Hoe bepaal ik hoeveel werkkapitaal ik nodig heb in ${sectorLower}?`,
        answer:
          "Kijk naar je betaaltermijnen, voorraad/inhuur en terugkerende kosten. Vaak helpt een cashflow-overzicht om pieken en gaten te zien.",
      },
    ],
    voorraad: [
      {
        question: `Hoe voorkom ik dat voorraad mijn cashflow blokkeert?`,
        answer:
          "Spreid inkoop, plan op omloopsnelheid en gebruik financiering voor piekmomenten zodat je ruimte houdt voor vaste lasten.",
      },
    ],
    machines: [
      {
        question: `Welke gegevens helpen bij financiering van machines?`,
        answer:
          "Meestal je plan, onderbouwing van de investering, en (waar mogelijk) recente cijfers. Je krijgt een voorstel met voorwaarden.",
      },
    ],
    inventaris: [
      {
        question: `Kan ik software en IT ook financieren?`,
        answer:
          "Ja, vaak wel. Denk aan IT, apparatuur en inrichting. De beste vorm hangt af van je situatie en de investering.",
      },
    ],
    uitbreiding: [
      {
        question: `Hoe financier ik groei zonder te hard vooruit te lopen?`,
        answer:
          "Werk met realistische omzetscenario’s, reserveer buffer en kies een aflossing die past bij het moment waarop de groei cash oplevert.",
      },
    ],
    overname: [
      {
        question: "Welke documenten zijn belangrijk bij overnamefinanciering?",
        answer:
          "In de praktijk helpen o.a. jaarcijfers, prognoses en een onderbouwing van de koopprijs. Een financieringsmix kan het haalbaarder maken.",
      },
    ],
    herfinanciering: [
      {
        question: "Kan herfinanciering mijn maandlasten verlagen?",
        answer:
          "Soms wel, afhankelijk van rente/looptijd/voorwaarden. Het doel is vaak meer overzicht en cashflow-ruimte.",
      },
    ],
    factoring: [
      {
        question: "Wanneer is factoring beter dan werkkapitaal?",
        answer:
          "Als je vooral last hebt van lange betaaltermijnen en veel openstaande facturen, kan factoring direct cashflow versnellen.",
      },
    ],
  };

  return [
    // Use-case base FAQs first…
    ...cfg.faqs,
    // …then sector-flavor extras…
    ...(extrasByUseCase[params.useCase] || []),
    // …and a stable close-out CTA question.
    {
      question: `Hoe start ik een aanvraag voor ${cfg.label} in ${sectorLower}?`,
      answer:
        "Start je aanvraag via het formulier. Je krijgt een transparant voorstel en kiest wat het beste bij je situatie past.",
    },
  ].slice(0, 7);
}

export type ComparisonCard = {
  title: string;
  body: string;
  href: string;
};

/**
 * Small "comparison mini-block" cards to improve intent matching and internal linking.
 * These are intentionally short to avoid thin, repetitive content.
 */
export function buildComparisonCards(params: {
  useCase: UseCaseSlug;
  sector?: string;
  sectorName?: string;
}): ComparisonCard[] {
  const sectorName = params.sectorName || (params.sector ? params.sector : "mkb");
  const sectorLower = String(sectorName).toLowerCase();

  const related: Partial<Record<UseCaseSlug, UseCaseSlug[]>> = {
    werkkapitaal: ["factoring", "voorraad"],
    factoring: ["werkkapitaal", "herfinanciering"],
    voorraad: ["werkkapitaal", "uitbreiding"],
    machines: ["inventaris", "werkkapitaal"],
    inventaris: ["machines", "werkkapitaal"],
    uitbreiding: ["werkkapitaal", "overname"],
    overname: ["uitbreiding", "herfinanciering"],
    herfinanciering: ["werkkapitaal", "factoring"],
  };

  const others = related[params.useCase] || ["werkkapitaal", "factoring"];
  const base = getUseCase(params.useCase);

  const mkHref = (slug: UseCaseSlug) =>
    params.sector ? `/sectoren/${params.sector}/${slug}` : `/financiering/${slug}`;

  const cards: ComparisonCard[] = others.slice(0, 2).map((slug) => {
    const other = getUseCase(slug);
    return {
      title: `${base.label} vs ${other.label}`,
      body: `Twijfel je tussen ${base.label.toLowerCase()} en ${other.label.toLowerCase()} in ${sectorLower}? Het verschil zit meestal in doel (cashflow vs asset/factuur) en hoe snel je geld vrijmaakt.`,
      href: mkHref(slug),
    };
  });

  // Add one "next best page" that is more action-oriented.
  const lastSlug = others[0] || "werkkapitaal";
  const last = getUseCase(lastSlug);
  cards.push({
    title: `Lees ook: ${last.label}`,
    body: `Bekijk wanneer ${last.label.toLowerCase()} een betere match is voor ${sectorLower} ondernemers.`,
    href: mkHref(lastSlug),
  });

  return cards.slice(0, 3);
}

