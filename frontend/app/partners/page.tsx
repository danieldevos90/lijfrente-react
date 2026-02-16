import type { Metadata } from "next";
import HeaderWithWidget from "../HeaderWithWidget";
import Footer from "../../components/Footer";
import SubpageHero from "../../components/SubpageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partners | GeldGeregeld",
  description: "Partner landings voor tracking en lead attributie.",
  robots: { index: false, follow: false },
};

export default function PartnersIndexPage() {
  return (
    <>
      <HeaderWithWidget />
      <main>
        <SubpageHero
          title="Partners"
          subtitle="Interne landings voor partner tracking. Gebruik /p/{partner} als korte link."
          iconPath="/icons/SVG/interface/grid.svg"
          backgroundColor="var(--color-bg)"
        />
        <section style={{ background: "var(--color-bg)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "1.5rem" }}>
              <h2 style={{ marginTop: 0 }}>Korte partner link</h2>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                Voorbeeld: <code>/p/boekhouder-jansen</code> leidt door naar een partner-landing en zet automatisch <code>partner</code> en{" "}
                <code>source</code> zodat je aanvragen kunt segmenteren.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

