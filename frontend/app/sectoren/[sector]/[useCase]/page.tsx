import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HeaderWithWidget from "../../../HeaderWithWidget";
import Footer from "../../../../components/Footer";
import SubpageHero from "../../../../components/SubpageHero";
import DirectAnswerSection from "../../../../components/sections/DirectAnswerSection";
import FAQSection from "../../../../components/sections/FAQSection";
import CTASection from "../../../../components/sections/CTASection";

import { buildTitle, buildDescription } from "../../../messaging";
import {
  buildCanonicalUrl,
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateMetadata as generateSEOMetadata,
  getBaseUrl,
} from "@/lib/seo";
import { SECTOR_INFO, SECTOR_SLUGS } from "@/lib/sectors";
import {
  USE_CASE_SLUGS,
  buildComparisonCards,
  buildLeadDrawerHref,
  buildUseCaseFaqs,
  getUseCase,
  isUseCaseSlug,
} from "@/lib/use-cases";

export const revalidate = 3600;

function getSectorIcon(sector: string): string {
  const iconMap: Record<string, string> = {
    horeca: "/icons/SVG/food/cutlery.svg",
    retail: "/icons/SVG/e-commerce/shop.svg",
    transport: "/icons/SVG/e-commerce/truck.svg",
    bouw: "/icons/SVG/interface/home.svg",
    ecommerce: "/icons/SVG/e-commerce/shopping-cart.svg",
    zorg: "/icons/SVG/health/stethoscope.svg",
    consultants: "/icons/SVG/interface/bulb.svg",
    schoonmaak: "/icons/SVG/interface/magic-wand.svg",
    automotive: "/icons/SVG/e-commerce/truck.svg",
    productie: "/icons/SVG/e-commerce/factory.svg",
    zzp: "/icons/SVG/interface/user.svg",
    starters: "/icons/SVG/interface/rocket.svg",
    franchise: "/icons/SVG/interface/grid.svg",
    medisch: "/icons/SVG/health/stethoscope.svg",
    tandarts: "/icons/SVG/health/stethoscope.svg",
    groothandel: "/icons/SVG/e-commerce/shop.svg",
    schoonheid: "/icons/SVG/interface/magic-wand.svg",
    kasstroom: "/icons/SVG/finance/wallet.svg",
  };
  return iconMap[sector] || "/icons/SVG/finance/wallet.svg";
}

export async function generateStaticParams() {
  // Full matrix: 18 sectors x all use-cases.
  return SECTOR_SLUGS.flatMap((sector) => USE_CASE_SLUGS.map((useCase) => ({ sector, useCase })));
}

export async function generateMetadata({
  params,
}: {
  params: { sector: string; useCase: string };
}): Promise<Metadata> {
  const sector = params.sector;
  const useCaseRaw = params.useCase;
  const sectorInfo = SECTOR_INFO[sector];
  if (!sectorInfo) return notFound();
  if (!isUseCaseSlug(useCaseRaw)) return notFound();

  const useCase = getUseCase(useCaseRaw);
  const sectorName = sectorInfo.name;
  const canonicalUrl = buildCanonicalUrl(`/sectoren/${sector}/${useCase.slug}`);

  const seoTitle = `${useCase.label} ${sectorName} - Binnen 24 uur geregeld`;
  const description = `${useCase.label} voor ${sectorName}. Snel inzicht, transparante voorwaarden en een oplossing die past bij je cashflow.`;
  const keywords = [
    ...sectorInfo.keywords.slice(0, 4),
    `${useCase.label.toLowerCase()} ${sectorName.toLowerCase()}`,
    `zakelijke financiering ${useCase.label.toLowerCase()}`,
  ].join(", ");

  return generateSEOMetadata({
    title: buildTitle(seoTitle),
    description: buildDescription(description),
    keywords,
    canonicalUrl,
    ogType: "website",
  });
}

