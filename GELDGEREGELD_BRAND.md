# ✅ GeldGeregeld - Complete Brand Identity

## 🎯 Projectnaam: **GeldGeregeld**

**Domain:** geldgeregeld.nl  
**Tagline:** "Zakelijke financiering snel geregeld"

---

## 🎨 Waarom GeldGeregeld?

| Aspect | Voordeel |
|--------|----------|
| **Duidelijk** | Direct te begrijpen - "Geld Geregeld" |
| **Professioneel** | Serieus en betrouwbaar |
| **Domain-ready** | Perfect als .nl domeinnaam |
| **SEO-vriendelijk** | Zoekwoorden in naam |
| **Memorabel** | Makkelijk te onthouden |
| **Nederlands** | Past bij doelgroep |

---

## 🎨 Brand Identity

### Logo
- **Icoon:** Lightning bolt (⚡) in cirkel
- **Kleuren:** Emerald green gradient (#10b981 → #059669)
- **Symboliek:** Snel, efficiënt, betrouwbaar

### Kleurenpalet
```css
Primary:     #10b981 (Emerald Green)
Primary Dark: #059669
Secondary:   #06b6d4 (Cyan)
```

### Taglines
- "Zakelijke financiering snel geregeld"
- "Binnen 24 uur duidelijkheid"
- "Simpel, snel en transparant"

---

## 📋 Implementatie Status

### Code Updates ✅
- [x] Logo component: "GeldGeregeld"
- [x] Page titles en metadata
- [x] CSS classes updated
- [x] Theme comments updated
- [x] Homepage headline

### Te Doen (Door Gebruiker)
- [ ] **Lokale folder** hernoemen: `lijfrente-react` → `geldgeregeld`
- [ ] **GitHub** repository hernoemen
- [ ] **Vercel** domain configureren: `geldgeregeld.nl`
- [ ] **DNS** instellen bij domain registrar
- [ ] **Environment variables** updaten in Vercel

Zie `RENAME_TO_GELDGEREGELD.md` voor stap-voor-stap instructies.

---

## 🌐 URLs na Deployment

| Type | URL |
|------|-----|
| **Production** | https://geldgeregeld.nl |
| **WWW** | https://www.geldgeregeld.nl |
| **Vercel Preview** | https://geldgeregeld.vercel.app |
| **GitHub** | https://github.com/YOUR_USERNAME/geldgeregeld |

---

## 🎨 Design System

Volledig design system met:
- **18 kleuren** (primary, secondary, neutrals)
- **7 spacing levels** (xs → 3xl)
- **5 border radius** (sm → full)
- **6 shadow levels** (sm → 2xl)
- **Typography** system
- **Transitions** & animations

Zie `frontend/theme.ts` en `frontend/app/tokens.css`

---

## 📱 Component Overzicht

### Logo Component
```tsx
import Logo from './components/Logo';

<Logo size={64} showText={true} />  // Homepage
<Logo size={32} showText={true} />  // Drawer
<Logo size={40} showText={false} /> // Icon only
```

### Kleuren Gebruik
Alles consistent emerald green:
- ✅ Logo gradient
- ✅ Buttons gradient
- ✅ Progress bars
- ✅ Focus states
- ✅ Accents

---

## 🚀 Deployment Checklist

### 1. Lokaal Hernoemen
```bash
cd "/Users/danieldevos/Documents/ALT F AWESOME"
mv "lijfrente-react" "geldgeregeld"
cd geldgeregeld
```

### 2. GitHub Hernoemen
- Ga naar Repository → Settings
- Hernoem naar: `geldgeregeld`
- Update git remote URL

### 3. Vercel Setup
- Add domain: `geldgeregeld.nl`
- Configure DNS at registrar
- Update environment variables:
  ```
  NEXT_PUBLIC_SITE_NAME=GeldGeregeld
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN=geldgeregeld.nl
  ```

### 4. DNS Configuratie
```
A Record:    @ → 76.76.21.21
CNAME:       www → cname.vercel-dns.com
```

### 5. Deploy
```bash
git add .
git commit -m "Rebrand to GeldGeregeld"
git push origin main
```

---

## 📚 Documentatie Bestanden

1. **`RENAME_TO_GELDGEREGELD.md`** - Hernoem instructies
2. **`frontend/theme.ts`** - Theme configuratie
3. **`frontend/app/tokens.css`** - CSS custom properties
4. **`GELDGEREGELD_BRAND.md`** - Deze file

---

## 🎯 Brand Messaging

### Kernboodschappen
1. **Snel:** Binnen 24 uur reactie
2. **Simpel:** Eenvoudig aanvraagproces (3 stappen)
3. **Transparant:** Geen verborgen kosten
4. **Betrouwbaar:** Professionele service

### Tone of Voice
- Direct en duidelijk
- Professioneel maar toegankelijk
- "U" vorm (formeel maar vriendelijk)
- Focus op resultaat en snelheid

### Key Features
- ⚡ Binnen 24 uur reactie
- ✓ Transparante voorwaarden
- 🔒 Veilig en vertrouwd
- 💼 Voor elke ondernemer (ZZP tot MKB)

---

## 🎨 Visual Identity

### Typografie
- **Font:** System fonts (Apple System, Segoe UI, Roboto)
- **Headings:** Bold (700)
- **Body:** Regular (400) en Medium (500)
- **Sizes:** 16px base, 48px hero headings

### Spacing
- Consistent gebruik van design tokens
- 8px grid system (0.5rem base)

### Border Radius
- Buttons/inputs: 6px
- Cards: 12px
- Logo circle: Volledig rond

### Shadows
- Subtle: Voor borders en cards
- Medium: Voor elevated elements
- Large: Voor drawer en modals

---

## 📊 SEO & Marketing

### Meta Tags
```html
<title>GeldGeregeld - Zakelijke Financiering</title>
<meta name="description" content="Snel en simpel zakelijke financiering regelen – binnen 24 uur reactie en transparante voorwaarden" />
```

### Keywords
- Zakelijke financiering
- Zakelijke lening
- Bedrijfsfinanciering
- MKB financiering
- ZZP lening
- Snel geld regelen

### Domain Voordelen
- **geldgeregeld.nl** bevat keywords
- .nl extension (vertrouwd in Nederland)
- Kort en memorabel

---

## ✅ Status

**Code:** ✅ Volledig bijgewerkt  
**Logo:** ✅ "GeldGeregeld" met lightning bolt  
**Kleuren:** ✅ Consistent emerald green  
**Theme:** ✅ Volledig design system  
**Docs:** ✅ Complete instructies  

**Volgende stap:** Gebruiker moet folder/GitHub/Vercel hernoemen

---

**Laatste Update:** November 2025  
**Versie:** 1.0  
**Status:** ✅ Productie-klaar

