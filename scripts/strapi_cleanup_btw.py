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

    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})

    # Delete pages where slug starts with 'btw' or equals known entries
    page_params = {
        "filters[siteId][$eq]": site,
        "filters[$or][0][slug][$startsWith]": "btw",
        "filters[$or][1][slug][$eq]": "aangifte-omzetbelasting-wat-is-dat",
        "pagination[pageSize]": 100,
    }
    pages = fetch_all(session, base, "/api/pages", page_params)
    page_ids = [p.get("id") for p in pages if p.get("id")]
    if page_ids:
        print(f"Deleting {len(page_ids)} BTW pages…")
        n = delete_ids(session, base, "/api/pages", page_ids)
        print(f"Deleted {n} pages")
    else:
        print("No BTW pages found")

    # Delete nav items labelled 'BTW' or href starting with /btw
    nav_params = {
        "filters[siteId][$eq]": site,
        "filters[$or][0][label][$eq]": "BTW",
        "filters[$or][1][href][$startsWith]": "/btw",
        "pagination[pageSize]": 100,
        "sort": "order:asc",
    }
    navs = fetch_all(session, base, "/api/navigation-items", nav_params)
    nav_ids = [n.get("id") for n in navs if n.get("id")]
    if nav_ids:
        print(f"Deleting {len(nav_ids)} BTW nav items…")
        n = delete_ids(session, base, "/api/navigation-items", nav_ids)
        print(f"Deleted {n} nav items")
    else:
        print("No BTW nav items found")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())


