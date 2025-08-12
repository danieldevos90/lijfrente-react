### Website‑setup (Next.js + Tailwind + Markdown)

Stack
- Next.js (App Router), TypeScript, Tailwind CSS, MDX voor content
- Hosting op Vercel (of Netlify). Analytics: GA4 + PostHog

Project aanmaken
```bash
npx create-next-app@latest newco-site --ts --eslint --src-dir --app --tailwind --use-npm --no-experimental-app
cd newco-site
```

Tailwind met PostCSS
```bash
npm i -D @tailwindcss/postcss postcss autoprefixer
```
Werk `postcss.config.js` bij:
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

Contentstructuur
- `app/(marketing)/` home, producten, prijzen, contact
- `content/` MDX‑hubs: rente, calculators, psd2, factoring, geschiktheid, sectors/*, support/*, compliance/*
- `components/` UI: `Hero.tsx`, `Calculator.tsx`, `RateTable.tsx`, `Testimonial.tsx`, `CTA.tsx`

Essentiële pagina’s
- Home: value props, calculator, testimonials, trust badges
- Product: Kredietlijn, Termijnlening, Factoring (met tarieftabel + FAQs)
- Hubs: Rente, Calculators, PSD2, Geschiktheid, Sectoren, Support, Compliance

Omgeving & tools
- Formulieren: Resend/Formspark; DB: Supabase (publieke content), geen PII
- PSD2 sandbox: Nordigen/GoCardless test

Commando’s
```bash
npm run dev
npm run build
npm run lint
```

QA‑checklist
- CLS < 0.1, LCP < 2.5s, a11y contrast, toetsenbord‑nav, meta/schema aanwezig.
