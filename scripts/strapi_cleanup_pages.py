#!/usr/bin/env python3
import os
import sys
import requests


def fetch_all(session: requests.Session, base: str, path: str, params: dict) -> list:
    r = session.get(f"{base}{path}", params=params)
    try:
        j = r.json()
    except Exception:
        print(f"Non-JSON response from {path}: status={r.status_code} body={r.text[:200]}", file=sys.stderr)
        return []
    return j.get("data", []) if isinstance(j, dict) else []


def delete_ids(session: requests.Session, base: str, path: str, ids: list[int]) -> int:
    deleted = 0
    for _id in ids:
        rr = session.delete(f"{base}{path}/{_id}")
        if rr.ok:
            deleted += 1
        else:
            print(f"Failed to delete {path}/{_id}: {rr.status_code} {rr.text[:200]}", file=sys.stderr)
    return deleted


def main() -> int:
    base = os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN")
    site = os.environ.get("SITE_ID", "demo")
    if not base or not token:
        print("Set STRAPI_URL and STRAPI_TOKEN", file=sys.stderr)
        return 1

    keep_slugs = set((os.environ.get("KEEP_SLUGS") or "home").split(","))

    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})

    # Fetch all pages for site
    pages = fetch_all(session, base, "/api/pages", {
        "filters[siteId][$eq]": site,
        "pagination[pageSize]": 200,
        "sort": "title:asc",
    })
    delete_page_ids = []
    for p in pages:
        slug = (p.get("slug") or "").strip().lower()
        if slug not in keep_slugs:
            delete_page_ids.append(p.get("id"))

    if delete_page_ids:
        print(f"Deleting {len(delete_page_ids)} pages for siteId={site}…")
        n = delete_ids(session, base, "/api/pages", [i for i in delete_page_ids if i])
        print(f"Deleted {n} pages")
    else:
        print("No pages to delete (after keep filter)")

    # Clean navigation to only keep a minimal set
    nav = fetch_all(session, base, "/api/navigation-items", {
        "filters[siteId][$eq]": site,
        "pagination[pageSize]": 200,
        "sort": "order:asc",
    })
    keep_labels = {"Home", "Aanvraag"}
    del_nav_ids = [n.get("id") for n in nav if (n.get("label") or n.get("attributes", {}).get("label") or "") not in keep_labels]
    if del_nav_ids:
        print(f"Deleting {len(del_nav_ids)} nav items…")
        n = delete_ids(session, base, "/api/navigation-items", [i for i in del_nav_ids if i])
        print(f"Deleted {n} nav items")
    else:
        print("No extra nav items to delete")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())


