#!/usr/bin/env python3
import csv
import os
import re
from typing import Dict, List, Tuple


PUBLICATION_PLAN_DIR = "_scraped_sites/trafilatura/_analysis/serp/publication_plan"
UX_OUT_DIR = "_scraped_sites/trafilatura/_analysis/ux"


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def read_publication_plan(dir_path: str) -> Dict[str, List[Tuple[str, int]]]:
    """Reads all top_*.csv files and returns {hub: [(keyword, priority), ...]}.

    Each CSV must have headers: hub,keyword,priority_score
    """
    hub_to_items: Dict[str, List[Tuple[str, int]]] = {}
    for filename in os.listdir(dir_path):
        if not (filename.startswith("top_") and filename.endswith(".csv")):
            continue
        path = os.path.join(dir_path, filename)
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                hub = (row.get("hub") or "").strip().lower()
                keyword = (row.get("keyword") or "").strip()
                prio_s = (row.get("priority_score") or "0").strip()
                if not hub or not keyword:
                    continue
                try:
                    prio = int(float(prio_s))
                except Exception:
                    prio = 0
                hub_to_items.setdefault(hub, []).append((keyword, prio))
    # Deduplicate within hubs by keyword, keeping highest priority
    for hub, items in list(hub_to_items.items()):
        best: Dict[str, int] = {}
        for kw, pr in items:
            if kw not in best or pr > best[kw]:
                best[kw] = pr
        hub_to_items[hub] = sorted(((kw, best[kw]) for kw in best), key=lambda x: x[1], reverse=True)
    return hub_to_items


_DIACRITICS = str.maketrans(
    {
        "ä": "a",
        "á": "a",
        "à": "a",
        "â": "a",
        "ã": "a",
        "å": "a",
        "ë": "e",
        "é": "e",
        "è": "e",
        "ê": "e",
        "ï": "i",
        "í": "i",
        "ì": "i",
        "î": "i",
        "ö": "o",
        "ó": "o",
        "ò": "o",
        "ô": "o",
        "õ": "o",
        "ü": "u",
        "ú": "u",
        "ù": "u",
        "û": "u",
        "ç": "c",
        "ñ": "n",
        "ß": "ss",
    }
)


def slugify(text: str) -> str:
    text = (text or "").lower().translate(_DIACRITICS)
    # Replace non letter/digit with hyphen
    text = re.sub(r"[^a-z0-9]+", "-", text)
    # Collapse multiple hyphens
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "pagina"


def hub_to_basepath(hub: str) -> str:
    hub = (hub or "").lower()
    return f"/{hub}"


def build_routes(hub_to_items: Dict[str, List[Tuple[str, int]]], limit_per_hub: int = 50) -> List[Dict[str, str]]:
    routes: List[Dict[str, str]] = []
    for hub, items in hub_to_items.items():
        base = hub_to_basepath(hub)
        count = 0
        for keyword, prio in items:
            if limit_per_hub and count >= limit_per_hub:
                break
            slug = slugify(keyword)
            path = f"{base}/{slug}"
            routes.append({
                "hub": hub,
                "keyword": keyword,
                "path": path,
                "priority_score": str(prio),
            })
            count += 1
    return routes


def write_routes_csv(routes: List[Dict[str, str]], out_path: str) -> None:
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["hub", "keyword", "path", "priority_score"])
        w.writeheader()
        w.writerows(routes)


def write_sitemap_txt(routes: List[Dict[str, str]], out_path: str) -> None:
    with open(out_path, "w", encoding="utf-8") as f:
        for r in routes:
            f.write(r["path"] + "\n")


def write_sitemap_md(hub_to_items: Dict[str, List[Tuple[str, int]]], routes: List[Dict[str, str]], out_path: str) -> None:
    # Index routes by (hub, keyword)
    index: Dict[Tuple[str, str], str] = {}
    for r in routes:
        index[(r["hub"], r["keyword"])] = r["path"]

    lines: List[str] = []
    lines.append("### Sitemap (Informatie-architectuur)\n")
    lines.append("- **Home**: `/`\n")
    for hub in sorted(hub_to_items.keys()):
        lines.append(f"- **{hub.capitalize()}**: `{hub_to_basepath(hub)}/`\n")
        for keyword, prio in hub_to_items[hub][:30]:
            path = index.get((hub, keyword), hub_to_basepath(hub))
            lines.append(f"  - {keyword} — `{path}` (prio {prio})\n")

    with open(out_path, "w", encoding="utf-8") as f:
        f.writelines(lines)


