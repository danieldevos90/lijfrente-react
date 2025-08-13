#!/usr/bin/env python3
import os
import re
import sys
import requests
from typing import Dict


def slugify(text: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"[^a-z0-9\-_.~ ]+", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:80] or "pagina"


def upsert_page(session: requests.Session, base: str, token: str, site_id: str, title: str, body: str, cta_label: str, cta_href: str) -> bool:
    slug = slugify(title)
    params = {
        "filters[siteId][$eq]": site_id,
        "filters[slug][$eq]": slug,
        "pagination[pageSize]": 1,
    }
    r = session.get(f"{base}/api/pages", params=params, headers={"Authorization": f"Bearer {token}"})
    try:
        data = r.json().get("data", [])
    except Exception:
        data = []
    payload = {
        "data": {
            "siteId": site_id,
            "title": title,
            "slug": slug,
            "body": body,
            "primaryCtaLabel": cta_label,
            "primaryCtaHref": cta_href,
        }
    }
    if data:
        page_id = data[0].get("id")
        r2 = session.put(f"{base}/api/pages/{page_id}", json=payload, headers={"Authorization": f"Bearer {token}"})
        return r2.ok
    else:
        r2 = session.post(f"{base}/api/pages", json=payload, headers={"Authorization": f"Bearer {token}"})
        return r2.ok


def main() -> int:
    base = os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN")
    site_id = os.environ.get("SITE_ID", "demo")
    if not base or not token:
        print("Set STRAPI_URL and STRAPI_TOKEN", file=sys.stderr)
        return 1

    session = requests.Session()

    pages: Dict[str, str] = {
        "Zakelijke financiering": (
            "Overzicht van corporate en MKB financieringsoplossingen.\n\n"
            "- Wanneer kies je voor lening/werkkapitaal/factoring.\n"
            "- Indicatieve voorwaarden en doorlooptijd.\n\n"
            "Vraag nu financiering aan, we reageren binnen 24 uur."
        ),
        "Corporate financing": (
            "Maatwerk financiering voor grotere ondernemingen.\n\n"
            "- Structuren: termijnlening, RC, asset‑based, mezzanine.\n"
            "- KPI’s en documentatie.\n\n"
            "Plan een intake en ontvang een voorstel."
        ),
        "Small business financing": (
            "Snelle, transparante financiering voor kleine bedrijven.\n\n"
            "- Gebruik: voorraad, personeel, marketing, machines.\n"
            "- Eenvoudige aanvraag, snelle beoordeling.\n\n"
            "Start je aanvraag, zonder verplichtingen."
        ),
        "Werkkapitaal": (
            "Vergroot je liquiditeit met flexibel werkkapitaal.\n\n"
            "- Doelen: groei, seizoenen, betaaltermijnen.\n"
            "- Alternatieven: factoring, limietverhoging.\n\n"
            "Vraag direct financiering aan."
        ),
        "Veelgestelde vragen": (
            "Antwoorden op vragen over zakelijke financiering.\n\n"
            "- Hoe snel hoor ik wat? (binnen 24u)\n"
            "- Welke documenten? (alleen wat nodig is)\n"
            "- Kan ik tussentijds aflossen? (afhankelijk van product)\n\n"
            "Nog vragen? Start je aanvraag, we helpen je verder."
        ),
    }

    created = 0
    for title, body in pages.items():
        ok = upsert_page(
            session,
            base,
            token,
            site_id,
            title,
            body,
            cta_label="Vraag financiering aan",
            cta_href=f"/sites/{site_id}/lead",
        )
        if ok:
            created += 1
            print(f"Upserted: {title}")

    print(f"Done. Upserted {created} pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


