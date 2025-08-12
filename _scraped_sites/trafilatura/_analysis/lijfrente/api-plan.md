### Lijfrente & Zakelijke financiering — API plan (NL)

- **Doel**: concurrentievoordeel door actuele marktrente, levensverwachting en bedrijfsdata via API’s; minimale frictie in intake via KvK + PSD2.

- **Rente/marktdata**
  - **EIOPA RFR (risk‑free curves EUR)**: maandelijkse rentetermijnstructuur voor discontering van lijfrente‑uitkeringen.
    - Bron: `https://www.eiopa.europa.eu/tools-and-data/risk-free-interest-rate-term-structures_en`
  - **ECB SDW REST**: swap/sovereign yields (dagelijks) voor indicatieve rente en gevoeligheid.
    - Voorbeeld: `https://sdw-wsrest.ecb.europa.eu/service/data/YC/B.U2.EUR.4F.G_N_A.SV_C_YM.SR_5Y.A?format=csvdata`
  - **DNB/StatLine**: NL rentes, inflatie (CPI), referentie rekenrente.
    - OData CBS: `https://opendata.cbs.nl/ODataApi/odata/`

- **Sterftetafels / levensverwachting**
  - **CBS StatLine overlevingstafels**: leeftijdsspecifieke overlevingskansen per geslacht.
    - OData voorbeeld: `https://opendata.cbs.nl/ODataApi/odata/37450ned`
  - (Optioneel) **AG‑tafels** (licentie) voor actuariële precisie.

- **Vergunning / vertrouwen**
  - **AFM register**: controleer vergunning (bemiddelen/adviseren lijfrente/levensverzekeringen). Publiceer link op de site.

- **Bedrijfsgegevens & verificatie**
  - **KvK Handelsregister API** (betaald): zoek op naam/KvK; adres, SBI, rechtspersoon.
  - **VIES (EU btw‑nummer)**: validatie btw‑nummer (`https://ec.europa.eu/taxation_customs/vies/`).
  - **IBAN‑Naam Check (SurePay/CM.com)**: optioneel betaald; validatie begunstigde.

- **PSD2/Bankdata (vervang upload bankafschriften)**
  - **Tink / Yapily / TrueLayer / GoCardless (ex‑Nordigen)**: consent‑based bankkoppeling; transacties + saldo (6–12 mnd) voor cashflow‑score.
    - Scopes: accounts, balances, transactions; NL banken coverage check.

- **SERP/SEO (lijfrente focus)**
  - Bright Data SERP: monitor queries ‘lijfrente uitkeren/berekenen/rente’. Bewaar top‑10 + featured snippets.

- **Offerte‑engine (indicatief)**
  - Inputs: EIOPA/ECB curve + CBS overlevingstafels; fiscale tabellen (Belastingdienst, Box 1).
  - Output: brutopayout/maand, geschat netto, scenario’s per leeftijd/duur, gevoeligheid bij ±50 bps.

- **Beveiliging & AVG**
  - Minimal data collection, expliciete toestemming; PSD2 tokens; Data Retention ≤ 90 dagen voor afgewezen offertes.