def write_ux_plan_md(hub_to_items: Dict[str, List[Tuple[str, int]]], out_path: str) -> None:
    lines: List[str] = []
    lines.append("### UX-plan (NL)\n\n")
    lines.append("- **Doel**: Content- en productflows die zoekintentie direct bedienen en conversie naar lead aanvragen maximaliseren.\n")
    lines.append("- **Primaire secties (hubs)**: " + ", ".join(sorted(h.capitalize() for h in hub_to_items.keys())) + "\n\n")

    lines.append("### Doelgroepen en taken\n")
    lines.append("- **MKB-ondernemer**: wil snel antwoord (btw, rente), tools (calculators), en een financieringsoplossing.\n")
    lines.append("- **Financieel verantwoordelijke**: zoekt beleidsinfo, voorwaarden, en vergelijkingen.\n")
    lines.append("- **Oriënterende bezoeker**: wil basisuitleg en vervolgstappen.\n\n")

    lines.append("### Navigatie & IA\n")
    lines.append("- **Hoofdnavigatie**: BTW, Rente, Calculators, Werkkapitaal, Factoring, Liquiditeit, Blog.\n")
    lines.append("- **Secundaire navigatie**: Over ons, Contact, Tarieven, Veelgestelde vragen.\n")
    lines.append("- **Zoekfunctie**: prominente globale zoekbalk (autocomplete op topics/tools).\n\n")

    lines.append("### Pagina-templates\n")
    lines.append("- **Hub-pagina**: hero + categorie-navigatie, highlights, CTA naar product.\n")
    lines.append("- **Artikel/Guides**: titel, introductie, inhoudsopgave, H2-secties, FAQ, gerelateerde links, duidelijke volgende stap (CTA).\n")
    lines.append("- **Calculator**: invoervelden, resultatenkaart, toelichting, CTA naar product/advies.\n")
    lines.append("- **Productpagina (zakelijke lening / kredietlijn)**: bewijs (reviews/keurmerken), USP’s, tarieven, voorwaarden, stappenplan, FAQ, krachtige CTA.\n\n")

    lines.append("### Componenten\n")
    lines.append("- Header, Breadcrumbs, TOC, On-page nav, Related content, Sticky CTA, Footer.\n")
    lines.append("- Kaartenrijen voor hubs en topics; callouts voor belangrijke definities en wettelijke waarschuwingen.\n\n")

    lines.append("### SEO & Interne linking\n")
    lines.append("- Interne linking hub → subtopics; artikels onderling via ‘gerelateerd’ op basis van hub.\n")
    lines.append("- Structured data: `Article`, `FAQPage`, `BreadcrumbList`, `Product`.\n")
    lines.append("- URL’s: `/hub/slug`; duidelijke H1/H2, snippet-optimale meta’s.\n\n")

    lines.append("### Toegankelijkheid & Performance\n")
    lines.append("- WCAG 2.1 AA, toetsenbordnavigatie, voldoende contrast, focus states.\n")
    lines.append("- Core Web Vitals: lazy-load media, CSS-only voor iconen waar mogelijk, server-side rendering.\n\n")

    lines.append("### Design system & techniek\n")
    lines.append("- Next.js + Tailwind CSS (PostCSS met `@tailwindcss/postcss`), component-gebaseerd design system.\n")
    lines.append("- UI tokens voor spacing, kleuren, typografie; semantische varianten voor CTA’s.\n\n")

    lines.append("### Content governance\n")
    lines.append("- Definition of Done: bijgewerkte datum, interne links, FAQ, CTA, check op SERP intent.\n")
    lines.append("- Redactionele workflow met SEO check en juridische review voor btw/rente.\n\n")

    lines.append("### KPI’s\n")
    lines.append("- CTR vanuit organisch, scroll depth, CTA clicks, leads, converterende hubs.\n\n")

    with open(out_path, "w", encoding="utf-8") as f:
        f.writelines(lines)


def main() -> int:
    ensure_dir(UX_OUT_DIR)
    hub_to_items = read_publication_plan(PUBLICATION_PLAN_DIR)
    routes = build_routes(hub_to_items, limit_per_hub=50)

    write_routes_csv(routes, os.path.join(UX_OUT_DIR, "routes.csv"))
    write_sitemap_txt(routes, os.path.join(UX_OUT_DIR, "sitemap.txt"))
    write_sitemap_md(hub_to_items, routes, os.path.join(UX_OUT_DIR, "sitemap.md"))
    write_ux_plan_md(hub_to_items, os.path.join(UX_OUT_DIR, "ux-plan.md"))

    print(f"Wrote UX plan and sitemaps to {UX_OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


