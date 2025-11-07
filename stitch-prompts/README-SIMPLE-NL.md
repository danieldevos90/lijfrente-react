# Stitch Prompts - Eenvoudige Widget (Nederlands)

## Overzicht
Minimale, 3-staps drawer widget voor zakelijke financiering. Alles in het Nederlands, geen Engelse woorden.

---

## Vereiste Informatie

De widget verzamelt alleen deze essentiële gegevens:

### Stap 1: Bedrijfsgegevens
- ✅ Bedrijfsnaam
- ✅ KvK-nummer
- ✅ Bedrijfsactiviteiten

### Stap 2: Financiering
- ✅ Gewenst bedrag
- ✅ Bestedingsdoel

### Stap 3: Contactgegevens
- ✅ NAW (Naam, Adres, Woonplaats)
- ✅ E-mailadres
- ✅ Telefoonnummer

**Totaal: 3 stappen, 8 velden**

---

## Bestandsstructuur

### Homepage
1. **SIMPLE-01-homepage.md** - Minimale landingspagina met sticky CTA

### Widget Drawer (3 Stappen)
2. **SIMPLE-02-drawer-stap-1.md** - Bedrijfsgegevens
3. **SIMPLE-03-drawer-stap-2.md** - Financiering
4. **SIMPLE-04-drawer-stap-3.md** - Contactgegevens (NAW + contact)

### Bevestiging
5. **SIMPLE-05-succes.md** - Succesbericht na verzenden

---

## Ontwerp Principes

### 1. Minimaal
- **Geen overbodige velden** - alleen wat nodig is
- **Schoon design** - veel witruimte
- **Dunne borders** - 1px in plaats van 2px
- **Subtiele schaduwen** - minder prominent
- **Geen gradients** - alleen solide kleuren

### 2. Nederlands
- **Alle tekst in Nederlands** - geen Engelse woorden
- **Nederlandse begrippen** - NAW, KvK, etc.
- **Nederlandse placeholders** - "Bijv. Bakkerij Jansen B.V."
- **Nederlandse opties** - "Werkkapitaal", "Voorraad inkopen"

### 3. Gebruiksvriendelijk
- **3 stappen** - overzichtelijk
- **Voortgang indicator** - dots met teller (1/3, 2/3, 3/3)
- **Auto-opslaan** - voortgang wordt bewaard
- **Duidelijke labels** - wat wordt er gevraagd
- **Helper teksten** - waar nodig extra uitleg

---

## Drawer Specificaties

### Desktop (≥ 768px)
```
┌──────────────┐
│ [×] Titel    │ ← Header
├──────────────┤
│ ● ● ○    1/3 │ ← Voortgang
├──────────────┤
│              │
│   Velden     │ ← Body (scrollbaar)
│              │
├──────────────┤
│ [Terug][>]   │ ← Footer
│ Auto-opslag  │
└──────────────┘
   440px breed
```

### Mobiel (< 768px)
- **Volledige breedte** - 100vw
- **Geen overlay** - neemt volledig scherm
- **Sticky header** - blijft bovenaan
- **Fixed footer** - blijft onderaan

---

## Kleurenpalet (Minimaal)

```css
Zwart:      #000000  /* Merkkleur, knoppen */
Donker:     #0F172A  /* Primaire tekst */
Grijs:      #64748B  /* Secundaire tekst */
Wit:        #FFFFFF  /* Achtergrond */
Rand:       #E2E8F0  /* Borders */
Lichtgrijs: #f8fafc  /* Accenten */
Groen:      #10b981  /* Succes, versturen knop */
```

**Slechts 7 kleuren** - minimale palette.

---

## Typografie (Eenvoudig)

```css
Grote titel:   24px  /* Stap titels */
Drawer titel:  20px  /* Header titel */
Tekst:         15px  /* Velden, knoppen */
Labels:        14px  /* Veld labels */
Klein:         12px  /* Auto-opslag, helper tekst */
```

---

## User Flow

```
Homepage met sticky CTA
    ↓
Klik "Aanvraag starten"
    ↓
Drawer schuift in van rechts
    ↓
Stap 1: Bedrijfsgegevens
    ↓ [Volgende]
Stap 2: Financiering
    ↓ [Volgende]
Stap 3: Contactgegevens (NAW)
    ↓ [Aanvraag versturen] (groene knop)
Succesmelding
    ↓ [Sluiten]
Drawer sluit
```

---

## Voortgang Opslaan

