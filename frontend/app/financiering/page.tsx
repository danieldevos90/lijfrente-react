import type { Metadata } from "next";
import Link from "next/link";

import HeaderWithWidget from "../HeaderWithWidget";
import Footer from "../../components/Footer";
import SubpageHero from "../../components/SubpageHero";
import CTASection from "../../components/sections/CTASection";

import { buildTitle, buildDescription } from "../messaging";
import { buildCanonicalUrl, generateBreadcrumbSchema, generateMetadata as generateSEOMetadata, getBaseUrl } from "@/lib/seo";
import { USE_CASE_SLUGS, getUseCase } from "@/lib/use-cases";

export const revalidate = 3600;

export default async function FinancieringHubPage() {
  const baseUrl = getBaseUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Financiering", url: buildCanonicalUrl("/financiering") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema, null, 2) }}
      />
      <HeaderWithWidget />
      <main>
        <SubpageHero
          title="Zakelijke financiering per doel"
          subtitle="Kies waar je financiering voor nodig is. Per doel geven we een kort antwoord, veelgestelde vragen en een snelle start naar je aanvraag."
          iconPath="/icons/SVG/finance/wallet.svg"
          backgroundColor="var(--color-bg)"
        />

        <section style={{ background: "var(--color-bg)", padding: "6rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {USE_CASE_SLUGS.map((slug) => {
                const cfg = getUseCase(slug);
                return (
                  <Link
                    key={slug}
                    href={`/financiering/${slug}`}
                    style={{
                      display: "block",
                      padding: "1.5rem",
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    className="financing-goal-card"
                  >
                    <h2 style={{ margin: 0, fontSize: "1.35rem" }}>{cfg.label}</h2>
                    <p style={{ margin: "0.75rem 0 0", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                      {cfg.directAnswerTemplate("mkb")}
                    </p>
                    <div style={{ marginTop: "1rem", color: "var(--color-primary)", fontWeight: 600 }}>
                      Bekijk {cfg.label.toLowerCase()} →
                    </div>
                  </Link>
                );
              })}
            </div>

            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .financing-goal-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.08);
                    border-color: var(--color-primary);
                  }
                `,
              }}
            />
          </div>
        </section>

        <CTASection
          title="Snel weten wat mogelijk is?"
          subtitle="Start je aanvraag en ontvang snel duidelijkheid met transparante voorwaarden."
          ctaLabel="Start je aanvraag"
          ctaHref="/lead?source=financiering_hub"
          background="dark"
          trustBullets={["Binnen 24 uur duidelijkheid", "Transparante voorwaarden", "Flexibel aflossen"]}
          trackingLocation="financiering_hub_cta"
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: buildTitle("Zakelijke financiering per doel - Snel geregeld"),
    description: buildDescription(
      "Kies waarvoor je zakelijke financiering nodig is: werkkapitaal, voorraad, machines, inventaris, uitbreiding, overname, herfinanciering of factoring. Per doel: kort antwoord + FAQ."
    ),
    keywords: "zakelijke financiering, werkkapitaal, voorraad financieren, machines financieren, factoring, herfinanciering",
    canonicalUrl: buildCanonicalUrl("/financiering"),
    ogType: "website",
  });
}

