# Stitch Prompt: Lead Form Modal - Step 5 (Contact Information)

## Screen Overview
Step 5 collecting personal contact details with a two-column layout for name fields.

## Design System
(Same as previous modals)

### Colors
- Brand: `#000000`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Light Gray BG: `#f8fafc`

---

## Modal Structure
(Same container, overlay, and header as previous steps)

---

## Form Progress Header

**Progress Fill**: 83.33% (5 of 6 steps)

**Step Indicator**: "Stap 5 van 6"

---

## Form Body (Step 5 Content)

**Container Padding**: 3rem 2rem (48px 32px)

**Heading (H2)**
- Text: "Hoe kunnen we u bereiken?"
- Font size: 28px
- Weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 0.5rem

**Description**
- Text: "We nemen binnen 24 uur contact met u op"
- Font size: 16px
- Color: `#64748B`
- Text-align: center
- Margin bottom: 2rem

---

### Form Fields Container

**Layout**
- Display: flex column
- Gap: 1.5rem (24px)

---

### Field Row (Two Column Layout)

**Container**
- Display: grid
- Grid-template-columns: 1fr 1fr
- Gap: 1rem (16px)

**Field Group 1: Voornaam**

Label:
- Text: "Voornaam *"
- Font size: 16px
- Font weight: 600
- Margin bottom: 0.5rem

Input:
- Placeholder: "Uw voornaam"
- Value: "Jan" (show as filled)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Focus border: `#000000`

**Field Group 2: Achternaam**

Label:
- Text: "Achternaam *"
- Font size: 16px
- Font weight: 600
- Margin bottom: 0.5rem

Input:
- Placeholder: "Uw achternaam"
- Value: "de Vries" (show as filled)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Focus border: `#000000`

---

### Field Group 3: E-mailadres (Full Width)

**Label**
- Text: "E-mailadres *"
- Font size: 16px
- Font weight: 600
- Margin bottom: 0.5rem

**Input**
- Type: email
- Placeholder: "uw@email.nl"
- Value: "jan@bakkerijjansen.nl" (show as filled)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Width: 100%
- Focus border: `#000000`

---

### Field Group 4: Telefoonnummer (Full Width)

**Label**
- Text: "Telefoonnummer *"
- Font size: 16px
- Font weight: 600
- Margin bottom: 0.5rem

**Input**
- Type: tel
- Placeholder: "06 - 12 34 56 78"
- Value: "06 - 12 34 56 78" (show as filled)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Width: 100%
- Focus border: `#000000`

---

## Form Footer

**Navigation Buttons**
- Display: flex
- Justify-content: space-between

**Back Button** (Left)
- Text: "← Vorige"
- Background: White
- Color: `#0F172A`
- Border: 2px solid `#E2E8F0`
- Padding: 1rem 2rem
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Display: flex, align-items center, gap 8px

**Next Button** (Right)
- Text: "Volgende →"
- Background: `#000000`
- Color: White
- Padding: 1rem 2rem
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Display: flex, align-items center, gap 8px

**Trust Indicators**
- "🔒 100% veilig"
- "⚡ Binnen 24 uur reactie"
- "📞 Gratis adviesgesprek"

---

## Notes for Stitch
- First row has two fields side-by-side (Voornaam + Achternaam)
- Email and phone fields are full-width below
- All fields shown as filled with example data
- Consistent input field styling across all fields
- 1.5rem vertical spacing between field groups
- All fields marked with * are required
- Clean, professional form layout
- Grid layout for name fields creates visual balance