export default async function SectorUseCasePage({
  params,
}: {
  params: { sector: string; useCase: string };
}) {
  const sector = params.sector;
  const useCaseRaw = params.useCase;

  const sectorInfo = SECTOR_INFO[sector];
  if (!sectorInfo) return notFound();
  if (!isUseCaseSlug(useCaseRaw)) return notFound();

  const useCase = getUseCase(useCaseRaw);
  const sectorName = sectorInfo.name;

  const baseUrl = getBaseUrl();
  const canonicalPath = `/sectoren/${sector}/${useCase.slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const leadHref = buildLeadDrawerHref({ sector, useCase: useCase.slug, source: "usecase_page" });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Sectoren", url: buildCanonicalUrl("/sectoren") },
    { name: sectorName, url: buildCanonicalUrl(`/sectoren/${sector}`) },
    { name: useCase.label, url: canonicalUrl },
  ]);

  const faqs = buildUseCaseFaqs({ sectorSlug: sector, sectorName, useCase: useCase.slug });
  const faqSchema = generateFAQPageSchema(faqs);

  const relatedUseCases = USE_CASE_SLUGS.filter((s) => s !== useCase.slug).slice(0, 6);
  const comparisons = buildComparisonCards({ useCase: useCase.slug, sector, sectorName });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />

      <HeaderWithWidget />
      <main>
        <SubpageHero
          title={useCase.heroTitleTemplate(sectorName)}
          subtitle={useCase.heroSubtitleTemplate(sectorName)}
          backgroundColor="var(--color-bg)"
          iconPath={getSectorIcon(sector)}
        />

        <DirectAnswerSection
          title={useCase.directAnswerTitleTemplate(sectorName)}
          answer={useCase.directAnswerTemplate(sectorName)}
          bullets={useCase.bullets}
          primaryHref={leadHref}
          secondaryHref={buildCanonicalUrl(`/sectoren/${sector}`)}
        />

        <section style={{ background: "var(--color-bg)", padding: "6rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "PP Neue Montreal, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                margin: 0,
                color: "var(--color-text)",
              }}
            >
              Waarvoor gebruiken {sectorName.toLowerCase()} ondernemers {useCase.label.toLowerCase()}?
            </h2>
            <p
              style={{
                marginTop: "1rem",
                maxWidth: "80ch",
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
                fontSize: "1.125rem",
              }}
            >
              Dit zijn veelvoorkomende situaties. Je krijgt altijd een voorstel dat past bij jouw situatie en cashflow.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              {[
                {
                  title: "Piekmomenten opvangen",
                  body: "Overbrug drukte of seizoenspieken zonder stress op je liquiditeit.",
                },
                {
                  title: "Investeren in groei",
                  body: "Versnel omzetgroei door eerder te investeren in capaciteit, voorraad of marketing.",
                },
                {
                  title: "Cashflow stabiliseren",
                  body: "Zorg dat je kosten en inkomsten beter op elkaar aansluiten.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: "var(--color-white)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{card.title}</h3>
                  <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {comparisons.length > 0 && (
          <section style={{ background: "var(--color-bg-slate)", padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <h2 style={{ marginTop: 0, fontSize: "2rem" }}>Vergelijk snel</h2>
              <p style={{ margin: "1rem 0 0", color: "var(--color-text-muted)", maxWidth: "80ch", lineHeight: 1.7 }}>
                Korte vergelijking om sneller de juiste route te kiezen (en direct door te klikken).
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                {comparisons.map((card) => (
                  <a
                    key={card.href + card.title}
                    href={card.href}
                    style={{
                      display: "block",
                      padding: "1.25rem",
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{card.title}</h3>
                    <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                      {card.body}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection
          title={`Klaar voor ${useCase.label.toLowerCase()} in ${sectorName}?`}
          subtitle="Start je aanvraag en ontvang snel duidelijkheid met transparante voorwaarden."
          ctaLabel="Start je aanvraag"
          ctaHref={leadHref}
          background="dark"
          trustBullets={["Binnen 24 uur duidelijkheid", "Transparante voorwaarden", "Flexibel aflossen"]}
          trackingLocation={`usecase_cta_${sector}_${useCase.slug}`}
        />

        <FAQSection
          title={`Veelgestelde vragen over ${useCase.label.toLowerCase()} in ${sectorName}`}
          subtitle="Korte antwoorden op vragen die ondernemers meestal als eerste stellen."
          faqs={faqs}
          backgroundColor="var(--color-bg)"
        />

        <section style={{ background: "var(--color-bg-slate)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginTop: 0, fontSize: "2rem" }}>Gerelateerde pagina&apos;s</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              <a
                href={`/sectoren/${sector}`}
                style={{
                  display: "block",
                  padding: "1.25rem",
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <h3 style={{ margin: 0 }}>Terug naar {sectorName}</h3>
                <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)" }}>
                  Bekijk alle informatie over financiering voor {sectorName.toLowerCase()} ondernemers.
                </p>
              </a>

              {relatedUseCases.map((slug) => {
                const cfg = getUseCase(slug);
                return (
                  <a
                    key={slug}
                    href={`/sectoren/${sector}/${slug}`}
                    style={{
                      display: "block",
                      padding: "1.25rem",
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{cfg.label}</h3>
                    <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)" }}>
                      {cfg.heroSubtitleTemplate(sectorName)}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

