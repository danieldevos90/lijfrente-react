# 🔄 Project Hernoemen naar GeldGeregeld

## Nieuwe Naam: **GeldGeregeld** (geldgeregeld.nl)

**Betekenis:** Direct en duidelijk - "Geld Geregeld"  
**Voordelen:**
- ✅ Professioneler dan "ZapLening"
- ✅ Direct als domeinnaam (geldgeregeld.nl)
- ✅ Duidelijke waardepropositie
- ✅ Makkelijk te onthouden
- ✅ SEO-vriendelijk

---

## ✅ Code Updates (Voltooid)

Alle code is bijgewerkt:
- ✅ Logo component: "GeldGeregeld"
- ✅ Page titles en metadata
- ✅ CSS classes: `.geldgeregeld-logo`
- ✅ Theme comments
- ✅ Homepage headline

---

## 📁 Lokale Folder Hernoemen

### Stap 1: Sluit Cursor en Stop Development Server
```bash
# Stop de development server (Ctrl+C als die nog draait)
```

### Stap 2: Hernoem de Folder
```bash
cd "/Users/danieldevos/Documents/ALT F AWESOME"
mv "lijfrente-react" "geldgeregeld"
```

### Stap 3: Open in Cursor
```bash
cd geldgeregeld
cursor .
```

Of gebruik Finder:
1. Ga naar `/Users/danieldevos/Documents/ALT F AWESOME/`
2. Hernoem `lijfrente-react` naar `geldgeregeld`
3. Open de nieuwe folder in Cursor

---

## 🐙 GitHub Repository Hernoemen

### Optie A: Via GitHub Website (Makkelijkst)

1. Ga naar je repository: `https://github.com/YOUR_USERNAME/lijfrente-react`
2. Klik op **Settings** (rechtsboven)
3. Scroll naar **Repository name**
4. Verander naar: `geldgeregeld`
5. Klik **Rename**

GitHub redirect automatisch oude links!

### Optie B: Via Terminal

```bash
# In je lokale geldgeregeld folder
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/geldgeregeld

# Update remote URL (na GitHub rename)
git remote set-url origin git@github.com:YOUR_USERNAME/geldgeregeld.git

# Of met HTTPS:
git remote set-url origin https://github.com/YOUR_USERNAME/geldgeregeld.git

# Verifieer
git remote -v
```

---

## ☁️ Vercel Configuratie

### Stap 1: Domeinnaam Toevoegen

1. Ga naar [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecteer je project
3. Ga naar **Settings** → **Domains**
4. Klik **Add Domain**
5. Voer in: `geldgeregeld.nl`
6. Klik **Add**

### Stap 2: DNS Configuratie

Vercel geeft je DNS records. Bij je domain registrar (bijv. TransIP):

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record (voor www):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Stap 3: Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SITE_NAME=GeldGeregeld
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=geldgeregeld.nl

# Als je custom domain hebt:
NEXT_PUBLIC_BASE_URL=https://geldgeregeld.nl
```

### Stap 4: Project Naam (Optioneel)

Vercel Settings → General → Project Name:
- Verander naar: `geldgeregeld`

---

## 🔧 Package.json Update (Optioneel)

```bash
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/geldgeregeld/frontend
```

Update `package.json`:
```json
{
  "name": "geldgeregeld-frontend",
  "version": "1.0.0",
  "description": "GeldGeregeld - Zakelijke Financiering"
}
```

En in `cms/package.json`:
```json
{
  "name": "geldgeregeld-cms",
  "version": "1.0.0",
  "description": "GeldGeregeld CMS (Strapi)"
}
```

---

## 📋 Checklist

### Lokaal
- [ ] Development server gestopt
- [ ] Folder hernoemd: `lijfrente-react` → `geldgeregeld`
- [ ] Project heropend in Cursor
- [ ] `npm run dev` test in nieuwe folder

### Code (Voltooid)
- [x] Logo component updated
- [x] Metadata updated
- [x] CSS classes updated
- [x] Theme comments updated

### GitHub
- [ ] Repository hernoemd via Settings
- [ ] Remote URL bijgewerkt in git
- [ ] Test: `git remote -v`
- [ ] Test push: `git push origin main`

### Vercel
- [ ] Domain toegevoegd: `geldgeregeld.nl`
- [ ] DNS geconfigureerd bij registrar
- [ ] Environment variables updated
- [ ] SSL certificaat actief (automatisch na DNS)
- [ ] Project naam updated (optioneel)

### Testing
- [ ] Website werkt op: `https://geldgeregeld.nl`
- [ ] www redirect werkt: `https://www.geldgeregeld.nl`
- [ ] Logo toont "GeldGeregeld"
- [ ] Page title: "GeldGeregeld - Zakelijke Financiering"

---

## 🚀 Deployment Workflow

Na alle updates:

```bash
# In lokale geldgeregeld folder
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/geldgeregeld

# Check status
git status

# Commit updates
git add .
git commit -m "Rebrand to GeldGeregeld"

# Push naar GitHub (automatisch deploy naar Vercel)
git push origin main
```

Vercel deploy automatisch naar:
- `https://geldgeregeld.vercel.app` (preview)
- `https://geldgeregeld.nl` (production, na DNS)

---

## 📝 DNS Propagatie

⏱️ **Let op:** DNS wijzigingen kunnen 1-48 uur duren

Check status:
```bash
# Check DNS
dig geldgeregeld.nl

# Of via website
https://www.whatsmydns.net/#A/geldgeregeld.nl
```

Zodra DNS actief is:
- ✅ SSL certificaat wordt automatisch aangemaakt
- ✅ Website is live op geldgeregeld.nl
- ✅ www. redirect werkt

---

## 🎯 URLs na Migratie

| Omgeving | Oude URL | Nieuwe URL |
|----------|----------|------------|
| **Development** | localhost:3000 | localhost:3000 |
| **Vercel Preview** | lijfrente-react.vercel.app | geldgeregeld.vercel.app |
| **Production** | - | **geldgeregeld.nl** |
| **GitHub** | github.com/.../lijfrente-react | github.com/.../geldgeregeld |

---

## ❓ Troubleshooting

### Git Remote Error
```bash
# Als je git push error krijgt:
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/geldgeregeld.git
git push -u origin main
```

### Vercel Deploy Issues
1. Check Vercel logs: Dashboard → Project → Deployments
2. Verify environment variables
3. Re-deploy: `git commit --allow-empty -m "trigger deploy"`

### DNS Niet Werkend
- Wacht 1-24 uur voor propagatie
- Check nameservers bij registrar
- Gebruik Vercel's automatic SSL (niet external)

---

## 💡 Volgende Stappen

Na succesvolle migratie:
1. ✅ Test alle functionaliteit
2. ✅ Update documentatie references
3. ✅ Update social media links
4. ✅ Update Google Search Console
5. ✅ Setup Google Analytics voor nieuwe domain

---

**Status:** Wachtend op gebruiker om stappen uit te voeren  
**Nieuwe Naam:** **GeldGeregeld** 💚  
**Domain:** geldgeregeld.nl

