#!/usr/bin/env python3
import os
import re
import sys
import glob
import requests
from typing import List, Dict


def slugify(text: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"[^a-z0-9\-_.~ ]+", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:80] or "pagina"


def collect_markdown(root: str) -> List[str]:
    # Pick analysis markdowns (reports, briefs) for richer articles
    patterns = [
        os.path.join(root, "trafilatura/_analysis/**/*.md"),
        os.path.join(root, "trafilatura/_analysis/**/*.txt"),
    ]
    paths: List[str] = []
    for pat in patterns:
        paths.extend(glob.glob(pat, recursive=True))
    # Deduplicate and limit to avoid flooding
    uniq = []
    seen = set()
    for p in sorted(paths):
        if p not in seen:
            seen.add(p)
            uniq.append(p)
    return uniq[:50]


def read_file(path: str, max_chars: int = 4000) -> Dict[str, str]:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        return {"title": os.path.basename(path), "body": ""}
    title = os.path.splitext(os.path.basename(path))[0].replace("_", " ")
    body = content.strip()
    if len(body) > max_chars:
        body = body[: max_chars] + "\n\n..."
    return {"title": title, "body": body}


def upsert_page(session: requests.Session, base: str, token: str, site_id: str, title: str, body: str) -> bool:
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
            "primaryCtaLabel": "Vraag lijfrente‑offerte aan",
            "primaryCtaHref": f"/sites/{site_id}/lijfrente",
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
    root = os.environ.get("SCRAPED_ROOT", "_scraped_sites")
    if not base or not token:
        print("Set STRAPI_URL and STRAPI_TOKEN", file=sys.stderr)
        return 1
    files = collect_markdown(root)
    session = requests.Session()
    created = 0
    for p in files:
        meta = read_file(p)
        if not meta["title"]:
            continue
        if upsert_page(session, base, token, site_id, meta["title"], meta["body"]):
            created += 1
            print(f"Upserted: {p}")
    print(f"Done. Upserted {created} analysis pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


