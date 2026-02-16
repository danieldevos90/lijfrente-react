import type { Metadata } from "next";
import HeaderWithWidget from "../../HeaderWithWidget";
import Footer from "../../../components/Footer";
import SubpageHero from "../../../components/SubpageHero";
import CTASection from "../../../components/sections/CTASection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { partner: string } }): Promise<Metadata> {
  const partner = params.partner;
  return {
    title: `Aanvraag via partner | GeldGeregeld`,
    description: `Start je aanvraag via partner: ${partner}. Binnen 24 uur duidelijkheid.`,
    robots: {
      // Partner pages are usually for tracking/attribution, not SEO.
      index: false,
      follow: false,
    },
  };
}

export default function PartnerLandingPage({ params }: { params: { partner: string } }) {
  const partner = params.partner;
  const leadHref = `/lead?source=partner&partner=${encodeURIComponent(partner)}`;

  return (
    <>
      <HeaderWithWidget />
      <main>
        <SubpageHero
          title="Aanvraag via partner"
          subtitle="Je start je aanvraag in 2 minuten. We nemen doorgaans binnen 24 uur contact op met een transparant voorstel."
          iconPath="/icons/SVG/interface/grid.svg"
          backgroundColor="var(--color-bg)"
        />

        <section style={{ background: "var(--color-bg)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "1.5rem" }}>
              <h2 style={{ marginTop: 0 }}>Partner: {partner}</h2>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                Deze pagina is bedoeld om aanvragen via partners goed te kunnen volgen. Je gegevens worden veilig verwerkt.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <a className="btn btn-primary" href={leadHref}>
                  Start aanvraag
                </a>
                <a className="btn btn-secondary" href="/sectoren">
                  Bekijk sectoren
                </a>
              </div>
            </div>
          </div>
        </section>

        <CTASection
          title="Klaar om te beginnen?"
          subtitle="Start je aanvraag en ontvang snel duidelijkheid met transparante voorwaarden."
          ctaLabel="Start aanvraag"
          ctaHref={leadHref}
          background="dark"
          trustBullets={["Binnen 24 uur duidelijkheid", "Transparante voorwaarden", "Flexibel aflossen"]}
          trackingLocation={`partner_cta_${partner}`}
        />
      </main>
      <Footer />
    </>
  );
}

