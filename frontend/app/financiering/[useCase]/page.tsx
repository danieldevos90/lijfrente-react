import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import HeaderWithWidget from "../../HeaderWithWidget";
import Footer from "../../../components/Footer";
import SubpageHero from "../../../components/SubpageHero";
import DirectAnswerSection from "../../../components/sections/DirectAnswerSection";
import FAQSection from "../../../components/sections/FAQSection";
import CTASection from "../../../components/sections/CTASection";

import { buildTitle, buildDescription } from "../../messaging";
import {
  buildCanonicalUrl,
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateMetadata as generateSEOMetadata,
  getBaseUrl,
} from "@/lib/seo";
import { SECTOR_INFO, SECTOR_SLUGS } from "@/lib/sectors";
import { USE_CASE_SLUGS, buildComparisonCards, getUseCase, isUseCaseSlug } from "@/lib/use-cases";

export const revalidate = 3600;

export async function generateStaticParams() {
  return USE_CASE_SLUGS.map((useCase) => ({ useCase }));
}

function buildGenericUseCaseFaqs(useCaseSlug: string): Array<{ question: string; answer: string }> {
  const cfg = getUseCase(useCaseSlug as any);
  return [
    ...cfg.faqs,
    {
      question: `Voor welke sectoren is ${cfg.label.toLowerCase()} interessant?`,
      answer:
        "Voor bijna alle sectoren. De beste voorwaarden hangen af van je cashflow, doel en bedrag. Kies je sector voor een pagina met sector-specifieke context.",
    },
    {
      question: "Hoe snel heb ik duidelijkheid na mijn aanvraag?",
      answer:
        "Je start online een aanvraag en krijgt doorgaans snel duidelijkheid. Je ziet altijd eerst een voorstel met voorwaarden voordat je beslist.",
    },
  ].slice(0, 7);
}

export async function generateMetadata({
  params,
}: {
  params: { useCase: string };
}): Promise<Metadata> {
  const useCaseRaw = params.useCase;
  if (!isUseCaseSlug(useCaseRaw)) return notFound();

  const cfg = getUseCase(useCaseRaw);
  const canonicalUrl = buildCanonicalUrl(`/financiering/${cfg.slug}`);

  const seoTitle = `${cfg.label} financiering - Binnen 24 uur geregeld`;
  const description = `Alles over ${cfg.label.toLowerCase()} voor ondernemers: wanneer het slim is, veelgestelde vragen en een snelle start naar je aanvraag.`;

  return generateSEOMetadata({
    title: buildTitle(seoTitle),
    description: buildDescription(description),
    keywords: `zakelijke financiering, ${cfg.label.toLowerCase()}, ${cfg.slug} financiering`,
    canonicalUrl,
    ogType: "website",
  });
}

export default async function UseCaseLandingPage({ params }: { params: { useCase: string } }) {
  const useCaseRaw = params.useCase;
  if (!isUseCaseSlug(useCaseRaw)) return notFound();

  const cfg = getUseCase(useCaseRaw);
  const baseUrl = getBaseUrl();
  const canonicalUrl = buildCanonicalUrl(`/financiering/${cfg.slug}`);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Financiering", url: buildCanonicalUrl("/financiering") },
    { name: cfg.label, url: canonicalUrl },
  ]);

  const faqs = buildGenericUseCaseFaqs(cfg.slug);
  const faqSchema = generateFAQPageSchema(faqs);
  const comparisons = buildComparisonCards({ useCase: cfg.slug, sectorName: "mkb" });

  const leadHref = `/lead?source=financiering_usecase&purpose=${encodeURIComponent(cfg.leadPurpose)}&amount=${encodeURIComponent(
    String(cfg.defaultAmountEUR)
  )}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema, null, 2) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }} />

      <HeaderWithWidget />
      <main>
        <SubpageHero
          title={`${cfg.label} financiering`}
          subtitle="Korte uitleg, FAQ en sectorpagina's om snel te kiezen wat bij je past."
          backgroundColor="var(--color-bg)"
          iconPath="/icons/SVG/finance/wallet.svg"
        />

        <DirectAnswerSection
          title={cfg.directAnswerTitleTemplate("mkb")}
          answer={cfg.directAnswerTemplate("mkb")}
          bullets={cfg.bullets}
          primaryHref={leadHref}
          secondaryHref={buildCanonicalUrl("/financiering")}
        />

        <section style={{ background: "var(--color-bg)", padding: "6rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>Kies je sector</h2>
            <p style={{ margin: "1rem 0 0", color: "var(--color-text-muted)", maxWidth: "80ch", lineHeight: 1.7 }}>
              Sectorpagina&apos;s combineren dit doel met sector-specifieke context (voorbeelden, FAQ, interne links).
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              {SECTOR_SLUGS.map((sector) => {
                const info = SECTOR_INFO[sector];
                return (
                  <Link
                    key={sector}
                    href={`/sectoren/${sector}/${cfg.slug}`}
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
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{info?.name || sector}</h3>
                    <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                      {info?.description || `Bekijk ${cfg.label.toLowerCase()} voor ${sector}.`}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {comparisons.length > 0 && (
          <section style={{ background: "var(--color-bg-slate)", padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <h2 style={{ marginTop: 0, fontSize: "2rem" }}>Vergelijk alternatieven</h2>
              <p style={{ margin: "1rem 0 0", color: "var(--color-text-muted)", maxWidth: "80ch", lineHeight: 1.7 }}>
                Niet zeker wat het beste past? Deze pagina&apos;s helpen je snel vergelijken.
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
                  <Link
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
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection
          title={`Klaar om te starten met ${cfg.label.toLowerCase()}?`}
          subtitle="Start je aanvraag en ontvang snel duidelijkheid met transparante voorwaarden."
          ctaLabel="Start je aanvraag"
          ctaHref={leadHref}
          background="dark"
          trustBullets={["Binnen 24 uur duidelijkheid", "Transparante voorwaarden", "Flexibel aflossen"]}
          trackingLocation={`financiering_usecase_cta_${cfg.slug}`}
        />

        <FAQSection
          title={`Veelgestelde vragen over ${cfg.label.toLowerCase()}`}
          subtitle="Korte antwoorden op vragen die ondernemers meestal als eerste stellen."
          faqs={faqs}
          backgroundColor="var(--color-bg)"
        />

        <section style={{ background: "var(--color-bg-slate)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginTop: 0, fontSize: "2rem" }}>Gerelateerde doelen</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              {USE_CASE_SLUGS.filter((s) => s !== cfg.slug)
                .slice(0, 6)
                .map((slug) => {
                  const other = getUseCase(slug);
                  return (
                    <Link
                      key={slug}
                      href={`/financiering/${slug}`}
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
                      <h3 style={{ margin: 0 }}>{other.label}</h3>
                      <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)" }}>
                        {other.directAnswerTemplate("mkb")}
                      </p>
                    </Link>
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

