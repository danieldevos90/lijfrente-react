import type { Metadata } from "next";
import HeaderWithWidget from "../../HeaderWithWidget";
import Footer from "../../../components/Footer";
import SubpageHero from "../../../components/SubpageHero";
import CTASection from "../../../components/sections/CTASection";
import WerkkapitaalCalculator from "../../../components/tools/WerkkapitaalCalculator";
import { buildCanonicalUrl, generateMetadata as generateSEOMetadata, getBaseUrl } from "@/lib/seo";
import { buildTitle, buildDescription } from "../../messaging";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = buildCanonicalUrl("/tools/werkkapitaal-calculator");
  const baseUrl = getBaseUrl();
  const meta = generateSEOMetadata({
    title: buildTitle("Werkkapitaal calculator - Indicatie in 1 minuut"),
    description: buildDescription(
      "Bereken in 1 minuut je werkkapitaalbehoefte op basis van kosten en betaaltermijnen. Mail jezelf de uitkomst en start direct je aanvraag (optioneel)."
    ),
    keywords: "werkkapitaal calculator, cashflow calculator, werkkapitaal berekenen, zakelijke financiering werkkapitaal",
    canonicalUrl,
    ogImage: `${baseUrl}/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg`,
    ogType: "website",
  });
  // Hide for now (noindex): tool is for lead-gen experiments, not SEO.
  meta.robots = { index: false, follow: false };
  return meta;
}

export default function WerkkapitaalCalculatorPage() {
  return (
    <>
      <HeaderWithWidget />
      <main>
        <SubpageHero
          title="Werkkapitaal calculator"
          subtitle="Snelle indicatie op basis van kosten en betaaltermijnen. Geen gedoe, direct een bedrag."
          iconPath="/icons/SVG/finance/wallet.svg"
          backgroundColor="var(--color-bg)"
        />

        <section style={{ background: "var(--color-bg)", padding: "5rem 2rem" }}>
          <WerkkapitaalCalculator />
        </section>

        <CTASection
          title="Wil je exact weten wat er mogelijk is?"
          subtitle="Start je aanvraag en ontvang snel een transparant voorstel dat past bij je cashflow."
          ctaLabel="Start aanvraag"
          ctaHref="/lead?source=tool_werkkapitaal_calculator"
          background="dark"
          trustBullets={["Binnen 24 uur duidelijkheid", "Transparante voorwaarden", "Flexibel aflossen"]}
          trackingLocation="tool_werkkapitaal_calculator_cta"
        />
      </main>
      <Footer />
    </>
  );
}