### Wat wordt opgeslagen:
- Alle ingevulde veldwaarden
- Huidige stap nummer
- Tijdstempel

### Waar:
- **Primair**: localStorage
- **Backup**: Cookie (7 dagen geldig)

### Wanneer:
- Bij elke veldwijziging (debounced 500ms)
- Bij stap navigatie
- Bij drawer sluiten

### Hervatten:
```
Gebruiker komt terug
    ↓
Drawer opent op laatste stap
    ↓
Velden zijn al ingevuld
    ↓
Kan direct doorgaan of opnieuw beginnen
```

---

## Bestedingsdoel Opties

In stap 2 (Financiering) - dropdown met deze opties:

1. Werkkapitaal
2. Voorraad inkopen
3. Machines en apparatuur
4. Personeel en groei
5. Bedrijfspand
6. Voertuigen
7. Marketing en ICT
8. Herfinanciering
9. Overig

**Allemaal in Nederlands**, geen Engelse termen.

---

## Veld Validatie

### Stap 1
- Bedrijfsnaam: verplicht, min 2 tekens
- KvK-nummer: verplicht, exact 8 cijfers
- Bedrijfsactiviteiten: verplicht, min 10 tekens

### Stap 2
- Gewenst bedrag: verplicht, tussen €10.000 - €500.000
- Bestedingsdoel: verplicht, selectie uit dropdown

### Stap 3
- Naam: verplicht, min 2 tekens
- Adres: verplicht
- Postcode: verplicht, Nederlands formaat (1234 AB)
- Woonplaats: verplicht
- E-mail: verplicht, geldig e-mailadres
- Telefoonnummer: verplicht, Nederlands nummer

---

## Implementatie Checklist

- [ ] Homepage met sticky CTA in Nederlands
- [ ] Drawer component (440px, rechts)
- [ ] 3 stappen met juiste velden
- [ ] Voortgang indicator (dots + teller)
- [ ] Auto-opslaan (localStorage + cookie)
- [ ] Validatie per stap
- [ ] Terug/Volgende navigatie
- [ ] Groene "Versturen" knop in stap 3
- [ ] Succesmelding in Nederlands
- [ ] Mobiel responsive (100vw)
- [ ] Geen Engelse teksten
- [ ] Focus states op velden
- [ ] Error berichten in Nederlands

---

## Verschillen met Eerdere Versie

| Feature | Eerder (6 stappen) | Nu (3 stappen) |
|---------|-------------------|----------------|
| Stappen | 6 | 3 |
| Velden | ~15 | 8 |
| Taal | Mixed EN/NL | 100% NL |
| Breedte | 480px | 440px |
| Voortgang | Progress bar | Dots |
| Bedrag | Grid knoppen | Input veld |
| Bedrijfstype | Icoon knoppen | - (verwijderd) |
| Urgentie | Radio knoppen | - (verwijderd) |
| Omzet | Dropdown | - (verwijderd) |

**50% minder velden** - sneller en eenvoudiger!

---

## Toegankelijkheid

- **Toetsenbord navigatie** - Tab, Shift+Tab, Enter, Esc
- **Focus indicators** - zichtbare focus states
- **ARIA labels** - screenreader ondersteuning
- **Error berichten** - duidelijk en in Nederlands
- **Touch targets** - min 44x44px op mobiel
- **Contrast** - voldoet aan WCAG AA
- **Labels** - elke input heeft een label

---

## Gebruik in Stitch

1. Open **SIMPLE-01-homepage.md** → Genereer homepage
2. Open **SIMPLE-02-drawer-stap-1.md** → Genereer stap 1
3. Open **SIMPLE-03-drawer-stap-2.md** → Genereer stap 2
4. Open **SIMPLE-04-drawer-stap-3.md** → Genereer stap 3
5. Open **SIMPLE-05-succes.md** → Genereer succesbericht

**5 schermen totaal** - snel en overzichtelijk!

---

## Nederlandse Termen Woordenlijst

- **NAW** = Naam, Adres, Woonplaats
- **KvK** = Kamer van Koophandel
- **BTW** = Belasting Toegevoegde Waarde
- **Werkkapitaal** = Working capital
- **Bestedingsdoel** = Purpose of funds
- **Aanvraag** = Application
- **Financiering** = Financing
- **Bedrijfsactiviteiten** = Business activities
- **Gewenst bedrag** = Desired amount

Gebruik alleen Nederlandse termen!




