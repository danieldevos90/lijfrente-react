# ⚡ ZapLening Logo Specificaties

## Logo Ontwerp

```
    ╭─────────╮
    │    ⚡    │     ZapLening
    │  ╱   ╲  │
    │ ╱  ⚡  ╲ │
    │╱       ╲│
    ╰─────────╯
```

### Visuele Beschrijving
- **Vorm:** Cirkel met gradient achtergrond
- **Icoon:** Lightning bolt (bliksem) in wit
- **Kleuren:** Emerald green gradient (#10b981 → #059669)
- **Stijl:** Modern, minimal, schoon

## Technische Specificaties

### SVG Code
```svg
<svg width="40" height="40" viewBox="0 0 40 40">
  <!-- Gradient definitie -->
  <linearGradient id="logoGradient">
    <stop offset="0%" stop-color="#10b981" />
    <stop offset="100%" stop-color="#059669" />
  </linearGradient>
  
  <!-- Cirkel -->
  <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
  
  <!-- Lightning bolt -->
  <path d="M22 10L14 21H20L18 30L26 19H20L22 10Z" fill="white" />
</svg>
```

### Formaten

**Klein (32px)**
```tsx
<Logo size={32} showText={true} />  // Voor drawer header
```

**Medium (40px)** - Default
```tsx
<Logo size={40} showText={true} />  // Voor navigatie
```

**Groot (64px)**
```tsx
<Logo size={64} showText={true} />  // Voor hero section
```

**Icon Only**
```tsx
<Logo size={32} showText={false} /> // Voor favicon
```

## Kleurspecificaties

### Gradient
- **Start:** #10b981 (Emerald-500)
- **Eind:** #059669 (Emerald-600)
- **Richting:** Top-left naar bottom-right (45°)

### Shadow
```css
filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
```

## Typografie (bij logo)

### Font
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...
```

### Stijl
- **Weight:** 700 (Bold)
- **Size:** 60% van icon size
- **Letter-spacing:** -0.02em (tight)
- **Color:** var(--color-text) (#111827)

## Gebruik Voorbeelden

### 1. Homepage Hero
```tsx
<Logo size={64} showText={true} />
```
Groot, met tekst, als hoofdelement

### 2. Drawer Header
```tsx
<Logo size={32} showText={true} />
```
Compact, met tekst, als branding

### 3. Navigation (Toekomstig)
```tsx
<Logo size={40} showText={true} />
```
Standard size voor header

### 4. Favicon
```tsx
<Logo size={32} showText={false} />
```
Alleen icoon voor kleine weergave

## Export Formats (Toekomstig)

### Voor Web
- [x] SVG component (Logo.tsx) ✅
- [ ] favicon.ico (32x32, 16x16)
- [ ] apple-touch-icon.png (180x180)
- [ ] og-image.png (1200x630)

### Voor Print
- [ ] PDF vector format
- [ ] PNG @2x (high res)

## Minimum Sizes

**Niet kleiner dan:**
- Icon only: 16px
- Icon + text: 24px

**Aanbevolen minimum:**
- Icon only: 24px
- Icon + text: 32px

## Clear Space

Rondom logo minstens 50% van de hoogte als clear space:
```
        ⬜⬜⬜⬜⬜
        ⬜[LOGO]⬜
        ⬜⬜⬜⬜⬜
```

## Do's ✅

- ✅ Gebruik op witte of lichte achtergrond
- ✅ Behoud gradient richting
- ✅ Gebruik shadow voor depth
- ✅ Schaal proportioneel

## Don'ts ❌

- ❌ Niet distorteren (width ≠ height)
- ❌ Niet andere kleuren gebruiken
- ❌ Niet roteren
- ❌ Niet outline toevoegen
- ❌ Niet gradient verwijderen

## Alternatieve Versies (Toekomstig)

### Dark Mode
```tsx
// Wit icoon met donkere cirkel
<Logo size={40} variant="dark" />
```

### Monochrome
```tsx
// Grijstinten versie
<Logo size={40} variant="mono" />
```

## Brand Associaties

**Symboliek:**
- ⚡ **Bliksem:** Snelheid, energie, directheid
- 🔵 **Cirkel:** Volledigheid, betrouwbaarheid, continuïteit
- 💚 **Groen:** Groei, geld, succes, vertrouwen

**Emotie:**
- Energiek maar professioneel
- Modern maar toegankelijk
- Krachtig maar vriendelijk

## Implementatie

Zie `frontend/components/Logo.tsx` voor de volledige React component.

---

**Versie:** 1.0  
**Datum:** November 2025  
**Status:** ✅ Productie-klaar

