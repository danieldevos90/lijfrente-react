# Partner kit (GeldGeregeld)

Doel: partner-verkeer en aanvragen goed kunnen meten via `partner` en `source`.

## Korte link

- Gebruik: `/p/{partnerSlug}`
- Voorbeeld: `/p/boekhouder-jansen`
- Resultaat: redirect naar `/partners/{partnerSlug}?partner={partnerSlug}&source=partner` (plus behoud van bestaande UTM parameters).

## Aanbevolen UTM set

Gebruik waar mogelijk:

- `utm_source=partner`
- `utm_medium=referral`
- `utm_campaign={partnerSlug}`

Voorbeeld:

`https://geldgeregeld.nl/p/boekhouder-jansen?utm_source=partner&utm_medium=referral&utm_campaign=boekhouder-jansen`

## Copy (email/nieuwsbrief)

Onderwerp:

- "Snel inzicht in zakelijke financiering (binnen 24 uur)"

Tekst:

- "Wil je als ondernemer snel weten wat er mogelijk is qua zakelijke financiering? Je start je aanvraag in 2 minuten en krijgt doorgaans binnen 24 uur duidelijkheid. Transparante voorwaarden, flexibel aflossen."

CTA:

- "Start aanvraag" → link hierboven

## Copy (website button)

- Button label: "Start aanvraag"
- Link: `https://geldgeregeld.nl/p/{partnerSlug}`

## Wat meten we

- Partner slug via `partner` (query param + attribution)
- Bron via `source=partner`
- UTM (indien meegegeven)

## Privacy

- De partner slug is niet-persoonlijk en wordt alleen gebruikt voor attributie.

