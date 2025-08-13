#!/usr/bin/env python3
import os
import re
import sys
import json
import glob
import time
import urllib.parse
from typing import List, Dict
import requests


def slugify(text: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"[^a-z0-9\-_.~ ]+", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:80] or "pagina"


def read_md_first_lines(path: str, max_chars: int = 2000) -> Dict[str, str]:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        return {"title": os.path.basename(path), "body": ""}

    # Title from first non-empty line or markdown heading
    title = None
    for line in content.splitlines():
        t = line.strip().lstrip("# ").strip()
        if t:
            title = t
            break
    if not title:
        title = os.path.splitext(os.path.basename(path))[0]

    body = content.strip()
    if len(body) > max_chars:
        body = body[: max_chars] + "\n\n..."
    return {"title": title, "body": body}


def ensure_page(session: requests.Session, base: str, token: str, site_id: str, title: str, body: str) -> bool:
    slug = slugify(title)
    # Check existing by slug+siteId
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
    if data:
        # Update existing with CTA and refreshed body
        page = data[0]
        page_id = page.get("id")
        payload_upd = {
            "data": {
                "title": title,
                "body": body,
                "primaryCtaLabel": "Vraag lijfrente‑offerte aan",
                "primaryCtaHref": f"/sites/{site_id}/lijfrente",
            }
        }
        r2 = session.put(f"{base}/api/pages/{page_id}", json=payload_upd, headers={"Authorization": f"Bearer {token}"})
        return r2.ok

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
    r = session.post(f"{base}/api/pages", json=payload, headers={"Authorization": f"Bearer {token}"})
    try:
        ok = r.ok and r.json().get("data", {}).get("id") is not None
    except Exception:
        ok = False
    return ok


def main() -> int:
    base = os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN")
    site_id = os.environ.get("SITE_ID", "demo")
    root = os.environ.get("SCRAPED_ROOT", "_scraped_sites")

    if not base or not token:
        print("Set STRAPI_URL and STRAPI_TOKEN env vars", file=sys.stderr)
        return 1

    # Pick top-level competitor markdown files only to avoid flooding
    paths = glob.glob(os.path.join(root, "*.md"))
    # De-duplicate and limit
    paths = sorted(paths)[:20]
    session = requests.Session()

    created = 0
    for p in paths:
        meta = read_md_first_lines(p, max_chars=2000)
        if not meta["title"]:
            continue
        ok = ensure_page(session, base, token, site_id, meta["title"], meta["body"])
        if ok:
            created += 1
            print(f"Created page: {meta['title']}")
        time.sleep(0.1)

    print(f"Done. Created {created} pages for siteId={site_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


