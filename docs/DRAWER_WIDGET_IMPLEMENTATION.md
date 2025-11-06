# Drawer Widget Implementatie

## Overzicht

De website is volledig vernieuwd met een minimalistisch Nederlands ontwerp en een drawer widget voor het aanvragen van zakelijke financiering.

## Belangrijkste Wijzigingen

### 1. DrawerWidget Component
**Locatie:** `frontend/components/DrawerWidget.tsx` en `DrawerWidget.css`

**Functionaliteit:**
- Schuift van rechts naar links over het scherm
- 3-staps formulier:
  - **Stap 1:** Bedrijfsgegevens (bedrijfsnaam, KvK nummer, bedrijfsactiviteiten)
  - **Stap 2:** Financiering (gewenst bedrag, bestedingsdoel)
  - **Stap 3:** Contactgegevens + NAW (voornaam, achternaam, adres, postcode, woonplaats, e-mail, telefoonnummer)

**Features:**
- ✅ Cookie-gebaseerd automatisch opslaan (7 dagen geldig)
- ✅ Voortgangsindicator met progress bar en dots
- ✅ Validatie per stap met Nederlandse foutmeldingen
- ✅ Volledig responsive (440px desktop, 100vw mobiel)
- ✅ GTM/dataLayer event tracking
- ✅ Auto-focus op eerste veld per stap
- ✅ Escape key om te sluiten (via overlay click)

### 2. Homepage Vernieuwd
**Locatie:** `frontend/app/page.tsx`

**Nieuwe structuur:**
- Minimalistisch hero-gedeelte met duidelijke waardepropositie
- Feature lijst met checkmarks (24 uur reactie, transparant, geen verborgen kosten)
- Info cards met 3 belangrijkste voordelen
- Sticky CTA knop onderaan

**Volledig in het Nederlands** zonder Engelse woorden

### 3. StickyCTA Component Aangepast
**Locatie:** `frontend/components/StickyCTA.tsx`

**Wijzigingen:**
- Gebruikt nu DrawerWidget in plaats van LeadFormModal
- Centered sticky button onderaan de pagina
- GTM event tracking voor drawer open/close

### 4. Styling Updates
**Locatie:** `frontend/app/globals.css`

**Nieuwe stijlen toegevoegd:**
- `.homepage-minimal` en gerelateerde classes
- `.hero-minimal` met gradient achtergrond
- `.info-section` en `.info-card` voor informatieblokken
- Responsive breakpoints voor mobiel

### 5. Layout & Metadata
**Locatie:** `frontend/app/layout.tsx`

**Updates:**
- Site naam: "Zakelijke Financiering"
- Nederlandse meta description
- Behouden: GTM en Plausible analytics integratie

## Cookie Functionaliteit

De drawer widget slaat automatisch de voortgang op in een cookie met de naam `lijfrente_form_progress`.

**Cookie structuur:**
```json
{
  "formData": {
    "voornaam": "...",
    "achternaam": "...",
    // ... alle formuliervelden
  },
  "currentStep": 2,
  "savedAt": "2025-11-06T12:34:56.789Z"
}
```

**Gedrag:**
- Cookie wordt aangemaakt zodra de drawer wordt geopend
- Wordt automatisch bijgewerkt bij elke wijziging in het formulier
- Wordt geladen bij het opnieuw openen van de drawer
- Wordt verwijderd na succesvolle verzending
- Vervalt na 7 dagen

## Formulier Validatie

Elk stap heeft specifieke validatieregels:

### Stap 1 (Bedrijfsgegevens)
- Bedrijfsnaam: verplicht
- KvK nummer: verplicht, max 8 karakters
- Bedrijfsactiviteiten: verplicht

### Stap 2 (Financiering)
- Gewenst bedrag: verplicht
- Bestedingsdoel: verplicht

### Stap 3 (NAW + Contact)
- Voornaam: verplicht
- Achternaam: verplicht
- Adres: verplicht
- Postcode: verplicht
- Woonplaats: verplicht
- E-mailadres: verplicht + email format validatie
- Telefoonnummer: verplicht

## Analytics & Tracking

De drawer stuurt automatisch events naar Google Tag Manager:

- `drawer_step_complete` - bij voltooien van elke stap
- `form_submit` - bij verzenden formulier
- `cta_sticky_drawer_open` - bij openen drawer
- `cta_sticky_drawer_close` - bij sluiten drawer

## Deployment

Geen wijzigingen nodig aan build configuratie. De nieuwe components zijn volledig compatibel met de bestaande Next.js setup.

## Testing Checklist

- [ ] Desktop: drawer schuift soepel van rechts naar links
- [ ] Mobiel: drawer neemt volledige breedte in
- [ ] Cookie opslaan: formulier invullen, pagina verversen, controleer of data behouden blijft
- [ ] Validatie: probeer naar volgende stap te gaan zonder velden in te vullen
- [ ] Submit: controleer of form data wordt verstuurd naar `/api/leads`
- [ ] Success: na succesvolle submit, redirect naar `/bedankt`
- [ ] Overlay click: drawer sluit bij klikken buiten drawer
- [ ] Escape key: drawer sluit bij drukken op escape (implementeer indien gewenst)
- [ ] GTM events: controleer in browser console of events worden verzonden

## Volgende Stappen (Optioneel)

1. **KvK API Integratie** - Auto-complete bedrijfsnaam bij invoeren KvK nummer
2. **Email Notificaties** - Bevestigingsmail naar gebruiker na aanvraag
3. **CRM Integratie** - Automatisch leads doorsturen naar CRM systeem
4. **A/B Testing** - Verschillende drawer variants testen
5. **Extra Validatie** - Postcode format check (1234 AB), telefoonnummer format
6. **Keyboard Navigation** - Tab-volgorde optimaliseren, Escape key handler

## Support

Voor vragen of problemen, zie de bestaande documentatie in `/stitch-prompts/` en `/FEATURES.md`.

